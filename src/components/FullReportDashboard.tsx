import React, { useState } from 'react';
import { NumerologyReport, SoundFrequency } from '../types';
import { generatePDF } from '../utils/pdfGenerator';
import { calculateAuraProfile, getFrequencyYouTubeInfo } from '../utils/numerology';
import { recordReportEmission, updateOrderContact } from '../utils/adminStorage';
import { PdfVerificationModal } from './PdfVerificationModal';
import { 
  Download, 
  Share2, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Compass, 
  Target, 
  Heart, 
  UserCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Key, 
  Zap,
  Award,
  ChevronRight,
  Printer,
  PenTool,
  Droplets,
  Volume2,
  BookOpen,
  Scroll,
  Shield,
  Star,
  Radio,
  Camera,
  Sun,
  Library,
  Play,
  ExternalLink,
  X
} from 'lucide-react';
import { getRecommendedBooksForReport, generateBookCoverDataUrl } from '../utils/bookRecommendations';

interface FullReportDashboardProps {
  report: NumerologyReport;
  onOpenShare: () => void;
  onNewCalculation: () => void;
}

export const FullReportDashboard: React.FC<FullReportDashboardProps> = ({
  report,
  onOpenShare,
  onNewCalculation,
}) => {
  const [activeTab, setActiveTab] = useState<'essence' | 'prosperity' | 'name_opt' | 'baths_sound' | 'sacred_symbols' | 'career' | 'year' | 'books'>('essence');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isPdfVerified, setIsPdfVerified] = useState(() => {
    try {
      return localStorage.getItem(`pdf_verified_${report.referralId}`) === 'true';
    } catch {
      return false;
    }
  });
  const [selectedFrequency, setSelectedFrequency] = useState<SoundFrequency | null>(null);
  const [recommendedBooks, setRecommendedBooks] = useState(() => getRecommendedBooksForReport(report));

  const performDownload = () => {
    setIsDownloading(true);
    try {
      generatePDF(report, recommendedBooks);
      recordReportEmission(report, 'pago');
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setTimeout(() => setIsDownloading(false), 1000);
    }
  };

  const handleDownloadPDF = () => {
    // Only ask for email or whatsapp confirmation after Pix confirmation when downloading the PDF
    if (!isPdfVerified) {
      setIsVerificationModalOpen(true);
      return;
    }
    performDownload();
  };

  const handleVerificationSuccess = (contact: { email?: string; phone?: string }) => {
    if (contact.email) {
      report.user.email = contact.email;
    }
    if (contact.phone) {
      report.user.phone = contact.phone;
    }
    updateOrderContact(report.referralId, contact.email, contact.phone);
    setIsPdfVerified(true);
    performDownload();
  };


  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Banner: Unlocked Access & Primary Actions */}
      <div className="rounded-2xl bg-gradient-to-r from-[#171932] via-[#1f2347] to-[#171932] border-2 border-amber-500/50 p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Acesso Completo Vitalício Liberado</span>
            </div>

            <h1 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-white">
              Mapa Numerológico de {report.user.fullName}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Nascido(a) em {report.user.formattedDate} {report.user.birthTime && `às ${report.user.birthTime}`} • Caminho de Vida {report.lifePath.number} • Ano Pessoal {report.personalYear.yearNumber}
            </p>
          </div>

          {/* Download and Share CTAs */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <button
              id="btn-download-pdf-main"
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="flex-1 sm:flex-initial py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-[#0b0c16] font-bold text-sm tracking-wide transition-all shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'Gerando PDF Oficial...' : 'Baixar Relatório Completo em PDF'}</span>
            </button>

            <button
              id="btn-open-share-modal"
              onClick={onOpenShare}
              className="py-3.5 px-4 rounded-xl bg-[#121426] hover:bg-slate-800/90 border border-slate-700 text-slate-200 text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
              title="Compartilhar & Gerar Stories"
            >
              <Share2 className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Compartilhar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Core Numbers Overview Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Life Path */}
        <div 
          onClick={() => setActiveTab('essence')}
          className="p-4 rounded-xl bg-[#121428] border border-amber-500/40 hover:border-amber-400 cursor-pointer transition-all group"
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/90 block mb-1">
            Caminho de Vida
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-cinzel text-2xl font-bold text-white group-hover:text-amber-300 transition-colors">
              {report.lifePath.number}
            </span>
            {report.lifePath.isMaster && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-950 border border-purple-500/40 text-purple-300 font-bold">
                Mestre
              </span>
            )}
          </div>
          <span className="text-xs text-slate-400 truncate block mt-1">
            {report.lifePath.archetype}
          </span>
        </div>

        {/* Expression */}
        <div 
          onClick={() => setActiveTab('essence')}
          className="p-4 rounded-xl bg-[#121428] border border-slate-800 hover:border-amber-500/40 cursor-pointer transition-all group"
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block mb-1">
            Número de Expressão
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-cinzel text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">
              {report.expression.number}
            </span>
          </div>
          <span className="text-xs text-slate-400 truncate block mt-1">
            Potencial Vocacional
          </span>
        </div>

        {/* Soul Urge */}
        <div 
          onClick={() => setActiveTab('essence')}
          className="p-4 rounded-xl bg-[#121428] border border-slate-800 hover:border-amber-500/40 cursor-pointer transition-all group"
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block mb-1">
            Desejo da Alma
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-cinzel text-2xl font-bold text-white group-hover:text-amber-300 transition-colors">
              {report.soulUrge.number}
            </span>
          </div>
          <span className="text-xs text-slate-400 truncate block mt-1">
            Motivação Oculta
          </span>
        </div>

        {/* Personality */}
        <div 
          onClick={() => setActiveTab('essence')}
          className="p-4 rounded-xl bg-[#121428] border border-slate-800 hover:border-amber-500/40 cursor-pointer transition-all group"
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 block mb-1">
            Personalidade
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-cinzel text-2xl font-bold text-white group-hover:text-teal-300 transition-colors">
              {report.personality.number}
            </span>
          </div>
          <span className="text-xs text-slate-400 truncate block mt-1">
            Primeira Impressão
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('essence')}
          className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'essence'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>1. Essência & Propósito</span>
        </button>

        <button
          onClick={() => setActiveTab('prosperity')}
          className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'prosperity'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>2. Diagnóstico de Prosperidade</span>
        </button>

        <button
          onClick={() => setActiveTab('name_opt')}
          className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'name_opt'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <PenTool className="w-4 h-4" />
          <span>3. Otimização de Nome & Assinatura</span>
        </button>

        <button
          onClick={() => setActiveTab('baths_sound')}
          className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'baths_sound'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Sun className="w-4 h-4 text-amber-400" />
          <span>4. Aura, Banhos & Frequências</span>
        </button>

        <button
          onClick={() => setActiveTab('sacred_symbols')}
          className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'sacred_symbols'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>5. Selos Místicos & Bíblia</span>
        </button>

        <button
          onClick={() => setActiveTab('career')}
          className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'career'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>6. Talentos & Carreira</span>
        </button>

        <button
          onClick={() => setActiveTab('year')}
          className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'year'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>7. Ano Pessoal</span>
        </button>

        <button
          onClick={() => setActiveTab('books')}
          className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'books'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Library className="w-4 h-4 text-amber-400" />
          <span>8. Leituras Inspiradoras</span>
        </button>
      </div>

      {/* TAB CONTENT 1: ESSÊNCIA & PROPÓSITO */}
      {activeTab === 'essence' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Detailed Life Path */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#131526] border border-amber-500/40 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-4 mb-6">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-amber-400">
                  Frequência Maior de Nascimento
                </span>
                <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white mt-1">
                  Caminho de Vida {report.lifePath.number}: {report.lifePath.name}
                </h3>
              </div>
              <div className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                Arquétipo: {report.lifePath.archetype}
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-light mb-6">
              {report.lifePath.essence}
            </p>

            {/* Strengths & Challenges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#171930] border border-emerald-500/30 space-y-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Forças Inatas de Sucesso
                </span>
                <ul className="text-xs sm:text-sm text-slate-300 space-y-1.5 pt-1">
                  {report.lifePath.strengths.map((st, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{st}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-[#171930] border border-red-500/30 space-y-2">
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Desafios & Sabotadores a Evitar
                </span>
                <ul className="text-xs sm:text-sm text-slate-300 space-y-1.5 pt-1">
                  {report.lifePath.challenges.map((ch, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">•</span>
                      <span>{ch}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Prosperity Impact */}
            <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300 block mb-0.5">
                  Diretriz de Prosperidade:
                </span>
                <p className="text-xs sm:text-sm text-slate-200">
                  {report.lifePath.prosperityImpact}
                </p>
              </div>
            </div>
          </div>

          {/* Triad of Expression, Soul Urge & Personality */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Expression */}
            <div className="p-6 rounded-2xl bg-[#131526] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400">
                  Número de Expressão
                </span>
                <span className="w-9 h-9 rounded-lg bg-purple-900/40 border border-purple-500/40 flex items-center justify-center font-cinzel text-lg font-bold text-purple-300">
                  {report.expression.number}
                </span>
              </div>
              <h4 className="font-cinzel font-bold text-white text-base">
                {report.expression.name}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {report.expression.essence}
              </p>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
                {report.expression.calculationExplanation}
              </div>
            </div>

            {/* Soul Urge */}
            <div className="p-6 rounded-2xl bg-[#131526] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  Desejo da Alma
                </span>
                <span className="w-9 h-9 rounded-lg bg-amber-900/40 border border-amber-500/40 flex items-center justify-center font-cinzel text-lg font-bold text-amber-300">
                  {report.soulUrge.number}
                </span>
              </div>
              <h4 className="font-cinzel font-bold text-white text-base">
                {report.soulUrge.archetype}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {report.soulUrge.essence}
              </p>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
                {report.soulUrge.calculationExplanation}
              </div>
            </div>

            {/* Personality */}
            <div className="p-6 rounded-2xl bg-[#131526] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400">
                  Personalidade Externa
                </span>
                <span className="w-9 h-9 rounded-lg bg-teal-900/40 border border-teal-500/40 flex items-center justify-center font-cinzel text-lg font-bold text-teal-300">
                  {report.personality.number}
                </span>
              </div>
              <h4 className="font-cinzel font-bold text-white text-base">
                {report.personality.name}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {report.personality.essence}
              </p>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
                {report.personality.calculationExplanation}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: DIAGNÓSTICO DE PROSPERIDADE */}
      {activeTab === 'prosperity' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Score & Archetype Highlight */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#181a33] via-[#141528] to-[#181a33] border border-amber-500/40">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-[#0c0d19] border border-amber-500/30 text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                  Índice Vibracional
                </span>
                <div className="w-28 h-28 rounded-full border-4 border-amber-400 bg-amber-500/10 flex flex-col items-center justify-center shadow-lg shadow-amber-500/20 mb-2">
                  <span className="font-cinzel text-4xl font-extrabold text-amber-300">
                    {report.prosperity.score}
                  </span>
                  <span className="text-[10px] text-amber-400/80 font-bold">/ 100</span>
                </div>
                <span className="text-xs font-semibold text-emerald-400">
                  Ressonância Ativa de Abundância
                </span>
              </div>

              <div className="md:col-span-8 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Arquétipo Financeiro Dominante:
                </span>
                <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
                  {report.prosperity.archetype}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {report.prosperity.archetypeDescription}
                </p>
                <div className="p-3.5 rounded-xl bg-[#0c0d19] border border-slate-800 text-xs text-slate-300">
                  {report.prosperity.abundancePotential}
                </div>
              </div>
            </div>
          </div>

          {/* Bloqueios Financeiros Inconscientes */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#131526] border border-red-500/30 space-y-4">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h3 className="font-cinzel text-lg font-bold text-white">
                Bloqueios Financeiros Inconscientes Identificados
              </h3>
            </div>
            <p className="text-xs text-slate-300">
              Esses padrões atuam como freios no seu termostato financeiro. A consciência deles é o primeiro passo para a libertação:
            </p>

            <div className="space-y-3 pt-1">
              {report.prosperity.financialBlocks.map((block, i) => (
                <div key={i} className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 flex items-start gap-3">
                  <span className="px-2 py-0.5 rounded bg-red-900/50 text-red-300 font-mono text-[11px] font-bold shrink-0">
                    0{i + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {block}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Códigos Sagrados de Ativação */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#131526] border border-amber-500/40 space-y-4">
            <div className="flex items-center gap-2.5">
              <Key className="w-5 h-5 text-amber-400" />
              <h3 className="font-cinzel text-lg font-bold text-white">
                Códigos Numéricos Sagrados para Ativação Quântica
              </h3>
            </div>
            <p className="text-xs text-slate-300">
              Sequências de frequências puras que sintonizam seu campo eletromagnético com a abundância material:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              {report.prosperity.sacredCodes.map((sc, i) => (
                <div key={i} className="p-4 rounded-xl bg-[#0c0d19] border border-amber-500/30 space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="font-tech text-xl font-bold text-amber-300 tracking-wider">
                      {sc.code}
                    </div>
                    <span className="text-xs font-semibold text-white block mt-1">
                      {sc.purpose}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed pt-2 border-t border-slate-800">
                    {sc.mantra}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Decreto Diário de Ativação */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-amber-500/15 via-purple-600/15 to-amber-500/15 border-2 border-amber-400/60 text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Decreto Diário de Poder & Mentalidade de Riqueza
            </span>
            <p className="font-cinzel text-base sm:text-lg text-white font-semibold italic max-w-2xl mx-auto leading-relaxed">
              "{report.prosperity.moneyMindsetGuidance.replace(/Afirme diariamente: /, '').replace(/"/g, '')}"
            </p>
            <p className="text-[11px] text-slate-400">
              Repita esse decreto mentalmente ou em voz alta 3 vezes ao acordar e ao se deitar.
            </p>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: OTIMIZAÇÃO DE NOME & ASSINATURA */}
      {activeTab === 'name_opt' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header Banner */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#171932] via-[#211e40] to-[#171932] border border-amber-500/50 relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="text-xs uppercase font-bold tracking-wider text-amber-400 flex items-center gap-1.5">
                  <PenTool className="w-4 h-4" /> Alquimia Onomástica & Caligrafia Sagrada
                </span>
                <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
                  Otimização Vibracional do Nome para o Número 8
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  Ajuste milenar pitagórico que recalcula sua vibração de Expressão para ressoar no Arquétipo Soberano da Riqueza Material, Autoridade e Magnetismo de Clientes.
                </p>
              </div>

              {/* Badges Comparison */}
              <div className="flex items-center gap-4 bg-[#0d0e1a]/80 p-4 rounded-xl border border-amber-500/30 shrink-0">
                <div className="text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Atual</span>
                  <span className="font-cinzel text-2xl font-bold text-slate-300">{report.nameOptimization.currentExpression}</span>
                </div>
                <div className="text-amber-400 font-bold text-xl">➔</div>
                <div className="text-center">
                  <span className="text-[10px] text-amber-400 uppercase font-bold block">Alvo Riqueza</span>
                  <span className="font-cinzel text-2xl font-bold text-amber-300">{report.nameOptimization.targetExpression}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Suggested Signature & Letter Recommendation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-[#131526] border border-amber-500/30 space-y-3">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Letra Sagrada Recomendada
              </span>
              <div className="flex items-baseline gap-3">
                <span className="font-cinzel text-4xl font-extrabold text-amber-300">
                  "{report.nameOptimization.letterToAdd}"
                </span>
                <span className="text-xs text-slate-300">
                  (Valor Pitagórico {report.nameOptimization.letterValue})
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Ao introduzir a letra <strong>"{report.nameOptimization.letterToAdd}"</strong> no nome social, assinatura ou cartão de visita, sua soma de expressão atinge o Número 8 — quebrando qualquer estagnação monetária.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#131526] border border-amber-500/30 space-y-3">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <PenTool className="w-4 h-4" /> Sugestão de Nome de Poder / Assinatura
              </span>
              <div className="font-cinzel text-2xl font-bold text-white tracking-wide border-b border-slate-800 pb-2">
                {report.nameOptimization.suggestedName}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Use essa grafia em seus perfis comerciais (LinkedIn, Instagram, WhatsApp Business), e-mails corporativos e contratos de honorários.
              </p>
            </div>
          </div>

          {/* Metaphysical Rationale */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#131526] border border-slate-800 space-y-3">
            <h4 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
              <Scroll className="w-5 h-5 text-amber-400" />
              Racional Metafísico & Fundamento Cósmico
            </h4>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-light">
              {report.nameOptimization.metaphysicalRationale}
            </p>
          </div>

          {/* 4 Sacred Signature Rules */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#131526] border border-slate-800 space-y-4">
            <h4 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              Manual da Assinatura de Prosperidade & Blindagem Financeira
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {report.nameOptimization.signatureGuideline}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#0c0d19] border border-amber-500/20 space-y-1.5">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  1. Ângulo Ascendente (35° a 45°)
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Assine sempre apontando para o alto e para a direita. Na psicografia cabalística, essa inclinação projeta crescimento patrimonial contínuo.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0c0d19] border border-amber-500/20 space-y-1.5">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  2. Traço Firme de Apoio
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Sublinhe o nome com um traço reto e contínuo por baixo, ancorando a base sólida de sustento e fechando brechas contra despesas imprevistas.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0c0d19] border border-amber-500/20 space-y-1.5">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  3. Sem Cortes / Sem Pontos
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Nunca passe traços riscando o próprio nome ao meio (evita autosabotagem). Não termine com ponto final, mantendo o fluxo financeiro aberto.
                </p>
              </div>
            </div>
          </div>

          {/* Action Plan 21 Days */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#131526] border border-amber-500/30 space-y-4">
            <h4 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-400" />
              Plano de Ativação da Nova Assinatura em 21 Dias
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {report.nameOptimization.practicalActionPlan.map((step, i) => (
                <div key={i} className="p-4 rounded-xl bg-[#0c0d19] border border-slate-800 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    0{i + 1}
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: BANHOS ENERGÉTICOS & FREQUÊNCIAS */}
      {activeTab === 'baths_sound' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#171932] via-[#1b253b] to-[#171932] border border-amber-500/40">
            <span className="text-xs uppercase font-bold tracking-wider text-amber-400 flex items-center gap-1.5 mb-1">
              <Sun className="w-4 h-4" /> Campo Biofotônico & Alquimia Herbária
            </span>
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
              Campo da Aura, Banhos Ancestrais & Matriz Quântica de Sons
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Diagnóstico do seu campo bioeletromagnético (aura), protocolos diários de blindagem contra inveja e miasmas, aliados a banhos sagrados e frequências Solfeggio para calibração vibracional.
            </p>
          </div>

          {/* DEDICATED AURA DIAGNOSTIC & BIO-SHIELDING CARD */}
          {(() => {
            const aura = report.aura || calculateAuraProfile(report.lifePath.number, report.expression.number);
            return (
              <div 
                className="p-6 sm:p-8 rounded-2xl relative overflow-hidden border shadow-2xl space-y-6"
                style={{
                  background: 'linear-gradient(135deg, #121426 0%, #0d0e1b 100%)',
                  borderColor: `${aura.colorHex}66`,
                  boxShadow: `0 10px 30px -10px ${aura.colorHex}22`
                }}
              >
                {/* Background glow */}
                <div 
                  className="absolute -top-10 -right-10 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20"
                  style={{ backgroundColor: aura.colorHex }}
                />

                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
                  <div className="flex items-center gap-3">
                    <span 
                      className="w-3.5 h-3.5 rounded-full animate-ping"
                      style={{ backgroundColor: aura.colorHex }}
                    />
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                        Diagnóstico Biofotônico do Campo Sutil
                      </span>
                      <h4 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
                        Sua Aura: <span style={{ color: aura.colorHex }}>{aura.primaryColorName}</span>
                      </h4>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 font-medium">
                      {aura.capturedWithCamera ? 'Captura Óptica Frontal' : 'Ressonância Matriz Natal'}
                    </span>
                    <span 
                      className="text-xs px-3 py-1 rounded-full font-bold text-slate-950"
                      style={{ backgroundColor: aura.colorHex }}
                    >
                      {aura.frequencyHz.split(' - ')[0]}
                    </span>
                  </div>
                </div>

                {/* Visual Aura Halo & Key Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-4 rounded-2xl bg-[#0b0c17] border border-slate-800">
                    <div className="relative mb-3 group">
                      <div 
                        className="absolute inset-0 rounded-full blur-xl opacity-60 animate-pulse"
                        style={{ backgroundColor: aura.colorHex }}
                      />
                      <div 
                        className="w-32 h-32 rounded-full relative z-10 border-4 overflow-hidden flex items-center justify-center shadow-2xl bg-slate-900"
                        style={{ borderColor: aura.colorHex }}
                      >
                        {aura.capturedImageUrl ? (
                          <img
                            src={aura.capturedImageUrl}
                            alt="Aura do Consulente"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div 
                            className="w-full h-full flex flex-col items-center justify-center p-3 text-center"
                            style={{
                              background: `radial-gradient(circle, ${aura.colorHex}44 0%, #0c0e1a 80%)`
                            }}
                          >
                            <Sun className="w-10 h-10 mb-1" style={{ color: aura.colorHex }} />
                            <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                              Vibração Cósmica
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <span className="text-xs font-cinzel font-bold text-white mt-1">
                      {aura.auraArchetype}
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5">
                      {aura.vibrationalState}
                    </span>
                  </div>

                  <div className="lg:col-span-8 space-y-3">
                    <div className="p-4 rounded-xl bg-[#0e1021] border border-slate-800 space-y-1.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4" /> Análise Bioenergética da Prosperidade
                      </span>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-light">
                        {aura.deepAnalysis}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-xl bg-[#0e1021] border border-slate-800">
                        <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                          Alcance do Campo Áurico
                        </span>
                        <p className="text-xs text-white font-medium">
                          {aura.fieldExpansion} (Expansão contínua em estado de gratidão)
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#0e1021] border border-slate-800">
                        <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                          Magnetismo em Vendas & Negócios
                        </span>
                        <p className="text-xs text-white font-medium">
                          {aura.prosperityCorrelation}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shielding Protocol Box */}
                <div className="p-5 rounded-xl bg-gradient-to-r from-amber-500/10 via-purple-900/20 to-amber-500/10 border border-amber-500/30 space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-amber-400" />
                    <h5 className="text-sm font-bold text-white font-cinzel">
                      Protocolo Matinal de Blindagem Áurica Contra Inveja & Drenagens
                    </h5>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {aura.shieldingProtocol}
                  </p>
                </div>

                {/* Crystals & Color Guidance */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="p-4 rounded-xl bg-[#0e1021] border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Tríade de Cristais de Afinidade
                    </span>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {aura.recommendedCrystals.map((crystal, idx) => (
                        <span 
                          key={idx}
                          className="text-xs px-3 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-200 font-semibold"
                        >
                          {crystal}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0e1021] border border-slate-800 space-y-1.5">
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Sun className="w-3.5 h-3.5" /> Cromoterapia para Negociações
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {aura.clothingHarmonization}
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* 3 Energy Baths Cards */}
          <div className="space-y-4">
            <h4 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
              <Droplets className="w-5 h-5 text-amber-400" />
              Os 3 Banhos de Reprogramação Áurica
            </h4>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {report.energyBaths.map((bath, i) => (
                <div 
                  key={i} 
                  className={`p-6 rounded-2xl bg-[#131526] border flex flex-col justify-between space-y-4 ${
                    bath.category === 'prosperidade' ? 'border-amber-500/50 shadow-lg shadow-amber-500/10' : 'border-slate-800'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold uppercase tracking-wider">
                        {bath.category === 'limpeza' ? 'Descarrego' : bath.category === 'prosperidade' ? 'Atração de Ouro' : 'Magnetismo de Luz'}
                      </span>
                    </div>

                    <h5 className="font-cinzel text-base font-bold text-white leading-snug">
                      {bath.title}
                    </h5>

                    <div className="p-3 rounded-xl bg-[#0c0d19] border border-slate-800 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Momento Cósmico Ideal:
                      </span>
                      <span className="text-xs font-medium text-amber-300 block">
                        {bath.bestDayAndMoon}
                      </span>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-white block mb-1">
                        Ingredientes Sagrados:
                      </span>
                      <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                        {bath.herbsAndIngredients.map((ing, idx) => (
                          <li key={idx}>{ing}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-white block mb-1">
                        Preparo & Aplicação:
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed font-light">
                        {bath.preparationRitual}
                      </p>
                    </div>
                  </div>

                  {/* Prayer / Decree Box */}
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-amber-400 block">
                      Decreto no Banho:
                    </span>
                    <p className="text-xs text-white italic leading-relaxed">
                      {bath.prayerOrIntention}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sound Frequencies Table / Cards */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#131526] border border-amber-500/30 space-y-4">
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-amber-400" />
              <h4 className="font-cinzel text-lg font-bold text-white">
                Frequências Solfeggio & Afinação Sonora para o Sucesso
              </h4>
            </div>
            <p className="text-xs text-slate-300">
              Ouça essas frequências com fones de ouvido estéreo para reconfigurar os padrões de ondas cerebrais (Alfa e Teta):
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {report.soundFrequencies.map((sf, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#0c0d19] border border-slate-800 space-y-2 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-tech text-lg font-bold text-amber-300">
                        {sf.hz} Hz
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 border border-purple-500/30 text-purple-300">
                        {sf.element}
                      </span>
                    </div>
                    <h5 className="text-xs font-bold text-white leading-tight">
                      {sf.title}
                    </h5>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {sf.sacredPurpose}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 space-y-0.5">
                    <div><strong>Quando ouvir:</strong> {sf.bestListeningTime}</div>
                    <div><strong>Modo:</strong> {sf.recommendation}</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedFrequency(sf)}
                    className="w-full mt-2.5 py-2 px-3 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 hover:border-red-400 text-red-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm group"
                  >
                    <Play className="w-3.5 h-3.5 text-red-400 group-hover:scale-110 transition-transform fill-red-400" />
                    <span>Ouvir {sf.hz} Hz no YouTube</span>
                    <ExternalLink className="w-3 h-3 text-red-400/80 ml-auto" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: SELOS MÍSTICOS & ESCRITURAS BÍBLICAS */}
      {activeTab === 'sacred_symbols' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#171932] via-[#241f3d] to-[#171932] border border-amber-500/50">
            <span className="text-xs uppercase font-bold tracking-wider text-amber-400 flex items-center gap-1.5 mb-1">
              <BookOpen className="w-4 h-4" /> Revelação Sagrada & Blindagem Espiritual
            </span>
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
              Selos Místicos & Fundamentos Bíblicos de Fartura
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              A união milenar da sabedoria bíblica dos Provérbios e Salmos de Salomão com a geometria sagrada da providência perpétua.
            </p>
          </div>

          {/* Scriptures & Sacred Seals Grid */}
          <div className="space-y-4">
            <h4 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400" />
              Promessas Bíblicas de Riqueza com Justiça & Cobertura Divina
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.sacredSymbolsAndVerses.map((v, i) => (
                <div key={i} className="p-6 rounded-2xl bg-[#131526] border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400">
                        {v.biblicalReference}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold">
                        Selo Sagrado
                      </span>
                    </div>

                    <h5 className="font-cinzel text-base font-bold text-white">
                      {v.symbolName}
                    </h5>

                    <blockquote className="p-3.5 rounded-xl bg-[#0c0d19] border-l-2 border-amber-400 text-xs text-slate-200 italic leading-relaxed">
                      "{v.scriptureText}"
                    </blockquote>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div>
                      <span className="text-[11px] font-bold text-slate-300 block">Significado Espiritual:</span>
                      <p className="text-xs text-slate-400 leading-relaxed">{v.spiritualMeaning}</p>
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-amber-300 block">Aplicação Prática:</span>
                      <p className="text-xs text-slate-300 leading-relaxed">{v.applicationGuidance}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Aliança de Prosperidade Box */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-amber-500/15 via-purple-600/20 to-amber-500/15 border-2 border-amber-400 text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Pacto de Prosperidade & Honra
            </span>
            <h4 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
              "Honra ao Senhor com os teus bens e com as primícias de toda a tua renda..."
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
              O dinheiro é uma energia neutra que se multiplica nas mãos daqueles que geram valor para o próximo com integridade, generosidade e sabedoria.
            </p>
          </div>
        </div>
      )}

      {/* TAB CONTENT 6: TALENTOS OCULTOS & CARREIRA */}
      {activeTab === 'career' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Superpoderes de Monetização */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#131526] border border-emerald-500/40 space-y-4">
            <div className="flex items-center gap-2.5">
              <Award className="w-5 h-5 text-emerald-400" />
              <h3 className="font-cinzel text-lg font-bold text-white">
                Superpoderes de Monetização & Ativos Únicos
              </h3>
            </div>
            <p className="text-xs text-slate-300">
              Onde reside sua vantagem competitiva absoluta no mercado e como multiplicar seus ganhos:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              {report.prosperity.monetizationSuperpowers.map((pwr, i) => (
                <div key={i} className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                  <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs">
                    0{i + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                    {pwr}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Oportunidades de Carreira e Negócios */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-[#131526] border border-slate-800 space-y-3">
              <h4 className="font-cinzel font-bold text-amber-300 text-base flex items-center gap-2">
                <Target className="w-4 h-4" /> Formatos Ideais de Monetização
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Com a vibração do Caminho {report.lifePath.number} e Expressão {report.expression.number}, seus melhores retornos acontecem em modelos com alta autonomia, autoridade técnica e capacidade de definir seus próprios preços, evitando estruturas rígidas de subordinação passiva.
              </p>
              <ul className="text-xs text-slate-300 space-y-1.5 pt-2">
                <li>• Empreendimentos próprios e startups de nicho</li>
                <li>• Consultorias, mentorias e produtos de alto valor agregado</li>
                <li>• Liderança estratégica e gestão de operações rentáveis</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-[#131526] border border-slate-800 space-y-3">
              <h4 className="font-cinzel font-bold text-purple-300 text-base flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Desafios & Armadilhas Profissionais
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                O maior risco para seu crescimento financeiro é a perda de foco ou assumir a responsabilidade de terceiros. Seu crescimento depende de blindar seu tempo e delegar atividades que não geram receita direta.
              </p>
              <ul className="text-xs text-slate-300 space-y-1.5 pt-2">
                <li>• Evite sociedades onde as responsabilidades financeiras não são transparentes</li>
                <li>• Não preste consultoria gratuita sem um acordo formal de valor</li>
                <li>• Reserve 20% do faturamento para investimentos patrimoniais consistentes</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: ANO PESSOAL & CICLOS */}
      {activeTab === 'year' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Main Year Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#131526] border border-amber-500/40 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-4">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-amber-400">
                  Ciclo Cósmico Corrente
                </span>
                <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white mt-0.5">
                  Ano Pessoal {report.personalYear.yearNumber} ({report.personalYear.calendarYear})
                </h3>
              </div>

              <div className="px-3 py-1 rounded-full bg-purple-950 border border-purple-500/40 text-purple-300 text-xs font-semibold">
                {report.personalYear.theme}
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-light">
              {report.personalYear.forecast}
            </p>

            {/* Lucky Days and Power Hours */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#0c0d19] border border-slate-800 flex items-center gap-3">
                <Calendar className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <span className="text-[11px] uppercase font-bold text-slate-400 block">
                    Dias Favoráveis para Negócios:
                  </span>
                  <span className="text-xs font-semibold text-white">
                    {report.personalYear.luckyDays.join(' e ')}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0c0d19] border border-slate-800 flex items-center gap-3">
                <Clock className="w-5 h-5 text-purple-400 shrink-0" />
                <div>
                  <span className="text-[11px] uppercase font-bold text-slate-400 block">
                    Horas de Poder Financeiro:
                  </span>
                  <span className="text-xs font-semibold text-white">
                    {report.personalYear.powerHours}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quarterly Roadmap */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#131526] border border-slate-800 space-y-4">
            <h4 className="font-cinzel text-lg font-bold text-white">
              Diretrizes Trimestrais para Maximizar Ganhos
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {report.personalYear.quarterlyFocus.map((q, i) => (
                <div key={i} className="p-4 rounded-xl bg-[#0c0d19] border border-slate-800 space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    {q.period}
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {q.focus}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 8: LEITURAS INSPIRADORAS */}
      {activeTab === 'books' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Main Hero Card for Books */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#131526] border border-amber-500/40 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-500/20 pb-4 mb-6">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Library className="w-4 h-4 text-amber-400" />
                  Alquimia Mental & Sabedoria de Riqueza
                </span>
                <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white mt-1">
                  Guia de Leitura Inspiradora & Mestria Pessoal
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setRecommendedBooks(getRecommendedBooksForReport(report))}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold transition-all hover:scale-105 active:scale-95"
                  title="Gerar 3 novas sugestões aleatórias de livros"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Sortear Outras 3 Sugestões
                </button>
                <div className="px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                  Sintonizado com Caminho {report.lifePath.number}
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl mb-6">
              A numerologia identifica a matriz vibracional e os potenciais latentes da sua alma. No entanto, para que essa energia se converta em riqueza tangível, saúde psíquica e liderança no mundo material, sua mente precisa de modelos mentais comprovados. Selecionamos com rigor obras transformadoras que aceleram o desbloqueio do seu potencial:
            </p>

            {/* List of Recommended Books */}
            <div className="space-y-6">
              {recommendedBooks.map((book, idx) => {
                const coverDataUrl = generateBookCoverDataUrl(book, 220, 330);
                return (
                  <div
                    key={book.id}
                    className="p-5 sm:p-6 rounded-2xl bg-[#0d0e1b] border border-amber-500/30 hover:border-amber-500/60 transition-all flex flex-col md:flex-row gap-6 items-start"
                  >
                    {/* Left: Book Cover Visual */}
                    <div className="flex-shrink-0 mx-auto md:mx-0 flex flex-col items-center">
                      <div className="relative group">
                        {coverDataUrl ? (
                          <img
                            src={coverDataUrl}
                            alt={book.title}
                            referrerPolicy="no-referrer"
                            className="w-32 sm:w-36 h-auto rounded-lg shadow-xl shadow-black/60 border border-amber-500/30 group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-32 sm:w-36 h-48 rounded-lg bg-slate-900 border border-amber-500/40 flex flex-col items-center justify-center p-3 text-center">
                            <BookOpen className="w-8 h-8 text-amber-400 mb-2" />
                            <span className="text-[11px] font-bold text-white">{book.title}</span>
                            <span className="text-[9px] text-amber-300 mt-1">{book.author}</span>
                          </div>
                        )}
                      </div>
                      <span className="mt-2.5 text-[10px] font-bold text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded text-center max-w-[150px]">
                        {book.bestsellerBadge}
                      </span>
                    </div>

                    {/* Right: Detailed Description & Advice */}
                    <div className="flex-1 space-y-3.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                            Recomendação #{idx + 1}
                          </span>
                          <h4 className="font-cinzel text-lg sm:text-xl font-bold text-white">
                            {book.title}
                          </h4>
                          <p className="text-xs text-slate-400">
                            Por <span className="text-slate-200 font-semibold">{book.author}</span>
                          </p>
                        </div>
                        <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300">
                          {book.category}
                        </span>
                      </div>

                      {/* Why it helps */}
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          Como esta leitura ajudará o consulente:
                        </span>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                          {book.whyItHelps}
                        </p>
                      </div>

                      {/* Synergy with numerology */}
                      <div className="space-y-1 bg-[#15172b] p-3 rounded-xl border border-slate-800">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          Sinergia com seu Caminho de Vida {report.lifePath.number}:
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {book.synergyReason}
                        </p>
                      </div>

                      {/* Practical key */}
                      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-amber-400" />
                          Chave de Aplicação Prática Imediata:
                        </span>
                        <p className="text-xs text-amber-100 font-medium leading-relaxed italic">
                          "{book.practicalKey}"
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Daily study ritual banner */}
            <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-[#1b1e38] to-[#121426] border border-amber-500/40 space-y-2">
              <h4 className="font-cinzel text-sm sm:text-base font-bold text-amber-300 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                Ritual de Fixação Psíquica & Leitura Diária
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Dedique de 15 a 20 minutos todos os dias a uma destas obras, de preferência nas primeiras horas da manhã ou antes do repouso noturno. Nesses períodos de transição de ondas cerebrais (Alfa e Theta), os conceitos de abundância e liderança penetram sem resistência no subconsciente, reprogramando a autoimagem e consolidando seus números de poder.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sticky Action Bar */}
      <div className="p-6 rounded-2xl bg-[#0c0d19]/90 backdrop-blur-md border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-cinzel font-bold text-white text-base">
            Seu Relatório Completo está Pronto para Impressão
          </h4>
          <p className="text-xs text-slate-400">
            Exportação em 8 páginas diagramadas em formato A4 com diagnóstico, selos sagrados, banhos, frequências sonoras, promessas bíblicas e guia de leitura inspiradora.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            id="btn-download-pdf-bottom"
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="flex-1 sm:flex-initial py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-[#0b0c16] font-bold text-xs sm:text-sm tracking-wide transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloading ? 'Baixando...' : 'Baixar PDF Oficial (8 Páginas A4)'}</span>
          </button>

          <button
            onClick={onNewCalculation}
            className="py-3 px-4 rounded-xl border border-slate-700 hover:border-slate-600 text-xs text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            Fazer Outro Mapa
          </button>
        </div>
      </div>

      {/* Security Verification Modal for PDF Download */}
      <PdfVerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        report={report}
        onConfirmSuccess={handleVerificationSuccess}
      />

      {/* Modal de Vídeo da Frequência no YouTube com Fundo Embaçado */}
      {selectedFrequency && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop click to dismiss */}
          <div 
            className="absolute inset-0"
            onClick={() => setSelectedFrequency(null)}
          />
          
          <div className="relative z-10 w-full max-w-2xl bg-[#0f111f] border border-amber-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-3 bg-[#14172a]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center shrink-0">
                  <Play className="w-5 h-5 text-red-400 fill-red-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-tech text-base sm:text-lg font-bold text-amber-300">
                      {selectedFrequency.hz} Hz
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950/80 border border-purple-500/30 text-purple-300 font-semibold">
                      {selectedFrequency.element}
                    </span>
                  </div>
                  <h3 className="font-cinzel text-xs sm:text-sm font-bold text-white line-clamp-1">
                    {selectedFrequency.title}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedFrequency(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
                title="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Video Player & Frequency Guide */}
            <div className="p-4 sm:p-6 space-y-4 overflow-y-auto">
              {(() => {
                const ytInfo = getFrequencyYouTubeInfo(selectedFrequency.hz);
                const embedId = selectedFrequency.youtubeEmbedId || ytInfo.embedId;
                const url = selectedFrequency.youtubeUrl || ytInfo.url;

                return (
                  <div className="space-y-3">
                    {embedId ? (
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-700 bg-black shadow-lg">
                        <iframe
                          src={`https://www.youtube.com/embed/${embedId}?autoplay=1&rel=0`}
                          title={`Frequência ${selectedFrequency.hz} Hz - ${selectedFrequency.title}`}
                          className="absolute inset-0 w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-700 text-center space-y-2">
                        <Play className="w-8 h-8 text-amber-400 mx-auto" />
                        <p className="text-xs text-slate-300">
                          Acesse a transmissão oficial desta frequência no YouTube:
                        </p>
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors"
                        >
                          Assistir no YouTube
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}

                    {/* Direct YouTube link bar */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 p-3 rounded-xl bg-[#15172b] border border-slate-800">
                      <span className="text-xs text-slate-300 flex items-center gap-1.5">
                        <Volume2 className="w-4 h-4 text-amber-400 shrink-0" />
                        Recomendado ouvir com fones de ouvido estéreo
                      </span>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-red-300 hover:text-red-200 font-semibold flex items-center gap-1.5 hover:underline shrink-0"
                      >
                        <span>Abrir diretamente no YouTube</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })()}

              {/* Sacred Purpose & Practical Guidance */}
              <div className="space-y-3 pt-1">
                <div className="p-3.5 rounded-xl bg-[#121427] border border-slate-800/80 space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                    Propósito Sagrado de Ativação
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {selectedFrequency.sacredPurpose}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#121427] border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                      Melhor Momento para Ouvir
                    </span>
                    <span className="text-slate-200 font-medium">
                      {selectedFrequency.bestListeningTime}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#121427] border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                      Recomendação de Aplicação
                    </span>
                    <span className="text-slate-200 font-medium">
                      {selectedFrequency.recommendation}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 sm:p-4 border-t border-slate-800 bg-[#14172a] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedFrequency(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                Concluir / Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

