# LifeHub — Figma-to-Code Implementation Guide v1.0

> Status: **Implementation handoff / visual baseline** (not an approved final design).  
> Figma source: https://www.figma.com/design/MKTPGPF6l5EvVtpIZQfGQk  
> Product: **LifeHub — Context-first Hybrid Life OS**  
> Scope: **Today desktop (1440 × 960), Today mobile (390 × 844), foundational visual tokens**.  
> Audience: Codex and frontend engineers. **Do not implement unrelated screens as if designed.**

## 1. Source-of-truth hierarchy

1. **Figma** is authoritative for current visual composition and layer-level details. Inspect the actual file, including pages `00 — Foundations & Components`, `01 — Desktop UI & Flows`, and `02 — Mobile UI & Handoff`.
2. This document is the implementation contract for semantics, interaction, accessibility, responsive behavior, and known limitations.
3. Existing GitHub product, architecture, UX and backlog documents are authoritative for product/domain rules. In case of conflict, raise a question rather than silently changing established LifeHub principles.

The Figma file was created under a Starter plan with a three-page limit. The named pages are **containers**, not evidence that all components, flows, or screens have been designed. The current Figma compositions use editable text and shapes; they are **not yet a complete, published component library**.

## 2. Product UX invariants — MUST preserve

- Four and only four primary destinations: **Today, Upcoming, Inbox, Spaces**.
- Search and Quick Capture are **global actions**, not fifth/sixth primary tabs.
- Today is an **action-oriented projection** of canonical Task, Event, Bill, and other objects, not a separate data store.
- Today sections, in order: **Needs Attention (conditional)** → **Today's Priorities** → **Upcoming Preview** → **Contextual Insights (optional)**. Do not add vanity metrics.
- Objects retain context and identity across Today, Upcoming, Inbox, Spaces, and Search. Preserve return origin/filter/date/scroll when possible.
- Quick Capture: **input → editable review → validation → save → success**. Ambiguous capture can go to Inbox; never silently guess a canonical object.
- Bill payments apply to the **selected occurrence**; never mark an entire recurring series paid from one action.
- Spaces are non-exclusive contexts; deleting a Space does not delete linked objects.

## 3. Visual foundations

| Token | Hex | Intended role |
| --- | --- | --- |
| `canvas` | `#F7F7F4` | Application canvas |
| `surface` | `#FFFFFF` | Sidebar, cards, input surfaces |
| `surface-muted` | `#F0F2EE` | Active navigation, secondary controls |
| `primary` | `#4F705F` | Primary action, active icon/text |
| `primary-hover` | `#3E5C4C` | Hover state |
| `text-primary` | `#24332C` | Primary typography |
| `text-secondary` | `#68746D` | Metadata, supporting copy |
| `border` | `#DFE4DD` | Dividers, cards, inputs |
| `attention` | `#B48146` | Needs Attention accent |

**Visual intent:** calm, readable, low-noise, soft off-white and muted forest/sage green. Avoid glassmorphism, neon, strong gradients, glossy highlights, large decorative shadows, dense analytics cards, and excessive badges.

**Typography:** Inter or the closest available system sans fallback. Approximate styles observed in the Figma baseline: desktop hero 34px / semibold; mobile hero 28px / semibold; section titles 18–21px / semibold; body 13–15px; supporting labels 11–13px. These are baseline sizes, not a finalized typographic scale. Prefer semantic typography tokens and verify against Figma.

**Layout tokens (implementation proposal, validate visually):**
- 4px spacing grid; common gaps 8/12/16/24/32.
- Border radius: cards ~13–14px, controls ~9–11px.
- Borders: 1px muted neutral.
- Keep card elevations flat or barely perceptible.
- Minimum touch targets: **44 × 44 CSS px**. Text contrast must meet WCAG 2.2 AA; test combinations rather than assuming every palette pair passes.

## 4. Desktop Today — observed Figma baseline

**Frame:** 1440 × 960. Main canvas `#F7F7F4`. Left sidebar **250px** with white surface and right border. Content begins approximately **x = 292px** (42px from sidebar edge).

