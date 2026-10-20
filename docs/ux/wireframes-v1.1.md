# LifeHub — Low-Fidelity Wireframes v1.1

Status: Proposed design baseline (20 October 2026). No application code.

LifeHub is a Context-first Hybrid Life OS. Primary navigation: Today, Upcoming, Inbox, Spaces. Global: Search and Quick Capture. One authoritative object per Task, Event, Bill; linked views never duplicate data.

This document records textual screen-by-screen blueprints; no exported Figma frames or code.

## Layout
Desktop: sidebar ~240–256px, max main width ~1200px, 24–32px gutters, main action column plus optional context panel. Mobile: single column, bottom four tabs, global Capture. Initial breakpoints: <600 mobile, 600–899 compact, 900–1199 desktop, ≥1200 wide desktop (validate during design).

## Screen 01 Today
```text
Desktop: [Sidebar] [Date / Greeting / Capture]
                   [Needs Attention (conditional)]
                   [Priorities] [Upcoming/context]
Mobile: [Header / Search]
        [Attention if any]
        [Today's Priorities]
        [Upcoming]
        [Capture] [4-tab bottom navigation]
```
Primary action Capture; inline Complete/Reschedule and Open Detail. Avoid KPI-card overload.

## Screen 02 Upcoming
Date-grouped agenda, type filters All/Tasks/Events/Bills, row status and date/time/amount. Mobile chronological feed, desktop optional detail panel. Return preserves selected date/filter.

## Screen 03 Inbox
List of unprocessed captures; desktop triage panel, mobile item detail/bottom sheet. Edit, Convert, Archive, Delete. Conversion removes item only on successful save.

## Screen 04 Spaces
Default Personal, optional Finance/Work/Family; context cards/list and filtered object feed. No forced workspace setup at onboarding.

## Screen 05 Object Detail
Canonical detail with type/status, title, main facts/action, reminder/recurrence, related objects and history. Task Complete, Event Edit Scope, Bill Mark as Paid for selected occurrence. Mobile full-screen.

## Screen 06 Global Search
Desktop overlay/mobile full-screen; input, results with type/context/status; initial, loading, no-results, error.

## Screen 07 Quick Capture
Desktop centered modal ~560–640px; mobile bottom sheet/full-screen. Input → type detection/selection → editable review → validation → save → result. Fallback to Inbox.

## Navigation matrix
Today→Bill Detail→Today; Upcoming→Event Detail→same date; Inbox→Convert→Inbox; Spaces→Task Detail→Space; Search→Detail→search results; Any main screen→Capture→origin.

## States and acceptance
All screens require empty/loading/error patterns; forms preserve unsaved changes and provide retry. WF-01–12: seven desktop/mobile screens, consistent navigation, action-first Today, global Capture, preserved context, cross-domain Search, Inbox triage, optional Spaces, full state coverage, touch-friendly actions, no duplicate input, canonical routes.
