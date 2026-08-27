export const languages = ['en', 'pt', 'es'] as const;
export type Language = (typeof languages)[number];
type ClientLogo = {
  name: string;
  website: string;
  asset?: string;
  size?: string;
  tone?: 'natural' | 'mono' | 'blend';
};
type Channel = { name: string; asset?: string; kind: 'platform' | 'capability' };
type CampaignMetricKey = 'spend' | 'purchases' | 'costPerPurchase' | 'platformRoas' | 'conversions' | 'conversionValue' | 'conversionValueCost';
type CampaignEvidenceItem = {
  id: string;
  platform: 'Meta' | 'Google Ads';
  scope: 'campaign' | 'account';
  preview: string;
  original: string;
  width: number;
  height: number;
  metrics: readonly { key: CampaignMetricKey; value: string }[];
};

export const clients: readonly ClientLogo[] = [
  { name: 'Miele', website: 'https://www.miele.com/', asset: '/logos/miele.png', size: 'optical-xl', tone: 'mono' },
  { name: 'Pockies', website: 'https://eu.pockies.com/', asset: '/logos/pockies.svg', size: 'optical-sm', tone: 'mono' },
  { name: 'Parfumado', website: 'https://parfumado.com/', asset: '/logos/parfumado.svg', size: 'optical-sm' },
  { name: 'Productpine', website: 'https://productpine.com/en', asset: '/logos/productpine.png', size: 'optical-sm', tone: 'mono' },
  { name: 'Eichholtz', website: 'https://www.eichholtz.com/', asset: '/logos/eichholtz.svg' },
  { name: 'LaDress', website: 'https://www.ladress.com/', asset: '/logos/ladress.svg' },
  { name: 'Natulim', website: 'https://natulim.pt/' },
  { name: '10DAYS', website: 'https://10dayslifestyle.com/' },
  { name: 'SKINS Cosmetics', website: 'https://www.skins.nl/', asset: '/logos/skins-wordmark.svg', size: 'wide' },
  { name: 'Dstrezzed', website: 'https://www.dstrezzed.com/', asset: '/logos/dstrezzed.svg' },
  { name: 'POLSPOTTEN', website: 'https://www.polspotten.nl/' },
  { name: 'Bibi van der Velden', website: 'https://www.bibivandervelden.com/', asset: '/logos/bibi.png', size: 'wide' },
  { name: 'Four Leaves', website: 'https://four-leaves.com/', asset: '/logos/four-leaves-transparent.png', size: 'wide', tone: 'mono' },
  { name: 'KNVB', website: 'https://www.knvb.com/', asset: '/logos/knvb.svg', size: 'compact' },
  { name: 'Drs Leenarts', website: 'https://www.drleenarts.com/', asset: '/logos/dr-leenarts.svg' },
  { name: 'YVRA', website: 'https://yvra1958.com/', asset: '/logos/yvra.svg', size: 'compact' },
  { name: 'Rain Couture', website: 'https://raincouture.nl/' },
  { name: 'Freebird Icons', website: 'https://freebirdicons.com/', asset: '/logos/freebird.png', size: 'optical-sm' },
  { name: 'Coco & Cici', website: 'https://coco-cici.com/', asset: '/logos/coco-cici.svg', tone: 'mono' },
  { name: 'Décor Amsterdam', website: 'https://decoramsterdam.nl/' },
  { name: 'Zoen voor Gust', website: 'https://zoenvoorgust.com/', asset: '/logos/zoen-voor-gust.png', size: 'compact', tone: 'mono' },
  { name: 'BlueM', website: 'https://bluemcare.com/', asset: '/logos/bluem.svg', size: 'optical-sm' },
  { name: 'Abloom Skincare', website: 'https://abloomskincare.com/', asset: '/logos/abloom.png' },
  { name: 'GAUGE81', website: 'https://gauge81.com/' }
] as const;

