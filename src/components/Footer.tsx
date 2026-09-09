import React from 'react';
import { Compass, ShieldCheck, Sparkles, Lock } from 'lucide-react';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  return (
    <footer id="app-footer" className="mt-20 border-t border-slate-800/80 bg-[#080913] py-12 text-slate-400 text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3 text-center md:text-left">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <span className="font-cinzel text-sm font-bold text-white tracking-wider block">
              MAPA NUMEROLÓGICO & DIAGNÓSTICO DE PROSPERIDADE
            </span>
            <span className="text-[11px] text-slate-400">
              Sistema Pitagórico de Análise Vibracional e Frequências de Abundância
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            Pagamento Seguro via Pix
          </span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            Exportação em Alta Resolução PDF
          </span>
        </div>

        <div className="flex items-center gap-4 text-center md:text-right text-[11px] text-slate-400">
          <span>© {new Date().getFullYear()} Todos os direitos reservados.</span>
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-amber-400 transition-colors cursor-pointer"
              title="Acesso Administrativo"
            >
              <Lock className="w-3 h-3" />
              <span>Painel Admin</span>
            </button>
          )}
        </div>
      </div>
    </footer>
  );
};

