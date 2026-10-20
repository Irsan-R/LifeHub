# LifeHub — UI Polish Specification v1.4

> Status: Proposed for review · 20 October 2026 · Design only, no application code.

## Product baseline

LifeHub is a **Context-first Hybrid Life OS**: capture once, stay in context, act anywhere. Its four primary destinations are **Today, Upcoming, Inbox, Spaces**. **Quick Capture** and **Search** are global actions, not extra primary tabs. Tasks, Events, and Bills have canonical detail routes and a single authoritative record per domain. A linked object can appear in multiple contexts without duplication.

## Visual direction

**Calm light, quiet, practical, no glossy styling.** Use borders and whitespace instead of elevated cards, no glassmorphism or decorative gradients, and one dominant primary action per area.

| Token | Proposed value |
|---|---|
| Canvas | `#F7F7F4` |
| Surface | `#FFFFFF` |
| Muted surface | `#F0F2EE` |
| Primary | `#4F705F` |
| Primary hover | `#3E5C4C` |
| Primary text | `#24332C` |
| Secondary text | `#68746D` |
| Border | `#DFE4DD` |
| Attention | `#B48146` |
| Card radius | 12–16px |
| Input/button radius | 10px |

Typography: Inter or readable system sans-serif. Page title 28–32px, section title 18–20px, body 14–16px, supporting text 12–14px. Use tabular figures for monetary amounts. Check contrast and states against WCAG 2.2 AA before design approval.

## Screens

### 01 Today — action-first

- Header with localized date, short greeting, and global Capture.
- Hierarchy: **Needs Attention (only if relevant) → Today's Priorities → Upcoming Preview → optional Contextual Insights**.
- No vanity KPI strip above actions.
- Rows show object type, clear action, status, relevant date/time, and bill amount in IDR.
- Complete a task inline with Undo and rollback on failed save.
- Desktop: main action area + optional secondary context column. Mobile: single feed, bottom navigation.

### 02 Upcoming — one timeline

- Default to chronological agenda list grouped by day; optional calendar grid is not needed for MVP.
- Filters: All, Tasks, Events, Bills.
- Preserve selected day, filters, and scroll when returning from object detail.
- Show overdue and due-today labels in words, not color alone.

### 03 Inbox — safe capture triage

- Only unprocessed capture items, not duplicates of all tasks.
- Review one item at a time: Edit, Convert, Archive, Delete.
- Convert opens editable review; remove item from Inbox only after save succeeds.
- Empty state: 'All caught up' with optional Capture action.

### 04 Spaces — optional context

- Personal is default; Finance, Work, Family etc. are user-created, optional.
- Space groups objects; it does not exclusively own them.
- Removing an object from a Space must not delete the underlying object.
- Deleting a Space must explain impact and not silently delete linked records.

### 05 Object Details — canonical record

Shared structure: Back to context, object type/status, title, primary facts, main action, related objects, history when relevant.

- **Task:** complete/reopen, deadline, priority, related objects.
- **Event:** start/end, timezone, recurrence, edit-scope choice for one occurrence / future / entire series.
- **Bill:** prominent amount, current occurrence and due date, payment status, recurrence rule, payment history separated from bill configuration.
- 'Mark as Paid' records payment for the selected occurrence; show success only after confirmed persistence. Historic payment records are not overwritten by recurrence edits.

### 06 Search — cross-domain discovery

- Desktop overlay, mobile full-screen.
- Each result shows type, title, contextual metadata and status.
- Distinct initial, loading, no-results, error, and results states.
- Preserve query/filter when returning from detail.

### 07 Quick Capture — capture, review, save

- Desktop centered modal; mobile bottom sheet or full-screen composer.
- Natural-language and structured modes converge on **Capture → Editable Review → Validation → Save → Result**.
- Never silently infer ambiguous currency, due date or recurrence.
- Unsupported interpretation can be saved as an unprocessed Inbox item.
- Failed save preserves input; protect unsaved changes and prevent double-submit.

## Navigation and responsiveness

- Desktop sidebar around 240–256px, content maximum around 1200px, main gutters 24–32px.
- Mobile four-tab bottom navigation: Today, Upcoming, Inbox, Spaces. Global Capture separate; Search accessible from header.
- Canonical object URLs and return-context behavior preserve source page, filter, date, and scroll when feasible.
- Main actions must work via keyboard and touch; working touch-target minimum 44×44 CSS px.
- Use visible focus, accessible names, non-color status labels, and reduced-motion support.
- Mobile form controls must remain usable with software keyboard open.

## Interaction states

Every key flow requires empty, loading, validation, error, success, and unsaved-draft handling as applicable. No optimistic success claims for unconfirmed bill payments. Recurring edits require explicit scope and must preserve historical occurrence records.

## Acceptance criteria

- **POL-01:** Today prioritizes actionable information above statistics.
- **POL-02:** Needs Attention is hidden when nothing qualifies.
- **POL-03:** Quick Capture offers editable review, validation, and Inbox fallback.
- **POL-04:** Bill Detail distinguishes occurrence, recurrence, payment status and payment history.
- **POL-05:** Desktop/mobile navigation follows IA v1.0.
- **POL-06:** All principal screens specify empty/loading/error/success states.
- **POL-07:** No glossy styling or dominant decorative gradients.
- **POL-08:** Object relationships are visible without duplicate records.
- **POL-09:** Mobile forms and actions remain usable with keyboard open.
- **POL-10:** Accessibility and contrast are verified before approval.

## Decision log

**Locked:** Context-first navigation; four primary destinations; global Capture and Search; calm light visual direction; canonical detail views; editable review-before-save; Spaces as grouping, not ownership.

**Proposed:** Exact spacing, type sizes, detailed component variants, and responsive breakpoint tuning.

**Deferred:** External calendar sync, advanced AI parsing, goal/habit/notes modules, analytics-heavy dashboards.

## Review checklist

- [ ] Review Today content hierarchy on desktop/mobile
- [ ] Review Quick Capture ambiguous-input and failure states
- [ ] Review Bill occurrence/payment history semantics
- [ ] Verify color contrast and keyboard/touch accessibility
- [ ] Confirm navigation and return-context behavior
- [ ] Approve spec before implementation
