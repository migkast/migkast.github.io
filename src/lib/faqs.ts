import type { Language } from './site';

export type FaqItem = readonly [question: string, answer: string];
export type FaqPage = 'home' | 'approach' | 'experience' | 'insights' | 'about' | 'contact';

export const faqLabels: Record<Language, { eyebrow: string; title: string; intro: string }> = {
  en: {
    eyebrow: 'Frequently asked questions',
    title: 'Questions founders usually ask',
    intro: 'Direct answers about fit, scope and what working together actually looks like.'
  },
  pt: {
    eyebrow: 'Perguntas frequentes',
    title: 'Perguntas que os fundadores costumam fazer',
    intro: 'Respostas diretas sobre enquadramento, âmbito e como é realmente trabalhar em conjunto.'
  },
  es: {
    eyebrow: 'Preguntas frecuentes',
    title: 'Preguntas que suelen hacer los fundadores',
    intro: 'Respuestas directas sobre encaje, alcance y cómo es realmente trabajar juntos.'
  }
};

export const faqs: Record<Language, Record<FaqPage, readonly FaqItem[]>> = {
  en: {
    home: [
      ['Is this only for e-commerce companies between $2M and $20M?', 'That is the range where I am usually most useful because the business already has traction, people and meaningful marketing spend, but growth has become harder to direct. I have worked with companies from $1.5M to more than $250M, so larger businesses can still be a fit.'],
      ['Are B2B businesses also eligible?', 'Yes. I have worked extensively with B2B companies across industries including IT providers, B2B applications, platforms, furniture, real estate and government services. The same work can be valuable when the business has a meaningful acquisition operation, an existing team or agencies and needs clearer commercial targets, channel strategy and accountability.'],
      ['What will I actually get from the 3-Month Growth Advisory?', 'The advisory is built around a weekly or biweekly working session with you and the people responsible for growth. Together, we review financial planning, attribution, current performance and every active channel. We inspect and revise campaigns where needed, coach media buyers on how to optimize and scale, and build the decision-making skills your team needs to run growth more effectively after the engagement ends.'],
      ['How is Fractional Head of Growth different from advisory?', 'With advisory, I work alongside your existing growth leader to improve the quality of the work, channel management and decisions being made. As Fractional Head of Growth, I actively direct agencies and specialists, lead the weekly growth rhythm and take responsibility for keeping the complete plan accountable.'],
      ['Will you replace my current agency or media buyer?', 'No. I first establish the current state of the business and determine whether what is missing is strategy, agency capability, internal leadership, reliable measurement, conversion, retention or something else. If the agency is capable, I give it clearer targets and direction. If the agency is the constraint, I explain exactly why.'],
      ['What happens on the discovery call?', 'We discuss your current revenue, targets, team, agencies, channels and where growth feels stuck. The goal is to understand the situation and decide whether advisory, fractional leadership or neither is the right next step. It is not a disguised sales presentation or a separate paid product.']
    ],
    approach: [
      ['What happens during the first few weeks?', 'I start by understanding the commercial model, targets, reporting, channel setup, team and agency responsibilities. I then separate symptoms from causes, identify the most important constraint and turn that diagnosis into a prioritized plan with owners and decision rules.'],
      ['How do you decide whether the problem is the agency, the team or the strategy?', 'I compare what the business needs with the decisions being made, the evidence behind them and the quality of execution. A weak result does not automatically mean a weak agency. The real issue may be unclear economics, insufficient creative, poor conversion, unreliable tracking or a lack of leadership.'],
      ['Which numbers do you use to manage growth?', 'The exact set depends on the business, but it normally connects contribution margin, new-customer CAC or CPO, payback, LTV, MER, channel ROAS and cash requirements. The point is not to build a larger dashboard. It is to define the few numbers that should change a decision.'],
      ['Do you manage advertising accounts day to day?', 'I can inspect the detail and challenge the people operating the accounts, but I do not position myself as the routine operator of every channel. I work above execution so the specialists have clear targets, roles, budgets and scaling criteria.'],
      ['How often do we work together?', 'The cadence is adapted to the engagement and the stage of the business. It normally includes a regular leadership meeting, focused working sessions when decisions are needed and a shared view of priorities, owners and performance between meetings.']
    ],
    experience: [
      ['Have you worked with a business like mine?', 'Across 130 brands I have worked in fashion, beauty, home, marketplaces, SaaS and other categories, with companies from approximately $1.5M to more than $250M in annual revenue. Industry context matters, but the recurring growth problems are usually found in economics, channels, conversion, retention, people and accountability.'],
      ['Which channels do you know directly?', 'Meta is my deepest specialist channel. I also have hands-on strategic experience across Google Ads, TikTok, Pinterest, Reddit, Snapchat, Klaviyo, email, lifecycle marketing, landing pages, CRO, promotions, attribution and first-party data.'],
      ['What does the $250M+ figure mean?', 'It refers to the annual revenue of the largest company I advised. It is included to show the range of operating environments I have seen. My preferred work today remains with ambitious e-commerce companies in the $2M to $20M range.'],
      ['Have you led teams as well as advised them?', 'Yes. I founded Marvel Test and spent seven years as Head of Growth and Innovation, responsible for client strategy and the performance marketing team. I directed work across more than 30 concurrent brands and hired across marketing, development, analytics and operations.'],
      ['Why does building attribution software matter to this work?', 'Building MarvelPixel required a detailed understanding of tracking, event quality, first-party data, attribution models and how reporting changes budget decisions. It helps me distinguish a genuine performance problem from a measurement problem.']
    ],
    insights: [
      ['What kind of thinking will be published here?', 'The focus is practical decision-making for established e-commerce companies: evaluating agencies, setting useful targets, scaling Meta, choosing channels, improving attribution, aligning retention with acquisition and understanding AI visibility.'],
      ['Where should a founder start when growth slows?', 'Start with the commercial target and the quality of the evidence. Before changing an agency or adding budget, establish what profitable growth permits, whether the numbers are trustworthy and where performance changes across acquisition, conversion and retention.'],
      ['Can better content replace a growth engagement?', 'No. The insights can help a founder ask better questions and recognize common patterns. An engagement applies that thinking to the company’s actual economics, people, data, channels and constraints, then creates ownership for the decisions.'],
      ['Why include AI visibility in an e-commerce growth strategy?', 'Discovery is expanding beyond traditional search into AI answers and recommendations. AI visibility does not replace paid acquisition, SEO or retention, but established brands should understand where they are cited, which sources influence recommendations and what customer questions remain unanswered.']
    ],
    about: [
      ['Why did you move from agency leadership to direct advisory work?', 'After seven years of leading strategy across many brands at once, I wanted to work more closely with a smaller number of companies and stay involved in the decisions that connect economics, channels, teams and execution. I now work with no more than five companies at a time.'],
      ['Are you still hands-on enough to understand execution?', 'Yes. I have built Shopify stores, managed Meta and Google campaigns, controlled budgets, written creative briefs, tested landing pages and offers, built email automations, planned promotions, analyzed reporting and worked directly on conversion. I know what I am asking teams to do.'],
      ['How does your technical background affect the work?', 'My engineering background trained me to understand systems, isolate variables and test against evidence. Building MarvelPixel and SEOforGPT also means I can go deeper into attribution, data quality, reporting workflows and emerging discovery channels when those areas affect growth.'],
      ['What is your working style?', 'Direct, structured and commercially grounded. I make responsibilities explicit, challenge unsupported assumptions and keep the work focused on the decisions most likely to change the business. I do not create activity simply to make an engagement look busy.'],
      ['Which languages can we work in?', 'I work in English, Portuguese and Spanish. The discovery call, leadership meetings and working sessions can be held in whichever of those languages is most useful for the founders and team.']
    ],
    contact: [
      ['Who should book a discovery call?', 'Founders, CEOs and managing directors of established e-commerce companies should book when growth is slowing, scaling is becoming less efficient or the business needs clearer direction across agencies, teams and channels. The work is best suited to companies around $2M or more in annual revenue.'],
      ['What will we discuss?', 'We will discuss where the business is today, the next growth target, the team and agency setup, active channels and what currently feels unclear or stuck. I will ask enough to understand whether I can be useful.'],
      ['Do I need to prepare anything?', 'No presentation is required. It helps to know the approximate annual revenue, current marketing setup, six-month objective and the one or two decisions that feel hardest to make confidently.'],
      ['Is the discovery call a free audit?', 'No. It is a focused fit conversation, not a separate diagnostic service or a free consulting deliverable. We use it to understand the situation and determine whether one of the two engagement structures makes sense.'],
      ['What happens after the call?', 'If there is a fit, I will recommend the appropriate engagement, scope and next step. If I do not believe I am the right person, I will say so directly. Pricing is discussed after the situation and required level of involvement are clear.']
    ]
  },
  pt: {
    home: [
      ['Este trabalho é apenas para empresas de e-commerce entre $2M e $20M?', 'É o intervalo em que costumo ser mais útil, porque o negócio já tem tração, equipa e investimento relevante, mas o crescimento se tornou mais difícil de dirigir. Trabalhei com empresas entre $1,5M e mais de $250M, por isso empresas maiores também podem fazer sentido.'],
      ['Empresas B2B também podem trabalhar comigo?', 'Sim. Trabalhei extensivamente com empresas B2B em várias indústrias, incluindo fornecedores de IT, aplicações B2B, plataformas, mobiliário, imobiliário e serviços governamentais. O trabalho pode ser igualmente valioso quando existe uma operação relevante de aquisição, uma equipa ou agências e a empresa precisa de objetivos comerciais, estratégia de canais e responsabilidade mais claros.'],
      ['O que recebo concretamente no Advisory de Crescimento de 3 Meses?', 'O advisory é estruturado em torno de uma sessão de trabalho semanal ou quinzenal consigo e com as pessoas responsáveis pelo crescimento. Em conjunto, revemos o planeamento financeiro, a atribuição, a performance atual e todos os canais ativos. Analisamos e ajustamos as campanhas quando necessário, ensino os media buyers a otimizar e escalar e desenvolvemos as competências de decisão de que a equipa precisa para gerir o crescimento com mais eficácia depois do engagement terminar.'],
      ['Qual é a diferença entre advisory e Head of Growth Fracional?', 'No advisory, trabalho ao lado do líder de crescimento atual para melhorar a qualidade do trabalho, da gestão dos canais e das decisões tomadas. Como Head of Growth Fracional, dirijo ativamente agências e especialistas, lidero o ritmo semanal e assumo a responsabilidade por manter o plano completo sob controlo.'],
      ['Vai substituir a minha agência ou media buyer?', 'Não. Primeiro avalio o estado atual do negócio e determino se falta estratégia, capacidade na agência, liderança interna, medição fiável, conversão, retenção ou outra coisa. Se a agência for competente, dou-lhe objetivos e direção mais claros. Se a agência for o bloqueio, explico exatamente porquê.'],
      ['O que acontece na chamada inicial?', 'Falamos da receita atual, objetivos, equipa, agências, canais e de onde sente que o crescimento está bloqueado. O objetivo é compreender a situação e decidir se advisory, liderança fracional ou nenhuma das opções é o próximo passo certo.']
    ],
    approach: [
      ['O que acontece nas primeiras semanas?', 'Começo por compreender o modelo comercial, objetivos, reporting, canais, equipa e responsabilidades da agência. Depois separo sintomas de causas, identifico o bloqueio mais importante e transformo o diagnóstico num plano priorizado com responsáveis e regras de decisão.'],
      ['Como decide se o problema é a agência, a equipa ou a estratégia?', 'Comparo o que o negócio precisa com as decisões tomadas, a evidência que as suporta e a qualidade da execução. Um resultado fraco não significa automaticamente uma agência fraca. O problema pode ser economia pouco clara, falta de criativos, má conversão, tracking pouco fiável ou falta de liderança.'],
      ['Que números utiliza para gerir o crescimento?', 'Depende do negócio, mas normalmente ligo margem de contribuição, CAC ou CPO de novos clientes, payback, LTV, MER, ROAS por canal e necessidades de caixa. O objetivo não é criar um dashboard maior, mas definir os poucos números que devem mudar uma decisão.'],
      ['Gere as contas de publicidade diariamente?', 'Consigo analisar o detalhe e desafiar quem opera as contas, mas não sou o operador diário de todos os canais. Trabalho acima da execução para que os especialistas tenham objetivos, funções, orçamentos e critérios de escala claros.'],
      ['Com que frequência trabalhamos em conjunto?', 'A cadência adapta-se ao engagement e à fase do negócio. Normalmente inclui uma reunião regular de liderança, sessões focadas quando são necessárias decisões e uma visão partilhada de prioridades, responsáveis e performance entre reuniões.']
    ],
    experience: [
      ['Já trabalhou com um negócio como o meu?', 'Ao longo de 130 marcas trabalhei em moda, beleza, casa, marketplaces, SaaS e outras categorias, com empresas entre aproximadamente $1,5M e mais de $250M de receita anual. O contexto da indústria importa, mas os problemas recorrentes estão normalmente na economia, canais, conversão, retenção, pessoas e responsabilidade.'],
      ['Que canais conhece diretamente?', 'Meta é o meu canal de especialização mais profundo. Também tenho experiência estratégica prática em Google Ads, TikTok, Pinterest, Reddit, Snapchat, Klaviyo, email, lifecycle marketing, landing pages, CRO, promoções, atribuição e dados first-party.'],
      ['O que significa o valor de $250M+?', 'Refere-se à receita anual da maior empresa que aconselhei. Serve para mostrar a amplitude dos ambientes em que trabalhei. Hoje continuo a preferir empresas ambiciosas de e-commerce entre $2M e $20M.'],
      ['Liderou equipas além de as aconselhar?', 'Sim. Fundei a Marvel Test e passei sete anos como Head of Growth and Innovation, responsável pela estratégia dos clientes e pela equipa de performance marketing. Dirigi o trabalho de mais de 30 marcas em simultâneo e contratei em marketing, desenvolvimento, analytics e operações.'],
      ['Porque é relevante ter construído software de atribuição?', 'Construir a MarvelPixel exigiu compreender tracking, qualidade de eventos, dados first-party, modelos de atribuição e como o reporting altera decisões de orçamento. Isso ajuda-me a distinguir um problema real de performance de um problema de medição.']
    ],
    insights: [
      ['Que tipo de pensamento será publicado aqui?', 'O foco é a tomada de decisões prática para empresas de e-commerce estabelecidas: avaliar agências, definir objetivos, escalar Meta, escolher canais, melhorar atribuição, ligar retenção e aquisição e compreender visibilidade em IA.'],
      ['Por onde deve começar um fundador quando o crescimento abranda?', 'Comece pelo objetivo comercial e pela qualidade da evidência. Antes de trocar de agência ou aumentar orçamento, defina o que o crescimento rentável permite, confirme se os números são fiáveis e veja onde a performance muda entre aquisição, conversão e retenção.'],
      ['Bom conteúdo pode substituir um engagement de crescimento?', 'Não. Os insights ajudam um fundador a fazer melhores perguntas e reconhecer padrões. Um engagement aplica esse pensamento à economia, equipa, dados, canais e bloqueios reais da empresa e cria responsabilidade pelas decisões.'],
      ['Porque incluir visibilidade em IA numa estratégia de e-commerce?', 'A descoberta está a expandir-se da pesquisa tradicional para respostas e recomendações de IA. A visibilidade em IA não substitui aquisição paga, SEO ou retenção, mas as marcas devem saber onde são citadas, que fontes influenciam recomendações e que perguntas dos clientes continuam sem resposta.']
    ],
    about: [
      ['Porque passou de liderança de agência para advisory direto?', 'Depois de sete anos a liderar estratégia para muitas marcas em simultâneo, quis trabalhar mais de perto com menos empresas e manter-me envolvido nas decisões que ligam economia, canais, equipas e execução. Hoje trabalho com um máximo de cinco empresas.'],
      ['Continua suficientemente próximo da execução?', 'Sim. Construí lojas Shopify, geri campanhas Meta e Google, controlei orçamentos, escrevi briefings criativos, testei landing pages e ofertas, criei automações de email, planeei promoções, analisei reporting e trabalhei diretamente na conversão. Sei o que peço às equipas.'],
      ['Como é que a sua formação técnica afeta o trabalho?', 'A engenharia ensinou-me a compreender sistemas, isolar variáveis e testar com evidência. Construir a MarvelPixel e a SEOforGPT também me permite aprofundar atribuição, qualidade de dados, workflows de reporting e novos canais de descoberta quando afetam o crescimento.'],
      ['Qual é o seu estilo de trabalho?', 'Direto, estruturado e comercialmente fundamentado. Torno responsabilidades explícitas, desafio pressupostos sem evidência e mantenho o trabalho focado nas decisões com maior probabilidade de mudar o negócio. Não crio atividade apenas para parecer ocupado.'],
      ['Em que idiomas podemos trabalhar?', 'Trabalho em inglês, português e espanhol. A chamada inicial, reuniões de liderança e sessões de trabalho podem decorrer no idioma mais útil para os fundadores e para a equipa.']
    ],
    contact: [
      ['Quem deve marcar uma chamada inicial?', 'Fundadores, CEOs e managing directors de empresas de e-commerce estabelecidas devem marcar quando o crescimento abranda, a escala perde eficiência ou o negócio precisa de direção mais clara entre agências, equipas e canais. O trabalho é mais indicado para empresas com cerca de $2M ou mais de receita anual.'],
      ['Sobre o que vamos falar?', 'Falamos de onde o negócio está hoje, do próximo objetivo, da estrutura da equipa e agências, dos canais ativos e do que está pouco claro ou bloqueado. Vou perguntar o necessário para perceber se posso ser útil.'],
      ['Preciso de preparar alguma coisa?', 'Não é necessária uma apresentação. Ajuda saber a receita anual aproximada, a estrutura atual de marketing, o objetivo para seis meses e uma ou duas decisões que são difíceis de tomar com confiança.'],
      ['A chamada inicial é uma auditoria gratuita?', 'Não. É uma conversa focada em avaliar o enquadramento, não um serviço de diagnóstico separado ou consultoria gratuita. Serve para compreender a situação e determinar se uma das duas estruturas de trabalho faz sentido.'],
      ['O que acontece depois da chamada?', 'Se houver enquadramento, recomendo o engagement, âmbito e próximo passo adequados. Se não for a pessoa certa, digo-o diretamente. O preço é discutido depois de ficar clara a situação e o nível de envolvimento necessário.']
    ]
  },
  es: {
    home: [
      ['¿Este trabajo es solo para empresas de e-commerce de entre $2M y $20M?', 'Es el rango donde normalmente soy más útil porque el negocio ya tiene tracción, equipo e inversión relevante, pero el crecimiento se ha vuelto más difícil de dirigir. He trabajado con empresas desde $1,5M hasta más de $250M, por lo que una empresa mayor también puede encajar.'],
      ['¿Las empresas B2B también pueden trabajar conmigo?', 'Sí. He trabajado ampliamente con empresas B2B en varias industrias, incluyendo proveedores de IT, aplicaciones B2B, plataformas, mobiliario, inmobiliario y servicios gubernamentales. El trabajo puede ser igualmente valioso cuando existe una operación relevante de adquisición, un equipo o agencias y la empresa necesita objetivos comerciales, estrategia de canales y responsabilidades más claras.'],
      ['¿Qué recibo exactamente en la Asesoría de Crecimiento de 3 Meses?', 'La asesoría se estructura en torno a una sesión de trabajo semanal o quincenal contigo y con las personas responsables del crecimiento. Juntos revisamos la planificación financiera, la atribución, el rendimiento actual y todos los canales activos. Analizamos y ajustamos las campañas cuando es necesario, enseño a los media buyers a optimizar y escalar y desarrollamos las habilidades de decisión que el equipo necesita para gestionar el crecimiento con mayor eficacia después de terminar el trabajo.'],
      ['¿Cuál es la diferencia entre asesoría y Head of Growth Fraccional?', 'En la asesoría, trabajo junto al líder de crecimiento actual para mejorar la calidad del trabajo, la gestión de los canales y las decisiones que se toman. Como Head of Growth Fraccional, dirijo activamente agencias y especialistas, lidero el ritmo semanal y asumo la responsabilidad de mantener el plan completo bajo control.'],
      ['¿Vas a sustituir a mi agencia o media buyer?', 'No. Primero evalúo el estado actual del negocio y determino si falta estrategia, capacidad en la agencia, liderazgo interno, medición fiable, conversión, retención u otra cosa. Si la agencia es competente, le doy objetivos y una dirección más claros. Si la agencia es el obstáculo, explico exactamente por qué.'],
      ['¿Qué ocurre en la llamada inicial?', 'Hablamos de ingresos actuales, objetivos, equipo, agencias, canales y de dónde sientes que el crecimiento está bloqueado. El objetivo es entender la situación y decidir si la asesoría, el liderazgo fraccional o ninguna opción es el siguiente paso correcto.']
    ],
    approach: [
      ['¿Qué ocurre durante las primeras semanas?', 'Empiezo por entender el modelo comercial, objetivos, reporting, canales, equipo y responsabilidades de la agencia. Después separo síntomas de causas, identifico el obstáculo más importante y convierto el diagnóstico en un plan priorizado con responsables y reglas de decisión.'],
      ['¿Cómo decides si el problema es la agencia, el equipo o la estrategia?', 'Comparo lo que necesita el negocio con las decisiones tomadas, la evidencia que las respalda y la calidad de la ejecución. Un resultado débil no significa automáticamente una agencia débil. El problema puede ser una economía poco clara, falta de creatividad, mala conversión, tracking poco fiable o falta de liderazgo.'],
      ['¿Qué números utilizas para gestionar el crecimiento?', 'Depende del negocio, pero normalmente conecto margen de contribución, CAC o CPO de nuevos clientes, payback, LTV, MER, ROAS por canal y necesidades de caja. El objetivo no es crear un dashboard mayor, sino definir los pocos números que deben cambiar una decisión.'],
      ['¿Gestionas las cuentas publicitarias cada día?', 'Puedo analizar el detalle y cuestionar a quienes operan las cuentas, pero no soy el operador diario de todos los canales. Trabajo por encima de la ejecución para que los especialistas tengan objetivos, funciones, presupuestos y criterios de escala claros.'],
      ['¿Con qué frecuencia trabajamos juntos?', 'La cadencia se adapta al engagement y a la etapa del negocio. Normalmente incluye una reunión regular de liderazgo, sesiones enfocadas cuando hacen falta decisiones y una visión compartida de prioridades, responsables y performance entre reuniones.']
    ],
    experience: [
      ['¿Has trabajado con un negocio como el mío?', 'A lo largo de 130 marcas he trabajado en moda, belleza, hogar, marketplaces, SaaS y otras categorías, con empresas desde aproximadamente $1,5M hasta más de $250M de ingresos anuales. El contexto de la industria importa, pero los problemas recurrentes suelen estar en economía, canales, conversión, retención, personas y responsabilidad.'],
      ['¿Qué canales conoces directamente?', 'Meta es mi canal de especialización más profundo. También tengo experiencia estratégica práctica en Google Ads, TikTok, Pinterest, Reddit, Snapchat, Klaviyo, email, lifecycle marketing, landing pages, CRO, promociones, atribución y datos first-party.'],
      ['¿Qué significa la cifra de $250M+?', 'Se refiere a los ingresos anuales de la empresa más grande que he asesorado. Muestra la variedad de entornos operativos que conozco. Hoy sigo prefiriendo trabajar con empresas ambiciosas de e-commerce entre $2M y $20M.'],
      ['¿Has liderado equipos además de asesorarlos?', 'Sí. Fundé Marvel Test y pasé siete años como Head of Growth and Innovation, responsable de la estrategia de clientes y del equipo de performance marketing. Dirigí el trabajo de más de 30 marcas simultáneamente y contraté en marketing, desarrollo, analytics y operaciones.'],
      ['¿Por qué es relevante haber creado software de atribución?', 'Construir MarvelPixel exigió comprender tracking, calidad de eventos, datos first-party, modelos de atribución y cómo el reporting cambia decisiones de presupuesto. Eso me ayuda a distinguir un problema real de performance de un problema de medición.']
    ],
    insights: [
      ['¿Qué tipo de ideas se publicarán aquí?', 'El foco es la toma de decisiones práctica para empresas de e-commerce consolidadas: evaluar agencias, definir objetivos, escalar Meta, elegir canales, mejorar atribución, conectar retención y adquisición y entender la visibilidad en IA.'],
      ['¿Por dónde debe empezar un fundador cuando el crecimiento se frena?', 'Empieza por el objetivo comercial y la calidad de la evidencia. Antes de cambiar de agencia o añadir presupuesto, define qué permite el crecimiento rentable, confirma si los números son fiables y observa dónde cambia la performance entre adquisición, conversión y retención.'],
      ['¿Un mejor contenido puede sustituir un engagement de crecimiento?', 'No. Las ideas ayudan a hacer mejores preguntas y reconocer patrones. Un engagement aplica ese pensamiento a la economía, equipo, datos, canales y obstáculos reales de la empresa y crea responsabilidad por las decisiones.'],
      ['¿Por qué incluir visibilidad en IA en una estrategia de e-commerce?', 'El descubrimiento se está ampliando desde la búsqueda tradicional hacia respuestas y recomendaciones de IA. La visibilidad en IA no sustituye adquisición pagada, SEO o retención, pero las marcas deben saber dónde se citan, qué fuentes influyen en las recomendaciones y qué preguntas siguen sin respuesta.']
    ],
    about: [
      ['¿Por qué pasaste del liderazgo de agencia a la asesoría directa?', 'Después de siete años liderando estrategia para muchas marcas a la vez, quise trabajar más cerca de menos empresas y seguir implicado en las decisiones que conectan economía, canales, equipos y ejecución. Ahora trabajo con un máximo de cinco empresas.'],
      ['¿Sigues estando suficientemente cerca de la ejecución?', 'Sí. He creado tiendas Shopify, gestionado campañas de Meta y Google, controlado presupuestos, escrito briefings creativos, probado landing pages y ofertas, creado automatizaciones de email, planificado promociones, analizado reporting y trabajado directamente en conversión. Sé lo que pido a los equipos.'],
      ['¿Cómo afecta tu formación técnica al trabajo?', 'La ingeniería me enseñó a entender sistemas, aislar variables y probar con evidencia. Construir MarvelPixel y SEOforGPT también me permite profundizar en atribución, calidad de datos, workflows de reporting y nuevos canales de descubrimiento cuando afectan al crecimiento.'],
      ['¿Cuál es tu estilo de trabajo?', 'Directo, estructurado y con base comercial. Hago explícitas las responsabilidades, cuestiono supuestos sin evidencia y mantengo el trabajo enfocado en las decisiones con mayor probabilidad de cambiar el negocio. No creo actividad solo para parecer ocupado.'],
      ['¿En qué idiomas podemos trabajar?', 'Trabajo en inglés, portugués y español. La llamada inicial, las reuniones de liderazgo y las sesiones de trabajo pueden realizarse en el idioma más útil para los fundadores y el equipo.']
    ],
    contact: [
      ['¿Quién debería reservar una llamada inicial?', 'Fundadores, CEOs y managing directors de empresas de e-commerce consolidadas deberían reservar cuando el crecimiento se frena, la escala pierde eficiencia o el negocio necesita una dirección más clara entre agencias, equipos y canales. El trabajo es más adecuado para empresas con alrededor de $2M o más de ingresos anuales.'],
      ['¿De qué hablaremos?', 'Hablaremos de dónde está el negocio hoy, el próximo objetivo, la estructura del equipo y las agencias, los canales activos y lo que ahora mismo parece poco claro o bloqueado. Preguntaré lo necesario para entender si puedo ser útil.'],
      ['¿Necesito preparar algo?', 'No hace falta una presentación. Ayuda conocer los ingresos anuales aproximados, la estructura actual de marketing, el objetivo a seis meses y una o dos decisiones que resultan difíciles de tomar con confianza.'],
      ['¿La llamada inicial es una auditoría gratuita?', 'No. Es una conversación enfocada en evaluar el encaje, no un servicio de diagnóstico separado ni consultoría gratuita. La usamos para entender la situación y determinar si una de las dos estructuras de trabajo tiene sentido.'],
      ['¿Qué ocurre después de la llamada?', 'Si existe encaje, recomendaré el engagement, alcance y siguiente paso adecuados. Si no soy la persona correcta, lo diré directamente. El precio se habla después de entender la situación y el nivel de implicación necesario.']
    ]
  }
};
