import type { SharedReviewState } from './wheeler-review';

export const updatedClusters = new Set(["project-specific-package-handoffs", "la-steel-framing-provider-evaluation", "wildfire-rebuild-framing-decisions", "architect-builder-design-coordination", "fire-code-and-assembly-evaluation", "steel-framing-quote-comparison"]);
export const updatedArticles = new Set(["78c2da9e-b67b-464f-a9cc-09c11f041dfc", "355306fb-aea7-44c6-865d-f313a2914d58", "b35e5a60-6923-4dbc-9c43-7c3f7d01f774", "d71ccbd9-4c61-40b6-abdc-a48543fd7718", "0737f9c8-d435-4b62-83f1-1b663ae7755d", "9d93fc4d-a219-4010-a896-d9ff6a2108d2", "823d9903-1aac-41c7-9e5d-019f8ce2d355", "a50fa511-f913-4f30-9793-17e89d7d479b", "cb7037b6-fc83-4ba2-83f7-d7818667c90c", "8ba5c5fd-cfaa-4882-b8b1-277490fd59b2", "63066716-0d0f-458c-ba18-a702c1681c4a", "7cc66375-caff-4bea-ae13-aa2eb270e0e2", "38c8b034-0983-451c-a9e8-8f5b1a0fa9bc", "4efec579-2af8-43dd-a5df-e970ae5e91fd", "ae195cc7-7470-4114-9c77-b4021ac3c63d", "9491a14d-12e2-4a69-8afb-57c085df6412", "3cba08d6-26e9-48e9-bac2-06ea5e32f5aa", "4ce15d08-c5e8-4824-9e60-1a3fda60c032", "8f9d5066-638d-436e-9757-91ff87f11cf4", "84cc2a24-88a6-4033-847d-264e5c588597", "c711725e-ccf0-4c23-8f45-257d1d7f273d", "c3168124-e85c-490c-bfd1-df2b29cf6cb0", "1cd2bfae-9187-4cba-b5e6-a274652af714", "c49b484a-97d1-46e1-b37a-337b674a7426"]);
const responses: Record<string, { note: string; through: string; label: string; answer: string }> = {
  "article:b35e5a60-6923-4dbc-9c43-7c3f7d01f774": {
    "note": "Include Steel vs Wood vs Concrete: Comparing the budget for installation",
    "through": "2026-10-10T00:02:00.313Z",
    "label": "Resolved",
    "answer": "Updated the title and brief to compare steel, wood and a clearly identified concrete system using equivalent installation scopes and supported cost information."
  },
  "article:d71ccbd9-4c61-40b6-abdc-a48543fd7718": {
    "note": "We need to review this and gain accuracy. We're also in discovery mode ourselves. This will need to be high-level, as we want to ensure that our IP in the site readiness belongs with Wheeler.",
    "through": "2026-10-10T00:03:01.873Z",
    "label": "Resolved",
    "answer": "Reframed as high-level first-project planning. Detailed site-readiness procedures and proprietary methods are excluded; Wheeler’s accuracy review is required before publication."
  },
  "article:0737f9c8-d435-4b62-83f1-1b663ae7755d": {
    "note": "We want to see how to skew this so that it talks about the process. Please interview or send a list of questions that we can include for this ones. We want this to be inviting and digestible. Fortunately/unfortunately, RACIs may put some people off.",
    "through": "2026-10-10T00:04:55.831Z",
    "label": "Answer needed",
    "answer": "Replaced the responsibility matrix with an inviting customer-process walkthrough. The questions for Wheeler are listed in the article details; your team’s answers are needed before drafting."
  },
  "article:9d93fc4d-a219-4010-a896-d9ff6a2108d2": {
    "note": "Perhaps the topic should be 'Qualifying for California Wildfire Insurance Discounts' and it then covers some programs and how to qualify.",
    "through": "2026-10-10T00:06:00.863Z",
    "label": "Resolved",
    "answer": "Adopted your title and shifted the brief to programs, eligibility, mitigation measures, documentation and qualification steps, with calculations secondary."
  },
  "article:823d9903-1aac-41c7-9e5d-019f8ce2d355": {
    "note": "Help me to understand the intent behind this topic. I understand the layout and trade coordination, but I don't understand the Steel Framing for Open-Plan Homes. Perhaps it's Steel Framing for Custom Homes?",
    "through": "2026-10-10T00:07:40.267Z",
    "label": "Resolved",
    "answer": "Renamed to Steel Framing for Custom Homes. Its distinct intent is design and trade coordination: layouts, openings, service routes and finishes. Open-plan layouts are one example, rather than the whole topic."
  },
  "article:a50fa511-f913-4f30-9793-17e89d7d479b": {
    "note": "Perhaps it's Selecting a Supplier to Frame your Los Angeles Custom Home",
    "through": "2026-10-10T00:09:17.984Z",
    "label": "Resolved",
    "answer": "Adopted your proposed title. The brief covers supplier scope, customization, experience, coordination, delivery and installation responsibility."
  },
  "article:cb7037b6-fc83-4ba2-83f7-d7818667c90c": {
    "note": "Is the point of this article to compare Wheeler Homes vs Homes with Panelizers and cover insurance, etc? OR is it to specifically address the builders' risk insurance for Wheeler?",
    "through": "2026-10-10T00:11:49.629Z",
    "label": "Resolved",
    "answer": "Replaced the builders’ risk topic with a homeowner-focused article about how fire-resistive home construction can affect insurance costs. November 18 now focuses on comparing actual insurance quotes on equivalent terms, so the two articles have different purposes."
  }
};
// Resolve only the feedback addressed by this revision. Later feedback stays open.
export function resolvedFeedback(key: string, decision?: SharedReviewState['decisions'][string]) {
 const response = responses[key];
 return response && decision && decision.note === response.note && decision.updatedAt <= response.through ? response.answer : undefined;
}
export function feedbackResolutionLabel(key: string) {
 return responses[key]?.label || 'Resolved';
}
