import { eq, and, desc, asc, sql, gte, lte } from 'drizzle-orm';
import { db, legalObligations, legalRequirements, companies } from '../db';
import { ObligationCreateRequest, PaginationParams } from '../types';
import { NotFoundError, ForbiddenError } from '../middleware/errorHandler';

interface ObligationFilters {
  status?: string;
  riskLevel?: string;
  category?: string;
  agency?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export class ObligationService {
  async create(userId: string, data: ObligationCreateRequest) {
    const company = await db.query.companies.findFirst({
      where: and(
        eq(companies.id, data.companyId),
        eq(companies.userId, userId)
      ),
    });

    if (!company) {
      throw new ForbiddenError('Você não tem permissão para adicionar obrigações a esta empresa');
    }

    const [obligation] = await db
      .insert(legalObligations)
      .values({
        companyId: data.companyId,
        code: data.code,
        title: data.title,
        description: data.description,
        category: data.category,
        subcategory: data.subcategory,
        agency: data.agency,
        frequency: data.frequency,
        deadline: data.deadline ? new Date(data.deadline) : null,
        riskLevel: data.riskLevel || 'medium',
        responsible: data.responsible,
        priority: data.priority || 'medium',
      })
      .returning();

    return obligation;
  }

  async findById(id: string, userId: string) {
    const obligation = await db.query.legalObligations.findFirst({
      where: eq(legalObligations.id, id),
      with: {
        company: true,
      },
    });

    if (!obligation) {
      throw new NotFoundError('Obrigação');
    }

    if (obligation.company.userId !== userId) {
      throw new ForbiddenError('Acesso negado');
    }

    return obligation;
  }

  async findByCompany(
    companyId: string,
    userId: string,
    params: PaginationParams & ObligationFilters
  ) {
    const company = await db.query.companies.findFirst({
      where: and(eq(companies.id, companyId), eq(companies.userId, userId)),
    });

    if (!company) {
      throw new NotFoundError('Empresa');
    }

    const { page, limit, sortBy = 'createdAt', sortOrder = 'desc' } = params;
    const offset = (page - 1) * limit;

    let whereClause: any = eq(legalObligations.companyId, companyId);

    if (params.status) {
      whereClause = and(whereClause, eq(legalObligations.status, params.status));
    }
    if (params.riskLevel) {
      whereClause = and(whereClause, eq(legalObligations.riskLevel, params.riskLevel));
    }
    if (params.category) {
      whereClause = and(whereClause, eq(legalObligations.category, params.category));
    }
    if (params.agency) {
      whereClause = and(whereClause, eq(legalObligations.agency, params.agency));
    }
    if (params.dateFrom) {
      whereClause = and(whereClause, gte(legalObligations.deadline, params.dateFrom));
    }
    if (params.dateTo) {
      whereClause = and(whereClause, lte(legalObligations.deadline, params.dateTo));
    }

    const [data, countResult] = await Promise.all([
      db.query.legalObligations.findMany({
        where: whereClause,
        limit,
        offset,
        orderBy: sortOrder === 'asc'
          ? asc(legalObligations.createdAt)
          : desc(legalObligations.createdAt),
      }),
      db.select({ count: sql<number>`count(*)` }).from(legalObligations).where(whereClause),
    ]);

    const total = Number(countResult[0]?.count || 0);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByUser(userId: string, params: PaginationParams & ObligationFilters) {
    const { page, limit, sortBy = 'deadline', sortOrder = 'asc' } = params;
    const offset = (page - 1) * limit;

    const userCompanies = await db.query.companies.findMany({
      where: eq(companies.userId, userId),
      columns: { id: true },
    });

    const companyIds = userCompanies.map(c => c.id);

    if (companyIds.length === 0) {
      return { data: [], meta: { page, limit, total: 0, totalPages: 0 } };
    }

    let whereClause: any = sql`${legalObligations.companyId} IN (${sql.join(companyIds.map(id => sql`${id}`), sql`, `)})`;

    if (params.status) {
      whereClause = and(whereClause, eq(legalObligations.status, params.status));
    }
    if (params.riskLevel) {
      whereClause = and(whereClause, eq(legalObligations.riskLevel, params.riskLevel));
    }

    const [data, countResult] = await Promise.all([
      db.query.legalObligations.findMany({
        where: whereClause,
        limit,
        offset,
        with: { company: { columns: { razaoSocial: true, cnpj: true } } },
        orderBy: sortOrder === 'asc'
          ? asc(legalObligations.deadline)
          : desc(legalObligations.deadline),
      }),
      db.select({ count: sql<number>`count(*)` }).from(legalObligations).where(whereClause),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total: Number(countResult[0]?.count || 0),
        totalPages: Math.ceil(Number(countResult[0]?.count || 0) / limit),
      },
    };
  }

  async update(id: string, userId: string, data: Partial<ObligationCreateRequest>) {
    const obligation = await this.findById(id, userId);

    const updateData: any = { ...data, updatedAt: new Date() };
    
    if (data.deadline) {
      updateData.deadline = new Date(data.deadline);
    }

    const [updated] = await db
      .update(legalObligations)
      .set(updateData)
      .where(eq(legalObligations.id, id))
      .returning();

    return updated;
  }

  async updateStatus(id: string, userId: string, status: string) {
    await this.findById(id, userId);

    const [updated] = await db
      .update(legalObligations)
      .set({ status, updatedAt: new Date() })
      .where(eq(legalObligations.id, id))
      .returning();

    return updated;
  }

  async delete(id: string, userId: string) {
    await this.findById(id, userId);
    await db.delete(legalObligations).where(eq(legalObligations.id, id));
    return { success: true };
  }

  async generateForCompany(companyId: string, userId: string) {
    const company = await db.query.companies.findFirst({
      where: and(eq(companies.id, companyId), eq(companies.userId, userId)),
    });

    if (!company) {
      throw new NotFoundError('Empresa');
    }

    const allCnaes = [company.cnaePrincipal, ...(company.cnaesSecundarios || [])];
    
    const requirements = await db.query.legalRequirements.findMany({
      where: eq(legalRequirements.isActive, true),
    });

    const applicableRequirements = requirements.filter(req => {
      const cnaesMatch = (req.applicableCnaes?.length || 0) === 0 ||
        req.applicableCnaes?.some((cnae: string) => 
          allCnaes.some(c => c.startsWith(cnae.substring(0, 4)))
        );
      
      const statesMatch = (req.applicableStates?.length || 0) === 0 ||
        req.applicableStates?.includes(company.state);
      
      return cnaesMatch && statesMatch;
    });

    const existingCodes = (await db.query.legalObligations.findMany({
      where: eq(legalObligations.companyId, companyId),
      columns: { code: true },
    })).map(o => o.code);

    const newObligations = applicableRequirements
      .filter(req => !existingCodes.includes(req.code))
      .map(req => ({
        companyId,
        code: req.code,
        title: req.title,
        description: req.description,
        category: req.category,
        agency: req.agency,
        riskLevel: req.riskLevel,
        status: 'pending',
        priority: req.riskLevel === 'critical' ? 'urgent' : req.riskLevel === 'high' ? 'high' : 'medium',
      }));

    if (newObligations.length > 0) {
      await db.insert(legalObligations).values(newObligations);
    }

    return {
      generated: newObligations.length,
      total: existingCodes.length + newObligations.length,
    };
  }
}

export const obligationService = new ObligationService();
