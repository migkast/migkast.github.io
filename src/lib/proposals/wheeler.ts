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
  launchChannelsAt?: number;
}
export const gtmAgents: PlanFeature[] = [
  {title:'SEO + GEO Monitoring Agent',includes:["Set up keyword and buyer-question monitoring", "Establish Google and AI visibility baselines", "Track changes and competitor mentions", "Generate visibility reports and flag optimization opportunities"],detail:'Monitors search and AI visibility, generates reports and flags opportunities.',logos:[{src:'https://cdn.jsdelivr.net/npm/simple-icons@11/icons/openai.svg',alt:'ChatGPT'},{src:'https://www.gstatic.com/images/branding/googleg/1x/googleg_standard_color_128dp.png',alt:'Google'}]},
  {title:'Content Agent',includes:["Turn visibility data into content briefs", "Write structured, source-backed articles", "Use Wheeler’s approved product and brand material", "Publish articles and update existing content within agreed editorial rules"],detail:'Writes, publishes and updates content using SEO and AI visibility data.',logos:[{src:'/images/wheeler/content-agent.svg',alt:'Content writing'}]},
  {title:'LinkedIn Outreach Agent',includes:["Research architects, builders and developers", "Build relevant prospect lists", "Send personalized connection and outreach messages", "Run follow-up sequences and route replies to Wheeler"],detail:'Finds professional buyers, sends LinkedIn outreach and follows up.',logos:[{src:'https://cdn.jsdelivr.net/npm/simple-icons@11/icons/linkedin.svg',alt:'LinkedIn'}]},
  {title:'Cold Email Agent',includes:["Configure agreed domains, mailboxes and sender authentication", "Manage email warmup and monitor deliverability", "Share prospect research with the LinkedIn agent", "Write and send targeted cold email sequences", "Run follow-ups and route replies to Wheeler", "Manage opt-outs and ramp sending with deliverability readiness"],detail:'Sends targeted cold emails, follows up and routes replies to Wheeler.',logos:[{src:'/images/wheeler/email-agent.svg',alt:'Email'}]},
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
    firstWeeks:["Five agents publishing, reporting and doing outreach.", "Marketing analytics, CRM and two buyer funnels set up.", "Initial LA search improvements and brand protection underway."],
    features:[
      {title:'GTM agents',includes:gtmAgents.map(agent=>agent.title),items:gtmAgents.map(agent=>agent.title)},
      {title:'Marketing analytics setup',includes:["Configure Google Analytics and Google Search Console", "Set up Bing Webmaster Tools", "Set up or optimize Google Business Profile and coordinate verification with Wheeler", "Set up PostHog where agreed", "Define lead and conversion events", "Validate tracking and reporting access"],detail:'Google Analytics, Search Console, Bing Webmaster Tools, Google Business Profile and PostHog.'},
      {title:'Set up two GTM funnels',includes:["Define homeowner and professional propositions", "Map landing pages and calls to action", "Set up lead forms and sales handoffs", "Test each path from visit to inquiry"],detail:'One for homeowners; one for architects, builders and developers.'},
      {title:'CRM & pipeline reporting',includes:["Configure the CRM and connect lead sources", "Set up homeowner and professional pipelines", "Route inquiries to Wheeler", "Report on sources, lead stages and outcomes", "Wheeler manages sales follow-up, quotes and closing"],detail:'Capture inquiries, organize both buyer pipelines and track progress.'},
      {title:'Campaign optimization & testing',includes:["Test audiences and messages", "Review response and conversion data", "Improve campaigns based on results"],detail:'Test audiences and messages, measure response and improve campaign performance.'},
      {title:'Brand & search visibility',includes:["Map searches where the independently owned legacy site ranks", "Strengthen Wheeler’s own pages, identity signals and useful content", "Build credible references and links to the correct Wheeler", "Coordinate brand protection with Wheeler’s counsel; legal action remains with Wheeler", "Track progress toward outranking the legacy site; rankings are not guaranteed"],detail:'Compete to outrank the independently owned legacy site and bring demand to Wheeler.'},
      {title:'Local SEO + website improvements',includes:["Review crawlability and indexing", "Prioritize Los Angeles search opportunities", "Improve titles, page structure and internal links", "Apply agreed fixes to the existing site"],detail:'Prioritize LA pages and existing-site fixes.'},
    ]},
  {id:'team',name:'Marketing Team',price:15000,
    launchChannelsAt:1,
    description:'We launch Wheeler across search, paid and social to build the go-to brand.',
    includesLabel:'Everything in Growth Execution, plus:',
    involvement:"Miguel runs positioning, campaign strategy and specialist execution for the agreed marketing program.",
    firstWeeks:["Everything in Growth Execution, plus:", "An all-in LA brand launch across", "Google Ads brand protection: capture Wheeler searches and direct demand to the right website.", "Dedicated PPC campaigns for both funnels: homeowners and architects, builders and developers.", "Organic social publishing reinforces the launch through a coordinated editorial calendar."],
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
  {
  "id": "cmo",
  "name": "Fractional CMO",
  "price": 27000,
  "description": "A marketing leader for Wheeler, so Stacie can focus on building the business.",
  "includesLabel": "Everything in Marketing Team, plus these CMO responsibilities:",
  "involvement": "Miguel directs marketing within agreed authority and brings Stacie clear decisions. Wheeler retains sales leadership, pricing, contracts and final investment approvals.",
  "firstWeeks": [
    "The full Marketing Team launch, plus the leadership foundation for Wheeler’s next stage:",
    "A 3–6 month LA decision brief, informed by founder, buyer and sales-team input: where to concentrate, how to differentiate and which partner opportunities to pursue.",
    "An investment case for Stacie: budget scenarios, expected outcomes and assumptions, resource needs and criteria for increasing spend.",
    "A clear marketing mandate: decision authority, specialist accountability and an escalation process so Stacie does not manage daily execution.",
    "A first executive growth review: the priorities to fund now, initiatives to defer and the evidence needed before expanding beyond LA."
],
  "features": [
    {
      "title": "Marketing leadership & accountability",
      "detail": "Delegate marketing priorities and performance, not just the task list.",
      "includes": [
        "Own the marketing plan and set priorities across the team",
        "Resolve delivery tradeoffs and hold specialists accountable",
        "Review performance and take corrective action",
        "Bring Stacie recommendations and decisions, rather than day-to-day coordination"
      ]
    },
    {
      "title": "Investment & resource planning",
      "detail": "Put the right budget and people behind the next stage of growth.",
      "includes": [
        "Develop investment scenarios using Wheeler’s goals and commercial inputs",
        "Recommend channel mix, specialist capacity and hiring needs",
        "Reallocate approved resources as evidence develops",
        "Align growth investment with delivery readiness; Wheeler approves additional spend"
      ]
    },
    {
      "title": "Customer & market intelligence",
      "detail": "Find what makes buyers choose Wheeler and what holds them back.",
      "includes": [
        "Lead a structured buyer-research program with homeowners and professionals",
        "Combine interviews, campaign evidence and Wheeler’s sales feedback",
        "Track competitor positioning and emerging market opportunities",
        "Turn findings into decisions about messaging, priorities and buyer experience"
      ]
    },
    {
      "title": "Strategic partner marketing",
      "detail": "Build repeatable routes to buyers through trusted industry relationships.",
      "includes": [
        "Develop architect and builder education and co-marketing programs",
        "Turn approved insurance and expert relationships into joint launch opportunities",
        "Create partner content, activation plans and measures of contribution",
        "Lead marketing activation; Wheeler owns partnership agreements and negotiations"
      ]
    },
    {
      "title": "Marketing Engineering",
      "detail": "Build interactive tools that help buyers understand Wheeler, gain confidence and start a project.",
      "includes": [
        "Identify where buyers need clearer evidence or an easier next step",
        "Design and build agreed tools such as method comparisons, project-fit guides or guided project briefs",
        "Connect the experience to Wheeler’s inquiry and sales handoff",
        "Measure usage and inquiry quality, then improve the tool; substantial software projects are separately scoped"
      ]
    },
    {
      "title": "Market-entry strategy",
      "detail": "Turn what works in LA into a deliberate plan for the next market.",
      "includes": [
        "Assess buyer demand, competition and routes to market",
        "Recommend expansion priorities using marketing evidence and Wheeler’s operating inputs",
        "Develop the local positioning, launch plan and investment case",
        "Lead approved marketing launches; Wheeler decides business expansion and delivery commitments"
      ]
    }
  ]
}
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

export const engagementEmail=(name:string)=>'mailto:hey@seoforgpt.io?subject='+encodeURIComponent('Wheeler proposal: '+name)+'&body='+encodeURIComponent('Hi Miguel,\n\nI would like to discuss the '+name+' engagement for Wheeler, including scope, marketing budget and a kickoff date.\n');