export const sectionLabels = {
  en: {
    recognition: 'Recognition', causes: 'Likely causes', diagnosis: 'Diagnostic patterns',
    whatIDo: 'What I do', engagements: 'Ways to work together', operatingModel: 'The operating model',
    method: 'A disciplined sequence', channels: 'Channel expertise', builder: 'Builder credibility', capacity: 'Capacity',
    companiesMaximum: 'companies maximum', visit: 'Visit', platforms: 'Platforms I work across', portraitRole: 'Growth advisor, former performance marketing agency founder',
    seoLink: 'SEOforGPT — AI visibility for agencies',
    mcpLink: 'GEO MCP for AI visibility workflows'
  },
  pt: {
    recognition: 'Reconhecimento', causes: 'Causas prováveis', diagnosis: 'Padrões de diagnóstico',
    whatIDo: 'O que faço', engagements: 'Formas de trabalhar em conjunto', operatingModel: 'O modelo operacional',
    method: 'Uma sequência disciplinada', channels: 'Experiência em canais', builder: 'Experiência como fundador', capacity: 'Capacidade',
    companiesMaximum: 'empresas no máximo', visit: 'Visitar', platforms: 'Plataformas com que trabalho', portraitRole: 'Consultor de crescimento, antigo fundador de uma agência de performance marketing',
    seoLink: 'SEOforGPT — visibilidade em IA para agências',
    mcpLink: 'MCP de GEO para workflows de visibilidade em IA'
  },
  es: {
    recognition: 'Reconocimiento', causes: 'Causas probables', diagnosis: 'Patrones de diagnóstico',
    whatIDo: 'Lo que hago', engagements: 'Formas de trabajar juntos', operatingModel: 'El modelo operativo',
    method: 'Una secuencia disciplinada', channels: 'Experiencia en canales', builder: 'Experiencia como fundador', capacity: 'Capacidad',
    companiesMaximum: 'empresas como máximo', visit: 'Visitar', platforms: 'Plataformas con las que trabajo', portraitRole: 'Consultor de crecimiento, antiguo fundador de una agencia de performance marketing',
    seoLink: 'SEOforGPT — visibilidad en IA para agencias',
    mcpLink: 'MCP de GEO para flujos de visibilidad en IA'
  }
} as const;

export const productCopy = {
  en: {
    marvelTitle: 'E-commerce attribution and first-party data',
    marvelBody: 'Built to close tracking gaps, improve event quality, unify marketing data and help teams make decisions with greater confidence.',
    seoTitle: 'The leading AI visibility platform built for agencies',
    seoBody: 'Audits, competitor monitoring, citation intelligence, content workflows and reporting for the next era of brand discovery.'
  },
  pt: {
    marvelTitle: 'Atribuição de e-commerce e dados próprios',
    marvelBody: 'Criado para corrigir falhas de tracking, melhorar a qualidade dos eventos, unificar dados de marketing e ajudar equipas a tomar decisões com mais confiança.',
    seoTitle: 'A plataforma líder de visibilidade em IA criada para agências',
    seoBody: 'Auditorias, monitorização de concorrentes, análise de citações, fluxos de conteúdo e reporting para a nova era da descoberta de marcas.'
  },
  es: {
    marvelTitle: 'Atribución de e-commerce y datos propios',
    marvelBody: 'Creado para corregir fallos de seguimiento, mejorar la calidad de los eventos, unificar datos de marketing y ayudar a los equipos a decidir con más confianza.',
    seoTitle: 'La plataforma líder de visibilidad en IA creada para agencias',
    seoBody: 'Auditorías, seguimiento de competidores, análisis de citas, flujos de contenido e informes para la nueva era del descubrimiento de marcas.'
  }
} as const;

export const campaignEvidence: readonly CampaignEvidenceItem[] = [
  {
    id: 'meta-scale', platform: 'Meta', scope: 'campaign',
    preview: '/images/campaign-evidence/meta-scale-preview.webp',
    original: '/images/campaign-evidence/meta-scale-full.png', width: 2466, height: 1033,
    metrics: [
      { key: 'spend', value: '€448,511.47' },
      { key: 'purchases', value: '2,029' },
      { key: 'costPerPurchase', value: '€221.05' }
    ]
  },
  {
    id: 'meta-commerce', platform: 'Meta', scope: 'campaign',
    preview: '/images/campaign-evidence/meta-commerce-preview.webp',
    original: '/images/campaign-evidence/meta-commerce-full.png', width: 1933, height: 339,
    metrics: [
      { key: 'spend', value: '€27,771.69' },
      { key: 'purchases', value: '3,691' },
      { key: 'costPerPurchase', value: '€7.52' },
      { key: 'platformRoas', value: '13.60' }
    ]
  },
  {
    id: 'google-performance', platform: 'Google Ads', scope: 'account',
    preview: '/images/campaign-evidence/google-performance-preview.webp',
    original: '/images/campaign-evidence/google-performance-full.png', width: 2243, height: 973,
    metrics: [
      { key: 'spend', value: '€53,763.52' },
      { key: 'conversions', value: '6,275.20' },
      { key: 'conversionValue', value: '€593,682.67' },
      { key: 'conversionValueCost', value: '11.04' }
    ]
  },
  {
    id: 'google-month', platform: 'Google Ads', scope: 'account',
    preview: '/images/campaign-evidence/google-month-preview.webp',
    original: '/images/campaign-evidence/google-month-full.png', width: 2265, height: 1255,
    metrics: [
      { key: 'spend', value: '€45,667.91' },
      { key: 'conversions', value: '6,457.31' },
      { key: 'conversionValue', value: '€426,986.14' },
      { key: 'conversionValueCost', value: '9.35' }
    ]
  }
] as const;

