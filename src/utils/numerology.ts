import { 
  NumberBreakdown, 
  NumerologyReport, 
  PersonalYearInfo, 
  ProsperityDiagnosis, 
  UserInputs,
  NameOptimization,
  EnergyBath,
  SoundFrequency,
  SacredSymbolAndVerse,
  AuraReading,
  SemesterLuckyNumbers
} from '../types';

// Pythagorean letter values mapping
const LETTER_VALUES: Record<string, number> = {
  A: 1, J: 1, S: 1,
  B: 2, K: 2, T: 2,
  C: 3, L: 3, U: 3,
  D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5,
  F: 6, O: 6, X: 6,
  G: 7, P: 7, Y: 7,
  H: 8, Q: 8, Z: 8,
  I: 9, R: 9
};

const VOWELS = new Set(['A', 'E', 'I', 'O', 'U']);

// Normalize text: remove accents and special characters
export function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z]/g, '');
}

// Reduce number to 1-9, or preserve master numbers (11, 22, 33)
export function reduceNumber(num: number, preserveMaster: boolean = true): number {
  if (preserveMaster && (num === 11 || num === 22 || num === 33)) {
    return num;
  }
  while (num > 9) {
    if (preserveMaster && (num === 11 || num === 22 || num === 33)) {
      return num;
    }
    num = num
      .toString()
      .split('')
      .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }
  return num;
}

// Calculate Life Path Number (Caminho de Vida)
export function calculateLifePath(birthDateStr: string): { number: number; isMaster: boolean; explanation: string } {
  // birthDate format: YYYY-MM-DD
  const [yearStr, monthStr, dayStr] = birthDateStr.split('-');
  const day = parseInt(dayStr, 10);
  const month = parseInt(monthStr, 10);
  const year = parseInt(yearStr, 10);

  const reducedDay = reduceNumber(day, true);
  const reducedMonth = reduceNumber(month, true);
  const reducedYear = reduceNumber(year, true);

  const total = reducedDay + reducedMonth + reducedYear;
  const finalNum = reduceNumber(total, true);

  const explanation = `Dia (${day} → ${reducedDay}) + Mês (${month} → ${reducedMonth}) + Ano (${year} → ${reducedYear}) = ${total} → Redução vibracional: ${finalNum}`;

  return {
    number: finalNum,
    isMaster: finalNum === 11 || finalNum === 22 || finalNum === 33,
    explanation
  };
}

// Calculate Expression Number (Soma de todas as letras)
export function calculateExpression(fullName: string): { number: number; isMaster: boolean; explanation: string; values: { letter: string; val: number }[] } {
  const normalized = normalizeText(fullName);
  const values: { letter: string; val: number }[] = [];
  let total = 0;

  for (const char of normalized) {
    const val = LETTER_VALUES[char] || 0;
    if (val > 0) {
      values.push({ letter: char, val });
      total += val;
    }
  }

  const finalNum = reduceNumber(total, true);
  const explanation = `Soma das ${values.length} letras do nome completo (${total}) reduzida à frequência ${finalNum}.`;

  return {
    number: finalNum,
    isMaster: finalNum === 11 || finalNum === 22 || finalNum === 33,
    explanation,
    values
  };
}

// Calculate Soul Urge Number (Desejo da Alma - Vogais)
export function calculateSoulUrge(fullName: string): { number: number; isMaster: boolean; explanation: string } {
  const normalized = normalizeText(fullName);
  let total = 0;
  const vowelLetters: string[] = [];

  for (const char of normalized) {
    if (VOWELS.has(char)) {
      const val = LETTER_VALUES[char] || 0;
      total += val;
      vowelLetters.push(char);
    }
  }

  const finalNum = reduceNumber(total, true);
  const explanation = `Soma dos valores das vogais (${vowelLetters.join(', ')} = ${total}) reduzida a ${finalNum}. Revela a motivação oculta da alma.`;

  return {
    number: finalNum,
    isMaster: finalNum === 11 || finalNum === 22 || finalNum === 33,
    explanation
  };
}

// Calculate Personality Number (Personalidade Externa - Consoantes)
export function calculatePersonality(fullName: string): { number: number; isMaster: boolean; explanation: string } {
  const normalized = normalizeText(fullName);
  let total = 0;
  const consonantLetters: string[] = [];

  for (const char of normalized) {
    if (!VOWELS.has(char) && LETTER_VALUES[char]) {
      const val = LETTER_VALUES[char];
      total += val;
      consonantLetters.push(char);
    }
  }

  const finalNum = reduceNumber(total, true);
  const explanation = `Soma das consoantes (${total}) reduzida a ${finalNum}. Reflete a primeira impressão e a presença exterior no mundo.`;

  return {
    number: finalNum,
    isMaster: finalNum === 11 || finalNum === 22 || finalNum === 33,
    explanation
  };
}

// Calculate Current Personal Year (Ano Pessoal)
export function calculatePersonalYear(birthDateStr: string, currentYear: number = new Date().getFullYear()): PersonalYearInfo {
  const [, monthStr, dayStr] = birthDateStr.split('-');
  const day = parseInt(dayStr, 10);
  const month = parseInt(monthStr, 10);

  const reducedDay = reduceNumber(day, false);
  const reducedMonth = reduceNumber(month, false);
  const reducedYear = reduceNumber(currentYear, false);

  const total = reducedDay + reducedMonth + reducedYear;
  const yearNumber = reduceNumber(total, false);

  const forecasts: Record<number, { theme: string; forecast: string; focus: { period: string; focus: string }[]; luckyDays: string[]; hours: string }> = {
    1: {
      theme: 'Início de Ciclo de 9 Anos, Liderança e Novos Projetos',
      forecast: 'Momento de plantar sementes audaciosas. A energia do Ano 1 exige autonomia, coragem e abertura a novos caminhos financeiros. Oportunidades inesperadas de negócios surgirão.',
      focus: [
        { period: '1º Trimestre', focus: 'Definição de novas metas e rompimento com amarras antigas' },
        { period: '2º Trimestre', focus: 'Lançamento de iniciativas e expansão da sua rede' },
        { period: '3º Trimestre', focus: 'Consolidação e primeiros retornos materiais' },
        { period: '4º Trimestre', focus: 'Ajuste de rota e preparação para crescimento sustentado' }
      ],
      luckyDays: ['Domingo', 'Terça-feira'],
      hours: '07:00 às 09:00 e 13:00 às 14:00'
    },
    2: {
      theme: 'Parcerias Estratégicas, Diplomacia e Paciência',
      forecast: 'Ano de cooperação. O dinheiro fluirá através de associações, contratos e alianças de confiança mútua. Evite decisões precipitadas e cultive alianças sólidas.',
      focus: [
        { period: '1º Trimestre', focus: 'Construção de pontes e escuta atenta aos parceiros' },
        { period: '2º Trimestre', focus: 'Formalização de contratos e resolução de atritos' },
        { period: '3º Trimestre', focus: 'Trabalho em equipe e investimentos conjuntos' },
        { period: '4º Trimestre', focus: 'Colheita harmônica e reconhecimento de apoio mútuo' }
      ],
      luckyDays: ['Segunda-feira', 'Sexta-feira'],
      hours: '10:00 às 12:00 e 17:00 às 18:30'
    },
    3: {
      theme: 'Expansão Criativa, Comunicação e Visibilidade',
      forecast: 'Ano de brilhar e monetizar sua voz, imagem e talentos expressivos. A abundância responde ao seu otimismo e à capacidade de encantar e conectar pessoas.',
      focus: [
        { period: '1º Trimestre', focus: 'Expressão autêntica e branding pessoal' },
        { period: '2º Trimestre', focus: 'Criação de novos canais de monetização e visibilidade' },
        { period: '3º Trimestre', focus: 'Vendas, apresentações e networking de alto impacto' },
        { period: '4º Trimestre', focus: 'Celebração de vitórias e reinvestimento criativo' }
      ],
      luckyDays: ['Quinta-feira', 'Sábado'],
      hours: '09:00 às 11:00 e 15:00 às 16:30'
    },
    4: {
      theme: 'Construção Sólida, Organização e Estruturação Financeira',
      forecast: 'Momento de edificar bases inabaláveis. O dinheiro chega através do método, disciplina e eliminação de desperdícios. Perfeito para aquisição de bens duráveis e investimentos de longo prazo.',
      focus: [
        { period: '1º Trimestre', focus: 'Auditoria de gastos e organização financeira minuciosa' },
        { period: '2º Trimestre', focus: 'Criação de reservas de segurança e automação' },
        { period: '3º Trimestre', focus: 'Execução focada de projetos com alto rigor técnico' },
        { period: '4º Trimestre', focus: 'Estabilização de patrimônio e proteção contra riscos' }
      ],
      luckyDays: ['Quarta-feira', 'Sábado'],
      hours: '08:00 às 10:00 e 14:00 às 15:30'
    },
    5: {
      theme: 'Mudanças Radicais, Liberdade e Novas Fontes de Renda',
      forecast: 'Ano dinâmico, marcado por guinadas surpreendentes e oportunidades móveis. Ideal para inovar modelos de trabalho, viagens comerciais e transição para setores em alta.',
      focus: [
        { period: '1º Trimestre', focus: 'Adaptação ágil a novas tendências de mercado' },
        { period: '2º Trimestre', focus: 'Diversificação de canais de receita e comércio' },
        { period: '3º Trimestre', focus: 'Flexibilização de rotinas e foco no que gera mais liberdade' },
        { period: '4º Trimestre', focus: 'Fechamento de ciclos obsoletos sem apego' }
      ],
      luckyDays: ['Quarta-feira', 'Terça-feira'],
      hours: '11:00 às 13:00 e 18:00 às 19:30'
    },
    6: {
      theme: 'Responsabilidade, Prosperidade Familiar e Serviços de Valor',
      forecast: 'Foco na harmonia do lar e em negócios que acolhem, nutrem e resolvem dores reais. Grandes bênçãos financeiras vinculadas à integridade e entrega de excelência.',
      focus: [
        { period: '1º Trimestre', focus: 'Harmonização do orçamento doméstico e investimentos no lar' },
        { period: '2º Trimestre', focus: 'Fidelização de clientes e serviços de alta confiança' },
        { period: '3º Trimestre', focus: 'Retribuição à comunidade e expansão de autoridade' },
        { period: '4º Trimestre', focus: 'Colheita próspera compartilhada com os entes queridos' }
      ],
      luckyDays: ['Sexta-feira', 'Domingo'],
      hours: '10:30 às 12:30 e 16:30 às 18:00'
    },
    7: {
      theme: 'Sabedoria Estratégica, Especialização e Conexão Espiritual',
      forecast: 'Ano de aprofundamento. A verdadeira riqueza virá do seu conhecimento especializado, intuição aguçada e reflexão profunda antes de agir. Evite investimentos duvidosos.',
      focus: [
        { period: '1º Trimestre', focus: 'Estudo aprofundado, mentorias e domínio de sua área' },
        { period: '2º Trimestre', focus: 'Auditoria interior e purificação de crenças de escassez' },
        { period: '3º Trimestre', focus: 'Desenvolvimento de produtos intelectuais de alto valor' },
        { period: '4º Trimestre', focus: 'Clareza estratégica para o grande salto do ano seguinte' }
      ],
      luckyDays: ['Segunda-feira', 'Sábado'],
      hours: '06:00 às 08:00 e 20:00 às 21:30'
    },
    8: {
      theme: 'Ano de Ouro: Materialização, Poder Executivo e Grande Colheita',
      forecast: 'O ápice da manifestação financeira no ciclo de 9 anos. Vibração do infinito, dos negócios de grande escala e da recompensa por esforços anteriores. Hora de pensar grande e liderar com autoridade.',
      focus: [
        { period: '1º Trimestre', focus: 'Alinhamento com negócios de maior ticket e relevância' },
        { period: '2º Trimestre', focus: 'Negociação firme e fechamento de grandes contratos' },
        { period: '3º Trimestre', focus: 'Gestão de lucros e reinvestimento em ativos geradores de renda' },
        { period: '4º Trimestre', focus: 'Celebração da abundância e consolidação de patrimônio' }
      ],
      luckyDays: ['Sábado', 'Quinta-feira'],
      hours: '08:30 às 10:30 e 14:30 às 16:00'
    },
    9: {
      theme: 'Finalização de Ciclo, Desapego e Limpeza Financeira',
      forecast: 'Hora de fechar o ciclo de 9 anos, liberando velhas dívidas, projetos estagnados e crenças limitantes. Tudo o que não serve mais deve sair para dar espaço ao novo ciclo próspero que se aproxima.',
      focus: [
        { period: '1º Trimestre', focus: 'Diagnóstico de pontas soltas e resolução de débitos' },
        { period: '2º Trimestre', focus: 'Conclusão de contratos pendentes com generosidade' },
        { period: '3º Trimestre', focus: 'Doação, filantropia e fluxo desimpedido de energia' },
        { period: '4º Trimestre', focus: 'Preparação do terreno para o Ano 1 com mente limpa' }
      ],
      luckyDays: ['Terça-feira', 'Domingo'],
      hours: '09:30 às 11:30 e 17:30 às 19:00'
    }
  };

  const selected = forecasts[yearNumber] || forecasts[1];

  return {
    yearNumber,
    calendarYear: currentYear,
    theme: selected.theme,
    forecast: selected.forecast,
    quarterlyFocus: selected.focus,
    luckyDays: selected.luckyDays,
    powerHours: selected.hours
  };
}

