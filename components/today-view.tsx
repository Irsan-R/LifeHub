'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { icons } from './icons';
import { objectHref, type TodayProjection, type TodayTask } from '../lib/today';

const destinations = [
  { label: 'Today', href: '/today' }, { label: 'Upcoming', href: '/upcoming' },
  { label: 'Inbox', href: '/inbox' }, { label: 'Spaces', href: '/spaces' }
] as const;
const locale = 'en-US';
function todayCopy(date: Date) {
  const hour = date.getHours();
  return hour < 12 ? 'Good morning.' : hour < 17 ? 'Good afternoon.' : 'Good evening.';
}
function dateLabel(value: string, options: Intl.DateTimeFormatOptions) { return new Intl.DateTimeFormat(locale, options).format(new Date(value)); }

function Navigation({ mobile, demo }: { mobile?: boolean; demo: boolean }) {
  return <nav aria-label="Primary navigation" className={mobile ? 'bottom-nav' : 'side-nav'}>
    {destinations.map(({ label, href }) => {
      const Icon = icons[label];
      return <Link key={label} href={`${href}${demo ? '?demo=1' : ''}`} className="nav-link" aria-current={label === 'Today' ? 'page' : undefined}>
        <Icon size={19} strokeWidth={1.9} aria-hidden="true" /><span>{label}</span>
      </Link>;
    })}
  </nav>;
}

function AppShell({ children, demo, onSearch, onCapture }: { children: React.ReactNode; demo: boolean; onSearch: () => void; onCapture: () => void }) {
  return <div className="app-shell">
    <aside className="sidebar">
      <Link href={`/today${demo ? '?demo=1' : ''}`} className="brand">LifeHub<small>ONE CONNECTED SPACE</small></Link>
      <Navigation demo={demo} />
      <div className="sidebar-bottom"><div className="personal-dot">P</div><span>Personal space<small>{demo ? 'Preview data' : 'Your space'}</small></span><icons.settings size={18} aria-hidden="true" /></div>
    </aside>
    <div className="mobile-top"><Link href={`/today${demo ? '?demo=1' : ''}`} className="mobile-brand">LifeHub</Link><button type="button" className="icon-button" aria-label="Search" onClick={onSearch}><icons.search size={22} /></button></div>
    <main id="main-content" className="main-content">{children}</main>
    <Navigation mobile demo={demo} />
    <button type="button" className="mobile-capture" aria-label="Quick capture" onClick={onCapture}><icons.plus size={24} /></button>
  </div>;
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) { return <div className="section-header"><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>; }

function TaskRow({ task, onToggle, busy }: { task: TodayTask; onToggle: (id: string) => void; busy: boolean }) {
  return <li className="task-row">
    <button className={`task-check ${task.completed ? 'is-checked' : ''}`} type="button" role="checkbox" aria-checked={task.completed} aria-label={`${task.completed ? 'Reopen' : 'Complete'} ${task.title}`} aria-disabled={busy} disabled={busy} onClick={() => onToggle(task.ref.id)}>{task.completed && <icons.check size={15} strokeWidth={3} />}</button>
    <Link href={objectHref(task.ref, '/today')} className="task-body"><strong className={task.completed ? 'completed' : ''}>{task.title}</strong><span>{task.contexts.join(' · ')}{task.priority !== 'normal' ? ` · ${task.priority === 'high' ? 'High priority' : 'Medium priority'}` : ''}</span></Link>
    {task.dueAt && <time dateTime={task.dueAt}>{dateLabel(task.dueAt, { hour: 'numeric', minute: '2-digit' })}</time>}
  </li>;
}

