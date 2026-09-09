import React from 'react';
import { Sparkles, Compass, ShieldCheck, Shield } from 'lucide-react';

interface HeaderProps {
  onNewCalculation?: () => void;
  isUnlocked?: boolean;
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNewCalculation, isUnlocked, onOpenAdmin }) => {
  return (
    <header id="app-header" className="border-b border-amber-500/20 bg-[#0c0e1b]/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div 
          onClick={onNewCalculation}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500/20 via-purple-600/20 to-amber-400/10 border border-amber-500/40 flex items-center justify-center shadow-lg shadow-amber-500/5 group-hover:border-amber-400 transition-all">
            <Compass className="w-6 h-6 text-amber-400 group-hover:rotate-45 transition-transform duration-500" />
            <Sparkles className="w-3 h-3 text-amber-300 absolute -top-1 -right-1 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-lg sm:text-xl font-bold tracking-wider bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent">
                MAPA NUMEROLÓGICO
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 tracking-wide font-light flex items-center gap-1.5">
              <span>Diagnóstico de Prosperidade & Códigos Cósmicos</span>
            </p>
          </div>
        </div>

        {/* Right Status / Badge & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isUnlocked ? (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Acesso Completo Liberado</span>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-950/40 border border-purple-500/30 text-purple-300 text-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Sistema Pitagórico Sagrado</span>
            </div>
          )}

          {onNewCalculation && (
            <button
              onClick={onNewCalculation}
              id="header-new-calc-btn"
              className="text-xs text-slate-300 hover:text-amber-300 border border-slate-700/80 hover:border-amber-500/40 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            >
              Novo Mapa
            </button>
          )}

          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              id="header-admin-btn"
              className="flex items-center gap-1.5 text-xs text-amber-300/90 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-500/50 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
              title="Ambiente Administrativo (Login, Status de Pagamentos e Emissões)"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-medium">Painel Admin</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