### Sidebar
- Wordmark “LifeHub” at upper left with subtle uppercase tagline.
- Primary navigation in this exact order: Today, Upcoming, Inbox, Spaces.
- Active Today item uses muted surface fill and primary green label.
- Settings and personal-space metadata appear near bottom.
- No extra main navigation items.

### Header
- Upper left: date eyebrow, “Good morning.” greeting, brief explanatory subtitle.
- Upper right: Search field and green **Quick capture** action.
- Header copy in Figma is illustrative; do **not** hardcode date or greeting. Use locale-aware runtime data.

### Main content
1. **Needs attention** heading, short count/explanation, and a bordered white attention card. Example content: internet bill due soon; amber accent bar; “Review bill” action. Render only when attention-worthy objects exist.
2. **Today's priorities** heading and list of three illustrative tasks, each with checkbox, title, context/priority metadata, and optional time. The task list is a white card.
3. **Coming up** / Upcoming Preview white card on the right of the priorities list, with compact date/title/metadata rows. This is a projection of canonical objects, not duplicate event/bill records.
4. A subtle explanatory line at bottom. Optional Contextual Insights should not be forced into the initial viewport.

**Approximate desktop geometry:** attention card x292/y258/w1104/h106; task list x292/y481/w700/h290; upcoming preview x1016/y481/w380/h290. These coordinates are **reference measurements only**, not a mandate for absolute positioning in production.

## 5. Mobile Today — observed Figma baseline

**Frame:** 390 × 844. Main canvas off-white; horizontal content margins approximately 18–22px.
- Compact top bar with LifeHub wordmark and Search icon.
- Date eyebrow, greeting, and short intro.
- Needs Attention card, then Today's Priorities card, then Coming Up preview.
- **Bottom tab bar**: Today, Upcoming, Inbox, Spaces — in that order. Search remains a top-level action; Quick Capture remains separate.
- A floating green **+** capture action is shown near the lower right.

**Important design-review note:** The first-pass mobile floating capture button and Coming Up preview are visually close to the bottom navigation. **Do not reproduce an overlap**. In production, position floating actions above the tab bar and device safe area; reserve enough scroll padding for the final list/preview to be fully visible. Prefer a scrollable content region and fixed/safe-area-aware tab bar.

The current Figma uses simple text symbols as some navigation glyph placeholders. **Replace these with a consistent accessible icon set** (e.g. Lucide) rather than shipping placeholder glyphs.

## 6. Responsive implementation contract

- Desktop: sidebar + content area; priority list and Upcoming Preview can sit side-by-side when width allows.
- Mobile: single-column reading order, four-tab bottom navigation, search affordance in header, separate floating or prominent Quick Capture action.
- Tablet/intermediate widths: adapt using CSS grid/flex and container-aware breakpoints; do not hardcode desktop x/y positions.
- Do not allow horizontal overflow at 320px, 375px, 390px, 768px, 1024px, and 1440px.
- Respect device safe areas for fixed navigation and floating controls.
- Preserve scroll position and user context on detail → back navigation when feasible.

## 7. Suggested frontend structure (guidance, not mandated file paths)

```text
AppShell
├── DesktopSidebar / MobileBottomNav
├── GlobalSearchTrigger
├── QuickCaptureTrigger
└── TodayPage
    ├── TodayHeader
    ├── NeedsAttentionSection (conditional)
    │   └── AttentionItem
    ├── TodayPrioritiesSection
    │   └── TaskRow
    └── UpcomingPreviewSection
        └── UpcomingItem
```

Favor reusable semantic components rather than page-specific hardcoded markup. Existing proposed stack: Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui or Radix; verify the repository's actual dependencies before selecting implementation patterns. Do not add a second UI framework without justification.

### Data contract examples (conceptual, not a database schema)

- `TaskRow`: stable `taskId`, title, completion status, optional due date/time, priority, and linked contexts.
- `AttentionItem`: stable `sourceObjectId`, object type, attention reason, label, optional amount/date, destination action.
- `UpcomingItem`: stable object ID, type, date/time, title, contextual subtitle, detail destination.