export const campaignEvidenceCopy = {
  en: {
    eyebrow: 'Account evidence', title: 'The work is hands-on, not theoretical.',
    body: 'Selected one-month snapshots from Meta and Google accounts I have managed. These are platform-reported results from individual accounts and campaigns, not promises of future performance.',
    scope: { campaign: 'Selected campaign · One-month account snapshot', account: 'One-month account snapshot' },
    metrics: { spend: 'Spend', purchases: 'Purchases', costPerPurchase: 'Cost per purchase', platformRoas: 'Platform ROAS', conversions: 'Conversions', conversionValue: 'Conversion value', conversionValueCost: 'Conversion value / cost' },
    ctaTitle: 'Are your campaigns actually ready to scale?',
    ctaLabel: 'Book a call',
    view: 'View full size', close: 'Close', fit: 'Fit to screen', actual: '100%', dialogTitle: 'Campaign performance screenshot'
  },
  pt: {
    eyebrow: 'Prova nas contas', title: 'O trabalho é prático, não teórico.',
    body: 'Exemplos selecionados de períodos de um mês em contas de Meta e Google que geri. São resultados reportados pelas plataformas em contas e campanhas específicas, não promessas de desempenho futuro.',
    scope: { campaign: 'Campanha selecionada · Exemplo de um mês', account: 'Exemplo de um mês na conta' },
    metrics: { spend: 'Investimento', purchases: 'Compras', costPerPurchase: 'Custo por compra', platformRoas: 'ROAS da plataforma', conversions: 'Conversões', conversionValue: 'Valor de conversão', conversionValueCost: 'Valor de conversão / custo' },
    ctaTitle: 'As suas campanhas estão realmente prontas para escalar?',
    ctaLabel: 'Marcar uma chamada',
    view: 'Ver em tamanho real', close: 'Fechar', fit: 'Ajustar ao ecrã', actual: '100%', dialogTitle: 'Captura de desempenho de campanhas'
  },
  es: {
    eyebrow: 'Evidencia en las cuentas', title: 'El trabajo es práctico, no teórico.',
    body: 'Ejemplos seleccionados de periodos de un mes en cuentas de Meta y Google que he gestionado. Son resultados reportados por las plataformas en cuentas y campañas concretas, no promesas de rendimiento futuro.',
    scope: { campaign: 'Campaña seleccionada · Ejemplo de un mes', account: 'Ejemplo de un mes en la cuenta' },
    metrics: { spend: 'Inversión', purchases: 'Compras', costPerPurchase: 'Coste por compra', platformRoas: 'ROAS de plataforma', conversions: 'Conversiones', conversionValue: 'Valor de conversión', conversionValueCost: 'Valor de conversión / coste' },
    ctaTitle: '¿Tus campañas están realmente preparadas para escalar?',
    ctaLabel: 'Reservar una llamada',
    view: 'Ver a tamaño completo', close: 'Cerrar', fit: 'Ajustar a pantalla', actual: '100%', dialogTitle: 'Captura del rendimiento de campañas'
  }
} as const;

export const expertisePlatforms = [
  { name: 'Shopify', asset: '/platforms/shopify.svg', tone: 'mono', size: 'standard' },
  { name: 'WooCommerce', asset: '/platforms/woocommerce.svg', tone: 'mono', size: 'wide' },
  { name: 'Meta', asset: '/platforms/meta.svg', tone: 'mono', size: 'standard' },
  { name: 'Google Ads', asset: '/platforms/googleads.svg', tone: 'mono', size: 'standard' },
  { name: 'Klaviyo', asset: '/platforms/klaviyo-icon.png', tone: 'original', size: 'standard' }
] as const;

