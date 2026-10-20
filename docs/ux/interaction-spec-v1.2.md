# LifeHub — Interaction Specification v1.2

Status: Proposed design baseline (20 October 2026). No application code.

LifeHub is a Context-first Hybrid Life OS. Primary navigation: Today, Upcoming, Inbox, Spaces. Global: Search and Quick Capture. One authoritative object per Task, Event, Bill; linked views never duplicate data.

## Principles
Capture once, stay in context, act anywhere. Progressive disclosure, explicit confirmation, immediate truthful feedback, recoverability, keyboard and touch access. Working touch target ≥44×44 CSS px.

## Navigation
Canonical detail URLs for Task/Event/Bill. Browser Back works; application Back restores originating view/date/filter/query/scroll when possible. Direct deep links use a sensible fallback. Dirty drafts prompt before discard.

## Quick Capture
State flow: Draft → Review → Validate → Saving → Saved. Invalid fields return to Review; failed save retains draft and Retry. Structured and natural-language inputs converge on editable confirmation. Ambiguous amount/date/recurrence is not silently inferred. Unclassified text may be saved to Inbox. Prevent double-submit with idempotency.

## Task
Open ↔ Done, with Undo; Overdue is derived from deadline. Edit, reschedule, pin priority, delete with confirmation, related-object navigation. Optimistic completion must roll back on failure.

## Event
Title, start/end or all-day, timezone, recurrence. Editing repeating event explicitly chooses this occurrence / this and future / entire series. Keep historical links. Define short-month handling for 29th–31st.

## Bill
Bill is obligation/series; Payment is a record against an occurrence. States Upcoming, Due, Overdue, Paid, Cancelled. Mark as Paid requires amount/date and confirmed persistence. Do not mark whole series paid; preserve history. Partial/multiple payments deferred until product policy is defined.

## Inbox and Spaces
Inbox Convert opens review and removes original only after success; failed conversion retains source. Archive differs from Delete. Space grouping is not exclusive ownership; deleting Space must not silently delete linked objects.

## Notifications
Reminder is scheduling rule; Notification is emitted message. States unread/read/actioned/dismissed/failed. Deduplicate reminders across Today and Upcoming. In-app first; email/push later.

## Feedback and forms
Visible labels, inline errors, loading, disabled Save during request, retained input on error, confirmation for destructive actions and dirty modal closure. No success claims before server confirmation.

## Acceptance criteria
INT-01 return context; INT-02 natural/structured Capture; INT-03 validation; INT-04 dirty draft; INT-05 save failure recovery; INT-06 idempotency; INT-07 Task reopen; INT-08 cross-view updates; INT-09 recurrence scope; INT-10 per-occurrence payments; INT-11 payment history; INT-12 safe Inbox conversion; INT-13 safe Space deletion; INT-14 cross-domain Search; INT-15 full feedback states; INT-16 keyboard/touch; INT-17 reminder deduplication; INT-18 external-source labeling when supported.

## Usability scenarios
Create recurring internet Bill, edit due date, record payment, find via Search, return to Today, save ambiguous Inbox capture, convert to Task, edit one recurring occurrence, protect dirty form, complete Task inline.
