import React, { useState } from 'react';
import { NumerologyReport } from '../types';
import { ShieldCheck, Mail, Phone, Lock, AlertCircle, CheckCircle2, X, Download } from 'lucide-react';

interface PdfVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: NumerologyReport;
  onConfirmSuccess: (contact: { email?: string; phone?: string }) => void;
}

export const PdfVerificationModal: React.FC<PdfVerificationModalProps> = ({
  isOpen,
  onClose,
  report,
  onConfirmSuccess,
}) => {
  const initialMethod = report.user.email ? 'email' : report.user.phone ? 'phone' : 'email';
  const [method, setMethod] = useState<'email' | 'phone'>(initialMethod);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  // Format WhatsApp with DDD as typing: (11) 98765-4321
  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) {
      return digits ? `(${digits}` : '';
    }
    if (digits.length <= 6) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }
    if (digits.length <= 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (method === 'phone') {
      setInputValue(formatPhone(val));
    } else {
      setInputValue(val);
    }
    if (error) setError(null);
  };

  const handleSwitchMethod = (newMethod: 'email' | 'phone') => {
    setMethod(newMethod);
    setError(null);
    setInputValue('');
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const entered = inputValue.trim();
    if (!entered) {
      setError(
        method === 'email'
          ? 'Por favor, informe seu e-mail cadastrado para liberar o download do PDF.'
          : 'Por favor, informe seu WhatsApp com DDD cadastrado para liberar o download do PDF.'
      );
      return;
    }

    if (method === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(entered)) {
        setError('Por favor, informe um endereço de e-mail válido (exemplo: seu.nome@email.com).');
        return;
      }

      // Verify against registered email
      const registeredEmail = (report.user.email || '').trim().toLowerCase();
      if (registeredEmail && entered.toLowerCase() !== registeredEmail) {
        setError('O e-mail digitado não coincide com o e-mail cadastrado na consulta prévia deste mapa. Por favor, digite o mesmo e-mail para liberar o download.');
        return;
      }
    } else {
      const enteredDigits = entered.replace(/\D/g, '');
      if (enteredDigits.length < 10) {
        setError('Por favor, informe seu WhatsApp completo com DDD (exemplo: (11) 98765-4321).');
        return;
      }

      // Verify against registered phone
      const registeredDigits = (report.user.phone || '').replace(/\D/g, '');
      if (registeredDigits && enteredDigits !== registeredDigits) {
        setError('O WhatsApp digitado não coincide com o WhatsApp cadastrado na consulta prévia deste mapa. Por favor, digite o mesmo WhatsApp com DDD para liberar o download.');
        return;
      }
    }

    setIsSuccess(true);
    setError(null);

    const contactData = {
      email: method === 'email' ? entered : report.user.email,
      phone: method === 'phone' ? entered : report.user.phone,
    };

    // Persist verification for this report in localStorage
    try {
      localStorage.setItem(`pdf_verified_${report.referralId}`, 'true');
      if (contactData.email) localStorage.setItem(`client_email_${report.referralId}`, contactData.email);
      if (contactData.phone) localStorage.setItem(`client_phone_${report.referralId}`, contactData.phone);
    } catch {
      // safe ignore
    }

    setTimeout(() => {
      onConfirmSuccess(contactData);
      onClose();
      setIsSuccess(false);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#111224] border-2 border-amber-500/40 p-6 sm:p-8 shadow-2xl shadow-purple-950/60">
        {/* Top Glow Accent */}
        <div className="absolute -top-[2px] left-1/2 -translate-x-1/2 w-48 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-3 shadow-lg shadow-amber-500/5">
            <Lock className="w-7 h-7" />
          </div>

          <div className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold mb-2">
            ✓ Pagamento PIX Confirmado
          </div>

          <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-white tracking-wide">
            Liberação do PDF Oficial
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-sm mx-auto leading-relaxed">
            Confirme o <strong className="text-white">E-mail</strong> ou <strong className="text-white">WhatsApp com DDD</strong> cadastrado na consulta prévia para autenticar e baixar o mapa oficial de <strong className="text-amber-300 font-semibold">{report.user.fullName}</strong>.
          </p>
        </div>

        {/* Tab Selection: Email or WhatsApp */}
        <div className="flex rounded-xl bg-[#090a14] p-1 border border-slate-800 mb-5">
          <button
            type="button"
            onClick={() => handleSwitchMethod('email')}
            className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              method === 'email'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mail className="w-4 h-4 text-amber-400" />
            <span>Confirmar por E-mail</span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchMethod('phone')}
            className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              method === 'phone'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>Confirmar por WhatsApp</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleVerify} className="space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-500/60 text-red-200 text-xs sm:text-sm flex items-start gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          {isSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/60 text-emerald-200 text-xs sm:text-sm flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Contato confirmado com sucesso! Gerando e iniciando download do seu PDF...</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              {method === 'email' ? 'Seu Melhor E-mail' : 'WhatsApp com DDD'} <span className="text-amber-400">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                {method === 'email' ? (
                  <Mail className="w-4 h-4 text-amber-400/80" />
                ) : (
                  <Phone className="w-4 h-4 text-emerald-400/80" />
                )}
              </div>
              <input
                type={method === 'email' ? 'email' : 'tel'}
                value={inputValue}
                onChange={handleInputChange}
                placeholder={method === 'email' ? 'exemplo@seuemail.com' : '(11) 98765-4321'}
                disabled={isSuccess}
                autoFocus
                className="w-full pl-10 pr-4 py-3 bg-[#0a0b16] border border-slate-700/90 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 rounded-xl text-white placeholder-slate-500 text-sm transition-all outline-none"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              {method === 'email'
                ? 'Enviaremos uma cópia de segurança do seu relatório em alta definição.'
                : 'DDD + número para validação e suporte direto da sua assinatura cósmica.'}
            </p>
          </div>

          <div className="pt-3 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onClose}
              className="sm:w-1/3 py-3 px-4 rounded-xl border border-slate-700 hover:bg-slate-800/60 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSuccess}
              className="sm:w-2/3 py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-[#0f101f] font-bold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isSuccess ? 'Gerando PDF...' : 'Confirmar e Baixar PDF'}</span>
            </button>
          </div>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Entrega sagrada protegida & confidencial</span>
        </div>
      </div>
    </div>
  );
};
