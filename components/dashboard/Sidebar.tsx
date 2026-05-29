import React from 'react';
import { LayoutDashboard, Pill, Database, LogOut, ShieldAlert, Award, FileText } from 'lucide-react';
import Badge from '../ui/Badge';

interface SidebarProps {
  currentView: 'landing' | 'dashboard' | 'producto';
  selectedProductId?: string | null;
  onNavigate: (view: 'landing' | 'dashboard' | 'producto', productId?: string | null) => void;
  userEmail?: string;
}

export default function Sidebar({ currentView, selectedProductId, onNavigate, userEmail = 'visitante@pharmabrand.es' }: SidebarProps) {
  return (
    <aside className="w-64 bg-[#1A1D2E] border-r border-[#8892b01a] flex flex-col justify-between h-full shrink-0">
      
      {/* Top Section */}
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-[#8892b01a] flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#00C9A7] flex items-center justify-center">
            <svg className="w-5 h-5 text-[#0F1117]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <div>
            <h1 className="text-md font-bold text-white tracking-wider font-display leading-tight">
              linea-gastro
            </h1>
            <span className="text-[10px] text-[#00C9A7] font-mono font-medium tracking-widest uppercase block">LÍNEA GASTRO</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1">
          
          <button
            onClick={() => onNavigate('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left cursor-pointer ${
              currentView === 'dashboard'
                ? 'bg-[#00C9A71a] text-[#00C9A7] font-medium border border-[#00C9A71a]'
                : 'text-gray-400 hover:text-white hover:bg-[#8892b00a] border border-transparent'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-sm">Dashboard</span>
          </button>

          <button
            onClick={() => onNavigate('dashboard')} // dashboard acts as general, but highlights catalog as well
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-left text-gray-400 hover:text-white hover:bg-[#8892b00a] border border-transparent cursor-pointer"
          >
            <span className="flex items-center gap-3">
              <Pill className="w-4 h-4" />
              <span className="text-sm">Productos</span>
            </span>
            <span className="text-[10px] font-mono bg-[#8892b01a] text-[#8892b0] px-2 py-0.5 rounded-full">10 Meds</span>
          </button>
        </nav>
      </div>

      {/* Bottom User Section */}
      <div className="p-4 border-t border-[#8892b01a] space-y-4">
        
        {/* Connection status card */}
        <div className="bg-[#0F1117] border border-[#8892b01a] rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-semibold tracking-wider text-gray-300 uppercase">Estado Conexión</span>
          </div>
          <p className="text-[11px] text-[#8892b0] leading-normal font-light">
            Ejecutando en modo <span className="text-[#00C9A7] font-semibold">Demo Persistente</span> con seed inicial SQL.
          </p>
        </div>

        {/* User profile dropdown action */}
        <div className="flex items-center justify-between gap-3 bg-[#0F1117]/30 p-2 rounded-xl border border-[#8892b01a]">
          <div className="min-w-0">
            <p className="text-[11px] text-gray-400 font-mono truncate">{userEmail}</p>
            <span className="text-[9px] text-[#00C9A7] font-bold tracking-wider uppercase font-mono">Delegado Farma</span>
          </div>
          <button
            onClick={() => onNavigate('landing')}
            className="text-gray-500 hover:text-rose-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/10 cursor-pointer"
            title="Cerrar Sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

    </aside>
  );
}
