export interface PlanFeature { title: string; includes: string[]; person?: boolean; detail?: string; logo?: string; logos?: {src: string; alt: string}[]; items?: string[]; }
export interface Engagement {
  id: 'managed' | 'agents' | 'team' | 'cmo';
  name: string;
  price: number;
  description: string;
  includesLabel: string;
  features: PlanFeature[];
  involvement: string;
  firstWeeks: string[];
}
export const gtmAgents: PlanFeature[] = [
  {title:'SEO + GEO Monitoring Agent',includes:["Set up keyword and buyer-question monitoring", "Establish Google and AI visibility baselines", "Track changes and competitor mentions", "Generate visibility reports and flag optimization opportunities"],detail:'Monitors search and AI visibility, generates reports and flags opportunities.',logos:[{src:'https://cdn.jsdelivr.net/npm/simple-icons@11/icons/openai.svg',alt:'ChatGPT'},{src:'https://www.gstatic.com/images/branding/googleg/1x/googleg_standard_color_128dp.png',alt:'Google'}]},
  {title:'Content Agent',includes:["Turn visibility data into content briefs", "Write structured, source-backed articles", "Use Wheeler’s approved product and brand material", "Publish articles and update existing content within agreed editorial rules"],detail:'Writes, publishes and updates content using SEO and AI visibility data.',logos:[{src:'/images/wheeler/content-agent.svg',alt:'Content writing'}]},
  {title:'LinkedIn Outreach Agent',includes:["Research architects, builders and developers", "Build relevant prospect lists", "Send personalized connection and outreach messages", "Run follow-up sequences and route replies to Wheeler"],detail:'Finds professional buyers, sends LinkedIn outreach and follows up.',logos:[{src:'https://cdn.jsdelivr.net/npm/simple-icons@11/icons/linkedin.svg',alt:'LinkedIn'}]},
  {title:'Cold Email Agent',includes:["Share prospect research with the LinkedIn agent", "Write and send targeted cold email sequences", "Run follow-ups and route replies to Wheeler", "Manage opt-outs and ramp sending with deliverability readiness"],detail:'Sends targeted cold emails, follows up and routes replies to Wheeler.',logos:[{src:'/images/wheeler/email-agent.svg',alt:'Email'}]},
  {title:'Reddit Seeding Agent',includes:["Find relevant communities and discussions", "Check community participation rules", "Publish useful contributions with transparent affiliation", "Escalate sensitive topics and respect community rules"],detail:'Finds relevant discussions and participates with useful, openly affiliated contributions.',logos:[{src:'/platforms/reddit.svg',alt:'Reddit'}]}
];
export const engagements: Engagement[] = [
  {id:'managed',name:'GTM Managed Agents',price:5000,
    description:'I operate the agents and manage exceptions.',
    includesLabel:'Setup + ongoing management included',
    involvement:'Managed agent operation within agreed publishing and outreach rules.',
    firstWeeks:['Configure all five agents and baseline reports.','Start publishing and activate outreach as channels become ready.'],
    features:gtmAgents},
  {id:'agents',name:'Growth Execution',price:9000,
    description:'I run organic growth and outreach.',
    includesLabel:'GTM agents + hands-on execution:',
    involvement:"Ongoing organic and outreach execution led by Miguel.",
    firstWeeks:["Five agents publishing, reporting and doing outreach.", "Marketing analytics and two buyer funnels set up.", "Initial LA search improvements and brand protection underway."],
    features:[
      {title:'GTM agents',includes:gtmAgents.map(agent=>agent.title),items:gtmAgents.map(agent=>agent.title)},
      {title:'Brand & search visibility',includes:["Map searches where the independently owned legacy site ranks", "Strengthen Wheeler’s own pages, identity signals and useful content", "Build credible references and links to the correct Wheeler", "Coordinate brand protection with Wheeler’s counsel; legal action remains with Wheeler", "Track progress toward outranking the legacy site; rankings are not guaranteed"],detail:'Compete to outrank the independently owned legacy site and bring demand to Wheeler.'},
      {title:'Marketing analytics setup',includes:["Configure Google Analytics and Google Search Console", "Set up PostHog where agreed", "Define lead and conversion events", "Validate tracking and reporting access"],detail:'Google Analytics, Google Search Console and PostHog, configured for the agreed stack.'},
      {title:'Set up two GTM funnels',includes:["Define homeowner and professional propositions", "Map landing pages and calls to action", "Set up lead forms and sales handoffs", "Test each path from visit to inquiry"],detail:'One for homeowners; one for architects, builders and developers.'},
      {title:'Local SEO + website improvements',includes:["Review crawlability and indexing", "Prioritize Los Angeles search opportunities", "Improve titles, page structure and internal links", "Apply agreed fixes to the existing site"],detail:'Prioritize LA pages and existing-site fixes.'},
      {title:'Content publishing & optimization',includes:["Publish content within agreed editorial rules", "Format headings, links and metadata", "Connect articles to relevant buyer journeys", "Refresh content using visibility and engagement data"],detail:'Operate publishing, page optimization and ongoing content updates.'},
      {title:'Email infrastructure',includes:["Configure agreed domains and mailboxes", "Set up sender authentication", "Plan gradual email warmup and monitor deliverability", "Ramp active cold email sending as deliverability allows"],detail:'Domains, authentication, warmup and delivery monitoring for active outreach.'},
      {title:'Lead tracking + reporting',includes:["Capture inquiry source and campaign details", "Define reporting metrics with Wheeler", "Build a basic lead reporting view", "Review lead quality using Wheeler’s sales feedback"],detail:'Know where inquiries come from and what happens next.'}
    ]},
  {id:'team',name:'Marketing Team',price:15000,
    description:'We launch Wheeler across search, paid and social to build the go-to brand.',
    includesLabel:'Everything in Growth Execution, plus:',
    involvement:"Miguel leads coordinated specialist execution across the agreed channels.",
    firstWeeks:["Everything in Growth Execution, plus:", "An all-in LA brand launch across Facebook and Instagram: coordinated video, creative and retargeting built to make Wheeler a familiar name across the region.", "Google Ads brand protection: capture Wheeler searches and direct demand to the right website.", "Dedicated PPC campaigns for both funnels: homeowners and architects, builders and developers.", "Organic social publishing reinforces the launch through a coordinated editorial calendar."],
    features:[
      {title:'Google Ads Specialist',includes:["Set up or audit the Google Ads account", "Configure and validate conversion tracking", "Research keywords and build campaigns", "Launch a Wheeler brand campaign directing searches to the correct website", "Write and test ad copy", "Optimize bids, budgets and search terms"],person:true,detail:'Search campaigns, testing and optimization.',logo:'/platforms/googleads-color.svg'},
      {title:'Meta Ads Specialist',includes:["Set up the business and advertising accounts", "Set up or connect Facebook and Instagram pages", "Configure Meta Pixel and agreed conversion events", "Build audiences, campaigns and new ads", "Test creative and optimize performance"],person:true,detail:'Meta campaigns, retargeting and creative tests.',logo:'/platforms/meta-color.svg'},
      {title:'Designer',includes:["Create social graphics and campaign visuals", "Design ad creative and channel adaptations", "Edit short-form video from supplied material", "Apply Wheeler’s visual identity consistently"],person:true,detail:'Social visuals, ad creative and short-form video editing using Wheeler’s project material.',logo:'/images/wheeler/designer.svg'},
      {title:'Brand growth strategy',includes:["Define a recognizable brand position for each buyer audience", "Build campaign themes around Wheeler’s expertise and project material", "Align paid, search and organic messaging", "Review brand visibility and refine what resonates"],detail:'Make Wheeler recognizable and build preference across the market.'},
      {title:'Organic social + editorial calendar',includes:["Plan an editorial calendar around buyer questions", "Prepare social copy and visual briefs", "Schedule and publish approved content", "Review engagement and adjust topics"],detail:'Plan, create and publish approved content around Wheeler’s projects and buyer questions.'},
      {title:'Ad creative production',includes:["Develop campaign concepts and messages", "Prepare copy and design briefs", "Adapt approved creative to campaign formats", "Test variations and carry forward learnings"],detail:'Develop and test creative messages for the agreed campaigns.'},
      {title:'Social channel management',includes:["Set up or optimize Facebook, Instagram, Pinterest, TikTok and YouTube profiles", "Plan channel priorities and coordinate publishing", "Adapt approved content to each active channel", "Monitor channel performance and refine distribution", "Video-led activity depends on Wheeler supplying suitable footage"],detail:'Manage publishing and presence across the agreed channels. Video-led activity depends on supplied footage.',logos:[{src:'https://cdn.jsdelivr.net/npm/simple-icons@11/icons/facebook.svg',alt:'Facebook'},{src:'https://cdn.jsdelivr.net/npm/simple-icons@11/icons/instagram.svg',alt:'Instagram'},{src:'https://cdn.jsdelivr.net/npm/simple-icons@11/icons/pinterest.svg',alt:'Pinterest'},{src:'https://cdn.jsdelivr.net/npm/simple-icons@11/icons/tiktok.svg',alt:'TikTok'},{src:'https://cdn.jsdelivr.net/npm/simple-icons@11/icons/youtube.svg',alt:'YouTube'}]},
      {title:'Landing-page improvements',includes:["Review message and offer clarity", "Improve layout, forms and calls to action", "Align landing pages with campaigns", "Test conversion tracking and mobile usability"],detail:'Turn more relevant visits into inquiries.'},
      {title:'Attribution + sales feedback',includes:["Connect campaign sources to CRM records", "Define qualification and outcome reporting", "Review meetings, quotes and pipeline with Wheeler", "Use sales feedback to improve targeting"],detail:'Connect campaigns, leads, quotes and pipeline.'}
    ]},
  {id:'cmo',name:'Fractional CMO',price:27000,
    description:'I lead the marketing function.',
    includesLabel:'Everything in Marketing Team, plus:',
    involvement:"Embedded growth leadership, aligned with Stacie\u2019s operating cadence.",
    firstWeeks:["Everything in Marketing Team, with Miguel accountable for the growth function:", "A 3–6 month LA market-entry plan: priority buyers, competitive positioning and the moves that build preference for Wheeler.", "An investment plan connecting channel budgets and conversion assumptions to qualified pipeline goals.", "A functioning external growth team: clear ownership, launch coordination and decisions driven by one accountable lead.", "An executive growth dashboard and decision cadence with Stacie: what to accelerate, what to stop and when California expansion is justified."],
    features:[
      {title:'Speed run GTM',includes:["Prioritize the fastest useful launches", "Coordinate parallel work across specialists", "Resolve marketing delivery dependencies", "Use early evidence to refine the launch"],detail:'Build Wheeler into the go-to steel construction brand.'},
      {title:'Company-wide growth strategy',includes:["Set commercial growth priorities with Stacie", "Align positioning, channels and resource needs", "Define performance goals and investment tradeoffs", "Lead the executive growth decision cadence"],detail:'Set the growth direction, commercial priorities and investment choices.'},
      {title:'Hiring + team development',includes:["Define roles and resource needs", "Source and assess approved hires", "Onboard and coordinate the team", "Set expectations and review performance"],detail:'Select, onboard and manage the right people.'},
      {title:'Vendor & specialist management',includes:["Select suitable specialist resources", "Set clear briefs and deliverables", "Coordinate dependencies and quality reviews", "Manage performance against agreed priorities"],detail:'Coordinate delivery and performance.'},
      {title:'Budget allocation',includes:["Recommend channel and resource budgets", "Allocate within Wheeler’s approved authority", "Review spend against performance", "Recommend where to increase or reduce investment"],detail:'Direct approved investment toward what works.'},
      {title:'New-market launches',includes:["Assess demand, competition and delivery readiness in each market", "Adapt campaigns and buyer journeys to local demand", "Coordinate approved launches and sales handoffs", "Measure launch performance before expanding further"],detail:'Turn approved expansion priorities into local launches, from California outward.'},
      {title:'Partnerships + channel experiments',includes:["Identify relevant partners and channels", "Define small, measurable experiments", "Coordinate approved tests", "Recommend which initiatives to scale"],detail:'Test new opportunities before scaling them.'},
      {title:'Executive reporting',includes:["Report progress against growth priorities", "Review pipeline and marketing performance", "Surface decisions, risks and dependencies", "Align with Stacie’s operating cadence"],detail:'Growth decisions aligned with Stacie’s operating cadence.'}
    ]}
];
export const money=(value:number)=>'$'+value.toLocaleString('en-US');
export const terms='All plans: USD, billed monthly in advance, with a 3-month initial term. Month-to-month afterward with 30 days’ notice. Setup included.';
export const extras='The marketing budget and channel allocation will be agreed with Wheeler before launch. Advertising spend is separate from the retainer; software, travel and taxes are additional. Major shoots, extensive development and dedicated hires are separately agreed. Delivery follows agreed priorities, using shared specialist and production capacity.';
export const growthPhases = [
  {title:'Strategy', detail:'Clarify the brand, audiences, positioning and priorities.'},
  {title:'Foundation', detail:'Clarify brand routing and set up analytics, lead capture and GTM infrastructure.'},
  {title:'Agents + outreach', detail:'Launch content, SEO / AI visibility and professional prospecting.'},
  {title:'Coordinated marketing', detail:'Bring paid campaigns, design and organic social online together.'},
  {title:'Experiment + scale', detail:'Improve channels, test opportunities and assess expansion.'}
] as const;