// Master Interpretations Dictionary
const NUMBER_PROFILES: Record<number, {
  name: string;
  archetype: string;
  essence: string;
  strengths: string[];
  challenges: string[];
  prosperityImpact: string;
}> = {
  1: {
    name: 'O Pioneiro & Líder Autônomo',
    archetype: 'O Arquiteto de Iniciativas',
    essence: 'Energia de criação primal, autodeterminação e coragem para desbravar caminhos nunca antes trilhados. Você nasceu para comandar, inovar e ser a referência em sua atividade.',
    strengths: ['Independência radical', 'Decisão rápida em momentos de crise', 'Visão inovadora pioneira', 'Autoconfiança magnética'],
    challenges: ['Impaciência com o ritmo alheio', 'Tendência a centralizar tarefas', 'Orgulho que dificulta pedir ajuda'],
    prosperityImpact: 'Sua prosperidade explode quando você lidera ou cria seu próprio modelo de negócio, em vez de depender da aprovação de terceiros.'
  },
  2: {
    name: 'O Mediador & Pacificador Sutil',
    archetype: 'O Diplomata Magnético',
    essence: 'Vibração de sinergia, empatia refinada e tato social. Sua mente capta detalhes e nuances invisíveis à maioria, tornando você indispensável na mediação de grandes acordos.',
    strengths: ['Negociação de alto nível sem confronto', 'Capacidade ímpar de criar alianças', 'Intuição relacional aguda', 'Paciência estratégica'],
    challenges: ['Hesitação por medo de conflito', 'Subestimar o próprio valor', 'Absorver a sobrecarga emocional alheia'],
    prosperityImpact: 'Sua riqueza multiplica através de sociedades ganha-ganha, intermediações, consultorias e relações comerciais de confiança irrevogável.'
  },
  3: {
    name: 'O Comunicador & Alquimista Criativo',
    archetype: 'O Farol de Entusiasmo',
    essence: 'Dom do verbo, da estética e da expressão magnética. Você transforma ideias abstratas em narrativas envolventes que inspiram, atraem clientes e conquistam multidões.',
    strengths: ['Carisma natural contagiante', 'Facilidade para vendas e branding', 'Criatividade multidisciplinar', 'Pensamento lateral engenhoso'],
    challenges: ['Dispersão de energia em muitas frentes', 'Desorganização com despesas cotidianas', 'Oscilação entre euforia e autocrítica'],
    prosperityImpact: 'O dinheiro flui através de canais onde sua imagem, voz ou criação intelectual são os protagonistas. Quanto mais expressar sua verdade, maior a abundância.'
  },
  4: {
    name: 'O Construtor & Mestre da Ordem',
    archetype: 'O Alicerce Inabalável',
    essence: 'Estabilidade, método prático e execução impecável. Você tem a capacidade rara de pegar um sonho e transformá-lo em uma empresa ou estrutura sólida tijolo por tijolo.',
    strengths: ['Disciplina férrea de longo prazo', 'Atenção cirúrgica a processos', 'Confiabilidade extrema no mercado', 'Visão patrimonial sustentável'],
    challenges: ['Resistência rígida a mudanças repentinas', 'Medo excessivo de riscos calculados', 'Excesso de cobrança pessoal'],
    prosperityImpact: 'Sua prosperidade é cumulativa e patrimonial. Você acumula ativos consistentes, imóveis e negócios com bases operacionais blindadas.'
  },
  5: {
    name: 'O Visionário Livre & Agente de Transformação',
    archetype: 'O Catalisador Dinâmico',
    essence: 'Vibração da liberdade, adaptação instantânea e quebra de paradigmas. Você prospera no movimento, na inovação de mercado e na tradução de novidades globais.',
    strengths: ['Agilidade mental para pivotar estratégias', 'Faro para tendências emergentes', 'Coragem para romper convenções', 'Networking global diversificado'],
    challenges: ['Inquietação constante que impede a consolidação', 'Tédio com rotinas administrativas', 'Impulsividade financeira momentânea'],
    prosperityImpact: 'Sua abundância surge quando você conecta mercados, produtos digitais, comércio internacional ou modelos de renda flexíveis que não prendem seu tempo.'
  },
  6: {
    name: 'O Guardião da Harmonia & Gestor de Valor',
    archetype: 'O Nutridor de Ecossistemas',
    essence: 'Responsabilidade, senso de justiça e beleza estruturada. Seu propósito está em elevar os padrões de vida, cuidar da comunidade e oferecer serviços de altíssima confiança.',
    strengths: ['Capacidade de construir fidelidade eterna', 'Senso estético e de hospitalidade requintado', 'Integridade inegociável em negócios', 'Gestão de pessoas empática'],
    challenges: ['Dificuldade em cobrar o preço justo por benevolência', 'Carregar problemas financeiros de parentes', 'Perfeccionismo paralisante'],
    prosperityImpact: 'Seu faturamento é potencializado quando seus clientes sentem acolhimento, excelência e suporte incomparável. Negócios focados em bem-estar e serviço nobre prosperam com você.'
  },
  7: {
    name: 'O Pensador Estratégico & Mestre do Saber',
    archetype: 'O Alquimista Mental',
    essence: 'Busca incessante pela verdade, rigor analítico e sabedoria metafísica. Você enxerga os bastidores invisíveis da realidade e domina matérias complexas com maestria singular.',
    strengths: ['Profundidade intelectual de vanguarda', 'Intuição precisa para evitar golpes', 'Foco investigativo incomparável', 'Autoridade técnica natural'],
    challenges: ['Isolamento excessivo que trava parcerias', 'Ceticismo exagerado com o sucesso financeiro', 'Dificuldade em simplificar suas ideias'],
    prosperityImpact: 'Você monetiza através da especialização máxima: consultorias estratégicas, propriedade intelectual, perícias, desenvolvimento de metodologias e soluções exclusivas.'
  },
  8: {
    name: 'O Soberano da Realização & Mestre do Poder',
    archetype: 'O Construtor de Impérios',
    essence: 'Número cósmico da manifestação material, governança e abundância ilimitada. Você possui o termostato financeiro mais potente da numerologia, apto a gerir grandes recursos e liderar corporações.',
    strengths: ['Visão macro de escala e lucratividade', 'Resiliência estoica sob pressão extrema', 'Dom de transformar esforço em capital', 'Postura executiva dominante'],
    challenges: ['Materialismo ou obsessão exclusiva pelo controle', 'Dureza na cobrança de subordinados', 'Bloqueios emocionais na vulnerabilidade'],
    prosperityImpact: 'Sua prosperidade não tem teto. O dinheiro é uma ferramenta natural em suas mãos para erguer estruturas que geram empregos, riquezas e impacto duradouro.'
  },
  9: {
    name: 'O Sábio Humanitário & Mestre Universal',
    archetype: 'O Guia Transcendente',
    essence: 'Compreensão holística do universo, generosidade sublime e magnetismo espiritual. Você carrega a síntese de todos os números e atrai prosperidade como consequência de servir causas maiores.',
    strengths: ['Carisma humanitário universal', 'Desprendimento que atrai fluxos misteriosos de riqueza', 'Capacidade de ensinar e inspirar legiões', 'Visão planetária ampla'],
    challenges: ['Dificuldade em gerenciar detalhes mundanos', 'Melancolia diante das imperfeições do mundo', 'Recusa inconsciente em acumular riqueza pessoal'],
    prosperityImpact: 'A abundância chega em torrentes quando seu modelo de ganhos está atrelado à transformação de vidas, educação, impacto social e projetos de grande escala ética.'
  },
  11: {
    name: 'Número Mestre 11: O Canal Intuitivo & Farol Cósmico',
    archetype: 'O Iluminador Visionário',
    essence: 'Frequência espiritual elevada de clarividência, pioneirismo iluminado e inspiração que desperta consciências. Você recebe lampejos de intuição que antecipam o futuro.',
    strengths: ['Intuição profética e percepção quântica', 'Capacidade de inspirar revoluções de pensamento', 'Magnetismo espiritual potente', 'Ponte entre o invisível e o visível'],
    challenges: ['Tensão nervosa provocada pela alta voltagem energética', 'Síndrome do impostor em momentos decisivos', 'Dúvida paralisante sobre a própria missão'],
    prosperityImpact: 'Sua prosperidade se ancora em negócios inspiradores, mentorias de alto impacto, tecnologias disruptivas e liderança de movimentos com propósito espiritual e moral.'
  },
  22: {
    name: 'Número Mestre 22: O Grande Arquiteto Material',
    archetype: 'O Construtor de Utopias Práticas',
    essence: 'A mais poderosa vibração de materialização do universo. Você une a intuição do 11 com a capacidade executiva prática do 4 para transformar visões colossais em infraestruturas reais no plano físico.',
    strengths: ['Capacidade de executar megaprojetos', 'Visão sistêmica de engenharia e civilização', 'Resistência ilimitada e autoridade global', 'Manifestação de riqueza monumental'],
    challenges: ['Sensação de peso esmagador pela escala das responsabilidades', 'Medo de fracassar em escala pública', 'Autocobrança implacável'],
    prosperityImpact: 'Você atrai quantias exponenciais ao liderar projetos de grande envergadura, ecossistemas industriais, fundações, plataformas digitais ou empreendimentos imobiliários transformadores.'
  },
  33: {
    name: 'Número Mestre 33: O Mestre da Cura & Amor Cósmico',
    archetype: 'O Avatar de Elevação Humana',
    essence: 'Frequência de compaixão cósmica e maestria do serviço supremo. Uma rara vibração que atrai bênçãos divinas quando direcionada ao alívio do sofrimento e elevação espiritual da humanidade.',
    strengths: ['Carisma de liderança espiritual e moral', 'Sabedoria desinteressada e poder curativo', 'Atração de patronos e recursos abundantes', 'Legado imortal'],
    challenges: ['Martírio ou esquecimento das próprias necessidades físicas', 'Exaustão por doar além dos limites', 'Dificuldade em viver sob regras ordinárias'],
    prosperityImpact: 'O universo financia sua existência de forma miraculosa quando seus dons são consagrados à educação transformadora, saúde integral e expansão da consciência planetária.'
  }
};

