import { engagements, gtmAgents, type PlanFeature } from './wheeler';

// Copy the earlier scope so changes here never rewrite the original proposal.
const previous = engagements.find(plan => plan.id === 'agents')!;
const reuse = (title: string): PlanFeature => structuredClone(previous.features.find(feature => feature.title === title)!);
const agentBullet = (titles: string[], text: string) => ({
  text,
  logos: titles.flatMap(title => gtmAgents.find(agent => agent.title === title)?.logos ?? []),
});
export const focused = {
  name: 'Wheeler Growth', price: 7000, instagramPrice: 700,
  features: [
    {title:'One GTM funnel', detail:'One focused path for LA builders and general contractors.', includes:['Define the builder and GC proposition','Align landing pages and calls to action','Set up lead capture and sales handoffs','Test the path from visit to inquiry']},
    {title:'GTM agents', detail:'Authority first. Targeted builder outreach follows in month 2.', items:['Month 1: SEO + GEO Monitoring, Content and Reddit Seeding','Month 2: LinkedIn Outreach and Cold Email'], includes:gtmAgents.map(agent => `${agent.title}: ${agent.detail}`)},
    {...reuse('Marketing analytics setup'), detail:'Google Analytics, Search Console, Bing Webmaster Tools, Google Business Profile, PostHog and Microsoft Clarity, configured for the agreed stack.', includes:[...reuse('Marketing analytics setup').includes, 'Configure Microsoft Clarity to identify friction in the buyer journey']},
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
  months: [
    {title:'Marketing foundations + Brand & search visibility', purpose:'Complete and connect the foundations Wheeler needs to generate and measure demand.', items:['Complete analytics, conversion tracking and reporting access.','Set up the builder funnel and lead capture; assess CRM readiness for future connections.','Brand & search visibility: strengthen the correct Wheeler’s identity, search presence and inquiry routing.',{text:'Set up and launch these AI agents:', agents:[agentBullet(['SEO + GEO Monitoring Agent'],'SEO + GEO monitoring agent'),agentBullet(['Content Agent'],'Content agent'),agentBullet(['Reddit Seeding Agent'],'Reddit seeding agent')]},'Reuse and optimize Wheeler’s existing expert papers, project content and photos to get the name out there.','If selected, launch homeowner-focused Instagram content from day one of publishing.']},
    {title:'Activate builder outreach', purpose:'Turn the authority foundation into relevant commercial conversations.', items:['Agent foundation & setup: configure the LinkedIn Outreach and Cold Email agents, connect accounts and prepare targeting and sending infrastructure.','Outreach campaign setup & launch: build LA builder and GC prospect lists, write personalized messages and follow-up sequences, and launch as channels become ready.','Prepare ad hoc campaigns to support on-the-ground sales: builder meetings, association activity and local events, with coordinated messaging, supporting content and follow-up plans.','Measure and optimize the brand and search visibility agents.']},
    {title:'Optimize builder acquisition and prepare the next push', purpose:'Get more from the channels already running and define the next investment.', items:['Assess readiness for a homeowner funnel: review demand, sales capacity and investment priorities. If the timing is right, prepare the messaging, landing journey and lead capture.','Optimize live outreach: refine builder targeting, messages and follow-up sequences using campaign response and Wheeler’s sales feedback.','Improve inquiry conversion: strengthen landing-page messaging and calls to action based on visitor behavior.','Measure search performance and expand coverage: use visibility data and buyer questions to prioritize content for builders and homeowners.','Prepare the next sales-support campaign: develop the audience, messaging and digital campaign plan for an agreed builder event, association initiative or local sales push.','Set next-quarter priorities: recommend what to continue, change or scale, with the budget and resources required.']},
  ],
};
export function focusedEmail(instagram: boolean) {
  const name=focused.name+(instagram ? ' + Instagram' : '');
  const price=focused.price+(instagram ? focused.instagramPrice : 0);
  return 'mailto:hey@seoforgpt.io?subject='+encodeURIComponent('Wheeler proposal: '+name)+'&body='+encodeURIComponent(`Hi Miguel,\n\nI would like to discuss ${name} at $${price.toLocaleString('en-US')}/month, with an initial three-month engagement, including scope, software costs and a kickoff date.\n`);
}
