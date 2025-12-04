import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2,
  MapPin,
  FileText,
  ClipboardCheck,
  ArrowRight,
  ArrowLeft,
  Edit3,
  X,
  Plus,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { Stepper } from '../ui/Stepper';
import { searchCompanyByCNPJ, formatCNPJ, validateCNPJ } from '../../services/cnpjService';
import { getRisksByMainCNAE } from '../../services/cnaeService';
import type { Company, OperationalProfile, OperationalRisk, CNAE } from '../../types';

interface OnboardingFlowProps {
  onComplete: (company: Company, profile: OperationalProfile) => void;
  onCancel?: () => void;
}

const ESTADOS_BRASIL = [
  { sigla: 'AC', nome: 'Acre' },
  { sigla: 'AL', nome: 'Alagoas' },
  { sigla: 'AM', nome: 'Amazonas' },
  { sigla: 'AP', nome: 'Amapá' },
  { sigla: 'BA', nome: 'Bahia' },
  { sigla: 'CE', nome: 'Ceará' },
  { sigla: 'DF', nome: 'Distrito Federal' },
  { sigla: 'ES', nome: 'Espírito Santo' },
  { sigla: 'GO', nome: 'Goiás' },
  { sigla: 'MA', nome: 'Maranhão' },
  { sigla: 'MG', nome: 'Minas Gerais' },
  { sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { sigla: 'MT', nome: 'Mato Grosso' },
  { sigla: 'PA', nome: 'Pará' },
  { sigla: 'PB', nome: 'Paraíba' },
  { sigla: 'PE', nome: 'Pernambuco' },
  { sigla: 'PI', nome: 'Piauí' },
  { sigla: 'PR', nome: 'Paraná' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' },
  { sigla: 'RN', nome: 'Rio Grande do Norte' },
  { sigla: 'RO', nome: 'Rondônia' },
  { sigla: 'RR', nome: 'Roraima' },
  { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'SE', nome: 'Sergipe' },
  { sigla: 'SP', nome: 'São Paulo' },
  { sigla: 'TO', nome: 'Tocantins' }
];

const RISCOS_OPERACIONAIS = [
  { id: 'inflamaveis', tipo: 'Produtos inflamáveis', descricao: 'Armazenamento ou manuseio de líquidos/gases inflamáveis' },
  { id: 'quimicos', tipo: 'Produtos químicos', descricao: 'Utilização de produtos químicos perigosos' },
  { id: 'residuos_perigosos', tipo: 'Resíduos perigosos', descricao: 'Geração ou transporte de resíduos perigosos' },
  { id: 'caldeiras', tipo: 'Caldeiras e vasos de pressão', descricao: 'Operação de caldeiras, vasos de pressão ou tubulações' },
  { id: 'altura', tipo: 'Trabalho em altura', descricao: 'Atividades acima de 2 metros do piso' },
  { id: 'espaco_confinado', tipo: 'Espaço confinado', descricao: 'Trabalho em espaços confinados' },
  { id: 'eletricidade', tipo: 'Instalações elétricas', descricao: 'Serviços em instalações elétricas' },
  { id: 'radiacao', tipo: 'Radiação ionizante', descricao: 'Exposição a radiações ionizantes' },
  { id: 'ruido', tipo: 'Ruído ocupacional', descricao: 'Exposição a níveis elevados de ruído' },
  { id: 'biologico', tipo: 'Agentes biológicos', descricao: 'Contato com agentes biológicos' },
  { id: 'navegacao', tipo: 'Navegação/embarcações', descricao: 'Operação de embarcações ou trabalho aquaviário' },
  { id: 'mineracao', tipo: 'Mineração', descricao: 'Atividades de extração mineral' }
];

const steps = [
  { id: 1, title: 'Dados da Empresa', description: 'Busca por CNPJ', icon: Building2 },
  { id: 2, title: 'Confirmar Dados', description: 'Revisar informações', icon: FileText },
  { id: 3, title: 'Perfil Operacional', description: 'Riscos e atividades', icon: ClipboardCheck },
  { id: 4, title: 'Conclusão', description: 'Gerar obrigações', icon: CheckCircle2 }
];

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [cnpj, setCnpj] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [profile, setProfile] = useState<Partial<OperationalProfile>>({
    estadosAtuacao: [],
    municipiosAtuacao: [],
    riscos: [],
    atividades: [],
    funcionarios: undefined
  });
  
  const [suggestedRisks, setSuggestedRisks] = useState<string[]>([]);

  const handleCNPJChange = (value: string) => {
    const formatted = formatCNPJ(value);
    setCnpj(formatted);
    setSearchError(null);
  };

  const handleSearchCNPJ = async () => {
    if (!validateCNPJ(cnpj)) {
      setSearchError('CNPJ inválido. Verifique os dígitos informados.');
      return;
    }
    
    setIsSearching(true);
    setSearchError(null);
    
    try {
      const result = await searchCompanyByCNPJ(cnpj);
      setCompany(result);
      
      if (result.cnaesPrincipais.length > 0) {
        const risks = getRisksByMainCNAE(result.cnaesPrincipais[0].codigo);
        setSuggestedRisks(risks);
      }
      
      if (result.endereco.estado) {
        setProfile(prev => ({
          ...prev,
          estadosAtuacao: [result.endereco.estado]
        }));
      }
      
      setCurrentStep(1);
    } catch (error) {
      setSearchError(error instanceof Error ? error.message : 'Erro ao buscar CNPJ');
    } finally {
      setIsSearching(false);
    }
  };

  const handleToggleRisk = (riskId: string) => {
    setProfile(prev => {
      const existingRisk = prev.riscos?.find(r => r.id === riskId);
      if (existingRisk) {
        return {
          ...prev,
          riscos: prev.riscos?.filter(r => r.id !== riskId)
        };
      } else {
        const riskInfo = RISCOS_OPERACIONAIS.find(r => r.id === riskId);
        if (riskInfo) {
          const newRisk: OperationalRisk = {
            id: riskId,
            tipo: riskInfo.tipo,
            descricao: riskInfo.descricao,
            nivel: 'medio',
            ativo: true
          };
          return {
            ...prev,
            riscos: [...(prev.riscos || []), newRisk]
          };
        }
      }
      return prev;
    });
  };

  const handleToggleEstado = (sigla: string) => {
    setProfile(prev => {
      const estados = prev.estadosAtuacao || [];
      if (estados.includes(sigla)) {
        return { ...prev, estadosAtuacao: estados.filter(e => e !== sigla) };
      }
      return { ...prev, estadosAtuacao: [...estados, sigla] };
    });
  };

  const handleComplete = () => {
    if (company && profile) {
      const fullProfile: OperationalProfile = {
        id: crypto.randomUUID(),
        companyId: company.id,
        estadosAtuacao: profile.estadosAtuacao || [],
        municipiosAtuacao: profile.municipiosAtuacao || [],
        riscos: profile.riscos || [],
        atividades: profile.atividades || [],
        funcionarios: profile.funcionarios,
        dataCadastro: new Date().toISOString(),
        dataAtualizacao: new Date().toISOString()
      };
      onComplete(company, fullProfile);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return validateCNPJ(cnpj);
      case 1: return company !== null;
      case 2: return (profile.estadosAtuacao?.length || 0) > 0;
      case 3: return true;
      default: return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Building2 size={32} className="text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Cadastre sua Empresa</h2>
              <p className="text-slate-500 mt-2">
                Informe o CNPJ para buscar automaticamente os dados na Receita Federal
              </p>
            </div>
            
            <div className="max-w-md mx-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  CNPJ da Empresa
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={cnpj}
                    onChange={(e) => handleCNPJChange(e.target.value)}
                    placeholder="00.000.000/0000-00"
                    className={`
                      w-full px-4 py-3 text-lg border rounded-xl focus:outline-none focus:ring-2 transition-all
                      ${searchError 
                        ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' 
                        : 'border-slate-200 focus:ring-teal-500/20 focus:border-teal-500'}
                    `}
                    maxLength={18}
                  />
                  {cnpj.length > 0 && (
                    <button
                      onClick={() => setCnpj('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
                {searchError && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {searchError}
                  </p>
                )}
              </div>
              
              <button
                onClick={handleSearchCNPJ}
                disabled={!validateCNPJ(cnpj) || isSearching}
                className={`
                  w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all
                  ${validateCNPJ(cnpj) && !isSearching
                    ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-lg shadow-teal-600/25'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
                `}
              >
                {isSearching ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Buscando dados...
                  </>
                ) : (
                  <>
                    <Search size={20} />
                    Buscar na Receita Federal
                  </>
                )}
              </button>
              
              <p className="text-xs text-slate-500 text-center">
                Os dados serão consultados na base pública da Receita Federal (BrasilAPI)
              </p>
            </div>
          </div>
        );
      
      case 1:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Confirme os Dados</h2>
              <p className="text-slate-500 mt-2">
                Verifique se as informações estão corretas
              </p>
            </div>
            
            {company && (
              <div className="space-y-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
                  <CheckCircle2 className="text-emerald-600 shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="font-medium text-emerald-800">Empresa encontrada!</p>
                    <p className="text-sm text-emerald-600">Dados obtidos da Receita Federal</p>
                  </div>
                </div>
                
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800">Dados Cadastrais</h3>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1"
                    >
                      <Edit3 size={14} />
                      {isEditing ? 'Concluir' : 'Editar'}
                    </button>
                  </div>
                  
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Razão Social</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={company.razaoSocial}
                            onChange={(e) => setCompany({ ...company, razaoSocial: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                          />
                        ) : (
                          <p className="text-sm font-medium text-slate-800">{company.razaoSocial}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Nome Fantasia</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={company.nomeFantasia}
                            onChange={(e) => setCompany({ ...company, nomeFantasia: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                          />
                        ) : (
                          <p className="text-sm font-medium text-slate-800">{company.nomeFantasia}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 uppercase mb-1">CNPJ</label>
                        <p className="text-sm font-medium text-slate-800">{company.cnpj}</p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Situação</label>
                        <p className="text-sm font-medium text-slate-800">{company.situacaoCadastral || 'Não informado'}</p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-slate-100">
                      <label className="block text-xs font-medium text-slate-500 uppercase mb-2">CNAE Principal</label>
                      <div className="bg-slate-50 rounded-lg p-3">
                        {company.cnaesPrincipais.map((cnae, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="text-xs font-mono bg-teal-100 text-teal-700 px-2 py-0.5 rounded">{cnae.codigo}</span>
                            <span className="text-sm text-slate-700">{cnae.descricao}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-slate-100">
                      <label className="block text-xs font-medium text-slate-500 uppercase mb-2 flex items-center gap-1">
                        <MapPin size={12} />
                        Endereço
                      </label>
                      <p className="text-sm text-slate-700">
                        {company.endereco.logradouro}, {company.endereco.numero}
                        {company.endereco.complemento && ` - ${company.endereco.complemento}`}
                        <br />
                        {company.endereco.bairro} - {company.endereco.cidade}/{company.endereco.estado}
                        <br />
                        CEP: {company.endereco.cep}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Perfil Operacional</h2>
              <p className="text-slate-500 mt-2">
                Informe os riscos e características da operação
              </p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Estados onde a empresa opera *
                </label>
                <div className="flex flex-wrap gap-2">
                  {ESTADOS_BRASIL.map(estado => (
                    <button
                      key={estado.sigla}
                      onClick={() => handleToggleEstado(estado.sigla)}
                      className={`
                        px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                        ${profile.estadosAtuacao?.includes(estado.sigla)
                          ? 'bg-teal-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
                      `}
                    >
                      {estado.sigla}
                    </button>
                  ))}
                </div>
                {profile.estadosAtuacao?.length === 0 && (
                  <p className="mt-2 text-sm text-amber-600 flex items-center gap-1">
                    <AlertTriangle size={14} />
                    Selecione pelo menos um estado
                  </p>
                )}
              </div>
              
              {suggestedRisks.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Riscos sugeridos com base no CNAE</h4>
                  <div className="flex flex-wrap gap-2">
                    {suggestedRisks.map((risk, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm">
                        {risk}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Riscos Operacionais
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {RISCOS_OPERACIONAIS.map(risco => {
                    const isSelected = profile.riscos?.some(r => r.id === risco.id);
                    return (
                      <button
                        key={risco.id}
                        onClick={() => handleToggleRisk(risco.id)}
                        className={`
                          p-3 rounded-xl border text-left transition-all
                          ${isSelected
                            ? 'border-teal-500 bg-teal-50'
                            : 'border-slate-200 hover:border-slate-300 bg-white'}
                        `}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`
                            w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5
                            ${isSelected ? 'bg-teal-600 border-teal-600' : 'border-slate-300'}
                          `}>
                            {isSelected && <CheckCircle2 size={12} className="text-white" />}
                          </div>
                          <div>
                            <p className={`font-medium text-sm ${isSelected ? 'text-teal-800' : 'text-slate-700'}`}>
                              {risco.tipo}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">{risco.descricao}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Número aproximado de funcionários
                </label>
                <input
                  type="number"
                  value={profile.funcionarios || ''}
                  onChange={(e) => setProfile({ ...profile, funcionarios: parseInt(e.target.value) || undefined })}
                  placeholder="Ex: 50"
                  className="w-full max-w-xs px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6 animate-fade-in text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={40} className="text-emerald-600" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Tudo pronto!</h2>
              <p className="text-slate-500 mt-2">
                O perfil da sua empresa está configurado
              </p>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-6 max-w-md mx-auto text-left space-y-4">
              <h3 className="font-semibold text-slate-800">{company?.nomeFantasia}</h3>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <span className="text-slate-500">CNPJ:</span>
                  <span className="font-medium">{company?.cnpj}</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-slate-500">Estados:</span>
                  <span className="font-medium">{profile.estadosAtuacao?.join(', ')}</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-slate-500">Riscos identificados:</span>
                  <span className="font-medium">{profile.riscos?.length || 0}</span>
                </p>
              </div>
            </div>
            
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 max-w-md mx-auto">
              <p className="text-sm text-teal-800">
                Ao continuar, o sistema irá gerar automaticamente o mapa de obrigações legais 
                com base no perfil da empresa.
              </p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 h-16 flex items-center px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">SPL</span>
          </div>
          <span className="font-semibold text-slate-800">Configuração Inicial</span>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="ml-auto text-slate-500 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        )}
      </header>
      
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="mb-8">
            <Stepper steps={steps} currentStep={currentStep} size="md" />
          </div>
          
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            {renderStep()}
          </div>
          
          <div className="mt-6 flex justify-between">
            {currentStep > 0 ? (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-6 py-2.5 text-slate-600 hover:text-slate-800 font-medium flex items-center gap-2"
              >
                <ArrowLeft size={18} />
                Voltar
              </button>
            ) : (
              <div />
            )}
            
            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceed()}
                className={`
                  px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all
                  ${canProceed()
                    ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-lg shadow-teal-600/25'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
                `}
              >
                Continuar
                <ArrowRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-medium flex items-center gap-2 hover:bg-emerald-700 shadow-lg shadow-emerald-600/25"
              >
                <CheckCircle2 size={18} />
                Gerar Mapa de Obrigações
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