// Generate complete prosperity diagnosis
export function generateProsperityDiagnosis(lifePathNum: number, expressionNum: number, soulNum: number): ProsperityDiagnosis {
  // Score based on harmonized numbers (72 to 98)
  const baseScore = 70 + ((lifePathNum * 3 + expressionNum * 2 + soulNum) % 27);
  const score = Math.min(98, Math.max(72, baseScore));

  const archetypesByLifePath: Record<number, { title: string; desc: string; blocks: string[]; powers: string[]; guidance: string }> = {
    1: {
      title: 'O Empreendedor Soberano & Criador de Nichos',
      desc: 'Sua aura financeira é alimentada pela autonomia absoluta. Ganhar dinheiro para você é um jogo de pioneirismo e desbravamento.',
      blocks: [
        'Acreditar que precisa pedir permissão ou validação para cobrar preços altos',
        'Tentar agradar a todos em vez de segmentar um público fiel que valoriza exclusividade',
        'Dificuldade de delegar, sobrecarregando a própria saúde e travando o teto de faturamento'
      ],
      powers: [
        'Capacidade de iniciar negócios do absoluto zero com tração acelerada',
        'Autoridade magnética ao apresentar propostas audaciosas',
        'Velocidade ímpar de adaptação quando uma estratégia não performa'
      ],
      guidance: 'Afirme diariamente: "Eu sou a autoridade máxima em meu destino financeiro. O dinheiro flui para mim com velocidade e retribui minha coragem."'
    },
    2: {
      title: 'O Articulador Estratégico & Mestre dos Contratos',
      desc: 'Sua chave de riqueza reside na capacidade de construir pontes invisíveis entre pessoas, recursos e oportunidades de alto valor.',
      blocks: [
        'Medo de dizer "não" e assumir despesas ou prejuízos por pura complacência',
        'Cobrar valores abaixo do mercado por timidez de valorizar sua consultoria e apoio',
        'Esperar que o parceiro tome todas as iniciativas materiais'
      ],
      powers: [
        'Facilidade para fechar alianças altamente lucrativas em qualquer segmento',
        'Percepção psicológica aguçada para saber exatamente o que a outra parte deseja',
        'Habilidade de converter conflitos comerciais em acordos multimilionários'
      ],
      guidance: 'Afirme diariamente: "Minhas parcerias são fontes de riqueza e respeito mútuo. Eu recebo proporcionalmente à harmonia e valor que gero."'
    },
    3: {
      title: 'O Alquimista da Influência & Capital Criativo',
      desc: 'Sua prosperidade é proporcional à sua capacidade de comunicar, entreter e conectar emocionalmente o mercado aos seus produtos e serviços.',
      blocks: [
        'Vazar dinheiro com gastos impulsivos para suprir carências emocionais passageiras',
        'Iniciar dezenas de projetos lucrativos e abandonar antes da maturação',
        'Duvidar do valor real da sua criatividade por compará-la com métodos burocráticos'
      ],
      powers: [
        'Poder hipnótico de persuasão em palestras, vídeos e apresentações',
        'Capacidade inata de transformar qualquer conhecimento complexo em produto atrativo',
        'Networking expansivo que traz convites de negócios inesperados'
      ],
      guidance: 'Afirme diariamente: "Minha voz gera riqueza. Minha criatividade é uma fonte inesgotável de abundância material e alegria."'
    },
    4: {
      title: 'O Arquiteto Patrimonial & Mestre da Solidez',
      desc: 'Seu código financeiro é a construção de ativos inquebráveis. Você nasceu para administrar com disciplina e acumular bens duradouros.',
      blocks: [
        'Apego excessivo à segurança a ponto de recusar investimentos de alta rentabilidade',
        'Crença de que só o esforço braçal exaustivo gera dinheiro honrado',
        'Demorar demais para lançar soluções perfeccionistas que já poderiam estar faturando'
      ],
      powers: [
        'Blindagem financeira e controle estrito de fluxo de caixa que evita perdas',
        'Capacidade de organizar operações caóticas em máquinas de lucro recorrente',
        'Visão patrimonial de longo prazo que cria reservas geracionais'
      ],
      guidance: 'Afirme diariamente: "Minha disciplina constrói fortunas sustentáveis. Eu permito que o dinheiro trabalhe para mim com leveza e fluxo contínuo."'
    },
    5: {
      title: 'O Empreendedor Global & Alquimista de Oportunidades',
      desc: 'Sua abundância está no dinamismo. Riqueza para você significa liberdade geográfica, financeira e mental para explorar o mundo.',
      blocks: [
        'Sensação de sufocamento que faz você sabotar fontes de renda estáveis por tédio',
        'Falta de planejamento de fluxo de caixa para momentos de baixa sazonal',
        'Dispersão de capital em aventuras sem análise de risco preliminar'
      ],
      powers: [
        'Faro cirúrgico para surfar ondas emergentes antes que a massa perceba',
        'Habilidade para internacionalizar serviços e lucrar em moedas fortes',
        'Facilidade para vender qualquer produto através de abordagens frescas e magnéticas'
      ],
      guidance: 'Afirme diariamente: "Eu sou livre e abundante. A inovação é meu veículo de riqueza e cada mudança multiplica meu patrimônio."'
    },
    6: {
      title: 'O Guardião de Valor & Construtor de Ecossistemas Fidedignos',
      desc: 'Sua frequência monetária reverbera nos serviços de bem-estar, estética, gastronomia, família e soluções éticas de alta consideração.',
      blocks: [
        'Sentimento de culpa inconsciente ao acumular riqueza enquanto outros sofrem',
        'Prestar consultorias ou favores profissionais gratuitos indefinidamente',
        'Carregar dependentes financeiros que drenam seu capital produtivo'
      ],
      powers: [
        'Criação de clientes e alunos apaixonados que compram de você para sempre',
        'Senso de design, acolhimento e sofisticação que permite aplicar tickets premium',
        'Credibilidade pessoal que funciona como a melhor estratégia de marketing'
      ],
      guidance: 'Afirme diariamente: "Eu mereço prosperar abundantemente. Quanto mais próspero sou, mais luz e suporte entrego àqueles que amo."'
    },
    7: {
      title: 'O Estrategista Científico & Mestre da Sabedoria',
      desc: 'Sua riqueza decorre do alto valor agregado da sua propriedade intelectual, métodos exclusivos e consultorias especializadas de topo de funil.',
      blocks: [
        'Desprezar o marketing por achar que a competência técnica deveria se vender sozinha',
        'Crença secreta de que dinheiro é vulgar ou corrompe a pureza do saber',
        'Hesitação em embalar seu conhecimento em produtos digitais de larga escala'
      ],
      powers: [
        'Cobrança de honorários de elite pelo nível inalcançável de precisão de suas respostas',
        'Diagnósticos infalíveis que economizam fortunas para grandes empresas',
        'Visão intuitiva para antecipar fraudes e ciladas financeiras com facilidade'
      ],
      guidance: 'Afirme diariamente: "Meu conhecimento é sagrado e altamente valioso. O universo me recompensa com riquezas pela sabedoria que compartilho."'
    },
    8: {
      title: 'O Magnata Cósmico & Comandante de Recursos',
      desc: 'Sua mente foi calibrada para a escala, o investimento em grande porte e a materialização concreta do poder financeiro.',
      blocks: [
        'Medo inconsciente de repetir falências ou abusos de poder de antepassados',
        'Resistir a momentos de baixa econômica com orgulho em vez de flexibilidade',
        'Negligenciar o descanso e relacionamentos afetivos em prol do trabalho ininterrupto'
      ],
      powers: [
        'Coragem inabalável para alocar grandes volumes de capital com retorno multiplicado',
        'Facilidade para lidar com figuras de autoridade e fundos de investimento',
        'Foco absoluto em resultados tangíveis e metas de faturamento milionárias'
      ],
      guidance: 'Afirme diariamente: "Eu sou um canal limpo e desimpedido para a circulação de milhões. O poder e a riqueza são bênçãos que operam a meu favor."'
    },
    9: {
      title: 'O Benfeitor Magnético & Líder de Legado Universal',
      desc: 'Você atrai prosperidade monumental quando suas iniciativas carregam um propósito nobre de transformação social, ecológica ou cultural.',
      blocks: [
        'Pensar pequeno ou limitar-se a negócios locais sem impacto ético claro',
        'Dificuldade de fechar ciclos que já cumpriram seu papel e só trazem prejuízos',
        'Desatenção com contratos e cláusulas jurídicas fundamentais'
      ],
      powers: [
        'Magnetismo cósmico que atrai doações, investidores-anjo e patrocinadores mundiais',
        'Habilidade de mobilizar multidões em prol de uma visão comum',
        'Intuição afiada para criar projetos que se tornam patrimônio cultural duradouro'
      ],
      guidance: 'Afirme diariamente: "Eu recebo em abundância para transbordar ao mundo. O dinheiro serve ao meu propósito sagrado e minha prosperidade é ilimitada."'
    },
    11: {
      title: 'O Visionário Quântico & Canal de Prosperidade Iluminada',
      desc: 'Sua frequência conecta ideias de mundos superiores à realidade comercial moderna, abrindo mercados inovadores no setor de mentoria e tecnologia.',
      blocks: [
        'Paralisia por excesso de ideias geniais sem aterramento prático e financeiro',
        'Dúvida persistente sobre se as pessoas estão prontas para sua visão de vanguarda',
        'Medo de exposição pública que impede o crescimento das suas vendas'
      ],
      powers: [
        'Capacidade de captar soluções comerciais que se tornam o padrão nos próximos anos',
        'Magnetismo oratório que converte céticos em seguidores leais',
        'Ativação imediata da sincronicidade: o cliente certo aparece no momento exato'
      ],
      guidance: 'Afirme diariamente: "Minha luz espiritual é a raiz da minha prosperidade material. Eu manifesto milagres financeiros com serenidade e propósito."'
    },
    22: {
      title: 'O Titã Construtor & Criador de Ecossistemas',
      desc: 'Você é o mestre da manifestação em escala mundial. Pequenas metas não saciam sua alma: você veio para erguer impérios tangíveis.',
      blocks: [
        'Subestimar a própria capacidade e aceitar cargos ou remunerações medianas',
        'Medo da complexidade jurídica e tributária de grandes operações',
        'Falta de sócios à sua altura para sustentar a magnitude dos planos'
      ],
      powers: [
        'Engenharia financeira intuitiva capaz de alavancar ativos de alto valor',
        'Comando natural sobre equipes multidisciplinares com máxima eficiência',
        'Capacidade de deixar um legado material indelével que atravessa gerações'
      ],
      guidance: 'Afirme diariamente: "Minha visão materializa realidades grandiosas. O dinheiro e os recursos da terra estão a serviço dos grandes projetos que realizo."'
    },
    33: {
      title: 'O Mestre da Abundância Incondicional & Cura Financeira',
      desc: 'Sua vida é um instrumento de elevação. Toda a riqueza que toca suas mãos se multiplica e purifica as vidas ao redor.',
      blocks: [
        'Martirizar-se acreditando que a pobreza é um sinal de pureza moral',
        'Não aceitar recompensas materiais por trabalhos de cura e orientação humana',
        'Desgaste energético por falta de blindagem áurica contra vampirismo financeiro'
      ],
      powers: [
        'Atração natural de prosperidade por pura ressonância de gratidão e caridade',
        'Autoridade moral incomparável que abre portas em qualquer ambiente corporativo',
        'Poder de inspirar filantropia ativa e financiamentos espontâneos'
      ],
      guidance: 'Afirme diariamente: "Eu sou um condutor do Amor e da Abundância Divina. A riqueza me cerca e me fortalece para abençoar o mundo com generosidade."'
    }
  };

  const selectedArchetype = archetypesByLifePath[lifePathNum] || archetypesByLifePath[1];

  // Universal sacred codes tailored to abundance
  const sacredCodes = [
    {
      code: '520 741 8',
      purpose: 'Dinheiro Inesperado & Solução Imediata de Bloqueios',
      mantra: 'Foco na esfera dourada e repetição consciente das sequências 520 (dinheiro inesperado) e 741 (solução imediata).'
    },
    {
      code: '318 798',
      purpose: 'Ativação da Abundância Financeira Constante',
      mantra: 'Abertura dos canais de recepção material. Repetir 28 vezes ao acordar e ao deitar.'
    },
    {
      code: '71427321893',
      purpose: 'Normalização das Finanças e Multiplicação de Ativos',
      mantra: 'Ressonância com a ordem divina da prosperidade, neutralizando vibrações de escassez hereditária.'
    }
  ];

  return {
    score,
    archetype: selectedArchetype.title,
    archetypeDescription: selectedArchetype.desc,
    financialBlocks: selectedArchetype.blocks,
    abundancePotential: `Com pontuação vibracional de ${score}/100, sua assinatura numerológica possui altíssima ressonância com riqueza material, necessitando apenas do desbloqueio de velhos contratos mentais de escassez e aplicação do seu arquétipo de liderança.`,
    monetizationSuperpowers: selectedArchetype.powers,
    sacredCodes,
    moneyMindsetGuidance: selectedArchetype.guidance
  };
}

