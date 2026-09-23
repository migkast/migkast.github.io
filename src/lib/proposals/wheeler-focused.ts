import { engagements, gtmAgents, type PlanFeature } from './wheeler';

// Copy the earlier scope so changes here never rewrite the original proposal.
const previous = engagements.find(plan => plan.id === 'agents')!;
const reuse = (title: string): PlanFeature => structuredClone(previous.features.find(feature => feature.title === title)!);
const roadmapPoint = (lead: string, detail: string) => ({ lead, detail });
const agentBullet = (titles: string[], lead: string, detail: string) => ({
  lead,
  detail,
  logos: titles.flatMap(title => gtmAgents.find(agent => agent.title === title)?.logos ?? []),
});
const focusedAgentOrder = ['SEO + GEO Monitoring Agent', 'Content Agent', 'Reddit Seeding Agent', 'LinkedIn Outreach Agent', 'Cold Email Agent'];
export const focusedAgents = focusedAgentOrder.map(title => {
  const agent = structuredClone(gtmAgents.find(item => item.title === title)!);
  if (title === 'LinkedIn Outreach Agent') {
    agent.detail = 'Finds relevant LA builders and GCs, sends LinkedIn outreach and routes responses to Wheeler.';
    agent.includes = ['Identify builders and GCs using professional profiles and available intent signals', 'Send relevant LinkedIn outreach within agreed rules', 'Route commercial responses to Wheeler'];
  }
  if (title === 'Cold Email Agent') {
    agent.detail = 'Sends targeted builder emails as sending accounts become ready and routes responses to Wheeler.';
    agent.includes = ['Prepare sender accounts and monitor deliverability', 'Send relevant builder outreach as inbox readiness allows', 'Manage opt-outs and route commercial responses to Wheeler'];
  }
  return { ...agent, starts: title === 'LinkedIn Outreach Agent' || title === 'Cold Email Agent' ? 'Month 2' : 'Month 1' };
});
focusedAgents.push({
  title: 'Potential New Agents',
  starts: 'As needed',
  detail: 'Room to adapt or add agent workflows as Wheeler’s priorities become clearer.',
  includes: [
    'Identify new needs from campaign results and Wheeler’s commercial priorities',
    'Adapt an existing workflow or propose a new agent where it adds value',
    'Agree the scope and resources before expanding the agent program',
  ],
});
export const focused = {
  name: 'Wheeler Growth', price: 7000, instagramPrice: 700,
  features: [
    {title:'One GTM funnel', detail:'Review and improve Wheeler’s path from builder visit to inquiry.', includes:['Review the existing builder journey with Wheeler','Improve agreed landing paths and calls to action','Check lead capture and sales handoffs','Iterate on the website journey using visitor behavior and sales feedback']},
    {title:'GTM agents', detail:'Authority first. Targeted builder outreach follows in month 2.', items:['Month 1: SEO + GEO Monitoring, Content and Reddit Seeding','Month 2: LinkedIn Outreach and Cold Email','As needed: adapt or propose new agent workflows'], includes:focusedAgents.map(agent => `${agent.title}: ${agent.detail}`)},
    {title:'Marketing analytics foundation', detail:'Assess what Wheeler already has, keep what works and fix the gaps needed to understand demand and improve conversion.', includes:['Review the current measurement setup and identify what is already working','Resolve agreed gaps in conversion tracking and attribution','Make it possible to assess landing-page and funnel performance']},
    reuse('Brand & search visibility'),
    {...reuse('Local SEO + website improvements'), includes:['Review crawlability and indexing','Prioritize Los Angeles search opportunities','Improve titles, page structure and internal links','Improve conversion paths and apply agreed fixes to the existing site']},
    reuse('Campaign optimization & testing'),
    {title:'Lead handling & CRM assessment', detail:'Review how inquiries are captured and followed up, and whether the CRM is ready for future connections.', includes:['Review the current CRM, lead records and sales stages','Check source tracking, access and integration capabilities','Identify gaps that could block future marketing connections','Recommend the changes needed before connecting new workflows; implementation is separately agreed']},
  ] satisfies PlanFeature[],
  instagram: [
    'Profile preparation and a consistent visual identity.',
    'Homeowner-focused visuals showing design, customization and supported resilience benefits.',
    'Visual editing using suitable supplied footage.',
    'Scheduling and publishing approved Instagram content.',
  ],
  outcomes: [
    {title:'Search & AI recommendations', label:'Builder and homeowner questions', outputs:['Track whether Wheeler appears when LA builders and general contractors ask relevant questions in Google and selected AI tools, with homeowner questions monitored as a second audience.','Improve Wheeler’s pages, identity and supporting references so the correct Wheeler is a stronger answer to those questions.','Show how Wheeler’s visibility changes, who is recommended instead, competitor share of voice and the sources AI answers cite.'], learning:'Which builder and homeowner questions bring Wheeler into consideration, where competitors or the legacy site appear instead, and what to improve to earn more relevant recommendations.', goal:'Increase Wheeler’s presence as a credible option in relevant builder and homeowner search and AI answers.'},
    {title:'Content & authority', label:'Editorial strategy + rolling calendar', outputs:['A three-month editorial strategy, with a rolling publication calendar.','Priority articles and website updates published using approved expert papers, project material and visibility findings.','Relevant Reddit participation that may help buyers discover Wheeler through search and AI answers, and bring referral visits to its website.'], learning:'Which topics attract relevant attention and support inquiries, so the calendar can adapt as evidence arrives.', goal:'Turn Wheeler’s expertise into discoverable content that builds buyer confidence and relevant demand.'},
    {title:'Builder outreach', label:'LinkedIn + cold email launched', outputs:['LA builders and general contractors identified and prioritized using available intent signals and professional network data.','Configured outreach agents, connected accounts and campaign messages with follow-up sequences.','Live campaigns from month 2, subject to account readiness, plus an agreed campaign plan supporting local sales activity.'], learning:'Which segments and messages generate relevant replies and conversations, and whether outreach merits more investment.', goal:'Start qualified conversations with LA builders and general contractors that Wheeler can develop into projects.'},
    {title:'Conversion & lead capture', label:'One working builder funnel', outputs:['Review Wheeler’s current builder website journey with Stacie, then improve agreed page paths and calls to action.','Test forms, inquiry routing and conversion events; iterate on the website as visitor behavior and sales results become available.','A lead-handling and CRM readiness assessment identifying gaps before future integrations.'], learning:'Where visitors drop off and what prevents an inquiry. A separate decision on whether to prepare the homeowner funnel.', goal:'Turn more relevant visits into inquiries that reach the right person at Wheeler.'},
    {title:'Performance & next priorities', label:'Review, adjust, decide', outputs:['Review search visibility, content, outreach, buyer behavior and qualified inquiries as data becomes available, using Wheeler’s sales feedback.','Pivot targeting, content, outreach or conversion paths when results show a different approach is needed.'], learning:'Which efforts create qualified demand, which need a different approach and what is ready to scale.', goal:'Concentrate time and investment on the activities that show the strongest commercial promise.'},
  ],
  months: [
    {title:'Connect existing foundations + Brand & search visibility', purpose:'Complete and connect the foundations Wheeler needs to generate and measure demand.', items:[
      roadmapPoint('Assess existing measurement', 'and resolve the gaps needed for analytics, landing-page optimization, conversion analysis and attribution.'),
      roadmapPoint('Review and improve the builder website journey', 'and lead capture; assess CRM readiness for future connections.'),
      roadmapPoint('Brand & search visibility:', 'strengthen the correct Wheeler’s identity, search presence and inquiry routing.'),
      {text:'Set up and launch these AI agents:', agents:[
        agentBullet(['SEO + GEO Monitoring Agent'],'SEO + GEO monitoring agent','to track search and AI visibility and produce reports'),
        agentBullet(['Content Agent'],'Content agent','to publish approved articles and updates on Wheeler’s website'),
        agentBullet(['Reddit Seeding Agent'],'Reddit seeding agent','to contribute useful, openly affiliated answers in relevant subreddits, creating opportunities for search and AI discovery and referral visits'),
      ]},
      roadmapPoint('Reuse and optimize', 'Wheeler’s existing expert papers, project content and photos to get the name out there.'),
      roadmapPoint('If selected, launch homeowner-focused Instagram content', 'from day one of publishing.'),
    ]},
    {title:'Activate builder outreach', purpose:'Turn the authority foundation into relevant commercial conversations.', items:[
      roadmapPoint('Agent foundation & setup:', 'configure the LinkedIn Outreach and Cold Email agents, connect accounts and prepare builder targeting.'),
      roadmapPoint('Cold-email sending infrastructure:', 'prepare sender accounts, warm them up and monitor inbox placement before ramping volume.'),
      roadmapPoint('Outreach campaign setup & launch:', 'identify LA builders and GCs using available intent signals and professional network data, develop messages with Wheeler’s input and launch as channels become ready.'),
      roadmapPoint('Prepare ad hoc campaigns', 'to support on-the-ground sales: builder meetings, association activity and local events, with coordinated messaging, supporting content and follow-up plans.'),
      roadmapPoint('Measure and optimize', 'the brand and search visibility agents.'),
    ]},
    {title:'Optimize builder acquisition and prepare the next push', purpose:'Get more from the channels already running and define the next investment.', items:[
      roadmapPoint('Assess homeowner funnel readiness:', 'review demand, sales capacity and investment priorities. If the timing is right, prepare the website journey and lead capture with Wheeler.'),
      roadmapPoint('Explore homeowner channels:', 'if demand and an agreed budget support expansion, begin preparing Meta Ads or test another channel such as Pinterest. Paid campaign management and spend would be separately agreed.'),
      roadmapPoint('Optimize live outreach:', 'refine builder targeting, messages and follow-up sequences using campaign response and Wheeler’s sales feedback.'),
      roadmapPoint('Improve inquiry conversion:', 'iterate on landing pages and calls to action using visitor behavior and builder feedback.'),
      roadmapPoint('Measure search performance and expand coverage:', 'use visibility data and buyer questions to prioritize content for builders and homeowners.'),
      roadmapPoint('Prepare the next sales-support campaign:', 'develop the audience, messaging and digital campaign plan for an agreed builder event, association initiative or local sales push.'),
      roadmapPoint('Set next-quarter priorities:', 'recommend what to continue, change or scale, with the budget and resources required.'),
    ]},
  ],
};
export function focusedEmail(instagram: boolean) {
  const name=focused.name+(instagram ? ' + Instagram' : '');
  const price=focused.price+(instagram ? focused.instagramPrice : 0);
  return 'mailto:hey@seoforgpt.io?subject='+encodeURIComponent('Wheeler proposal: '+name)+'&body='+encodeURIComponent(`Hi Miguel,\n\nI would like to discuss ${name} at $${price.toLocaleString('en-US')}/month, with an initial three-month engagement, including scope, software costs and a kickoff date.\n`);
}
