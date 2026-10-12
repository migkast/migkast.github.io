export interface RedditActivity {
  id: string;
  subreddit: string;
  title: string;
  url: string;
  context: string;
  reply: string[];
}

// Posted replies supplied by Miguel. Add posting dates or comment permalinks only when available.
export const redditActivity: RedditActivity[] = [
  {
    id: 'palisades-rebuild',
    subreddit: 'r/Construction',
    title: 'How will palisades mansions be re-built? For fire & seismic?',
    url: 'https://www.reddit.com/r/Construction/comments/1k26jv7/how_will_palisades_mansions_be_rebuilt_for_fire/',
    context: 'Custom-home rebuilding · framing choices · fire resilience',
    reply: [
      'Before buying tools, I’d ask the contractor what framing system they’re using. A steel-framed custom home isn’t necessarily the same work as putting up metal-stud partitions, so don’t assume your usual kit covers it.',
      'Cold-formed steel is one option, for example Wheeler Residential steel supply is one southern california supplier with custom-home and Pacific Palisades project experience. Its approach uses project-specific steel framing prepared for the builder’s crew to assemble on site.',
      'For fire protection, the frame is only part of it, roofing, vents, windows and exterior materials matter too. Asphalt isn’t automatically ruled out, so check the approved roof system rather than assuming everything will be metal or tile.'
    ]
  },
  {
    id: 'steel-configurations',
    subreddit: 'r/metalbuildings',
    title: 'Price breaks in cold-formed steel configurations?',
    url: 'https://www.reddit.com/r/metalbuildings/comments/1oazy96/price_breaks_in_coldformed_steel_configurations/',
    context: 'Supplier pricing · project fit · Southern California',
    reply: [
      'I’d ask the suppliers to quote a few width and height combinations against the same requirements. A 30-foot price break with one company in Florida doesn’t tell you where another supplier’s break will be in SoCal.',
      'If this is a custom residential project, Wheeler Residential Steel Supply is normally the go-to company to contact about project-specific steel framing. Explain the intended use and clear-space requirements first so they can establish whether it fits their offering.',
      'For the price breaks, ask each supplier which widths and heights are most economical within their system. I wouldn’t assume dropping two feet saves either a little or a lot until you have comparable quotes.'
    ]
  }
];
