import React, { useState, useEffect, useRef } from 'react';
import { NumerologyReport } from '../types';
import { Volume2, Play, Pause, Square, Sparkles, Headphones } from 'lucide-react';

interface PreviewAudioReaderProps {
  report: NumerologyReport;
  compact?: boolean;
}

export const PreviewAudioReader: React.FC<PreviewAudioReaderProps> = ({ report, compact = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [voiceLabel, setVoiceLabel] = useState<string>('Voz Feminina do Google (pt-BR)');

  const chunksRef = useRef<string[]>([]);
  const isCancelledRef = useRef(false);
  const timerRef = useRef<any>(null);

  // Generate complete, inspiring narration text for the report preview
  const generateScriptChunks = (): string[] => {
    const isMaster = report.lifePath.isMaster;
    const strengthsText = report.lifePath.strengths?.slice(0, 4).join(', ') || '';

    const list: string[] = [
      `Olá, ${report.user.fullName}! Seja muito bem-vindo à revelação da sua Matriz Vibracional de Prosperidade.`,
      `Com base na sua data de nascimento de ${report.user.formattedDate}, calculamos a sua Frequência Principal.`,
      `O seu Caminho de Vida definitivo é o número ${report.lifePath.number}${isMaster ? ', um raro e poderoso Número Mestre de altíssima vibração espiritual e material.' : '.'}`,
      `O seu Arquétipo Cósmico é ${report.lifePath.archetype}, sintonizado com a vibração de ${report.lifePath.name}.`,
      `Sobre o cálculo: ${report.lifePath.calculationExplanation}.`,
      `Essência de Alma e Propósito: ${report.lifePath.essence}`,
      strengthsText ? `Suas maiores forças inatas de liderança e realização são: ${strengthsText}.` : '',
      `Impacto na sua Prosperidade e Riqueza: ${report.lifePath.prosperityImpact}`,
      report.aura?.primaryColorName ? `Diagnóstico do seu Campo Áurico: A sua cor predominante identificada é ${report.aura.primaryColorName}, com frequência de ${report.aura.frequencyHz}. ${report.aura.freeTastingSummary || report.aura.deepAnalysis}` : '',
      `Diagnóstico de Prosperidade: A sua Pontuação Vibracional atingiu ${report.prosperity.score} pontos de 100 possíveis. O seu arquétipo financeiro é ${report.prosperity.archetype}. ${report.prosperity.archetypeDescription}`,
      `Para ter acesso ao seu mapa completo com a correção sagrada do seu nome para o Número 8 da Riqueza, sua assinatura de poder, banhos energéticos ancestrais, frequências de Solfeggio em áudio e o relatório oficial em PDF pronto para impressão, você pode desbloquear o acesso completo instantaneamente via Pix.`
    ];

    return list.filter(s => s && s.trim().length > 0);
  };

  // Detect and choose Google female voice in pt-BR or highest quality feminine voice
  const findGoogleFemaleVoice = (): SpeechSynthesisVoice | null => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return null;
    try {
      const voices = window.speechSynthesis.getVoices();
      if (!voices || voices.length === 0) return null;

      // 1. Google Portuguese voice (Chrome / Android Google Female TTS)
      const googlePt = voices.find(v => 
        (v.lang.replace('_', '-').toLowerCase().startsWith('pt') || v.lang.toLowerCase().includes('pt')) && 
        v.name.toLowerCase().includes('google')
      );
      if (googlePt) return googlePt;

      // 2. Portuguese female voices (Maria, Francisca, Luciana, Heloisa, Leticia, etc.)
      const femalePt = voices.find(v => 
        v.lang.replace('_', '-').toLowerCase().startsWith('pt') && 
        /female|feminina|mulher|francisca|maria|luciana|heloisa|leticia|yara|brenda/i.test(v.name)
      );
      if (femalePt) return femalePt;

      // 3. pt-BR voice
      const ptBR = voices.find(v => v.lang.replace('_', '-').toLowerCase() === 'pt-br');
      if (ptBR) return ptBR;

      // 4. Any Portuguese voice
      const anyPt = voices.find(v => v.lang.toLowerCase().startsWith('pt'));
      if (anyPt) return anyPt;
    } catch {
      // Fallback safe
    }
    return null;
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const loadVoice = () => {
      try {
        const v = findGoogleFemaleVoice();
        if (v) {
          if (v.name.toLowerCase().includes('google')) {
            setVoiceLabel('Voz Feminina do Google (pt-BR)');
          } else {
            setVoiceLabel(`${v.name} (pt-BR)`);
          }
        }
      } catch {
        // Safe
      }
    };

    loadVoice();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoice;
    }

    return () => {
      clearInterval(timerRef.current);
      try {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
      } catch {
        // Safe
      }
    };
  }, []);

  // Watchdog interval for Chrome: prevents Chrome from pausing synthesis after 14 seconds
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        try {
          if (typeof window !== 'undefined' && window.speechSynthesis) {
            if (window.speechSynthesis.paused) {
              window.speechSynthesis.resume();
            }
          }
        } catch {
          // Ignore
        }
      }, 5000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying]);

  // Speak chunks sequentially
  const speakChunk = (index: number) => {
    if (typeof window === 'undefined') return;
    if (isCancelledRef.current) return;

    const synth = window.speechSynthesis;
    if (!synth) {
      alert("A síntese de voz nativa não pôde ser ativada neste navegador. Por favor, utilize o Google Chrome ou Edge.");
      setIsPlaying(false);
      setIsPaused(false);
      return;
    }

    const chunks = chunksRef.current;
    if (index >= chunks.length) {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentChunkIndex(0);
      return;
    }

    setCurrentChunkIndex(index);
    const textToSpeak = chunks[index];

    try {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      
      // Store reference on window to prevent Chrome garbage-collection bug
      (window as any).__activeUtterance = utterance;

      const chosenVoice = findGoogleFemaleVoice();
      if (chosenVoice) {
        utterance.voice = chosenVoice;
      }
      utterance.lang = 'pt-BR';
      utterance.rate = 0.98;  // Natural, serene, clear tempo
      utterance.pitch = 1.08; // Delicate feminine timbre

      utterance.onend = () => {
        if (!isCancelledRef.current) {
          speakChunk(index + 1);
        }
      };

      utterance.onerror = (e) => {
        if (isCancelledRef.current) return;
        console.warn('SpeechSynthesis event:', e);
        // If single chunk failed, try next or gracefully stop
        if (index + 1 < chunks.length) {
          speakChunk(index + 1);
        } else {
          setIsPlaying(false);
          setIsPaused(false);
        }
      };

      synth.speak(utterance);
    } catch (err) {
      console.warn('Error initiating utterance:', err);
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  const handleStartOrResume = () => {
    if (typeof window === 'undefined') return;
    const synth = window.speechSynthesis;

    if (!synth) {
      alert("Para ouvir a leitura em áudio, utilize o Google Chrome, Edge ou Safari com suporte à Web Speech API.");
      return;
    }

    if (isPaused) {
      synth.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    // Fresh start
    synth.cancel();
    isCancelledRef.current = false;
    chunksRef.current = generateScriptChunks();
    setIsPlaying(true);
    setIsPaused(false);
    speakChunk(0);
  };

  const handlePause = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
    setIsPlaying(false);
  };

  const handleStop = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    isCancelledRef.current = true;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentChunkIndex(0);
  };

  const totalChunks = chunksRef.current.length || generateScriptChunks().length;
  const progressPercent = totalChunks > 0 ? Math.round(((currentChunkIndex + 1) / totalChunks) * 100) : 0;

  return (
    <div 
      id="preview-audio-reader-container"
      className="w-full rounded-2xl bg-gradient-to-r from-[#171932] via-[#202344] to-[#171932] border-2 border-amber-400/60 p-4 sm:p-6 shadow-2xl relative overflow-hidden transition-all duration-300"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-purple-600/15 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        {/* Left: Identification and Voice Info */}
        <div className="flex items-start gap-3.5 sm:gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-300 flex-shrink-0 ${
            isPlaying 
              ? 'bg-amber-500/25 border-amber-400 text-amber-300 shadow-lg shadow-amber-500/40 scale-105' 
              : 'bg-slate-800/90 border-amber-500/40 text-amber-400'
          }`}>
            {isPlaying ? (
              <div className="flex items-center gap-1 h-5">
                <span className="w-1 bg-amber-400 rounded-full animate-[bounce_0.6s_infinite_100ms] h-3" />
                <span className="w-1 bg-amber-300 rounded-full animate-[bounce_0.6s_infinite_300ms] h-5" />
                <span className="w-1 bg-amber-400 rounded-full animate-[bounce_0.6s_infinite_200ms] h-4" />
                <span className="w-1 bg-amber-200 rounded-full animate-[bounce_0.6s_infinite_400ms] h-2" />
              </div>
            ) : (
              <Headphones className="w-6 h-6 text-amber-400" />
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Narração em Áudio
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/35 text-[11px] text-amber-200 font-medium">
                {voiceLabel}
              </span>
            </div>

            <h3 className="font-cinzel text-base sm:text-lg font-bold text-white mt-0.5">
              {isPlaying 
                ? 'Ouvindo Leitura Completa da Prévia...' 
                : isPaused 
                  ? 'Leitura em Áudio Pausada' 
                  : 'Deseja ouvir a leitura da sua prévia?'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              {isPlaying || isPaused ? (
                <span className="text-amber-300 font-semibold">
                  Progresso da narração: {progressPercent}% concluído (Trecho {currentChunkIndex + 1} de {totalChunks})
                </span>
              ) : (
                'Ouça a narração com a voz feminina do Google explicando o seu Caminho de Vida, arquétipo, forças e diagnóstico de riqueza.'
              )}
            </p>
          </div>
        </div>

        {/* Right: Primary Action Buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end flex-shrink-0">
          {!isPlaying && !isPaused ? (
            <button
              id="btn-ouvir-previa"
              onClick={handleStartOrResume}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-[#0b0c16] font-extrabold text-sm uppercase tracking-wider transition-all shadow-xl shadow-amber-500/30 hover:shadow-amber-500/50 flex items-center justify-center gap-2.5 cursor-pointer active:scale-95 group border border-amber-300/40"
              title="Ouvir leitura completa com a voz feminina do Google"
            >
              <Volume2 className="w-5 h-5 group-hover:scale-110 transition-transform text-[#0b0c16]" />
              <span className="font-black text-sm">OUVIR</span>
            </button>
          ) : isPlaying ? (
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                id="btn-pausar-leitura"
                onClick={handlePause}
                className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/60 text-amber-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Pause className="w-4 h-4" />
                <span>Pausar</span>
              </button>
              <button
                id="btn-parar-leitura"
                onClick={handleStop}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                title="Parar leitura"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Parar</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                id="btn-continuar-leitura"
                onClick={handleStartOrResume}
                className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-[#0b0c16] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-500/20 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Continuar</span>
              </button>
              <button
                id="btn-parar-leitura-paused"
                onClick={handleStop}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                title="Parar leitura"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Parar</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar when reading or paused */}
      {(isPlaying || isPaused) && (
        <div className="mt-4 pt-3 border-t border-amber-500/25">
          <div className="w-full bg-slate-800/90 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.max(5, progressPercent)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
