import jsPDF from 'jspdf';
import { NumerologyReport } from '../types';
import { ACCENT_GOLD, ACCENT_GOLD_LIGHT, PRIMARY, drawEsotericWatermark, drawEyeOfProvidence } from './pdfWatermarks';
import { PageRenderContext } from './pdfPagesCore';

const TEXT_DARK = '#2C3E50';
const TEXT_MUTED = '#5A6B82';

/**
 * PAGE 9: BLINDAGEM ÁURICA & CROMOTERAPIA SAGRADA
 */
export const renderPage9 = (doc: jsPDF, report: NumerologyReport, ctx: PageRenderContext) => {
  const pageNum = 9;
  doc.addPage();
  drawEsotericWatermark(doc, pageNum, ctx.pageWidth);
  ctx.drawPageHeader(pageNum, '8. Blindagem Áurica & Cromoterapia Sagrada');
  ctx.drawPageFooter(pageNum);

  // Section Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14.5);
  doc.setTextColor(PRIMARY);
  doc.text('8. PROTOCOLO DE BLINDAGEM ÁURICA & CROMOTERAPIA', ctx.margin, 25);

  // CARD 1: PROTOCOLO DE SELAMENTO ÁURICO
  const bY = 30;
  const bH = 108;
  ctx.drawCard(ctx.margin, bY, ctx.contentWidth, bH, true);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12.5);
  doc.setTextColor(PRIMARY);
  doc.text('Protocolo Sagrado de Selamento da Cúpula Biofotônica:', ctx.margin + 10, bY + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(TEXT_DARK);
  const bText = [
    report.aura?.shieldingProtocol || "Protocolo de Selamento da Cúpula de Proteção Biofotônica.",
    "",
    "Como Executar a Blindagem Matinal (Ritual da Cúpula Dourada):",
    "1. Ao despertar, permaneça sentado com as costas eretas e os pés no chão.",
    "2. Respire fundo por 3 vezes e visualize uma cúpula de luz dourada brilhante e impenetrável envolvendo todo o seu corpo a 1 metro de distância.",
    "3. Declare mentalmente com convicção: 'Meu campo está selado e blindado pelo Criador. Nenhuma inveja, maldição ou energia densa me atinge. Apenas a fartura, a paz e o amor têm livre passagem.'",
    "4. Este selo permanece ativo por todo o dia, preservando sua energia vital e seu magnetismo comercial."
  ].join('\n');

  const bLines = doc.splitTextToSize(bText, ctx.contentWidth - 20);
  doc.text(bLines, ctx.margin + 10, bY + 21, { lineHeightFactor: 1.28 });

  // CARD 2: CROMOTERAPIA & CRISTAIS EM RESSONÂNCIA
  const cY = 144;
  const cH = 128;
  ctx.drawCard(ctx.margin, cY, ctx.contentWidth, cH, true);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12.5);
  doc.setTextColor(PRIMARY);
  doc.text('Cromoterapia Sagrada & Tríade de Cristais em Ressonância:', ctx.margin + 10, cY + 12);

  // 3 Crystals Cards
  const crW = (ctx.contentWidth - 24) / 3;
  const crY = cY + 18;
  const crystalsList = report.aura?.recommendedCrystals?.length
    ? report.aura.recommendedCrystals.slice(0, 3).map((name, i) => ({
        name,
        function: i === 0 ? 'Ancoramento' : i === 1 ? 'Transmutação' : 'Expansão Solar',
        anchoring: i === 0 ? 'Mantenha em sua mesa de trabalho para estabilidade patrimonial.' : i === 1 ? 'Use como pingente para repelir energias densas.' : 'Coloque junto à carteira para magnetizar abundância.'
      }))
    : [
        { name: 'Citrino Dourado', function: 'Atração Financeira', anchoring: 'Mantenha na mesa de trabalho ou caixa para atrair prosperidade contínua.' },
        { name: 'Turmalina Negra', function: 'Escudo Protetor', anchoring: 'Use junto ao corpo para dissipar olho gordo e invejas sutis.' },
        { name: 'Olho de Tigre', function: 'Coragem & Foco', anchoring: 'Excelente para carregar no bolso em reuniões e decisões estratégicas.' }
      ];

  crystalsList.forEach((cr, idx) => {
    const cx = ctx.margin + 8 + idx * (crW + 4);
    doc.setFillColor(248, 250, 254);
    doc.roundedRect(cx, crY, crW, 48, 2, 2, 'F');
    doc.setDrawColor(ACCENT_GOLD);
    doc.setLineWidth(0.35);
    doc.roundedRect(cx, crY, crW, 48, 2, 2, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(PRIMARY);
    doc.text(cr.name, cx + crW / 2, crY + 9, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(140, 95, 10);
    doc.text(cr.function, cx + crW / 2, crY + 17, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(TEXT_DARK);
    const crLines = doc.splitTextToSize(cr.anchoring, crW - 6);
    doc.text(crLines, cx + crW / 2, crY + 25, { align: 'center', lineHeightFactor: 1.22 });
  });

  // Clothing & Harmonization Box
  const clothY = cY + 72;
  doc.setFillColor(254, 249, 235);
  doc.roundedRect(ctx.margin + 8, clothY, ctx.contentWidth - 16, 48, 2, 2, 'F');
  doc.setDrawColor(ACCENT_GOLD);
  doc.setLineWidth(0.4);
  doc.roundedRect(ctx.margin + 8, clothY, ctx.contentWidth - 16, 48, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(140, 95, 10);
  doc.text('Harmonização Cromoterápica em Reuniões & Decisões:', ctx.margin + 12, clothY + 7.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(TEXT_DARK);
  const clText = [
    "Em dias de apresentações, entrevistas e fechamento de acordos financeiros, utilize roupas ou acessórios em tons azul-marinho (autoridade serena), dourado/ocre (magnetismo solar da riqueza) ou verde-oliva (cura e expansão patrimonial).",
    "",
    "Evite o uso excessivo de preto contínuo, pois absorve energias residuais pesadas do ambiente."
  ].join('\n');

  const clLines = doc.splitTextToSize(clText, ctx.contentWidth - 24);
  doc.text(clLines, ctx.margin + 12, clothY + 15, { lineHeightFactor: 1.25 });
};

/**
 * PAGE 10: ALQUIMIA ENERGÉTICA: BANHOS SAGRADOS ANCESTRAIS
 */
export const renderPage10 = (doc: jsPDF, report: NumerologyReport, ctx: PageRenderContext) => {
  const pageNum = 10;
  doc.addPage();
  drawEsotericWatermark(doc, pageNum, ctx.pageWidth);
  ctx.drawPageHeader(pageNum, '9. Banhos Energéticos Ancestrais');
  ctx.drawPageFooter(pageNum);

  // Section Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14.5);
  doc.setTextColor(PRIMARY);
  doc.text('9. BANHOS ENERGÉTICOS ANCESTRAIS & ALQUIMIA DAS ERVAS', ctx.margin, 25);

  // 3 HERBAL BATHS IN NOBLE SPATIOUS CARDS
  const baths = [
    {
      title: 'BANHO 01: DESCARREGO & PURIFICAÇÃO ÁURICA',
      day: 'Melhor Dia: Segunda-feira ou Sexta-feira à noite • Lua Minguante ou Nova',
      ingr: 'Ingredientes: 1 punhado de sal grosso marinho, 3 galhos de arruda e 1 ramo de alecrim fresco.',
      ritual: 'Ferva 2 litros de água mineral. Apague o fogo, adicione as ervas maceradas com as mãos e abafe por 15 minutos. Tome seu banho de higiene normal e, em seguida, verta o preparado morno do pescoço para baixo, respirando fundo.',
      decree: 'Decreto: "Toda carga densa, inveja e cansaço se desfazem agora. Minha aura está pura, leve e pronta para receber o bem."'
    },
    {
      title: 'BANHO 02: PROSPERIDADE, OURO SOLAR & ATRAÇÃO',
      day: 'Melhor Dia: Terça-feira ou Quinta-feira pela manhã • Lua Crescente ou Cheia',
      ingr: 'Ingredientes: 3 canelas em pau, 7 cravos-da-índia, 1 colher de sopa de mel puro e folhas de louro.',
      ritual: 'Ferva a água com a canela e o cravo por 5 minutos para liberar os óleos essenciais. Desligue, adicione o louro e o mel. Coe e despeje suavemente do pescoço para baixo, sentindo o calor e o perfume solar que atrai riquezas.',
      decree: 'Decreto: "O ouro, a abundância e as bênçãos do Céu fluem livremente em minha direção. Eu sou um ímã de vitórias e fartura."'
    },
    {
      title: 'BANHO 03: MAGNETISMO PESSOAL & HARMONIA DE PARCERIAS',
      day: 'Melhor Dia: Quarta-feira ou Domingo à tarde • Qualquer fase lunar',
      ingr: 'Ingredientes: Pétalas de 1 rosa amarela ou branca, folhas de manjericão e 3 gotas de essência de lavanda.',
      ritual: 'Mergulhe as pétalas e o manjericão em água morna sem ferver, macerando com oração de gratidão. Banhe-se do pescoço para baixo antes de eventos importantes ou para selar a paz no lar e nos negócios.',
      decree: 'Decreto: "A paz habita meu coração. Minha presença inspira confiança, respeito e generosidade em todos os que me cercam."'
    }
  ];

  baths.forEach((b, idx) => {
    const by = 30 + idx * 80;
    const bh = 76;
    ctx.drawCard(ctx.margin, by, ctx.contentWidth, bh, true);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(idx === 1 ? '#8C5F0A' : PRIMARY);
    doc.text(b.title, ctx.margin + 10, by + 11);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(TEXT_MUTED);
    doc.text(b.day, ctx.margin + 10, by + 17);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(TEXT_DARK);
    const ingrLines = doc.splitTextToSize(b.ingr, ctx.contentWidth - 20);
    doc.text(ingrLines, ctx.margin + 10, by + 23, { lineHeightFactor: 1.22 });
    const ingrH = ingrLines.length * 3.8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(TEXT_DARK);
    const ritLines = doc.splitTextToSize(b.ritual, ctx.contentWidth - 20);
    doc.text(ritLines, ctx.margin + 10, by + 24 + ingrH, { lineHeightFactor: 1.24 });

    // Decree Box
    const decY = by + 57;
    doc.setFillColor(idx === 1 ? '#FAF3E0' : '#F4F7FC');
    doc.roundedRect(ctx.margin + 8, decY, ctx.contentWidth - 16, 15, 1.5, 1.5, 'F');
    doc.setDrawColor(idx === 1 ? ACCENT_GOLD : '#D0DAEC');
    doc.setLineWidth(0.3);
    doc.roundedRect(ctx.margin + 8, decY, ctx.contentWidth - 16, 15, 1.5, 1.5, 'S');

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9.5);
    doc.setTextColor(idx === 1 ? '#8C5F0A' : '#1E3C78');
    const decLines = doc.splitTextToSize(b.decree, ctx.contentWidth - 24);
    doc.text(decLines, ctx.margin + 12, decY + 6, { lineHeightFactor: 1.22 });
  });
};

/**
 * PAGE 11: MATRIZ DE FREQUÊNCIAS DE SOLFEGGIO & CURA SONORA
 */
export const renderPage11 = (doc: jsPDF, report: NumerologyReport, ctx: PageRenderContext) => {
  const pageNum = 11;
  doc.addPage();
  drawEsotericWatermark(doc, pageNum, ctx.pageWidth);
  ctx.drawPageHeader(pageNum, '10. Frequências Sonoras & Solfeggio');
  ctx.drawPageFooter(pageNum);

  // Section Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14.5);
  doc.setTextColor(PRIMARY);
  doc.text('10. MATRIZ DE SONS SAGRADOS & FREQUÊNCIAS DE SOLFEGGIO', ctx.margin, 25);

  // Intro Card
  const inY = 30;
  const inH = 26;
  ctx.drawCard(ctx.margin, inY, ctx.contentWidth, inH, true);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(TEXT_DARK);
  const inText = "As ondas hertzianas atuam diretamente na reorganização dos campos bioelétricos do cérebro. Utilize fones de ouvido e selecione a frequência abaixo correspondente à sua necessidade diária de cura e desbloqueio.";
  const inLines = doc.splitTextToSize(inText, ctx.contentWidth - 20);
  doc.text(inLines, ctx.margin + 10, inY + 10, { lineHeightFactor: 1.25 });

  // 7 Frequency Rows with Clickable Youtube Links
  const freqs = [
    { hz: '396 Hz', name: 'Libertação da Culpa e do Medo', desc: 'Dissolve bloqueios de escassez e sensação de incapacidade.', time: 'Ouvir ao acordar ou antes de meditar.', url: 'https://www.youtube.com/results?search_query=396hz+frequency+solfeggio' },
    { hz: '417 Hz', name: 'Facilitação de Mudanças & Novos Ciclos', desc: 'Limpa experiências traumáticas e repara a vitalidade celular.', time: 'Ideal para transições de carreira.', url: 'https://www.youtube.com/results?search_query=417hz+frequency+solfeggio' },
    { hz: '528 Hz', name: 'Frequência do Amor & Milagres (DNA)', desc: 'Ressonância biológica de regeneração e atração de sincronicidades.', time: 'Ouvir durante o trabalho ou descanso.', url: 'https://www.youtube.com/results?search_query=528hz+miracle+tone' },
    { hz: '639 Hz', name: 'Conexão & Harmonia nos Relacionamentos', desc: 'Desperta a empatia, facilita negociações e cura conflitos.', time: 'Antes de reuniões com sócios e clientes.', url: 'https://www.youtube.com/results?search_query=639hz+relationship+frequency' },
    { hz: '741 Hz', name: 'Despertar da Intuição & Soluções Criativas', desc: 'Limpa toxinas mentais e traz clareza para resolver impasses.', time: 'Em momentos de planejamento estratégico.', url: 'https://www.youtube.com/results?search_query=741hz+intuition+frequency' },
    { hz: '852 Hz', name: 'Retorno à Ordem Espiritual & Discernimento', desc: 'Eleva a consciência acima de ilusões materiais e falsas promessas.', time: 'Durante orações ou antes de adormecer.', url: 'https://www.youtube.com/results?search_query=852hz+spiritual+awakening' },
    { hz: '888 Hz', name: 'Frequência do Infinito & Prosperidade Suprema', desc: 'Ativa a ressonância do Número 8, atraindo bênçãos financeiras e triunfo.', time: 'Ao assinar sua Assinatura de Poder.', url: 'https://www.youtube.com/results?search_query=888hz+infinite+abundance' }
  ];

  const startY = 60;
  const rowH = 29;
  const btnW = 34;
  const btnX = ctx.pageWidth - ctx.margin - btnW - 4;

  freqs.forEach((f, idx) => {
    const ry = startY + idx * rowH;
    const isGold = f.hz === '888 Hz' || f.hz === '528 Hz';
    doc.setFillColor(isGold ? '#FAF5E8' : '#F9FBFE');
    doc.roundedRect(ctx.margin, ry, ctx.contentWidth, rowH - 3, 1.5, 1.5, 'F');
    doc.setDrawColor(isGold ? ACCENT_GOLD : '#D7E1F0');
    doc.setLineWidth(isGold ? 0.5 : 0.25);
    doc.roundedRect(ctx.margin, ry, ctx.contentWidth, rowH - 3, 1.5, 1.5, 'S');

    // Hz Text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13.5);
    doc.setTextColor(isGold ? '#8C5F0A' : PRIMARY);
    doc.text(f.hz, ctx.margin + 12, ry + 13);

    // Title & Desc
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(PRIMARY);
    doc.text(f.name, ctx.margin + 36, ry + 9);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(TEXT_DARK);
    const descLines = doc.splitTextToSize(`${f.desc}  •  ${f.time}`, ctx.contentWidth - 44 - btnW);
    doc.text(descLines, ctx.margin + 36, ry + 16, { lineHeightFactor: 1.2 });

    // Youtube Button
    doc.setFillColor(204, 0, 0); // YouTube Red
    doc.roundedRect(btnX, ry + 5, btnW, 14, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text('▶ OUVIR VÍDEO', btnX + btnW / 2, ry + 13.5, { align: 'center' });
    doc.link(btnX, ry + 5, btnW, 14, { url: f.url });
  });
};

/**
 * PAGE 12: SELOS SAGRADOS & GEOMETRIA QUÂNTICA DE PROTEÇÃO
 */
export const renderPage12 = (doc: jsPDF, report: NumerologyReport, ctx: PageRenderContext) => {
  const pageNum = 12;
  doc.addPage();
  drawEsotericWatermark(doc, pageNum, ctx.pageWidth);
  ctx.drawPageHeader(pageNum, '11. Selos Sagrados & Geometria Quântica');
  ctx.drawPageFooter(pageNum);

  // Section Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14.5);
  doc.setTextColor(PRIMARY);
  doc.text('11. GEOMETRIA SAGRADA & SELOS QUÂNTICOS DE PROTEÇÃO', ctx.margin, 25);

  // Eye of Providence Banner
  const eyY = 30;
  const eyH = 36;
  doc.setFillColor(PRIMARY);
  doc.roundedRect(ctx.margin, eyY, ctx.contentWidth, eyH, 2.5, 2.5, 'F');
  doc.setDrawColor(ACCENT_GOLD);
  doc.setLineWidth(0.6);
  doc.roundedRect(ctx.margin, eyY, ctx.contentWidth, eyH, 2.5, 2.5, 'S');

  drawEyeOfProvidence(doc, ctx.margin + 20, eyY + 18, 11);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(ACCENT_GOLD);
  doc.text('O Olho da Providência & A Proteção do Todo', ctx.margin + 44, eyY + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(230, 235, 245);
  const eyText = "O Olho que Tudo Vê simboliza a vigilância benevolente do Criador sobre suas finanças, família e jornada terrena. Nenhuma conspiração de escassez prevalece contra a luz da Providência.";
  const eyLines = doc.splitTextToSize(eyText, ctx.contentWidth - 52);
  doc.text(eyLines, ctx.margin + 44, eyY + 22, { lineHeightFactor: 1.25 });

  // CARD 1: O CUBO DE METATRON
  const mY = 70;
  const mH = 64;
  ctx.drawCard(ctx.margin, mY, ctx.contentWidth, mH, true);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12.5);
  doc.setTextColor(PRIMARY);
  doc.text('1. O Cubo de Metatron & Os Cinco Sólidos Platônicos', ctx.margin + 10, mY + 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(TEXT_DARK);
  const mText = [
    "O Cubo de Metatron contém todos os blocos fundamentais da criação geométrica do universo.",
    "",
    "Na tradição cabalística e mística, este selo atua como um escudo supremo de dispersão energética, impedindo que invejas sutis ou bloqueios coletivos invadam seu campo de trabalho e moradia.",
    "",
    "Mentalize este símbolo desenhado em dourado na entrada da sua casa ou escritório para consagrar a prosperidade e a ordem cósmica."
  ].join('\n');

  const mLines = doc.splitTextToSize(mText, ctx.contentWidth - 20);
  doc.text(mLines, ctx.margin + 10, mY + 20, { lineHeightFactor: 1.28 });

  // CARD 2: A FLOR DA VIDA
  const fY = 138;
  const fH = 64;
  ctx.drawCard(ctx.margin, fY, ctx.contentWidth, fH, true);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12.5);
  doc.setTextColor(PRIMARY);
  doc.text('2. A Flor da Vida & A Matriz de Multiplicação da Criação', ctx.margin + 10, fY + 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(TEXT_DARK);
  const fText = [
    "Composta por 19 círculos entrelaçados, a Flor da Vida representa o código universal pelo qual a vida se expande a partir de um único ponto central de luz.",
    "",
    "Ao meditar sobre este selo, seu subconsciente recorda a verdade de que a abundância é a condição natural do cosmos.",
    "",
    "Utilize a Flor da Vida sob objetos preciosos, gavetas onde guarda documentos de investimentos ou na tela de descanso do seu computador."
  ].join('\n');

  const fLines = doc.splitTextToSize(fText, ctx.contentWidth - 20);
  doc.text(fLines, ctx.margin + 10, fY + 20, { lineHeightFactor: 1.28 });

  // CARD 3: O SELO DE SALOMÃO
  const sY = 206;
  const sH = 64;
  ctx.drawCard(ctx.margin, sY, ctx.contentWidth, sH, true);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12.5);
  doc.setTextColor(PRIMARY);
  doc.text('3. O Selo de Salomão & A Aliança Perpétua da Sabedoria', ctx.margin + 10, sY + 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(TEXT_DARK);
  const sText = [
    "A união do triângulo superior (o Céu, a Providência e a Graça) com o triângulo inferior (a Terra, a Ação e a Matéria) reflete a lei hermética: 'Assim na Terra como no Céu'.",
    "",
    "A verdadeira riqueza é espiritual e material ao mesmo tempo. Honre seus dons, sirva com excelência ao próximo e a prosperidade será a consequência inevitável da sua integridade."
  ].join('\n');

  const sLines = doc.splitTextToSize(sText, ctx.contentWidth - 20);
  doc.text(sLines, ctx.margin + 10, sY + 20, { lineHeightFactor: 1.28 });
};

/**
 * PAGE 13: PROMESSAS BÍBLICAS DE FARTURA & ALIANÇA DIVINA
 */
export const renderPage13 = (doc: jsPDF, report: NumerologyReport, ctx: PageRenderContext) => {
  const pageNum = 13;
  doc.addPage();
  drawEsotericWatermark(doc, pageNum, ctx.pageWidth);
  ctx.drawPageHeader(pageNum, '12. Promessas Bíblicas & Aliança Divina');
  ctx.drawPageFooter(pageNum);

  // Section Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14.5);
  doc.setTextColor(PRIMARY);
  doc.text('12. PROMESSAS BÍBLICAS DE FARTURA & ALIANÇA DIVINA', ctx.margin, 25);

  // 4 SACRED SCRIPTURES CARDS
  const verses = [
    {
      ref: 'Salmo 23:1',
      text: '"O Senhor é o meu pastor; de nada terei falta. Em verdes pastagens me faz repousar e me conduz a águas tranquilas."',
      app: 'Aplicação Financeira: Descanse na certeza de que a Fonte de todo suprimento é infinita. A ansiedade paralisa as oportunidades; a confiança em Deus abre os celeiros do Céu.'
    },
    {
      ref: 'Deuteronômio 8:18',
      text: '"Lembra-te, pois, do Senhor teu Deus, porque é Ele quem te dá força e sabedoria para adquirires riquezas, confirmando a Sua aliança."',
      app: 'Aplicação Financeira: Toda capacidade criativa e competência profissional que você possui é um dom divino. Use seus recursos para o bem e a multiplicação continuará.'
    },
    {
      ref: 'Provérbios 3:9-10',
      text: '"Honra ao Senhor com os teus bens e com as primícias de toda a tua renda; e se encherão os teus celeiros fartamente, e transbordarão de vinho os teus lagares."',
      app: 'Aplicação Financeira: Pratique a generosidade e a doação consciente antes de tudo. Quem retém com mesquinhez atrai seca; quem semeia com alegria colhe com abundância.'
    },
    {
      ref: 'Jeremias 29:11',
      text: '"Porque sou Eu que conheço os planos que tenho para vocês, diz o Senhor, planos de prosperidade e paz, e não de mal, para vos dar um futuro e uma esperança."',
      app: 'Aplicação Financeira: Seu destino final não é a escassez, mas a vitória e a maturidade espiritual. Persevere mesmo em momentos desafiadores com a certeza da bênção.'
    }
  ];

  verses.forEach((v, idx) => {
    const vy = 30 + idx * 60;
    const vh = 56;
    ctx.drawCard(ctx.margin, vy, ctx.contentWidth, vh, true);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(140, 95, 10);
    doc.text(`✦ ${v.ref}`, ctx.margin + 10, vy + 10);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10.5);
    doc.setTextColor(PRIMARY);
    const tLines = doc.splitTextToSize(v.text, ctx.contentWidth - 20);
    doc.text(tLines, ctx.margin + 10, vy + 17, { lineHeightFactor: 1.25 });
    const tH = tLines.length * 4.0;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(TEXT_DARK);
    const aLines = doc.splitTextToSize(v.app, ctx.contentWidth - 20);
    doc.text(aLines, ctx.margin + 10, vy + 18 + tH, { lineHeightFactor: 1.22 });
  });
};

/**
 * PAGE 14: PREVISÃO DO ANO PESSOAL, CICLOS & CONSAGRAÇÃO DA ALIANÇA
 */
export const renderPage14 = (doc: jsPDF, report: NumerologyReport, ctx: PageRenderContext) => {
  const pageNum = 14;
  doc.addPage();
  drawEsotericWatermark(doc, pageNum, ctx.pageWidth);
  ctx.drawPageHeader(pageNum, '13. Ano Pessoal & Consagração da Aliança');
  ctx.drawPageFooter(pageNum);

  // Section Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14.5);
  doc.setTextColor(PRIMARY);
  doc.text('13. PREVISÃO DO ANO PESSOAL & PACTO DE CONSAGRAÇÃO', ctx.margin, 25);

  // CARD 1: ANO PESSOAL VIGENTE
  const pyY = 30;
  const pyH = 112;
  ctx.drawCard(ctx.margin, pyY, ctx.contentWidth, pyH, true);

  doc.setFillColor(PRIMARY);
  doc.circle(ctx.margin + 16, pyY + 16, 11, 'F');
  doc.setDrawColor(ACCENT_GOLD);
  doc.setLineWidth(0.6);
  doc.circle(ctx.margin + 16, pyY + 16, 11, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.setTextColor(ACCENT_GOLD);
  doc.text(String(report.personalYear.yearNumber), ctx.margin + 16, pyY + 21.5, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13.5);
  doc.setTextColor(PRIMARY);
  doc.text(`Ano Pessoal ${report.personalYear.yearNumber} (${report.personalYear.calendarYear}): ${report.personalYear.theme}`, ctx.margin + 32, pyY + 13);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(140, 95, 10);
  doc.text(`Frequência Regente no Ciclo de 9 Anos`, ctx.margin + 32, pyY + 19.5);

  doc.setDrawColor(220, 226, 238);
  doc.setLineWidth(0.3);
  doc.line(ctx.margin + 8, pyY + 25, ctx.pageWidth - ctx.margin - 8, pyY + 25);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(TEXT_DARK);
  const pLines = doc.splitTextToSize(report.personalYear.forecast, ctx.contentWidth - 16);
  doc.text(pLines, ctx.margin + 8, pyY + 33, { lineHeightFactor: 1.28 });

  // Favorable times pill
  const tBoxY = pyY + 74;
  doc.setFillColor(254, 249, 235);
  doc.roundedRect(ctx.margin + 8, tBoxY, ctx.contentWidth - 16, 30, 2, 2, 'F');
  doc.setDrawColor(ACCENT_GOLD);
  doc.setLineWidth(0.35);
  doc.roundedRect(ctx.margin + 8, tBoxY, ctx.contentWidth - 16, 30, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(140, 95, 10);
  doc.text('DIAS FAVORÁVEIS & HORAS DE PODER NO ANO:', ctx.margin + 12, tBoxY + 7);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(TEXT_DARK);
  doc.text(`Dias Ideais da Semana: ${report.personalYear.luckyDays.join('  •  ')}`, ctx.margin + 12, tBoxY + 15);
  doc.text(`Janelas Horárias de Maior Ressonância: ${report.personalYear.powerHours}`, ctx.margin + 12, tBoxY + 22);

  // CARD 2: CONSAGRAÇÃO DA ALIANÇA & ASSINATURA DE PODER
  const cY = 148;
  const cH = 124;
  ctx.drawCard(ctx.margin, cY, ctx.contentWidth, cH, true, '#101224');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12.5);
  doc.setTextColor(ACCENT_GOLD);
  doc.text('✦ CONSAGRAÇÃO DA ALIANÇA DE PROSPERIDADE & ASSINATURA DE PODER ✦', ctx.pageWidth / 2, cY + 13, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(240, 245, 255);
  const cText = [
    "Eu, portador deste Mapa Numerológico, acolho hoje a plenitude dos meus dons cósmicos e firmo minha aliança irrevogável com a Prosperidade Divina.",
    "",
    "Comprometo-me a neutralizar velhos hábitos de escassez, honrar a minha Assinatura de Poder e exercer minha vocação com excelência, ética e generosidade."
  ].join('\n');

  const cLines = doc.splitTextToSize(cText, ctx.contentWidth - 24);
  doc.text(cLines, ctx.margin + 12, cY + 22, { lineHeightFactor: 1.28 });

  // Official Signature Lines
  const sLineY = cY + 68;
  doc.setDrawColor(ACCENT_GOLD);
  doc.setLineWidth(0.6);
  doc.line(ctx.margin + 16, sLineY, ctx.margin + 105, sLineY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(ACCENT_GOLD);
  doc.text(`Assinatura Oficial de Poder: ${report.nameOptimization.suggestedName}`, ctx.margin + 16, sLineY + 6.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(200, 210, 230);
  doc.text(`Titular: ${report.user.fullName}`, ctx.margin + 16, sLineY + 12.5);
  doc.text(`Data da Consagração: ${report.generatedAt}`, ctx.margin + 16, sLineY + 17.5);

  // Official Seal
  const sealX = ctx.pageWidth - ctx.margin - 40;
  const sealY = sLineY - 3;
  doc.setFillColor(28, 32, 60);
  doc.circle(sealX, sealY, 17, 'F');
  doc.setDrawColor(ACCENT_GOLD);
  doc.setLineWidth(0.8);
  doc.circle(sealX, sealY, 17, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(ACCENT_GOLD);
  doc.text('CONSULTA', sealX, sealY - 5.5, { align: 'center' });
  doc.text('DIVINA REAL', sealX, sealY - 0.5, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(ACCENT_GOLD_LIGHT);
  doc.text('★ SELADO ★', sealX, sealY + 7, { align: 'center' });
};

/**
 * PAGE 15: BIBLIOTECA DA MESTRIA & LEITURAS RECOMENDADAS
 */
export const renderPage15 = (doc: jsPDF, report: NumerologyReport, ctx: PageRenderContext) => {
  const pageNum = 15;
  doc.addPage();
  drawEsotericWatermark(doc, pageNum, ctx.pageWidth);
  ctx.drawPageHeader(pageNum, '14. Biblioteca da Mestria & Leituras');
  ctx.drawPageFooter(pageNum);

  // Section Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14.5);
  doc.setTextColor(PRIMARY);
  doc.text('14. GUIA DE LEITURAS INSPIRADORAS & MESTRIA MENTAL', ctx.margin, 25);

  // Intro Banner
  const ibY = 30;
  const ibH = 26;
  ctx.drawCard(ctx.margin, ibY, ctx.contentWidth, ibH, true);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(TEXT_DARK);
  const ibText = "A mente subconsciente necessita de alimento nobre e constante para sustentar novas crenças de abundância. Estas 3 obras clássicas foram sintonizadas com o seu Caminho de Vida para acelerar sua mestria.";
  const ibLines = doc.splitTextToSize(ibText, ctx.contentWidth - 20);
  doc.text(ibLines, ctx.margin + 10, ibY + 9, { lineHeightFactor: 1.25 });

  // 3 Books in Noble Cards (~67mm each)
  const books = [
    {
      title: 'O Homem Mais Rico da Babilônia',
      author: 'George S. Clason',
      cat: 'Finanças Ancestrais & Sabedoria de Ouro',
      help: 'Ensina os 7 remédios fundamentais para curar uma carteira vazia e as 5 leis divinas do ouro.',
      syn: 'Perfeita sintonia com o seu Caminho de Vida para estruturar poupança, segurança e patrimônio duradouro.',
      key: 'Chave Prática: Pague a si mesmo primeiro retendo no mínimo 10% de toda renda para investir com segurança.'
    },
    {
      title: 'A Lei do Triunfo / Quem Pensa Enriquece',
      author: 'Napoleon Hill',
      cat: 'Mentalidade Cósmica & Autoconfiança',
      help: 'Análise de mais de 500 das maiores mentes da história sobre como o foco inabalável transmuta pensamentos em ouro.',
      syn: 'Desperta a liderança, elimina o medo do fracasso e alinha sua Expressão aos objetivos magnos.',
      key: 'Chave Prática: Defina um Objetivo Principal Definido e repita-o com fé ardente todas as manhãs.'
    },
    {
      title: 'Arrume a Sua Cama',
      author: 'Almirante William H. McRaven',
      cat: 'Disciplina & Resiliência Inabalável',
      help: '10 lições práticas das Forças Especiais sobre como pequenas disciplinas diárias mudam a postura interior.',
      syn: 'Conecta-se com a sua necessidade de ordem diária para manter seu campo áurico blindado e produtivo.',
      key: 'Chave Prática: Comece o dia vencendo a primeira tarefa com perfeição para construir confiança imparável.'
    }
  ];

  books.forEach((bk, idx) => {
    const bky = 60 + idx * 71;
    const bkh = 67;
    ctx.drawCard(ctx.margin, bky, ctx.contentWidth, bkh, true);

    // Book spine / badge
    doc.setFillColor(PRIMARY);
    doc.roundedRect(ctx.margin + 8, bky + 8, 14, bkh - 16, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(ACCENT_GOLD);
    doc.text(`0${idx + 1}`, ctx.margin + 15, bky + 23, { align: 'center' });

    // Title & Author
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(PRIMARY);
    doc.text(bk.title, ctx.margin + 28, bky + 12);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(140, 95, 10);
    doc.text(`${bk.author}  •  ${bk.cat}`, ctx.margin + 28, bky + 18);

    // Why it helps & Synergy in 9.5px
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(TEXT_DARK);
    const hLines = doc.splitTextToSize(`Por que esta obra é essencial: ${bk.help}`, ctx.contentWidth - 36);
    doc.text(hLines, ctx.margin + 28, bky + 25, { lineHeightFactor: 1.22 });

    const sLines = doc.splitTextToSize(`Sinergia com seu Perfil: ${bk.syn}`, ctx.contentWidth - 36);
    doc.text(sLines, ctx.margin + 28, bky + 37, { lineHeightFactor: 1.22 });

    // Practical Key Box
    const pkY = bky + 49;
    doc.setFillColor(254, 249, 235);
    doc.roundedRect(ctx.margin + 28, pkY, ctx.contentWidth - 36, 14, 1, 1, 'F');
    doc.setDrawColor(ACCENT_GOLD);
    doc.setLineWidth(0.3);
    doc.roundedRect(ctx.margin + 28, pkY, ctx.contentWidth - 36, 14, 1, 1, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(140, 95, 10);
    const kLines = doc.splitTextToSize(bk.key, ctx.contentWidth - 42);
    doc.text(kLines, ctx.margin + 32, pkY + 5.5, { lineHeightFactor: 1.2 });
  });
};
