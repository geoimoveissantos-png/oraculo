import React, { useState, useEffect, useMemo } from 'react';
import { 
  Shield, 
  Lock, 
  Unlock, 
  User, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Download, 
  Search, 
  Filter, 
  LogOut, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  Plus, 
  Trash2, 
  DollarSign, 
  FileText, 
  Sparkles, 
  ArrowUpDown,
  X,
  AlertCircle,
  Mail,
  Phone
} from 'lucide-react';
import { AdminOrderRecord, PaymentStatus, NumerologyReport } from '../types';
import { 
  getAdminOrders, 
  updatePaymentStatus, 
  deleteAdminOrder, 
  recordReportEmission, 
  loginAdmin, 
  logoutAdmin, 
  isUserAdminLoggedIn, 
  getAdminCredentials 
} from '../utils/adminStorage';
import { generatePDF } from '../utils/pdfGenerator';
import { generateNumerologyReport } from '../utils/numerology';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectReportToView?: (report: NumerologyReport) => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  onSelectReportToView
}) => {
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => isUserAdminLoggedIn());
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Orders list state
  const [orders, setOrders] = useState<AdminOrderRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'pago' | 'pendente'>('todos');
  const [isGeneratingPdfId, setIsGeneratingPdfId] = useState<string | null>(null);
  const [notificationMsg, setNotificationMsg] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  // Manual new order modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientBirthDate, setNewClientBirthDate] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientStatus, setNewClientStatus] = useState<PaymentStatus>('pendente');

  // Delete confirmation modal state
  const [orderToDelete, setOrderToDelete] = useState<{ id: string; name: string } | null>(null);

  // Load orders
  const refreshOrders = () => {
    setOrders(getAdminOrders());
  };

  useEffect(() => {
    if (isOpen) {
      setIsLoggedIn(isUserAdminLoggedIn());
      refreshOrders();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleOrdersUpdate = () => {
      refreshOrders();
    };
    const handleAuthUpdate = () => {
      setIsLoggedIn(isUserAdminLoggedIn());
    };
    window.addEventListener('admin_orders_updated', handleOrdersUpdate);
    window.addEventListener('admin_auth_changed', handleAuthUpdate);
    return () => {
      window.removeEventListener('admin_orders_updated', handleOrdersUpdate);
      window.removeEventListener('admin_auth_changed', handleAuthUpdate);
    };
  }, []);

  const showNotification = (text: string, type: 'success' | 'info' = 'success') => {
    setNotificationMsg({ text, type });
    setTimeout(() => {
      setNotificationMsg(null);
    }, 3500);
  };

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const ok = loginAdmin(usernameInput, passwordInput);
    if (ok) {
      setIsLoggedIn(true);
      setUsernameInput('');
      setPasswordInput('');
      refreshOrders();
      showNotification('Acesso autenticado com sucesso!', 'success');
    } else {
      setAuthError('Usuário ou senha incorretos. Utilize as credenciais padrão indicadas abaixo.');
    }
  };

  const handleFillDemoCreds = () => {
    const creds = getAdminCredentials();
    setUsernameInput(creds.username);
    setPasswordInput(creds.password);
    setAuthError(null);
  };

  const handleLogout = () => {
    logoutAdmin();
    setIsLoggedIn(false);
    showNotification('Sessão encerrada com segurança.', 'info');
  };

  // Change payment status action
  const handleTogglePaymentStatus = (order: AdminOrderRecord) => {
    const newStatus: PaymentStatus = order.paymentStatus === 'pago' ? 'pendente' : 'pago';
    updatePaymentStatus(order.id, newStatus);
    refreshOrders();
    showNotification(
      `Status de ${order.clientName} modificado para ${newStatus.toUpperCase()} com sucesso!`,
      newStatus === 'pago' ? 'success' : 'info'
    );
  };

  // Direct status setting
  const handleSetStatus = (orderId: string, status: PaymentStatus, clientName: string) => {
    updatePaymentStatus(orderId, status);
    refreshOrders();
    showNotification(`Status de ${clientName} atualizado para ${status.toUpperCase()}!`);
  };

  // Download PDF directly from admin
  const handleDownloadPdf = (order: AdminOrderRecord) => {
    let reportToPrint = order.report;
    if (!reportToPrint) {
      // Re-generate report if missing
      reportToPrint = generateNumerologyReport({
        fullName: order.clientName,
        birthDate: order.birthDate.includes('/') 
          ? order.birthDate.split('/').reverse().join('-') 
          : order.birthDate || '1990-01-01',
        email: order.email,
        phone: order.phone
      });
    }

    setIsGeneratingPdfId(order.id);
    try {
      generatePDF(reportToPrint);
      showNotification(`Download do PDF de ${order.clientName} iniciado!`);
    } catch (err) {
      console.error('Erro ao gerar PDF no painel admin:', err);
    } finally {
      setTimeout(() => setIsGeneratingPdfId(null), 1200);
    }
  };

  // View full report
  const handleViewReport = (order: AdminOrderRecord) => {
    let reportToView = order.report;
    if (!reportToView) {
      reportToView = generateNumerologyReport({
        fullName: order.clientName,
        birthDate: order.birthDate.includes('/') 
          ? order.birthDate.split('/').reverse().join('-') 
          : order.birthDate || '1990-01-01',
        email: order.email,
        phone: order.phone
      });
    }

    if (onSelectReportToView) {
      onSelectReportToView(reportToView);
      onClose();
    }
  };

  // Open delete confirmation modal
  const handleDelete = (orderId: string, clientName: string) => {
    setOrderToDelete({ id: orderId, name: clientName });
  };

  // Perform deletion
  const handleConfirmDelete = () => {
    if (!orderToDelete) return;
    deleteAdminOrder(orderToDelete.id);
    refreshOrders();
    showNotification(`Registro de ${orderToDelete.name} excluído com sucesso.`);
    setOrderToDelete(null);
  };

  // Manual new order submit
  const handleCreateManualOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim() || !newClientBirthDate) return;

    const report = generateNumerologyReport({
      fullName: newClientName.trim(),
      birthDate: newClientBirthDate,
      email: newClientEmail.trim() || undefined,
      phone: newClientPhone.trim() || undefined
    });

    recordReportEmission(report, newClientStatus);
    refreshOrders();
    setIsAddModalOpen(false);
    setNewClientName('');
    setNewClientBirthDate('');
    setNewClientEmail('');
    setNewClientPhone('');
    setNewClientStatus('pendente');
    showNotification(`Novo registro para "${report.user.fullName}" criado com sucesso!`);
  };

  // Filtered & searched orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const term = searchTerm.toLowerCase();
      const matchName = order.clientName.toLowerCase().includes(term);
      const matchEmail = (order.email || order.report?.user.email || '').toLowerCase().includes(term);
      const cleanPhone = (order.phone || order.report?.user.phone || '').replace(/\D/g, '');
      const cleanTerm = term.replace(/\D/g, '');
      const matchPhone = (cleanTerm.length > 2 && cleanPhone.includes(cleanTerm)) || 
                         (order.phone || order.report?.user.phone || '').toLowerCase().includes(term);
      const matchStatus = statusFilter === 'todos' || order.paymentStatus === statusFilter;
      return (matchName || matchEmail || matchPhone) && matchStatus;
    });
  }, [orders, searchTerm, statusFilter]);


  // Financial and KPI statistics
  const stats = useMemo(() => {
    const total = orders.length;
    const paid = orders.filter(o => o.paymentStatus === 'pago');
    const pending = orders.filter(o => o.paymentStatus === 'pendente');
    const totalRevenue = paid.reduce((sum, o) => sum + (o.amount || 27.90), 0);
    const pendingRevenue = pending.reduce((sum, o) => sum + (o.amount || 27.90), 0);
    return {
      total,
      paidCount: paid.length,
      pendingCount: pending.length,
      totalRevenue,
      pendingRevenue
    };
  }, [orders]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Container */}
      <div className="relative w-full max-w-5xl bg-[#0e1022] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header Bar */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#141733] via-[#1c2045] to-[#141733] border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-cinzel text-lg sm:text-xl font-bold tracking-wide text-white">
                  Ambiente Administrativo
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Gestão de PDFs & Pagamentos
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Consulta de nomes, datas de emissão do PDF e controle de status pago/pendente
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs text-slate-300 hover:text-white transition-all cursor-pointer"
                title="Encerrar sessão de administrador"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sair</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/60 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
              title="Fechar painel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notification Banner */}
        {notificationMsg && (
          <div className={`px-6 py-2.5 text-xs flex items-center justify-between border-b ${
            notificationMsg.type === 'success' 
              ? 'bg-emerald-950/70 border-emerald-500/30 text-emerald-200' 
              : 'bg-indigo-950/70 border-indigo-500/30 text-indigo-200'
          }`}>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{notificationMsg.text}</span>
            </div>
            <button 
              onClick={() => setNotificationMsg(null)}
              className="text-slate-400 hover:text-white text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* ================= LOGIN VIEW (IF NOT LOGGED IN) ================= */}
        {!isLoggedIn ? (
          <div className="p-6 sm:p-10 flex flex-col items-center justify-center my-auto">
            <div className="w-full max-w-md bg-[#14162e] border border-amber-500/20 rounded-2xl p-6 sm:p-8 shadow-xl">
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-purple-600/20 border border-amber-500/40 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/10">
                  <Lock className="w-7 h-7 text-amber-400" />
                </div>
                <h3 className="font-cinzel text-xl font-bold text-white">Login de Administrador</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Acesso restrito para leitura e alteração de status de pagamentos
                </p>
              </div>

              {authError && (
                <div className="mb-5 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-200 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Usuário de Acesso
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      placeholder="admin"
                      className="w-full pl-9 pr-3 py-2.5 bg-[#0a0b16] border border-slate-700 focus:border-amber-400 focus:outline-none rounded-xl text-sm text-white placeholder-slate-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Senha
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2.5 bg-[#0a0b16] border border-slate-700 focus:border-amber-400 focus:outline-none rounded-xl text-sm text-white placeholder-slate-500 transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all mt-2"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Acessar Painel Administrativo</span>
                </button>
              </form>

              {/* Default credentials prompt */}
              <div className="mt-6 pt-5 border-t border-slate-800/80 bg-purple-950/20 rounded-xl p-3.5 border border-purple-500/20 text-center">
                <p className="text-[11px] text-amber-200 font-medium flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Credenciais Padrão do Sistema:</span>
                </p>
                <p className="text-xs text-slate-300 mt-1 font-mono">
                  Usuário: <span className="text-amber-300 font-bold">admin</span> &nbsp;|&nbsp; Senha: <span className="text-amber-300 font-bold">admin123</span>
                </p>
                <button
                  type="button"
                  onClick={handleFillDemoCreds}
                  className="mt-2 text-[11px] text-purple-300 hover:text-amber-300 underline underline-offset-2 cursor-pointer transition-colors"
                >
                  Clique aqui para preencher automaticamente
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ================= ADMIN DASHBOARD (WHEN LOGGED IN) ================= */
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
            
            {/* KPI Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-[#14162e] border border-slate-700/60 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                    Total de Emissões
                  </span>
                  <span className="text-2xl font-bold text-white mt-1 block">
                    {stats.total}
                  </span>
                  <span className="text-[11px] text-slate-400">PDFs gerados no sistema</span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <FileText className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-[#14162e] border border-emerald-500/30 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold block">
                    Status Pago
                  </span>
                  <span className="text-2xl font-bold text-emerald-300 mt-1 block">
                    {stats.paidCount}
                  </span>
                  <span className="text-[11px] text-emerald-400/80">
                    R$ {stats.totalRevenue.toFixed(2).replace('.', ',')} liberados
                  </span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-[#14162e] border border-amber-500/30 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-amber-400 font-semibold block">
                    Status Pendente
                  </span>
                  <span className="text-2xl font-bold text-amber-300 mt-1 block">
                    {stats.pendingCount}
                  </span>
                  <span className="text-[11px] text-amber-400/80">
                    R$ {stats.pendingRevenue.toFixed(2).replace('.', ',')} aguardando
                  </span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Clock className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-[#14162e] border border-purple-500/30 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-purple-300 font-semibold block">
                    Faturamento Pago
                  </span>
                  <span className="text-2xl font-bold text-purple-200 mt-1 block">
                    R$ {stats.totalRevenue.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-[11px] text-purple-400/80">Ticket R$ 27,90</span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-purple-500/15 border border-purple-500/40 flex items-center justify-center text-purple-300">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Toolbar: Search, Filters, & Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#121429] p-3 rounded-xl border border-slate-800">
              
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Pesquisar por nome do consulente..."
                  className="w-full pl-9 pr-3 py-2 bg-[#090a14] border border-slate-700/80 focus:border-amber-400 focus:outline-none rounded-lg text-xs text-white placeholder-slate-500 transition-colors"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1 bg-[#090a14] p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setStatusFilter('todos')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                    statusFilter === 'todos' 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Todos ({orders.length})
                </button>
                <button
                  onClick={() => setStatusFilter('pago')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                    statusFilter === 'pago' 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Pagos ({stats.paidCount})
                </button>
                <button
                  onClick={() => setStatusFilter('pendente')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                    statusFilter === 'pendente' 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Pendentes ({stats.pendingCount})
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-3 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-all shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Novo Registro</span>
                </button>

                <button
                  onClick={refreshOrders}
                  className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white cursor-pointer transition-all"
                  title="Atualizar lista"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-[#121429] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#181a36] border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                      <th className="py-3 px-4">Nome do Consulente</th>
                      <th className="py-3 px-4">E-mail & WhatsApp</th>
                      <th className="py-3 px-4">Data de Emissão do PDF</th>
                      <th className="py-3 px-4 text-center">Status do Pagamento</th>
                      <th className="py-3 px-4 text-center">Ação de Modificação</th>
                      <th className="py-3 px-4 text-right">Ações do PDF & Registro</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-500">
                          <FileText className="w-8 h-8 mx-auto mb-2 text-slate-600 opacity-60" />
                          <p className="font-medium">Nenhum registro de emissão encontrado.</p>
                          <p className="text-[11px] mt-1 text-slate-600">
                            {searchTerm ? 'Tente buscar com outro nome, e-mail ou telefone.' : 'Gere um mapa na aplicação ou crie um novo registro manual.'}
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => {
                        const isPaid = order.paymentStatus === 'pago';
                        return (
                          <tr 
                            key={order.id} 
                            className="hover:bg-[#181b3b]/60 transition-colors group"
                          >
                            {/* Nome do Consulente */}
                            <td className="py-3.5 px-4 font-medium text-white">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-900/40 to-amber-500/20 border border-purple-500/30 flex items-center justify-center text-amber-300 font-cinzel font-bold text-xs shrink-0">
                                  {order.clientName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                                    <span>{order.clientName}</span>
                                    {order.report?.aura && (
                                      <span 
                                        className="w-2 h-2 rounded-full inline-block" 
                                        style={{ backgroundColor: order.report.aura.colorHex }}
                                        title={`Aura: ${order.report.aura.primaryColorName}`}
                                      />
                                    )}
                                  </div>
                                  <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                                    <span>Nasc: {order.birthDate}</span>
                                    <span>•</span>
                                    <span className="font-mono text-[10px] text-slate-400">ID #{order.id}</span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* E-mail e WhatsApp com DDD */}
                            <td className="py-3.5 px-4 text-slate-300">
                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-slate-200" title="E-mail cadastrado">
                                  <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                  <span className="font-medium text-[11px] truncate max-w-[190px]">
                                    {order.email || order.report?.user.email || (
                                      <span className="text-slate-500 italic">Não informado</span>
                                    )}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-emerald-300" title="WhatsApp com DDD">
                                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                  <span className="font-medium text-[11px]">
                                    {order.phone || order.report?.user.phone || (
                                      <span className="text-slate-500 italic">Não informado</span>
                                    )}
                                  </span>
                                </div>
                              </div>
                            </td>


                            {/* Data de Emissão do PDF */}
                            <td className="py-3.5 px-4 text-slate-300">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
                                <span className="font-medium text-slate-200">{order.pdfEmissionDate}</span>
                              </div>
                              <span className="text-[10px] text-slate-400 block mt-0.5">
                                Protocolo: {order.pixTxId || 'PIX-PADRAO'}
                              </span>
                            </td>

                            {/* Status de Pagamento Badge */}
                            <td className="py-3.5 px-4 text-center">
                              {isPaid ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>PAGO</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-[11px] font-bold">
                                  <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                                  <span>PENDENTE</span>
                                </span>
                              )}
                            </td>

                            {/* Ação de Modificação de Status */}
                            <td className="py-3.5 px-4 text-center">
                              <div className="inline-flex items-center gap-1 bg-[#090a14] p-1 rounded-lg border border-slate-800">
                                <button
                                  onClick={() => handleSetStatus(order.id, 'pago', order.clientName)}
                                  className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer transition-all ${
                                    isPaid 
                                      ? 'bg-emerald-500 text-slate-950 shadow-sm' 
                                      : 'text-slate-400 hover:text-emerald-300 hover:bg-emerald-950/40'
                                  }`}
                                  title="Definir pagamento como Pago (Libera o relatório)"
                                >
                                  ✓ Pago
                                </button>
                                <button
                                  onClick={() => handleSetStatus(order.id, 'pendente', order.clientName)}
                                  className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer transition-all ${
                                    !isPaid 
                                      ? 'bg-amber-500 text-slate-950 shadow-sm' 
                                      : 'text-slate-400 hover:text-amber-300 hover:bg-amber-950/40'
                                  }`}
                                  title="Definir pagamento como Pendente (Bloqueia o relatório)"
                                >
                                  ⏳ Pendente
                                </button>
                              </div>
                            </td>

                            {/* Ações do PDF e Registro */}
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* Baixar PDF */}
                                <button
                                  onClick={() => handleDownloadPdf(order)}
                                  disabled={isGeneratingPdfId === order.id}
                                  className="px-2.5 py-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/40 text-purple-200 text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-all disabled:opacity-50"
                                  title="Baixar PDF Oficial deste consulente"
                                >
                                  <Download className="w-3.5 h-3.5 text-purple-300" />
                                  <span>{isGeneratingPdfId === order.id ? 'Gerando...' : 'Baixar PDF'}</span>
                                </button>

                                {/* Ver Mapa */}
                                <button
                                  onClick={() => handleViewReport(order)}
                                  className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-amber-300 cursor-pointer transition-all"
                                  title="Visualizar mapa completo na aplicação"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>

                                {/* Excluir */}
                                <button
                                  onClick={() => handleDelete(order.id, order.clientName)}
                                  className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-red-950/80 border border-slate-700 hover:border-red-500/40 text-slate-400 hover:text-red-300 cursor-pointer transition-all"
                                  title="Excluir este registro"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer information inside dashboard */}
            <div className="text-[11px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
              <span>
                Alterações de status são sincronizadas instantaneamente com os relatórios e permissões de PDF dos consulentes.
              </span>
              <span className="text-amber-300/80">
                Total registrado: {orders.length} consulentes
              </span>
            </div>
          </div>
        )}

      </div>

      {/* ================= MODAL DE NOVO REGISTRO MANUAL ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#13152c] border border-amber-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-cinzel text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Inserir Nova Emissão Manual</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateManualOrder} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Nome Completo do Consulente
                </label>
                <input
                  type="text"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="Ex: Gabriela Fontana Miranda"
                  className="w-full px-3 py-2 bg-[#0a0b16] border border-slate-700 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  value={newClientBirthDate}
                  onChange={(e) => setNewClientBirthDate(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0a0b16] border border-slate-700 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  E-mail do Consulente
                </label>
                <input
                  type="email"
                  value={newClientEmail}
                  onChange={(e) => setNewClientEmail(e.target.value)}
                  placeholder="exemplo@email.com"
                  className="w-full px-3 py-2 bg-[#0a0b16] border border-slate-700 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  WhatsApp com DDD
                </label>
                <input
                  type="tel"
                  value={newClientPhone}
                  onChange={(e) => setNewClientPhone(e.target.value)}
                  placeholder="(11) 98765-4321"
                  className="w-full px-3 py-2 bg-[#0a0b16] border border-slate-700 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Status Inicial de Pagamento
                </label>
                <select
                  value={newClientStatus}
                  onChange={(e) => setNewClientStatus(e.target.value as PaymentStatus)}
                  className="w-full px-3 py-2 bg-[#0a0b16] border border-slate-700 rounded-lg text-white focus:border-amber-400 focus:outline-none"
                >
                  <option value="pendente">Pendente (Aguardando Pix)</option>
                  <option value="pago">Pago (Acesso Liberado)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-slate-950 font-bold cursor-pointer"
                >
                  Salvar Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL DE CONFIRMAÇÃO DE EXCLUSÃO ================= */}
      {orderToDelete && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-[#13152c] border border-red-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 shrink-0">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h4 className="font-bold text-base text-white font-cinzel">Excluir Registro</h4>
                <p className="text-xs text-slate-400">Ação permanente</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Tem certeza que deseja remover o registro de <strong className="text-white font-semibold">{orderToDelete.name}</strong>?
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setOrderToDelete(null)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer transition-all"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold cursor-pointer transition-all shadow-lg shadow-red-600/30"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
