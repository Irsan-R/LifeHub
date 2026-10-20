# LifeHub — PR #50 Design & Engineering Review Checklist

**Review target:** https://github.com/Irsan-R/LifeHub/pull/50  
**Review basis:** PR diff, implementation notes, Figma-to-Code guide, Today UI specification v1.1  
**Status:** **Changes requested / pending verification**. This document is a review plan, not proof of a live visual or CI audit.

## 1. Evidence and limitations

PR #50 adds Next.js/TypeScript Today UI, responsive CSS, Lucide icons, Search and Quick Capture demo flows, typed Today projection, and browser tests. The PR description reports passing local build/browser checks and screenshots at 1440×960 and 390×844. **These claims were not independently re-run in this review.**

The PR's own implementation note states that Figma Today desktop/mobile frames were unavailable for direct comparison. Accordingly **pixel-perfect visual compliance cannot be certified**. Use actual Figma screenshots and implementation screenshots before sign-off.

### Evidence links
- Figma: https://www.figma.com/design/MKTPGPF6l5EvVtpIZQfGQk
- Desktop: https://github.com/Irsan-R/LifeHub/blob/feat/today-dashboard-ui/docs/design/today-desktop-implementation.png
- Mobile: https://github.com/Irsan-R/LifeHub/blob/feat/today-dashboard-ui/docs/design/today-mobile-implementation.png
- Implementation review: `docs/design/today-implementation-review.md` (PR #50 branch)

## 2. Findings, prioritized

### P1 — Test runner depends on a Windows-specific Chrome path

**Evidence:** `tests/today-browser.test.mjs` hardcodes `C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe` as Playwright executable.

**Impact:** Tests can fail on Linux/macOS CI or another Windows installation despite correct application code.

**Required change:** Use Playwright-managed Chromium or a documented, optional environment-configured executable path. Provide a reproducible install command and CI job. **Acceptance:** `npm test` succeeds in the intended CI environment without editing source.

### P1 — Detail lookup depends on projection membership

**Evidence:** `app/[kind]/[id]/page.tsx` resolves task IDs from `demoToday.priorities` and event/bill IDs from `demoToday.upcoming`.

**Impact:** A canonical object represented only in Needs Attention, or an object absent from those specific sections, may 404 despite a valid source reference.

**Required change:** Resolve by `type + id` from a canonical service; in demo mode use a single typed fixture registry across sections. **Acceptance:** detail route works for a valid object even when it appears only in attention, only in upcoming, or in neither Today section.

### P1 — Visual fidelity to actual Today frames remains unverified

**Evidence:** `docs/design/today-implementation-review.md` says Figma desktop/mobile Today frames were unavailable and geometry was checked against written handoff.

**Impact:** Cannot confirm card spacing, proportions, typography and responsive composition against actual approved frames.

**Required change:** Export/recover reference frames or obtain explicit design acceptance of documented geometry. Attach comparison and deviation table. **Acceptance:** designer signs off on 1440×960 and 390×844, or labels intentional differences.

### P2 — Dialog accessibility needs stronger verification

**Evidence:** `components/today-view.tsx` uses custom `role=dialog`, `aria-modal`, and Escape handler; no explicit focus trap or focus return to opening trigger is evident in the reviewed component.

**Impact:** Keyboard/screen reader users may tab into background content or lose focus on close.

**Required change:** Use an accessible dialog primitive or implement focus management and test it. **Acceptance:** initial focus, trapped Tab/Shift+Tab, Escape, focus restoration and accessible title verified.

### P2 — Navigation active state is hardcoded to Today

**Evidence:** `Navigation` sets `aria-current` when `label === 'Today'` regardless of actual route; current placeholder pages render separately.

**Impact:** As AppShell is reused across Upcoming/Inbox/Spaces, active destination can be wrong; current placeholder pages also lack consistent shell.

**Required change:** Derive active state from pathname and share AppShell across routes when extending the prototype. **Acceptance:** each route highlights only itself and maintains coherent back/navigation experience.

### P2 — Demo interactions need explicit boundaries

**Evidence:** `?demo=1` toggles local Task state and saves capture text to `sessionStorage`.

**Impact:** Users may mistake preview data for saved account data; repeated save or interrupted flow may lead to confusing state.

**Required change:** Keep preview-only label, test duplicate activation and storage failure, and preserve drafts on recoverable errors. **Acceptance:** no claim of production persistence; failure leaves user data intact.

### P2 — Full accessibility and responsive review remains open

**Evidence:** PR notes palette contrast checks and six viewport widths but not full WCAG 2.2 AA or zoom/keyboard audit.

**Required change:** Check keyboard-only flows, 200% text zoom, 320px reflow, accessible names, color contrast in all states, focus visibility, and floating Capture overlap while scrolling. **Acceptance:** audit evidence and fixed blocking issues.

### P3 — CSS maintainability and localization

**Evidence:** `app/styles.css` is committed as a long minified line; `components/today-view.tsx` sets `locale = 'en-US'`; `app/layout.tsx` sets `lang='en'`.

**Impact:** Difficult reviews and future design iteration; localization not yet configurable.

**Recommended change:** Format CSS, extract component/style tokens, and introduce a locale strategy before expanding screens. **Acceptance:** readable diffs and documented language policy.

## 3. Test scenarios

| ID | Scenario | Expected result |
| --- | --- | --- |
| NAV-01 | Open Today demo at desktop | Four sidebar destinations; Today active |
| NAV-02 | Open Today demo at mobile | Four bottom tabs; Capture independent |
| NAV-03 | Navigate to Upcoming/Inbox/Spaces | Correct route and active destination when shell is shared |
| ATT-01 | Attention array empty | Needs Attention section absent |
| ATT-02 | Attention item only, not upcoming | Detail link resolves correctly |
| TASK-01 | Toggle task | Accessible checked state and visible feedback |
| TASK-02 | Toggle during pending request | No duplicate conflicting mutations |
| CAP-01 | Blank/whitespace capture | Cannot proceed |
| CAP-02 | Enter → review → edit → save | Exact reviewed text stored once in demo Inbox |
| CAP-03 | Storage throws | Draft preserved and retry possible |
| CAP-04 | Close/reopen mid-draft | Matches documented draft retention policy |
| SEARCH-01 | Ctrl/Cmd+K, type, Escape | Search opens, filters, closes; focus restored |
| SEARCH-02 | Duplicate object across sections | One canonical result |
| A11Y-01 | Tab/Shift+Tab in modal | Focus stays in dialog |
| A11Y-02 | Keyboard-only navigation | All actions accessible with visible focus |
| RWD-01 | 320/375/390/768/1024/1440 | No horizontal overflow |
| RWD-02 | 390 mobile, scroll to bottom | FAB, tabs and final content do not obscure one another |
| RWD-03 | 200% text zoom / long titles | No clipped essential content |
| STATE-01 | Loading/empty/error | Distinct meaningful states |
| CI-01 | Clean Linux CI environment | Build and browser tests run reproducibly |

## 4. Visual QA scorecard (fill after screenshot comparison)

| Dimension | Desktop | Mobile | Evidence |
| --- | --- | --- | --- |
| Colors/token fidelity | Pending visual check | Pending visual check | |
| Layout hierarchy | Structurally matches spec | Structurally matches spec | |
| Typography and line wrapping | Pending | Pending | |
| Card geometry, border, radius | Pending | Pending | |
| Icon consistency | Lucide present in code | Lucide present in code | |
| Spacing/alignment | Pending | Pending | |
| Floating Capture safe area | N/A | Geometry tested locally per PR; independently verify | |
| Empty/error/long-content states | Pending | Pending | |

**Do not convert pending fields into pass without screenshots or test evidence.**

## 5. Suggested review workflow

1. Codex fixes P1 findings first, adds tests and posts updated screenshots.
2. Designer/product owner compares actual Figma Today frames and implementation; logs intentional deviations.
3. Codex resolves P2 accessibility/interaction gaps and verifies responsive behavior.
4. Reviewer runs clean CI and documents build, tests, screenshots and known limitations.
5. Merge only after blocking issues are closed and design acceptance is recorded.

## 6. PR acceptance gate

- **Block merge:** P1 unresolved, broken canonical object routing, failed CI, critical accessibility failure, or major unapproved visual mismatch.
- **May follow up with issue:** clearly documented P3 refactors that do not affect correctness, accessibility, or visual acceptance.
- **Explicitly out of scope:** production auth/API, persistent Inbox, full Upcoming/Spaces, bill payment and recurrence flows.

## 7. Codex task prompt

> Review PR #50 against `docs/design/today-ui-spec-v1.1.md` and `docs/design/pr50-review-checklist.md`. Fix P1 issues first: make browser tests portable and resolve canonical demo object detail by type+ID independently of Today section. Then address dialog focus trap/restoration, active nav route derivation, and demo capture error/duplicate handling. Add tests for each behavior. Preserve LifeHub's visual tokens and four-destination navigation. Compare 1440×960 and 390×844 screenshots to Figma when available, record any differences, and submit a focused follow-up PR. Do not implement production services or expand scope silently.
