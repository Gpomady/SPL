import { eq, and, ilike, desc, asc, sql } from 'drizzle-orm';
import { db, companies, legalObligations } from '../db';
import { CompanyCreateRequest, PaginationParams } from '../types';
import { NotFoundError, ConflictError } from '../middleware/errorHandler';
import { validateCNPJ, formatCNPJ } from '../utils/validation';

export class CompanyService {
  async create(userId: string, data: CompanyCreateRequest) {
    const cleanCnpj = data.cnpj.replace(/\D/g, '');
    
    if (!validateCNPJ(cleanCnpj)) {
      throw new ConflictError('CNPJ inválido');
    }

    const existing = await db.query.companies.findFirst({
      where: eq(companies.cnpj, cleanCnpj),
    });

    if (existing) {
      throw new ConflictError('CNPJ já cadastrado');
    }

    const riskLevel = this.calculateRiskLevel(data.cnaePrincipal, data.state);

    const [company] = await db
      .insert(companies)
      .values({
        userId,
        cnpj: cleanCnpj,
        razaoSocial: data.razaoSocial,
        nomeFantasia: data.nomeFantasia,
        email: data.email,
        phone: data.phone,
        state: data.state,
        city: data.city,
        address: data.address,
        cnaePrincipal: data.cnaePrincipal.replace(/\D/g, ''),
        cnaesSecundarios: data.cnaesSecundarios?.map(c => c.replace(/\D/g, '')) || [],
        riskLevel,
      })
      .returning();

    return this.formatCompany(company);
  }

  async findById(id: string, userId?: string) {
    const whereClause = userId 
      ? and(eq(companies.id, id), eq(companies.userId, userId))
      : eq(companies.id, id);

    const company = await db.query.companies.findFirst({
      where: whereClause,
      with: {
        obligations: true,
      },
    });

    if (!company) {
      throw new NotFoundError('Empresa');
    }

    return this.formatCompany(company);
  }

  async findByUser(userId: string, params: PaginationParams & { search?: string }) {
    const { page, limit, sortBy = 'createdAt', sortOrder = 'desc', search } = params;
    const offset = (page - 1) * limit;

    let whereClause = eq(companies.userId, userId);

    if (search) {
      whereClause = and(
        whereClause,
        sql`(${companies.razaoSocial} ILIKE ${`%${search}%`} OR ${companies.cnpj} LIKE ${`%${search.replace(/\D/g, '')}%`})`
      ) as any;
    }

    const [data, countResult] = await Promise.all([
      db.query.companies.findMany({
        where: whereClause,
        limit,
        offset,
        orderBy: sortOrder === 'asc' 
          ? asc(companies.createdAt)
          : desc(companies.createdAt),
      }),
      db.select({ count: sql<number>`count(*)` }).from(companies).where(whereClause),
    ]);

    const total = Number(countResult[0]?.count || 0);

    return {
      data: data.map(this.formatCompany),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async update(id: string, userId: string, data: Partial<CompanyCreateRequest>) {
    const existing = await db.query.companies.findFirst({
      where: and(eq(companies.id, id), eq(companies.userId, userId)),
    });

    if (!existing) {
      throw new NotFoundError('Empresa');
    }

    const updateData: any = { ...data, updatedAt: new Date() };

    if (data.cnpj) {
      const cleanCnpj = data.cnpj.replace(/\D/g, '');
      if (!validateCNPJ(cleanCnpj)) {
        throw new ConflictError('CNPJ inválido');
      }
      updateData.cnpj = cleanCnpj;
    }

    if (data.cnaePrincipal) {
      updateData.cnaePrincipal = data.cnaePrincipal.replace(/\D/g, '');
      updateData.riskLevel = this.calculateRiskLevel(updateData.cnaePrincipal, data.state || existing.state);
    }

    if (data.cnaesSecundarios) {
      updateData.cnaesSecundarios = data.cnaesSecundarios.map(c => c.replace(/\D/g, ''));
    }

    const [updated] = await db
      .update(companies)
      .set(updateData)
      .where(eq(companies.id, id))
      .returning();

    return this.formatCompany(updated);
  }

  async delete(id: string, userId: string) {
    const existing = await db.query.companies.findFirst({
      where: and(eq(companies.id, id), eq(companies.userId, userId)),
    });

    if (!existing) {
      throw new NotFoundError('Empresa');
    }

    await db.delete(companies).where(eq(companies.id, id));

    return { success: true };
  }

  async getStats(userId: string) {
    const userCompanies = await db.query.companies.findMany({
      where: eq(companies.userId, userId),
      with: {
        obligations: true,
      },
    });

    const totalCompanies = userCompanies.length;
    const totalObligations = userCompanies.reduce((sum, c) => sum + (c.obligations?.length || 0), 0);
    
    const riskDistribution = {
      low: userCompanies.filter(c => c.riskLevel === 'low').length,
      medium: userCompanies.filter(c => c.riskLevel === 'medium').length,
      high: userCompanies.filter(c => c.riskLevel === 'high').length,
      critical: userCompanies.filter(c => c.riskLevel === 'critical').length,
    };

    const obligationStatus = {
      pending: 0,
      inProgress: 0,
      completed: 0,
      overdue: 0,
    };

    userCompanies.forEach(company => {
      company.obligations?.forEach(ob => {
        if (ob.status === 'pending') obligationStatus.pending++;
        else if (ob.status === 'in_progress') obligationStatus.inProgress++;
        else if (ob.status === 'completed') obligationStatus.completed++;
        else if (ob.status === 'overdue') obligationStatus.overdue++;
      });
    });

    return {
      totalCompanies,
      totalObligations,
      riskDistribution,
      obligationStatus,
      complianceRate: totalObligations > 0 
        ? Math.round((obligationStatus.completed / totalObligations) * 100) 
        : 100,
    };
  }

  private calculateRiskLevel(cnae: string, state: string): string {
    const highRiskCnaes = ['0510', '0610', '1011', '2091', '3811', '3812', '3821', '3822'];
    const mediumRiskCnaes = ['1012', '1020', '1031', '2011', '2012', '2013'];
    
    const amazonStates = ['AM', 'PA', 'AC', 'RO', 'RR', 'AP', 'TO', 'MA', 'MT'];

    const cnaePrefix = cnae.substring(0, 4);
    
    let risk = 'low';
    
    if (highRiskCnaes.includes(cnaePrefix)) {
      risk = 'high';
    } else if (mediumRiskCnaes.includes(cnaePrefix)) {
      risk = 'medium';
    }

    if (amazonStates.includes(state) && risk !== 'low') {
      risk = risk === 'high' ? 'critical' : 'high';
    }

    return risk;
  }

  private formatCompany(company: any) {
    return {
      ...company,
      cnpjFormatted: formatCNPJ(company.cnpj),
    };
  }
}

export const companyService = new CompanyService();
