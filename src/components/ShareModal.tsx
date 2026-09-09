import React, { useState, useRef, useEffect } from 'react';
import { NumerologyReport } from '../types';
import { X, Share2, Copy, Check, Download, MessageCircle, Sparkles, Image as ImageIcon } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: NumerologyReport;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, report }) => {
  const [copied, setCopied] = useState(false);
  const [generatingStory, setGeneratingStory] = useState(false);
  const [storyImageUrl, setStoryImageUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://seudominio.com';
  const customShareLink = `${baseUrl}/?ref=${encodeURIComponent(report.referralId)}`;
  const shareText = `Acabei de fazer meu Mapa Numerológico e Diagnóstico de Prosperidade! Descubra o seu também: ${customShareLink}`;

  // WhatsApp Share URL
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(customShareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  // Generate Instagram Story PNG (1080 x 1920)
  const generateStoryCard = () => {
    setGeneratingStory(true);
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background Gradient: Deep Mystic Night
    const bgGradient = ctx.createLinearGradient(0, 0, 1080, 1920);
    bgGradient.addColorStop(0, '#0B0C16');
    bgGradient.addColorStop(0.3, '#16182C');
    bgGradient.addColorStop(0.7, '#111322');
    bgGradient.addColorStop(1, '#080911');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1080, 1920);

    // Decorative Sacred Gold Borders
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 4;
    ctx.strokeRect(50, 50, 980, 1820);

    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(65, 65, 950, 1790);

    // Corner decorative circles
    const corners = [[75, 75], [1005, 75], [75, 1845], [1005, 1845]];
    corners.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 12, 0, Math.PI * 2);
      ctx.fillStyle = '#D4AF37';
      ctx.fill();
    });

    // Header Badge
    ctx.textAlign = 'center';
    ctx.fillStyle = '#F3E5AB';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('MAPA NUMEROLÓGICO & DIAGNÓSTICO', 540, 190);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 46px sans-serif';
    ctx.fillText('MEUS CÓDIGOS DE PROSPERIDADE', 540, 255);

    // Gold Divider
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(340, 290);
    ctx.lineTo(740, 290);
    ctx.stroke();

    // User Name
    ctx.fillStyle = '#E2E8F0';
    ctx.font = '32px sans-serif';
    ctx.fillText(report.user.fullName.toUpperCase(), 540, 360);

    // Central Emblem: Life Path
    const emblemY = 590;
    // Concentric circles
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(540, emblemY, 180, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(540, emblemY, 150, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = 'rgba(26, 27, 47, 0.9)';
    ctx.beginPath();
    ctx.arc(540, emblemY, 145, 0, Math.PI * 2);
    ctx.fill();

    // Life Path Big Number
    ctx.fillStyle = '#D4AF37';
    ctx.font = 'bold 150px sans-serif';
    ctx.fillText(`${report.lifePath.number}`, 540, emblemY + 50);

    ctx.fillStyle = '#F3E5AB';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText('CAMINHO DE VIDA', 540, emblemY + 115);

    // Archetype Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 42px sans-serif';
    ctx.fillText(report.lifePath.archetype, 540, 860);

    // Core Numbers 3-Column Card
    const cardY = 940;
    const items = [
      { label: 'EXPRESSÃO', num: report.expression.number },
      { label: 'DESEJO DA ALMA', num: report.soulUrge.number },
      { label: 'PERSONALIDADE', num: report.personality.number }
    ];

    items.forEach((item, idx) => {
      const boxX = 130 + idx * 280;
      ctx.fillStyle = 'rgba(22, 24, 44, 0.85)';
      ctx.fillRect(boxX, cardY, 260, 200);
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 2;
      ctx.strokeRect(boxX, cardY, 260, 200);

      ctx.fillStyle = '#F3E5AB';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(item.label, boxX + 130, cardY + 50);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 64px sans-serif';
      ctx.fillText(`${item.num}`, boxX + 130, cardY + 130);
    });

    // Prosperity Banner Box
    const bannerY = 1200;
    ctx.fillStyle = 'rgba(212, 175, 55, 0.15)';
    ctx.fillRect(130, bannerY, 820, 260);
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 3;
    ctx.strokeRect(130, bannerY, 820, 260);

    ctx.fillStyle = '#D4AF37';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText(`POTENCIAL DE PROSPERIDADE: ${report.prosperity.score}%`, 540, bannerY + 60);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText(report.prosperity.archetype, 540, bannerY + 120);

    ctx.fillStyle = '#E2E8F0';
    ctx.font = '28px sans-serif';
    ctx.fillText(`Ano Pessoal ${report.personalYear.yearNumber} (${report.personalYear.calendarYear}) • Frequência de Ouro`, 540, bannerY + 180);

    // Sacred Code Footer Callout
    ctx.fillStyle = '#F3E5AB';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText('CÓDIGO DE ATIVAÇÃO: 520 741 8', 540, 1540);

    // Call to Action for Stories Viewer
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 34px sans-serif';
    ctx.fillText('Descubra o seu Mapa no link abaixo:', 540, 1630);

    // Referral link pill
    ctx.fillStyle = '#D4AF37';
    ctx.fillRect(200, 1670, 680, 80);
    ctx.fillStyle = '#0B0C16';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText(`?ref=${report.referralId}`, 540, 1722);

    const url = canvas.toDataURL('image/png');
    setStoryImageUrl(url);
    setGeneratingStory(false);
  };

  const handleDownloadStory = () => {
    if (!storyImageUrl) return;
    const link = document.createElement('a');
    link.download = `Mapa-Stories-${report.referralId}.png`;
    link.href = storyImageUrl;
    link.click();
  };

  useEffect(() => {
    if (isOpen && !storyImageUrl) {
      generateStoryCard();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-2xl bg-gradient-to-b from-[#16182c] to-[#0f101f] border-2 border-amber-500/40 p-6 sm:p-8 shadow-2xl shadow-purple-950/60 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Loop Viral & Compartilhamento</span>
          </div>

          <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
            Compartilhe Seu Diagnóstico Cósmico
          </h3>

          <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
            Inspire amigos e familiares a descobrirem o próprio Caminho de Vida e ativarem sua frequência de abundância.
          </p>
        </div>

        {/* Social Sharing Actions */}
        <div className="space-y-4">
          {/* Custom Link Box */}
          <div className="p-3.5 rounded-xl bg-[#0d0e1c] border border-slate-700/80 space-y-2">
            <span className="block text-xs font-semibold text-slate-300">
              Seu Link Personalizado de Indicação:
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={customShareLink}
                className="flex-1 bg-[#121325] border border-slate-700 rounded-lg px-3 py-2 text-xs text-amber-300 font-mono select-all truncate outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-[#0b0c16] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Social Buttons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-[#0b0c16] font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Compartilhar no WhatsApp</span>
            </a>

            {/* Instagram Stories Image Generator */}
            <button
              onClick={handleDownloadStory}
              disabled={!storyImageUrl}
              className="py-3 px-4 rounded-xl bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Baixar Card para Stories (PNG)</span>
            </button>
          </div>

          {/* Stories Preview Card */}
          {storyImageUrl && (
            <div className="mt-4 p-3 rounded-xl bg-[#0c0d19] border border-amber-500/20 text-center">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-[11px] text-amber-300 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Prévia do Card 9:16 (Stories)
                </span>
                <button
                  onClick={handleDownloadStory}
                  className="text-[11px] text-slate-300 hover:text-amber-300 flex items-center gap-1 underline cursor-pointer"
                >
                  <Download className="w-3 h-3" /> Baixar Imagem
                </button>
              </div>
              <div className="max-h-56 overflow-hidden rounded-lg border border-slate-800 flex justify-center bg-black">
                <img
                  src={storyImageUrl}
                  alt="Prévia Stories"
                  className="max-h-56 object-contain"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