// Calculate Name & Signature Optimization for Prosperity
export function calculateNameOptimization(fullName: string, currentExpression: number): NameOptimization {
  const parts = fullName.trim().split(/\s+/);
  const firstName = parts[0] || 'Nome';
  const lastName = parts.length > 1 ? parts[parts.length - 1] : '';

  // Determine reduced current expression (1-9)
  const baseCurr = currentExpression === 11 ? 2 : currentExpression === 22 ? 4 : currentExpression === 33 ? 6 : currentExpression;
  
  // Target 8 (The Sovereign Archetype of Maximum Material Wealth, Authority, and Financial Magnetism)
  let targetExpression = 8;
  let targetArchetype = 'Número 8: O Soberano da Riqueza & Prosperidade Material';
  let neededVal = ((8 - (baseCurr % 9)) + 9) % 9;
  
  if (neededVal === 0) {
    // Current is already vibrating on 8! Target master vibration 33 or reinforce with 1 (Solar Leadership)
    targetExpression = 8;
    targetArchetype = 'Número 8: Potencial Máximo de Riqueza Ativo (Consagração & Selamento)';
    neededVal = 8; // Double vibration
  }

  const letterOptionsByValue: Record<number, { letter: string; charDesc: string }> = {
    1: { letter: 'A', charDesc: 'A (Vibração 1 - Liderança, Iniciativa Solar e Magnetismo Próprio)' },
    2: { letter: 'B', charDesc: 'B (Vibração 2 - Diplomacia, Parcerias Lucrativas e Equilíbrio)' },
    3: { letter: 'L', charDesc: 'L (Vibração 3 - Expansão, Multiplicação Criativa e Comunicação)' },
    4: { letter: 'M', charDesc: 'M (Vibração 4 - Estrutura Sólida, Segurança e Patrimônio Duradouro)' },
    5: { letter: 'N', charDesc: 'N (Vibração 5 - Movimento Financeiro, Oportunidades e Inovação)' },
    6: { letter: 'O', charDesc: 'O (Vibração 6 - Harmonia Familiar, Fidelização e Prosperidade Afetiva)' },
    7: { letter: 'Y', charDesc: 'Y (Vibração 7 - Sabedoria Estratégica, Intuição para Negócios e Vitória)' },
    8: { letter: 'H', charDesc: 'H (Vibração 8 - Poder Executivo, Riqueza Material e Soberania)' },
    9: { letter: 'R', charDesc: 'R (Vibração 9 - Realização Plena, Alcance Universal e Fartura)' },
  };

  const chosen = letterOptionsByValue[neededVal] || letterOptionsByValue[8];

  // Suggest social name / signature adjustment
  let suggestedName = '';
  if (parts.length > 2) {
    // e.g., João P. Silva or João L. Silva
    suggestedName = `${firstName} ${chosen.letter}. ${lastName}`;
  } else if (lastName) {
    suggestedName = `${firstName} ${chosen.letter} ${lastName}`;
  } else {
    suggestedName = `${firstName} ${chosen.letter}.`;
  }

  const metaphysicalRationale = `Seu nome de batismo atualmente vibra na Expressão ${currentExpression}. Ao introduzir a vibração da letra "${chosen.letter}" (valor pitagórico ${neededVal}), sua frequência vocacional é elevada e recalculada para o Número 8 — a vibração suprema dos grandes realizadores, do poder de atração financeira, da justiça material e do sucesso comercial. Essa sintonização quebra qualquer estagnação monetária residual e coloca você em rota direta com altos rendimentos e autoridade reconhecida no mercado.`;

  const signatureGuideline = `Assine sempre com inclinação ascendente (ângulo de 35° a 45° para o alto e para a direita), projetando o vetor de ascensão patrimonial contínua. Inicie com letras maiúsculas firmes e bem desenhadas. Nunca passe traços cruzando o próprio nome ao meio (o que energeticamete gera cortes e autosabotagem). Finalize a assinatura com um sublinhado reto e contínuo por baixo, ancorando a base sólida de sustento e segurança financeira, sem colocar ponto final descendente.`;

  const practicalActionPlan = [
    `Adote a assinatura "${suggestedName}" em seus perfis profissionais (LinkedIn, Instagram, WhatsApp Comercial) e cartões de visita.`,
    `Pratique a nova assinatura num caderno de caligrafia por 21 dias seguidos, 7 vezes ao acordar, decretando: "Eu ativo a frequência da riqueza e da retidão material".`,
    `Utilize a nova grafia em documentos comerciais, orçamentos, propostas e contratos de prestação de serviços.`,
    `Sempre assine com caneta de tinta preta ou azul royal de ponta firme, transmitindo precisão e comando executivo.`
  ];

  return {
    originalName: fullName.trim(),
    currentExpression,
    targetExpression,
    targetArchetype,
    letterToAdd: chosen.letter,
    letterValue: neededVal,
    suggestedName,
    signatureGuideline,
    metaphysicalRationale,
    practicalActionPlan
  };
}

