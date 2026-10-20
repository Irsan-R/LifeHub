import { TodayView } from '../../components/today-view';
import { demoToday, type TodayProjection } from '../../lib/today';

export default async function TodayPage({ searchParams }: { searchParams: Promise<{ demo?: string; state?: string }> }) {
  const { demo, state } = await searchParams;
  const isDemo = demo === '1';
  const projection: TodayProjection = isDemo && state !== 'empty' ? demoToday : { attention: [], priorities: [], upcoming: [] };
  return <TodayView initial={projection} demo={isDemo} forcedState={state} />;
}
