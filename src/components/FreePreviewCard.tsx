import React from 'react';
import { NumerologyReport } from '../types';
import { Sparkles, Lock, ArrowRight, ShieldCheck, CheckCircle2, TrendingUp, Zap, FileText, ChevronRight, Volume2 } from 'lucide-react';
import { AuraCaptureSection } from './AuraCaptureSection';
import { PreviewAudioReader } from './PreviewAudioReader';

interface FreePreviewCardProps {
  report: NumerologyReport;
  onUnlockClick: () => void;
  onEditClick: () => void;
  onUpdateReport?: (updatedReport: NumerologyReport) => void;
}

export const FreePreviewCard: React.FC<FreePreviewCardProps> = ({
  report,
  onUnlockClick,
  onEditClick,
  onUpdateReport
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#171930] via-[#1c1f3c] to-[#171930] border border-amber-500/30 p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Prévia Gratuita Gerada com Sucesso</span>
            </div>
            <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
              Mapa de {report.user.fullName}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Nascido(a) em {report.user.formattedDate} {report.user.birthTime && `às ${report.user.birthTime}`} • Código Cósmico: {report.referralId}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const btn = document.getElementById('btn-ouvir-previa');
                if (btn) {
                  btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  btn.click();
                }
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-[#0b0c16] font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              title="Ouvir a narração completa da prévia com voz feminina do Google"
            >
              <Volume2 className="w-4 h-4 text-[#0b0c16]" />
              <span>OUVIR</span>
            </button>

            <button
              onClick={onEditClick}
              className="text-xs text-slate-400 hover:text-amber-300 underline underline-offset-4 cursor-pointer transition-colors"
            >
              Alterar dados
            </button>
          </div>
        </div>
      </div>

      {/* NARRATION AUDIO PLAYER: Voz Feminina do Google (Botão OUVIR) */}
      <PreviewAudioReader report={report} />

      {/* REVEALED SECTION: Caminho de Vida (Full Value Delivered) */}
      <div className="rounded-2xl bg-[#111322] border-2 border-amber-500/40 p-6 sm:p-8 relative shadow-2xl">
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">
              Revelação Liberada: Frequência Principal
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono">100% Gratuito</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Life Path Number Badge */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-[#181a33] to-[#0f101e] border border-amber-500/30 text-center relative">
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300/90 mb-2">
              Caminho de Vida
            </div>

            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500/20 via-purple-600/30 to-amber-300/20 border-2 border-amber-400/80 flex items-center justify-center shadow-lg shadow-amber-500/10 mb-3 relative">
              <span className="font-cinzel text-4xl font-extrabold text-amber-300">
                {report.lifePath.number}
              </span>
              {report.lifePath.isMaster && (
                <span className="absolute -top-1.5 -right-1.5 px-2 py-0.5 rounded-full bg-purple-600 text-[10px] text-white font-bold tracking-wider">
                  MESTRE
                </span>
              )}
            </div>

            <h3 className="font-cinzel font-bold text-white text-base sm:text-lg">
              {report.lifePath.name}
            </h3>

            <p className="text-xs text-amber-400 font-medium mt-1">
              Arquétipo: {report.lifePath.archetype}
            </p>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 font-mono text-center">
              {report.lifePath.calculationExplanation}
            </div>
          </div>

          {/* Life Path Details */}
          <div className="lg:col-span-8 space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Essência & Propósito Cósmico
              </h4>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-light">
                {report.lifePath.essence}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-[#16182c] border border-slate-800">
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 mb-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Forças de Liderança
                </span>
                <ul className="text-xs text-slate-300 space-y-1">
                  {report.lifePath.strengths.slice(0, 3).map((st, i) => (
                    <li key={i}>• {st}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-[#16182c] border border-slate-800">
                <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5 mb-1.5">
                  <TrendingUp className="w-3.5 h-3.5" /> Impacto na Prosperidade
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {report.lifePath.prosperityImpact}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AURA SCANNER SECTION: Degustação Gratuita com Câmera Frontal Opcional */}
      <AuraCaptureSection
        report={report}
        onUpdateReport={onUpdateReport || (() => {})}
        onUnlockClick={onUnlockClick}
      />

      {/* SNEAK PEEK: Diagnóstico de Prosperidade & Potencial */}
      <div className="rounded-2xl bg-gradient-to-b from-[#131525] to-[#0f101c] border border-purple-500/30 p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-purple-500/20 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="font-cinzel text-base sm:text-lg font-bold text-white">
              Diagnóstico de Prosperidade & Potencial de Abundância
            </span>
          </div>
          <span className="text-[11px] px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 font-medium border border-purple-500/30">
            Prévia Parcial
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Score Gauge */}
          <div className="p-5 rounded-2xl bg-[#0e0f1a] border border-amber-500/20 text-center flex flex-col items-center justify-center">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-2">
              Pontuação Vibracional
            </div>
            <div className="w-24 h-24 rounded-full border-4 border-amber-400/80 bg-amber-500/10 flex flex-col items-center justify-center shadow-lg shadow-amber-500/15">
              <span className="text-3xl font-extrabold text-amber-300 font-cinzel">
                {report.prosperity.score}
              </span>
              <span className="text-[10px] text-amber-400/80 font-bold">/ 100</span>
            </div>
            <span className="text-xs text-emerald-400 font-medium mt-2">
              Altíssimo Potencial de Riqueza
            </span>
          </div>

          {/* Archetype & Teaser */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                Arquétipo de Prosperidade Identificado:
              </span>
              <h4 className="font-cinzel text-lg font-bold text-white mt-0.5">
                {report.prosperity.archetype}
              </h4>
              <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                {report.prosperity.archetypeDescription}
              </p>
            </div>

            {/* Blurred lock teaser */}
            <div className="relative rounded-xl p-4 bg-[#0a0b14] border border-slate-800 overflow-hidden">
              <div className="blur-xs select-none space-y-2 text-xs text-slate-500">
                <p>🔒 Bloqueio Financeiro Oculto: Padrão ancestral identificado na linha materna...</p>
                <p>🔒 Códigos Sagrados de Prosperidade: Ativação quântica 520 741 8 com mantra diário...</p>
                <p>🔒 Ano Pessoal {report.personalYear.yearNumber}: Previsão de lucros nos trimestres 2 e 3...</p>
              </div>

              <div className="absolute inset-0 bg-[#0a0b14]/75 backdrop-blur-[2px] flex items-center justify-center">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 bg-amber-950/70 border border-amber-500/40 px-3.5 py-1.5 rounded-full shadow-lg">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Desbloqueie para ler os Bloqueios e Códigos de Ativação</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LOCKED SECTIONS PREVIEW GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Expressão */}
        <div className="rounded-xl bg-[#121324] border border-slate-800 p-4 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Número de Expressão
            </span>
            <Lock className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-900/40 border border-purple-500/30 flex items-center justify-center font-cinzel text-lg font-bold text-purple-300">
              ?
            </div>
            <div>
              <p className="text-xs font-medium text-slate-200">Soma de todas as letras</p>
              <p className="text-[11px] text-slate-400">Seu potencial vocacional máximo</p>
            </div>
          </div>
        </div>

        {/* Desejo da Alma */}
        <div className="rounded-xl bg-[#121324] border border-slate-800 p-4 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Desejo da Alma
            </span>
            <Lock className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-900/40 border border-amber-500/30 flex items-center justify-center font-cinzel text-lg font-bold text-amber-300">
              ?
            </div>
            <div>
              <p className="text-xs font-medium text-slate-200">Soma das vogais</p>
              <p className="text-[11px] text-slate-400">O que verdadeiramente motiva sua alma</p>
            </div>
          </div>
        </div>

        {/* Personalidade */}
        <div className="rounded-xl bg-[#121324] border border-slate-800 p-4 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Personalidade Externa
            </span>
            <Lock className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center font-cinzel text-lg font-bold text-slate-300">
              ?
            </div>
            <div>
              <p className="text-xs font-medium text-slate-200">Soma das consoantes</p>
              <p className="text-[11px] text-slate-400">Sua imagem magnética no mundo</p>
            </div>
          </div>
        </div>
      </div>

      {/* MONETIZATION / PAYWALL CALLOUT (Step 3 Trigger) */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-500/10 via-purple-600/15 to-amber-500/10 border-2 border-amber-400/70 p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-[#0b0c16] text-xs font-extrabold uppercase tracking-wider shadow-md">
            <span>Apenas R$ 15,00 • Acesso Vitalício</span>
          </div>

          <h3 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-white">
            Desbloqueie Seu Mapa Completo & <br />
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
              Baixe o Relatório Completo em PDF (8 Páginas A4)
            </span>
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
            Descubra todos os números ocultos, a <strong>otimização do seu nome para o Número 8</strong>, manual da assinatura de poder, <strong>banhos energéticos ancestrais</strong>, frequências de Solfeggio, selos sagrados, <strong>promessas bíblicas de fartura</strong> e o <strong>guia exclusivo de leituras inspiradoras</strong>.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-300 py-2">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4" /> Pagamento Instantâneo via Pix
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4" /> Liberação Automática Imediata
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4" /> PDF Luxo A4 com Selos Sagrados & Bíblicos
            </span>
          </div>

          <div className="pt-2">
            <button
              id="btn-unlock-pix"
              onClick={onUnlockClick}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-[#0b0c16] font-extrabold text-base tracking-wide uppercase transition-all shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 flex items-center justify-center gap-3 mx-auto cursor-pointer group"
            >
              <span>Desbloquear Relatório Completo por R$ 15,00</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>

          <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            Ambiente Seguro • Chave Pix Oficial com Confirmação Imediata
          </p>
        </div>
      </div>
    </div>
  );
};
