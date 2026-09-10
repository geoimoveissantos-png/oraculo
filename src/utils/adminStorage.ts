import { AdminOrderRecord, PaymentStatus, NumerologyReport } from '../types';
import { generateNumerologyReport } from './numerology';

const ADMIN_ORDERS_KEY = 'mapa_admin_orders_v1';
const ADMIN_SESSION_KEY = 'mapa_admin_session_auth';
const ADMIN_CREDENTIALS_KEY = 'mapa_admin_credentials';

const DEFAULT_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

// Seed realistic mock records if none exist, so the admin has immediate demonstration data
function getInitialSeedOrders(): AdminOrderRecord[] {
  const seed1 = generateNumerologyReport({
    fullName: 'Maria Clara dos Santos',
    birthDate: '1988-04-15',
    birthTime: '08:30',
    email: 'mariaclara.santos@gmail.com',
    phone: '(11) 99876-1234'
  });

  const seed2 = generateNumerologyReport({
    fullName: 'Lucas Eduardo Oliveira',
    birthDate: '1992-11-23',
    birthTime: '14:20',
    email: 'lucas.oliveira@outlook.com',
    phone: '(21) 98765-4321'
  });

  const seed3 = generateNumerologyReport({
    fullName: 'Beatriz Vasconcelos Ribeiro',
    birthDate: '1985-07-09',
    birthTime: '19:45',
    email: 'beatriz.ribeiro@gmail.com',
    phone: '(31) 99123-8877'
  });

  const seed4 = generateNumerologyReport({
    fullName: 'Rodrigo Augusto Mendes',
    birthDate: '1979-02-18',
    birthTime: '11:15',
    email: 'rodrigo.mendes@uol.com.br',
    phone: '(41) 98456-9900'
  });

  // Pre-set unlocks for seed records
  localStorage.setItem(`unlocked_${seed1.referralId}`, 'true');
  localStorage.setItem(`unlocked_${seed3.referralId}`, 'true');

  return [
    {
      id: seed1.referralId,
      clientName: seed1.user.fullName,
      birthDate: seed1.user.formattedDate,
      email: seed1.user.email,
      phone: seed1.user.phone,
      pdfEmissionDate: '09/09/2026 às 11:32',
      paymentStatus: 'pago',
      amount: 27.90,
      pixTxId: 'PIX-E7F29A814B',
      report: seed1,
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 3).toISOString()
    },
    {
      id: seed2.referralId,
      clientName: seed2.user.fullName,
      birthDate: seed2.user.formattedDate,
      email: seed2.user.email,
      phone: seed2.user.phone,
      pdfEmissionDate: '09/09/2026 às 13:48',
      paymentStatus: 'pendente',
      amount: 27.90,
      pixTxId: 'PIX-B391C770E1',
      report: seed2,
      createdAt: new Date(Date.now() - 3600000 * 1.5).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 1.5).toISOString()
    },
    {
      id: seed3.referralId,
      clientName: seed3.user.fullName,
      birthDate: seed3.user.formattedDate,
      email: seed3.user.email,
      phone: seed3.user.phone,
      pdfEmissionDate: '09/09/2026 às 14:15',
      paymentStatus: 'pago',
      amount: 27.90,
      pixTxId: 'PIX-A94D28CF99',
      report: seed3,
      createdAt: new Date(Date.now() - 3600000 * 0.8).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 0.8).toISOString()
    },
    {
      id: seed4.referralId,
      clientName: seed4.user.fullName,
      birthDate: seed4.user.formattedDate,
      email: seed4.user.email,
      phone: seed4.user.phone,
      pdfEmissionDate: '09/09/2026 às 15:10',
      paymentStatus: 'pendente',
      amount: 27.90,
      pixTxId: 'PIX-D483A11C77',
      report: seed4,
      createdAt: new Date(Date.now() - 3600000 * 0.2).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 0.2).toISOString()
    }
  ];
}


