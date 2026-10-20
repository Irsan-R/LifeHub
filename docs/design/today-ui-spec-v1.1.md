# LifeHub — Today UI Implementation Specification v1.1

**Status:** Proposed / pending design approval  
**Scope:** Prototype Today desktop/mobile; implementation guidance for PR #50  
**Figma:** https://www.figma.com/design/MKTPGPF6l5EvVtpIZQfGQk  
**Reference:** `docs/design/implementation-guide-v1.0.md` (PR #49); `docs/design/high-fidelity-v1.3.md` if present on target branch.

> **Do not treat the current Figma baseline as a complete approved design system.** Prototype visual decisions are subject to screenshot comparison and review. This document supplements—not silently overrides—existing product, UX, or architecture specifications.

## 1. Product principles and boundaries

LifeHub is a context-first life management workspace. **Today** is a projection of canonical Task, Event, and Bill objects, not a new persistent entity. Navigation contains exactly four primary destinations: **Today, Upcoming, Inbox, Spaces**. Search and Quick Capture are global actions, not additional navigation tabs.

MVP prototype scope: responsive App Shell; Today dashboard; conditional attention; priority tasks; upcoming preview; Search preview; Quick Capture input/review/save-to-preview; loading/empty/error/demo states. Production auth, canonical APIs, persistence, full Upcoming/Inbox/Spaces, recurring bill payment, and complete object detail pages are **not yet implemented** by PR #50.

## 2. Design tokens

| Name | Value | Use |
| --- | --- | --- |
| `--canvas` | `#F7F7F4` | App background |
| `--surface` | `#FFFFFF` | Cards/sidebar/dialog |
| `--muted` | `#F0F2EE` | Active nav, quiet surfaces |
| `--primary` | `#4F705F` | Primary actions |
| `--primary-hover` | `#3E5C4C` | Hover |
| `--ink` | `#24332C` | Main text |
| `--secondary` | `#68746D` | Supporting text |
| `--border` | `#DFE4DD` | Borders |
| `--attention` | `#B48146` | Attention accent |

- Typography: Inter with sans fallback; desktop page heading ~34px, mobile ~28px; section heading 18–21px; body 13–15px; metadata 11–13px.
- Spacing: base 4px scale; use 8/12/16/24/32px increments. Treat Figma absolute coordinates as measurements, **not CSS absolute positioning instructions**.
- Radius: cards 13–14px, buttons 9–11px, mobile floating action circular.
- Appearance: matte calm light, minimal elevation, no glassmorphism, neon, gradients, or dashboard vanity statistics.
- All actionable controls: minimum 44×44 CSS px target where applicable. Keyboard focus must remain visible.

## 3. Information architecture and layout

### 3.1 Desktop reference (1440×960)

- Fixed or sticky left sidebar: 250px wide, white, right border.
- Content background off-white, approximately 42px inner horizontal gutters.
- Sidebar order: Today → Upcoming → Inbox → Spaces; active destination has muted background and green label.
- Header: localized current date, time-appropriate greeting, short description; global Search and Quick Capture at upper right.
- Content order: **Needs Attention (conditional)** → **Today's Priorities** → **Coming Up**. On wide desktop, priorities and Coming Up can be side-by-side, but reading/DOM order must remain logical.
- Attention: one or more attention items; white bordered card, narrow amber accent, reason, title, contextual metadata, explicit action.
- Priorities: list of canonical Task references with accessible completion control, title, contexts/priority and optional time.
- Coming Up: date and title for canonical Event/Bill/other supported references, detail navigation.
- Optional contextual insights must not displace primary actions.

### 3.2 Mobile reference (390×844)

- Single-column content with 18–22px horizontal margins.
- Compact wordmark and global Search trigger at top.
- Same Today content order as desktop; do not hide important information merely because viewport is small.
- Fixed bottom navigation with four destinations; separate floating Quick Capture action positioned **above** nav and device safe area.
- Provide content bottom padding at least sufficient for nav + floating action + safe area, so final content remains scrollable and reachable.
- Avoid overlay of floating button over text/interactive content; check at different scroll positions, not just initial screenshot.

### 3.3 Responsive verification matrix

| Width | Expected behavior |
| --- | --- |
| 320 / 375 / 390 | Mobile shell, single-column content, bottom tabs, safe-area-aware capture |
| 768 | Tablet/mobile arrangement or documented intermediate adaptation, no overflow |
| 1024 | Desktop sidebar or documented tablet variant; cards never crush content |
| 1440 | Desktop reference composition |

No horizontal overflow; headings may wrap; long titles and metadata must not force viewport expansion. Verify at 200% text zoom and when content is longer than demo fixtures.

## 4. Component contracts

| Component | Input | Interaction | Empty/error/accessibility |
| --- | --- | --- | --- |
| `AppShell` | route, current user/context, actions | route change; global triggers | semantic `nav` and `main`, focus order |
| `PrimaryNavigation` | four destinations, active route | links preserve demo flag only in demo mode | `aria-current=page` derived from actual route, not hardcoded Today |
| `TodayHeader` | now, locale, timezone | Search/Capture triggers | no hardcoded greeting/date; locale-ready |
| `NeedsAttention` | attention item[] | open canonical source | absent when zero items; accessible section heading |
| `AttentionItem` | source ref, reason, detail, action | open correct object/occurrence | urgency conveyed by text as well as color |
| `TodayPriorities` | task[] | open task, toggle completion | clear empty state; optimistic update rollback when API exists |
| `TaskRow` | stable task ref, title, dueAt, contexts, completed | toggle and open detail separately | accessible checked state, 44px target, pending/disabled |
| `UpcomingPreview` | upcoming ref[] | open correct object | empty state, localized date, no duplicated object data |
| `GlobalSearch` | query, result refs | search/open result | loading, empty, error; keyboard support |
| `QuickCapture` | draft, step | input → review/edit → save → success | validation, failure recovery, draft retention |
| `Dialog` | title, content, close action | Escape/close/backdrop | focus trap, initial focus, restore trigger focus on close |
| `FeedbackToast` | message/type | dismiss | status announcement, non-blocking |

**Review note:** PR #50 uses a custom `role=dialog` section. Its focus trapping and focus restoration are not demonstrated by current browser tests. Use a proven accessible dialog primitive or implement and test these behaviors.

## 5. Data and navigation contract

Conceptual types (illustrative, **not a DB migration**):

```ts
type ObjectRef = { type: 'task' | 'event' | 'bill'; id: string; href: string };
type TodayProjection = {
  attention: Array<{ ref: ObjectRef; reason: string; title: string; detail: string; action: string }>;
  priorities: Array<{ ref: ObjectRef; title: string; completed: boolean; contexts: string[]; priority: 'high' | 'medium' | 'normal'; dueAt?: string }>;
  upcoming: Array<{ ref: ObjectRef; title: string; detail: string; at: string }>;
};
```

- **One canonical object identity.** Do not infer whether a bill/task exists from its presence in one Today section. Detail routes resolve by object type + ID against canonical API (or a single demo object registry in prototype mode).
- Bill occurrences must remain distinguishable from recurring series. Payment applies to selected occurrence only.
- Opening a detail should preserve the source route and relevant filter/date/scroll where possible; a validated return URL must not permit external redirect.
- Today projection must not independently persist copies of source objects.
- Use `?demo=1` only for isolated preview fixtures; do not accidentally enable demo mutation on production data.
- Session storage is an **ephemeral prototype mechanism**. Do not call it account storage or persistent Inbox.
- Timezone, currency, and locale must be configurable; do not assume `en-US` or a fixed timezone is the final product requirement.

## 6. State and interaction specification

### 6.1 Today page
- `loading`: visible skeleton or progress status; no flashing fake data.
- `ready`: render projection with conditional attention.
- `empty`: omit Needs Attention, show constructive empty copy for tasks/upcoming.
- `error`: clear error message and retry path if API exists; demo-only preview link may appear in prototype.
- `unauthenticated`: future auth integration; avoid leaking user data or redirect loops.

### 6.2 Task completion
1. User activates completion control.
2. UI updates optimistically only when a supported mutation path exists; while pending, prevent conflicting requests.
3. On success, retain canonical state; on failure, rollback and show actionable feedback.
4. In demo, explicitly label local-only state; do not imply server persistence.

### 6.3 Quick Capture
1. Open capture dialog; focus input.
2. Enter freeform text; blank or whitespace-only content cannot advance.
3. Review step shows editable original draft and clear back/save actions.
4. Save to preview Inbox only in demo; avoid duplicates on repeated activation; handle storage quota/error.
5. On failure preserve draft and review step; on success announce saved state and allow dismissal.
6. Closing and reopening behavior should be explicitly chosen: **recommended** preserve unfinished draft unless user discards it; current PR #50 resets step on open but may retain text, so test/document intended behavior.

### 6.4 Global Search
- Search across preview canonical refs without duplicates, not across independent Today copies.
- Empty query displays guidance; unmatched query displays no-results; loading/error states when connected to API.
- Ctrl/Cmd+K opens; Escape closes; restore focus to trigger on close.
- Search result activation should close overlay and open canonical detail.

## 7. Accessibility and content

- WCAG 2.2 AA target; record actual automated and manual checks.
- Use semantic headings, list, nav, main, buttons and time elements.
- Test full keyboard flow, dialog focus trap/return, screen reader labels, Escape, zoom/reflow, reduced motion.
- Color alone cannot communicate attention, completion, or active state.
- Use localization keys for labels; use runtime locale/timezone for date and time. Figma copy is illustrative, not a localization decision.
- Long task titles, 0/1/20+ items, large amounts, translated strings, and offline/error states must not break layout.

## 8. Visual acceptance process

1. Obtain current Figma frame(s) and export at 1440×960 desktop and 390×844 mobile.
2. Render implementation at same viewport, font and content fixture.
3. Compare page-level hierarchy, card geometry, padding, type size/weight, icon style, colors, and mobile safe areas.
4. Classify differences as **intentional adaptation**, **bug**, or **open design decision**.
5. Attach side-by-side screenshots to implementation PR and record unresolved differences. If Figma frame is inaccessible, explicitly mark pixel fidelity **not verified**.

## 9. Definition of done — Today prototype

- [ ] Four primary destinations, correct active route, separate global Search/Capture.
- [ ] Correct desktop/mobile hierarchy and responsive behavior at target widths.
- [ ] Needs Attention conditionally absent when empty.
- [ ] Canonical object references resolve independently of Today section placement.
- [ ] Mobile floating capture does not obscure navigation or actionable content.
- [ ] Search, capture review, empty/loading/error states behave as specified.
- [ ] Keyboard dialog focus trap and focus restoration verified.
- [ ] Browser tests run on CI-compatible browser installation.
- [ ] Accessibility audit and screenshot comparison documented.
- [ ] Demo-only data/storage clearly distinguished from production.
- [ ] Product/design reviewer approves visual differences before merge.

## 10. Non-goals

This specification does not approve or define complete Upcoming, Inbox, Spaces, authentication, bill payments, recurrence editing, notification delivery, or persistent domain APIs. Each requires its own screen/interaction and backend contracts before being called implemented.
