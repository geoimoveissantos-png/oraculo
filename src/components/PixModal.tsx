import React, { useState, useEffect } from 'react';
import { PIX_KEY, PIX_RECIPIENT_NAME, PIX_PRICE, OFFICIAL_PIX_PAYLOAD, generatePixQRCodeDataURL } from '../utils/pix';
import { X, Copy, Check, QrCode, ShieldCheck, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PixModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userName: string;
}

export const PixModal: React.FC<PixModalProps> = ({ isOpen, onClose, onSuccess, userName }) => {
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState(false);

  const pixPayload = OFFICIAL_PIX_PAYLOAD;

  useEffect(() => {
    if (isOpen) {
      generatePixQRCodeDataURL(pixPayload).then((url) => {
        setQrCodeUrl(url);
      });
    }
  }, [isOpen, pixPayload]);

  if (!isOpen) return null;

  const handleCopyKey = async () => {
    try {
      await navigator.clipboard.writeText(PIX_KEY);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 3000);
    } catch {
      // Fallback
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 3000);
    }
  };

  const handleCopyPayload = async () => {
    try {
      await navigator.clipboard.writeText(pixPayload);
      setCopiedPayload(true);
      setTimeout(() => setCopiedPayload(false), 3000);
    } catch {
      setCopiedPayload(true);
      setTimeout(() => setCopiedPayload(false), 3000);
    }
  };

  const handleConfirmPayment = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      // Trigger festive celebratory confetti
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#9333EA', '#F59E0B', '#10B981']
        });
      } catch {
        // Safe fallback
      }
      onSuccess();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-[#16182c] to-[#0f101f] border-2 border-amber-500/40 p-6 sm:p-8 shadow-2xl shadow-purple-950/60 my-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Checkout Seguro Pix</span>
          </div>

          <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
            Desbloqueio do Mapa & Relatório PDF
          </h3>

          <p className="text-xs text-slate-300 mt-1">
            Liberando diagnóstico completo para <span className="text-amber-300 font-semibold">{userName}</span>
          </p>

          <div className="mt-3 flex items-center justify-center gap-2">
            <span className="text-2xl font-extrabold text-amber-400 font-cinzel">R$ 15,00</span>
            <span className="text-[11px] text-slate-400 font-mono bg-slate-800/80 px-2 py-0.5 rounded">
              Pagamento Único
            </span>
          </div>
        </div>

        {/* QR Code & Key Instructions */}
        <div className="space-y-5">
          {/* QR Code Canvas Card */}
          <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#0b0c16] border border-amber-500/20">
            {qrCodeUrl ? (
              <div className="p-3 bg-white rounded-xl shadow-lg border-2 border-amber-400/40">
                <img
                  src={qrCodeUrl}
                  alt="QR Code Pix"
                  className="w-44 h-44 sm:w-48 sm:h-48 object-contain"
                />
              </div>
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-slate-500">
                <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
              </div>
            )}
            <p className="text-[11px] text-slate-400 mt-3 text-center">
              Abra o app do seu banco, escolha <strong>Pagar com Pix</strong> e aponte a câmera para o QR Code acima.
            </p>
          </div>

          {/* Pix Key Display & Copy Action */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                Chave Pix (Chave Aleatória):
              </span>
              <span className="text-slate-400 text-[11px]">Favorecido: {PIX_RECIPIENT_NAME}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 bg-[#0b0c16] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-amber-300 font-mono select-all truncate">
                {PIX_KEY}
              </div>
              <button
                id="btn-copy-pix-key"
                onClick={handleCopyKey}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#0b0c16] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-md shadow-amber-500/20"
              >
                {copiedKey ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-950 stroke-[3]" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Chave</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Copia e Cola Code / Endereço Pix */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">
                Código Pix Copia e Cola / Endereço do Pix:
              </span>
              <span className="text-emerald-400 text-[11px] font-mono">Valor: R$ 15,00</span>
            </div>

            <div className="p-2.5 bg-[#0b0c16] border border-slate-700/80 rounded-xl font-mono text-[10px] text-slate-400 break-all select-all max-h-16 overflow-y-auto">
              {pixPayload}
            </div>

            <button
              id="btn-copy-copia-cola"
              onClick={handleCopyPayload}
              className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#0b0c16] font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
            >
              {copiedPayload ? (
                <>
                  <Check className="w-4 h-4 text-emerald-950 stroke-[3]" />
                  <span className="text-emerald-950 font-extrabold">Código / Endereço Pix Copiado com Sucesso!</span>
                </>
              ) : (
                <>
                  <QrCode className="w-4 h-4 text-[#0b0c16]" />
                  <span>Copiar Código / Endereço Pix Copia e Cola</span>
                </>
              )}
            </button>
          </div>

          {/* Confirm Payment Action Button (Instant Verification Simulation) */}
          <div className="pt-2 space-y-2">
            <button
              id="btn-confirm-pix-payment"
              onClick={handleConfirmPayment}
              disabled={isVerifying}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-[#0b0c16] font-bold text-sm tracking-wide transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#0b0c16]" />
                  <span>Verificando Pagamento Pix...</span>
                </>
              ) : (
                <>
                  <span>Já realizei o pagamento / Confirmar</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              Confirmação instantânea do Pix com liberação automática do relatório.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
