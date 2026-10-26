export const conversionDefinitions = [
 { event: 'generate_lead', label: 'Project form submissions' },
 { event: 'phone_click', label: 'Phone clicks' },
 { event: 'email_click', label: 'Email clicks' },
 { event: 'kit_request', label: 'Kit requests', trackedFrom: '2026-10-25' },
 { event: 'ask_don_entry', label: 'Ask Don form submissions', trackedFrom: '2026-10-25' },
] as const;

export type ConversionEvent = typeof conversionDefinitions[number]['event'];
export type ConversionCounts = Record<ConversionEvent, number | null>;
