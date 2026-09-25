import jsPDF from 'jspdf';
import { NumerologyReport } from '../types';
import { ACCENT_GOLD, ACCENT_GOLD_LIGHT, PRIMARY, drawEsotericWatermark } from './pdfWatermarks';

export interface PageRenderContext {
  pageWidth: number;
  pageHeight: number;
  margin: number;
  contentWidth: number;
  drawPageHeader: (pageNum: number, sectionTitle: string) => void;
  drawPageFooter: (pageNum: number) => void;
  drawCard: (x: number, y: number, w: number, h: number, goldAccent?: boolean, bgColor?: string) => void;
}

const TEXT_DARK = '#2C3E50';
const TEXT_MUTED = '#5A6B82';
const BG_CARD = '#FFFFFF';

/**
 * PAGE 2: SÍNTESE DA ESSÊNCIA & CAMINHO DE VIDA (O GRANDE PROPÓSITO)
 */
export const renderPage2 = (doc: jsPDF, report: NumerologyReport, ctx: PageRenderContext) => {
  const pageNum = 2;
  doc.addPage();
  drawEsotericWatermark(doc, pageNum, ctx.pageWidth);
  ctx.drawPageHeader(pageNum, '1. Síntese da Essência & Caminho de Vida');
  ctx.drawPageFooter(pageNum);

  // Section Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14.5);
  doc.setTextColor(PRIMARY);
  doc.text('1. SÍNTESE DA ESSÊNCIA & CAMINHO DE VIDA', ctx.margin, 25);

  // CARD 1: CAMINHO DE VIDA (Grande Propósito Cósmico)
  const c1Y = 30;
  const c1H = 136;
  ctx.drawCard(ctx.margin, c1Y, ctx.contentWidth, c1H, true);

  // Number Badge Circle
  doc.setFillColor(PRIMARY);
  doc.circle(ctx.margin + 16, c1Y + 16, 11, 'F');
  doc.setDrawColor(ACCENT_GOLD);
  doc.setLineWidth(0.6);
  doc.circle(ctx.margin + 16, c1Y + 16, 11, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.setTextColor(ACCENT_GOLD);
  doc.text(String(report.lifePath.number), ctx.margin + 16, c1Y + 21.5, { align: 'center' });

  // Title & Archetype
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13.5);
  doc.setTextColor(PRIMARY);
  doc.text(`Caminho de Vida ${report.lifePath.number}: ${report.lifePath.name}`, ctx.margin + 32, c1Y + 13);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(140, 95, 10);
  doc.text(`Arquétipo Central: ${report.lifePath.archetype}`, ctx.margin + 32, c1Y + 19.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(TEXT_MUTED);
  doc.text(`Cálculo da Data de Nascimento: ${report.lifePath.calculationExplanation}`, ctx.margin + 32, c1Y + 25.5);

  // Divider
  doc.setDrawColor(220, 226, 238);
  doc.setLineWidth(0.3);
  doc.line(ctx.margin + 8, c1Y + 29.5, ctx.pageWidth - ctx.margin - 8, c1Y + 29.5);

  // Essence Text in 10px Font (Explicação equilibrada para caber no quadro)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(TEXT_DARK);
  const lpEssenceLines = doc.splitTextToSize(report.lifePath.essence, ctx.contentWidth - 16);
  doc.text(lpEssenceLines, ctx.margin + 8, c1Y + 36, { lineHeightFactor: 1.28 });

  // Strengths & Challenges Boxes
  const splitY = c1Y + 62;
  const colW = (ctx.contentWidth - 20) / 2;

  // Strengths Box
  doc.setFillColor(243, 248, 245);
  doc.roundedRect(ctx.margin + 8, splitY, colW, 38, 2, 2, 'F');
  doc.setDrawColor(46, 125, 50);
  doc.setLineWidth(0.3);
  doc.roundedRect(ctx.margin + 8, splitY, colW, 38, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(46, 125, 50);
  doc.text('FORÇAS INATAS DE SUCESSO:', ctx.margin + 12, splitY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(TEXT_DARK);
  let strY = splitY + 13;
  report.lifePath.strengths.slice(0, 3).forEach((s) => {
    const sLines = doc.splitTextToSize(`• ${s}`, colW - 8);
    doc.text(sLines, ctx.margin + 12, strY, { lineHeightFactor: 1.22 });
    strY += sLines.length * 3.8 + 1;
  });

  // Challenges Box
  doc.setFillColor(253, 246, 246);
  doc.roundedRect(ctx.margin + 12 + colW, splitY, colW, 38, 2, 2, 'F');
  doc.setDrawColor(198, 40, 40);
  doc.setLineWidth(0.3);
  doc.roundedRect(ctx.margin + 12 + colW, splitY, colW, 38, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(198, 40, 40);
  doc.text('DESAFIOS A NEUTRALIZAR:', ctx.margin + 16 + colW, splitY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(TEXT_DARK);
  let chY = splitY + 13;
  report.lifePath.challenges.slice(0, 3).forEach((c) => {
    const cLines = doc.splitTextToSize(`• ${c}`, colW - 8);
    doc.text(cLines, ctx.margin + 16 + colW, chY, { lineHeightFactor: 1.22 });
    chY += cLines.length * 3.8 + 1;
  });

  // Bottom Prosperity Pill
  const pillY = c1Y + 105;
  doc.setFillColor(254, 249, 235);
  doc.roundedRect(ctx.margin + 8, pillY, ctx.contentWidth - 16, 24, 2, 2, 'F');
  doc.setDrawColor(ACCENT_GOLD);
  doc.setLineWidth(0.4);
  doc.roundedRect(ctx.margin + 8, pillY, ctx.contentWidth - 16, 24, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(140, 95, 10);
  doc.text('DIRETRIZ DE PROSPERIDADE:', ctx.margin + 12, pillY + 7);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9.5);
  doc.setTextColor(TEXT_DARK);
  const pLines = doc.splitTextToSize(report.lifePath.prosperityImpact, ctx.contentWidth - 24);
  doc.text(pLines, ctx.margin + 12, pillY + 14, { lineHeightFactor: 1.25 });

  // CARD 2: DESEJO DA ALMA (O que pulsa no íntimo)
  const c2Y = 171;
  const c2H = 98;
  ctx.drawCard(ctx.margin, c2Y, ctx.contentWidth, c2H, true);

  // Soul Urge Badge
  doc.setFillColor(PRIMARY);
  doc.circle(ctx.margin + 16, c2Y + 16, 11, 'F');
  doc.setDrawColor(ACCENT_GOLD);
  doc.setLineWidth(0.6);
  doc.circle(ctx.margin + 16, c2Y + 16, 11, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.setTextColor(ACCENT_GOLD);
  doc.text(String(report.soulUrge.number), ctx.margin + 16, c2Y + 21.5, { align: 'center' });

  // Title & Archetype
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13.5);
  doc.setTextColor(PRIMARY);
  doc.text(`Desejo da Alma ${report.soulUrge.number}: ${report.soulUrge.archetype}`, ctx.margin + 32, c2Y + 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(TEXT_MUTED);
  doc.text(`Soma das Vogais do Nome: ${report.soulUrge.calculationExplanation}`, ctx.margin + 32, c2Y + 20);

  // Divider
  doc.setDrawColor(220, 226, 238);
  doc.setLineWidth(0.3);
  doc.line(ctx.margin + 8, c2Y + 24.5, ctx.pageWidth - ctx.margin - 8, c2Y + 24.5);

  // Soul Urge Essence in 10px Font
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(TEXT_DARK);
  const suEssenceLines = doc.splitTextToSize(report.soulUrge.essence, ctx.contentWidth - 16);
  doc.text(suEssenceLines, ctx.margin + 8, c2Y + 32, { lineHeightFactor: 1.28 });

  // Sacred Motivation Box
  const suBoxY = c2Y + 60;
  doc.setFillColor(248, 245, 255);
  doc.roundedRect(ctx.margin + 8, suBoxY, ctx.contentWidth - 16, 30, 2, 2, 'F');
  doc.setDrawColor(120, 80, 200);
  doc.setLineWidth(0.35);
  doc.roundedRect(ctx.margin + 8, suBoxY, ctx.contentWidth - 16, 30, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(120, 80, 200);
  doc.text('MOTIVAÇÃO SAGRADA & REALIZAÇÃO ÍNTIMA:', ctx.margin + 12, suBoxY + 7);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9.5);
  doc.setTextColor(TEXT_DARK);
  const suImpLines = doc.splitTextToSize(report.soulUrge.prosperityImpact, ctx.contentWidth - 24);
  doc.text(suImpLines, ctx.margin + 12, suBoxY + 14, { lineHeightFactor: 1.25 });
};

/**
 * PAGE 3: PERSONALIDADE EXTERNA, EXPRESSÃO & SÍNTESE INTEGRADA
 */
export const renderPage3 = (doc: jsPDF, report: NumerologyReport, ctx: PageRenderContext) => {
  const pageNum = 3;
  doc.addPage();
  drawEsotericWatermark(doc, pageNum, ctx.pageWidth);
  ctx.drawPageHeader(pageNum, '2. Personalidade Externa & Expressão da Alma');
  ctx.drawPageFooter(pageNum);

  // Section Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14.5);
  doc.setTextColor(PRIMARY);
  doc.text('2. PERSONALIDADE EXTERNA & EXPRESSÃO DA ALMA', ctx.margin, 25);

  // CARD 1: PERSONALIDADE EXTERNA
  const p1Y = 30;
  const p1H = 74;
  ctx.drawCard(ctx.margin, p1Y, ctx.contentWidth, p1H, true);

  doc.setFillColor(PRIMARY);
  doc.circle(ctx.margin + 14, p1Y + 14, 9.5, 'F');
  doc.setDrawColor(ACCENT_GOLD);
  doc.setLineWidth(0.5);
  doc.circle(ctx.margin + 14, p1Y + 14, 9.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(ACCENT_GOLD);
  doc.text(String(report.personality.number), ctx.margin + 14, p1Y + 19, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(PRIMARY);
  doc.text(`Personalidade Externa ${report.personality.number}: ${report.personality.archetype}`, ctx.margin + 28, p1Y + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(TEXT_MUTED);
  doc.text(`Soma das Consoantes do Nome: ${report.personality.calculationExplanation}`, ctx.margin + 28, p1Y + 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(TEXT_DARK);
  const pLines = doc.splitTextToSize(report.personality.essence, ctx.contentWidth - 16);
  doc.text(pLines, ctx.margin + 8, p1Y + 27, { lineHeightFactor: 1.28 });

  // Sub-box Social Magnetism
  const pBoxY = p1Y + 48;
  doc.setFillColor(243, 248, 255);
  doc.roundedRect(ctx.margin + 8, pBoxY, ctx.contentWidth - 16, 21, 1.5, 1.5, 'F');
  doc.setDrawColor(180, 205, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(ctx.margin + 8, pBoxY, ctx.contentWidth - 16, 21, 1.5, 1.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(30, 80, 160);
  doc.text('IMPRESSÃO MAGNÉTICA SOCIAL & NEGOCIAÇÕES:', ctx.margin + 12, pBoxY + 6.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(TEXT_DARK);
  const attrText = `Atributos dominantes: ${report.personality.strengths.slice(0, 3).join('  •  ')}`;
  const attrLines = doc.splitTextToSize(attrText, ctx.contentWidth - 24);
  doc.text(attrLines, ctx.margin + 12, pBoxY + 13.5, { lineHeightFactor: 1.22 });

  // CARD 2: NÚMERO DE EXPRESSÃO
  const expY = 110;
  const expH = 76;
  ctx.drawCard(ctx.margin, expY, ctx.contentWidth, expH, true);

  doc.setFillColor(PRIMARY);
  doc.circle(ctx.margin + 14, expY + 14, 9.5, 'F');
  doc.setDrawColor(ACCENT_GOLD);
  doc.setLineWidth(0.5);
  doc.circle(ctx.margin + 14, expY + 14, 9.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(ACCENT_GOLD);
  doc.text(String(report.expression.number), ctx.margin + 14, expY + 19, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(PRIMARY);
  doc.text(`Número de Expressão ${report.expression.number}: ${report.expression.name}`, ctx.margin + 28, expY + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(TEXT_MUTED);
  doc.text(`Soma de Todas as Letras do Nome: ${report.expression.calculationExplanation}`, ctx.margin + 28, expY + 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(TEXT_DARK);
  const expLines = doc.splitTextToSize(report.expression.essence, ctx.contentWidth - 16);
  doc.text(expLines, ctx.margin + 8, expY + 27, { lineHeightFactor: 1.28 });

  // Sub-box Talents
  const expBoxY = expY + 49;
  doc.setFillColor(254, 249, 235);
  doc.roundedRect(ctx.margin + 8, expBoxY, ctx.contentWidth - 16, 21, 1.5, 1.5, 'F');
  doc.setDrawColor(ACCENT_GOLD);
  doc.setLineWidth(0.35);
  doc.roundedRect(ctx.margin + 8, expBoxY, ctx.contentWidth - 16, 21, 1.5, 1.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(140, 95, 10);
  doc.text('TALENTOS CHAVE DE MONETIZAÇÃO & CARREIRA:', ctx.margin + 12, expBoxY + 6.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(TEXT_DARK);
  const expTalText = `Competências superiores: ${report.expression.strengths.slice(0, 3).join('  •  ')}`;
  const expTalLines = doc.splitTextToSize(expTalText, ctx.contentWidth - 24);
  doc.text(expTalLines, ctx.margin + 12, expBoxY + 13.5, { lineHeightFactor: 1.22 });

  // CARD 3: SÍNTESE INTEGRADA DA ALMA
  const syntY = 192;
  const syntH = 80;
  ctx.drawCard(ctx.margin, syntY, ctx.contentWidth, syntH, true, '#16192E');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12.5);
  doc.setTextColor(ACCENT_GOLD);
  doc.text('✦ SÍNTESE INTEGRADA DOS VETORES CENTRAIS DA ALMA ✦', ctx.pageWidth / 2, syntY + 13, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(240, 245, 255);
  const syntText = [
    `A sua vibração resulta da perfeita orquestração entre o Caminho de Vida ${report.lifePath.number} (o destino a trilhar), a Expressão ${report.expression.number} (seus veículos práticos de realização) e o Desejo da Alma ${report.soulUrge.number} (sua verdade mais íntima).`,
    "",
    "Quando suas decisões diárias honram a coragem e a sabedoria destes números sem se curvar a crenças limitantes herdadas, seu campo eletromagnético se torna um poderoso dínamo de atração para relacionamentos prósperos, contratos nobres e abundância contínua."
  ].join('\n');

  const syntLines = doc.splitTextToSize(syntText, ctx.contentWidth - 20);
  doc.text(syntLines, ctx.margin + 10, syntY + 23, { lineHeightFactor: 1.3 });
};

/**
 * PAGE 4: DIAGNÓSTICO DE PROSPERIDADE & OS 6 NÚMEROS SAGRADOS DA SORTE (01 A 60)
 */
export const renderPage4 = (doc: jsPDF, report: NumerologyReport, ctx: PageRenderContext) => {
  const pageNum = 4;
  doc.addPage();
  drawEsotericWatermark(doc, pageNum, ctx.pageWidth);
  ctx.drawPageHeader(pageNum, '3. Diagnóstico de Prosperidade & 6 Números da Sorte');
  ctx.drawPageFooter(pageNum);

  // Section Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14.5);
  doc.setTextColor(PRIMARY);
  doc.text('3. DIAGNÓSTICO DE PROSPERIDADE & NÚMEROS DA SORTE', ctx.margin, 25);

  // BANNER: SCORE DE PROSPERIDADE
  const scY = 30;
  const scH = 52;
  doc.setFillColor(PRIMARY);
  doc.roundedRect(ctx.margin, scY, ctx.contentWidth, scH, 2.5, 2.5, 'F');
  doc.setDrawColor(ACCENT_GOLD);
  doc.setLineWidth(0.6);
  doc.roundedRect(ctx.margin, scY, ctx.contentWidth, scH, 2.5, 2.5, 'S');

  // Score Circle
  doc.setFillColor(26, 30, 56);
  doc.circle(ctx.margin + 20, scY + 26, 17, 'F');
  doc.setDrawColor(ACCENT_GOLD);
  doc.setLineWidth(0.8);
  doc.circle(ctx.margin + 20, scY + 26, 17, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(ACCENT_GOLD);
  doc.text(`${report.prosperity.score}%`, ctx.margin + 20, scY + 30, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(ACCENT_GOLD_LIGHT);
  doc.text('SCORE VIBRACIONAL', ctx.margin + 20, scY + 37, { align: 'center' });

  // Archetype & Potential
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text(`Arquétipo de Riqueza: ${report.prosperity.archetype}`, ctx.margin + 44, scY + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(230, 235, 245);
  const potLines = doc.splitTextToSize(report.prosperity.abundancePotential, ctx.contentWidth - 52);
  doc.text(potLines, ctx.margin + 44, scY + 22, { lineHeightFactor: 1.25 });

  // CARD 2: OS 6 NÚMEROS SAGRADOS DA SORTE DO SEMESTRE (01 A 60)
  const lkY = 88;
  const lkH = 88;
  ctx.drawCard(ctx.margin, lkY, ctx.contentWidth, lkH, true, '#0E1022');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(ACCENT_GOLD);
  const semTitle = `✦ SEIS NÚMEROS SAGRADOS DA SORTE (${report.semesterLuckyNumbers.semesterLabel.toUpperCase()}) ✦`;
  doc.text(semTitle, ctx.pageWidth / 2, lkY + 13, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(210, 218, 235);
  doc.text('Sintonização Quântica Calibrada de 01 a 60 para Loterias, Investimentos e Decisões', ctx.pageWidth / 2, lkY + 20, { align: 'center' });

  // 6 Golden Lottery Spheres
  const numArr = report.semesterLuckyNumbers.numbers;
  const sphereCount = numArr.length;
  const sphereSpacing = (ctx.contentWidth - 24) / sphereCount;
  const sphereY = lkY + 41;

  numArr.forEach((num, idx) => {
    const sX = ctx.margin + 12 + idx * sphereSpacing + sphereSpacing / 2;

    // Glowing outer ring
    doc.setDrawColor(ACCENT_GOLD_LIGHT);
    doc.setLineWidth(0.3);
    doc.circle(sX, sphereY, 11.5, 'S');

    // Sphere fill
    doc.setFillColor(24, 28, 52);
    doc.circle(sX, sphereY, 10, 'F');
    doc.setDrawColor(ACCENT_GOLD);
    doc.setLineWidth(0.7);
    doc.circle(sX, sphereY, 10, 'S');

    // Inner highlight
    doc.setFillColor(42, 48, 86);
    doc.circle(sX - 3, sphereY - 3, 2.8, 'F');

    // Number text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(ACCENT_GOLD_LIGHT);
    const numStr = String(num).padStart(2, '0');
    doc.text(numStr, sX, sphereY + 4.5, { align: 'center' });
  });

  // Best days pill
  const bestY = lkY + 60;
  doc.setFillColor(22, 26, 48);
  doc.roundedRect(ctx.margin + 12, bestY, ctx.contentWidth - 24, 21, 2, 2, 'F');
  doc.setDrawColor(ACCENT_GOLD);
  doc.setLineWidth(0.35);
  doc.roundedRect(ctx.margin + 12, bestY, ctx.contentWidth - 24, 21, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(ACCENT_GOLD);
  doc.text(`Dias de Maior Vibração Cósmica: ${report.semesterLuckyNumbers.bestDays.join('  •  ')}`, ctx.pageWidth / 2, bestY + 7.5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(230, 235, 245);
  doc.text('Utilize estes números com intenção de bênção e multiplicação para jogos da Mega-Sena e apostas conscientes.', ctx.pageWidth / 2, bestY + 15, { align: 'center' });

  // CARD 3: PROTOCOLO DE ATIVAÇÃO DOS NÚMEROS DA SORTE
  const actY = 182;
  const actH = 90;
  ctx.drawCard(ctx.margin, actY, ctx.contentWidth, actH, true);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12.5);
  doc.setTextColor(PRIMARY);
  doc.text('Protocolo de Ativação Quântica dos Seus Números da Sorte:', ctx.margin + 10, actY + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(TEXT_DARK);
  const actText = [
    "1. Conexão e Intenção: Antes de marcar seus volantes ou assinar contratos, respire profundamente por 3 ciclos e visualize a sensação de prosperidade plena e paz financeira.",
    "",
    "2. O Momento Cósmico: Dê preferência aos seus dias favoráveis da semana e nunca aposte em momentos de desespero ou raiva, pois a escassez atrai escassez.",
    "",
    "3. O Decreto de Gratidão: Afirme mentalmente: 'Recebo a abundância divina com sabedoria, alegria e generosidade. Que estes números abençoem minha família e o mundo.'"
  ].join('\n');

  const actLines = doc.splitTextToSize(actText, ctx.contentWidth - 20);
  doc.text(actLines, ctx.margin + 10, actY + 21, { lineHeightFactor: 1.28 });
};

/**
 * PAGE 5: DESBLOQUEIO FINANCEIRO, SUPERPODERES & CÓDIGOS SAGRADOS
 */
export const renderPage5 = (doc: jsPDF, report: NumerologyReport, ctx: PageRenderContext) => {
  const pageNum = 5;
  doc.addPage();
  drawEsotericWatermark(doc, pageNum, ctx.pageWidth);
  ctx.drawPageHeader(pageNum, '4. Desbloqueio Financeiro & Códigos Quânticos');
  ctx.drawPageFooter(pageNum);

  // Section Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14.5);
  doc.setTextColor(PRIMARY);
  doc.text('4. DESBLOQUEIO DE LIMITAÇÕES & CÓDIGOS SAGRADOS', ctx.margin, 25);

  // CARD 1: BLOQUEIOS IDENTIFICADOS A NEUTRALIZAR
  const b1Y = 30;
  const b1H = 78;
  ctx.drawCard(ctx.margin, b1Y, ctx.contentWidth, b1H, true);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12.5);
  doc.setTextColor(198, 40, 40);
  doc.text('Padrões Limitantes & Crenças Hereditárias a Neutralizar:', ctx.margin + 10, b1Y + 11);

  report.prosperity.financialBlocks.slice(0, 3).forEach((block, idx) => {
    const boxY = b1Y + 16 + idx * 19.5;
    doc.setFillColor(253, 246, 246);
    doc.roundedRect(ctx.margin + 8, boxY, ctx.contentWidth - 16, 17, 1.5, 1.5, 'F');
    doc.setDrawColor(230, 150, 150);
    doc.setLineWidth(0.25);
    doc.roundedRect(ctx.margin + 8, boxY, ctx.contentWidth - 16, 17, 1.5, 1.5, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(198, 40, 40);
    doc.text(`[Bloqueio 0${idx + 1}]`, ctx.margin + 12, boxY + 6.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(TEXT_DARK);
    const bLines = doc.splitTextToSize(block, ctx.contentWidth - 46);
    doc.text(bLines, ctx.margin + 36, boxY + 6.5, { lineHeightFactor: 1.22 });
  });

  // CARD 2: SUPERPODERES DE MONETIZAÇÃO
  const s2Y = 112;
  const s2H = 78;
  ctx.drawCard(ctx.margin, s2Y, ctx.contentWidth, s2H, true);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12.5);
  doc.setTextColor(46, 125, 50);
  doc.text('Superpoderes de Monetização & Oportunidades de Alta Renda:', ctx.margin + 10, s2Y + 11);

  report.prosperity.monetizationSuperpowers.slice(0, 3).forEach((power, idx) => {
    const boxY = s2Y + 16 + idx * 19.5;
    doc.setFillColor(243, 248, 245);
    doc.roundedRect(ctx.margin + 8, boxY, ctx.contentWidth - 16, 17, 1.5, 1.5, 'F');
    doc.setDrawColor(150, 210, 160);
    doc.setLineWidth(0.25);
    doc.roundedRect(ctx.margin + 8, boxY, ctx.contentWidth - 16, 17, 1.5, 1.5, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(46, 125, 50);
    doc.text(`[Ativo 0${idx + 1}]`, ctx.margin + 12, boxY + 6.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(TEXT_DARK);
    const pLines = doc.splitTextToSize(power, ctx.contentWidth - 44);
    doc.text(pLines, ctx.margin + 34, boxY + 6.5, { lineHeightFactor: 1.22 });
  });

  // CARD 3: CÓDIGOS NUMÉRICOS SAGRADOS DE ATIVAÇÃO
  const c3Y = 194;
  const c3H = 78;
  ctx.drawCard(ctx.margin, c3Y, ctx.contentWidth, c3H, true, '#101328');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12.5);
  doc.setTextColor(ACCENT_GOLD);
  doc.text('✦ Códigos Sagrados de Reprogramação Quântica (Grabovoi / Agesta) ✦', ctx.pageWidth / 2, c3Y + 12, { align: 'center' });

  const cBoxW = (ctx.contentWidth - 24) / 3;
  report.prosperity.sacredCodes.slice(0, 3).forEach((code, idx) => {
    const cbX = ctx.margin + 8 + idx * (cBoxW + 4);
    const cbY = c3Y + 18;
    doc.setFillColor(22, 26, 52);
    doc.roundedRect(cbX, cbY, cBoxW, 52, 2, 2, 'F');
    doc.setDrawColor(ACCENT_GOLD);
    doc.setLineWidth(0.35);
    doc.roundedRect(cbX, cbY, cBoxW, 52, 2, 2, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(ACCENT_GOLD_LIGHT);
    doc.text(code.code, cbX + cBoxW / 2, cbY + 11, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(code.purpose, cbX + cBoxW / 2, cbY + 18, { align: 'center' });

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(210, 218, 235);
    const manLines = doc.splitTextToSize(code.mantra, cBoxW - 6);
    doc.text(manLines, cbX + cBoxW / 2, cbY + 26, { align: 'center', lineHeightFactor: 1.22 });
  });
};

/**
 * PAGE 6: OTIMIZAÇÃO VIBRACIONAL DO NOME & TABELA PITAGÓRICA
 */
export const renderPage6 = (doc: jsPDF, report: NumerologyReport, ctx: PageRenderContext) => {
  const pageNum = 6;
  doc.addPage();
  drawEsotericWatermark(doc, pageNum, ctx.pageWidth);
  ctx.drawPageHeader(pageNum, '5. Otimização do Nome & Tabela Pitagórica');
  ctx.drawPageFooter(pageNum);

  // Section Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14.5);
  doc.setTextColor(PRIMARY);
  doc.text('5. OTIMIZAÇÃO VIBRACIONAL DO NOME & TABELA PITAGÓRICA', ctx.margin, 25);

  // TABELA PITAGÓRICA
  const tbY = 30;
  const tbH = 46;
  ctx.drawCard(ctx.margin, tbY, ctx.contentWidth, tbH, true);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.setTextColor(PRIMARY);
  doc.text('Matriz Pitagórica de Conversão Numérica Sagrada:', ctx.margin + 10, tbY + 9);

  const cols = 9;
  const colW = (ctx.contentWidth - 16) / cols;
  const pyth = [
    { n: 1, l: 'A, J, S' }, { n: 2, l: 'B, K, T' }, { n: 3, l: 'C, L, U' },
    { n: 4, l: 'D, M, V' }, { n: 5, l: 'E, N, W' }, { n: 6, l: 'F, O, X' },
    { n: 7, l: 'G, P, Y' }, { n: 8, l: 'H, Q, Z' }, { n: 9, l: 'I, R' }
  ];

  pyth.forEach((item, idx) => {
    const cX = ctx.margin + 8 + idx * colW;
    const cY = tbY + 15;
    doc.setFillColor(item.n === 8 ? '#FAF0D7' : '#F4F6FB');
    doc.roundedRect(cX, cY, colW - 2, 24, 1.5, 1.5, 'F');
    doc.setDrawColor(item.n === 8 ? ACCENT_GOLD : '#D2DAEB');
    doc.setLineWidth(item.n === 8 ? 0.6 : 0.25);
    doc.roundedRect(cX, cY, colW - 2, 24, 1.5, 1.5, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12.5);
    doc.setTextColor(item.n === 8 ? '#8C5F0A' : PRIMARY);
    doc.text(String(item.n), cX + (colW - 2) / 2, cY + 8.5, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(TEXT_DARK);
    doc.text(item.l, cX + (colW - 2) / 2, cY + 18, { align: 'center' });
  });

  // COMPARATIVO DO NOME ATUAL VS OTIMIZADO
  const cmpY = 82;
  const cmpH = 64;
  doc.setFillColor(PRIMARY);
  doc.roundedRect(ctx.margin, cmpY, ctx.contentWidth, cmpH, 2.5, 2.5, 'F');
  doc.setDrawColor(ACCENT_GOLD);
  doc.setLineWidth(0.6);
  doc.roundedRect(ctx.margin, cmpY, ctx.contentWidth, cmpH, 2.5, 2.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12.5);
  doc.setTextColor(ACCENT_GOLD);
  doc.text('✦ Transmutação para a Vibração 8 (O Soberano da Riqueza) ✦', ctx.pageWidth / 2, cmpY + 11.5, { align: 'center' });

  // Current Expression Badge
  const curX = ctx.margin + 20;
  doc.setFillColor(26, 30, 56);
  doc.roundedRect(curX, cmpY + 18, 52, 37, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(200, 210, 230);
  doc.text('EXPRESSÃO ATUAL', curX + 26, cmpY + 26, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text(String(report.expression.number), curX + 26, cmpY + 43, { align: 'center' });

  // Transformation Arrow
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(ACCENT_GOLD);
  doc.text('➔', ctx.pageWidth / 2, cmpY + 40, { align: 'center' });

  // Optimized Expression Badge
  const optX = ctx.pageWidth - ctx.margin - 72;
  doc.setFillColor(36, 42, 78);
  doc.roundedRect(optX, cmpY + 18, 52, 37, 2, 2, 'F');
  doc.setDrawColor(ACCENT_GOLD);
  doc.setLineWidth(0.5);
  doc.roundedRect(optX, cmpY + 18, 52, 37, 2, 2, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(ACCENT_GOLD_LIGHT);
  doc.text('EXPRESSÃO OTIMIZADA', optX + 26, cmpY + 26, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(ACCENT_GOLD);
  doc.text('8', optX + 26, cmpY + 44, { align: 'center' });

  // CARD 3: FUNDAMENTO METAFÍSICO DA TRANSMUTAÇÃO
  const fndY = 152;
  const fndH = 120;
  ctx.drawCard(ctx.margin, fndY, ctx.contentWidth, fndH, true);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12.5);
  doc.setTextColor(PRIMARY);
  doc.text('Fundamento da Transmutação para a Frequência 8 da Prosperidade:', ctx.margin + 10, fndY + 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(TEXT_DARK);
  const fndText = [
    report.nameOptimization.metaphysicalRationale,
    "",
    `Nome Otimizado Recomendado: ${report.nameOptimization.suggestedName}`,
    `Ajuste Fonético Sugerido: Inclusão da letra ou duplicação '${report.nameOptimization.letterToAdd}' para sintonizar a soma 8.`,
    "",
    "Como Utilizar seu Nome Otimizado:",
    "• Em cartões de visita, redes sociais (LinkedIn, Instagram) e assinatura profissional.",
    "• Não é necessário alterar sua certidão de nascimento civil; o subconsciente e o cosmos respondem diretamente ao nome social e à assinatura que você emprega com intenção de poder."
  ].join('\n');

  const fndLines = doc.splitTextToSize(fndText, ctx.contentWidth - 20);
  doc.text(fndLines, ctx.margin + 10, fndY + 22, { lineHeightFactor: 1.28 });
};

/**
 * PAGE 7: MANUAL DA ASSINATURA DE PODER & RITUAL DE 21 DIAS
 */
export const renderPage7 = (doc: jsPDF, report: NumerologyReport, ctx: PageRenderContext) => {
  const pageNum = 7;
  doc.addPage();
  drawEsotericWatermark(doc, pageNum, ctx.pageWidth);
  ctx.drawPageHeader(pageNum, '6. Assinatura de Poder & Ritual de 21 Dias');
  ctx.drawPageFooter(pageNum);

  // Section Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14.5);
  doc.setTextColor(PRIMARY);
  doc.text('6. MANUAL DA ASSINATURA DE PODER & RITUAL DE 21 DIAS', ctx.margin, 25);

  // CARD 1: AS 3 LEIS SAGRADAS DA ASSINATURA PRÓSPERA
  const a1Y = 30;
  const a1H = 96;
  ctx.drawCard(ctx.margin, a1Y, ctx.contentWidth, a1H, true);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12.5);
  doc.setTextColor(PRIMARY);
  doc.text('Diretrizes Grafológicas para Assinatura de Poder & Blindagem:', ctx.margin + 10, a1Y + 12);

  const ruleW = (ctx.contentWidth - 24) / 3;
  const rules = [
    { title: '1. Ângulo Ascendente', desc: 'Incline sua assinatura entre 35° e 45° para cima. Isso ancora na mente o vetor contínuo de crescimento e vitória.' },
    { title: '2. Traço de Apoio Firme', desc: 'Conclua a assinatura com um traço inferior da esquerda para a direita, dando suporte e estabilidade patrimonial.' },
    { title: '3. Sem Cortes nem Ponto', desc: 'Evite cruzar seu próprio nome ou colocar ponto final. O fluxo de riqueza deve permanecer aberto e expansivo.' }
  ];

  rules.forEach((r, idx) => {
    const rx = ctx.margin + 8 + idx * (ruleW + 4);
    const ry = a1Y + 18;
    doc.setFillColor(248, 250, 254);
    doc.roundedRect(rx, ry, ruleW, 46, 2, 2, 'F');
    doc.setDrawColor(210, 220, 240);
    doc.setLineWidth(0.3);
    doc.roundedRect(rx, ry, ruleW, 46, 2, 2, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(PRIMARY);
    doc.text(r.title, rx + ruleW / 2, ry + 8, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(TEXT_DARK);
    const rLines = doc.splitTextToSize(r.desc, ruleW - 6);
    doc.text(rLines, rx + ruleW / 2, ry + 16, { align: 'center', lineHeightFactor: 1.25 });
  });

  // Suggested signature callout
  doc.setFillColor(254, 249, 235);
  doc.roundedRect(ctx.margin + 8, a1Y + 70, ctx.contentWidth - 16, 19, 2, 2, 'F');
  doc.setDrawColor(ACCENT_GOLD);
  doc.setLineWidth(0.4);
  doc.roundedRect(ctx.margin + 8, a1Y + 70, ctx.contentWidth - 16, 19, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(140, 95, 10);
  doc.text(`Assinatura Sugerida: "${report.nameOptimization.suggestedName}" (ascendente, firme e fluida)`, ctx.pageWidth / 2, a1Y + 81.5, { align: 'center' });

  // CARD 2: PROTOCOLO DE 21 DIAS DE REPROGRAMAÇÃO
  const p2Y = 132;
  const p2H = 140;
  ctx.drawCard(ctx.margin, p2Y, ctx.contentWidth, p2H, true);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12.5);
  doc.setTextColor(PRIMARY);
  doc.text('Protocolo dos 21 Dias para Ancoragem Neuromotora da Riqueza:', ctx.margin + 10, p2Y + 13);

  const steps = [
    { p: 'PASSO 01: O Caderno Sagrado', d: 'Reserve um caderno sem pautas e uma caneta de tinta azul ou dourada exclusivamente para este ritual.' },
    { p: 'PASSO 02: Horário de Potência', d: 'Pratique logo ao acordar ou antes de dormir, momentos em que as ondas cerebrais Alfa/Theta facilitam a gravação subconsciente.' },
    { p: 'PASSO 03: 21 Repetições Diárias', d: 'Escreva sua nova Assinatura de Poder exatamente 21 vezes por dia, durante 21 dias ininterruptos, com sentimento de vitória.' },
    { p: 'PASSO 04: Consagração do Traço', d: 'Ao terminar cada ciclo de 21 assinaturas, feche os olhos por 1 minuto e sinta a aliança de prosperidade selada no plano físico.' }
  ];

  steps.forEach((st, idx) => {
    const sY = p2Y + 20 + idx * 28;
    doc.setFillColor(245, 248, 255);
    doc.roundedRect(ctx.margin + 8, sY, ctx.contentWidth - 16, 24, 1.5, 1.5, 'F');
    doc.setDrawColor(ACCENT_GOLD);
    doc.setLineWidth(0.3);
    doc.roundedRect(ctx.margin + 8, sY, ctx.contentWidth - 16, 24, 1.5, 1.5, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(PRIMARY);
    doc.text(st.p, ctx.margin + 12, sY + 6.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(TEXT_DARK);
    const dLines = doc.splitTextToSize(st.d, ctx.contentWidth - 24);
    doc.text(dLines, ctx.margin + 12, sY + 13.5, { lineHeightFactor: 1.22 });
  });
};

/**
 * PAGE 8: CAMPO BIOFOTÔNICO DA AURA & RESSONÂNCIA MATERIAL
 */
export const renderPage8 = (doc: jsPDF, report: NumerologyReport, ctx: PageRenderContext) => {
  const pageNum = 8;
  doc.addPage();
  drawEsotericWatermark(doc, pageNum, ctx.pageWidth);
  ctx.drawPageHeader(pageNum, '7. Campo Biofotônico da Aura & Prosperidade');
  ctx.drawPageFooter(pageNum);

  // Section Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14.5);
  doc.setTextColor(PRIMARY);
  doc.text('7. CAMPO BIOFOTÔNICO DA AURA & PROSPERIDADE MATERIAL', ctx.margin, 25);

  // BANNER: ESPECTRO DA AURA
  const auY = 30;
  const auH = 64;
  doc.setFillColor(PRIMARY);
  doc.roundedRect(ctx.margin, auY, ctx.contentWidth, auH, 2.5, 2.5, 'F');
  doc.setDrawColor(ACCENT_GOLD);
  doc.setLineWidth(0.6);
  doc.roundedRect(ctx.margin, auY, ctx.contentWidth, auH, 2.5, 2.5, 'S');

  // Aura Mandala
  const ax = ctx.margin + 22;
  const ay = auY + 32;
  doc.setFillColor(34, 40, 72);
  doc.circle(ax, ay, 19, 'F');
  doc.setDrawColor(ACCENT_GOLD);
  doc.setLineWidth(0.7);
  doc.circle(ax, ay, 19, 'S');

  const dominantColor = report.aura?.primaryColorName || 'Dourado Solar';
  const auraArchetype = report.aura?.auraArchetype || 'Manto Solar de Criação';
  const auraFreq = report.aura?.frequencyHz || '528 Hz';
  const auraDesc = report.aura?.deepAnalysis || report.aura?.freeTastingSummary || 'Campo biofotônico de alta expansão e atração da riqueza divina.';

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(ACCENT_GOLD);
  doc.text('AURA', ax, ay - 3, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(255, 255, 255);
  doc.text(dominantColor.toUpperCase(), ax, ay + 4.5, { align: 'center' });

  // Details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text(`Cor Predominante: ${dominantColor} (${auraArchetype})`, ctx.margin + 48, auY + 14);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(ACCENT_GOLD_LIGHT);
  doc.text(`Frequência Bioenergética Estimada: ${auraFreq}`, ctx.margin + 48, auY + 23);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(230, 235, 245);
  const auDescLines = doc.splitTextToSize(auraDesc, ctx.contentWidth - 56);
  doc.text(auDescLines, ctx.margin + 48, auY + 31, { lineHeightFactor: 1.25 });

  // CARD 2: ANÁLISE BIOENERGÉTICA & INTERAÇÃO COM A RIQUEZA
  const c2Y = 100;
  const c2H = 92;
  ctx.drawCard(ctx.margin, c2Y, ctx.contentWidth, c2H, true);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12.5);
  doc.setTextColor(PRIMARY);
  doc.text('Análise Bioenergética & Interação da Aura com a Prosperidade:', ctx.margin + 10, c2Y + 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(TEXT_DARK);
  const anText = [
    `A sua aura na emanação ${dominantColor} atua como um campo eletromagnético vivo que atrai ou repele recursos materiais com base na sua vibração emocional predominante.`,
    "",
    "Em momentos de confiança, clareza de metas e gratidão, o alcance do seu biocampo se expande além de 3 metros, criando uma atmosfera de autoridade e simpatia imediata em reuniões, entrevistas e fechamento de vendas.",
    "",
    "Entretanto, o esgotamento físico, mágoas reprimidas e ambientes tóxicos fragmentam a luminosidade da aura, provocando drenagem energética e sensação de esforço sem retorno proporcional."
  ].join('\n');

  const anLines = doc.splitTextToSize(anText, ctx.contentWidth - 20);
  doc.text(anLines, ctx.margin + 10, c2Y + 22, { lineHeightFactor: 1.28 });

  // CARD 3: ÍMÃ BIOELETROMAGNÉTICO EM NEGÓCIOS
  const c3Y = 198;
  const c3H = 74;
  ctx.drawCard(ctx.margin, c3Y, ctx.contentWidth, c3H, true, '#FAF5E8');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12.5);
  doc.setTextColor(140, 95, 10);
  doc.text('✦ O Ímã Bioeletromagnético em Negócios & Vendas ✦', ctx.pageWidth / 2, c3Y + 12, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(TEXT_DARK);
  const imText = [
    "Clientes e parceiros decidem fechar negócios muito antes do aperto de mãos: eles sentem a integridade e o magnetismo do seu campo áurico.",
    "",
    "Mantenha sua vibração elevada através de pensamentos de abundância, evitando a autocrítica destrutiva e a comparação com terceiros. A sua frequência pessoal é a sua maior marca registrada de poder."
  ].join('\n');

  const imLines = doc.splitTextToSize(imText, ctx.contentWidth - 20);
  doc.text(imLines, ctx.margin + 10, c3Y + 22, { lineHeightFactor: 1.28 });
};
