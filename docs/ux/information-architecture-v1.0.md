# LifeHub — UX Information Architecture v1.0

Status: Proposed design baseline (20 October 2026). No application code.

LifeHub is a Context-first Hybrid Life OS. Primary navigation: Today, Upcoming, Inbox, Spaces. Global: Search and Quick Capture. One authoritative object per Task, Event, Bill; linked views never duplicate data.

## Sitemap
| Route | Purpose |
|---|---|
| `/today` | Attention, priorities, preview |
| `/upcoming` | Date-grouped agenda |
| `/inbox` | Unprocessed captures |
| `/spaces`, `/spaces/:id` | Contexts and related objects |
| `/tasks/:id`, `/events/:id`, `/bills/:id` | Canonical details |
| `/search` | Cross-domain results |
| `/settings` | Account and preferences |
| `/settings/connections` | Post-MVP integrations |

## Desktop/mobile navigation
Desktop persistent sidebar with four destinations and global Search/Capture. Mobile four-tab bottom navigation with separate Capture action and Search in header. Detail and Search full-screen on mobile. Deep links require login when appropriate and then restore destination.

## Today hierarchy
1. P0 Needs Attention: due/overdue/decision-required, hidden if empty.
2. P1 Today's Priorities: actionable tasks/events.
3. P2 Upcoming Preview: next 3–7 days.
4. P3 Optional Contextual Insights: only if relevant.

## Cross-domain principles
Objects have canonical URLs. Preserve origin, selected date, filters, search query and scroll on return where feasible. Search shows type/status/context. Spaces group objects but do not exclusively own them. Inbox contains only unprocessed captures.

## Empty/error states
First-use Today invites first Task; completed Today acknowledges completion. Empty Inbox says All caught up. Search differentiates initial and no-results. Loading uses skeletons; failures retain input and provide Retry; unauthorized access is explicit.

## Acceptance criteria
UX-01 four destinations; UX-02 action-first Today; UX-03 global Capture; UX-04 create objects from any context; UX-05 canonical detail routes; UX-06 cross-view consistency; UX-07 return context; UX-08 cross-domain Search; UX-09 distinct empty states; UX-10 feedback states; UX-11 mobile usability; UX-12 keyboard/screen reader; UX-13 external integration optional; UX-14 source labeling; UX-15 action from originating context.
