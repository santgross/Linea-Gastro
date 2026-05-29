'use client';

import React, { useState } from 'react';
import { Pill, ShieldCheck, FileSpreadsheet, Lock, Activity, Eye, EyeOff, Award } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Button from '../components/ui/Button';

export default function LandingPage() {
  const router = useRouter();
  const [email, setEmail] = useState('santgross@gmail.com');
  const [password, setPassword] = useState('pharmabrand2026');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    setTimeout(() => {
      if (email.trim() && password.length >= 4) {
        localStorage.setItem('fg_user_email', email);
        router.push('/dashboard');
      } else {
        setErrorMessage('Credenciales no válidas. Ingrese un email y contraseña realistas.');
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#0F1117] flex flex-col justify-between overflow-x-hidden relative font-sans text-gray-200">
      
      {/* Decorative background glow accents */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-[#00C9A7]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Header Bar */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-[#8892b01a] backdrop-blur-md bg-[#0F1117]/60 z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#00C9A7] flex items-center justify-center">
            <svg className="w-5 h-5 text-[#0F1117]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-widest font-display leading-tight">
              linea-gastro
            </h1>
            <span className="text-[10px] text-[#00C9A7] font-mono font-medium block uppercase tracking-widest">LÍNEA GASTRO</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-gray-400">
          <span>v15.0 App Router</span>
          <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#00C9A7] animate-pulse" />
          <span className="hidden sm:inline-block">Plataforma Médica Homologada</span>
        </div>
      </header>

      {/* Hero & Login Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
        
        {/* Left Side: Pharmaceutical Pitch and Catalog Highlight */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 bg-[#00C9A71a] border border-[#00C9A733] rounded-full px-3 py-1 text-xs text-[#00C9A7] font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Auditoría de Prescripciones Médicas</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white font-display leading-tight">
            Control Intuitivo para la <br />
            <span className="text-[#00C9A7]">Línea Gastro</span> de Pharmabrand
          </h2>

          <p className="text-gray-400 text-base font-light leading-relaxed max-w-xl">
            Herramienta analítica de inteligencia competitiva para delegados farmacéuticos. Realice seguimiento a prescripciones mensuales (Rx), participación de mercado (Share) y evolución anual móvil (TAM) contra marcas de la competencia.
          </p>

          {/* Quick value props */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 max-w-lg">
            <div className="flex items-start gap-3 bg-[#1A1D2E]/40 border border-[#8892b01a] rounded-xl p-4">
              <Activity className="w-5 h-5 text-[#00C9A7] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-display">Sinergía Médica</h4>
                <p className="text-xs text-[#8892b0] mt-1 font-light">Evolución de fórmulas basadas en Omeprazol, Sucralfato y Psyllium.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 bg-[#1A1D2E]/40 border border-[#8892b01a] rounded-xl p-4">
              <FileSpreadsheet className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-display">Clases ATC Propias</h4>
                <p className="text-xs text-[#8892b0] mt-1 font-light font-sans">Visualice submercados del tracto alimentario y metabolismo con exactitud.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Secure Login Panel */}
        <div className="lg:col-span-5 bg-[#1A1D2E] border border-[#8892b01a] rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00C9A7]/5 rounded-bl-full pointer-events-none" />

          <div className="space-y-2 mb-6 text-left">
            <h3 className="text-xl font-bold text-white tracking-wide font-display">Acceso Profesional</h3>
            <p className="text-xs text-[#8892b0] font-light">Ingrese sus credenciales de delegado para acceder al panel farma.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            
            {errorMessage && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-lg text-xs font-mono">
                {errorMessage}
              </div>
            )}

            <div className="space-y-1.5 text-left">
              <label className="text-xs font-medium text-gray-400">Usuario Delegado / Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@pharmabrand.es"
                  className="w-full bg-[#0F1117] border border-[#8892b022] rounded-xl p-3 pl-4 pr-10 text-white text-sm focus:outline-none focus:border-[#00C9A7]/55"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-gray-400">Contraseña de Acceso</label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0F1117] border border-[#8892b022] rounded-xl p-3 pl-4 pr-10 text-white text-sm focus:outline-none focus:border-[#00C9A7]/55"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-gray-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3.5 font-bold mt-4"
              disabled={loading}
            >
              {loading ? 'Verificando firma...' : 'Iniciar Sesión e Ingresar'}
            </Button>

            <div className="text-center pt-2">
              <div className="text-[11px] text-[#8892b0] font-mono leading-relaxed bg-[#0F1117]/40 p-2.5 rounded-lg border border-[#8892b01a]">
                🔒 Credenciales preestablecidas para demostración cómoda de AI Studio.
              </div>
            </div>

          </form>
        </div>

      </main>

      {/* Footer System Credits */}
      <footer className="border-t border-[#8892b01a] py-6 px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 font-mono gap-4">
        <span>&copy; 2026 Pharmabrand S.A. Todos los derechos reservados.</span>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-white transition-colors">Aviso de Farmacovigilancia</a>
          <span className="text-gray-700 font-bold">•</span>
          <a href="#" className="hover:text-white transition-colors">Uso Interno</a>
        </div>
      </footer>

    </div>
  );
}
