import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from './Input';
import { Button } from './Button';
import { Logo } from './Logo';

interface LoginScreenProps {
  onLogin: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('compras@grupomady.com.br');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate network request
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1200);
  };

  return (
    <div className="min-h-screen flex w-full bg-slate-50">
      {/* Left Side - Visual / Branding */}
      <div className="hidden lg:flex w-7/12 relative bg-[#0f172a] overflow-hidden items-center justify-center">
        {/* Background Image with Overlay - Amazon Theme */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 transform scale-105"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1596395819057-d37f71ca8eb5?q=80&w=2070&auto=format&fit=crop')` // Amazon Rainforest / River texture
          }}
        ></div>
        {/* Gradient: Deep Green to Teal */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#064e3b] to-[#0f766e] opacity-85 mix-blend-multiply"></div>
        
        {/* Text Content */}
        <div className="relative z-10 p-16 max-w-2xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="h-24 w-24 border-2 border-emerald-300/30 rounded-full flex items-center justify-center backdrop-blur-md bg-white/10 shadow-lg">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-emerald-100 w-12 h-12">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 8L2 22" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.5 15H9" />
                </svg>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6 leading-tight">
            Conformidade Ambiental <br/>
            <span className="text-emerald-300">na Amazônia</span>
          </h2>
          <div className="h-1 w-24 bg-emerald-500 mx-auto mb-8 rounded-full"></div>
          <p className="text-emerald-50 text-lg font-light leading-relaxed max-w-xl mx-auto">
            Licenciamento, Gestão de Resíduos e Monitoramento Legal com foco na sustentabilidade e especificidades da região Norte.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-5/12 flex flex-col items-center justify-center p-8 bg-white shadow-2xl z-20">
        <div className="w-full max-w-[360px] space-y-8">
          
          <div className="flex justify-center mb-6">
            <Logo size="md" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail"
              required
            />
            
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              required
              icon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:text-[#0f766e] transition-colors focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />

            <Button 
              type="submit" 
              fullWidth 
              size="lg" 
              isLoading={isLoading}
              className="h-12 shadow-emerald-900/10"
            >
              Acessar
            </Button>

            <div className="text-center pt-2">
              <a href="#" className="text-sm text-[#0f766e] hover:text-[#0d6e66] font-medium transition-colors">
                Esqueci minha senha
              </a>
            </div>
          </form>

          <div className="pt-12 text-center">
            <p className="text-xs text-slate-400">
              © {new Date().getFullYear()} SPL Amazônia. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};