// Authentication Helpers
export function getAdminCredentials() {
  try {
    const raw = localStorage.getItem(ADMIN_CREDENTIALS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return DEFAULT_CREDENTIALS;
}

export function isUserAdminLoggedIn(): boolean {
  try {
    return localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  } catch {
    return false;
  }
}

export function loginAdmin(user: string, pass: string): boolean {
  const creds = getAdminCredentials();
  const isValid = user.trim().toLowerCase() === creds.username.toLowerCase() && pass === creds.password;
  if (isValid) {
    localStorage.setItem(ADMIN_SESSION_KEY, 'true');
    window.dispatchEvent(new Event('admin_auth_changed'));
    return true;
  }
  return false;
}

export function logoutAdmin(): void {
  localStorage.removeItem(ADMIN_SESSION_KEY);
  window.dispatchEvent(new Event('admin_auth_changed'));
}

// Orders / PDF Emissions Registry
export function getAdminOrders(): AdminOrderRecord[] {
  try {
    const raw = localStorage.getItem(ADMIN_ORDERS_KEY);
    if (raw !== null) {
      const parsed: AdminOrderRecord[] = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Error reading admin orders from localStorage:', err);
  }

  // If not yet initialized in localStorage, set initial seed orders
  const initial = getInitialSeedOrders();
  try {
    localStorage.setItem(ADMIN_ORDERS_KEY, JSON.stringify(initial));
  } catch (e) {
    console.warn('Could not save seed orders:', e);
  }
  return initial;
}

export function saveAdminOrders(orders: AdminOrderRecord[]): void {
  try {
    localStorage.setItem(ADMIN_ORDERS_KEY, JSON.stringify(orders));
    window.dispatchEvent(new CustomEvent('admin_orders_updated', { detail: orders }));
  } catch (err) {
    console.error('Error saving admin orders:', err);
  }
}

// Format current date and time in Brazilian format for PDF emission
export function formatPdfEmissionDate(date = new Date()): string {
  const dateStr = date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  const timeStr = date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });
  return `${dateStr} às ${timeStr}`;
}

// Record an emission / report generated in the application
export function recordReportEmission(
  report: NumerologyReport,
  status: PaymentStatus = 'pendente'
): AdminOrderRecord {
  const orders = getAdminOrders();
  const existingIdx = orders.findIndex(o => o.id === report.referralId);
  const now = new Date();
  const emissionDateStr = formatPdfEmissionDate(now);

  let updatedRecord: AdminOrderRecord;

  if (existingIdx >= 0) {
    // Keep or update status if it was already marked as paid
    const existing = orders[existingIdx];
    const finalStatus: PaymentStatus = existing.paymentStatus === 'pago' ? 'pago' : status;
    
    updatedRecord = {
      ...existing,
      clientName: report.user.fullName,
      birthDate: report.user.formattedDate,
      email: report.user.email || existing.email,
      phone: report.user.phone || existing.phone,
      pdfEmissionDate: existing.pdfEmissionDate || emissionDateStr,
      paymentStatus: finalStatus,
      report,
      updatedAt: now.toISOString()
    };
    orders[existingIdx] = updatedRecord;
  } else {
    updatedRecord = {
      id: report.referralId,
      clientName: report.user.fullName,
      birthDate: report.user.formattedDate,
      email: report.user.email,
      phone: report.user.phone,
      pdfEmissionDate: emissionDateStr,
      paymentStatus: status,
      amount: 27.90,
      pixTxId: `PIX-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      report,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };
    orders.unshift(updatedRecord);
  }


  // Update client unlock state accordingly
  if (updatedRecord.paymentStatus === 'pago') {
    localStorage.setItem(`unlocked_${report.referralId}`, 'true');
  } else {
    // If not paid, ensure status is respected unless user has unlocked it
    if (!localStorage.getItem(`unlocked_${report.referralId}`)) {
      localStorage.setItem(`unlocked_${report.referralId}`, 'false');
    }
  }

  saveAdminOrders(orders);
  return updatedRecord;
}

// Modify payment status action: "pago" or "pendente"
export function updatePaymentStatus(orderId: string, newStatus: PaymentStatus): void {
  const orders = getAdminOrders();
  const target = orders.find(o => o.id === orderId);

  if (target) {
    target.paymentStatus = newStatus;
    target.updatedAt = new Date().toISOString();

    // Mirror unlock state directly in user's localStorage
    if (newStatus === 'pago') {
      localStorage.setItem(`unlocked_${orderId}`, 'true');
    } else {
      localStorage.setItem(`unlocked_${orderId}`, 'false');
    }

    saveAdminOrders(orders);
  }
}

// Update client contact (E-mail and/or WhatsApp) after Pix confirmation when downloading PDF
export function updateOrderContact(orderId: string, email?: string, phone?: string): void {
  const orders = getAdminOrders();
  const target = orders.find(o => o.id === orderId);

  if (target) {
    if (email && email.trim()) target.email = email.trim();
    if (phone && phone.trim()) target.phone = phone.trim();
    if (target.report && target.report.user) {
      if (email && email.trim()) target.report.user.email = email.trim();
      if (phone && phone.trim()) target.report.user.phone = phone.trim();
    }
    target.updatedAt = new Date().toISOString();
    saveAdminOrders(orders);
  }
}

// Delete an order
export function deleteAdminOrder(orderId: string): void {
  const orders = getAdminOrders().filter(o => o.id !== orderId);
  localStorage.removeItem(`unlocked_${orderId}`);
  saveAdminOrders(orders);
}
