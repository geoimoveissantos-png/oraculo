import { NumerologyReport } from '../types';

export interface RecommendedBook {
  id: string;
  title: string;
  author: string;
  category: string;
  bestsellerBadge: string;
  themeColor: string;
  accentColor: string;
  gradientStart: string;
  gradientEnd: string;
  iconType: 'enso_sword' | 'gold_coins' | 'money_path' | 'open_book_light' | 'rich_dad_seal' | 'sky_hope' | 'navy_stars';
  whyItHelps: string;
  synergyReason: string;
  practicalKey: string;
}

export const ALL_INSPIRING_BOOKS: Record<string, RecommendedBook> = {
  mente_milionaria: {
    id: 'mente_milionaria',
    title: 'Os Segredos da Mente Milionária',
    author: 'T. Harv Eker',
    category: 'Reprogramação Mental & Riqueza',
    bestsellerBadge: '2,4 MILHÕES VENDIDOS NO BRASIL',
    themeColor: '#0F5132',
    accentColor: '#D4AF37',
    gradientStart: '#1E293B',
    gradientEnd: '#0F172A',
    iconType: 'money_path',
    whyItHelps: 'Desconstrói os arquivos mentais inconscientes de escassez assimilados na infância. Ensina os 17 arquivos de riqueza e como adotar os hábitos psicológicos das mentes mais prósperas.',
    synergyReason: 'Essencial para elevar o teto térmico do seu termostato financeiro, permitindo reter e multiplicar ganhos materiais sem medo inconsciente de perdas.',
    practicalKey: 'Faça diariamente uma declaração de merecimento em voz alta e adote a divisão de cada receita no método dos potes (necessidades, liberdade financeira e doação).'
  },
  babilonia: {
    id: 'babilonia',
    title: 'O Homem Mais Rico da Babilônia',
    author: 'George S. Clason',
    category: 'Sabedoria Ancestral de Riqueza',
    bestsellerBadge: 'CLÁSSICO MUNDIAL DA PROSPERIDADE',
    themeColor: '#B45309',
    accentColor: '#F59E0B',
    gradientStart: '#2C1B0B',
    gradientEnd: '#1A0F05',
    iconType: 'gold_coins',
    whyItHelps: 'Ensina as 5 leis eternas do ouro através de parábolas babilônicas. Demonstra com clareza cristalina como fazer o dinheiro trabalhar como escravo para gerar novos frutos.',
    synergyReason: 'Perfeito para ancorar disciplina financeira sagrada, convertendo seu trabalho em um fluxo perpétuo e seguro de acumulação.',
    practicalKey: 'Pague a si mesmo primeiro: antes de quitar qualquer conta ou dívida, retenha no mínimo 10% de todo dinheiro que entrar e invista-o em segurança.'
  },
  mais_esperto_diabo: {
    id: 'mais_esperto_diabo',
    title: 'Mais Esperto que o Diabo',
    author: 'Napoleon Hill',
    category: 'Mestria Pessoal & Antirretardo',
    bestsellerBadge: '#1 MAIS VENDIDO POR ANOS',
    themeColor: '#881337',
    accentColor: '#FBBF24',
    gradientStart: '#3B0716',
    gradientEnd: '#0A0A0A',
    iconType: 'open_book_light',
    whyItHelps: 'Desvenda como o medo, a dúvida e a procrastinação geram o "ritmo hipnótico" da alienação mental. Ensina a pensar com a própria cabeça e despertar o poder interior.',
    synergyReason: 'Elimina a autossabotagem e a hesitação, oferecendo blindagem psicológica contra a negatividade de terceiros e dúvidas paralisantes.',
    practicalKey: 'Defina seu Objetivo Definido de Vida com absoluta precisão e recuse-se terminantemente a adiar para amanhã qualquer decisão essencial do seu dia.'
  },
  pai_rico: {
    id: 'pai_rico',
    title: 'Pai Rico, Pai Pobre',
    author: 'Robert T. Kiyosaki',
    category: 'Educação & Ativos Financeiros',
    bestsellerBadge: 'NOVA EDIÇÃO ATUALIZADA & AMPLIADA',
    themeColor: '#581C87',
    accentColor: '#FACC15',
    gradientStart: '#2E1065',
    gradientEnd: '#130526',
    iconType: 'rich_dad_seal',
    whyItHelps: 'Quebra o mito de que um alto salário é garantia de riqueza. Ensina a distinção irrevogável entre ativos (o que coloca dinheiro no bolso) e passivos (o que tira).',
    synergyReason: 'Capacita o consulente a escapar da corrida dos ratos e construir patrimônio sólido e independente de trocas contínuas de tempo por dinheiro.',
    practicalKey: 'Foque sua energia em acumular ativos geradores de fluxo de caixa em vez de bens de consumo que geram custos mensais contínuos.'
  },
  arte_guerra: {
    id: 'arte_guerra',
    title: 'A Arte da Guerra',
    author: 'Sun Tzu',
    category: 'Estratégia & Liderança Pessoal',
    bestsellerBadge: 'OS 13 CAPÍTULOS ORIGINAIS',
    themeColor: '#991B1B',
    accentColor: '#EF4444',
    gradientStart: '#18181B',
    gradientEnd: '#09090B',
    iconType: 'enso_sword',
    whyItHelps: 'O mais renomado tratado militar e filosófico sobre vitória sem destruição. Ensina a antecipar movimentos, gerir conflitos e liderar com serenidade e prudência.',
    synergyReason: 'Desenvolve mente tática e frieza para negociações, fechamento de contratos e condução de empreendimentos sem desgaste de energia desnecessário.',
    practicalKey: 'Em qualquer desafio profissional, estude primeiro o terreno e o perfil de quem está à sua frente antes de expor suas estratégias ou emitir respostas emocionais.'
  },
  nunca_desista: {
    id: 'nunca_desista',
    title: 'Nunca Desista de Seus Sonhos',
    author: 'Augusto Cury',
    category: 'Inteligência Emocional & Resiliência',
    bestsellerBadge: '25 MILHÕES DE LIVROS VENDIDOS',
    themeColor: '#0369A1',
    accentColor: '#7DD3FC',
    gradientStart: '#082F49',
    gradientEnd: '#021626',
    iconType: 'sky_hope',
    whyItHelps: 'Examina a trajetória de grandes realizadores que superaram incompreensões e desertos emocionais. Ensina a resguardar a psique contra o esgotamento existencial.',
    synergyReason: 'Fortalece o tônus anímico do consulente para atravessar fases de provação e recalibragem do ciclo numerológico sem perder a esperança.',
    practicalKey: 'Ao enfrentar qualquer decepção ou atraso aparente, exerça o diálogo interno positivo: você é maior que suas circunstâncias e seu destino está em construção.'
  },
  arrume_cama: {
    id: 'arrume_cama',
    title: 'Arrume a Sua Cama',
    author: 'William H. McRaven',
    category: 'Disciplina Diária & Conquistas',
    bestsellerBadge: '+ 4 MILHÕES DE LIVROS NO MUNDO',
    themeColor: '#1E3A8A',
    accentColor: '#F59E0B',
    gradientStart: '#172554',
    gradientEnd: '#091024',
    iconType: 'navy_stars',
    whyItHelps: '10 lições práticas das Forças Especiais sobre como pequenas disciplinas diárias mudam a postura interior e pavimentam vitórias extraordinárias.',
    synergyReason: 'Cria uma base irredutível de disciplina para manifestar na matéria aquilo que os seus números revelam no plano sutil.',
    practicalKey: 'Conclua a primeira tarefa do dia com perfeição ao levantar-se; esse pequeno triunfo inicial desencadeia um efeito dominó de eficácia até a noite.'
  },
  quem_pensa_enriquece: {
    id: 'quem_pensa_enriquece',
    title: 'Quem Pensa Enriquece',
    author: 'Napoleon Hill',
    category: 'Filosofia da Conquista & Alquimia Mental',
    bestsellerBadge: '+ 100 MILHÕES NO MUNDO',
    themeColor: '#78350F',
    accentColor: '#FBBF24',
    gradientStart: '#2A1805',
    gradientEnd: '#120A02',
    iconType: 'open_book_light',
    whyItHelps: 'Fruto de 25 anos de estudo dos 500 homens mais ricos do mundo. Revela a fórmula do Mastermind, a transmutação do desejo ardente e a fé inabalável em objetivos definidos.',
    synergyReason: 'Conecta o consulente à força motriz da mente subconsciente para materializar as vibrações de prosperidade impressas no seu mapa.',
    practicalKey: 'Escreva num papel o montante exato de prosperidade que pretende manifestar, o prazo limite e o que você dará em troca por essa realização; leia em voz alta ao acordar e ao deitar.'
  },
  poder_habito: {
    id: 'poder_habito',
    title: 'O Poder do Hábito',
    author: 'Charles Duhigg',
    category: 'Neurociência do Comportamento & Rotinas',
    bestsellerBadge: '+ 3 MILHÕES NO BRASIL',
    themeColor: '#1E293B',
    accentColor: '#38BDF8',
    gradientStart: '#0F172A',
    gradientEnd: '#020617',
    iconType: 'navy_stars',
    whyItHelps: 'Desvenda o loop neurológico do hábito: Deixa, Rotina e Recompensa. Demonstra como reprogramar comportamentos sabotadores substituindo a rotina intermediária sem perder a recompensa.',
    synergyReason: 'Permite ancorar os rituais, banhos e decretos numerológicos como reflexos automáticos no dia a dia, eliminando o esforço consciente e a preguiça.',
    practicalKey: 'Identifique o gatilho da sua procrastinação diária e associe imediatamente uma microação de 2 minutos para quebrar o ciclo de inércia.'
  },
  essencialismo: {
    id: 'essencialismo',
    title: 'Essencialismo',
    author: 'Greg McKeown',
    category: 'Foco Radical & Economia de Energia',
    bestsellerBadge: '#1 DO THE NEW YORK TIMES',
    themeColor: '#047857',
    accentColor: '#34D399',
    gradientStart: '#064E3B',
    gradientEnd: '#022C22',
    iconType: 'enso_sword',
    whyItHelps: 'A disciplinada busca por menos. Ensina a discernir o que é vitalmente importante daquilo que é apenas trivialmente atraente, blindando o tempo e o foco realizador.',
    synergyReason: 'Vital para proteger a energia do consulente contra dispersões, permitindo concentrar toda a potência dos seus números nas metas de maior retorno.',
    practicalKey: 'Aprenda a dizer não com elegância e firmeza a compromissos e convites que não convergem diretamente com o seu objetivo primordial de vida.'
  }
};

