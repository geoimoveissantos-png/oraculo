import jsPDF from 'jspdf';
import { NumerologyReport } from '../types';
import {
  ACCENT_GOLD,
  ACCENT_GOLD_LIGHT,
  PRIMARY,
  drawBackgroundMysticalRunes,
  drawVintageHourglass,
  drawTripleMoon,
  drawTarotCardFan,
  drawSacredDreamcatcher,
  drawRitualCandle
} from './pdfWatermarks';
import {
  PageRenderContext,
  renderPage2,
  renderPage3,
  renderPage4,
  renderPage5,
  renderPage6,
  renderPage7,
  renderPage8
} from './pdfPagesCore';
import {
  renderPage9,
  renderPage10,
  renderPage11,
  renderPage12,
  renderPage13,
  renderPage14,
  renderPage15
} from './pdfPagesAdvanced';
import {
  renderPoster1,
  renderPoster2,
  renderPoster3,
  renderPoster4
} from './pdfPosters';

export interface PDFGenerationResult {
  blob: Blob;
  dataUri: string;
  filename: string;
}

export interface PDFGenerationOptions {
  autoSave?: boolean;
}

export const generatePDF = (
  report: NumerologyReport,
  _recommendedBooks?: any,
  options?: PDFGenerationOptions
): PDFGenerationResult => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210 mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297 mm
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182 mm
  const totalPages = 19; // 19 Páginas Diagramadas com Fonte de 12px

  const TEXT_DARK = '#2C3E50';
  const TEXT_MUTED = '#5A6B82';
  const BORDER_COLOR = '#E2E8F0';
  const BG_CARD = '#FFFFFF';

  const referralUrl = `https://consultadivinareal.netlify.app/?ref=${report.referralId}`;
  const PIX_NUBANK_URL = 'https://nubank.com.br/cobrar/dx851l/6aa2c5cb-60b9-4de0-aac4-53324bc8ec8d';

  // Helper: Draw Header (Pages 2 to 19)
  const drawPageHeader = (pageNum: number, sectionTitle: string) => {
    // Top border accent (double gold & primary)
    doc.setFillColor(ACCENT_GOLD);
    doc.rect(margin, 8.5, contentWidth, 1.0, 'F');
    doc.setFillColor(PRIMARY);
    doc.rect(margin, 9.7, contentWidth, 0.3, 'F');

    // Header Left: CONSULTA DIVINA REAL with sacred star
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(ACCENT_GOLD);
    doc.text('✦ CONSULTA DIVINA REAL ✦', margin, 15.5);

    const brandWidth = doc.getTextWidth('✦ CONSULTA DIVINA REAL ✦');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(TEXT_MUTED);
    doc.text('•  Mapa Numerológico & Prosperidade Sagrada', margin + brandWidth + 3, 15.5);

    // Section title aligned to the right
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.0);
    doc.setTextColor(PRIMARY);
    doc.text(sectionTitle.toUpperCase(), pageWidth - margin, 15.5, { align: 'right' });

    // Line below header
    doc.setDrawColor(215, 222, 235);
    doc.setLineWidth(0.35);
    doc.line(margin, 18.5, pageWidth - margin, 18.5);
  };

  // Helper: Draw Footer (Pages 2 to 19)
  const drawPageFooter = (pageNum: number) => {
    // Divider line
    doc.setDrawColor(220, 228, 238);
    doc.setLineWidth(0.35);
    doc.line(margin, pageHeight - 16, pageWidth - margin, pageHeight - 16);

    // Pix reminder notice
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(TEXT_MUTED);
    const pixPrefix = 'Pagamento via PIX: ';
    doc.text(pixPrefix, margin, pageHeight - 11.5);

    const prefixWidth = doc.getTextWidth(pixPrefix);
    const linkText = 'CLIQUE AQUI PARA EFETUAR O PIX';

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.8);
    doc.setTextColor(130, 10, 209); // Nubank purple
    doc.textWithLink(linkText, margin + prefixWidth, pageHeight - 11.5, { url: PIX_NUBANK_URL });

    const linkWidth = doc.getTextWidth(linkText);
    doc.setDrawColor(130, 10, 209);
    doc.setLineWidth(0.3);
    doc.line(margin + prefixWidth, pageHeight - 10.8, margin + prefixWidth + linkWidth, pageHeight - 10.8);
    doc.link(margin + prefixWidth - 1, pageHeight - 14.5, linkWidth + 2, 4.5, { url: PIX_NUBANK_URL });

    // Nome da Consulta e do Consulente
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(PRIMARY);
    doc.text('CONSULTA DIVINA REAL', margin, pageHeight - 6.5);

    const consBrandW = doc.getTextWidth('CONSULTA DIVINA REAL');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(ACCENT_GOLD);
    doc.text(' • Consulente: ', margin + consBrandW, pageHeight - 6.5);

    const consPrefixW = doc.getTextWidth(' • Consulente: ');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(TEXT_DARK);
    doc.text(report.user.fullName, margin + consBrandW + consPrefixW, pageHeight - 6.5);

    // Numeração da página à direita
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.8);
    doc.setTextColor(PRIMARY);
    doc.text(`Página ${pageNum} de ${totalPages}`, pageWidth - margin, pageHeight - 6.5, { align: 'right' });
  };

  // Helper: Card background
  const drawCard = (x: number, y: number, w: number, h: number, goldAccent: boolean = false, bgColor: string = BG_CARD) => {
    doc.setFillColor(bgColor);
    doc.roundedRect(x, y, w, h, 2.5, 2.5, 'F');
    doc.setDrawColor(goldAccent ? ACCENT_GOLD : BORDER_COLOR);
    doc.setLineWidth(goldAccent ? 0.6 : 0.3);
    doc.roundedRect(x, y, w, h, 2.5, 2.5, 'S');
  };

  const pageCtx: PageRenderContext = {
    pageWidth,
    pageHeight,
    margin,
    contentWidth,
    drawPageHeader,
    drawPageFooter,
    drawCard
  };

  // ==========================================
  // PAGE 1: CAPA CONSAGRADA "CONSULTA DIVINA REAL"
  // ==========================================
  doc.setFillColor(14, 15, 30); // Midnight navy
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Background Runic & Celestial Texture
  drawBackgroundMysticalRunes(doc, 12, 12, pageWidth - 24, pageHeight - 24);

  // Outer Ornate Gold Border
  doc.setDrawColor(ACCENT_GOLD);
  doc.setLineWidth(0.8);
  doc.rect(9, 9, pageWidth - 18, pageHeight - 18);

  // Inner Fine Gold Border
  doc.setDrawColor(ACCENT_GOLD_LIGHT);
  doc.setLineWidth(0.3);
  doc.rect(11.5, 11.5, pageWidth - 23, pageHeight - 23);

  // Corner Stars
  const cornerSize = 10;
  const corners = [
    [13, 13],
    [pageWidth - 13 - cornerSize, 13],
    [13, pageHeight - 13 - cornerSize],
    [pageWidth - 13 - cornerSize, pageHeight - 13 - cornerSize]
  ];
  corners.forEach(([cornerX, cornerY]) => {
    doc.setDrawColor(ACCENT_GOLD);
    doc.setLineWidth(0.4);
    doc.circle(cornerX + cornerSize / 2, cornerY + cornerSize / 2, 2.8, 'S');
    doc.circle(cornerX + cornerSize / 2, cornerY + cornerSize / 2, 1.0, 'F');
  });

  const centerX = pageWidth / 2;

  // Top Mystical Elements
  drawVintageHourglass(doc, 15, 14, 13, 23, ACCENT_GOLD);
  drawVintageHourglass(doc, pageWidth - 15 - 13, 14, 13, 23, ACCENT_GOLD);
  drawTripleMoon(doc, centerX, 18.5, 4.5, ACCENT_GOLD);

  // Grand Cartouche: CONSULTA DIVINA REAL
  const brandBoxY = 25;
  const brandBoxW = 150;
  const brandBoxH = 22;
  doc.setFillColor(22, 24, 46);
  doc.roundedRect(centerX - brandBoxW / 2, brandBoxY, brandBoxW, brandBoxH, 3, 3, 'F');
  doc.setDrawColor(ACCENT_GOLD);
  doc.setLineWidth(0.7);
  doc.roundedRect(centerX - brandBoxW / 2, brandBoxY, brandBoxW, brandBoxH, 3, 3, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(ACCENT_GOLD_LIGHT);
  doc.text('CONSULTA DIVINA REAL', centerX, brandBoxY + 10.5, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.0);
  doc.setTextColor(ACCENT_GOLD);
  doc.text('✦ PORTAL DE ALTA MAGIA NUMEROLÓGICA & SABEDORIA ANCESTRAL ✦', centerX, brandBoxY + 17.5, { align: 'center' });

  // Mandala & Tarot Fans
  const emblemY = 64;
  drawTarotCardFan(doc, 52, emblemY - 2, 'left', ACCENT_GOLD);
  drawTarotCardFan(doc, 158, emblemY - 2, 'right', ACCENT_GOLD);
  drawSacredDreamcatcher(doc, centerX, emblemY, 14, ACCENT_GOLD, report.lifePath.number);

  // Inscriptions & Titles
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(ACCENT_GOLD);
  doc.text('IN NOMINE DIVINO • LUX, SAPIENTIA ET ABUNDANTIA', centerX, 94, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(ACCENT_GOLD_LIGHT);
  doc.text('SÍNTESE CÓSMICA & PROTOCOLO SAGRADO DE ABUNDÂNCIA', centerX, 102, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text('MAPA NUMEROLÓGICO', centerX, 113.5, { align: 'center' });

  doc.setFontSize(15);
  doc.setTextColor(ACCENT_GOLD);
  doc.text('& DIAGNÓSTICO DE PROSPERIDADE', centerX, 122, { align: 'center' });

  // Gold divider
  doc.setLineWidth(0.6);
  doc.setDrawColor(ACCENT_GOLD);
  doc.line(centerX - 45, 127, centerX + 45, 127);
  doc.circle(centerX, 127, 1.8, 'F');

  // Dedication
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(200, 210, 230);
  doc.text('DOCUMENTO CONSAGRADO ESPECIALMENTE PARA:', centerX, 135.5, { align: 'center' });

  // Full Name
  const rawFullName = report.user.fullName.toUpperCase();
  let nameFontSize = 17;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(nameFontSize);
  while (doc.getTextWidth(rawFullName) > 160 && nameFontSize > 11) {
    nameFontSize -= 0.5;
    doc.setFontSize(nameFontSize);
  }
  doc.setTextColor(255, 255, 255);
  doc.text(rawFullName, centerX, 145.5, { align: 'center' });

  // Birth info card
  const infoBoxY = 152;
  const infoBoxW = 150;
  doc.setFillColor(28, 31, 56);
  doc.roundedRect(centerX - infoBoxW / 2, infoBoxY, infoBoxW, 20, 2.5, 2.5, 'F');
  doc.setDrawColor(ACCENT_GOLD);
  doc.setLineWidth(0.4);
  doc.roundedRect(centerX - infoBoxW / 2, infoBoxY, infoBoxW, 20, 2.5, 2.5, 'S');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(ACCENT_GOLD_LIGHT);
  doc.text(`Nascimento: ${report.user.formattedDate}${report.user.birthTime ? ` às ${report.user.birthTime}` : ''}`, centerX, infoBoxY + 8, { align: 'center' });
  doc.text(`Data de Emissão: ${report.generatedAt} • Código Sagrado: ${report.referralId}`, centerX, infoBoxY + 15, { align: 'center' });

  // Core Numbers Cards
  const coverGridY = 178;
  const cardW = 40;
  const cardH = 32;
  const startX = centerX - (cardW * 4 + 3 * 3.5) / 2;

  const coreItems = [
    { label: 'CAMINHO DE VIDA', num: report.lifePath.number, sub: report.lifePath.isMaster ? 'Mestre' : 'Destino' },
    { label: 'EXPRESSÃO', num: report.expression.number, sub: 'Potencial' },
    { label: 'DESEJO DA ALMA', num: report.soulUrge.number, sub: 'Motivação' },
    { label: 'PERSONALIDADE', num: report.personality.number, sub: 'Presença' },
  ];

  coreItems.forEach((item, idx) => {
    const cx = startX + idx * (cardW + 3.5);
    doc.setFillColor(26, 28, 52);
    doc.roundedRect(cx, coverGridY, cardW, cardH, 2.5, 2.5, 'F');
    doc.setDrawColor(ACCENT_GOLD);
    doc.setLineWidth(0.4);
    doc.roundedRect(cx, coverGridY, cardW, cardH, 2.5, 2.5, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(ACCENT_GOLD_LIGHT);
    doc.text(item.label, cx + cardW / 2, coverGridY + 8, { align: 'center' });

    doc.setFontSize(16.5);
    doc.setTextColor(255, 255, 255);
    doc.text(`${item.num}`, cx + cardW / 2, coverGridY + 19, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(ACCENT_GOLD);
    doc.text(item.sub, cx + cardW / 2, coverGridY + 26.5, { align: 'center' });
  });

  // Teaser Box
  const coverTeaserY = 216;
  const teaserW = contentWidth - 8;
  doc.setFillColor(30, 33, 60);
  doc.roundedRect(centerX - teaserW / 2, coverTeaserY, teaserW, 22, 2.5, 2.5, 'F');
  doc.setDrawColor(ACCENT_GOLD);
  doc.setLineWidth(0.35);
  doc.roundedRect(centerX - teaserW / 2, coverTeaserY, teaserW, 22, 2.5, 2.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(ACCENT_GOLD);
  doc.text('CONTEÚDO SAGRADO EXCLUSIVO INCLUSO NESTE RELATÓRIO (19 PÁGINAS):', centerX, coverTeaserY + 7.5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.8);
  doc.setTextColor(230, 235, 245);
  doc.text('• 6 Números da Sorte do Semestre (01 a 60) • 4 Cartazes Sagrados de Reflexão em Página Inteira', centerX, coverTeaserY + 13.5, { align: 'center' });
  doc.text('• Campo Biofotônico da Aura • Otimização do Nome • Banhos Ancestrais • Frequências de Cura', centerX, coverTeaserY + 18.5, { align: 'center' });

  // Candles
  drawRitualCandle(doc, 15, 242, 10, 18, ACCENT_GOLD);
  drawRitualCandle(doc, pageWidth - 15 - 10, 242, 10, 18, ACCENT_GOLD);

  // Bottom Blessings & Pix
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(180, 188, 210);
  doc.text('Relatório emitido sob o rigor do Sistema Pitagórico, Cabala da Prosperidade e Princípios Bíblicos de Fartura.', centerX, 248, { align: 'center' });
  doc.text('Que este mapa ilumine seus passos com sabedoria eterna e sele a sua aliança perpétua de fartura e paz.', centerX, 254, { align: 'center' });

  // Pix Bar
  const coverPixPrefix = 'Se você se esqueceu de efetuar o pagamento pode fazer o pix através do link a seguir: ';
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(200, 208, 225);
  const coverPrefixW = doc.getTextWidth(coverPixPrefix);
  const coverLinkTxt = 'FAZER PIX AGORA';
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.8);
  const coverLinkW = doc.getTextWidth(coverLinkTxt);
  const coverTotalW = coverPrefixW + coverLinkW;
  const coverStartX = centerX - coverTotalW / 2;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(200, 208, 225);
  doc.text(coverPixPrefix, coverStartX, pageHeight - 16);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.8);
  doc.setTextColor(ACCENT_GOLD_LIGHT);
  doc.textWithLink(coverLinkTxt, coverStartX + coverPrefixW, pageHeight - 16, { url: PIX_NUBANK_URL });
  doc.setDrawColor(243, 229, 171);
  doc.setLineWidth(0.3);
  doc.line(coverStartX + coverPrefixW, pageHeight - 15.2, coverStartX + coverPrefixW + coverLinkW, pageHeight - 15.2);
  doc.link(coverStartX + coverPrefixW - 1, pageHeight - 19, coverLinkW + 2, 5, { url: PIX_NUBANK_URL });

  // Official portal link
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(170, 178, 200);
  const coverRefText = `Acesso & Portal Oficial: ${referralUrl}`;
  doc.text(coverRefText, centerX, pageHeight - 10.5, { align: 'center' });
  const coverRefW = doc.getTextWidth(coverRefText);
  doc.link(centerX - coverRefW / 2, pageHeight - 14, coverRefW, 5, { url: referralUrl });

  // ==========================================
  // PAGES 2 TO 8: CORE SECTIONS (12px FONT)
  // ==========================================
  renderPage2(doc, report, pageCtx);
  renderPage3(doc, report, pageCtx);
  renderPage4(doc, report, pageCtx);
  renderPage5(doc, report, pageCtx);
  renderPage6(doc, report, pageCtx);
  renderPage7(doc, report, pageCtx);
  renderPage8(doc, report, pageCtx);

  // ==========================================
  // PAGES 9 TO 15: ADVANCED SECTIONS (12px FONT)
  // ==========================================
  renderPage9(doc, report, pageCtx);
  renderPage10(doc, report, pageCtx);
  renderPage11(doc, report, pageCtx);
  renderPage12(doc, report, pageCtx);
  renderPage13(doc, report, pageCtx);
  renderPage14(doc, report, pageCtx);
  renderPage15(doc, report, pageCtx);

  // ==========================================
  // PAGES 16 TO 19: FULL-PAGE SACRED REFLECTION POSTERS (12px FONT)
  // ==========================================
  const posterOpts = {
    pageWidth,
    pageHeight,
    margin,
    contentWidth,
    drawPageHeader,
    drawPageFooter
  };
  renderPoster1(doc, report, posterOpts);
  renderPoster2(doc, report, posterOpts);
  renderPoster3(doc, report, posterOpts);
  renderPoster4(doc, report, posterOpts);

  // Output & AutoSave
  const safeName = (report.user?.fullName || 'consulente')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '_');
  const filename = `mapa_numerologico_consagrado_${safeName}.pdf`;

  if (options?.autoSave) {
    doc.save(filename);
  }

  const blob = doc.output('blob');
  const dataUri = doc.output('datauristring');

  return { blob, dataUri, filename };
};
