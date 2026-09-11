import jsPDF from 'jspdf';
import { NumerologyReport } from '../types';
import { calculateAuraProfile, getFrequencyYouTubeInfo } from './numerology';
import { getRecommendedBooksForReport, generateBookCoverDataUrl, RecommendedBook } from './bookRecommendations';

export function generatePDF(report: NumerologyReport, customBooks?: RecommendedBook[]) {
  // A4 dimensions in mm: 210 x 297
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 16;
  const contentWidth = pageWidth - margin * 2; // 178 mm
  const totalPages = 8;

  // Color Palette
  const PRIMARY = '#1A1B2F';
  const ACCENT_GOLD = '#D4AF37';
  const ACCENT_GOLD_LIGHT = '#F3E5AB';
  const TEXT_DARK = '#2C3E50';
  const BG_CARD = '#F8F9FA';
  const TEXT_MUTED = '#6B7280';
  const BORDER_COLOR = '#E2E8F0';

  const referralUrl = `https://seudominio.com/?ref=${report.referralId}`;
  const PIX_NUBANK_URL = 'https://nubank.com.br/cobrar/dx851l/6aa2c5cb-60b9-4de0-aac4-53324bc8ec8d';

  // Helper: Draw Header (Pages 2 to 8)
  const drawPageHeader = (pageNum: number, sectionTitle: string) => {
    // Top border accent
    doc.setFillColor(ACCENT_GOLD);
    doc.rect(margin, 10, contentWidth, 0.8, 'F');

    // Header Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.8);
    doc.setTextColor(PRIMARY);
    doc.text('MAPA NUMEROLÓGICO & DIAGNÓSTICO DE PROSPERIDADE', margin, 16);

    // Section title aligned to the right (never overlaps with left title or truncates)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(ACCENT_GOLD);
    doc.text(sectionTitle.toUpperCase(), pageWidth - margin, 16, { align: 'right' });

    // Subtle line below header
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, 19, pageWidth - margin, 19);
  };

  // Helper: Draw Footer (Pages 2 to 8)
  const drawPageFooter = (pageNum: number) => {
    // Divider line
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

    // Pix reminder notice requested by user
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(TEXT_MUTED);
    const pixPrefix = 'Se você se esqueceu de efetuar o pagamento pode fazer o pix através do link a seguir: ';
    doc.text(pixPrefix, margin, pageHeight - 11.2);

    const prefixWidth = doc.getTextWidth(pixPrefix);
    const linkText = 'FAZER PIX AGORA';

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.0);
    doc.setTextColor(130, 10, 209); // Nubank purple #820AD1
    doc.textWithLink(linkText, margin + prefixWidth, pageHeight - 11.2, { url: PIX_NUBANK_URL });

    const linkWidth = doc.getTextWidth(linkText);
    doc.setDrawColor(130, 10, 209);
    doc.setLineWidth(0.3);
    doc.line(margin + prefixWidth, pageHeight - 10.5, margin + prefixWidth + linkWidth, pageHeight - 10.5);
    doc.link(margin + prefixWidth - 1, pageHeight - 14.0, linkWidth + 2, 4.5, { url: PIX_NUBANK_URL });

    // Nome do consulente: posicionado no rodapé abaixo à esquerda, acima da numeração da página
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(PRIMARY);
    doc.text('Consulente: ', margin, pageHeight - 7.0);

    const consPrefixW = doc.getTextWidth('Consulente: ');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(TEXT_DARK);
    doc.text(report.user.fullName, margin + consPrefixW, pageHeight - 7.0);

    // Data de emissão à direita
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.2);
    doc.setTextColor(TEXT_MUTED);
    doc.text(`Emitido em: ${report.generatedAt}`, pageWidth - margin, pageHeight - 7.0, { align: 'right' });

    // Numeração da página abaixo à esquerda (abaixo do nome do consulente)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(PRIMARY);
    doc.text(`Página ${pageNum} de ${totalPages}`, margin, pageHeight - 3.8);

    // Link de Ativação à direita
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.2);
    doc.setTextColor(TEXT_MUTED);
    doc.text(`Link de Indicação & Ativação: ${referralUrl}`, pageWidth - margin, pageHeight - 3.8, { align: 'right' });
  };

  // Helper: Card background
  const drawCard = (x: number, y: number, w: number, h: number, goldAccent: boolean = false, bgColor: string = BG_CARD) => {
    doc.setFillColor(bgColor);
    doc.roundedRect(x, y, w, h, 2.5, 2.5, 'F');
    doc.setDrawColor(goldAccent ? ACCENT_GOLD : BORDER_COLOR);
    doc.setLineWidth(goldAccent ? 0.6 : 0.3);
    doc.roundedRect(x, y, w, h, 2.5, 2.5, 'S');
  };

  // Helper: Draw Sacred Star of David (Selo de Salomão)
  const drawStarOfDavid = (cx: number, cy: number, r: number, strokeColor: string = ACCENT_GOLD) => {
    doc.setDrawColor(strokeColor);
    doc.setLineWidth(0.4);

    // Outer concentric circles
    doc.circle(cx, cy, r * 1.3, 'S');
    doc.setLineWidth(0.2);
    doc.circle(cx, cy, r * 1.18, 'S');

    // Triangle 1 (pointing up)
    const sin60 = Math.sin(Math.PI / 3);
    const cos60 = Math.cos(Math.PI / 3);
    const p1 = [cx, cy - r];
    const p2 = [cx + r * sin60, cy + r * cos60];
    const p3 = [cx - r * sin60, cy + r * cos60];

    doc.setLineWidth(0.4);
    doc.line(p1[0], p1[1], p2[0], p2[1]);
    doc.line(p2[0], p2[1], p3[0], p3[1]);
    doc.line(p3[0], p3[1], p1[0], p1[1]);

    // Triangle 2 (pointing down)
    const q1 = [cx, cy + r];
    const q2 = [cx + r * sin60, cy - r * cos60];
    const q3 = [cx - r * sin60, cy - r * cos60];

    doc.line(q1[0], q1[1], q2[0], q2[1]);
    doc.line(q2[0], q2[1], q3[0], q3[1]);
    doc.line(q3[0], q3[1], q1[0], q1[1]);

    // Inner center circle / dot
    doc.circle(cx, cy, 1.2, 'S');
  };

  // Helper: Draw Eye of Providence (Olho da Providência no Triângulo Sagrado)
  const drawEyeOfProvidence = (cx: number, cy: number, size: number) => {
    doc.setDrawColor(ACCENT_GOLD);
    doc.setLineWidth(0.5);

    // Radiating rays
    const rayLen = size * 1.35;
    for (let angle = 0; angle < 360; angle += 30) {
      const rad = (angle * Math.PI) / 180;
      const x1 = cx + (size * 0.7) * Math.cos(rad);
      const y1 = cy + (size * 0.7) * Math.sin(rad);
      const x2 = cx + rayLen * Math.cos(rad);
      const y2 = cy + rayLen * Math.sin(rad);
      doc.setLineWidth(0.2);
      doc.line(x1, y1, x2, y2);
    }

    // Equilateral triangle
    const h = size * 1.1;
    const halfW = size * 0.75;
    doc.setLineWidth(0.5);
    doc.line(cx, cy - h * 0.6, cx + halfW, cy + h * 0.4);
    doc.line(cx + halfW, cy + h * 0.4, cx - halfW, cy + h * 0.4);
    doc.line(cx - halfW, cy + h * 0.4, cx, cy - h * 0.6);

    // Inner eye shape
    const eyeW = size * 0.45;
    const eyeH = size * 0.2;
    doc.setLineWidth(0.3);
    doc.line(cx - eyeW, cy + 1, cx, cy - eyeH + 1);
    doc.line(cx, cy - eyeH + 1, cx + eyeW, cy + 1);
    doc.line(cx - eyeW, cy + 1, cx, cy + eyeH + 1);
    doc.line(cx, cy + eyeH + 1, cx + eyeW, cy + 1);

    // Iris & pupil
    doc.circle(cx, cy + 1, size * 0.1, 'F');
  };

  // Helper: Draw Sacred Cross with Alpha and Omega
  const drawSacredCrossWithAlphaOmega = (cx: number, cy: number, size: number) => {
    doc.setDrawColor(ACCENT_GOLD);
    doc.setLineWidth(0.8);

    // Vertical bar
    doc.line(cx, cy - size * 0.7, cx, cy + size * 0.7);
    // Horizontal bar
    doc.line(cx - size * 0.45, cy - size * 0.2, cx + size * 0.45, cy - size * 0.2);

    // Flared ends (serifs)
    doc.setLineWidth(0.3);
    doc.line(cx - 2, cy - size * 0.7, cx + 2, cy - size * 0.7);
    doc.line(cx - 2, cy + size * 0.7, cx + 2, cy + size * 0.7);
    doc.line(cx - size * 0.45, cy - size * 0.2 - 2, cx - size * 0.45, cy - size * 0.2 + 2);
    doc.line(cx + size * 0.45, cy - size * 0.2 - 2, cx + size * 0.45, cy - size * 0.2 + 2);

    // Alpha & Omega text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(ACCENT_GOLD);
    doc.text('A', cx - size * 0.55, cy - size * 0.15, { align: 'right' });
    doc.text('Ω', cx + size * 0.55, cy - size * 0.15, { align: 'left' });
  };

  // ==========================================
  // PAGE 1: CAPA PERSONALIZADA DE ALTO LUXO
  // ==========================================
  doc.setFillColor(26, 27, 47); // #1A1B2F
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Subtle Gold inner border
  doc.setDrawColor(ACCENT_GOLD);
  doc.setLineWidth(0.7);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  doc.setDrawColor(ACCENT_GOLD);
  doc.setLineWidth(0.3);
  doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

  // Decorative corner embellishments
  const cornerSize = 10;
  const corners = [
    [14, 14],
    [pageWidth - 14 - cornerSize, 14],
    [14, pageHeight - 14 - cornerSize],
    [pageWidth - 14 - cornerSize, pageHeight - 14 - cornerSize]
  ];
  corners.forEach(([cornerX, cornerY]) => {
    doc.setDrawColor(ACCENT_GOLD);
    doc.circle(cornerX + cornerSize / 2, cornerY + cornerSize / 2, 2.5, 'S');
    doc.circle(cornerX + cornerSize / 2, cornerY + cornerSize / 2, 1, 'F');
  });

  const centerX = pageWidth / 2;
  const emblemY = 54;

  drawStarOfDavid(centerX, emblemY, 18, ACCENT_GOLD);

  // Central life path number inside seal
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(ACCENT_GOLD_LIGHT);
  doc.text(`${report.lifePath.number}`, centerX, emblemY + 3.5, { align: 'center' });

  // Inscrição sagrada em latim
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(ACCENT_GOLD);
  doc.text('IN NOMINE DIVINO • LUX, SAPIENTIA ET ABUNDANTIA', centerX, 86, { align: 'center' });

  // Subtitle above title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(ACCENT_GOLD_LIGHT);
  doc.text('SÍNTESE CÓSMICA & PROTOCOLO SAGRADO DE ABUNDÂNCIA', centerX, 95, { align: 'center' });

  // Main Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(21);
  doc.setTextColor(255, 255, 255);
  doc.text('MAPA NUMEROLÓGICO', centerX, 106, { align: 'center' });

  doc.setFontSize(15);
  doc.setTextColor(ACCENT_GOLD);
  doc.text('& DIAGNÓSTICO DE PROSPERIDADE', centerX, 115, { align: 'center' });

  // Golden divider line
  doc.setLineWidth(0.6);
  doc.setDrawColor(ACCENT_GOLD);
  doc.line(centerX - 40, 121, centerX + 40, 121);
  doc.circle(centerX, 121, 1.5, 'F');

  // Prepared especially for:
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(195, 202, 220);
  doc.text('DOCUMENTO CONSAGRADO ESPECIALMENTE PARA:', centerX, 134, { align: 'center' });

  // Full Name (Auto-scales to strictly stay inside borders with margin)
  const rawFullName = report.user.fullName.toUpperCase();
  let nameFontSize = 16;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(nameFontSize);
  while (doc.getTextWidth(rawFullName) > 156 && nameFontSize > 10) {
    nameFontSize -= 0.5;
    doc.setFontSize(nameFontSize);
  }
  doc.setTextColor(255, 255, 255);
  doc.text(rawFullName, centerX, 145, { align: 'center' });

  // Birth Details Box (Expanded width to ensure text never touches borders)
  const infoBoxY = 156;
  const infoBoxW = 144;
  doc.setFillColor(34, 37, 65);
  doc.roundedRect(centerX - infoBoxW / 2, infoBoxY, infoBoxW, 22, 3, 3, 'F');
  doc.setDrawColor(ACCENT_GOLD);
  doc.setLineWidth(0.4);
  doc.roundedRect(centerX - infoBoxW / 2, infoBoxY, infoBoxW, 22, 3, 3, 'S');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2);
  doc.setTextColor(ACCENT_GOLD_LIGHT);
  doc.text(`Nascimento: ${report.user.formattedDate}${report.user.birthTime ? ` às ${report.user.birthTime}` : ''}`, centerX, infoBoxY + 8.5, { align: 'center' });
  doc.text(`Data de Emissão: ${report.generatedAt} • Código Sagrado: ${report.referralId}`, centerX, infoBoxY + 16, { align: 'center' });

  // 4 Core Numbers Summary Grid on Cover
  const coverGridY = 191;
  const cardW = 39;
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
    doc.setFillColor(30, 32, 56);
    doc.roundedRect(cx, coverGridY, cardW, cardH, 2.5, 2.5, 'F');
    doc.setDrawColor(ACCENT_GOLD);
    doc.setLineWidth(0.3);
    doc.roundedRect(cx, coverGridY, cardW, cardH, 2.5, 2.5, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.2);
    doc.setTextColor(ACCENT_GOLD_LIGHT);
    doc.text(item.label, cx + cardW / 2, coverGridY + 7.5, { align: 'center' });

    doc.setFontSize(15);
    doc.setTextColor(255, 255, 255);
    doc.text(`${item.num}`, cx + cardW / 2, coverGridY + 19, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(ACCENT_GOLD);
    doc.text(item.sub, cx + cardW / 2, coverGridY + 26, { align: 'center' });
  });

  // Name optimization teaser on cover
  const coverTeaserY = 236;
  const teaserW = contentWidth - 10;
  doc.setFillColor(35, 38, 68);
  doc.roundedRect(centerX - teaserW / 2, coverTeaserY, teaserW, 25, 2.5, 2.5, 'F');
  doc.setDrawColor(ACCENT_GOLD);
  doc.setLineWidth(0.3);
  doc.roundedRect(centerX - teaserW / 2, coverTeaserY, teaserW, 25, 2.5, 2.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.8);
  doc.setTextColor(ACCENT_GOLD);
  doc.text('CONTEÚDO SAGRADO EXCLUSIVO INCLUSO NESTE RELATÓRIO:', centerX, coverTeaserY + 6.5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.0);
  doc.setTextColor(230, 235, 245);
  doc.text('• Campo Biofotônico da Aura & Blindagem • Otimização do Nome para a Vibração 8', centerX, coverTeaserY + 13, { align: 'center' });
  doc.text('• Banhos Sagrados • Frequências Solfeggio • Selos Sagrados • Livros Inspiradores', centerX, coverTeaserY + 19, { align: 'center' });

  // Cover footer notice
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(170, 175, 195);
  doc.text('Relatório emitido sob o rigor do Sistema Pitagórico, Cabala da Prosperidade e Princípios Bíblicos de Fartura.', centerX, pageHeight - 16, { align: 'center' });

  // Pix reminder on cover footer
  const coverPixPrefix = 'Se você se esqueceu de efetuar o pagamento pode fazer o pix através do link a seguir: ';
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(190, 195, 215);
  const coverPrefixW = doc.getTextWidth(coverPixPrefix);
  const coverLinkTxt = 'FAZER PIX AGORA';
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  const coverLinkW = doc.getTextWidth(coverLinkTxt);
  const coverTotalW = coverPrefixW + coverLinkW;
  const coverStartX = centerX - coverTotalW / 2;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(190, 195, 215);
  doc.text(coverPixPrefix, coverStartX, pageHeight - 10.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(ACCENT_GOLD_LIGHT);
  doc.textWithLink(coverLinkTxt, coverStartX + coverPrefixW, pageHeight - 10.5, { url: PIX_NUBANK_URL });
  doc.setDrawColor(243, 229, 171);
  doc.setLineWidth(0.3);
  doc.line(coverStartX + coverPrefixW, pageHeight - 9.8, coverStartX + coverPrefixW + coverLinkW, pageHeight - 9.8);
  doc.link(coverStartX + coverPrefixW - 1, pageHeight - 13.5, coverLinkW + 2, 4.5, { url: PIX_NUBANK_URL });

  // ==========================================
  // PAGE 2: CAMINHO DE VIDA E PERSONALIDADE
  // ==========================================
  doc.addPage();
  drawPageHeader(2, '1. Síntese da Essência & Tríade da Personalidade');
  drawPageFooter(2);

  // Section Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12.5);
  doc.setTextColor(PRIMARY);
  doc.text('1. SÍNTESE DA ESSÊNCIA & ESTRUTURA DE PERSONALIDADE', margin, 27);

  // Card 1: Caminho de Vida (Full Detailed Card)
  const lpCardY = 31;
  const lpCardH = 78;
  drawCard(margin, lpCardY, contentWidth, lpCardH, true);

  // Badge for Life Path
  doc.setFillColor(PRIMARY);
  doc.roundedRect(margin + 5, lpCardY + 5, 22, 22, 2.5, 2.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(ACCENT_GOLD);
  doc.text(`${report.lifePath.number}`, margin + 16, lpCardY + 20, { align: 'center' });

  // Life path titles
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(PRIMARY);
  doc.text(`Caminho de Vida ${report.lifePath.number}: ${report.lifePath.name}`, margin + 31, lpCardY + 10);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.2);
  doc.setTextColor(ACCENT_GOLD);
  doc.text(`Arquétipo Central: ${report.lifePath.archetype}`, margin + 31, lpCardY + 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(TEXT_MUTED);
  doc.text(`Cálculo: ${report.lifePath.calculationExplanation}`, margin + 31, lpCardY + 22, { maxWidth: contentWidth - 36 });

  // Essence Text (Safely wrapped with padding)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(TEXT_DARK);
  const essenceLines = doc.splitTextToSize(report.lifePath.essence, contentWidth - 12);
  doc.text(essenceLines, margin + 6, lpCardY + 33);

  // Strengths & Challenges 2-col
  const colY = lpCardY + 46;
  const halfCol = (contentWidth - 14) / 2;

  // Strengths column
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(PRIMARY);
  doc.text('Forças e Atributos Inatos de Sucesso:', margin + 6, colY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.0);
  doc.setTextColor(TEXT_DARK);
  report.lifePath.strengths.slice(0, 3).forEach((st, idx) => {
    doc.text(`• ${st}`, margin + 6, colY + 4.8 + idx * 4.2, { maxWidth: halfCol - 4 });
  });

  // Challenges column
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(PRIMARY);
  doc.text('Desafios & Armadilhas a Neutralizar:', margin + 6 + halfCol + 2, colY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.0);
  doc.setTextColor(TEXT_DARK);
  report.lifePath.challenges.slice(0, 3).forEach((ch, idx) => {
    doc.text(`• ${ch}`, margin + 6 + halfCol + 2, colY + 4.8 + idx * 4.2, { maxWidth: halfCol - 4 });
  });

  // Prosperity impact highlight inside card (Fixed height pill with strictly wrapped text)
  const lpImpactBoxY = lpCardY + 63;
  doc.setFillColor(243, 229, 171);
  doc.roundedRect(margin + 5, lpImpactBoxY, contentWidth - 10, 11, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(PRIMARY);
  doc.text('Diretriz de Prosperidade: ', margin + 8, lpImpactBoxY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.0);
  const impactLines = doc.splitTextToSize(report.lifePath.prosperityImpact, contentWidth - 52);
  doc.text(impactLines, margin + 44, lpImpactBoxY + 7);

  // Cards for Expression, Soul Urge & Personality
  // Exact vertical rhythm: 3 cards of height 51mm, starting at Y = 113, 168, 223 (ends at 274, well above 284 footer)
  const subH = 51;

  // 1. Expression Number
  const expY = 113;
  drawCard(margin, expY, contentWidth, subH);
  doc.setFillColor(PRIMARY);
  doc.roundedRect(margin + 5, expY + 5, 14, 14, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(ACCENT_GOLD);
  doc.text(`${report.expression.number}`, margin + 12, expY + 14, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(PRIMARY);
  doc.text(`Número de Expressão ${report.expression.number} (${report.expression.name})`, margin + 23, expY + 10);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.0);
  doc.setTextColor(TEXT_MUTED);
  doc.text(report.expression.calculationExplanation, margin + 23, expY + 15, { maxWidth: contentWidth - 30 });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(TEXT_DARK);
  const expLines = doc.splitTextToSize(report.expression.essence, contentWidth - 12);
  doc.text(expLines, margin + 6, expY + 23);

  // Bottom highlighted pill inside Expression Card
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(margin + 5, expY + 38, contentWidth - 10, 9, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.0);
  doc.setTextColor(PRIMARY);
  doc.text('Talentos Chave de Monetização:', margin + 8, expY + 44);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(TEXT_DARK);
  const expStrengths = report.expression.strengths.slice(0, 3).join('  •  ');
  doc.text(expStrengths, margin + 55, expY + 44, { maxWidth: contentWidth - 62 });

  // 2. Soul Urge Number
  const soulY = 168;
  drawCard(margin, soulY, contentWidth, subH);
  doc.setFillColor(PRIMARY);
  doc.roundedRect(margin + 5, soulY + 5, 14, 14, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(ACCENT_GOLD);
  doc.text(`${report.soulUrge.number}`, margin + 12, soulY + 14, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(PRIMARY);
  doc.text(`Desejo da Alma ${report.soulUrge.number} (${report.soulUrge.archetype})`, margin + 23, soulY + 10);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.0);
  doc.setTextColor(TEXT_MUTED);
  doc.text(report.soulUrge.calculationExplanation, margin + 23, soulY + 15, { maxWidth: contentWidth - 30 });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(TEXT_DARK);
  const soulLines = doc.splitTextToSize(report.soulUrge.essence, contentWidth - 12);
  doc.text(soulLines, margin + 6, soulY + 23);

  // Bottom highlighted pill inside Soul Urge Card
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(margin + 5, soulY + 38, contentWidth - 10, 9, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.0);
  doc.setTextColor(PRIMARY);
  doc.text('Motivação Sagrada & Aspiração:', margin + 8, soulY + 44);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(TEXT_DARK);
  const soulImpact = report.soulUrge.prosperityImpact;
  doc.text(soulImpact, margin + 55, soulY + 44, { maxWidth: contentWidth - 62 });

  // 3. Personality Number
  const persY = 223;
  drawCard(margin, persY, contentWidth, subH);
  doc.setFillColor(PRIMARY);
  doc.roundedRect(margin + 5, persY + 5, 14, 14, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(ACCENT_GOLD);
  doc.text(`${report.personality.number}`, margin + 12, persY + 14, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(PRIMARY);
  doc.text(`Número de Personalidade Externa ${report.personality.number} (${report.personality.name})`, margin + 23, persY + 10);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.0);
  doc.setTextColor(TEXT_MUTED);
  doc.text(report.personality.calculationExplanation, margin + 23, persY + 15, { maxWidth: contentWidth - 30 });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(TEXT_DARK);
  const persLines = doc.splitTextToSize(report.personality.essence, contentWidth - 12);
  doc.text(persLines, margin + 6, persY + 23);

  // Bottom highlighted pill inside Personality Card
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(margin + 5, persY + 38, contentWidth - 10, 9, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.0);
  doc.setTextColor(PRIMARY);
  doc.text('Impressão Social & Vendas:', margin + 8, persY + 44);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(TEXT_DARK);
  const persStrengths = report.personality.strengths.slice(0, 3).join('  •  ');
  doc.text(persStrengths, margin + 50, persY + 44, { maxWidth: contentWidth - 58 });

  // ==========================================
  // PAGE 3: DIAGNÓSTICO DE PROSPERIDADE & CÓDIGOS
  // ==========================================
  doc.addPage();
  drawPageHeader(3, '2. Diagnóstico de Prosperidade & Códigos Numéricos');
  drawPageFooter(3);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12.5);
  doc.setTextColor(PRIMARY);
  doc.text('2. DIAGNÓSTICO DE PROSPERIDADE & CÓDIGOS DE ABUNDÂNCIA', margin, 27);

  // Score Banner (Dynamic Height to strictly contain all text)
  const scoreY = 31;
  const bannerH = 40;
  doc.setFillColor(PRIMARY);
  doc.roundedRect(margin, scoreY, contentWidth, bannerH, 3, 3, 'F');

  // Prosperity Score Circle
  doc.setFillColor(36, 38, 64);
  doc.circle(margin + 24, scoreY + 20, 13, 'F');
  doc.setDrawColor(ACCENT_GOLD);
  doc.setLineWidth(1);
  doc.circle(margin + 24, scoreY + 20, 13, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(ACCENT_GOLD);
  doc.text(`${report.prosperity.score}%`, margin + 24, scoreY + 21, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(255, 255, 255);
  doc.text('POTENCIAL', margin + 24, scoreY + 26, { align: 'center' });

  // Banner details with strictly calibrated positions
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text(`Arquétipo de Riqueza: ${report.prosperity.archetype}`, margin + 44, scoreY + 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(ACCENT_GOLD_LIGHT);
  const archLines = doc.splitTextToSize(report.prosperity.archetypeDescription, contentWidth - 50);
  doc.text(archLines, margin + 44, scoreY + 17);

  const potY = scoreY + 17 + archLines.length * 3.2 + 2;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.0);
  doc.setTextColor(220, 225, 240);
  const potLines = doc.splitTextToSize(report.prosperity.abundancePotential, contentWidth - 50);
  doc.text(potLines, margin + 44, potY);

  // Section: Bloqueios Financeiros (Limpezas necessárias)
  const blocksY = 75;
  const blocksCardH = 56;
  drawCard(margin, blocksY, contentWidth, blocksCardH, false);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(PRIMARY);
  doc.text('Bloqueios Inconscientes & Padrões Limitantes Identificados:', margin + 6, blocksY + 8);

  report.prosperity.financialBlocks.slice(0, 3).forEach((block, idx) => {
    const by = blocksY + 14 + idx * 13;
    const blockBoxH = 11;
    doc.setFillColor(254, 242, 242); // light red accent
    doc.roundedRect(margin + 5, by, contentWidth - 10, blockBoxH, 1.5, 1.5, 'F');
    doc.setDrawColor(254, 202, 202);
    doc.setLineWidth(0.2);
    doc.roundedRect(margin + 5, by, contentWidth - 10, blockBoxH, 1.5, 1.5, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(185, 28, 28);
    doc.text(`[Bloqueio 0${idx + 1}]`, margin + 8, by + 6.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(TEXT_DARK);
    const bLines = doc.splitTextToSize(block, contentWidth - 38);
    doc.text(bLines, margin + 30, by + 6.5);
  });

  // Section: Superpoderes de Monetização
  const powersY = 135;
  const powersCardH = 56;
  drawCard(margin, powersY, contentWidth, powersCardH, false);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(PRIMARY);
  doc.text('Superpoderes de Monetização & Oportunidades de Alta Renda:', margin + 6, powersY + 8);

  report.prosperity.monetizationSuperpowers.slice(0, 3).forEach((pwr, idx) => {
    const py = powersY + 14 + idx * 13;
    const pwrBoxH = 11;
    doc.setFillColor(240, 253, 244); // light green accent
    doc.roundedRect(margin + 5, py, contentWidth - 10, pwrBoxH, 1.5, 1.5, 'F');
    doc.setDrawColor(187, 247, 208);
    doc.setLineWidth(0.2);
    doc.roundedRect(margin + 5, py, contentWidth - 10, pwrBoxH, 1.5, 1.5, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(21, 128, 61);
    doc.text(`[Ativo 0${idx + 1}]`, margin + 8, py + 6.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(TEXT_DARK);
    const pLines = doc.splitTextToSize(pwr, contentWidth - 36);
    doc.text(pLines, margin + 28, py + 6.5);
  });

  // Section: Códigos Sagrados de Ativação
  const codesY = 195;
  const codesCardH = 78;
  drawCard(margin, codesY, contentWidth, codesCardH, true);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(PRIMARY);
  doc.text('Códigos Numéricos Sagrados para Reprogramação Quântica:', margin + 6, codesY + 8);

  report.prosperity.sacredCodes.slice(0, 3).forEach((sc, idx) => {
    const cy = codesY + 14 + idx * 20;
    const codeBoxH = 17.5;
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin + 5, cy, contentWidth - 10, codeBoxH, 2, 2, 'F');
    doc.setDrawColor(ACCENT_GOLD);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin + 5, cy, contentWidth - 10, codeBoxH, 2, 2, 'S');

    // Code badge
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(PRIMARY);
    doc.text(sc.code, margin + 9, cy + 7);

    // Purpose & Mantra
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.8);
    doc.setTextColor(ACCENT_GOLD);
    doc.text(sc.purpose, margin + 44, cy + 5.5, { maxWidth: contentWidth - 52 });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(TEXT_MUTED);
    const mLines = doc.splitTextToSize(sc.mantra, contentWidth - 52);
    doc.text(mLines, margin + 44, cy + 10.5);
  });

  // ==========================================
  // PAGE 4: OTIMIZAÇÃO VIBRACIONAL DO NOME & ASSINATURA DE PROSPERIDADE
  // ==========================================
  doc.addPage();
  drawPageHeader(4, '3. Otimização do Nome & Assinatura de Riqueza');
  drawPageFooter(4);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12.5);
  doc.setTextColor(PRIMARY);
  doc.text('3. OTIMIZAÇÃO VIBRACIONAL DO NOME & ASSINATURA DE PROSPERIDADE', margin, 27);

  // Big Comparison Banner: Expressão Atual vs Expressão Otimizada (Número 8)
  const optBannerY = 31;
  const optBannerH = 43;
  doc.setFillColor(PRIMARY);
  doc.roundedRect(margin, optBannerY, contentWidth, optBannerH, 3, 3, 'F');

  // Current Expression Badge
  doc.setFillColor(34, 37, 65);
  doc.roundedRect(margin + 5, optBannerY + 6, 36, 31, 2, 2, 'F');
  doc.setDrawColor(BORDER_COLOR);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin + 5, optBannerY + 6, 36, 31, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.2);
  doc.setTextColor(TEXT_MUTED);
  doc.text('EXPRESSÃO ATUAL', margin + 23, optBannerY + 12, { align: 'center' });
  doc.setFontSize(15);
  doc.setTextColor(255, 255, 255);
  doc.text(`${report.nameOptimization.currentExpression}`, margin + 23, optBannerY + 23, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.2);
  doc.setTextColor(ACCENT_GOLD_LIGHT);
  doc.text('Frequência de Batismo', margin + 23, optBannerY + 31, { align: 'center' });

  // Arrow
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(ACCENT_GOLD);
  doc.text('➔', margin + 46, optBannerY + 23, { align: 'center' });

  // Target Expression 8 Badge
  doc.setFillColor(34, 37, 65);
  doc.roundedRect(margin + 51, optBannerY + 6, 38, 31, 2, 2, 'F');
  doc.setDrawColor(ACCENT_GOLD);
  doc.setLineWidth(0.6);
  doc.roundedRect(margin + 51, optBannerY + 6, 38, 31, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.2);
  doc.setTextColor(ACCENT_GOLD);
  doc.text('EXPRESSÃO OTIMIZADA', margin + 70, optBannerY + 12, { align: 'center' });
  doc.setFontSize(16);
  doc.setTextColor(ACCENT_GOLD_LIGHT);
  doc.text(`${report.nameOptimization.targetExpression}`, margin + 70, optBannerY + 23, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.2);
  doc.setTextColor(255, 255, 255);
  doc.text('O Soberano da Riqueza', margin + 70, optBannerY + 31, { align: 'center' });

  // Right side text in banner (Strictly bounded so it NEVER spills past the right edge)
  const rightBannerX = margin + 94;
  const rightBannerW = contentWidth - 98; // ~80mm width

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text('Ajuste Vibracional Recomendado:', rightBannerX, optBannerY + 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(ACCENT_GOLD_LIGHT);
  doc.text(`Acrescentar a letra: "${report.nameOptimization.letterToAdd}" (Valor Pitagórico ${report.nameOptimization.letterValue})`, rightBannerX, optBannerY + 17, { maxWidth: rightBannerW });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.2);
  doc.setTextColor(255, 255, 255);
  doc.text(`Nome Sugerido: "${report.nameOptimization.suggestedName}"`, rightBannerX, optBannerY + 24, { maxWidth: rightBannerW });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.6);
  doc.setTextColor(200, 205, 220);
  const usageLines = doc.splitTextToSize('Use em cartões de visita, redes profissionais e assinaturas contratuais.', rightBannerW);
  doc.text(usageLines, rightBannerX, optBannerY + 31);

  // Racional Metafísico Card
  const ratY = 78;
  const ratH = 36;
  drawCard(margin, ratY, contentWidth, ratH, true);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.0);
  doc.setTextColor(PRIMARY);
  doc.text('Fundamento da Transmutação Vibracional para a Vibração 8:', margin + 6, ratY + 7.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(TEXT_DARK);
  const ratLines = doc.splitTextToSize(report.nameOptimization.metaphysicalRationale, contentWidth - 12);
  doc.text(ratLines, margin + 6, ratY + 14);

  // Guia de Caligrafia & Assinatura de Poder (3 Leis)
  const signCardY = 118;
  const signCardH = 60;
  drawCard(margin, signCardY, contentWidth, signCardH, false);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(PRIMARY);
  doc.text('Manual da Assinatura de Poder & Blindagem Patrimonial:', margin + 6, signCardY + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.0);
  doc.setTextColor(TEXT_DARK);
  const signLines = doc.splitTextToSize(report.nameOptimization.signatureGuideline, contentWidth - 12);
  doc.text(signLines, margin + 6, signCardY + 15);

  // Exemplos Gráficos das 3 Leis da Assinatura Próspera
  const ruleBoxY = signCardY + 28;
  const ruleGap = 3.5;
  const ruleBoxW = (contentWidth - 12 - ruleGap * 2) / 3;

  // Regra 1
  const r1X = margin + 6;
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(r1X, ruleBoxY, ruleBoxW, 26, 1.5, 1.5, 'F');
  doc.setDrawColor(ACCENT_GOLD);
  doc.setLineWidth(0.3);
  doc.roundedRect(r1X, ruleBoxY, ruleBoxW, 26, 1.5, 1.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(PRIMARY);
  doc.text('1. Ângulo Ascendente', r1X + 3.5, ruleBoxY + 5.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.0);
  doc.setTextColor(TEXT_MUTED);
  const r1Lines = doc.splitTextToSize('Incline a assinatura entre 35° e 45° para cima. Vetor cósmico de crescimento contínuo.', ruleBoxW - 7);
  doc.text(r1Lines, r1X + 3.5, ruleBoxY + 10.5);

  // Regra 2
  const r2X = r1X + ruleBoxW + ruleGap;
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(r2X, ruleBoxY, ruleBoxW, 26, 1.5, 1.5, 'F');
  doc.setDrawColor(ACCENT_GOLD);
  doc.setLineWidth(0.3);
  doc.roundedRect(r2X, ruleBoxY, ruleBoxW, 26, 1.5, 1.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(PRIMARY);
  doc.text('2. Traço de Apoio', r2X + 3.5, ruleBoxY + 5.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.0);
  doc.setTextColor(TEXT_MUTED);
  const r2Lines = doc.splitTextToSize('Trace uma linha reta embaixo do nome. Cria sustentação e estabilidade patrimonial.', ruleBoxW - 7);
  doc.text(r2Lines, r2X + 3.5, ruleBoxY + 10.5);

  // Regra 3
  const r3X = r2X + ruleBoxW + ruleGap;
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(r3X, ruleBoxY, ruleBoxW, 26, 1.5, 1.5, 'F');
  doc.setDrawColor(ACCENT_GOLD);
  doc.setLineWidth(0.3);
  doc.roundedRect(r3X, ruleBoxY, ruleBoxW, 26, 1.5, 1.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(PRIMARY);
  doc.text('3. Sem Cortes / Sem Pontos', r3X + 3.5, ruleBoxY + 5.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.0);
  doc.setTextColor(TEXT_MUTED);
  const r3Lines = doc.splitTextToSize('Nunca corte as letras do nome. Não coloque ponto final; mantenha o fluxo livre.', ruleBoxW - 7);
  doc.text(r3Lines, r3X + 3.5, ruleBoxY + 10.5);

  // Plano Prático de 21 Dias de Ativação (Dynamically calculated row heights)
  const planY = 182;
  const planCardH = 92;
  drawCard(margin, planY, contentWidth, planCardH, false);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(PRIMARY);
  doc.text('Plano Prático de Ativação da Nova Frequência (21 Dias):', margin + 6, planY + 8);

  let curStepY = planY + 13;
  report.nameOptimization.practicalActionPlan.forEach((step, idx) => {
    const stepBoxH = 17.5;
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin + 5, curStepY, contentWidth - 10, stepBoxH, 1.5, 1.5, 'F');
    doc.setDrawColor(BORDER_COLOR);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin + 5, curStepY, contentWidth - 10, stepBoxH, 1.5, 1.5, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(ACCENT_GOLD);
    doc.text(`PASSO 0${idx + 1}`, margin + 8, curStepY + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(TEXT_DARK);
    const pLines = doc.splitTextToSize(step, contentWidth - 40);
    doc.text(pLines, margin + 30, curStepY + 6.5);

    curStepY += stepBoxH + 2;
  });

  // ==========================================
  // PAGE 5: CAMPO BIOFOTÔNICO DA AURA & BLINDAGEM ENERGÉTICA
  // ==========================================
  doc.addPage();
  drawPageHeader(5, '4. Campo Biofotônico da Aura & Blindagem');
  drawPageFooter(5);

  const aura = report.aura || calculateAuraProfile(report.lifePath.number, report.expression.number);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12.5);
  doc.setTextColor(PRIMARY);
  doc.text('4. DIAGNÓSTICO DO CAMPO BIOFOTÔNICO DA AURA & BLINDAGEM', margin, 27);

  // Top Aura Banner (Y = 31, H = 45mm)
  const auraBannerY = 31;
  const auraBannerH = 45;
  doc.setFillColor(PRIMARY);
  doc.roundedRect(margin, auraBannerY, contentWidth, auraBannerH, 3, 3, 'F');

  // Aura Circular Display with Sacred Round Frame
  const auraCircleX = margin + 22;
  const auraCircleY = auraBannerY + 22.5;
  const auraRadius = 14;

  // Background glow
  doc.setFillColor(34, 37, 65);
  doc.circle(auraCircleX, auraCircleY, auraRadius, 'F');

  let imageRendered = false;
  if (aura.capturedImageUrl) {
    try {
      const imgSize = 23; // mm (radius 11.5mm)
      const format = aura.capturedImageUrl.includes('image/png') ? 'PNG' : 'JPEG';
      doc.addImage(aura.capturedImageUrl, format, auraCircleX - imgSize / 2, auraCircleY - imgSize / 2, imgSize, imgSize);
      imageRendered = true;

      // Mask outside corners using banner background color to guarantee a clean circular silhouette
      doc.setDrawColor(26, 27, 47); // PRIMARY #1A1B2F
      doc.setLineWidth(4.5);
      doc.circle(auraCircleX, auraCircleY, 13.75, 'S');
    } catch {
      imageRendered = false;
    }
  }

  // --- MOLDURA REDONDA SAGRADA (ROUND FRAME) ---
  // 1. Moldura dourada interna contornando perfeitamente a imagem
  doc.setDrawColor(ACCENT_GOLD);
  doc.setLineWidth(0.8);
  doc.circle(auraCircleX, auraCircleY, 11.5, 'S');

  // 2. Anel intermediário decorativo de ouro suave
  doc.setDrawColor(ACCENT_GOLD_LIGHT);
  doc.setLineWidth(0.3);
  doc.circle(auraCircleX, auraCircleY, 12.3, 'S');

  // 3. Moldura dourada externa estrutural
  doc.setDrawColor(ACCENT_GOLD);
  doc.setLineWidth(0.6);
  doc.circle(auraCircleX, auraCircleY, 13.4, 'S');

  // 4. Halo sutil de expansão biofotônica
  doc.setDrawColor(ACCENT_GOLD_LIGHT);
  doc.setLineWidth(0.2);
  doc.circle(auraCircleX, auraCircleY, 14.3, 'S');

  // 5. Pontos cardeais sagrados da moldura (Norte, Sul, Leste, Oeste)
  const dotRadius = 0.5;
  const cardinalDist = 12.85;
  doc.setFillColor(ACCENT_GOLD);
  doc.circle(auraCircleX, auraCircleY - cardinalDist, dotRadius, 'F'); // Top / Norte
  doc.circle(auraCircleX, auraCircleY + cardinalDist, dotRadius, 'F'); // Bottom / Sul
  doc.circle(auraCircleX - cardinalDist, auraCircleY, dotRadius, 'F'); // Left / Oeste
  doc.circle(auraCircleX + cardinalDist, auraCircleY, dotRadius, 'F'); // Right / Leste

  if (!imageRendered) {
    // Sacred concentric geometric aura circles
    doc.setDrawColor(ACCENT_GOLD_LIGHT);
    doc.setLineWidth(0.5);
    doc.circle(auraCircleX, auraCircleY, 9.5, 'S');
    doc.circle(auraCircleX, auraCircleY, 5.5, 'S');
    doc.setFillColor(ACCENT_GOLD);
    doc.circle(auraCircleX, auraCircleY, 2.2, 'F');
  }

  // Banner details on the right
  const auraTextX = margin + 42;
  const auraTextW = contentWidth - 46;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(ACCENT_GOLD);
  doc.text(
    aura.capturedWithCamera 
      ? 'ESPECTRO BIOFOTÔNICO DETECTADO VIA CÂMERA FRONTAL' 
      : 'SINTONIZAÇÃO POR RESSONÂNCIA NUMEROLÓGICA NATAL (OPCIONAL)',
    auraTextX, 
    auraBannerY + 9
  );

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(`Cor Predominante: ${aura.primaryColorName}`, auraTextX, auraBannerY + 16.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(ACCENT_GOLD_LIGHT);
  doc.text(`Arquétipo da Aura: ${aura.auraArchetype}`, auraTextX, auraBannerY + 23, { maxWidth: auraTextW });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(220, 225, 240);
  doc.text(`Frequência de Ressonância: ${aura.frequencyHz}`, auraTextX, auraBannerY + 29.5);
  doc.text(`Alcance do Campo Áurico: ${aura.fieldExpansion}`, auraTextX, auraBannerY + 35);
  doc.text(`Estado Vibracional: ${aura.vibrationalState}`, auraTextX, auraBannerY + 40.5, { maxWidth: auraTextW });

  // Card 1: Análise Aprofundada & Ressonância com Prosperidade (Y = 80, H = 58mm)
  const deepCardY = 80;
  const deepCardH = 58;
  drawCard(margin, deepCardY, contentWidth, deepCardH, true);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.2);
  doc.setTextColor(PRIMARY);
  doc.text('Análise Bioenergética & Interação da Aura com a Prosperidade:', margin + 6, deepCardY + 7.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.0);
  doc.setTextColor(TEXT_DARK);
  const deepLines = doc.splitTextToSize(aura.deepAnalysis, contentWidth - 12);
  doc.text(deepLines, margin + 6, deepCardY + 14);

  // Dynamic subsection for Prosperity Correlation inside Card 1
  const corrBoxY = deepCardY + 14 + Math.min(deepLines.length, 6) * 3.4 + 2;
  doc.setFillColor(253, 248, 232);
  doc.roundedRect(margin + 5, corrBoxY, contentWidth - 10, 16, 1.5, 1.5, 'F');
  doc.setDrawColor(ACCENT_GOLD);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin + 5, corrBoxY, contentWidth - 10, 16, 1.5, 1.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(PRIMARY);
  doc.text('Ímã Bioeletromagnético em Vendas & Negócios:', margin + 8, corrBoxY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(TEXT_DARK);
  const corrLines = doc.splitTextToSize(aura.prosperityCorrelation, contentWidth - 16);
  doc.text(corrLines, margin + 8, corrBoxY + 9.5);

  // Card 2: Protocolo Diário de Blindagem Áurica contra Inveja e Miasmas (Y = 142, H = 58mm)
  const shieldCardY = 142;
  const shieldCardH = 58;
  drawCard(margin, shieldCardY, contentWidth, shieldCardH, false);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.2);
  doc.setTextColor(PRIMARY);
  doc.text('Protocolo Sagrado de Blindagem & Selamento Áurico Diário:', margin + 6, shieldCardY + 7.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.0);
  doc.setTextColor(TEXT_DARK);
  const shieldIntro = 'O campo áurico de pessoas prósperas gera fascínio e, inevitavelmente, atrai ondas de inveja ou miasmas em ambientes competitivos. Abaixo está o seu protocolo personalizado de selamento:';
  const introLines = doc.splitTextToSize(shieldIntro, contentWidth - 12);
  doc.text(introLines, margin + 6, shieldCardY + 13.5);

  // Ritual box inside Card 2
  const ritY = shieldCardY + 23;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin + 5, ritY, contentWidth - 10, 29, 1.5, 1.5, 'F');
  doc.setDrawColor(BORDER_COLOR);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin + 5, ritY, contentWidth - 10, 29, 1.5, 1.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(ACCENT_GOLD);
  doc.text('RITUAL DE SELAMENTO DA CÚPULA BIOFOTÔNICA:', margin + 8, ritY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(TEXT_DARK);
  const ritLines = doc.splitTextToSize(aura.shieldingProtocol, contentWidth - 16);
  doc.text(ritLines, margin + 8, ritY + 12);

  // Card 3: Cristais de Poder & Cromoterapia de Vendas (Y = 204, H = 69mm)
  const crystalCardY = 204;
  const crystalCardH = 69;
  drawCard(margin, crystalCardY, contentWidth, crystalCardH, true);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.2);
  doc.setTextColor(PRIMARY);
  doc.text('Cromoterapia Sagrada & Tríade de Cristais em Ressonância:', margin + 6, crystalCardY + 7.5);

  // 3 Crystal Badges side by side
  const crBoxY = crystalCardY + 12;
  const crGap = 3.5;
  const crBoxW = (contentWidth - 12 - crGap * 2) / 3;

  aura.recommendedCrystals.forEach((crystal, idx) => {
    const cx = margin + 6 + idx * (crBoxW + crGap);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(cx, crBoxY, crBoxW, 23, 1.5, 1.5, 'F');
    doc.setDrawColor(ACCENT_GOLD);
    doc.setLineWidth(0.3);
    doc.roundedRect(cx, crBoxY, crBoxW, 23, 1.5, 1.5, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(ACCENT_GOLD);
    doc.text(`CRISTAL 0${idx + 1}`, cx + 3.5, crBoxY + 5.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(PRIMARY);
    doc.text(crystal, cx + 3.5, crBoxY + 11.5, { maxWidth: crBoxW - 6 });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.8);
    doc.setTextColor(TEXT_MUTED);
    doc.text('Ancoragem & Amplificação', cx + 3.5, crBoxY + 17.5);
  });

  // Clothing & Office guidance box
  const clothBoxY = crystalCardY + 38;
  doc.setFillColor(253, 248, 232);
  doc.roundedRect(margin + 5, clothBoxY, contentWidth - 10, 24, 1.5, 1.5, 'F');
  doc.setDrawColor(ACCENT_GOLD);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin + 5, clothBoxY, contentWidth - 10, 24, 1.5, 1.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.0);
  doc.setTextColor(PRIMARY);
  doc.text('DIRETRIZ DE CROMOTERAPIA PARA DIAS DE REUNIÃO & FECHAMENTO:', margin + 8, clothBoxY + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.6);
  doc.setTextColor(TEXT_DARK);
  const clothLines = doc.splitTextToSize(aura.clothingHarmonization, contentWidth - 16);
  doc.text(clothLines, margin + 8, clothBoxY + 11.5);

  // ==========================================
  // PAGE 6: BANHOS ENERGÉTICOS, CURA SONORA & FREQUÊNCIAS DE LUZ
  // ==========================================
  doc.addPage();
  drawPageHeader(6, '5. Banhos Energéticos & Frequências Quânticas');
  drawPageFooter(6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12.5);
  doc.setTextColor(PRIMARY);
  doc.text('5. BANHOS ENERGÉTICOS ANCESTRAIS & FREQUÊNCIAS DE SINTONIZAÇÃO', margin, 27);

  // 3 Banhos Energéticos (Strictly proportioned so no text ever spills)
  const bathY = 31;
  const bathCardH = 37.5;
  const bathGap = 2.5;

  report.energyBaths.forEach((bath, idx) => {
    const by = bathY + idx * (bathCardH + bathGap);
    const isGold = bath.category === 'prosperidade';
    drawCard(margin, by, contentWidth, bathCardH, isGold);

    // Title & Best Day/Moon
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(isGold ? ACCENT_GOLD : PRIMARY);
    doc.text(bath.title, margin + 6, by + 6.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(TEXT_MUTED);
    doc.text(bath.bestDayAndMoon, pageWidth - margin - 6, by + 6.5, { align: 'right' });

    // Ingredients
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(PRIMARY);
    doc.text('Ingredientes:', margin + 6, by + 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.2);
    doc.setTextColor(TEXT_DARK);
    const ingText = bath.herbsAndIngredients.join('  •  ');
    doc.text(ingText, margin + 28, by + 12, { maxWidth: contentWidth - 36 });

    // Preparation Ritual
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(PRIMARY);
    doc.text('Preparo:', margin + 6, by + 17.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.0);
    doc.setTextColor(TEXT_DARK);
    const prepLines = doc.splitTextToSize(bath.preparationRitual, contentWidth - 30);
    doc.text(prepLines, margin + 24, by + 17.5);

    // Prayer / Affirmation box (Strictly bounded with safe padding)
    const affY = by + 27;
    const affH = 8.5;
    doc.setFillColor(isGold ? 253 : 248, isGold ? 248 : 250, isGold ? 232 : 252);
    doc.roundedRect(margin + 5, affY, contentWidth - 10, affH, 1.5, 1.5, 'F');
    doc.setDrawColor(isGold ? ACCENT_GOLD : BORDER_COLOR);
    doc.setLineWidth(0.2);
    doc.roundedRect(margin + 5, affY, contentWidth - 10, affH, 1.5, 1.5, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(isGold ? ACCENT_GOLD : PRIMARY);
    doc.text('Decreto no Banho:', margin + 7, affY + 5.5);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(5.8);
    doc.setTextColor(TEXT_DARK);
    const prLines = doc.splitTextToSize(bath.prayerOrIntention, contentWidth - 50);
    doc.text(prLines, margin + 42, affY + 5.5);
  });

  // Seção: Frequências Sonoras & Solfeggio Sagrado (Calibrated Table)
  const freqTableY = 153;
  const freqTableH = 124;
  drawCard(margin, freqTableY, contentWidth, freqTableH, true);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(PRIMARY);
  doc.text('Matriz de Sons Sagrados & Frequências Quânticas (Clique para Ouvir no YouTube):', margin + 6, freqTableY + 7.5);

  // Table header
  const thY = freqTableY + 11.5;
  doc.setFillColor(PRIMARY);
  doc.roundedRect(margin + 5, thY, contentWidth - 10, 5.5, 1, 1, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(ACCENT_GOLD_LIGHT);
  doc.text('FREQUÊNCIA / VÍDEO', margin + 7, thY + 3.8);
  doc.text('PROPÓSITO SAGRADO DE ATIVAÇÃO', margin + 34, thY + 3.8);
  doc.text('CHAKRA / VÓRTICE', margin + 116, thY + 3.8);
  doc.text('QUANDO OUVIR', margin + 152, thY + 3.8);

  // 7 Rows of 14mm height each (Total = 98mm, perfectly contained from Y = 171 to 269)
  report.soundFrequencies.forEach((sf, idx) => {
    const rowY = thY + 6.5 + idx * 14.5;
    const rowH = 13.5;
    doc.setFillColor(idx % 2 === 0 ? 255 : 249, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
    doc.roundedRect(margin + 5, rowY, contentWidth - 10, rowH, 0.8, 0.8, 'F');
    doc.setDrawColor(BORDER_COLOR);
    doc.setLineWidth(0.2);
    doc.roundedRect(margin + 5, rowY, contentWidth - 10, rowH, 0.8, 0.8, 'S');

    // YouTube URL resolution (use report value or fallback to curated frequency map)
    const ytInfo = getFrequencyYouTubeInfo(sf.hz);
    const ytUrl = sf.youtubeUrl || ytInfo.url;

    // Hz badge
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.0);
    doc.setTextColor(sf.hz === 528 || sf.hz === 888 ? ACCENT_GOLD : PRIMARY);
    doc.text(`${sf.hz} Hz`, margin + 7, rowY + 5.2);

    // Styled YouTube Button
    const ytBtnX = margin + 6.5;
    const ytBtnY = rowY + 6.8;
    const ytBtnW = 23.5;
    const ytBtnH = 4.8;

    doc.setFillColor(254, 242, 242);
    doc.roundedRect(ytBtnX, ytBtnY, ytBtnW, ytBtnH, 1, 1, 'F');
    doc.setDrawColor(220, 38, 38);
    doc.setLineWidth(0.25);
    doc.roundedRect(ytBtnX, ytBtnY, ytBtnW, ytBtnH, 1, 1, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.0);
    doc.setTextColor(185, 28, 28);
    doc.text('▶ OUVIR VÍDEO', ytBtnX + ytBtnW / 2, ytBtnY + 3.2, { align: 'center' });

    // Clickable links for the button and the Hz label
    doc.link(ytBtnX, ytBtnY, ytBtnW, ytBtnH, { url: ytUrl });
    doc.link(margin + 6, rowY + 1.5, 24, 5.0, { url: ytUrl });

    // Title & purpose (Strictly split to 80mm so it never overflows into next column)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.2);
    doc.setTextColor(PRIMARY);
    doc.text(sf.title, margin + 34, rowY + 4.5, { maxWidth: 80 });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.6);
    doc.setTextColor(TEXT_MUTED);
    const purpLines = doc.splitTextToSize(sf.sacredPurpose, 80);
    doc.text(purpLines, margin + 34, rowY + 8);

    // Chakra / Element (Strictly bounded to 32mm)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.0);
    doc.setTextColor(TEXT_DARK);
    const elemLines = doc.splitTextToSize(sf.element, 32);
    doc.text(elemLines, margin + 116, rowY + 6.5);

    // When to listen (Strictly bounded to 22mm)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.6);
    doc.setTextColor(TEXT_MUTED);
    const whenLines = doc.splitTextToSize(sf.bestListeningTime, 22);
    doc.text(whenLines, margin + 152, rowY + 5.5);
  });

  // ==========================================
  // PAGE 7: SELOS MÍSTICOS, ESCRITURAS BÍBLICAS & CONSAGRAÇÃO FINAL
  // ==========================================
  doc.addPage();
  drawPageHeader(7, '6. Selos Místicos, Promessas Bíblicas & Aliança');
  drawPageFooter(7);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12.5);
  doc.setTextColor(PRIMARY);
  doc.text('6. SELOS SAGRADOS & PROMESSAS BÍBLICAS DE FARTURA MATERIAL', margin, 27);

  // Top Mystic Header with Eye of Providence and Sacred Cross
  const bannerY = 31;
  const bannerTopH = 34;
  doc.setFillColor(PRIMARY);
  doc.roundedRect(margin, bannerY, contentWidth, bannerTopH, 3, 3, 'F');

  // Draw Olho da Providência on left
  drawEyeOfProvidence(margin + 20, bannerY + 17, 10);

  // Draw Sacred Cross with Alpha & Omega on right
  drawSacredCrossWithAlphaOmega(pageWidth - margin - 20, bannerY + 17, 11);

  // Center text in mystical banner
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(ACCENT_GOLD_LIGHT);
  doc.text('ALIANÇA PERPÉTUA DE PROSPERIDADE & PROTEÇÃO DIVINA', centerX, bannerY + 11, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(255, 255, 255);
  doc.text('"O Senhor é o meu pastor; nada me faltará." (Salmo 23:1)', centerX, bannerY + 18, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(ACCENT_GOLD_LIGHT);
  doc.text('"Pois aos seus anjos dará ordens a teu respeito, para que te guardem em todos os teus caminhos." (Salmo 91:11)', centerX, bannerY + 25, { align: 'center' });

  // Scriptures Matrix: 4 Versículos Bíblicos de Prosperidade
  const versesY = 68;
  const versesCardH = 118;
  drawCard(margin, versesY, contentWidth, versesCardH, false);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(PRIMARY);
  doc.text('Fundamentos Bíblicos de Abundância & Sucesso com Justiça:', margin + 6, versesY + 7.5);

  report.sacredSymbolsAndVerses.slice(0, 4).forEach((v, idx) => {
    const vy = versesY + 12 + idx * 26;
    const vBoxH = 24;
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin + 5, vy, contentWidth - 10, vBoxH, 1.5, 1.5, 'F');
    doc.setDrawColor(BORDER_COLOR);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin + 5, vy, contentWidth - 10, vBoxH, 1.5, 1.5, 'S');

    // Reference badge
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(ACCENT_GOLD);
    doc.text(v.biblicalReference, margin + 8, vy + 4.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.0);
    doc.setTextColor(PRIMARY);
    doc.text(`— ${v.symbolName}`, margin + 55, vy + 4.5, { maxWidth: contentWidth - 65 });

    // Scripture Text (Strictly wrapped)
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(6.0);
    doc.setTextColor(TEXT_DARK);
    const txtLines = doc.splitTextToSize(`"${v.scriptureText}"`, contentWidth - 16);
    doc.text(txtLines, margin + 8, vy + 9);

    // Spiritual Meaning / Application (Dynamically sequenced below scripture lines)
    const dynMeanY = vy + 9 + txtLines.length * 2.5 + 1.2;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.8);
    doc.setTextColor(TEXT_MUTED);
    const meanLines = doc.splitTextToSize(`Diretriz Prática: ${v.spiritualMeaning}`, contentWidth - 16);
    doc.text(meanLines, margin + 8, dynMeanY);
  });

  // Ano Pessoal Resumo & Conclusão
  const concY = 189;
  const concH = 48;
  drawCard(margin, concY, contentWidth, concH, true);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.0);
  doc.setTextColor(PRIMARY);
  doc.text(`ANO PESSOAL ${report.personalYear.yearNumber} (${report.personalYear.calendarYear}) & CICLO DE PODER:`, margin + 6, concY + 7);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(ACCENT_GOLD);
  doc.text(report.personalYear.theme, margin + 6, concY + 12.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(TEXT_DARK);
  const yrLines = doc.splitTextToSize(report.personalYear.forecast, contentWidth - 12);
  doc.text(yrLines, margin + 6, concY + 18);

  // Lucky days & Power hours pill box
  doc.setFillColor(243, 229, 171, 0.4);
  doc.roundedRect(margin + 5, concY + 36, contentWidth - 10, 8, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(PRIMARY);
  doc.text(`Dias Favoráveis: ${report.personalYear.luckyDays.join(', ')}   •   Horas de Poder: ${report.personalYear.powerHours}`, margin + 8, concY + 41.5);

  // Pacto de Consagração & Assinatura do Titular
  const pactY = 239;
  const pactH = 34;
  doc.setFillColor(PRIMARY);
  doc.roundedRect(margin, pactY, contentWidth, pactH, 2.5, 2.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.8);
  doc.setTextColor(ACCENT_GOLD);
  doc.text('CONSAGRAÇÃO DA ALIANÇA DE PROSPERIDADE & ASSINATURA DE PODER', centerX, pactY + 6.5, { align: 'center' });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.5);
  doc.setTextColor(240, 245, 255);
  doc.text('"Eu me comprometo a exercer meus talentos com excelência, honrar a Providência Divina e aceitar a fartura sem escassez."', centerX, pactY + 12.0, { align: 'center' });

  // Signature Lines
  const sLineY = pactY + 23;
  doc.setDrawColor(ACCENT_GOLD);
  doc.setLineWidth(0.4);
  doc.line(margin + 12, sLineY, margin + 78, sLineY);
  doc.line(pageWidth - margin - 78, sLineY, pageWidth - margin - 12, sLineY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(ACCENT_GOLD_LIGHT);
  doc.text(report.nameOptimization.suggestedName, margin + 45, sLineY + 4.5, { align: 'center' });
  doc.text('Selo Oficial Pitagórico & Bênção Bíblica', pageWidth - margin - 45, sLineY + 4.5, { align: 'center' });

  // ==========================================
  // PAGE 8: GUIA DE LEITURA INSPIRADORA & MESTRIA MENTAL
  // ==========================================
  doc.addPage();
  drawPageHeader(8, '7. Recomendações de Leitura & Mestria Mental');
  drawPageFooter(8);

  // Intro Header Banner
  const introY = 22;
  const introH = 20;
  doc.setFillColor(PRIMARY);
  doc.roundedRect(margin, introY, contentWidth, introH, 2.5, 2.5, 'F');
  doc.setDrawColor(ACCENT_GOLD);
  doc.setLineWidth(0.35);
  doc.roundedRect(margin, introY, contentWidth, introH, 2.5, 2.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.2);
  doc.setTextColor(ACCENT_GOLD);
  doc.text('BIBLIOTECA DA MESTRIA • LIVROS ESSENCIAIS RECOMENDADOS PARA O SEU MAPA', centerX, introY + 6.2, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(240, 245, 255);
  const introTxt = `A numerologia mapeia a frequência de sua alma; a leitura estratégica equipa sua mente consciente com os modelos práticos de realização. Selecionamos com rigor 3 obras fundamentais de alta voltagem intelectual e espiritual, personalizadas para harmonizar com o seu Caminho de Vida ${report.lifePath.number} e alavancar sua prosperidade:`;
  const splitIntro = doc.splitTextToSize(introTxt, contentWidth - 12);
  doc.text(splitIntro, centerX, introY + 11.2, { align: 'center' });

  // Recommended books tailored to this report (randomized suggestions maintaining at least 3 books)
  const recommendedBooks = (customBooks && customBooks.length >= 3) ? customBooks : getRecommendedBooksForReport(report);
  const booksStartY = 45;
  const bookCardH = 64;
  const bookCardSpacing = 3.5;

  recommendedBooks.forEach((book, index) => {
    const cardY = booksStartY + index * (bookCardH + bookCardSpacing);
    drawCard(margin, cardY, contentWidth, bookCardH);

    // Left: Visual Book Cover Image
    const coverX = margin + 4.5;
    const coverY = cardY + 4.5;
    const coverW = 27;
    const coverH = 41;

    // Generate crisp 300-DPI cover data URL
    let coverLoaded = false;
    try {
      const coverDataUrl = generateBookCoverDataUrl(book, 220, 330);
      if (coverDataUrl) {
        doc.addImage(coverDataUrl, 'PNG', coverX, coverY, coverW, coverH);
        coverLoaded = true;
      }
    } catch (e) {
      console.warn('Could not render cover image in PDF:', e);
    }

    if (!coverLoaded) {
      // Fallback vector book frame
      doc.setFillColor(30, 35, 60);
      doc.roundedRect(coverX, coverY, coverW, coverH, 1.5, 1.5, 'F');
      doc.setDrawColor(ACCENT_GOLD);
      doc.setLineWidth(0.3);
      doc.roundedRect(coverX, coverY, coverW, coverH, 1.5, 1.5, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6);
      doc.setTextColor(ACCENT_GOLD);
      doc.text(book.author.toUpperCase(), coverX + coverW / 2, coverY + 10, { align: 'center' });

      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      const splitTitleFallback = doc.splitTextToSize(book.title.toUpperCase(), coverW - 4);
      doc.text(splitTitleFallback, coverX + coverW / 2, coverY + 22, { align: 'center' });
    }

    // Cover border & 3D shadow frame
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.35);
    doc.roundedRect(coverX, coverY, coverW, coverH, 1, 1, 'S');

    // Bestseller badge below book cover
    const badgeY = cardY + 47.5;
    doc.setFillColor(PRIMARY);
    doc.roundedRect(coverX, badgeY, coverW, 12, 1.5, 1.5, 'F');
    doc.setDrawColor(ACCENT_GOLD);
    doc.setLineWidth(0.25);
    doc.roundedRect(coverX, badgeY, coverW, 12, 1.5, 1.5, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.2);
    doc.setTextColor(ACCENT_GOLD);
    const splitBadge = doc.splitTextToSize(book.bestsellerBadge, coverW - 2);
    doc.text(splitBadge, coverX + coverW / 2, badgeY + 4.5, { align: 'center' });

    // Right: Book Information & Analysis
    const textStartX = margin + 35.5;
    const textWidth = contentWidth - 40; // ~138 mm

    // Row 1: Title & Category Pill
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(PRIMARY);
    doc.text(book.title, textStartX, cardY + 8);

    // Category badge pill on the right
    const pillW = 46;
    const pillH = 5.5;
    const pillX = margin + contentWidth - pillW - 4;
    const pillY = cardY + 4;
    doc.setFillColor(243, 229, 171);
    doc.roundedRect(pillX, pillY, pillW, pillH, 1.2, 1.2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.8);
    doc.setTextColor(140, 95, 10);
    doc.text(book.category, pillX + pillW / 2, pillY + 3.8, { align: 'center' });

    // Row 2: Author & Synergy Subheader
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(ACCENT_GOLD);
    doc.text(`Autor: ${book.author}   •   Sintonizado com: Caminho de Vida ${report.lifePath.number}`, textStartX, cardY + 13.5);

    // Row 3: Como esta leitura ajudará o consulente
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(PRIMARY);
    doc.text('COMO ESTA OBRA POTENCIALIZARÁ O SEU SUCESSO:', textStartX, cardY + 19);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.6);
    doc.setTextColor(TEXT_DARK);
    const whyLines = doc.splitTextToSize(book.whyItHelps, textWidth);
    doc.text(whyLines, textStartX, cardY + 23.5);

    // Row 4: Sinergia Numerológica & Análise do Caso
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(150, 100, 15);
    doc.text('Análise Vibracional:', textStartX, cardY + 35);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.4);
    doc.setTextColor(TEXT_DARK);
    const synergyLines = doc.splitTextToSize(book.synergyReason, textWidth - 28);
    doc.text(synergyLines, textStartX + 26, cardY + 35);

    // Row 5: Chave Prática Imediata (Gold/Alchemical Box)
    const keyBoxY = cardY + 44.5;
    const keyBoxH = 15;
    doc.setFillColor(254, 252, 243);
    doc.roundedRect(textStartX, keyBoxY, textWidth, keyBoxH, 1.5, 1.5, 'F');
    doc.setDrawColor(243, 229, 171);
    doc.setLineWidth(0.3);
    doc.roundedRect(textStartX, keyBoxY, textWidth, keyBoxH, 1.5, 1.5, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.3);
    doc.setTextColor(160, 110, 10);
    doc.text('⚡ CHAVE DE APLICAÇÃO PRÁTICA IMEDIATA:', textStartX + 3, keyBoxY + 4.5);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(6.2);
    doc.setTextColor(TEXT_DARK);
    const keyLines = doc.splitTextToSize(book.practicalKey, textWidth - 6);
    doc.text(keyLines, textStartX + 3, keyBoxY + 8.8);
  });

  // Bottom Ritual Banner
  const ritualY = 248;
  const ritualH = 26;
  doc.setFillColor(PRIMARY);
  doc.roundedRect(margin, ritualY, contentWidth, ritualH, 2.5, 2.5, 'F');
  doc.setDrawColor(ACCENT_GOLD);
  doc.setLineWidth(0.35);
  doc.roundedRect(margin, ritualY, contentWidth, ritualH, 2.5, 2.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.8);
  doc.setTextColor(ACCENT_GOLD);
  doc.text('RITUAL DE LEITURA TRANSFORMADORA & FIXAÇÃO DA PROSPERIDADE', centerX, ritualY + 6.5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.6);
  doc.setTextColor(240, 245, 255);
  const ritualTxt = "Reserve de 15 a 20 minutos ininterruptos todos os dias para se nutrir destas páginas, preferencialmente logo ao acordar ou minutos antes de dormir. Nestes momentos, suas ondas cerebrais operam em frequências Alfa/Theta, permitindo que os arquétipos de sabedoria e as leis de prosperidade penetrem direto no seu subconsciente, expulsando crenças de escassez e acelerando suas realizações.";
  const splitRitual = doc.splitTextToSize(ritualTxt, contentWidth - 14);
  doc.text(splitRitual, centerX, ritualY + 12.5, { align: 'center' });

  // Save the complete document
  const fileName = `Mapa-Numerologico-${report.user.fullName.replace(/\s+/g, '-')}-Completo.pdf`;
  doc.save(fileName);
}
