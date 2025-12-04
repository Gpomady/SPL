import React, { useState, useEffect } from 'react';
import { 
  Building2, Users, Plus, Search, Filter, MoreVertical,
  CheckCircle2, Clock, AlertTriangle, XCircle, ChevronRight,
  Mail, Phone, MapPin, FileText, Shield, Settings, LogOut,
  RefreshCw, Eye, Edit, Ban, Power, UserPlus, BarChart3,
  TrendingUp, Activity, Calendar
} from 'lucide-react';

interface Company {
  id: string;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string | null;
  email: string | null;
  phone: string | null;
  state: string;
  city: string;
  status: 'pending_setup' | 'active' | 'suspended' | 'cancelled';
  cnaePrincipal: string;
  slaTier: string;
  createdAt: string;
  adminCount: number;
  userCount: number;
}

interface Stats {
  totalCompanies: number;
  activeCompanies: number;
  pendingSetup: number;
  suspendedCompanies: number;
  totalUsers: number;
  activeUsers: number;
  pendingInvitations: number;
}

interface MasterDashboardProps {
  user: any;
  onLogout: () => void;
}

const API_BASE = '/api';

export const MasterDashboard: React.FC<MasterDashboardProps> = ({ user, onLogout }) => {
  const [activeView, setActiveView] = useState<'dashboard' | 'companies' | 'users' | 'settings'>('dashboard');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showNewCompanyModal, setShowNewCompanyModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [statsRes, companiesRes] = await Promise.all([
        fetch(`${API_BASE}/admin/stats`, { headers }),
        fetch(`${API_BASE}/admin/companies?limit=100`, { headers })
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.data);
      }

      if (companiesRes.ok) {
        const companiesData = await companiesRes.json();
        setCompanies(companiesData.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCompany = async (data: any) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE}/admin/companies`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        setShowNewCompanyModal(false);
        fetchData();
        alert('Empresa cadastrada com sucesso! O convite foi enviado para o administrador.');
      } else {
        const error = await response.json();
        alert(error.message || 'Erro ao cadastrar empresa');
      }
    } catch (error) {
      console.error('Error creating company:', error);
      alert('Erro ao cadastrar empresa');
    }
  };

  const handleCompanyAction = async (companyId: string, action: 'activate' | 'suspend') => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE}/admin/companies/${companyId}/${action}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchData();
      } else {
        const error = await response.json();
        alert(error.message || 'Erro ao executar ação');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = 
      company.razaoSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (company.nomeFantasia && company.nomeFantasia.toLowerCase().includes(searchTerm.toLowerCase())) ||
      company.cnpj.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || company.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
      active: { bg: 'bg-green-100', text: 'text-green-700', icon: <CheckCircle2 className="w-3 h-3" /> },
      pending_setup: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: <Clock className="w-3 h-3" /> },
      suspended: { bg: 'bg-red-100', text: 'text-red-700', icon: <Ban className="w-3 h-3" /> },
      cancelled: { bg: 'bg-slate-100', text: 'text-slate-700', icon: <XCircle className="w-3 h-3" /> },
    };
    const style = styles[status] || styles.pending_setup;
    const labels: Record<string, string> = {
      active: 'Ativo',
      pending_setup: 'Aguardando Setup',
      suspended: 'Suspenso',
      cancelled: 'Cancelado',
    };
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
        {style.icon}
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-500 rounded-lg">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold">SPL Admin</h1>
                <p className="text-xs text-slate-400">Painel Master</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-300">{user?.name || user?.email}</span>
              <button 
                onClick={onLogout}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                title="Sair"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'companies', label: 'Empresas', icon: Building2 },
              { id: 'users', label: 'Usuários', icon: Users },
              { id: 'settings', label: 'Configurações', icon: Settings },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as any)}
                className={`
                  flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors
                  ${activeView === tab.id 
                    ? 'border-teal-500 text-teal-600' 
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
                `}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Total Empresas</p>
                    <p className="text-3xl font-bold text-slate-900">{stats?.totalCompanies || 0}</p>
                  </div>
                  <div className="p-3 bg-teal-100 rounded-xl">
                    <Building2 className="w-6 h-6 text-teal-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <span className="text-green-600">{stats?.activeCompanies || 0} ativas</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-yellow-600">{stats?.pendingSetup || 0} pendentes</span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Total Usuários</p>
                    <p className="text-3xl font-bold text-slate-900">{stats?.totalUsers || 0}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <span className="text-green-600">{stats?.activeUsers || 0} ativos</span>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Convites Pendentes</p>
                    <p className="text-3xl font-bold text-slate-900">{stats?.pendingInvitations || 0}</p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-xl">
                    <Mail className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Empresas Suspensas</p>
                    <p className="text-3xl font-bold text-slate-900">{stats?.suspendedCompanies || 0}</p>
                  </div>
                  <div className="p-3 bg-red-100 rounded-xl">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Ações Rápidas</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => setShowNewCompanyModal(true)}
                  className="flex items-center gap-3 p-4 bg-teal-50 hover:bg-teal-100 rounded-xl transition-colors text-left"
                >
                  <div className="p-2 bg-teal-500 rounded-lg">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-teal-900">Nova Empresa</p>
                    <p className="text-sm text-teal-600">Cadastrar empresa contratante</p>
                  </div>
                </button>

                <button 
                  onClick={() => setActiveView('companies')}
                  className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-left"
                >
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-blue-900">Ver Empresas</p>
                    <p className="text-sm text-blue-600">Gerenciar empresas cadastradas</p>
                  </div>
                </button>

                <button 
                  onClick={fetchData}
                  className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-left"
                >
                  <div className="p-2 bg-slate-500 rounded-lg">
                    <RefreshCw className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Atualizar Dados</p>
                    <p className="text-sm text-slate-600">Recarregar informações</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Companies */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Empresas Recentes</h3>
                  <button 
                    onClick={() => setActiveView('companies')}
                    className="text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1"
                  >
                    Ver todas <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="divide-y divide-slate-100">
                {companies.slice(0, 5).map(company => (
                  <div key={company.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg">
                          <Building2 className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{company.razaoSocial}</p>
                          <p className="text-sm text-slate-500">{company.cnpj}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(company.status)}
                        <span className="text-sm text-slate-500">
                          {company.userCount} usuários
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {companies.length === 0 && (
                  <div className="p-8 text-center text-slate-500">
                    <Building2 className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p>Nenhuma empresa cadastrada</p>
                    <button 
                      onClick={() => setShowNewCompanyModal(true)}
                      className="mt-3 text-teal-600 hover:text-teal-700"
                    >
                      Cadastrar primeira empresa
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeView === 'companies' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Empresas</h2>
                <p className="text-slate-500">Gerencie as empresas contratantes</p>
              </div>
              <button
                onClick={() => setShowNewCompanyModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Nova Empresa
              </button>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome ou CNPJ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="all">Todos os status</option>
                <option value="active">Ativo</option>
                <option value="pending_setup">Aguardando Setup</option>
                <option value="suspended">Suspenso</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>

            {/* Companies List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Empresa</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Localização</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Usuários</th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCompanies.map(company => (
                    <tr key={company.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-900">{company.razaoSocial}</p>
                          <p className="text-sm text-slate-500">{company.cnpj}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <MapPin className="w-4 h-4" />
                          {company.city}/{company.state}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(company.status)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600">{company.userCount} usuários</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setSelectedCompany(company)}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Ver detalhes"
                          >
                            <Eye className="w-4 h-4 text-slate-500" />
                          </button>
                          {company.status === 'suspended' ? (
                            <button 
                              onClick={() => handleCompanyAction(company.id, 'activate')}
                              className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                              title="Ativar"
                            >
                              <Power className="w-4 h-4 text-green-600" />
                            </button>
                          ) : company.status === 'active' && (
                            <button 
                              onClick={() => handleCompanyAction(company.id, 'suspend')}
                              className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                              title="Suspender"
                            >
                              <Ban className="w-4 h-4 text-red-600" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredCompanies.length === 0 && (
                <div className="p-12 text-center text-slate-500">
                  <Building2 className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p>Nenhuma empresa encontrada</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeView === 'users' && (
          <div className="bg-white rounded-xl p-12 text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Gestão de Usuários</h3>
            <p className="text-slate-500">Em breve você poderá gerenciar todos os usuários da plataforma aqui.</p>
          </div>
        )}

        {activeView === 'settings' && (
          <div className="bg-white rounded-xl p-12 text-center">
            <Settings className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Configurações</h3>
            <p className="text-slate-500">Em breve você poderá configurar a plataforma aqui.</p>
          </div>
        )}
      </main>

      {/* New Company Modal */}
      {showNewCompanyModal && (
        <NewCompanyModal
          onClose={() => setShowNewCompanyModal(false)}
          onSubmit={handleCreateCompany}
        />
      )}

      {/* Company Detail Modal */}
      {selectedCompany && (
        <CompanyDetailModal
          company={selectedCompany}
          onClose={() => setSelectedCompany(null)}
          onAction={handleCompanyAction}
        />
      )}
    </div>
  );
};

interface NewCompanyModalProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const NewCompanyModal: React.FC<NewCompanyModalProps> = ({ onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cnpj: '',
    razaoSocial: '',
    nomeFantasia: '',
    email: '',
    phone: '',
    state: '',
    city: '',
    address: '',
    cnaePrincipal: '',
    adminEmail: '',
    adminName: '',
    slaTier: 'standard',
    billingEmail: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!formData.cnpj || !formData.razaoSocial || !formData.state || !formData.city || 
        !formData.cnaePrincipal || !formData.adminEmail || !formData.adminName) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }
    onSubmit(formData);
  };

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 18);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Nova Empresa</h2>
              <p className="text-sm text-slate-500">Passo {step} de 2</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
              <XCircle className="w-5 h-5 text-slate-500" />
            </button>
          </div>
          <div className="flex gap-2 mt-4">
            <div className={`flex-1 h-2 rounded-full ${step >= 1 ? 'bg-teal-500' : 'bg-slate-200'}`} />
            <div className={`flex-1 h-2 rounded-full ${step >= 2 ? 'bg-teal-500' : 'bg-slate-200'}`} />
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-medium text-slate-900 mb-4">Dados da Empresa</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">CNPJ *</label>
                  <input
                    type="text"
                    name="cnpj"
                    value={formData.cnpj}
                    onChange={(e) => setFormData({ ...formData, cnpj: formatCNPJ(e.target.value) })}
                    placeholder="00.000.000/0000-00"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">CNAE Principal *</label>
                  <input
                    type="text"
                    name="cnaePrincipal"
                    value={formData.cnaePrincipal}
                    onChange={handleChange}
                    placeholder="0000-0/00"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Razão Social *</label>
                <input
                  type="text"
                  name="razaoSocial"
                  value={formData.razaoSocial}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome Fantasia</label>
                <input
                  type="text"
                  name="nomeFantasia"
                  value={formData.nomeFantasia}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Estado *</label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">Selecione</option>
                    <option value="AM">AM</option>
                    <option value="PA">PA</option>
                    <option value="RO">RO</option>
                    <option value="RR">RR</option>
                    <option value="AC">AC</option>
                    <option value="AP">AP</option>
                    <option value="TO">TO</option>
                    <option value="MA">MA</option>
                    <option value="SP">SP</option>
                    <option value="RJ">RJ</option>
                    <option value="MG">MG</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cidade *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Telefone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-medium text-slate-900 mb-4">Administrador da Empresa</h3>
              <p className="text-sm text-slate-500 mb-4">
                O administrador receberá um email com link para criar sua conta e acessar o sistema.
              </p>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Administrador *</label>
                <input
                  type="text"
                  name="adminName"
                  value={formData.adminName}
                  onChange={handleChange}
                  placeholder="Nome completo"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email do Administrador *</label>
                <input
                  type="email"
                  name="adminEmail"
                  value={formData.adminEmail}
                  onChange={handleChange}
                  placeholder="admin@empresa.com.br"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div className="pt-4 border-t border-slate-200">
                <h4 className="font-medium text-slate-900 mb-4">Configurações do Contrato</h4>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nível SLA</label>
                  <select
                    name="slaTier"
                    value={formData.slaTier}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="basic">Básico</option>
                    <option value="standard">Padrão</option>
                    <option value="premium">Premium</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Observações</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Notas internas sobre o contrato..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-200 flex justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-slate-600 hover:text-slate-900"
            >
              Voltar
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-900"
            >
              Cancelar
            </button>
          )}
          
          {step < 2 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
            >
              Continuar
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Cadastrando...' : 'Cadastrar Empresa'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface CompanyDetailModalProps {
  company: Company;
  onClose: () => void;
  onAction: (companyId: string, action: 'activate' | 'suspend') => void;
}

const CompanyDetailModal: React.FC<CompanyDetailModalProps> = ({ company, onClose, onAction }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Detalhes da Empresa</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
              <XCircle className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-slate-100 rounded-xl">
              <Building2 className="w-8 h-8 text-slate-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900">{company.razaoSocial}</h3>
              {company.nomeFantasia && (
                <p className="text-sm text-slate-500">{company.nomeFantasia}</p>
              )}
              <p className="text-sm text-slate-500 mt-1">{company.cnpj}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Status</p>
              <div className="mt-1">
                {company.status === 'active' && <span className="text-green-600 font-medium">Ativo</span>}
                {company.status === 'pending_setup' && <span className="text-yellow-600 font-medium">Aguardando Setup</span>}
                {company.status === 'suspended' && <span className="text-red-600 font-medium">Suspenso</span>}
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">SLA</p>
              <p className="mt-1 font-medium capitalize">{company.slaTier}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Localização</p>
              <p className="mt-1">{company.city}/{company.state}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">CNAE</p>
              <p className="mt-1">{company.cnaePrincipal}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Usuários</p>
              <p className="mt-1">{company.userCount} cadastrados</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Administradores</p>
              <p className="mt-1">{company.adminCount}</p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
          {company.status === 'suspended' ? (
            <button
              onClick={() => { onAction(company.id, 'activate'); onClose(); }}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Power className="w-4 h-4" />
              Ativar Empresa
            </button>
          ) : company.status === 'active' && (
            <button
              onClick={() => { onAction(company.id, 'suspend'); onClose(); }}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <Ban className="w-4 h-4" />
              Suspender Empresa
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:text-slate-900"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default MasterDashboard;