// Generate Energetic Baths
export function getEnergyBaths(): EnergyBath[] {
  return [
    {
      title: 'Banho 1: Descarrego Profundo & Desobstrução Áurica',
      category: 'limpeza',
      herbsAndIngredients: [
        '3 colheres de sopa de sal grosso marinho',
        '1 ramo de arruda fresca (ou guiné)',
        '1 ramo de alecrim fresco',
        '2 litros de água mineral morna'
      ],
      bestDayAndMoon: 'Sexta-feira ou Segunda-feira à noite • Preferência na Lua Minguante ou Nova',
      preparationRitual: 'Ferva a água. Ao levantar fervura, desligue o fogo imediatamente. Adicione o sal grosso e macere levemente a arruda e o alecrim entre as palmas das mãos, soltando os óleos essenciais. Cubra o recipiente com um pano branco e deixe em infusão por 20 minutos. Coe as ervas (devolvendo-as à natureza ou ao jardim). Tome seu banho de higiene normal e, em seguida, despeje a infusão morna EXCLUSIVAMENTE do pescoço para baixo (nunca na cabeça), respirando fundo 3 vezes.',
      prayerOrIntention: 'Mentalize com firmeza: "Em nome da Luz Divina, que toda carga pesada, inveja, miasma astral, cansaço acumulado e estagnação financeira sejam agora lavados e dissolvidos pelo poder da terra e das águas. Meu campo está limpo, puro e protegido."',
      spiritualBenefit: 'Remove acúmulos energéticos densos, estagnação de ambientes e miomas no duplo etérico, restaurando a leveza mental e a disposição vital imediata.'
    },
    {
      title: 'Banho 2: Atração de Ouro Cósmico & Prosperidade Financeira',
      category: 'prosperidade',
      herbsAndIngredients: [
        '3 paus de canela inteiros',
        '7 cravos-da-índia',
        '3 folhas secas de louro (o símbolo da vitória e do ouro)',
        '1 estrela de anis-estrelado',
        '1 colher de sopa de mel puro (ou açúcar mascavo)'
      ],
      bestDayAndMoon: 'Quinta-feira (regência de Júpiter) ou Domingo (regência do Sol) • Lua Crescente ou Lua Cheia',
      preparationRitual: 'Coloque 1,5 litros de água para ferver junto com a canela, os cravos, o louro e o anis-estrelado. Deixe ferver em fogo brando por 5 minutos para extrair todas as essências aromáticas de abundância. Desligue o fogo, adicione a colher de mel, mexa em sentido horário (atração de riqueza) e tampe por 15 minutos até ficar morno. Despeje do pescoço para baixo após o banho higiênico, sentindo o aroma quente e adocicado imantar seu biocampo com gotas douradas de luz. Não enxágue; dê leves toques com a toalha.',
      prayerOrIntention: 'Decrete em voz alta: "A prosperidade divina flui em minha direção de forma abundante e contínua. As portas do sucesso, dos negócios lucrativos e da fartura material estão abertas para mim. O ouro do Universo me reconhece e me abençoa."',
      spiritualBenefit: 'Eleva a frequência vibratória do chakra umbilical e plexo solar, atraindo clientes pagantes, surpresas financeiras positivas, reconhecimento e sorte profissional.'
    },
    {
      title: 'Banho 3: Magnetismo Pessoal, Brilho & Expansão de Luz da Aura',
      category: 'aura_luz',
      herbsAndIngredients: [
        'Pétalas de 1 rosa branca ou amarela',
        'Folhas frescas de manjericão cheiroso',
        '1 pitada de noz-moscada ralada',
        '3 gotas de essência de sândalo ou alfazema'
      ],
      bestDayAndMoon: 'Terça-feira ou Quarta-feira pela manhã • Qualquer fase lunar luminosa',
      preparationRitual: 'Aqueça 1 litro de água. Em uma tigela de louça ou vidro, coloque as pétalas e as folhas de manjericão. Despeje a água morna e macere suavemente as pétalas com as mãos em prece, visualizando sua aura brilhando como uma cúpula de sol translúcido. Pingue as gotas de alfazema ou sândalo e a pitada de noz-moscada. Banhe os ombros e o peito, permitindo que a água escorra pelo corpo suavemente.',
      prayerOrIntention: 'Afirme com serenidade: "Minha presença é fonte de paz, clareza e magnetismo benéfico. Eu irradio confiança, atraio conexões sinceras e caminho sob a proteção da sabedoria superior."',
      spiritualBenefit: 'Expande o diâmetro da aura em até 3 vezes, fecha fissuras energéticas causadas por estresse, conferindo charme, simpatia magnética e serenidade inabalável.'
    }
  ];
}

// YouTube mappings for Solfeggio & Prosperity Frequencies
export const FREQUENCY_YOUTUBE_MAP: Record<number, { url: string; embedId: string }> = {
  396: {
    url: 'https://youtu.be/gmJwaocIp58?si=KiJKeYNhGiiwvSnS',
    embedId: 'gmJwaocIp58'
  },
  432: {
    url: 'https://www.youtube.com/watch?v=HyI8o_EA3os',
    embedId: 'HyI8o_EA3os'
  },
  528: {
    url: 'https://www.youtube.com/watch?v=1MPRbX7ACh8&list=PLwDmgzun-F5U4Q1EtkARKvAsjY1VtUAQR',
    embedId: '1MPRbX7ACh8'
  },
  639: {
    url: 'https://www.youtube.com/watch?v=5T_QxR8aclQ',
    embedId: '5T_QxR8aclQ'
  },
  741: {
    url: 'https://www.youtube.com/watch?v=7NKNx3dESxQ',
    embedId: '7NKNx3dESxQ'
  },
  888: {
    url: 'https://www.youtube.com/watch?v=suzfhx5rHRg',
    embedId: 'suzfhx5rHRg'
  },
  8889: {
    url: 'https://www.youtube.com/watch?v=suzfhx5rHRg',
    embedId: 'suzfhx5rHRg'
  },
  963: {
    url: 'https://www.youtube.com/watch?v=xVh49FvD5FU',
    embedId: 'xVh49FvD5FU'
  }
};

export function getFrequencyYouTubeInfo(hz: number): { url: string; embedId: string } {
  if (FREQUENCY_YOUTUBE_MAP[hz]) {
    return FREQUENCY_YOUTUBE_MAP[hz];
  }
  return {
    url: `https://www.youtube.com/results?search_query=frequencia+${hz}+hz+solfeggio`,
    embedId: ''
  };
}

// Generate Sound Frequencies & Solfeggio Matrix
export function getSoundFrequencies(): SoundFrequency[] {
  return [
    {
      hz: 396,
      title: 'Libertação de Culpa, Ansiedade & Crenças de Escassez',
      element: 'Chakra Raiz (Muladhara)',
      sacredPurpose: 'Desintegra o medo da falta, inseguranças financeiras herdadas da ancestralidade e traumas do passado que travam a coragem de empreender e prosperar.',
      bestListeningTime: 'À noite, antes de dormir, ou em momentos de sobrecarga mental.',
      recommendation: 'Ouça por 15 a 20 minutos com fones de ouvido em volume médio-baixo.',
      youtubeUrl: 'https://youtu.be/gmJwaocIp58?si=KiJKeYNhGiiwvSnS',
      youtubeEmbedId: 'gmJwaocIp58'
    },
    {
      hz: 432,
      title: 'Afinação Harmônica Natural do Universo & Coerência Cardíaca',
      element: 'Equilíbrio Bioenergético Total',
      sacredPurpose: 'Vibra na matemática sagrada da natureza (razão áurea). Alinha os dois hemisférios cerebrais, reduz o cortisol e restaura a clareza para tomadas de decisão de alto impacto.',
      bestListeningTime: 'Durante o trabalho, estudos, leitura ou planejamento estratégico.',
      recommendation: 'Pode ser tocado como som ambiente contínuo no escritório ou em casa.',
      youtubeUrl: 'https://www.youtube.com/watch?v=HyI8o_EA3os',
      youtubeEmbedId: 'HyI8o_EA3os'
    },
    {
      hz: 528,
      title: 'A Frequência dos Milagres & Reparação Quântica do DNA',
      element: 'Chakra Cardíaco & Campo Morfogenético',
      sacredPurpose: 'A mais famosa das frequências de Solfeggio. Conhecida como o tom da transformação e milagres, desbloqueia a capacidade inata de atrair sincronismos afortunados e cura vibracional.',
      bestListeningTime: 'Pela manhã ao despertar, durante visualizações criativas de abundância.',
      recommendation: 'Pratique 15 minutos em estado meditativo focando na sua meta financeira.',
      youtubeUrl: 'https://www.youtube.com/watch?v=1MPRbX7ACh8&list=PLwDmgzun-F5U4Q1EtkARKvAsjY1VtUAQR',
      youtubeEmbedId: '1MPRbX7ACh8'
    },
    {
      hz: 639,
      title: 'Harmonia nos Relacionamentos, Sociedades & Conexões de Alma',
      element: 'Chakra Laríngeo & Comunicação Empática',
      sacredPurpose: 'Dissolve atritos interpessoais, magnetiza clientes nobres e parceiros de negócios honestos, harmonizando o ambiente familiar e corporativo.',
      bestListeningTime: 'Antes de reuniões importantes, negociações contratuais ou vendas.',
      recommendation: 'Ouça 10 minutos antes de fechar acordos para ancorar diplomacia e ganho mútuo.',
      youtubeUrl: 'https://www.youtube.com/watch?v=5T_QxR8aclQ',
      youtubeEmbedId: '5T_QxR8aclQ'
    },
    {
      hz: 741,
      title: 'Despertar da Intuição Profunda & Soluções Criativas',
      element: 'Chakra Frontal (Terceiro Olho)',
      sacredPurpose: 'Limpa toxinas eletromagnéticas mentais, aguça a percepção extra-sensorial e auxilia a enxergar saídas inovadoras onde outros enxergam apenas dificuldades.',
      bestListeningTime: 'Ao enfrentar dilemas complexos ou planejar novos projetos e empreendimentos.',
      recommendation: 'Combine com respirações profundas de 4 segundos inspirando e 4 expirando.',
      youtubeUrl: 'https://www.youtube.com/watch?v=7NKNx3dESxQ',
      youtubeEmbedId: '7NKNx3dESxQ'
    },
    {
      hz: 888,
      title: 'Frequência da Abundância Infinita & Código da Riqueza Crística',
      element: 'Vórtice da Manifestação Material',
      sacredPurpose: 'A vibração geométrica do número 8 multiplicado na trindade cósmica (888). Ativa o fluxo de prosperidade líquida, bens materiais, pagamentos inesperados e plenitude física.',
      bestListeningTime: 'Quintas-feiras e ao checar contas, faturamento ou investimentos.',
      recommendation: 'Sintonize enquanto visualiza o dinheiro fluindo com alegria e propósito elevado.',
      youtubeUrl: 'https://www.youtube.com/watch?v=suzfhx5rHRg',
      youtubeEmbedId: 'suzfhx5rHRg'
    },
    {
      hz: 963,
      title: 'Conexão com a Consciência Divina & Luz da Glândula Pineal',
      element: 'Chakra Coronário (Sahasrara)',
      sacredPurpose: 'Religa o ser à Fonte Criadora Suprema. Concede a certeza interior de que nada falta, pois você está eternamente amparado pela Providência do Criador.',
      bestListeningTime: 'Antes de orações, meditações profundas ou ao recolher-se à noite.',
      recommendation: 'Permita que o som ressoe suavemente, promovendo um sono reparador de alta frequência.',
      youtubeUrl: 'https://www.youtube.com/watch?v=xVh49FvD5FU',
      youtubeEmbedId: 'xVh49FvD5FU'
    }
  ];
}

