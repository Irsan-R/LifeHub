import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PreviewInbox } from '../../components/preview-inbox';

export default async function DestinationPage({ params, searchParams }: { params: Promise<{ kind: string }>; searchParams: Promise<{ demo?: string }> }) {
  const { kind } = await params;
  const { demo } = await searchParams;
  if (!['upcoming', 'inbox', 'spaces'].includes(kind)) notFound();
  return <main className="detail-page"><Link className="text-link" href={`/today${demo === '1' ? '?demo=1' : ''}`}>← Back to Today</Link><article className="card"><p className="eyebrow">LIFEHUB</p><h1>{kind[0].toUpperCase() + kind.slice(1)}</h1>{kind === 'inbox' && demo === '1' ? <PreviewInbox /> : <p>This destination is outside the Today Dashboard implementation scope. Its canonical records and interactions will be added with the corresponding domain service.</p>}</article></main>;
}
