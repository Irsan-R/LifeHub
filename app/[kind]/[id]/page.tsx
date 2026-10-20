import Link from 'next/link';
import { notFound } from 'next/navigation';
import { demoToday } from '../../../lib/today';

export default async function DetailPage({ params, searchParams }: { params: Promise<{ kind: string; id: string }>; searchParams: Promise<{ from?: string }> }) {
  const { kind, id } = await params;
  const { from } = await searchParams;
  const object = kind === 'tasks' ? demoToday.priorities.find(item => item.ref.id === id) : kind === 'events' || kind === 'bills' ? demoToday.upcoming.find(item => item.ref.id === id && item.ref.type === kind.slice(0, -1)) : undefined;
  if (!object) notFound();
  const back = from?.startsWith('/') && !from.startsWith('//') ? from : '/today';
  return <main className="detail-page"><Link className="text-link" href={`${back}?demo=1`}>← Back to Today</Link><article className="card"><p className="eyebrow">PREVIEW · {kind.slice(0, -1).toUpperCase()}</p><h1>{object.title}</h1><p>This is the canonical {kind.slice(0, -1)} destination for the preview object. Detail interactions require the corresponding domain service.</p></article></main>;
}
