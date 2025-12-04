import React, { useState, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { Dashboard } from './components/Dashboard';
import { MasterDashboard } from './components/MasterDashboard';
import { SetupScreen } from './components/SetupScreen';
import { api, authApi, User } from '@lib/api';

type ViewMode = 'loading' | 'login' | 'setup' | 'master' | 'company' | 'invitation';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('loading');
  const [user, setUser] = useState<User | null>(null);
  const [invitationToken, setInvitationToken] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('invitation');
    if (token) {
      setInvitationToken(token);
      setViewMode('invitation');
      return;
    }

    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const refreshResponse = await authApi.refreshToken();
      if (refreshResponse.success && refreshResponse.data) {
        api.setAccessToken(refreshResponse.data.accessToken);
        
        const profileResponse = await authApi.getProfile();
        if (profileResponse.success && profileResponse.data) {
          const userData = profileResponse.data;
          setUser(userData);
          
          if (userData.globalRole === 'MASTER') {
            setViewMode('master');
          } else if (userData.memberships && userData.memberships.length > 0) {
            setViewMode('company');
          } else {
            setViewMode('login');
          }
          return;
        }
      }
    } catch {
      api.clearTokens();
    }
    
    checkForMasterSetup();
  };

  const checkForMasterSetup = async () => {
    try {
      const response = await fetch('/api/admin/setup-status');
      const data = await response.json();
      
      if (data.success && data.data.needsSetup) {
        setViewMode('setup');
      } else {
        setViewMode('login');
      }
    } catch {
      setViewMode('login');
    }
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    
    if (userData.globalRole === 'MASTER') {
      setViewMode('master');
    } else if (userData.memberships && userData.memberships.length > 0) {
      setViewMode('company');
    } else {
      setViewMode('login');
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
    } finally {
      api.clearTokens();
      setUser(null);
      setViewMode('login');
    }
  };

  const handleSetupComplete = (userData: User) => {
    setUser(userData);
    setViewMode('master');
  };

  const handleInvitationAccepted = (userData: User) => {
    window.history.replaceState({}, document.title, '/');
    setUser(userData);
    setViewMode('company');
  };

  if (viewMode === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">Carregando...</p>
        </div>
      </div>
    );
  }

  if (viewMode === 'setup') {
    return <SetupScreen onComplete={handleSetupComplete} />;
  }

  if (viewMode === 'invitation' && invitationToken) {
    return <InvitationScreen token={invitationToken} onAccepted={handleInvitationAccepted} onCancel={() => setViewMode('login')} />;
  }

  if (viewMode === 'master') {
    return <MasterDashboard user={user} onLogout={handleLogout} />;
  }

  if (viewMode === 'company') {
    return <Dashboard onLogout={handleLogout} user={user} />;
  }

  return <LoginScreen onLogin={handleLogin} />;
}

interface InvitationScreenProps {
  token: string;
  onAccepted: (user: User) => void;
  onCancel: () => void;
}

const InvitationScreen: React.FC<InvitationScreenProps> = ({ token, onAccepted, onCancel }) => {
  const [loading, setLoading] = useState(true);
  const [invitation, setInvitation] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInvitation();
  }, [token]);

  const fetchInvitation = async () => {
    try {
      const response = await fetch(`/api/auth/invitation/${token}`);
      const data = await response.json();
      
      if (data.success) {
        setInvitation(data.data);
      } else {
        setError(data.message || 'Convite inválido ou expirado');
      }
    } catch {
      setError('Erro ao carregar convite');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    
    if (password.length < 8) {
      setError('A senha deve ter no mínimo 8 caracteres');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/accept-invitation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });

      const data = await response.json();
      
      if (data.success) {
        api.setAccessToken(data.data.accessToken);
        onAccepted(data.data.user);
      } else {
        setError(data.message || 'Erro ao ativar conta');
      }
    } catch {
      setError('Erro ao processar solicitação');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">Verificando convite...</p>
        </div>
      </div>
    );
  }

  if (error && !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Convite Inválido</h2>
          <p className="text-slate-500 mb-6">{error}</p>
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
          >
            Ir para Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-600 to-emerald-700 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Bem-vindo ao SPL!</h1>
          <p className="text-slate-500 mt-2">
            Você foi convidado para <strong>{invitation?.companyName}</strong>
          </p>
          <p className="text-sm text-slate-400 mt-1">
            Função: <span className="capitalize">{invitation?.companyRole}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={invitation?.email || ''}
              disabled
              className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-lg text-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Criar Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Confirmar Senha</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Digite novamente"
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {submitting ? 'Ativando conta...' : 'Ativar Conta'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
