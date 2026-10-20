'use client';
import { useEffect, useState } from 'react';

export function PreviewInbox() {
  const [items, setItems] = useState<string[]>([]);
  useEffect(() => { try { setItems(JSON.parse(sessionStorage.getItem('lifehub-preview-inbox') ?? '[]')); } catch { setItems([]); } }, []);
  return <><p>Unprocessed captures saved during this browser session.</p>{items.length ? <ul className="preview-inbox-list">{items.map((item, index) => <li key={`${index}:${item}`}>{item}</li>)}</ul> : <p>All caught up. Captures you save in the Today preview will appear here.</p>}</>;
}
