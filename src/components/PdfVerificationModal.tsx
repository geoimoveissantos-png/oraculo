import React, { useState } from 'react';
import { NumerologyReport } from '../types';
import { ShieldCheck, Mail, Phone, Lock, AlertCircle, CheckCircle2, X, Download, Send, Loader2, ExternalLink } from 'lucide-react';
import { sendPdfByEmail, sendPdfByWhatsApp } from '../utils/deliveryService';
import { generatePDF } from '../utils/pdfGenerator';
import { getRecommendedBooksForReport } from '../utils/bookRecommendations';

interface PdfVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: NumerologyReport;
  onConfirmSuccess: (contact: { email?: string; phone?: string; method?: 'email' | 'phone' }) => void;
}

export const PdfVerificationModal: React.FC<PdfVerificationModalProps> = ({
  isOpen,
  onClose,
  report,
  onConfirmSuccess,
}) => {
  const initialMethod = report.user.email ? 'email' : report.user.phone ? 'phone' : 'email';
  const [method, setMethod] = useState<'email' | 'phone'>(initialMethod);
  const [inputValue, setInputValue] = useState(
    initialMethod === 'email' ? (report.user.email || '') : (report.user.phone || '')
  );
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState<{
    success: boolean;
    channel: 'email' | 'whatsapp';
    recipient: string;
    message: string;
  } | null>(null);

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
    setInputValue(newMethod === 'email' ? (report.user.email || '') : (report.user.phone || ''));
  };

  const handleVerifyAndDeliver = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const entered = inputValue.trim();
    if (!entered) {
      setError(
        method === 'email'
          ? 'Por favor, informe seu e-mail cadastrado para liberar o download e envio do PDF.'
          : 'Por favor, informe seu WhatsApp com DDD cadastrado para liberar o download e envio do PDF.'
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
        setError('O e-mail digitado não coincide com o e-mail cadastrado na consulta prévia deste mapa. Por favor, digite o mesmo e-mail para validar a entrega.');
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
        setError('O WhatsApp digitado não coincide com o WhatsApp cadastrado na consulta prévia deste mapa. Por favor, digite o mesmo WhatsApp com DDD para validar a entrega.');
        return;
      }
    }

    setIsProcessing(true);

    try {
      // 1. Generate full 10-page consecrated PDF (triggers download automatically)
      const books = getRecommendedBooksForReport(report);
      const pdfResult = generatePDF(report, books, { autoSave: true });

      // 2. Persist contact in report and localStorage
      const contactData = {
        email: method === 'email' ? entered : report.user.email,
        phone: method === 'phone' ? entered : report.user.phone,
        method,
      };

      try {
        localStorage.setItem(`pdf_verified_${report.referralId}`, 'true');
        if (contactData.email) localStorage.setItem(`client_email_${report.referralId}`, contactData.email);
        if (contactData.phone) localStorage.setItem(`client_phone_${report.referralId}`, contactData.phone);
      } catch {
        // safe ignore
      }

      // 3. Dispatch PDF via Email or WhatsApp according to selected method
      if (method === 'email') {
        const emailRes = await sendPdfByEmail(report, entered, pdfResult.dataUri, pdfResult.filename);
        setDeliveryStatus({
          success: emailRes.success,
          channel: 'email',
          recipient: entered,
          message: emailRes.message,
        });
      } else {
        const waRes = await sendPdfByWhatsApp(report, entered, pdfResult.blob, pdfResult.filename);
        setDeliveryStatus({
          success: waRes.success,
          channel: 'whatsapp',
          recipient: entered,
          message: waRes.message,
        });
      }

      onConfirmSuccess(contactData);
    } catch (err) {
      console.error('Delivery error:', err);
      setError('Ocorreu um erro ao processar o PDF. Seu arquivo foi baixado, mas não conseguimos concluir o disparo automático.');
    } finally {
      setIsProcessing(false);
    }
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
            {deliveryStatus ? (
              <CheckCircle2 className="w-7 h-7 text-emerald-400 animate-bounce" />
            ) : (
              <Lock className="w-7 h-7 text-amber-400" />
            )}
          </div>
          <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white tracking-wide">
            {deliveryStatus ? 'Relatório Entregue com Sucesso!' : 'Confirmação de Entrega Sagrada'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md mx-auto">
            {deliveryStatus
              ? 'Seu documento oficial completo de 19 páginas foi processado e entregue nos canais solicitados.'
              : 'Para sua segurança e entrega do PDF oficial de 19 páginas, confirme seu E-mail ou WhatsApp cadastrado:'}
          </p>
        </div>

        {/* Success State View */}
        {deliveryStatus ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs sm:text-sm space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-300 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Download Iniciado & PDF Enviado</span>
              </div>
              <p className="text-slate-200">
                {deliveryStatus.message}
              </p>
              <div className="pt-2 border-t border-emerald-500/20 text-[11px] text-emerald-400 font-mono">
                Destinatário: {deliveryStatus.recipient} • 19 Páginas com 6 Números da Sorte e 4 Cartazes de Reflexão
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#0e1022] border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
              <span>Arquivo: Mapa-Numerologico-{report.user.fullName.replace(/\s+/g, '-')}-Completo.pdf</span>
              <span className="text-amber-400 font-semibold">Salvo em Downloads</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-[#0f101f] font-bold text-sm tracking-wider uppercase transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Concluir e Voltar ao Painel</span>
            </button>
          </div>
        ) : (
          /* Form view */
          <>
            {/* Method Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#0b0c17] rounded-xl border border-slate-800 mb-5">
              <button
                type="button"
                onClick={() => handleSwitchMethod('email')}
                className={`py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  method === 'email'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>Confirmar E-mail</span>
              </button>

              <button
                type="button"
                onClick={() => handleSwitchMethod('phone')}
                className={`py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  method === 'phone'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Phone className="w-4 h-4" />
                <span>Confirmar WhatsApp</span>
              </button>
            </div>

            {/* Benefits highlight */}
            <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 mb-5 text-[11px] text-amber-200/90 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold text-amber-300 block">
                  {method === 'email'
                    ? 'Baixe agora + Receba o PDF de 19 Páginas no seu E-mail'
                    : 'Baixe agora + Envio automático do PDF e Mensagem no WhatsApp'}
                </span>
                <p className="text-slate-300 text-[11px]">
                  Inclui seus 6 Números Sagrados da Sorte do semestre (01 a 60), Códigos de Riqueza e os 4 Cartazes de Reflexão em alta resolução.
                </p>
              </div>
            </div>

            <form onSubmit={handleVerifyAndDeliver} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/50 text-red-200 text-xs flex items-start gap-2 animate-shake">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                  {method === 'email' ? 'Seu E-mail Cadastrado' : 'WhatsApp com DDD'} <span className="text-amber-400">*</span>
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
                    disabled={isProcessing}
                    autoFocus
                    className="w-full pl-10 pr-4 py-3 bg-[#0a0b16] border border-slate-700/90 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 rounded-xl text-white placeholder-slate-500 text-sm transition-all outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  {method === 'email'
                    ? 'Ao confirmar, você baixa o PDF imediatamente e recebe o anexo por e-mail.'
                    : 'Ao confirmar, você baixa o PDF imediatamente e abre o WhatsApp com a mensagem sagrada e anexo.'}
                </p>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isProcessing}
                  className="sm:w-1/3 py-3 px-4 rounded-xl border border-slate-700 hover:bg-slate-800/60 text-slate-300 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="sm:w-2/3 py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-[#0f101f] font-bold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Gerando & Enviando...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Confirmar, Baixar & Enviar</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Entrega sagrada protegida, criptografada & confidencial</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