// Generate Sacred Symbols and Biblical Scriptures of Prosperity
export function getSacredSymbolsAndVerses(lifePath: number, expression: number): SacredSymbolAndVerse[] {
  return [
    {
      symbolName: 'Selo de Salomão / Estrela de Davi (Magen David Sagrado)',
      biblicalReference: '1 Reis 4:29-30 • Provérbios 2:6',
      scriptureText: 'E deu Deus a Salomão sabedoria, e muitíssimo entendimento, e largueza de coração, como a areia que está na praia do mar. E era a sabedoria de Salomão maior do que a sabedoria de todos os do oriente e do que toda a sabedoria dos egípcios.',
      spiritualMeaning: 'O entrelaçamento perfeito do triângulo apontado para cima (a aspiração humana e a fé) com o triângulo apontado para baixo (a graça e o derramamento de bênçãos celestiais). É o mais poderoso selo de blindagem contra espíritos de ruína e escudo perpétuo de prosperidade justa.',
      applicationGuidance: 'Mantenha mentalmente este selo dourado posicionado no centro do seu peito ao entrar em bancos, assinar acordos e realizar investimentos.'
    },
    {
      symbolName: 'O Olho da Providência & Triângulo Dourado da Santíssima Trindade',
      biblicalReference: 'Salmo 33:18-19 • Zacarias 4:10',
      scriptureText: 'Eis que os olhos do Senhor estão sobre os que o temem, sobre os que esperam na sua misericórdia; para livrar as suas almas da morte e para os conservar vivos na fome.',
      spiritualMeaning: 'Representa a Onipresença amorosa de Deus que tudo vê e providencia o sustento antes mesmo da necessidade bater à porta. Lembra que a verdadeira fonte de toda provisão é eterna e inesgotável.',
      applicationGuidance: 'Ao amanhecer, contemple a luz do sol e decrete: "Os olhos do Criador me vigiam para o bem e Sua providência ilumina cada passo da minha jornada".'
    },
    {
      symbolName: 'A Cruz Sagrada com Alfa e Ômega (O Princípio e o Fim)',
      biblicalReference: 'Apocalipse 3:8 • Apocalipse 22:13',
      scriptureText: 'Conheço as tuas obras; eis que diante de ti pus uma porta aberta, a qual ninguém pode fechar; tendo pouca força, guardaste a minha palavra e não negaste o meu nome. Eu sou o Alfa e o Ômega, o Princípio e o Fim, o Primeiro e o Derradeiro.',
      spiritualMeaning: 'Consagração absoluta de vitória sobre qualquer escassez. As portas abertas por decreto do Altíssimo para o seu propósito nunca poderão ser trancadas pela inveja ou por circunstâncias temporárias.',
      applicationGuidance: 'Consagre seus talentos e seu trabalho a Deus todas as segundas-feiras, confiando que Ele é quem abre os caminhos onde não há caminho.'
    },
    {
      symbolName: 'Promessa da Aliança de Fartura nos Celeiros',
      biblicalReference: 'Provérbios 3:9-10 • Malaquias 3:10',
      scriptureText: 'Honra ao Senhor com a tua fazenda e com as primícias de toda a tua renda; e se encherão os teus celeiros abundantemente, e transbordarão de mosto os teus lagares.',
      spiritualMeaning: 'O princípio universal da sementeira e da colheita espiritual: a generosidade e o respeito aos frutos do trabalho multiplicam os recursos e fecham as brechas para perdas inesperadas.',
      applicationGuidance: 'Pratique a generosidade consciente, abençoando outros com parte do que você recebe para manter a roda da abundância sempre em rotação.'
    },
    {
      symbolName: 'A Força Divina para Adquirir Riquezas',
      biblicalReference: 'Deuteronômio 8:18 • Filipenses 4:19',
      scriptureText: 'Antes te lembrarás do Senhor teu Deus, porque ele é o que te dá força para adquirires riquezas; para confirmar a sua aliança, que jurou a teus pais, como hoje se vê. E o meu Deus, segundo as suas riquezas, suprirá todas as vossas necessidades em glória, por Cristo Jesus.',
      spiritualMeaning: 'A riqueza é um instrumento sagrado de bênção quando exercida com retidão, sabedoria e generosidade, permitindo que você cumpra plenamente o seu chamado vocacional nesta terra.',
      applicationGuidance: 'Agradeça diariamente pelas forças físicas, clareza mental e criatividade que o Criador lhe concedeu para gerar valor no mundo.'
    }
  ];
}

// Generate the complete numerology report
export function generateNumerologyReport(inputs: UserInputs): NumerologyReport {
  const lifePath = calculateLifePath(inputs.birthDate);
  const expression = calculateExpression(inputs.fullName);
  const soulUrge = calculateSoulUrge(inputs.fullName);
  const personality = calculatePersonality(inputs.fullName);
  const personalYear = calculatePersonalYear(inputs.birthDate);

  const lifePathProfile = NUMBER_PROFILES[lifePath.number] || NUMBER_PROFILES[1];
  const expressionProfile = NUMBER_PROFILES[expression.number] || NUMBER_PROFILES[1];
  const soulUrgeProfile = NUMBER_PROFILES[soulUrge.number] || NUMBER_PROFILES[1];
  const personalityProfile = NUMBER_PROFILES[personality.number] || NUMBER_PROFILES[1];

  const prosperity = generateProsperityDiagnosis(lifePath.number, expression.number, soulUrge.number);

  // Format date to Brazilian locale
  const [y, m, d] = inputs.birthDate.split('-');
  const formattedDate = `${d}/${m}/${y}`;

  // Unique referral slug based on sanitized name
  const nameSlug = normalizeText(inputs.fullName).slice(0, 10).toLowerCase() || 'mapa';
  const referralId = `${nameSlug}-${lifePath.number}`;

  return {
    user: {
      fullName: inputs.fullName.trim(),
      birthDate: inputs.birthDate,
      birthTime: inputs.birthTime,
      formattedDate,
      email: inputs.email ? inputs.email.trim() : undefined,
      phone: inputs.phone ? inputs.phone.trim() : undefined
    },
    generatedAt: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    referralId,
    lifePath: {
      number: lifePath.number,
      isMaster: lifePath.isMaster,
      name: lifePathProfile.name,
      archetype: lifePathProfile.archetype,
      calculationExplanation: lifePath.explanation,
      essence: lifePathProfile.essence,
      strengths: lifePathProfile.strengths,
      challenges: lifePathProfile.challenges,
      prosperityImpact: lifePathProfile.prosperityImpact
    },
    expression: {
      number: expression.number,
      isMaster: expression.isMaster,
      name: expressionProfile.name,
      archetype: expressionProfile.archetype,
      calculationExplanation: expression.explanation,
      essence: expressionProfile.essence,
      strengths: expressionProfile.strengths,
      challenges: expressionProfile.challenges,
      prosperityImpact: expressionProfile.prosperityImpact
    },
    soulUrge: {
      number: soulUrge.number,
      isMaster: soulUrge.isMaster,
      name: soulUrgeProfile.name,
      archetype: soulUrgeProfile.archetype,
      calculationExplanation: soulUrge.explanation,
      essence: soulUrgeProfile.essence,
      strengths: soulUrgeProfile.strengths,
      challenges: soulUrgeProfile.challenges,
      prosperityImpact: soulUrgeProfile.prosperityImpact
    },
    personality: {
      number: personality.number,
      isMaster: personality.isMaster,
      name: personalityProfile.name,
      archetype: personalityProfile.archetype,
      calculationExplanation: personality.explanation,
      essence: personalityProfile.essence,
      strengths: personalityProfile.strengths,
      challenges: personalityProfile.challenges,
      prosperityImpact: personalityProfile.prosperityImpact
    },
    prosperity,
    personalYear,
    nameOptimization: calculateNameOptimization(inputs.fullName, expression.number),
    semesterLuckyNumbers: generateSemesterLuckyNumbers(inputs.birthDate, inputs.fullName, lifePath.number, personalYear.yearNumber),
    energyBaths: getEnergyBaths(),
    soundFrequencies: getSoundFrequencies(),
    sacredSymbolsAndVerses: getSacredSymbolsAndVerses(lifePath.number, expression.number),
    aura: calculateAuraProfile(lifePath.number, expression.number)
  };
}

