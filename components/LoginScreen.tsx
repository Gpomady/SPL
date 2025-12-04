import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, Leaf, Shield, CheckCircle } from 'lucide-react';
import { Logo } from './Logo';
import { authApi, api, ApiError, User } from '@lib/api';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [error, setError] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Preencha todos os campos');
      return;
    }

    if (isRegisterMode && !name) {
      setError('Informe seu nome');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = isRegisterMode
        ? await authApi.register(email, password, name)
        : await authApi.login({ email, password });
      
      if (response.success && response.data) {
        api.setAccessToken(response.data.accessToken);
        onLogin(response.data.user);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.errors) {
          const errorMessages = Object.values(err.errors).flat();
          setError(errorMessages.join('. '));
        } else {
          setError(err.message);
        }
      } else {
        setError('Erro ao conectar com o servidor');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setForgotSent(true);
    }, 1000);
  };

  const closeForgotModal = () => {
    setShowForgotPassword(false);
    setForgotEmail('');
    setForgotSent(false);
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left Side - Clean Branding */}
      <div className="hidden lg:flex w-1/2 relative bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-600 overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        {/* Floating shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-teal-300/10 rounded-full blur-2xl"></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 w-full">
          {/* Logo area */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Leaf className="w-5 h-5 text-emerald-300" />
              <span className="text-white/90 text-sm font-medium">Sustentabilidade Legal</span>
            </div>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
            Conformidade<br />
            <span className="text-emerald-300">Ambiental</span>
          </h1>
          
          <p className="text-white/70 text-lg max-w-md leading-relaxed mb-12">
            Simplifique o gerenciamento de obrigações legais e requisitos ambientais na região Norte.
          </p>

          {/* Feature list */}
          <div className="space-y-4">
            {[
              'Monitoramento de licenças ambientais',
              'Alertas automáticos de vencimentos',
              'Gestão de documentação integrada'
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-white/80">
                <div className="w-5 h-5 rounded-full bg-emerald-400/20 flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-emerald-300" />
                </div>
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>

          {/* Bottom badge */}
          <div className="absolute bottom-12 left-16 flex items-center gap-3 text-white/50 text-xs">
            <Shield className="w-4 h-4" />
            <span>Dados protegidos com criptografia de ponta</span>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Top bar with logo for mobile */}
        <div className="lg:hidden p-6 flex justify-center bg-teal-700">
          <Logo size="sm" variant="light" />
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-sm">
            {/* Desktop Logo */}
            <div className="hidden lg:block mb-10">
              <Logo size="md" />
            </div>

            {/* Welcome text */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                {isRegisterMode ? 'Criar conta' : 'Bem-vindo de volta'}
              </h2>
              <p className="text-slate-500 text-sm">
                {isRegisterMode 
                  ? 'Preencha os dados para criar sua conta' 
                  : 'Entre com suas credenciais para continuar'}
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {isRegisterMode && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Nome</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome completo"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                    autoComplete="name"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  autoComplete="email"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Senha</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all pr-12"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Forgot password link */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors"
                >
                  Esqueceu a senha?
                </button>
              </div>

              {/* Submit button */}
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-teal-600/20 hover:shadow-teal-600/30 disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    {isRegisterMode ? 'Criar conta' : 'Entrar'}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Toggle register/login */}
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">
                {isRegisterMode ? 'Já tem uma conta?' : 'Não tem conta?'}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(!isRegisterMode);
                    setError('');
                  }}
                  className="text-teal-600 hover:text-teal-700 font-medium transition-colors"
                >
                  {isRegisterMode ? 'Entrar' : 'Criar conta'}
                </button>
              </p>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-xs text-slate-400">
                © {new Date().getFullYear()} SPL Amazônia · Todos os direitos reservados
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in">
            {!forgotSent ? (
              <>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Recuperar senha</h3>
                <p className="text-slate-500 text-sm mb-6">
                  Digite seu e-mail e enviaremos instruções para redefinir sua senha.
                </p>

                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">E-mail cadastrado</label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                      autoFocus
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeForgotModal}
                      className="flex-1 py-3 px-4 border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading || !forgotEmail}
                      className="flex-1 py-3 px-4 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        'Enviar'
                      )}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">E-mail enviado!</h3>
                <p className="text-slate-500 text-sm mb-6">
                  Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
                </p>
                <button
                  onClick={closeForgotModal}
                  className="w-full py-3 px-4 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 transition-colors"
                >
                  Voltar ao login
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
