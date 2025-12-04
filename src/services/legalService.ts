import type { LegalRequirement, LegalUpdate, CNAE, OperationalProfile } from '../types';

export interface LegalObligationMapping {
  cnaePattern: string;
  riskTypes: string[];
  estados?: string[];
  requirements: Partial<LegalRequirement>[];
}

const FEDERAL_REQUIREMENTS: Partial<LegalRequirement>[] = [
  {
    codigo: 'RL-CONAMA-001',
    tipo: 'RL',
    descricao: 'Licenciamento ambiental para atividades potencialmente poluidoras',
    fundamentoLegal: 'Resolução CONAMA nº 237/1997',
    escopo: ['Meio Ambiente'],
    tema: 'Licenciamento Ambiental',
    risco: 'alto',
    orgaoFiscalizador: 'IBAMA / Órgão Estadual',
    linkLegislacao: 'https://www.planalto.gov.br/ccivil_03/leis/l6938.htm'
  },
  {
    codigo: 'RL-NR01',
    tipo: 'RL',
    descricao: 'Disposições gerais e gerenciamento de riscos ocupacionais',
    fundamentoLegal: 'NR-01 - Portaria SEPRT nº 6.730/2020',
    escopo: ['Segurança do Trabalho'],
    tema: 'Segurança Ocupacional',
    subtema: 'GRO/PGR',
    risco: 'alto',
    orgaoFiscalizador: 'Ministério do Trabalho e Emprego',
    linkLegislacao: 'https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-paritaria-permanente/normas-regulamentadora/nr-01'
  },
  {
    codigo: 'RL-NR05',
    tipo: 'RL',
    descricao: 'Comissão Interna de Prevenção de Acidentes (CIPA)',
    fundamentoLegal: 'NR-05 - Portaria SEPRT nº 422/2021',
    escopo: ['Segurança do Trabalho'],
    tema: 'CIPA',
    risco: 'medio',
    orgaoFiscalizador: 'Ministério do Trabalho e Emprego'
  },
  {
    codigo: 'RL-NR06',
    tipo: 'RL',
    descricao: 'Equipamentos de Proteção Individual (EPI)',
    fundamentoLegal: 'NR-06 - Portaria SEPRT nº 787/2018',
    escopo: ['Segurança do Trabalho'],
    tema: 'EPIs',
    risco: 'alto',
    orgaoFiscalizador: 'Ministério do Trabalho e Emprego'
  },
  {
    codigo: 'RL-NR07',
    tipo: 'RL',
    descricao: 'Programa de Controle Médico de Saúde Ocupacional (PCMSO)',
    fundamentoLegal: 'NR-07 - Portaria SEPRT nº 6.734/2020',
    escopo: ['Segurança do Trabalho', 'Saúde Ocupacional'],
    tema: 'PCMSO',
    risco: 'alto',
    orgaoFiscalizador: 'Ministério do Trabalho e Emprego'
  },
  {
    codigo: 'RL-NR09',
    tipo: 'RL',
    descricao: 'Avaliação e Controle das Exposições Ocupacionais',
    fundamentoLegal: 'NR-09 - Portaria SEPRT nº 6.735/2020',
    escopo: ['Segurança do Trabalho'],
    tema: 'Agentes Físicos, Químicos e Biológicos',
    risco: 'alto',
    orgaoFiscalizador: 'Ministério do Trabalho e Emprego'
  },
  {
    codigo: 'RL-NR10',
    tipo: 'RL',
    descricao: 'Segurança em Instalações e Serviços em Eletricidade',
    fundamentoLegal: 'NR-10 - Portaria GM nº 3.214/1978',
    escopo: ['Segurança do Trabalho'],
    tema: 'Eletricidade',
    risco: 'critico',
    orgaoFiscalizador: 'Ministério do Trabalho e Emprego'
  },
  {
    codigo: 'RL-NR12',
    tipo: 'RL',
    descricao: 'Segurança no Trabalho em Máquinas e Equipamentos',
    fundamentoLegal: 'NR-12 - Portaria SEPRT nº 916/2019',
    escopo: ['Segurança do Trabalho'],
    tema: 'Máquinas e Equipamentos',
    risco: 'critico',
    orgaoFiscalizador: 'Ministério do Trabalho e Emprego'
  },
  {
    codigo: 'RL-NR23',
    tipo: 'RL',
    descricao: 'Proteção Contra Incêndios',
    fundamentoLegal: 'NR-23 - Portaria SEPRT nº 915/2019',
    escopo: ['Segurança do Trabalho'],
    tema: 'Prevenção de Incêndios',
    risco: 'alto',
    orgaoFiscalizador: 'Corpo de Bombeiros'
  },
  {
    codigo: 'RL-NR35',
    tipo: 'RL',
    descricao: 'Trabalho em Altura',
    fundamentoLegal: 'NR-35 - Portaria SEPRT nº 4.218/2022',
    escopo: ['Segurança do Trabalho'],
    tema: 'Trabalho em Altura',
    risco: 'critico',
    orgaoFiscalizador: 'Ministério do Trabalho e Emprego'
  }
];

