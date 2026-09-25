import jsPDF from 'jspdf';
import { NumerologyReport } from '../types';
import { ACCENT_GOLD, ACCENT_GOLD_LIGHT, PRIMARY, drawEsotericWatermark } from './pdfWatermarks';

interface PosterRenderOptions {
  pageWidth: number;
  pageHeight: number;
  margin: number;
  contentWidth: number;
  drawPageHeader: (pageNum: number, sectionTitle: string) => void;
  drawPageFooter: (pageNum: number) => void;
}

/**
 * PAGE 16: CARTAZ SAGRADO 01
 * "A Única Forma de Chegar ao Impossível é Acreditar que é Possível"
 */
export const renderPoster1 = (
  doc: jsPDF,
  report: NumerologyReport,
  opts: PosterRenderOptions
) => {
  const pageNum = 16;
  doc.addPage();
  drawEsotericWatermark(doc, pageNum, opts.pageWidth);
  opts.drawPageHeader(pageNum, '15. Cartaz Sagrado 01: O Impossível');
  opts.drawPageFooter(pageNum);

  const centerX = opts.pageWidth / 2;
  const p1Y = 28;
  const p1H = 244; // Full-page poster

  // Deep Midnight Canvas
  doc.setFillColor(18, 23, 44);
  doc.roundedRect(opts.margin, p1Y, opts.contentWidth, p1H, 3, 3, 'F');
  doc.setDrawColor(ACCENT_GOLD);
  doc.setLineWidth(0.9);
  doc.roundedRect(opts.margin, p1Y, opts.contentWidth, p1H, 3, 3, 'S');

  // Inner hairline gold frame
  doc.setLineWidth(0.3);
  doc.setDrawColor(ACCENT_GOLD_LIGHT);
  doc.roundedRect(opts.margin + 3, p1Y + 3, opts.contentWidth - 6, p1H - 6, 2, 2, 'S');

  // Top Emerald Ribbon
  doc.setFillColor(27, 94, 32);
  doc.roundedRect(centerX - 56, p1Y + 10, 112, 10, 2, 2, 'F');
  doc.setDrawColor(ACCENT_GOLD);
  doc.setLineWidth(0.4);
  doc.roundedRect(centerX - 56, p1Y + 10, 112, 10, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(ACCENT_GOLD_LIGHT);
  doc.text('✦ CANALIZAÇÃO DE FÉ & REALIZAÇÃO SUPREMA ✦', centerX, p1Y + 16.5, { align: 'center' });

  // Main Typography
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 248, 225);
  doc.text('A ÚNICA FORMA', centerX, p1Y + 33, { align: 'center' });

  // Radiant bursts
  doc.setDrawColor(ACCENT_GOLD);
  doc.setLineWidth(0.3);
  for (let a = -45; a <= 45; a += 10) {
    const rad = (a * Math.PI) / 180;
    doc.line(centerX + 36 * Math.sin(rad), p1Y + 44 - 6 * Math.cos(rad), centerX + 52 * Math.sin(rad), p1Y + 44 - 15 * Math.cos(rad));
    doc.line(centerX - 36 * Math.sin(rad), p1Y + 44 - 6 * Math.cos(rad), centerX - 52 * Math.sin(rad), p1Y + 44 - 15 * Math.cos(rad));
  }

  // "DE CHEGAR AO" & "IMPOSSÍVEL"
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(46, 204, 113);
  doc.text('DE CHEGAR AO', centerX, p1Y + 43, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(230, 81, 0);
  doc.text('IMPOSSÍVEL', centerX, p1Y + 53, { align: 'center' });

  // Ribbon: "É ACREDITAR QUE É"
  doc.setFillColor(14, 98, 81);
  doc.roundedRect(centerX - 50, p1Y + 58, 100, 10, 2, 2, 'F');
  doc.setDrawColor(ACCENT_GOLD);
  doc.setLineWidth(0.4);
  doc.roundedRect(centerX - 50, p1Y + 58, 100, 10, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text('É ACREDITAR QUE É', centerX, p1Y + 64.5, { align: 'center' });

  // Climax Script: "Possível!"
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(32);
  doc.setTextColor(255, 109, 0);
  doc.text('Possível!', centerX, p1Y + 82, { align: 'center' });

  // Flanking Stars
  doc.setFontSize(15);
  doc.setTextColor(ACCENT_GOLD);
  doc.text('✦', centerX - 56, p1Y + 80);
  doc.text('✦', centerX + 52, p1Y + 80);

  // Floral divider
  doc.setDrawColor(46, 204, 113);
  doc.setLineWidth(0.5);
  doc.line(centerX - 45, p1Y + 89, centerX + 45, p1Y + 89);
  doc.circle(centerX, p1Y + 89, 1.8, 'F');

  // Expanded Meditation Guide in 10.5px Font for balanced fit
  const refl1Y = p1Y + 98;
  const refl1H = 136;
  doc.setFillColor(26, 33, 62);
  doc.roundedRect(opts.margin + 8, refl1Y, opts.contentWidth - 16, refl1H, 2.5, 2.5, 'F');
  doc.setDrawColor(ACCENT_GOLD);
  doc.setLineWidth(0.4);
  doc.roundedRect(opts.margin + 8, refl1Y, opts.contentWidth - 16, refl1H, 2.5, 2.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12.5);
  doc.setTextColor(ACCENT_GOLD);
  doc.text(`✦ MEDITAÇÃO SAGRADA • CAMINHO DE VIDA ${report.lifePath.number}`, opts.margin + 16, refl1Y + 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(240, 245, 255);
  const p1Text = [
    "O 'impossível' é apenas uma fronteira psicológica transitória construída pela mente condicionada. Quando você ancora a convicção no coração de que sua meta é nobre, digna e permitida pelo Criador, as frequências quânticas alinham sincronicidades e pessoas certas cruzam o seu destino.",
    "",
    "No seu Caminho de Vida " + report.lifePath.number + ", a dúvida opera como um curto-circuito no fluxo da abundância. Quando o medo ou a incerteza surgirem diante de um grande projeto, contrato ou mudança de vida, olhe para este cartaz e eleve sua vibração.",
    "",
    "A fé não é ausência de desafios, mas a certeza absoluta de que o poder divino em você é infinitamente maior do que qualquer obstáculo material."
  ].join('\n');

  const p1Split = doc.splitTextToSize(p1Text, opts.contentWidth - 32);
  doc.text(p1Split, opts.margin + 16, refl1Y + 22, { lineHeightFactor: 1.32 });

  // Practical Affirmation Box
  const affBoxY = refl1Y + 98;
  doc.setFillColor(34, 42, 78);
  doc.roundedRect(opts.margin + 14, affBoxY, opts.contentWidth - 28, 28, 2, 2, 'F');
  doc.setDrawColor(ACCENT_GOLD);
  doc.setLineWidth(0.3);
  doc.roundedRect(opts.margin + 14, affBoxY, opts.contentWidth - 28, 28, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(ACCENT_GOLD);
  doc.text('AFIRMAÇÃO DIÁRIA DE PODER:', opts.margin + 20, affBoxY + 8);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10.5);
  doc.setTextColor(255, 255, 255);
  const affText = '"Eu creio no invisível, realizo o extraordinário e recebo a fartura divina em minha vida hoje e sempre."';
  const affSplit = doc.splitTextToSize(affText, opts.contentWidth - 40);
  doc.text(affSplit, opts.margin + 20, affBoxY + 16, { lineHeightFactor: 1.3 });
};

/**
 * PAGE 17: CARTAZ SAGRADO 02
 * "Quando foi a última vez que você fez algo pela primeira vez?"
 */
export const renderPoster2 = (
  doc: jsPDF,
  report: NumerologyReport,
  opts: PosterRenderOptions
) => {
  const pageNum = 17;
  doc.addPage();
  drawEsotericWatermark(doc, pageNum, opts.pageWidth);
  opts.drawPageHeader(pageNum, '16. Cartaz Sagrado 02: Primeira Vez');
  opts.drawPageFooter(pageNum);

  const centerX = opts.pageWidth / 2;
  const p2Y = 28;
  const p2H = 244;

  // Vintage Kraft Parchment Canvas
  doc.setFillColor(215, 186, 146);
  doc.roundedRect(opts.margin, p2Y, opts.contentWidth, p2H, 3, 3, 'F');
  doc.setDrawColor(43, 35, 25);
  doc.setLineWidth(0.9);
  doc.roundedRect(opts.margin, p2Y, opts.contentWidth, p2H, 3, 3, 'S');

  // Inner rustic border
  doc.setDrawColor(74, 53, 37);
  doc.setLineWidth(0.35);
  doc.roundedRect(opts.margin + 3, p2Y + 3, opts.contentWidth - 6, p2H - 6, 2, 2, 'S');

  // Top banner
  doc.setFillColor(253, 251, 247);
  doc.roundedRect(centerX - 50, p2Y + 10, 100, 10, 2, 2, 'F');
  doc.setDrawColor(43, 35, 25);
  doc.setLineWidth(0.4);
  doc.roundedRect(centerX - 50, p2Y + 10, 100, 10, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(43, 35, 25);
  doc.text('✦ QUANDO FOI ✦', centerX, p2Y + 16.5, { align: 'center' });

  // Main vintage typography
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('A ÚLTIMA', centerX, p2Y + 29, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(30);
  doc.setTextColor(28, 21, 14);
  doc.text('vez', centerX, p2Y + 41, { align: 'center' });

  // Cartouche "QUE VOCÊ"
  doc.setFillColor(43, 35, 25);
  doc.roundedRect(centerX - 30, p2Y + 45, 60, 8, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text('QUE VOCÊ', centerX, p2Y + 50.8, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(43, 35, 25);
  doc.text('FEZ ALGO', centerX, p2Y + 60, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(90, 70, 50);
  doc.text('— PELA —', centerX, p2Y + 66, { align: 'center' });

  // Inverted Charcoal Banner
  doc.setFillColor(31, 26, 20);
  doc.roundedRect(centerX - 56, p2Y + 69, 112, 13, 2.5, 2.5, 'F');
  doc.setDrawColor(215, 186, 146);
  doc.setLineWidth(0.5);
  doc.roundedRect(centerX - 56, p2Y + 69, 112, 13, 2.5, 2.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.setTextColor(255, 255, 255);
  doc.text('PRIMEIRA VEZ?', centerX, p2Y + 77.8, { align: 'center' });

  // Laurel branches
  doc.setDrawColor(43, 35, 25);
  doc.setLineWidth(0.4);
  doc.line(centerX - 50, p2Y + 86, centerX + 50, p2Y + 86);
  doc.circle(centerX, p2Y + 86, 1.8, 'F');

  // Expanded Meditation Guide in 10.5px Font
  const refl2Y = p2Y + 94;
  const refl2H = 140;
  doc.setFillColor(245, 236, 225);
  doc.roundedRect(opts.margin + 8, refl2Y, opts.contentWidth - 16, refl2H, 2.5, 2.5, 'F');
  doc.setDrawColor(120, 90, 60);
  doc.setLineWidth(0.4);
  doc.roundedRect(opts.margin + 8, refl2Y, opts.contentWidth - 16, refl2H, 2.5, 2.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(99, 57, 11);
  doc.text('✦ O DESPERTAR DO PIONEIRISMO & EXPANSÃO DA CONSCIÊNCIA', opts.margin + 16, refl2Y + 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(43, 35, 25);
  const p2Text = [
    "A rotina mecânica anestesia a percepção intuitiva e limita o fluxo cósmico da prosperidade. O Cosmos recompensa quem tem a coragem sagrada de romper a inércia e viver experiências inéditas.",
    "",
    "Ao fazer algo pela primeira vez — seja aprender uma nova habilidade profissional, visitar um lugar desconhecido, mudar uma rota habitual ou iniciar uma conversa com alguém inspirador —, seu cérebro cria novas sinapses neurais e seu campo áurico se expande para atrair oportunidades nunca antes imaginadas.",
    "",
    "A mesmice reproduz os mesmos resultados financeiros. O pioneirismo abre os portais da fartura."
  ].join('\n');

  const p2Split = doc.splitTextToSize(p2Text, opts.contentWidth - 32);
  doc.text(p2Split, opts.margin + 16, refl2Y + 22, { lineHeightFactor: 1.32 });

  // Weekly Sacred Challenge Box
  const chBoxY = refl2Y + 98;
  doc.setFillColor(236, 222, 206);
  doc.roundedRect(opts.margin + 14, chBoxY, opts.contentWidth - 28, 30, 2, 2, 'F');
  doc.setDrawColor(140, 75, 10);
  doc.setLineWidth(0.35);
  doc.roundedRect(opts.margin + 14, chBoxY, opts.contentWidth - 28, 30, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(140, 75, 10);
  doc.text('DESAFIO SAGRADO DA SEMANA:', opts.margin + 20, chBoxY + 8);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(43, 35, 25);
  const chText = 'Tome ainda hoje ou nesta semana uma atitude inédita, corajosa e positiva que você vinha adiando por comodismo ou receio. O universo responderá à sua iniciativa!';
  const chSplit = doc.splitTextToSize(chText, opts.contentWidth - 40);
  doc.text(chSplit, opts.margin + 20, chBoxY + 15, { lineHeightFactor: 1.28 });
};

/**
 * PAGE 18: CARTAZ SAGRADO 03
 * "A Vida é Agora. O Tempo Não Volta."
 */
export const renderPoster3 = (
  doc: jsPDF,
  report: NumerologyReport,
  opts: PosterRenderOptions
) => {
  const pageNum = 18;
  doc.addPage();
  drawEsotericWatermark(doc, pageNum, opts.pageWidth);
  opts.drawPageHeader(pageNum, '17. Cartaz Sagrado 03: A Vida é Agora');
  opts.drawPageFooter(pageNum);

  const centerX = opts.pageWidth / 2;
  const p3Y = 28;
  const p3H = 244;

  // Sunset Twilight Seascape Canvas
  doc.setFillColor(34, 21, 56);
  doc.roundedRect(opts.margin, p3Y, opts.contentWidth, p3H, 3, 3, 'F');
  doc.setDrawColor(ACCENT_GOLD);
  doc.setLineWidth(0.9);
  doc.roundedRect(opts.margin, p3Y, opts.contentWidth, p3H, 3, 3, 'S');

  // Horizon bands
  doc.setFillColor(180, 80, 30);
  doc.rect(opts.margin + 1, p3Y + 36, opts.contentWidth - 2, 22, 'F');

  doc.setFillColor(243, 156, 18);
  doc.rect(opts.margin + 1, p3Y + 58, opts.contentWidth - 2, 16, 'F');

  // Radiant Golden Setting Sun
  doc.setFillColor(255, 243, 205);
  doc.circle(centerX, p3Y + 68, 12, 'F');
  doc.setDrawColor(ACCENT_GOLD_LIGHT);
  doc.setLineWidth(0.5);
  doc.circle(centerX, p3Y + 68, 15, 'S');

  // Ocean Water at Horizon
  doc.setFillColor(21, 34, 56);
  doc.rect(opts.margin + 1, p3Y + 71, opts.contentWidth - 2, 16, 'F');
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.25);
  doc.line(centerX - 42, p3Y + 77, centerX + 42, p3Y + 77);
  doc.line(centerX - 24, p3Y + 81, centerX + 24, p3Y + 81);

  // Cliff & Tree Silhouette on the Left
  doc.setFillColor(18, 15, 28);
  doc.triangle(opts.margin + 1, p3Y + 50, opts.margin + 36, p3Y + 86, opts.margin + 1, p3Y + 86, 'F');
  doc.rect(opts.margin + 10, p3Y + 28, 2.2, 28, 'F');
  doc.circle(opts.margin + 11, p3Y + 25, 8, 'F');
  doc.circle(opts.margin + 15, p3Y + 20, 6, 'F');

  // Contemplative Traveler Silhouette
  doc.circle(opts.margin + 26, p3Y + 62, 2.2, 'F');
  doc.rect(opts.margin + 25, p3Y + 65, 2.8, 7, 'F');

  // Hero Typography
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text('A VIDA É AGORA.', centerX, p3Y + 18, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(ACCENT_GOLD_LIGHT);
  doc.text('O TEMPO NÃO VOLTA. O QUE VOCÊ ESTÁ FAZENDO COM O SEU PRESENTE?', centerX, p3Y + 27, { align: 'center' });

  // Sacred Stanza Box in 10.5px Font
  const stanzaY = p3Y + 94;
  const stanzaH = 140;
  doc.setFillColor(20, 23, 42);
  doc.roundedRect(opts.margin + 8, stanzaY, opts.contentWidth - 16, stanzaH, 2.5, 2.5, 'F');
  doc.setDrawColor(ACCENT_GOLD);
  doc.setLineWidth(0.4);
  doc.roundedRect(opts.margin + 8, stanzaY, opts.contentWidth - 16, stanzaH, 2.5, 2.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12.5);
  doc.setTextColor(ACCENT_GOLD);
  doc.text('✦ A CONSCIÊNCIA DO TEMPO SAGRADO ✦', centerX, stanzaY + 13, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(245, 248, 255);
  const p3Poem = [
    "Cada respiração é um presente divino.",
    "Cada momento presente é uma escolha de poder.",
    "",
    "Pare um instante agora. Respire fundo e reflita:",
    "A sua existência hoje tem o significado, a dignidade e o propósito que você deseja dar a ela?",
    "",
    "O passado é uma memória que não pode ser reescrita; o futuro é uma projeção que só ganha forma pelo que você faz neste exato segundo. A prosperidade não mora no 'um dia', mas na excelência do que você planta no Agora."
  ].join('\n');

  const p3Split = doc.splitTextToSize(p3Poem, opts.contentWidth - 32);
  doc.text(p3Split, centerX, stanzaY + 23, { align: 'center', lineHeightFactor: 1.32 });

  // Focus Callout Box
  const focBoxY = stanzaY + 96;
  doc.setFillColor(28, 33, 60);
  doc.roundedRect(opts.margin + 14, focBoxY, opts.contentWidth - 28, 30, 2, 2, 'F');
  doc.setDrawColor(ACCENT_GOLD);
  doc.setLineWidth(0.3);
  doc.roundedRect(opts.margin + 14, focBoxY, opts.contentWidth - 28, 30, 2, 2, 'S');

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10.5);
  doc.setTextColor(ACCENT_GOLD_LIGHT);
  doc.text('O momento presente é a única coordenada quântica onde o Criador atua e onde seu destino é forjado.', centerX, focBoxY + 11, { align: 'center' });

  // Hashtags
  const hashText = '#Presença  •  #Propósito  •  #ConsciênciaDoTempo  •  #ConsultaDivinaReal';
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(ACCENT_GOLD);
  doc.text(hashText, centerX, focBoxY + 22, { align: 'center' });
};

/**
 * PAGE 19: CARTAZ SAGRADO 04
 * "Quando a Vida Lhe Der Cem Razões para Chorar..."
 */
export const renderPoster4 = (
  doc: jsPDF,
  report: NumerologyReport,
  opts: PosterRenderOptions
) => {
  const pageNum = 19;
  doc.addPage();
  drawEsotericWatermark(doc, pageNum, opts.pageWidth);
  opts.drawPageHeader(pageNum, '18. Cartaz Sagrado 04: Mil Razões para Sorrir');
  opts.drawPageFooter(pageNum);

  const centerX = opts.pageWidth / 2;
  const p4Y = 28;
  const p4H = 244;

  // Vibrant Marigold Yellow Canvas
  doc.setFillColor(245, 158, 11);
  doc.roundedRect(opts.margin, p4Y, opts.contentWidth, p4H, 3, 3, 'F');
  doc.setDrawColor(44, 39, 35);
  doc.setLineWidth(0.9);
  doc.roundedRect(opts.margin, p4Y, opts.contentWidth, p4H, 3, 3, 'S');

  // Inner cream hairline
  doc.setDrawColor(254, 243, 199);
  doc.setLineWidth(0.35);
  doc.roundedRect(opts.margin + 3, p4Y + 3, opts.contentWidth - 6, p4H - 6, 2, 2, 'S');

  // Star crest
  doc.setFillColor(44, 39, 35);
  doc.circle(centerX, p4Y + 12, 4.2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('★', centerX, p4Y + 14.5, { align: 'center' });

  // Flanking rays
  doc.setDrawColor(44, 39, 35);
  doc.setLineWidth(0.35);
  doc.line(centerX - 45, p4Y + 12, centerX - 10, p4Y + 12);
  doc.line(centerX + 10, p4Y + 12, centerX + 45, p4Y + 12);

  // Main Vintage Typography
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(44, 39, 35);
  doc.text('QUANDO', centerX, p4Y + 23, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text('A VIDA LHE', centerX, p4Y + 31, { align: 'center' });

  // Cartouche "D • E • R"
  doc.setFillColor(44, 39, 35);
  doc.roundedRect(centerX - 20, p4Y + 34, 40, 7, 1.2, 1.2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(254, 243, 199);
  doc.text('D • E • R', centerX, p4Y + 39, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.setTextColor(44, 39, 35);
  doc.text('CEM RAZÕES', centerX, p4Y + 49, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text('PARA CHORAR', centerX, p4Y + 56, { align: 'center' });

  // Dark slate ribbon
  doc.setFillColor(44, 39, 35);
  doc.roundedRect(centerX - 46, p4Y + 60, 92, 10, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text('MOSTRE À VIDA', centerX, p4Y + 66.8, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(44, 39, 35);
  doc.text('QUE VOCÊ TEM MIL', centerX, p4Y + 76, { align: 'center' });

  // Radiant Crescent Banner
  doc.setFillColor(254, 243, 199);
  doc.roundedRect(centerX - 60, p4Y + 79, 120, 13, 2.5, 2.5, 'F');
  doc.setDrawColor(44, 39, 35);
  doc.setLineWidth(0.6);
  doc.roundedRect(centerX - 60, p4Y + 79, 120, 13, 2.5, 2.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(44, 39, 35);
  doc.text('RAZÕES PARA SORRIR!', centerX, p4Y + 87.8, { align: 'center' });

  // Expanded Alchemical Gratitude Box in 10.5px Font
  const refl4Y = p4Y + 98;
  const refl4H = 136;
  doc.setFillColor(254, 243, 199);
  doc.roundedRect(opts.margin + 8, refl4Y, opts.contentWidth - 16, refl4H, 2.5, 2.5, 'F');
  doc.setDrawColor(120, 53, 15);
  doc.setLineWidth(0.4);
  doc.roundedRect(opts.margin + 8, refl4Y, opts.contentWidth - 16, refl4H, 2.5, 2.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12.5);
  doc.setTextColor(120, 53, 15);
  doc.text('✦ A ALQUIMIA DA GRATIDÃO & RESILIÊNCIA INABALÁVEL', opts.margin + 16, refl4Y + 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(44, 39, 35);
  const p4Text = [
    "O sorriso diante dos testes da vida não é leviandade nem fuga ingênua da realidade; é o selo régio da alma que confia plenamente na soberania e no amor da Providência Divina.",
    "",
    "A gratidão é uma força bioeletromagnética incomparável: ela transmuta o medo em coragem, a queixa em oportunidade e a escassez em abundância perpétua.",
    "",
    "Quando você agradece antes mesmo de ver a materialização do milagre, você emite a frequência quântica dos vencedores. Cultive o hábito diário de enumerar ao menos cinco bênçãos antes de adormecer."
  ].join('\n');

  const p4Split = doc.splitTextToSize(p4Text, opts.contentWidth - 32);
  doc.text(p4Split, opts.margin + 16, refl4Y + 22, { lineHeightFactor: 1.32 });

  // Consecration Seal Box
  const sealBoxY = refl4Y + 96;
  doc.setFillColor(253, 230, 138);
  doc.roundedRect(opts.margin + 14, sealBoxY, opts.contentWidth - 28, 28, 2, 2, 'F');
  doc.setDrawColor(180, 83, 9);
  doc.setLineWidth(0.35);
  doc.roundedRect(opts.margin + 14, sealBoxY, opts.contentWidth - 28, 28, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(180, 83, 9);
  doc.text('✦ CONSULTA DIVINA REAL • BÊNÇÃO PERPÉTUA ✦', centerX, sealBoxY + 9, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(44, 39, 35);
  doc.text('Que a abundância, a paz, a sabedoria e o triunfo permanente habitem todos os seus dias.', centerX, sealBoxY + 18, { align: 'center' });
};