export const copy = {
  en: {
    locale: 'en_US', label: 'EN', nav: ['Approach', 'Experience', 'Insights', 'About'],
    paths: ['approach', 'experience', 'insights', 'about'], cta: 'Book a discovery call',
    eyebrow: 'For e-commerce brands from $2M to $20M',
    hero: 'Your next stage of growth needs someone that did it before.',
    heroBody: 'I help founders turn unclear numbers, underperforming campaigns and disconnected teams into a growth operation built to scale.',
    secondary: 'See how I work', stats: [['7 years', 'leading a performance marketing agency'], ['130 brands', 'across multiple industries'], ['$250M+', 'annual revenue at the largest company advised']],
    logoTitle: 'Brands I have worked with',
    recognitionTitle: 'Does this sound familiar?',
    recognitionBody: 'The company is spending, campaigns are running and people are busy. But growth is becoming harder, more expensive and less predictable.',
    symptoms: ['Growth is stalling.', 'ROAS drops when budgets scale.', 'The team lacks paid-channel knowledge.', 'Budget feels wasted instead of efficiently invested.', 'There are no clear commercial goals.', 'There is no clear growth strategy.'],
    thesis: 'Growth is not a collection of channels. It is a management system.',
    thesisBody: 'I bring the six parts of growth into one plan so teams stop optimizing isolated metrics and start working toward the same commercial outcome.',
    systemTitle: 'The six parts I bring into one growth plan.',
    constraintTitle: 'The visible problem is not always the real constraint.',
    constraintIntro: 'My job is to determine which situation exists before prescribing a solution.',
    scenarios: [
      ['Campaigns are not structured for scale', 'More budget exposes weak campaign architecture, limited creative volume and unclear testing rules. The account needs a structure that can absorb more spend without losing control.'],
      ['The strategy is unclear', 'Revenue can grow while profit and cash weaken when targets ignore margin, new-customer value and the role of promotions. The business needs one commercial view of growth.'],
      ['The internal team needs leadership', 'When agencies, paid media, email and developers optimize separately, activity increases but ownership disappears. The team needs one goal, clear responsibilities and a weekly decision rhythm.']
    ],
    evidenceTitle: 'Three situations established founders recognize.', evidenceIntro: 'The symptoms look like channel problems. The real cause often sits in the economics, the team or the way decisions are being made.',
    examples: [
      ['ROAS falls every time you scale Meta', 'Spend works at one level, then efficiency drops as soon as the budget increases. Before blaming the channel, I look at creative volume, campaign structure, conversion and new-customer economics.'],
      ['Revenue is growing, but cash is not', 'The dashboards look healthy, but discounting, returning customers and weak margins may be hiding unprofitable acquisition. The targets need to reflect contribution margin and new-customer value.'],
      ['Everyone is busy, but nobody owns growth', 'The media agency, email team and developers all report wins, yet the business misses plan. The fix is one commercial target, clear responsibilities and a weekly decision rhythm.']
    ],
    solutionTitle: 'I find what is stopping growth and turn it into a plan your team can execute.',
    solutionBody: 'I work above day-to-day execution. I establish the numbers and targets that matter, identify the real constraint, decide where budget should go and make clear who owns each next step. If the agency is the problem, I will say so. If the internal team needs coaching, I help lead it. If conversion, retention or measurement is the constraint, we fix that before spending more.',
    channelsTitle: 'You need to know the channels well enough to challenge the people running them.',
    channelsBody: 'I am a Meta specialist with hands-on experience across Google, TikTok, Pinterest, Reddit, Snapchat, Klaviyo, email and CRO. That depth lets me separate a channel problem from weak creative, poor conversion, unreliable measurement, the wrong targets or a team that needs stronger direction.',
    builderTitle: 'I have also built the systems behind the decisions.',
    methodTitle: 'How we get growth moving again', method: ['Get the numbers straight', 'Find what is actually stuck', 'Decide what matters now', 'Get the right people working on it', 'Review, learn and scale'],
    engagementTitle: 'Choose the level of leadership you need.',
    engagementFaqLink: 'Questions about working together? Read the FAQ',
    advisory: ['3-Month Growth Advisory', 'You keep your current growth leader, team and agencies. I help them make better decisions.', 'A focused three-month engagement. Continue only when it remains useful.'],
    advisoryIncludes: ['Diagnose what is holding growth back', 'Establish useful commercial targets', 'Set channel and budget priorities', 'Evaluate agencies and internal capabilities', 'Build one practical growth plan', 'Create a working review rhythm'],
    fractional: ['Fractional Head of Growth', 'I take responsibility for directing the complete growth function.', 'Best for companies that need active leadership across agencies, internal specialists, priorities and reporting.'],
    fractionalIncludes: ['Direct agencies and internal specialists', 'Set goals, priorities and budgets', 'Lead weekly growth reviews', 'Train the internal team', 'Evaluate capabilities and hiring needs', 'Keep the complete plan accountable'],
    engagementCtaBody: 'The call is used to understand the company and determine which structure, if either, makes sense.',
    fitTitle: 'Direct involvement, by design.', fitBody: 'I work with no more than five companies at a time so I can remain directly involved in the decisions, teams, and numbers.',
    finalTitle: 'Find out what is really holding growth back.', finalBody: 'Tell me where growth feels stuck. We will look at the business, team and channels, and determine where I can help.',
    footer: 'E-commerce growth leadership for established companies.',
    formTitle: 'Book a discovery call', formIntro: 'Tell me where growth feels stuck. I will review the business before we speak, then you can choose a time directly.',
    fields: ['Name', 'Work email', 'Company', 'Website', 'Annual revenue', 'What feels stuck right now?'],
    submit: 'Book a discovery call', manual: 'Thanks. Your context has been sent to Miguel. Choose a time below or open Google Calendar directly.',
    fallback: 'Open booking page', privacy: 'Your answers are sent securely to migkast@gmail.com and are not sent to analytics.',
    select: 'Select', sending: 'Sending...', formError: 'Something went wrong. Please email migkast@gmail.com or try again.',
    revenueOptions: ['Under $2M', '$2M to $5M', '$5M to $10M', '$10M to $20M', '$20M to $50M', '$50M+']
  },
  pt: {
    locale: 'pt_PT', label: 'PT', nav: ['Abordagem', 'Experiência', 'Insights', 'Sobre'], paths: ['abordagem', 'experiencia', 'insights', 'sobre'], cta: 'Marcar uma chamada inicial', eyebrow: 'Para marcas de e-commerce entre $2M e $20M',
    hero: 'A próxima fase de crescimento precisa de alguém que já o tenha feito.', heroBody: 'Ajudo fundadores a transformar números pouco claros, campanhas com fraca performance e equipas desalinhadas numa operação de crescimento preparada para escalar.', secondary: 'Veja como trabalho', stats: [['7 anos', 'a liderar uma agência de performance marketing'], ['130 marcas', 'em várias indústrias'], ['$250M+', 'receita anual da maior empresa que aconselhei']], logoTitle: 'Marcas com que trabalhei',
    recognitionTitle: 'Isto parece-lhe familiar?', recognitionBody: 'A empresa está a investir, as campanhas estão ativas e as pessoas estão ocupadas. Mas crescer está a tornar-se mais difícil, mais caro e menos previsível.', symptoms: ['O crescimento está a abrandar.', 'O ROAS desce quando o orçamento aumenta.', 'A equipa não domina os canais pagos.', 'O orçamento parece desperdiçado em vez de bem investido.', 'Não existem objetivos comerciais claros.', 'Não existe uma estratégia de crescimento clara.'],
    thesis: 'Crescimento não é uma coleção de canais. É um sistema de gestão.', thesisBody: 'Junto as seis partes do crescimento num único plano para que as equipas deixem de otimizar métricas isoladas e trabalhem para o mesmo resultado comercial.', systemTitle: 'As seis partes que junto num único plano de crescimento.',
    constraintTitle: 'O problema visível nem sempre é o verdadeiro bloqueio.', constraintIntro: 'O meu trabalho é determinar qual situação existe antes de prescrever uma solução.', scenarios: [['As campanhas não estão estruturadas para escalar', 'Mais orçamento expõe uma estrutura de campanhas fraca, pouco volume criativo e regras de teste pouco claras. A conta precisa de uma estrutura capaz de absorver mais investimento sem perder controlo.'], ['A estratégia não é clara', 'A receita pode crescer enquanto o lucro e a tesouraria pioram quando os objetivos ignoram a margem, o valor dos novos clientes e o papel das promoções. O negócio precisa de uma visão comercial única do crescimento.'], ['A equipa interna precisa de liderança', 'Quando agências, media paga, email e developers otimizam separadamente, a atividade aumenta mas a responsabilidade desaparece. A equipa precisa de um objetivo comum, responsabilidades claras e um ritmo semanal de decisão.']],
    evidenceTitle: 'Três situações que fundadores de marcas estabelecidas reconhecem.', evidenceIntro: 'Os sintomas parecem problemas de canal. A verdadeira causa está muitas vezes na economia, na equipa ou na forma como as decisões são tomadas.', examples: [['O ROAS cai sempre que aumenta o orçamento em Meta', 'O investimento funciona até certo nível e perde eficiência assim que aumenta. Antes de culpar o canal, analiso o volume criativo, a estrutura das campanhas, a conversão e a economia de novos clientes.'], ['A receita cresce, mas o dinheiro não aparece', 'Os dashboards parecem saudáveis, mas descontos, clientes recorrentes e margens fracas podem esconder aquisição sem lucro. Os objetivos têm de refletir a margem de contribuição e o valor de novos clientes.'], ['Todos estão ocupados, mas ninguém é responsável pelo crescimento', 'A agência de media, a equipa de email e os developers reportam vitórias, mas o negócio falha o plano. É preciso um objetivo comercial, responsabilidades claras e um ritmo semanal de decisão.']],
    solutionTitle: 'Descubro o que está a travar o crescimento e transformo-o num plano que a sua equipa consegue executar.', solutionBody: 'Trabalho acima da execução diária. Defino os números e objetivos que importam, identifico o verdadeiro bloqueio, decido onde investir o orçamento e clarifico quem é responsável por cada próximo passo. Se o problema for a agência, digo-o. Se a equipa interna precisar de orientação, ajudo a liderá-la. Se o bloqueio estiver na conversão, retenção ou medição, corrigimos isso antes de investir mais.',
    channelsTitle: 'É preciso conhecer os canais o suficiente para desafiar quem os gere.', channelsBody: 'Sou especialista em Meta, com experiência prática em Google, TikTok, Pinterest, Reddit, Snapchat, Klaviyo, email e CRO. Essa profundidade permite-me distinguir um problema de canal de criativos fracos, má conversão, medição pouco fiável, objetivos errados ou uma equipa que precisa de mais direção.', builderTitle: 'Também construí os sistemas por detrás das decisões.',
    methodTitle: 'Como voltamos a pôr o crescimento em movimento', method: ['Pôr os números em ordem', 'Descobrir o que está realmente bloqueado', 'Decidir o que importa agora', 'Colocar as pessoas certas no problema', 'Rever, aprender e escalar'],
    engagementTitle: 'Escolha o nível de liderança de que precisa.', engagementFaqLink: 'Tem dúvidas sobre como trabalhamos? Consulte as perguntas frequentes', advisory: ['Advisory de Crescimento de 3 Meses', 'Mantém o seu líder de crescimento, equipa e agências. Eu ajudo-os a tomar melhores decisões.', 'Um trabalho focado de três meses. Só continuamos enquanto continuar a ser útil.'], advisoryIncludes: ['Diagnosticar o que está a bloquear o crescimento', 'Definir objetivos comerciais úteis', 'Definir prioridades de canal e orçamento', 'Avaliar agências e capacidades internas', 'Construir um plano de crescimento prático', 'Criar um ritmo útil de revisão'], fractional: ['Head of Growth Fracional', 'Assumo a responsabilidade de dirigir toda a função de crescimento.', 'Para empresas que precisam de liderança ativa sobre agências, especialistas internos, prioridades e reporting.'], fractionalIncludes: ['Dirigir agências e especialistas internos', 'Definir objetivos, prioridades e orçamentos', 'Liderar reuniões semanais de crescimento', 'Formar a equipa interna', 'Avaliar capacidades e necessidades de contratação', 'Garantir a responsabilidade pelo plano completo'], engagementCtaBody: 'A chamada serve para compreender a empresa e determinar qual estrutura, se alguma, faz sentido.',
    fitTitle: 'Envolvimento direto, de propósito.', fitBody: 'Trabalho com um máximo de cinco empresas de cada vez para continuar diretamente envolvido nas decisões, equipas e números.', finalTitle: 'Descubra o que está realmente a bloquear o crescimento.', finalBody: 'Diga-me onde o crescimento está bloqueado. Vamos analisar o negócio, a equipa e os canais para perceber onde posso ajudar.', footer: 'Liderança de crescimento para empresas de e-commerce estabelecidas.', formTitle: 'Marcar uma chamada inicial', formIntro: 'Diga-me onde o crescimento está bloqueado. Vou analisar o negócio antes da conversa e depois poderá escolher um horário.', fields: ['Nome', 'Email profissional', 'Empresa', 'Website', 'Receita anual', 'O que está bloqueado neste momento?'], submit: 'Marcar uma chamada inicial', manual: 'Obrigado. O seu contexto foi enviado ao Miguel. Escolha um horário abaixo ou abra diretamente o Google Calendar.', fallback: 'Abrir página de marcação', privacy: 'As suas respostas são enviadas de forma segura para migkast@gmail.com e não são enviadas para analytics.', select: 'Selecionar', sending: 'A enviar...', formError: 'Ocorreu um erro. Envie um email para migkast@gmail.com ou tente novamente.', revenueOptions: ['Menos de $2M', '$2M a $5M', '$5M a $10M', '$10M a $20M', '$20M a $50M', '$50M+']
  },
  es: {
    locale: 'es_ES', label: 'ES', nav: ['Enfoque', 'Experiencia', 'Ideas', 'Sobre mí'], paths: ['enfoque', 'experiencia', 'ideas', 'sobre-mi'], cta: 'Reservar una llamada inicial', eyebrow: 'Para marcas de e-commerce de $2M a $20M',
    hero: 'Tu próxima etapa de crecimiento necesita a alguien que ya lo haya hecho.', heroBody: 'Ayudo a fundadores a convertir números poco claros, campañas con bajo rendimiento y equipos desconectados en una operación de crecimiento preparada para escalar.', secondary: 'Descubre cómo trabajo', stats: [['7 años', 'dirigiendo una agencia de performance marketing'], ['130 marcas', 'en múltiples industrias'], ['$250M+', 'facturación anual de la mayor empresa asesorada']], logoTitle: 'Marcas con las que he trabajado',
    recognitionTitle: '¿Te resulta familiar?', recognitionBody: 'La empresa está invirtiendo, las campañas están activas y la gente está ocupada. Pero crecer es cada vez más difícil, más caro y menos predecible.', symptoms: ['El crecimiento se está estancando.', 'El ROAS baja cuando aumenta el presupuesto.', 'El equipo carece de conocimiento sobre canales de pago.', 'El presupuesto parece desperdiciado en lugar de bien invertido.', 'No existen objetivos comerciales claros.', 'No existe una estrategia de crecimiento clara.'],
    thesis: 'El crecimiento no es una colección de canales. Es un sistema de gestión.', thesisBody: 'Integro las seis partes del crecimiento en un solo plan para que los equipos dejen de optimizar métricas aisladas y trabajen hacia el mismo resultado comercial.', systemTitle: 'Las seis partes que integro en un único plan de crecimiento.',
    constraintTitle: 'El problema visible no siempre es el verdadero obstáculo.', constraintIntro: 'Mi trabajo es determinar qué situación existe antes de prescribir una solución.', scenarios: [['Las campañas no están estructuradas para escalar', 'Más presupuesto deja al descubierto una estructura de campañas débil, poco volumen creativo y reglas de prueba poco claras. La cuenta necesita una estructura capaz de absorber más inversión sin perder el control.'], ['La estrategia no está clara', 'Los ingresos pueden crecer mientras el beneficio y la caja empeoran cuando los objetivos ignoran el margen, el valor de los nuevos clientes y el papel de las promociones. El negocio necesita una única visión comercial del crecimiento.'], ['El equipo interno necesita liderazgo', 'Cuando las agencias, paid media, email y desarrollo optimizan por separado, aumenta la actividad pero desaparece la responsabilidad. El equipo necesita un objetivo común, responsabilidades claras y un ritmo semanal de decisión.']],
    evidenceTitle: 'Tres situaciones que reconocen los fundadores de marcas consolidadas.', evidenceIntro: 'Los síntomas parecen problemas de canal. La verdadera causa suele estar en la economía, el equipo o la forma de tomar decisiones.', examples: [['El ROAS cae cada vez que aumentas el presupuesto en Meta', 'La inversión funciona hasta cierto nivel y pierde eficiencia al aumentar. Antes de culpar al canal, analizo el volumen creativo, la estructura de campañas, la conversión y la economía de nuevos clientes.'], ['Los ingresos crecen, pero el dinero no aparece', 'Los dashboards parecen saludables, pero los descuentos, los clientes recurrentes y los márgenes débiles pueden ocultar una adquisición no rentable. Los objetivos deben reflejar el margen de contribución y el valor de nuevos clientes.'], ['Todos están ocupados, pero nadie es responsable del crecimiento', 'La agencia de medios, el equipo de email y los desarrolladores reportan victorias, pero el negocio no cumple el plan. Hace falta un objetivo comercial, responsabilidades claras y un ritmo semanal de decisión.']],
    solutionTitle: 'Descubro qué está frenando el crecimiento y lo convierto en un plan que tu equipo puede ejecutar.', solutionBody: 'Trabajo por encima de la ejecución diaria. Defino los números y objetivos que importan, identifico el verdadero obstáculo, decido dónde invertir el presupuesto y aclaro quién es responsable de cada siguiente paso. Si el problema es la agencia, lo diré. Si el equipo interno necesita orientación, ayudo a liderarlo. Si el obstáculo está en conversión, retención o medición, lo corregimos antes de invertir más.',
    channelsTitle: 'Hay que conocer los canales lo suficiente para desafiar a quienes los gestionan.', channelsBody: 'Soy especialista en Meta, con experiencia práctica en Google, TikTok, Pinterest, Reddit, Snapchat, Klaviyo, email y CRO. Esa profundidad me permite distinguir un problema de canal de una creatividad débil, mala conversión, medición poco fiable, objetivos equivocados o un equipo que necesita más dirección.', builderTitle: 'También he construido los sistemas detrás de las decisiones.',
    methodTitle: 'Cómo volvemos a poner el crecimiento en marcha', method: ['Poner los números en orden', 'Descubrir qué está realmente atascado', 'Decidir qué importa ahora', 'Poner a las personas adecuadas a resolverlo', 'Revisar, aprender y escalar'],
    engagementTitle: 'Elige el nivel de liderazgo que necesitas.', engagementFaqLink: '¿Tienes dudas sobre cómo trabajamos? Consulta las preguntas frecuentes', advisory: ['Asesoría de Crecimiento de 3 Meses', 'Mantienes a tu líder de crecimiento, equipo y agencias. Yo les ayudo a tomar mejores decisiones.', 'Un trabajo enfocado de tres meses. Solo continuamos mientras siga siendo útil.'], advisoryIncludes: ['Diagnosticar qué está frenando el crecimiento', 'Establecer objetivos comerciales útiles', 'Definir prioridades de canal y presupuesto', 'Evaluar agencias y capacidades internas', 'Construir un plan de crecimiento práctico', 'Crear un ritmo útil de revisión'], fractional: ['Head of Growth Fraccional', 'Asumo la responsabilidad de dirigir toda la función de crecimiento.', 'Para empresas que necesitan liderazgo activo sobre agencias, especialistas internos, prioridades e informes.'], fractionalIncludes: ['Dirigir agencias y especialistas internos', 'Definir objetivos, prioridades y presupuestos', 'Liderar revisiones semanales de crecimiento', 'Formar al equipo interno', 'Evaluar capacidades y necesidades de contratación', 'Mantener la responsabilidad sobre el plan completo'], engagementCtaBody: 'La llamada sirve para entender la empresa y determinar qué estructura, si alguna, tiene sentido.',
    fitTitle: 'Implicación directa, por diseño.', fitBody: 'Trabajo con un máximo de cinco empresas a la vez para mantenerme directamente implicado en las decisiones, los equipos y los números.', finalTitle: 'Descubre qué está frenando realmente el crecimiento.', finalBody: 'Cuéntame dónde está bloqueado el crecimiento. Analizaremos el negocio, el equipo y los canales para determinar dónde puedo ayudar.', footer: 'Liderazgo de crecimiento para empresas de e-commerce consolidadas.', formTitle: 'Reservar una llamada inicial', formIntro: 'Cuéntame dónde está bloqueado el crecimiento. Revisaré el negocio antes de hablar y después podrás elegir una hora.', fields: ['Nombre', 'Email profesional', 'Empresa', 'Sitio web', 'Facturación anual', '¿Qué está bloqueado ahora mismo?'], submit: 'Reservar una llamada inicial', manual: 'Gracias. Tu contexto ha sido enviado a Miguel. Elige una hora abajo o abre Google Calendar directamente.', fallback: 'Abrir página de reservas', privacy: 'Tus respuestas se envían de forma segura a migkast@gmail.com y no se envían a analytics.', select: 'Seleccionar', sending: 'Enviando...', formError: 'Ha ocurrido un error. Escribe a migkast@gmail.com o inténtalo de nuevo.', revenueOptions: ['Menos de $2M', '$2M a $5M', '$5M a $10M', '$10M a $20M', '$20M a $50M', '$50M+']
  }
} as const;

