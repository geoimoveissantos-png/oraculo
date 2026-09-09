import React, { useState } from 'react';
import { UserInputs } from '../types';
import { Sparkles, Calendar, Clock, User, ArrowRight, Wand2 } from 'lucide-react';

interface NumerologyFormProps {
  onSubmit: (inputs: UserInputs) => void;
  isLoading?: boolean;
}

export const NumerologyForm: React.FC<NumerologyFormProps> = ({ onSubmit, isLoading }) => {
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = fullName.trim();
    if (!trimmedName || trimmedName.length < 3) {
      setError('Por favor, informe seu nome completo de nascimento (mínimo 3 caracteres).');
      return;
    }

    if (!birthDate) {
      setError('Por favor, selecione sua data de nascimento.');
      return;
    }

    onSubmit({
      fullName: trimmedName,
      birthDate,
      birthTime: birthTime || undefined,
    });
  };

  const handleFillSample = () => {
    setFullName('Helena Beatriz dos Santos');
    setBirthDate('1992-07-15');
    setBirthTime('14:30');
    setError(null);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="relative rounded-2xl bg-gradient-to-b from-[#16182c] to-[#0f101f] border border-amber-500/30 p-6 sm:p-8 shadow-2xl shadow-purple-950/40">
        {/* Mystic Top Accent Line */}
        <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-48 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs mb-3 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Frequência Sagrada Pitagórica</span>
          </div>

          <h1 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
            Descubra Seu Destino & <br />
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-300 bg-clip-text text-transparent">
              Diagnóstico de Prosperidade
            </span>
          </h1>

          <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
            Calcule sua assinatura cósmica através das letras do seu nome e vibração do seu nascimento.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs sm:text-sm">
              {error}
            </div>
          )}

          {/* Full Name */}
          <div className="space-y-1.5">
            <label htmlFor="input-full-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Nome Completo de Nascimento <span className="text-amber-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <User className="w-4 h-4 text-amber-400/80" />
              </div>
              <input
                id="input-full-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ex: Carlos Eduardo de Oliveira"
                className="w-full pl-10 pr-4 py-3 bg-[#0d0e1c] border border-slate-700/80 focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/40 rounded-xl text-white placeholder-slate-500 text-sm transition-all outline-none"
                required
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Use o nome exato da certidão de nascimento para a correta vibração das letras.
            </p>
          </div>

          {/* Birth Date & Birth Time Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Birth Date */}
            <div className="space-y-1.5">
              <label htmlFor="input-birth-date" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Data de Nascimento <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Calendar className="w-4 h-4 text-amber-400/80" />
                </div>
                <input
                  id="input-birth-date"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#0d0e1c] border border-slate-700/80 focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/40 rounded-xl text-white text-sm transition-all outline-none scheme-dark"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Determina o Caminho de Vida e Ano Pessoal.
              </p>
            </div>

            {/* Birth Time */}
            <div className="space-y-1.5">
              <label htmlFor="input-birth-time" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Hora de Nascimento <span className="text-slate-500 font-normal text-[11px]">(Opcional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Clock className="w-4 h-4 text-purple-400/80" />
                </div>
                <input
                  id="input-birth-time"
                  type="time"
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#0d0e1c] border border-slate-700/80 focus:border-purple-400/80 focus:ring-1 focus:ring-purple-400/40 rounded-xl text-white text-sm transition-all outline-none scheme-dark"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Refina as horas de poder e sorte diárias.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 space-y-3">
            <button
              id="btn-submit-generate"
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-[#0f101f] font-bold text-sm tracking-wide uppercase transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
            >
              <span>{isLoading ? 'Calculando Frequências...' : 'Gerar Prévia Gratuita'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleFillSample}
                className="text-xs text-amber-400/90 hover:text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer py-1"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Preencher Exemplo Rápido</span>
              </button>

              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                🔒 Seus dados são confidenciais
              </span>
            </div>
          </div>
        </form>

        {/* Feature Highlights Pills */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center text-[11px] text-slate-400">
          <div className="p-2 rounded-lg bg-[#0d0e1b]/60 border border-slate-800">
            <span className="block text-amber-400 font-semibold mb-0.5">Caminho de Vida</span>
            <span>Missão de Alma</span>
          </div>
          <div className="p-2 rounded-lg bg-[#0d0e1b]/60 border border-slate-800">
            <span className="block text-amber-400 font-semibold mb-0.5">Prosperidade</span>
            <span>Códigos & Bloqueios</span>
          </div>
          <div className="p-2 rounded-lg bg-[#0d0e1b]/60 border border-slate-800">
            <span className="block text-amber-400 font-semibold mb-0.5">Ano Pessoal</span>
            <span>Ciclos de Dinheiro</span>
          </div>
        </div>
      </div>
    </div>
  );
};