export function generateSemesterLuckyNumbers(
  birthDate: string,
  fullName: string,
  lifePathNum: number,
  personalYearNum?: number
): SemesterLuckyNumbers {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 1 to 12
  const semesterNum = month <= 6 ? 1 : 2;
  const semesterLabel = `${semesterNum}º Semestre de ${year}`;

  // Deterministic seed based on birthDate, fullName, lifePath, year and semester
  const seedStr = `${birthDate.trim()}_${fullName.toUpperCase().trim()}_${lifePathNum}_${year}_S${semesterNum}`;
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) {
    seed = (seed * 31 + seedStr.charCodeAt(i)) >>> 0;
  }

  const chosen = new Set<number>();

  // Integrate the lifePathNum if within 1..60
  if (lifePathNum >= 1 && lifePathNum <= 60) {
    chosen.add(lifePathNum);
  }
  if (personalYearNum && personalYearNum >= 1 && personalYearNum <= 60 && chosen.size < 6) {
    chosen.add(personalYearNum);
  }

  // Linear congruential generator to pick distinct numbers between 1 and 60
  let current = seed;
  let attempts = 0;
  while (chosen.size < 6 && attempts < 2000) {
    attempts++;
    current = (current * 1664525 + 1013904223) >>> 0;
    const num = (current % 60) + 1; // 1 to 60
    chosen.add(num);
  }

  for (let n = 1; chosen.size < 6 && n <= 60; n++) {
    chosen.add(n);
  }

  const sortedNumbers = Array.from(chosen).slice(0, 6).sort((a, b) => a - b);
  const formattedNumbers = sortedNumbers.map((n) => n.toString().padStart(2, '0'));

  return {
    semesterLabel,
    numbers: sortedNumbers,
    formattedNumbers,
    metaphysicalPurpose: 'Chaves numéricas de sincronicidade vibracional para Mega-Sena, loterias, decisões de investimento, abertura de negócios e assinatura de contratos prósperos.',
    activationMantra: 'Eu sou a ressonância da sorte e da abundância sagrada. O Cosmos alinha números e oportunidades para minha vitória financeira.',
    bestDays: ['Quinta-feira (Dia de Júpiter - Expansão & Dinheiro)', 'Domingo (Dia do Sol - Vitória & Magnetismo)']
  };
}

