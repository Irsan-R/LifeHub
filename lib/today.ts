export type ObjectType = 'task' | 'event' | 'bill';
export type ObjectRef = { type: ObjectType; id: string; href: string };
export type Priority = 'high' | 'medium' | 'normal';
export type TodayTask = { ref: ObjectRef; title: string; completed: boolean; priority: Priority; contexts: string[]; dueAt?: string };
export type AttentionItem = { ref: ObjectRef; title: string; reason: string; detail: string; action: string };
export type UpcomingItem = { ref: ObjectRef; title: string; detail: string; at: string };
export type TodayProjection = { attention: AttentionItem[]; priorities: TodayTask[]; upcoming: UpcomingItem[] };

// These fixtures are isolated from production data and only enabled by ?demo=1.
export const demoToday: TodayProjection = {
  attention: [{ ref: { type: 'bill', id: 'internet-oct-2026', href: '/bills/internet-oct-2026' }, title: 'Internet bill due soon', reason: 'Due soon', detail: 'Review this occurrence before its due date.', action: 'Review bill' }],
  priorities: [
    { ref: { type: 'task', id: 'weekly-plan', href: '/tasks/weekly-plan' }, title: 'Review the weekly plan', completed: false, priority: 'high', contexts: ['Personal'], dueAt: '2026-10-20T09:00:00+07:00' },
    { ref: { type: 'task', id: 'project-proposal', href: '/tasks/project-proposal' }, title: 'Send project proposal', completed: false, priority: 'medium', contexts: ['Work'], dueAt: '2026-10-20T14:00:00+07:00' },
    { ref: { type: 'task', id: 'groceries', href: '/tasks/groceries' }, title: 'Pick up groceries', completed: false, priority: 'normal', contexts: ['Personal'] }
  ],
  upcoming: [
    { ref: { type: 'event', id: 'team-sync', href: '/events/team-sync' }, title: 'Team sync', detail: 'Work · Event', at: '2026-10-21T10:00:00+07:00' },
    { ref: { type: 'bill', id: 'internet-oct-2026', href: '/bills/internet-oct-2026' }, title: 'Internet bill', detail: 'Personal · Bill occurrence', at: '2026-10-22T09:00:00+07:00' },
    { ref: { type: 'event', id: 'family-lunch', href: '/events/family-lunch' }, title: 'Family lunch', detail: 'Personal · Event', at: '2026-10-24T12:00:00+07:00' }
  ]
};

export function objectHref(ref: ObjectRef, origin = '/today') {
  return `${ref.href}?from=${encodeURIComponent(origin)}`;
}