export const layers = {
  en: [
    ['01', 'Economics', 'Know what profitable growth allows you to spend.'],
    ['02', 'Measurement', 'Know which numbers can be trusted.'],
    ['03', 'Acquisition', 'Give every channel a role and clear scaling rules.'],
    ['04', 'Conversion', 'Turn more paid traffic into customers.'],
    ['05', 'Retention', 'Increase repeat purchase and customer value.'],
    ['06', 'Execution', 'Give teams and agencies clear goals and ownership.']
  ],
  pt: [
    ['01', 'Economia', 'Saiba quanto pode investir para crescer com lucro.'],
    ['02', 'Medição', 'Saiba em que números pode confiar.'],
    ['03', 'Aquisição', 'Dê a cada canal uma função e regras claras de escala.'],
    ['04', 'Conversão', 'Transforme mais tráfego pago em clientes.'],
    ['05', 'Retenção', 'Aumente a recompra e o valor de cada cliente.'],
    ['06', 'Execução', 'Dê objetivos e responsabilidades claras a equipas e agências.']
  ],
  es: [
    ['01', 'Economía', 'Conoce cuánto puedes invertir para crecer con beneficio.'],
    ['02', 'Medición', 'Conoce en qué números puedes confiar.'],
    ['03', 'Adquisición', 'Da a cada canal una función y reglas claras de escala.'],
    ['04', 'Conversión', 'Convierte más tráfico de pago en clientes.'],
    ['05', 'Retención', 'Aumenta la recompra y el valor de cada cliente.'],
    ['06', 'Ejecución', 'Da objetivos y responsabilidades claras a equipos y agencias.']
  ]
} as const;