export function calculateAuraProfile(
  lifePathNum: number,
  expressionNum: number,
  detectedHue?: number,
  capturedImageUrl?: string,
  fromCamera: boolean = false
): AuraReading {
  type AuraKey = 'dourado' | 'indigo' | 'esmeralda' | 'violeta' | 'azul' | 'ambar' | 'rosa' | 'magenta';
  let key: AuraKey = 'dourado';

  if (detectedHue !== undefined) {
    if (detectedHue >= 40 && detectedHue < 65) {
      key = 'dourado';
    } else if (detectedHue >= 65 && detectedHue < 160) {
      key = 'esmeralda';
    } else if (detectedHue >= 160 && detectedHue < 210) {
      key = 'azul';
    } else if (detectedHue >= 210 && detectedHue < 260) {
      key = 'indigo';
    } else if (detectedHue >= 260 && detectedHue < 300) {
      key = 'violeta';
    } else if (detectedHue >= 300 && detectedHue < 340) {
      key = 'magenta';
    } else if (detectedHue >= 340 || detectedHue < 20) {
      key = 'rosa';
    } else {
      key = 'ambar';
    }
  } else {
    if (lifePathNum === 1 || lifePathNum === 8 || expressionNum === 8) {
      key = 'dourado';
    } else if (lifePathNum === 7 || lifePathNum === 11 || expressionNum === 7) {
      key = 'indigo';
    } else if (lifePathNum === 4 || lifePathNum === 22 || expressionNum === 4) {
      key = 'ambar';
    } else if (lifePathNum === 5 || lifePathNum === 33 || expressionNum === 5) {
      key = 'magenta';
    } else if (lifePathNum === 2 || lifePathNum === 6 || expressionNum === 6) {
      key = 'rosa';
    } else if (lifePathNum === 3 || expressionNum === 3) {
      key = 'azul';
    } else if (lifePathNum === 9 || expressionNum === 9) {
      key = 'violeta';
    } else {
      key = 'esmeralda';
    }
  }

  const profiles: Record<AuraKey, Omit<AuraReading, 'captured' | 'capturedWithCamera' | 'capturedImageUrl'>> = {
    dourado: {
      primaryColorName: 'Dourado Solar (580nm)',
      colorHex: '#D4AF37',
      accentHex: '#FEF3C7',
      secondaryColorName: 'Âmbar Real Brilhante',
      secondaryHex: '#F59E0B',
      fieldExpansion: '2,8 metros (Campo Eletromagnético Expansivo & Radiante)',
      frequencyHz: '528 Hz / 741 Hz - Frequência de Milagres & Atração Magnética',
      vibrationalState: 'Alta Coerência Cardíaca, Lucidez Estratégica & Liderança Construtiva',
      auraArchetype: 'O Soberano Dourado (Magnetismo de Alta Renda & Autoridade)',
      freeTastingSummary: 'Sua aura irradia a frequência nobre do Dourado Solar, indicando um ciclo bioenergético de alta expansão mental, respeito inato e liderança construtiva. Este tom atrai o interesse espontâneo de tomadores de decisão e acelera oportunidades de fechamento comercial.',
      deepAnalysis: 'A emanação biofotônica Dourado Solar (580nm) sintoniza diretamente o Plexo Solar (Manipura) e o Coronário (Sahasrara). Ela reflete um indivíduo cuja presença física transmite solidez e prosperidade sem arrogância. Na Cabala e na Física Quântica, o dourado atua como um condutor de luz de alta densidade, dissolvendo indecisões financeiras e atraindo recursos com agilidade.',
      prosperityCorrelation: 'Cria uma aura de confiança incondicional. Clientes sentem segurança para confiar contratos de alto valor e investidores percebem seriedade imediata.',
      shieldingProtocol: 'Visualização da Cúpula Dourada de Espelhos: antes de compromissos importantes, mentalize uma esfera de luz dourada a 2 metros do seu corpo, refletindo qualquer inveja de volta à luz primordial.',
      recommendedCrystals: ['Pirita Solar', 'Citrino Natural', 'Olho de Tigre Dourado'],
      clothingHarmonization: 'Acessórios em ouro, tons quentes ou detalhes em amarelo mostarda durante negociações decisivas.'
    },
    indigo: {
      primaryColorName: 'Índigo Real Cósmico (430nm)',
      colorHex: '#4338CA',
      accentHex: '#E0E7FF',
      secondaryColorName: 'Azul Cobalto Profundo',
      secondaryHex: '#1E40AF',
      fieldExpansion: '2,5 metros (Campo Intuitivo Penetrante & Focado)',
      frequencyHz: '852 Hz - Despertar da Intuição Superior & Visão Estratégica',
      vibrationalState: 'Percepção Extrassensorial Lúcida & Discernimento Imediato',
      auraArchetype: 'O Visionário Místico (Clareza Precursora & Estratégia Oculta)',
      freeTastingSummary: 'Sua aura está impregnada pela vibração do Índigo Real Cósmico. Você está em um ápice de intuição e inteligência precursora. Seu campo sutil pressente tendências antes que se tornem óbvias, permitindo antecipar movimentos de mercado e proteger seu patrimônio com astúcia.',
      deepAnalysis: 'O tom Índigo Real expressa a plena atividade do Chakra Frontal (Ajna) com o campo eletromagnético da mente superior. Pessoas com essa aura têm uma capacidade singular de enxergar além das aparências, identificando com rapidez quem é confiável e quais projetos são verdadeiramente lucrativos a longo prazo.',
      prosperityCorrelation: 'Excelente para consultorias, inovação tecnológica, diagnóstico de problemas complexos e serviços intelectuais de altíssimo valor de mercado.',
      shieldingProtocol: 'Prática do Silêncio Estratégico: guarde seus próximos passos sob sigilo até a formalização contratual para não fragmentar a densidade do campo índigo.',
      recommendedCrystals: ['Lápis-Lazúli Afegão', 'Sodalita Cristalina', 'Safira Azul'],
      clothingHarmonization: 'Tons de azul marinho profundo e grafite, que preservam o foco e transmitem serenidade impassível.'
    },
    esmeralda: {
      primaryColorName: 'Verde Esmeralda Regenerador (520nm)',
      colorHex: '#059669',
      accentHex: '#D1FAE5',
      secondaryColorName: 'Verde Jade da Abundância',
      secondaryHex: '#047857',
      fieldExpansion: '2,7 metros (Campo Restaurador & Fértil)',
      frequencyHz: '639 Hz - Cura do Fluxo de Riqueza & Relacionamentos Prósperos',
      vibrationalState: 'Equilíbrio Emocional, Paz Financeira & Magnetismo Vital',
      auraArchetype: 'O Alquimista da Abundância (Multiplicação Concreta & Sustentável)',
      freeTastingSummary: 'Sua aura reflete a pulsação do Verde Esmeralda, a tonalidade sagrada da cura e da multiplicação de recursos. Bloqueios antigos de escassez estão sendo transmutados, permitindo que o dinheiro flua sem ansiedade e se fixe em investimentos duradouros.',
      deepAnalysis: 'O Verde Esmeralda faz o alinhamento perfeito entre o Chakra Cardíaco (Anahata) e a matéria tangível. É o tom dos empreendedores regenerativos e construtores de valor duradouro. Essa vibração atrai prosperidade sustentável, onde o sucesso profissional caminha de mãos dadas com a saúde e a serenidade íntima.',
      prosperityCorrelation: 'Desperta sensação imediata de empatia, honestidade e credibilidade. Clientes tornam-se fiéis e indicam espontaneamente seus serviços a terceiros.',
      shieldingProtocol: 'Banho de Alecrim com Folhas de Louro e sal marinho a cada 14 dias para desimpregnar miasmas de cobrança ou inveja de ambientes competitivos.',
      recommendedCrystals: ['Esmeralda Bruta', 'Malaquita Solar', 'Quartzo Verde'],
      clothingHarmonization: 'Verde oliva ou detalhes esmeralda em ocasiões onde construir harmonia e empatia seja a prioridade.'
    },
    violeta: {
      primaryColorName: 'Violeta Transmutador Cósmico (400nm)',
      colorHex: '#7C3AED',
      accentHex: '#EDE9FE',
      secondaryColorName: 'Púrpura Imperial Alquímica',
      secondaryHex: '#6D28D9',
      fieldExpansion: '3,1 metros (Campo de Alta Ressonância Espiritual & Proteção)',
      frequencyHz: '963 Hz / 888 Hz - Conexão Cósmica & Dissolução de Karmas',
      vibrationalState: 'Elevação de Consciência, Transmutação Rápida & Renascimento',
      auraArchetype: 'O Mago da Transmutação (Alquimia de Crises em Vitória Financeira)',
      freeTastingSummary: 'Sua aura vibra na frequência do Violeta Transmutador Cósmico. Você tem o raro poder de transformar adversidades em trampolins para novos negócios. Antigos padrões de escassez de sua árvore genealógica estão sendo purificados para abrir um ciclo de honra e riqueza.',
      deepAnalysis: 'A frequência Violeta (400nm) conecta o topo do crânio com a inteligência do Universo. Quem manifesta essa aura não é derrotado por crises: ao contrário, descobre nas brechas de momentos difíceis oportunidades que outros julgam inviáveis. É a aura clássica de quem faz grandes viradas de vida.',
      prosperityCorrelation: 'Acelera processos de transição de carreira, pivotagem de negócios e atração de mentores e parceiros de alto calibre.',
      shieldingProtocol: 'Meditação da Chama Violeta ao acordar: respire profundamente 7 vezes e mentalize um fogo violeta sagrado consumindo todo cansaço ou negatividade residual.',
      recommendedCrystals: ['Ametista Drusa', 'Fluorita Violeta', 'Charoita'],
      clothingHarmonization: 'Toques de lilás, roxo nobre ou acessórios prateados com pedras violetas.'
    },
    azul: {
      primaryColorName: 'Azul Celeste Cristalino (470nm)',
      colorHex: '#0284C7',
      accentHex: '#E0F2FE',
      secondaryColorName: 'Turquesa Radiante da Comunicação',
      secondaryHex: '#0891B2',
      fieldExpansion: '2,4 metros (Campo Vibracional de Eloquência & Verdade)',
      frequencyHz: '741 Hz - Despertar da Comunicação Magnética & Clareza de Ideias',
      vibrationalState: 'Paz Interior, Clareza Vocal & Firmeza de Propósito',
      auraArchetype: 'O Embaixador da Palavra (Magnetismo de Vendas & Negociação)',
      freeTastingSummary: 'Sua aura irradia o Azul Celeste Cristalino, a emanação do poder da voz e da verdade inabalável. Seu campo biofotônico está potencializando seu carisma verbal. Quando você expõe suas propostas com franqueza, resistências se dissolvem com notável facilidade.',
      deepAnalysis: 'O Azul Celeste expande o Chakra Laríngeo (Vishuddha). Sua maior alavanca financeira reside na arte da comunicação: apresentações, redação persuasiva, ensino ou negociação tête-à-tête. Seus maiores lucros chegam através de acordos claros e da reputação construída com idoneidade.',
      prosperityCorrelation: 'Poderoso magnetismo em reuniões, palestras, vídeos ou propostas escritas, conferindo ar de verdade irretorquível.',
      shieldingProtocol: 'Evite conversas infrutíferas e discussões ácidas que desgastam o vórtice da garganta. Beba água energizada pela luz solar em garrafa azul cobalto.',
      recommendedCrystals: ['Água-Marinha', 'Turquesa Tibetana', 'Cianita Azul'],
      clothingHarmonization: 'Camisas ou vestidos em azul claro ou azul pavão para reuniões formais de fechamento.'
    },
    ambar: {
      primaryColorName: 'Âmbar Dourado & Topázio Imperial (600nm)',
      colorHex: '#D97706',
      accentHex: '#FEF3C7',
      secondaryColorName: 'Terracota Solar de Firmeza',
      secondaryHex: '#B45309',
      fieldExpansion: '2,6 metros (Campo Terrestre de Estabilidade & Conquista)',
      frequencyHz: '528 Hz / 396 Hz - Materialização Concreta & Raiz Patrimonial',
      vibrationalState: 'Disciplina Imparável, Foco Pragmático & Realização Física',
      auraArchetype: 'O Construtor de Impérios (Patrimônio Sólido & Execução Metódica)',
      freeTastingSummary: 'Sua aura emana a estabilidade do Âmbar Dourado. Seu campo bioenergético está ancorado na terra, favorecendo investimentos em imóveis, acumulação metódica de reservas e assinatura de contratos de longo prazo que garantem tranquilidade para sua família.',
      deepAnalysis: 'O Âmbar Dourado conecta o Plexo Solar ao Chakra Raiz (Muladhara). Essa vibração não se dispersa com sonhos vazios: ela transforma trabalho focado em patrimônio tangível. Protege o consulente contra gastos impulsivos e confere paciência estratégica para construir riquezas geracionais.',
      prosperityCorrelation: 'Assegura que o capital conquistado seja retido e multiplicado de maneira segura, evitando perdas abruptas ou golpes.',
      shieldingProtocol: 'Contato descalço com a grama ou solo por 10 minutos semanais (aterramento / grounding) para descarregar o excesso de estresse e blindar o campo físico.',
      recommendedCrystals: ['Topázio Imperial', 'Jaspe Vermelho Terracota', 'Âmbar Báltico'],
      clothingHarmonization: 'Tons terrosos, caramelo, mel e mostarda profunda, que transmitem maturidade e solidez patrimonial.'
    },
    rosa: {
      primaryColorName: 'Rosa Crístico do Amor Incondicional (500nm)',
      colorHex: '#DB2777',
      accentHex: '#FCE7F3',
      secondaryColorName: 'Rosa Pêssego Dourado',
      secondaryHex: '#F472B6',
      fieldExpansion: '2,7 metros (Campo Atrativo de Fidelidade & Gentileza)',
      frequencyHz: '639 Hz / 528 Hz - Frequência do Coração & Ressonância Afetiva',
      vibrationalState: 'Carisma Gentil, Empatia Profunda & Magnetismo Relacional',
      auraArchetype: 'O Ímã de Conexões (Relacionamentos de Alto Retorno & Parcerias)',
      freeTastingSummary: 'Sua aura brilha no matiz do Rosa Crístico de Alta Frequência. Você está emitindo uma vibração de simpatia desarmante e nobreza de trato. Clientes e parceiros sentem profunda confiança e satisfação em negociar com você, gerando indicações espontâneas e fidelidade contínua.',
      deepAnalysis: 'O Rosa Crístico emana do centro do Chakra Cardíaco Superior. Ele quebra resistências em vendas sem necessidade de pressão agressiva. Quem atua sob este campo áurico encanta o cliente pelo cuidado autêntico e pela qualidade impecável da entrega, criando verdadeiros defensores da sua marca.',
      prosperityCorrelation: 'Multiplicação de negócios por recomendação direta, parcerias societárias leais e resolução pacífica de conflitos comerciais.',
      shieldingProtocol: 'Evite absorver desabafos e lamúrias de terceiros como se fossem seus. Lave pulsos e nuca com água fresca e sal rosa após reuniões carregadas.',
      recommendedCrystals: ['Quartzo Rosa Translúcido', 'Rodocrosita', 'Kunzita'],
      clothingHarmonization: 'Tons de quartzo rosa, rosé gold, pêssego ou branco puro para transmitir acessibilidade e afeto genuíno.'
    },
    magenta: {
      primaryColorName: 'Magenta Quântico da Criação (650nm)',
      colorHex: '#BE185D',
      accentHex: '#FCE7F3',
      secondaryColorName: 'Rubi Cósmico da Vanguarda',
      secondaryHex: '#9F1239',
      fieldExpansion: '2,9 metros (Campo Magnético de Inovação & Originalidade)',
      frequencyHz: '741 Hz / 852 Hz - Originalidade Disruptiva & Criação de Valor',
      vibrationalState: 'Criatividade Ilimitada, Ousadia & Pioneirismo de Mercado',
      auraArchetype: 'O Pioneiro Disruptivo (Monetização de Ideias Inéditas)',
      freeTastingSummary: 'Sua aura está projetando o Magenta Quântico da Criação. Você está em um momento de excepcional originalidade mental. O que você idealizar e colocar no mundo agora terá um diferencial magnético único, possibilitando cobrar valores premium por produtos ou serviços exclusivos.',
      deepAnalysis: 'O Magenta Quântico funde a ousadia material do vermelho com a visão cósmica do violeta. É a cor dos criadores de tendências, inventores e estrategistas que não copiam concorrentes. Seu campo áurico está calibrado para posicionar seu nome como líder único em sua área de atuação.',
      prosperityCorrelation: 'Lançamento de produtos proprietários, criação de novas fontes de renda e monetização de habilidades singulares.',
      shieldingProtocol: 'Proteção de ideias embrionárias: evite contar projetos inovadores a pessoas céticas ou desmotivadas antes do lançamento oficial.',
      recommendedCrystals: ['Rubelita (Turmalina Rosa)', 'Granada Almandina', 'Cornalina Solar'],
      clothingHarmonization: 'Acessórios ou peças de destaque em magenta, rubi ou vinho para marcar presença inesquecível em eventos.'
    }
  };

  const selected = profiles[key];

  return {
    captured: true,
    capturedWithCamera: fromCamera,
    capturedImageUrl,
    ...selected
  };
}
