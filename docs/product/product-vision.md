# LifeHub — Product Vision v1.0

Status: Proposed design baseline (20 October 2026). No application code.

LifeHub is a Context-first Hybrid Life OS. Primary navigation: Today, Upcoming, Inbox, Spaces. Global: Search and Quick Capture. One authoritative object per Task, Event, Bill; linked views never duplicate data.

## Vision
**Your Life, Connected.** Capture once. Connect everything. Act with clarity. Help Indonesian users manage personal activities, bills, reminders and plans without hopping between apps. Native essentials plus optional external integrations; not a replacement for banks or every productivity tool.

## Target personas (hypotheses)
- **Primary:** Young Professional, 23–35, managing tasks, schedules, monthly bills.
- **Secondary:** Freelancer, 22–38, coordinating projects, deadlines and client payments.
- **Future:** Household Organizer, 28–45, coordinating household obligations.

## Core journeys
1. Sign up → create first Task and Bill → see them on Today.
2. Open Today → review Needs Attention and priorities → complete or reschedule.
3. Capture “Bayar internet 350rb tanggal 23 tiap bulan” → editable review → save recurring Bill → show in Today/Upcoming.
4. Post-MVP: optionally connect external calendar read-only with clear data source.

## Product pillars
- Capture: natural-language or structured input, fallback to Inbox.
- Connect: domain-owned records, reusable links, no duplicate entry.
- Act: actionable Today, upcoming obligations, contextual insights.

## MVP scope
Authentication, profile, Today, Tasks, Events, recurrence, Bills, per-occurrence payment, reminders, Inbox, Quick Capture, Search, object relationships, default Personal Space. Post-MVP: integrations, goals, habits, notes, household sharing, AI-heavy capture.

## Delivery hypothesis
Six two-week sprints: (1) identity/foundation, (2) tasks/Today, (3) events/reminders, (4) bills/links, (5) capture/search, (6) reliability/security/beta. Schedule subject to team capacity.

## Success hypotheses
Activation ≥60%, week-one retention ≥30%, capture completion ≥85%, cross-domain adoption ≥25%. North-star candidate: Weekly Meaningful Actions. These are proposed beta targets, not validated market statistics.

## Architecture direction
Managed cloud, modular monolith for MVP, single source of truth per domain, explicit ownership of external records and safe sync. Privacy, authorization, and delete/export controls must be planned from the start.
