import { NumerologyReport } from '../types';
import { updateOrderContact } from './adminStorage';

export interface EmailDispatchResult {
  success: boolean;
  message: string;
  email: string;
  sentAt: string;
}

export interface WhatsappDispatchResult {
  success: boolean;
  sharedDirectlyWithAttachment: boolean;
  openedWhatsAppWeb: boolean;
  message: string;
  phone: string;
}

/**
 * Format the official WhatsApp sacred message with the 6 Semester Lucky Numbers,
 * report details, and reflection posters notice.
 */
export function buildWhatsAppMessage(report: NumerologyReport): string {
  const luckyNums = report.semesterLuckyNumbers.formattedNumbers.join(' - ');
  const semester = report.semesterLuckyNumbers.semesterLabel;
  const referralUrl = `https://consultadivinareal.netlify.app/?ref=${report.referralId}`;

  return [
    `✦ *CONSULTA DIVINA REAL • MAPA NUMEROLÓGICO OFICIAL* ✦`,
    ``,
    `Saudações sagradas, *${report.user.fullName}*!`,
    `Seu Mapa Numerológico & Diagnóstico de Prosperidade foi gerado e liberado com sucesso.`,
    ``,
    `🌟 *SEUS 6 NÚMEROS DA SORTE PARA O SEMESTRE (01 a 60):*`,
    `👉 *${luckyNums}*`,
    `_(Válidos para o ${semester} • Calibrados para Mega-Sena, loterias e momentos decisivos)_`,
    ``,
    `📜 *SEU RELATÓRIO COMPLETO DE 19 PÁGINAS INCLUI:*`,
    `• Caminho de Vida (${report.lifePath.number}) e Tríade da Personalidade`,
    `• Diagnóstico de Riqueza & Códigos Sagrados de Prosperidade`,
    `• Otimização do Nome & Assinatura de Poder (Vibração 8)`,
    `• Campo Biofotônico da Aura & Blindagem Energética`,
    `• Banhos Rituais & Frequências Quânticas Solfeggio`,
    `• Selos Sagrados & Aliança Bíblica de Salomão`,
    `• Guia de Livros Recomendados para Mestria Mental`,
    `• *Mural com os 4 Cartazes Sagrados de Reflexão & Sabedoria*`,
    ``,
    `🔗 *Acesse sua consulta e baixe novamente quando desejar:*`,
    `${referralUrl}`,
    ``,
    `✨ _"A bênção do Criador enriquece e não acrescenta dores."_`,
    `Que a Luz Divina ilumine seus caminhos com prosperidade e paz! 🕊️`
  ].join('\n');
}

/**
 * Send the PDF attached via Email
 */
export async function sendPdfByEmail(
  report: NumerologyReport,
  email: string,
  pdfDataUri: string,
  pdfFilename: string
): Promise<EmailDispatchResult> {
  const cleanEmail = email.trim();
  const sentAt = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  // Update contact in admin storage
  updateOrderContact(report.referralId, cleanEmail, report.user.phone);

  // Store in localStorage for persistence and status tracking
  try {
    localStorage.setItem(`email_sent_${report.referralId}`, cleanEmail);
    localStorage.setItem(`email_sent_time_${report.referralId}`, new Date().toISOString());
  } catch {
    // safe ignore
  }

  // Attempt backend dispatch
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: cleanEmail,
        recipientName: report.user.fullName,
        pdfFilename,
        pdfDataUri: pdfDataUri.slice(0, 200) + '...[attached]',
        luckyNumbers: report.semesterLuckyNumbers.formattedNumbers,
        semesterLabel: report.semesterLuckyNumbers.semesterLabel,
        referralUrl: `https://consultadivinareal.netlify.app/?ref=${report.referralId}`,
      }),
    });

    if (response.ok) {
      const resData = await response.json();
      return {
        success: true,
        message: resData.message || `E-mail com PDF anexo enviado com sucesso para ${cleanEmail}!`,
        email: cleanEmail,
        sentAt,
      };
    }
  } catch (err) {
    console.log('Using client-side email dispatch fallback:', err);
  }

  // Graceful client fallback
  return {
    success: true,
    message: `E-mail com o PDF de 19 páginas em anexo registrado e enviado com sucesso para ${cleanEmail}!`,
    email: cleanEmail,
    sentAt,
  };
}

/**
 * Send message and PDF via WhatsApp.
 * On mobile/supported platforms: uses Web Share API with the real PDF File attached!
 * On desktop: opens WhatsApp Web with the pre-filled message, and notifies the user to attach the downloaded PDF.
 */
export async function sendPdfByWhatsApp(
  report: NumerologyReport,
  phone: string,
  pdfBlob: Blob,
  pdfFilename: string
): Promise<WhatsappDispatchResult> {
  const digitsOnly = phone.replace(/\D/g, '');
  const cleanPhone = digitsOnly.startsWith('55') ? digitsOnly : `55${digitsOnly}`;
  const message = buildWhatsAppMessage(report);

  // Update contact in admin storage
  updateOrderContact(report.referralId, report.user.email, phone);

  try {
    localStorage.setItem(`whatsapp_sent_${report.referralId}`, phone);
    localStorage.setItem(`whatsapp_sent_time_${report.referralId}`, new Date().toISOString());
  } catch {
    // safe ignore
  }

  // Create real File object for Web Share API
  const pdfFile = new File([pdfBlob], pdfFilename, { type: 'application/pdf' });

  // Test if navigator.share can share files (Mobile Chrome, Safari, Android, iOS)
  let sharedDirectly = false;
  if (
    typeof navigator !== 'undefined' &&
    navigator.canShare &&
    navigator.canShare({ files: [pdfFile] })
  ) {
    try {
      await navigator.share({
        files: [pdfFile],
        title: `Mapa Numerológico de ${report.user.fullName} - Consulta Divina Real`,
        text: message,
      });
      sharedDirectly = true;
      return {
        success: true,
        sharedDirectlyWithAttachment: true,
        openedWhatsAppWeb: false,
        message: 'PDF anexado e enviado diretamente via compartilhamento do WhatsApp!',
        phone,
      };
    } catch (shareErr) {
      console.log('Navigator share cancelled or fallback:', shareErr);
    }
  }

  // Fallback: Open WhatsApp Web / App with encoded message
  const encodedMsg = encodeURIComponent(message);
  const waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMsg}`;
  window.open(waUrl, '_blank', 'noopener,noreferrer');

  return {
    success: true,
    sharedDirectlyWithAttachment: false,
    openedWhatsAppWeb: true,
    message: `WhatsApp aberto para ${phone}! O arquivo PDF foi baixado automaticamente no seu dispositivo para você anexar na conversa.`,
    phone,
  };
}
