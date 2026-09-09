import React, { useState, useEffect } from 'react';
import { UserInputs, NumerologyReport, AppStep } from './types';
import { generateNumerologyReport } from './utils/numerology';
import { Header } from './components/Header';
import { NumerologyForm } from './components/NumerologyForm';
import { FreePreviewCard } from './components/FreePreviewCard';
import { PixModal } from './components/PixModal';
import { FullReportDashboard } from './components/FullReportDashboard';
import { ShareModal } from './components/ShareModal';
import { Footer } from './components/Footer';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { recordReportEmission, updatePaymentStatus, getAdminOrders } from './utils/adminStorage';
import { Sparkles } from 'lucide-react';

export default function App() {
  const [step, setStep] = useState<AppStep>('form');
  const [report, setReport] = useState<NumerologyReport | null>(null);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [isPixModalOpen, setIsPixModalOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [refInvitedBy, setRefInvitedBy] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Check URL query parameters for referral link (?ref=...) or admin (?admin=true / #admin)
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const ref = urlParams.get('ref');
      if (ref) {
        setRefInvitedBy(ref);
      }
      if (urlParams.get('admin') === 'true' || window.location.hash === '#admin') {
        setIsAdminModalOpen(true);
      }
    } catch {
      // Safe fallback
    }
  }, []);

  // Sync unlock state if admin changes payment status in background/tab
  useEffect(() => {
    const handleOrdersChange = () => {
      if (report) {
        const savedUnlocked = localStorage.getItem(`unlocked_${report.referralId}`);
        const shouldBeUnlocked = savedUnlocked === 'true';
        if (shouldBeUnlocked !== isUnlocked) {
          setIsUnlocked(shouldBeUnlocked);
          if (shouldBeUnlocked && step === 'preview') {
            setStep('full_report');
          } else if (!shouldBeUnlocked && step === 'full_report') {
            setStep('preview');
          }
        }
      }
    };

    window.addEventListener('admin_orders_updated', handleOrdersChange);
    return () => {
      window.removeEventListener('admin_orders_updated', handleOrdersChange);
    };
  }, [report, isUnlocked, step]);

  // Handle Form Submission (Step 1 -> Step 2)
  const handleFormSubmit = (inputs: UserInputs) => {
    setIsCalculating(true);
    setTimeout(() => {
      const generated = generateNumerologyReport(inputs);
      setReport(generated);

      // Check if this specific report was previously unlocked in localStorage
      const savedUnlocked = localStorage.getItem(`unlocked_${generated.referralId}`);
      const isAlreadyUnlocked = savedUnlocked === 'true';

      // Record PDF emission in Admin registry
      recordReportEmission(generated, isAlreadyUnlocked ? 'pago' : 'pendente');

      if (isAlreadyUnlocked) {
        setIsUnlocked(true);
        setStep('full_report');
      } else {
        setIsUnlocked(false);
        setStep('preview');
      }
      setIsCalculating(false);

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 400);
  };

  // Open Pix Checkout Modal (Step 2 -> Step 3)
  const handleOpenPixModal = () => {
    setIsPixModalOpen(true);
  };

  // Payment Confirmation Success (Step 3 -> Step 4)
  const handlePaymentSuccess = () => {
    if (report) {
      localStorage.setItem(`unlocked_${report.referralId}`, 'true');
      updatePaymentStatus(report.referralId, 'pago');
    }
    setIsUnlocked(true);
    setIsPixModalOpen(false);
    setStep('full_report');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to form
  const handleNewCalculation = () => {
    setReport(null);
    setIsUnlocked(false);
    setStep('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Back to edit form
  const handleEditInputs = () => {
    setStep('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Select a report from Admin Dashboard to view in the app
  const handleSelectReportFromAdmin = (selectedReport: NumerologyReport) => {
    setReport(selectedReport);
    const isReportUnlocked = localStorage.getItem(`unlocked_${selectedReport.referralId}`) === 'true';
    setIsUnlocked(isReportUnlocked);
    setStep(isReportUnlocked ? 'full_report' : 'preview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0c16] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
      {/* Mystic Ambient Background Lights */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-purple-900/15 via-amber-500/10 to-transparent blur-[120px]" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-purple-900/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-20 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px]" />
      </div>

      {/* Referral Welcome Notification */}
      {refInvitedBy && step === 'form' && (
        <div className="bg-gradient-to-r from-amber-500/15 via-purple-600/15 to-amber-500/15 border-b border-amber-500/20 py-2.5 px-4 text-center text-xs text-amber-200 flex items-center justify-center gap-2 relative z-50">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Você está acessando através da indicação de um amigo (<strong className="font-mono text-amber-300">#{refInvitedBy}</strong>). Calcule seu mapa agora!</span>
        </div>
      )}

      {/* Header */}
      <Header
        onNewCalculation={step !== 'form' ? handleNewCalculation : undefined}
        isUnlocked={isUnlocked}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 relative z-10">
        {step === 'form' && (
          <div className="py-4">
            <NumerologyForm onSubmit={handleFormSubmit} isLoading={isCalculating} />
          </div>
        )}

        {step === 'preview' && report && (
          <FreePreviewCard
            report={report}
            onUnlockClick={handleOpenPixModal}
            onEditClick={handleEditInputs}
            onUpdateReport={(updated) => setReport(updated)}
          />
        )}

        {step === 'full_report' && report && (
          <FullReportDashboard
            report={report}
            onOpenShare={() => setIsShareModalOpen(true)}
            onNewCalculation={handleNewCalculation}
          />
        )}
      </main>

      {/* Pix Payment Checkout Modal */}
      {report && (
        <PixModal
          isOpen={isPixModalOpen}
          onClose={() => setIsPixModalOpen(false)}
          onSuccess={handlePaymentSuccess}
          userName={report.user.fullName}
        />
      )}

      {/* Viral Share Modal */}
      {report && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          report={report}
        />
      )}

      {/* Admin Dashboard Modal */}
      <AdminDashboardModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSelectReportToView={handleSelectReportFromAdmin}
      />

      {/* Footer */}
      <Footer onOpenAdmin={() => setIsAdminModalOpen(true)} />
    </div>
  );
}