const SPECIFIC_REQUIREMENTS: LegalObligationMapping[] = [
  {
    cnaePattern: '50',
    riskTypes: ['Transporte aquaviário', 'Navegação'],
    requirements: [
      {
        codigo: 'RL-ANTAQ-001',
        tipo: 'RL',
        descricao: 'Autorização de funcionamento para transporte aquaviário',
        fundamentoLegal: 'Lei nº 10.233/2001 e Resoluções ANTAQ',
        escopo: ['Navegação', 'Transporte'],
        tema: 'Autorização de Funcionamento',
        risco: 'alto',
        orgaoFiscalizador: 'ANTAQ'
      },
      {
        codigo: 'RL-NORMAM-001',
        tipo: 'RL',
        descricao: 'Cumprimento das Normas da Autoridade Marítima (NORMAM)',
        fundamentoLegal: 'NORMAM - Marinha do Brasil',
        escopo: ['Navegação', 'Segurança Naval'],
        tema: 'Segurança da Navegação',
        risco: 'critico',
        orgaoFiscalizador: 'Marinha do Brasil'
      },
      {
        codigo: 'RL-NR30',
        tipo: 'RL',
        descricao: 'Segurança e Saúde no Trabalho Aquaviário',
        fundamentoLegal: 'NR-30 - Portaria SEPRT nº 19.891/2020',
        escopo: ['Segurança do Trabalho', 'Navegação'],
        tema: 'Trabalho Aquaviário',
        risco: 'alto',
        orgaoFiscalizador: 'Ministério do Trabalho e Emprego'
      }
    ]
  },
  {
    cnaePattern: '19',
    riskTypes: ['Combustíveis', 'Inflamáveis'],
    requirements: [
      {
        codigo: 'RL-ANP-001',
        tipo: 'RL',
        descricao: 'Autorização para exercício de atividade de distribuição de combustíveis',
        fundamentoLegal: 'Resolução ANP nº 58/2014',
        escopo: ['Combustíveis', 'Energia'],
        tema: 'Distribuição de Combustíveis',
        risco: 'critico',
        orgaoFiscalizador: 'ANP'
      },
      {
        codigo: 'RL-NR20',
        tipo: 'RL',
        descricao: 'Segurança e Saúde no Trabalho com Inflamáveis e Combustíveis',
        fundamentoLegal: 'NR-20 - Portaria SEPRT nº 913/2019',
        escopo: ['Segurança do Trabalho', 'Combustíveis'],
        tema: 'Inflamáveis e Combustíveis',
        risco: 'critico',
        orgaoFiscalizador: 'Ministério do Trabalho e Emprego'
      }
    ]
  },
  {
    cnaePattern: '20',
    riskTypes: ['Produtos químicos', 'Resíduos perigosos'],
    requirements: [
      {
        codigo: 'RL-IBAMA-QUIMICOS',
        tipo: 'RL',
        descricao: 'Cadastro Técnico Federal de Atividades Potencialmente Poluidoras',
        fundamentoLegal: 'Lei nº 6.938/1981 e IN IBAMA nº 6/2013',
        escopo: ['Meio Ambiente', 'Produtos Químicos'],
        tema: 'CTF/APP',
        risco: 'alto',
        orgaoFiscalizador: 'IBAMA'
      }
    ]
  }
];

const STATE_REQUIREMENTS: Record<string, Partial<LegalRequirement>[]> = {
  'AM': [
    {
      codigo: 'RL-IPAAM-001',
      tipo: 'RL',
      descricao: 'Licenciamento ambiental junto ao IPAAM',
      fundamentoLegal: 'Lei Estadual nº 3.785/2012 (AM)',
      escopo: ['Meio Ambiente'],
      tema: 'Licenciamento Estadual',
      risco: 'alto',
      orgaoFiscalizador: 'IPAAM'
    },
    {
      codigo: 'RL-AM-CBMAM',
      tipo: 'RL',
      descricao: 'Auto de Vistoria do Corpo de Bombeiros (AVCB)',
      fundamentoLegal: 'Lei Estadual nº 5.765/2022 (AM)',
      escopo: ['Segurança', 'Prevenção de Incêndios'],
      tema: 'AVCB',
      risco: 'alto',
      orgaoFiscalizador: 'CBMAM'
    }
  ],
  'SP': [
    {
      codigo: 'RL-CETESB-001',
      tipo: 'RL',
      descricao: 'Licenciamento ambiental junto à CETESB',
      fundamentoLegal: 'Lei Estadual nº 997/1976 (SP)',
      escopo: ['Meio Ambiente'],
      tema: 'Licenciamento Estadual',
      risco: 'alto',
      orgaoFiscalizador: 'CETESB'
    }
  ]
};