// Selection algorithm providing random suggestions maintaining at least 3 books
export function getRecommendedBooksForReport(report?: NumerologyReport, count: number = 3): RecommendedBook[] {
  const allBooks = Object.values(ALL_INSPIRING_BOOKS);

  // Modern Fisher-Yates random shuffle
  const shuffled = [...allBooks];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Always return at least 3 suggestions
  const targetCount = Math.max(3, count);
  return shuffled.slice(0, targetCount);
}

// Generate realistic 300-DPI visual book cover using HTML5 Canvas (browser-safe)
export function generateBookCoverDataUrl(book: RecommendedBook, width = 220, height = 330): string {
  if (typeof document === 'undefined') {
    return '';
  }

  try {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // 1. Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, book.gradientStart);
    bgGrad.addColorStop(0.6, book.themeColor);
    bgGrad.addColorStop(1, book.gradientEnd);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Spine shading (left 3D book curve)
    const spineGrad = ctx.createLinearGradient(0, 0, 18, 0);
    spineGrad.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
    spineGrad.addColorStop(0.35, 'rgba(0, 0, 0, 0.25)');
    spineGrad.addColorStop(0.7, 'rgba(255, 255, 255, 0.15)');
    spineGrad.addColorStop(1, 'rgba(0, 0, 0, 0.05)');
    ctx.fillStyle = spineGrad;
    ctx.fillRect(0, 0, 18, height);

    // Spine groove line
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(18, 0);
    ctx.lineTo(18, height);
    ctx.stroke();

    // 3. Elegant Gold Outer Border
    ctx.strokeStyle = book.accentColor;
    ctx.lineWidth = 1.8;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    // Inner subtle hairline border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 0.8;
    ctx.strokeRect(14, 14, width - 28, height - 28);

    // 4. Author Banner at Top
    ctx.fillStyle = book.accentColor;
    ctx.font = 'bold 10px "Cinzel", "Times New Roman", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '1.5px';
    ctx.fillText(book.author.toUpperCase(), width / 2 + 5, 34);

    // Subtle divider line below author
    ctx.strokeStyle = book.accentColor;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 35, 40);
    ctx.lineTo(width / 2 + 45, 40);
    ctx.stroke();

    // 5. Category / Sub-badge
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.font = 'bold 7.5px sans-serif';
    ctx.fillText(book.category.toUpperCase(), width / 2 + 5, 52);

    // 6. Central Graphic Emblem based on iconType
    const emblemY = 135;
    ctx.save();
    ctx.translate(width / 2 + 5, emblemY);

    if (book.iconType === 'enso_sword') {
      // Red Enso circle with Katana blade
      ctx.strokeStyle = '#DC2626';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(0, 0, 32, 0.4, Math.PI * 1.85);
      ctx.stroke();

      // Blade line
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-35, 25);
      ctx.lineTo(35, -25);
      ctx.stroke();

      // Handle & Guard
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.moveTo(-44, 32);
      ctx.lineTo(-35, 25);
      ctx.stroke();
    } else if (book.iconType === 'gold_coins') {
      // 4 Golden embossed coins
      [-36, -12, 12, 36].forEach((cx, i) => {
        const coinGrad = ctx.createRadialGradient(cx - 3, -3, 2, cx, 0, 11);
        coinGrad.addColorStop(0, '#FDE68A');
        coinGrad.addColorStop(0.7, '#D97706');
        coinGrad.addColorStop(1, '#78350F');
        ctx.fillStyle = coinGrad;
        ctx.beginPath();
        ctx.arc(cx, 0, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FBBF24';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Inner symbol
        ctx.fillStyle = '#78350F';
        ctx.font = 'bold 8px serif';
        ctx.textAlign = 'center';
        ctx.fillText(['I', 'V', 'X', '★'][i], cx, 3);
      });
    } else if (book.iconType === 'open_book_light') {
      // Golden glowing open book with light rays
      ctx.fillStyle = 'rgba(251, 191, 36, 0.15)';
      ctx.beginPath();
      ctx.arc(0, 0, 42, 0, Math.PI * 2);
      ctx.fill();

      // Book pages
      ctx.fillStyle = '#FEF08A';
      ctx.beginPath();
      ctx.moveTo(0, 8);
      ctx.quadraticCurveTo(-20, -5, -34, -14);
      ctx.lineTo(-34, 12);
      ctx.quadraticCurveTo(-18, 20, 0, 16);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(0, 8);
      ctx.quadraticCurveTo(20, -5, 34, -14);
      ctx.lineTo(34, 12);
      ctx.quadraticCurveTo(18, 20, 0, 16);
      ctx.fill();

      // Golden starburst
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, -28); ctx.lineTo(0, -18);
      ctx.moveTo(-18, -24); ctx.lineTo(-11, -16);
      ctx.moveTo(18, -24); ctx.lineTo(11, -16);
      ctx.stroke();
    } else if (book.iconType === 'money_path') {
      // Sun on horizon with winding road
      const sunGrad = ctx.createRadialGradient(0, -15, 2, 0, -15, 24);
      sunGrad.addColorStop(0, '#FEF08A');
      sunGrad.addColorStop(1, 'rgba(234, 179, 8, 0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(0, -15, 24, 0, Math.PI * 2);
      ctx.fill();

      // Golden path
      ctx.fillStyle = '#EAB308';
      ctx.beginPath();
      ctx.moveTo(-5, -5);
      ctx.lineTo(5, -5);
      ctx.lineTo(26, 30);
      ctx.lineTo(-26, 30);
      ctx.closePath();
      ctx.fill();

      // Wagon / Abundance cart silhouette
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(-12, 10, 24, 10);
      ctx.beginPath();
      ctx.arc(-8, 22, 3, 0, Math.PI * 2);
      ctx.arc(8, 22, 3, 0, Math.PI * 2);
      ctx.fill();
    } else if (book.iconType === 'rich_dad_seal') {
      // Gold circular badge with ribbon
      const sealGrad = ctx.createLinearGradient(-26, -26, 26, 26);
      sealGrad.addColorStop(0, '#FDE68A');
      sealGrad.addColorStop(0.5, '#D97706');
      sealGrad.addColorStop(1, '#92400E');
      ctx.fillStyle = sealGrad;
      ctx.beginPath();
      ctx.arc(0, -4, 25, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FFF';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#451A03';
      ctx.font = 'bold 8.5px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('INTELIGÊNCIA', 0, -8);
      ctx.fillText('FINANCEIRA', 0, 3);
    } else if (book.iconType === 'sky_hope') {
      // Sky clouds and radiant stars
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.beginPath();
      ctx.arc(-10, -5, 14, 0, Math.PI * 2);
      ctx.arc(10, -5, 14, 0, Math.PI * 2);
      ctx.arc(0, -14, 16, 0, Math.PI * 2);
      ctx.fill();

      // Silhouette figure running toward light
      ctx.fillStyle = '#BAE6FD';
      ctx.beginPath();
      ctx.arc(0, -2, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#BAE6FD';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 2); ctx.lineTo(0, 16);
      ctx.moveTo(-6, 8); ctx.lineTo(6, 6);
      ctx.moveTo(0, 16); ctx.lineTo(-8, 26);
      ctx.moveTo(0, 16); ctx.lineTo(8, 24);
      ctx.stroke();
    } else {
      // Navy stars and alignment arch
      ctx.strokeStyle = book.accentColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 10, 30, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();

      // 3 Stars
      [-18, 0, 18].forEach(sx => {
        ctx.fillStyle = '#FBBF24';
        ctx.font = '13px serif';
        ctx.textAlign = 'center';
        ctx.fillText('★', sx, 0);
      });
    }
    ctx.restore();

    // 7. Title Typography (bold and impactful)
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 13px "Cinzel", "Times New Roman", Georgia, serif';
    ctx.textAlign = 'center';

    // Wrap title intelligently
    const words = book.title.split(' ');
    let line1 = '';
    let line2 = '';
    let line3 = '';

    if (words.length <= 3) {
      line1 = words.join(' ');
    } else if (words.length <= 5) {
      line1 = words.slice(0, 2).join(' ');
      line2 = words.slice(2).join(' ');
    } else {
      line1 = words.slice(0, 2).join(' ');
      line2 = words.slice(2, 4).join(' ');
      line3 = words.slice(4).join(' ');
    }

    const titleBaseY = 210;
    if (line3) {
      ctx.fillText(line1.toUpperCase(), width / 2 + 5, titleBaseY - 14);
      ctx.fillText(line2.toUpperCase(), width / 2 + 5, titleBaseY + 2);
      ctx.fillStyle = book.accentColor;
      ctx.fillText(line3.toUpperCase(), width / 2 + 5, titleBaseY + 18);
    } else if (line2) {
      ctx.fillText(line1.toUpperCase(), width / 2 + 5, titleBaseY - 8);
      ctx.fillStyle = book.accentColor;
      ctx.fillText(line2.toUpperCase(), width / 2 + 5, titleBaseY + 10);
    } else {
      ctx.fillStyle = book.accentColor;
      ctx.fillText(line1.toUpperCase(), width / 2 + 5, titleBaseY);
    }

    // 8. Bestseller / Edition Ribbon at Bottom
    const ribbonY = height - 42;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(14, ribbonY, width - 28, 20);

    ctx.strokeStyle = book.accentColor;
    ctx.lineWidth = 0.8;
    ctx.strokeRect(14, ribbonY, width - 28, 20);

    ctx.fillStyle = book.accentColor;
    ctx.font = 'bold 7px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(book.bestsellerBadge, width / 2 + 5, ribbonY + 13);

    // 9. Subtle 3D page highlight top-to-bottom right sheen
    const sheenGrad = ctx.createLinearGradient(width - 30, 0, width, 0);
    sheenGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    sheenGrad.addColorStop(1, 'rgba(255, 255, 255, 0.12)');
    ctx.fillStyle = sheenGrad;
    ctx.fillRect(width - 30, 0, 30, height);

    return canvas.toDataURL('image/png');
  } catch (err) {
    console.warn('Canvas book cover generation error:', err);
    return '';
  }
}