export const channels: readonly Channel[] = [
  { name: 'Meta Ads', asset: '/platforms/meta.svg', kind: 'platform' },
  { name: 'Google Ads', asset: '/platforms/googleads.svg', kind: 'platform' },
  { name: 'TikTok', asset: '/platforms/tiktok.svg', kind: 'platform' },
  { name: 'Pinterest', asset: '/platforms/pinterest.svg', kind: 'platform' },
  { name: 'Reddit', asset: '/platforms/reddit.svg', kind: 'platform' },
  { name: 'Snapchat', asset: '/platforms/snapchat.svg', kind: 'platform' },
  { name: 'Klaviyo', asset: '/platforms/klaviyo-icon.png', kind: 'platform' },
  { name: 'Email & lifecycle', kind: 'capability' },
  { name: 'CRO & landing pages', kind: 'capability' },
  { name: 'Promotions & offers', kind: 'capability' },
  { name: 'Attribution & first-party data', kind: 'capability' },
  { name: 'SEO & AI visibility', kind: 'capability' }
];

export function langFrom(value: string | undefined): Language {
  return languages.includes(value as Language) ? value as Language : 'en';
}

export function routeFor(lang: Language, path = ''): string {
  const normalizedPath = path.replace(/^\/+|\/+$/g, '');
  const suffix = normalizedPath ? `${normalizedPath}/` : '';
  return lang === 'en' ? `/${suffix}` : `/${lang}/${suffix}`;
}