export function generateLegalRequirements(
  profile: OperationalProfile,
  cnaes: CNAE[]
): LegalRequirement[] {
  const requirements: LegalRequirement[] = [];
  const now = new Date().toISOString();
  
  FEDERAL_REQUIREMENTS.forEach((req, index) => {
    requirements.push({
      id: `req-${index + 1}`,
      codigo: req.codigo!,
      tipo: req.tipo as 'OL' | 'RL',
      descricao: req.descricao!,
      fundamentoLegal: req.fundamentoLegal!,
      escopo: req.escopo!,
      tema: req.tema!,
      subtema: req.subtema,
      area: 'QSMS',
      subarea: 'Segurança',
      risco: req.risco as any,
      orgaoFiscalizador: req.orgaoFiscalizador,
      linkLegislacao: req.linkLegislacao,
      requisitosRelacionados: [],
      dataVigencia: now,
      dataAtualizacao: now
    });
  });
  
  cnaes.forEach(cnae => {
    const prefix = cnae.codigo.slice(0, 2);
    const mapping = SPECIFIC_REQUIREMENTS.find(m => m.cnaePattern === prefix);
    
    if (mapping) {
      mapping.requirements.forEach((req, index) => {
        const existingReq = requirements.find(r => r.codigo === req.codigo);
        if (!existingReq) {
          requirements.push({
            id: `req-cnae-${prefix}-${index}`,
            codigo: req.codigo!,
            tipo: req.tipo as 'OL' | 'RL',
            descricao: req.descricao!,
            fundamentoLegal: req.fundamentoLegal!,
            escopo: req.escopo!,
            tema: req.tema!,
            area: 'Específico',
            risco: req.risco as any,
            orgaoFiscalizador: req.orgaoFiscalizador,
            requisitosRelacionados: [],
            dataVigencia: now,
            dataAtualizacao: now
          });
        }
      });
    }
  });
  
  profile.estadosAtuacao.forEach(estado => {
    const stateReqs = STATE_REQUIREMENTS[estado];
    if (stateReqs) {
      stateReqs.forEach((req, index) => {
        requirements.push({
          id: `req-state-${estado}-${index}`,
          codigo: req.codigo!,
          tipo: req.tipo as 'OL' | 'RL',
          descricao: req.descricao!,
          fundamentoLegal: req.fundamentoLegal!,
          escopo: req.escopo!,
          tema: req.tema!,
          area: 'Estadual',
          risco: req.risco as any,
          orgaoFiscalizador: req.orgaoFiscalizador,
          requisitosRelacionados: [],
          dataVigencia: now,
          dataAtualizacao: now
        });
      });
    }
  });
  
  return requirements;
}

export function getLegalUpdates(): LegalUpdate[] {
  const today = new Date();
  
  return [
    {
      id: 'update-1',
      data: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
      tipo: 'resolucao',
      escopo: 'federal',
      area: 'Meio Ambiente',
      titulo: 'Nova Resolução CONAMA sobre resíduos sólidos',
      resumo: 'Altera os procedimentos para transporte interestadual de resíduos perigosos, exigindo nova documentação digital.',
      impacto: 'alto',
      linkOriginal: 'https://www.gov.br/conama',
      relacionadoA: 'RL',
      novo: true,
      lida: false
    },
    {
      id: 'update-2',
      data: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
      tipo: 'portaria',
      escopo: 'estadual',
      area: 'Segurança',
      titulo: 'Portaria CBMAM nº 152/2024',
      resumo: 'Atualiza as normas técnicas para vistoria de sistemas de combate a incêndio em embarcações fluviais.',
      impacto: 'medio',
      relacionadoA: 'OL',
      novo: true,
      lida: false
    },
    {
      id: 'update-3',
      data: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
      tipo: 'norma_regulamentadora',
      escopo: 'federal',
      area: 'Segurança do Trabalho',
      titulo: 'Revisão da NR-01 - Disposições Gerais',
      resumo: 'Novas diretrizes para o gerenciamento de riscos ocupacionais (GRO) e Programa de Gerenciamento de Riscos (PGR).',
      impacto: 'alto',
      linkOriginal: 'https://www.gov.br/trabalho-e-emprego',
      relacionadoA: 'RL',
      novo: false,
      lida: true
    }
  ];
}

export function searchLegislation(query: string): Promise<LegalRequirement[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const allRequirements = [...FEDERAL_REQUIREMENTS];
      const results = allRequirements.filter(req => 
        req.descricao?.toLowerCase().includes(query.toLowerCase()) ||
        req.fundamentoLegal?.toLowerCase().includes(query.toLowerCase()) ||
        req.tema?.toLowerCase().includes(query.toLowerCase())
      ).map((req, index) => ({
        id: `search-${index}`,
        codigo: req.codigo!,
        tipo: req.tipo as 'OL' | 'RL',
        descricao: req.descricao!,
        fundamentoLegal: req.fundamentoLegal!,
        escopo: req.escopo!,
        tema: req.tema!,
        area: 'Federal',
        risco: req.risco as any,
        orgaoFiscalizador: req.orgaoFiscalizador,
        requisitosRelacionados: [],
        dataVigencia: new Date().toISOString(),
        dataAtualizacao: new Date().toISOString()
      }));
      resolve(results);
    }, 500);
  });
}