Render from canonical APIs/selectors; never store a second independent “Today task” or “Today bill” record. Avoid assuming all cards are tasks.

## 8. Interaction and states — implementation requirements

| UI | Interaction | Required states |
| --- | --- | --- |
| Sidebar / bottom tabs | Route between four main destinations | Active, hover/focus, accessible label |
| Task checkbox | Toggle canonical Task completion with rollback/error handling | Pending, checked, error |
| Task row | Open detail while retaining origin/context | Focus, keyboard activation |
| Attention card | Open source object detail/action | Default, focus, loading/error |
| Upcoming row | Open canonical object detail | Focus, empty |
| Search | Open global search UI | Idle, typing, loading, results, no results, error |
| Quick Capture | Open capture input then review before save | Draft, ambiguous, validation, saving, success, error |

Provide skeletons or restrained loading feedback, informative empty states, and recoverable errors. Do not use fake functional buttons, dead-end navigation, or hardcoded demo data as production behavior.

## 9. Accessibility and localization

- WCAG 2.2 AA target; test actual text/background pairs.
- Visible keyboard focus and logical tab order; semantic nav, main, headings, buttons, and list structures.
- Accessible checkbox labels and state announcements.
- Do not rely on color alone to communicate urgency or completion.
- Dates/times/currency are locale-aware. Figma uses illustrative English copy and Indonesian rupiah; product language strategy is **not finalized**. Keep all copy localizable; do not infer that all UI must be English.
- Avoid hardcoded “Tuesday, 20 October 2026” and “Good morning” strings.
- Support reduced motion and screen-reader-friendly dynamic updates.

## 10. Codex execution instructions

1. Read this file and the product/UX/architecture specifications in `docs/`.
2. Inspect the actual Figma frames before writing UI; use the linked Figma file and available Figma design context/screenshots.
3. Audit existing repository structure and dependencies; **do not assume the proposed stack is already installed**.
4. Implement **Today desktop and mobile** first, with reusable AppShell and primitives; do not silently expand to all MVP pages.
5. Preserve all UX invariants in §2. Use canonical domain models and API boundaries where they exist; use clearly labeled temporary fixtures only if backend integration is not yet available.
6. Test responsive behavior, keyboard navigation, empty/loading/error states, and conditional Needs Attention.
7. Capture implementation screenshots at 1440×960 and 390×844 and compare against Figma. Fix major hierarchy, spacing, and clipping differences.
8. Open a focused PR with screenshots, changed files, test results, deviations from Figma, and unresolved decisions.

### Acceptance criteria

- [ ] Four primary destinations only; Search and Capture remain global actions.
- [ ] Desktop sidebar and mobile bottom nav match the baseline layout.
- [ ] Today sections have the specified hierarchy; Needs Attention is conditional.
- [ ] Task and bill objects preserve canonical identity and route to correct details.
- [ ] No bottom-tab/capture/content overlap on mobile.
- [ ] No horizontal overflow on target widths.
- [ ] No placeholder icon glyphs in production UI.
- [ ] Loading, empty, error, focus, and disabled states exist where relevant.
- [ ] WCAG 2.2 AA checks performed and results recorded.
- [ ] Implementation screenshot comparison and PR review completed.

## 11. Explicitly not finished in Figma

The file currently provides **foundation swatches/typography and first-pass Today screens**. The following are **planned, not designed/approved**: reusable component variants, full Upcoming/Inbox/Spaces screens, Task/Event/Bill detail screens, Search results UI, complete Quick Capture review flow, auth screens, dark mode, all breakpoints, and interactive prototype wiring. Do not claim these are visually specified by the current Figma.

## 12. Design review before merge

Request product/design review for: mobile floating-action placement, spacing and text hierarchy, attention-card priority, list density, iconography, actual contrast results, and whether all illustrative labels should be localized. Use Figma for visual edits and update this guide when approved decisions change.
