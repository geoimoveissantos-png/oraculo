import React, { useState, useRef, useEffect } from 'react';
import { NumerologyReport, AuraReading } from '../types';
import { calculateAuraProfile } from '../utils/numerology';
import { 
  Camera, 
  CameraOff, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  Radio, 
  Eye, 
  Zap, 
  Lock, 
  ArrowRight,
  Shield,
  Sun,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

interface AuraCaptureSectionProps {
  report: NumerologyReport;
  onUpdateReport: (updatedReport: NumerologyReport) => void;
  onUnlockClick: () => void;
}

export const AuraCaptureSection: React.FC<AuraCaptureSectionProps> = ({
  report,
  onUpdateReport,
  onUnlockClick
}) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanCountdown, setScanCountdown] = useState<number | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [hasScanned, setHasScanned] = useState<boolean>(report.aura?.capturedWithCamera || !!report.aura?.capturedImageUrl);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera stream tracks cleanly without setState side effects during unmount
  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const stopCamera = () => {
    stopCameraStream();
    setIsCameraActive(false);
    setIsCameraReady(false);
    setIsScanning(false);
    setScanCountdown(null);
  };

  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  // Request camera access with fallback
  const startCamera = async () => {
    setCameraError(null);
    setIsCameraReady(false);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Seu navegador não suporta captura direta. Utilize o botão "Carregar Foto / Selfie".');
      }

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 640 },
            height: { ideal: 640 }
          },
          audio: false
        });
      } catch {
        // Fallback without constraints if user-facingMode is not accepted
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }

      streamRef.current = stream;
      setIsCameraActive(true);

      // Attach stream immediately if video element is already rendered
      if (videoRef.current) {
        const video = videoRef.current;
        video.srcObject = stream;
        video.onloadedmetadata = () => {
          video.play().catch(e => console.warn('Video play on metadata:', e));
          setIsCameraReady(true);
        };
        video.play().then(() => setIsCameraReady(true)).catch(e => console.warn('Video direct play:', e));
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      let msg = 'Não foi possível acessar a câmera frontal. Verifique se as permissões foram concedidas ou envie uma foto/selfie.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        msg = 'Permissão de câmera negada. Autorize no navegador ou clique em "Carregar Foto / Selfie".';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        msg = 'Nenhuma câmera detectada no aparelho. Você pode carregar uma foto diretamente.';
      }
      setCameraError(msg);
      setIsCameraActive(false);
      setIsCameraReady(false);
    }
  };

  // Immediate ref callback to bind the stream the instant the video DOM element mounts
  const handleVideoRef = (el: HTMLVideoElement | null) => {
    videoRef.current = el;
    if (el && streamRef.current) {
      if (el.srcObject !== streamRef.current) {
        el.srcObject = streamRef.current;
      }
      el.onloadedmetadata = () => {
        el.play().catch(e => console.warn('Video play on loadedmetadata:', e));
        setIsCameraReady(true);
      };
      el.oncanplay = () => {
        setIsCameraReady(true);
      };
      el.play().then(() => setIsCameraReady(true)).catch(e => console.warn('Video play direct:', e));
    }
  };

  // Effect backup when isCameraActive changes
  useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current) {
      const video = videoRef.current;
      if (video.srcObject !== streamRef.current) {
        video.srcObject = streamRef.current;
      }
      video.play().then(() => setIsCameraReady(true)).catch(e => console.warn('Video play error in effect:', e));
    }
  }, [isCameraActive]);

  // Safe countdown effect decoupled from state updaters
  useEffect(() => {
    if (!isScanning || scanCountdown === null) return;

    if (scanCountdown > 0) {
      const timer = setTimeout(() => {
        setScanCountdown(prev => (prev !== null && prev > 0 ? prev - 1 : 0));
      }, 900);
      return () => clearTimeout(timer);
    }

    if (scanCountdown === 0) {
      setIsScanning(false);
      setScanCountdown(null);
      executeScan();
    }
  }, [isScanning, scanCountdown]);

  // Initiate scan
  const captureAura = () => {
    if (!videoRef.current || !canvasRef.current || isScanning) return;
    setIsScanning(true);
    setScanCountdown(3);
  };

  const executeScan = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const vw = video.videoWidth || 640;
    const vh = video.videoHeight || 480;

    const width = 360;
    const height = 360;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Crop center square
    const size = Math.min(vw, vh);
    const sx = (vw - size) / 2;
    const sy = (vh - size) / 2;

    // Save with horizontal mirror so the resulting photo matches the user's selfie view
    ctx.save();
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, sx, sy, size, size, 0, 0, width, height);
    ctx.restore();

    processAndSaveAura(canvas, width, height, true);
  };

  // Upload Photo fallback
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) return;

      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = 360;
        const height = 360;
        canvas.width = width;
        canvas.height = height;

        const iw = img.naturalWidth || img.width;
        const ih = img.naturalHeight || img.height;
        const size = Math.min(iw, ih);
        const sx = (iw - size) / 2;
        const sy = (ih - size) / 2;

        ctx.drawImage(img, sx, sy, size, size, 0, 0, width, height);
        processAndSaveAura(canvas, width, height, false);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const processAndSaveAura = (canvas: HTMLCanvasElement, width: number, height: number, fromCamera: boolean) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    // Analyze RGB spectrum around upper-center and perimeter (halo area)
    let totalR = 0;
    let totalG = 0;
    let totalB = 0;
    let samples = 0;

    for (let y = 10; y < height; y += 8) {
      for (let x = 10; x < width; x += 8) {
        const dx = x - width / 2;
        const dy = y - height / 2;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 60 && dist < 160) {
          const idx = (y * width + x) * 4;
          totalR += data[idx];
          totalG += data[idx + 1];
          totalB += data[idx + 2];
          samples++;
        }
      }
    }

    const avgR = samples > 0 ? totalR / samples : 180;
    const avgG = samples > 0 ? totalG / samples : 150;
    const avgB = samples > 0 ? totalB / samples : 80;

    // Convert RGB to HSL to detect dominant Hue
    const r = avgR / 255;
    const g = avgG / 255;
    const b = avgB / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    const d = max - min;

    if (d !== 0) {
      if (max === r) {
        h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
      } else if (max === g) {
        h = ((b - r) / d + 2) * 60;
      } else {
        h = ((r - g) / d + 4) * 60;
      }
    }

    // Blend detected hue with user's Life Path number frequency for mystical coherence
    const lifePathHueOffset = ((report.lifePath.number * 47) % 360);
    const finalHue = Math.round((h * 0.65 + lifePathHueOffset * 0.35) % 360);

    // Snapshot image url: circular clipped PNG for round frame display
    let snapshotUrl = canvas.toDataURL('image/jpeg', 0.88);
    try {
      const roundCanvas = document.createElement('canvas');
      roundCanvas.width = width;
      roundCanvas.height = height;
      const rCtx = roundCanvas.getContext('2d');
      if (rCtx) {
        rCtx.save();
        rCtx.beginPath();
        rCtx.arc(width / 2, height / 2, width / 2 - 1, 0, Math.PI * 2);
        rCtx.closePath();
        rCtx.clip();
        rCtx.drawImage(canvas, 0, 0, width, height);
        rCtx.restore();
        snapshotUrl = roundCanvas.toDataURL('image/png');
      }
    } catch {
      snapshotUrl = canvas.toDataURL('image/jpeg', 0.88);
    }

    // Calculate Aura Profile with captured photo
    const aura = calculateAuraProfile(
      report.lifePath.number,
      report.expression.number,
      finalHue,
      snapshotUrl,
      true
    );

    const updated = {
      ...report,
      aura
    };

    stopCameraStream();
    setIsCameraActive(false);
    setIsCameraReady(false);
    setHasScanned(true);

    // Defer parent update so it never executes during a component render
    setTimeout(() => {
      onUpdateReport(updated);
    }, 0);
  };

  const currentAura = report.aura || calculateAuraProfile(report.lifePath.number, report.expression.number);

  return (
    <div className="rounded-2xl bg-gradient-to-b from-[#15172b] via-[#101222] to-[#0c0d18] border-2 border-amber-500/40 p-6 sm:p-8 relative shadow-2xl overflow-hidden">
      {/* Background ambient glow matching aura */}
      <div 
        className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20 transition-all duration-700"
        style={{ backgroundColor: currentAura.colorHex }}
      />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-4 mb-6">
        <div className="flex items-center gap-2.5">
          <span 
            className="w-3 h-3 rounded-full animate-ping"
            style={{ backgroundColor: currentAura.colorHex }}
          />
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-amber-400" />
            <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white tracking-wide">
              Degustação: Escaneamento Biofotônico da Aura
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold">
            Captura Frontal Opcional
          </span>
          <span className="text-[11px] text-emerald-400 font-mono font-bold">100% Gratuito</span>
        </div>
      </div>

      {/* Introductory context */}
      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light mb-6">
        Seu corpo sutil emana um campo bioeletromagnético (aura) de luz visível e frequências sutis que atraem ou repelem abundância e oportunidades. 
        Você pode <strong>acionar a câmera frontal do seu aparelho</strong> para capturar sua aura em tempo real através da decodificação de biofótons, 
        ou sintonizá-la pela matriz do seu Caminho de Vida. <span className="text-amber-300/90 font-medium">O uso da câmera é 100% opcional, privado e processado localmente no seu navegador.</span>
      </p>

      {/* Camera Live Feed / Scanner Mode */}
      {isCameraActive && (
        <div className="mb-6 rounded-2xl bg-black/80 border-2 border-amber-400/60 p-4 relative overflow-hidden flex flex-col items-center">
          <div className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center shadow-inner">
            {/* Live Video */}
            <video
              ref={handleVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform -scale-x-100"
            />

            {/* Video Initializing Loader */}
            {!isCameraReady && (
              <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center text-center p-4 z-20">
                <div 
                  className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin mb-3"
                  style={{ borderColor: currentAura.colorHex, borderTopColor: 'transparent' }}
                />
                <span className="text-xs text-amber-200 font-medium">Iniciando sensor óptico da câmera...</span>
                <span className="text-[11px] text-slate-400 mt-1">Conceda permissão se solicitado pelo navegador</span>
              </div>
            )}

            {/* Sacred Geometry Oval Aura Frame */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div 
                className="w-56 h-72 rounded-[50%] border-2 border-dashed animate-pulse transition-all duration-500"
                style={{
                  borderColor: currentAura.colorHex,
                  boxShadow: `0 0 35px ${currentAura.colorHex}55, inset 0 0 30px ${currentAura.colorHex}33`
                }}
              />
              <div className="absolute top-4 text-center px-4 py-1 rounded-full bg-black/60 backdrop-blur-xs text-[11px] text-amber-200 border border-amber-400/30 font-medium">
                Alinhe seu rosto dentro da geometria sagrada
              </div>
            </div>

            {/* Scanning Overlay Animation */}
            {isScanning && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-4 z-30">
                <div 
                  className="w-20 h-20 rounded-full border-4 border-t-transparent animate-spin mb-3"
                  style={{ borderColor: currentAura.colorHex, borderTopColor: 'transparent' }}
                />
                <div className="font-cinzel text-3xl font-extrabold text-amber-300">
                  {scanCountdown}
                </div>
                <div className="text-xs text-white font-medium mt-1">
                  Decodificando Espectro de Biofótons & Campo Áurico...
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons inside active camera */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-4 w-full">
            <button
              id="btn-capture-aura-now"
              onClick={captureAura}
              disabled={isScanning || !isCameraReady}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all"
            >
              <Zap className="w-4 h-4" />
              <span>{isScanning ? 'Capturando...' : !isCameraReady ? 'Aguardando Câmera...' : 'Capturar & Revelar Aura Agora'}</span>
            </button>

            <button
              onClick={stopCamera}
              disabled={isScanning}
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <CameraOff className="w-4 h-4" />
              <span>Fechar Câmera</span>
            </button>
          </div>
        </div>
      )}

      {/* Camera Error Message */}
      {cameraError && (
        <div className="mb-6 p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <CameraOff className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-300">Aviso sobre a câmera:</p>
              <p className="mt-0.5 text-slate-300">{cameraError}</p>
              <p className="mt-1 text-emerald-400">Você também pode enviar uma foto/selfie salva do seu aparelho!</p>
            </div>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="shrink-0 py-1.5 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Upload className="w-3 h-3 text-amber-400" />
            <span>Enviar Foto</span>
          </button>
        </div>
      )}

      {/* REVEALED AURA CARD (The Free Tasting Result) */}
      <div 
        className="rounded-2xl p-6 sm:p-7 relative border transition-all duration-500"
        style={{
          background: `linear-gradient(145deg, #131527 0%, #0d0f1c 100%)`,
          borderColor: `${currentAura.colorHex}66`,
          boxShadow: `0 10px 30px -10px ${currentAura.colorHex}22`
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Visual Halo / Snapshot display */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center text-center">
            <div className="relative mb-3 group">
              {/* Pulsing Aura Halo Glow */}
              <div 
                className="absolute inset-0 rounded-full blur-xl opacity-60 animate-pulse transition-all duration-1000"
                style={{ backgroundColor: currentAura.colorHex }}
              />

              {/* Photo or Cosmic Avatar Frame */}
              <div 
                className="w-32 h-32 rounded-full relative z-10 border-4 overflow-hidden flex items-center justify-center shadow-2xl bg-slate-900"
                style={{ borderColor: currentAura.colorHex }}
              >
                {currentAura.capturedImageUrl ? (
                  <img
                    src={currentAura.capturedImageUrl}
                    alt="Aura do Consulente"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div 
                    className="w-full h-full flex flex-col items-center justify-center p-3 text-center"
                    style={{
                      background: `radial-gradient(circle, ${currentAura.colorHex}44 0%, #0c0e1a 80%)`
                    }}
                  >
                    <Sun className="w-10 h-10 mb-1" style={{ color: currentAura.colorHex }} />
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                      Frequência Sutil
                    </span>
                  </div>
                )}
              </div>

              {/* Badge overlay */}
              <span 
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-20 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-slate-950 uppercase tracking-wider shadow-md whitespace-nowrap"
                style={{ backgroundColor: currentAura.colorHex }}
              >
                {currentAura.capturedWithCamera ? 'Câmera Frontal Ativa' : 'Ressonância Matriz'}
              </span>
            </div>

            <div className="mt-3">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
                Cor Predominante Revelada
              </span>
              <h4 
                className="font-cinzel text-lg sm:text-xl font-extrabold mt-0.5"
                style={{ color: currentAura.colorHex }}
              >
                {currentAura.primaryColorName}
              </h4>
              <p className="text-xs text-slate-300 font-light mt-0.5">
                {currentAura.auraArchetype}
              </p>
            </div>
          </div>

          {/* Tasting Details & Bioenergetic Metrics */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free Tasting Narrative */}
            <div className="p-4 rounded-xl bg-[#0e101f]/80 border border-slate-800/80">
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Degustação Gratuita: Diagnóstico do Seu Campo Sutil
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-light">
                {currentAura.freeTastingSummary}
              </p>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-[#14162a] border border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
                  <Radio className="w-3.5 h-3.5 text-amber-400" /> Frequência de Ressonância
                </span>
                <p className="text-xs font-bold text-white font-mono">
                  {currentAura.frequencyHz}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#14162a] border border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" /> Alcance do Campo Áurico
                </span>
                <p className="text-xs font-bold text-emerald-300 font-mono">
                  {currentAura.fieldExpansion}
                </p>
              </div>
            </div>

            {/* PDF Comprehensive Teaser (Locked Complement) */}
            <div className="relative rounded-xl p-3.5 bg-gradient-to-r from-amber-500/10 via-purple-900/20 to-amber-500/10 border border-amber-500/30">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0 mt-0.5">
                  <Lock className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">
                    Análise Complementar Completa no Relatório Oficial em PDF (6 Páginas)
                  </h5>
                  <p className="text-[11px] text-slate-300 leading-relaxed mt-0.5">
                    No PDF oficial, você terá o <strong>Protocolo de Blindagem Áurica Diária</strong> contra inveja e vampirismo sutil, 
                    a sintonização com seu Caminho de Vida {report.lifePath.number}, os <strong>3 cristais sagrados de afinidade ({currentAura.recommendedCrystals.join(', ')})</strong> e 
                    recomendações cromáticas para fechar grandes negócios.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            {!isCameraActive && (
              <button
                id="btn-open-camera-aura"
                onClick={startCamera}
                className="py-2.5 px-4 rounded-xl bg-[#1b1e38] hover:bg-[#232747] border border-amber-500/40 text-amber-200 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all hover:border-amber-400"
              >
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                <span>{hasScanned ? 'Escanear Novamente com Câmera' : 'Ativar Câmera Frontal (Opcional)'}</span>
              </button>
            )}

            <button
              onClick={() => fileInputRef.current?.click()}
              className="py-2.5 px-3.5 rounded-xl bg-[#171930] hover:bg-[#212445] border border-purple-500/30 text-purple-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Carregar selfie ou retrato do dispositivo"
            >
              <Upload className="w-3.5 h-3.5 text-purple-300" />
              <span>Carregar Foto / Selfie</span>
            </button>

            <button
              onClick={() => {
                const refreshed = calculateAuraProfile(report.lifePath.number, report.expression.number);
                setHasScanned(false);
                setTimeout(() => {
                  onUpdateReport({ ...report, aura: refreshed });
                }, 0);
              }}
              className="py-2.5 px-3.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              <span>Recalcular Ressonância</span>
            </button>
          </div>

          <button
            id="btn-unlock-from-aura"
            onClick={onUnlockClick}
            className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs tracking-wide flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-500/20 transition-all"
          >
            <span>Desbloquear Relatório & Blindagem no PDF</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Hidden file input for uploading photo */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Hidden canvas for image capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