export function TodayView({ initial, demo, forcedState }: { initial: TodayProjection; demo: boolean; forcedState?: string }) {
  const [data, setData] = useState(initial);
  const [now, setNow] = useState<Date | null>(null);
  const [dialog, setDialog] = useState<'search' | 'capture' | null>(null);
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState('');
  const [captureStep, setCaptureStep] = useState<'input' | 'review' | 'saved'>('input');
  const [notice, setNotice] = useState('');
  useEffect(() => { setNow(new Date()); }, []);
  useEffect(() => { const handler = (event: KeyboardEvent) => { if (event.key === 'Escape') setDialog(null); if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setDialog('search'); } }; window.addEventListener('keydown', handler); return () => window.removeEventListener('keydown', handler); }, []);
  const results = useMemo(() => [...data.priorities.map(item => ({ ref: item.ref, title: item.title, detail: 'Task' })), ...data.upcoming.map(item => ({ ref: item.ref, title: item.title, detail: item.detail }))].filter((item, index, all) => all.findIndex(other => other.ref.href === item.ref.href) === index && item.title.toLowerCase().includes(query.toLowerCase())), [data, query]);
  function toggleTask(id: string) { if (!demo) return; setData(current => ({ ...current, priorities: current.priorities.map(task => task.ref.id === id ? { ...task, completed: !task.completed } : task) })); setNotice('Demo task updated locally.'); }
  function advanceCapture() {
    if (!draft.trim() || !demo) return;
    if (captureStep === 'input') { setCaptureStep('review'); return; }
    try {
      const existing = JSON.parse(sessionStorage.getItem('lifehub-preview-inbox') ?? '[]') as string[];
      sessionStorage.setItem('lifehub-preview-inbox', JSON.stringify([...existing, draft.trim()]));
      setCaptureStep('saved');
      setDraft('');
    } catch { setNotice('Could not save this preview capture. Please try again.'); }
  }
  const showLoading = forcedState === 'loading';
  const showError = forcedState === 'error' || (!demo && !showLoading);
  return <AppShell demo={demo} onSearch={() => setDialog('search')} onCapture={() => { setCaptureStep('input'); setDialog('capture'); }}>
    <div className="today-page">
      <header className="page-header"><div><div className="eyebrow">{now ? dateLabel(now.toISOString(), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase() : 'TODAY'}</div><h1>{now ? todayCopy(now) : 'Today'}</h1><p>Here is what needs your attention today.</p></div><div className="header-actions"><button type="button" className="search-trigger" onClick={() => setDialog('search')}><icons.search size={18} /><span>Search anything</span><kbd>⌘ K</kbd></button><button type="button" className="primary-button" onClick={() => { setCaptureStep('input'); setDialog('capture'); }}><icons.plus size={18} />Quick capture</button></div></header>
      {demo && <p className="demo-label">Preview data · changes stay in this browser session</p>}
      {showLoading ? <div className="skeleton-stack" aria-label="Loading Today" role="status"><div /><div /><div /></div> : showError ? <div className="state-card" role="alert"><icons.alert size={22} /><h2>Today is not connected yet</h2><p>The canonical Task, Event, and Bill API is not available in this repository. Connect that data source before using Today with real records.</p><Link href="/today?demo=1" className="text-link">View UI preview <icons.next size={16} /></Link></div> : <>
        {data.attention.length > 0 && <section aria-labelledby="attention-heading" className="attention-section"><SectionHeader title="Needs attention" subtitle={`${data.attention.length} item${data.attention.length === 1 ? '' : 's'} to review`} /><div className="attention-card">{data.attention.map(item => <div className="attention-inner" key={`${item.ref.type}:${item.ref.id}`}><div className="attention-icon"><icons.alert size={20} /></div><div className="attention-copy"><span className="attention-reason">{item.reason} · {item.ref.type}</span><h3>{item.title}</h3><p>{item.detail}</p></div><Link href={objectHref(item.ref, '/today')} className="secondary-button">{item.action}<icons.next size={16} /></Link></div>)}</div></section>}
        <div className="content-grid"><section aria-labelledby="priorities-heading"><SectionHeader title="Today's priorities" subtitle="The most important things to move forward." /><div className="card task-card">{data.priorities.length ? <ul>{data.priorities.map(task => <TaskRow key={task.ref.id} task={task} onToggle={toggleTask} busy={false} />)}</ul> : <div className="empty-card"><h3>Nothing on your priority list</h3><p>When you add tasks for today, they will appear here.</p><button type="button" className="text-link" onClick={() => setDialog('capture')}>Quick capture <icons.next size={16} /></button></div>}</div></section><section aria-labelledby="upcoming-heading"><SectionHeader title="Coming up" subtitle="A look at the next few days." /><div className="card upcoming-card">{data.upcoming.length ? <ul>{data.upcoming.map(item => <li key={`${item.ref.type}:${item.ref.id}`}><Link href={objectHref(item.ref, '/today')}><span className="date-tile"><strong>{dateLabel(item.at, { day: '2-digit' })}</strong><small>{dateLabel(item.at, { month: 'short' }).toUpperCase()}</small></span><span className="upcoming-copy"><strong>{item.title}</strong><small>{item.detail}</small></span><icons.next size={16} className="row-chevron" /></Link></li>)}</ul> : <div className="empty-card"><h3>Nothing coming up</h3><p>Upcoming events and bills will appear here.</p></div>}</div></section></div>
        <p className="footer-note">A calm place to see what matters, while everything stays connected.</p>
      </>}
    </div>
    {notice && <div className="toast" role="status">{notice}<button type="button" onClick={() => setNotice('')} aria-label="Dismiss notification"><icons.close size={16} /></button></div>}
    {dialog && <div className="dialog-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setDialog(null); }}><section className="dialog" role="dialog" aria-modal="true" aria-label={dialog === 'search' ? 'Global search' : 'Quick capture'}><div className="dialog-heading"><h2>{dialog === 'search' ? 'Search LifeHub' : 'Quick capture'}</h2><button type="button" className="icon-button" aria-label="Close" onClick={() => setDialog(null)}><icons.close size={20} /></button></div>{dialog === 'search' ? <><label className="field-label" htmlFor="search-field">Search across your connected objects</label><input id="search-field" autoFocus value={query} onChange={event => setQuery(event.target.value)} placeholder="Search tasks, events, bills..." />{demo ? <div className="dialog-results">{query ? results.length ? results.map(item => <Link key={item.ref.href} href={objectHref(item.ref, '/today')}><strong>{item.title}</strong><small>{item.detail}</small></Link>) : <p>No results found.</p> : <p>Start typing to search preview objects.</p>}</div> : <p className="dialog-help">Search will be available when the canonical data API is connected.</p>}</> : <>{captureStep === 'saved' ? <div className="capture-success"><h3>Saved in preview</h3><p>Your draft is retained in this browser session only.</p><button type="button" className="primary-button" onClick={() => setDialog(null)}>Done</button></div> : <><p className="dialog-help">{captureStep === 'input' ? 'Write down what is on your mind. Review it before saving.' : 'Review and edit this capture before saving.'}</p><label className="field-label" htmlFor="capture-field">Capture text</label><textarea id="capture-field" autoFocus value={draft} onChange={event => setDraft(event.target.value)} rows={4} placeholder="What would you like to remember?" /><div className="dialog-actions">{captureStep === 'review' && <button type="button" className="secondary-button" onClick={() => setCaptureStep('input')}>Back</button>}<button type="button" className="primary-button" disabled={!demo || !draft.trim()} onClick={advanceCapture}>{captureStep === 'input' ? 'Review' : 'Save to preview Inbox'}</button></div>{!demo && <p className="dialog-help">Saving is unavailable until the Inbox API is connected. Try the UI preview from Today.</p>}</>}</>}</section></div>}
  </AppShell>;
}
