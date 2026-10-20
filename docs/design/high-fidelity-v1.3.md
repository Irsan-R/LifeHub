# LifeHub — High-Fidelity UI Design v1.3

Status: Proposed design baseline (20 October 2026). No application code.

LifeHub is a Context-first Hybrid Life OS. Primary navigation: Today, Upcoming, Inbox, Spaces. Global: Search and Quick Capture. One authoritative object per Task, Event, Bill; linked views never duplicate data.

This is the textual visual specification, not a source design file or pixel-perfect exported mockup.

## Visual direction
**Calm, focused, connected.** Modern restrained light UI; soft neutral surfaces, muted forest green, fine borders, minimal shadow. No glossy/glassmorphism/neon/decorative gradients.

## Color tokens
| Role | Hex |
|---|---|
| Canvas | `#F7F7F4` |
| Surface | `#FFFFFF` |
| Surface muted | `#F0F2EE` |
| Primary | `#4F705F` |
| Hover | `#3E5C4C` |
| Text primary | `#24332C` |
| Text secondary | `#68746D` |
| Border | `#DFE4DD` |
| Attention | `#B48146` |

Typography: Inter/system sans. Page 28–32px/600, section 18–20px/600, card 15–16px/600, body 14–16px/400, support 12–14px. Tabular figures for currency. Spacing 4px scale, common 8/12/16/24/32px. Cards radius 12–16px, buttons/inputs ~10px.

## Screen directions
- **Today:** date/greeting, conditional Needs Attention, Today's Priorities, Upcoming, optional insights. No vanity KPI strip.
- **Upcoming:** agenda timeline grouped by date, object filters.
- **Inbox:** simple unprocessed capture queue and triage.
- **Spaces:** default Personal plus optional contexts.
- **Object Detail:** status, title, main facts/action, related records and history; Bill separates occurrence from series/payment history.
- **Search:** desktop overlay/mobile full-screen, type-aware results.
- **Quick Capture:** Capture → editable Review → Saving → Result, mobile bottom sheet/full-screen.

Desktop persistent sidebar; wide layout may split main actions and context roughly 65/35. Mobile four-tab navigation plus separate Capture and Search. Do not compress desktop into mobile.

## Components
Button primary/secondary/ghost/destructive; Input standard/currency/search; Date/recurrence picker; Task checkbox; Task/Event/Bill/Inbox object rows; attention/standard cards; modal/sheet; toast; navigation item; related object row. Each requires relevant focus, hover, disabled, loading, selected, validation and error states. Status never relies on color alone.

## Acceptance criteria
VIS-01 consistent tokens; VIS-02 no glossy/gradient dominance; VIS-03 Today action-first; VIS-04 IA-consistent navigation; VIS-05 Capture states; VIS-06 non-color type cues; VIS-07 component states; VIS-08 relationships in detail; VIS-09 keyboard-open mobile forms; VIS-10 contrast/accessibility; VIS-11 responsive layout; VIS-12 honest save feedback.

## Review notes
Visual direction is proposed pending user tests and contrast audit. UI Polish v1.4 refines it: [UI Polish v1.4](ui-polish-v1.4.md).
