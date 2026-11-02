'use client';

export interface QueuedEvidence {
  id: string;
  workerId: string;
  title: string;
  dataUrl: string; // base64 or object URL
  timestamp: string;
  location?: string;
  synced: boolean;
}

const STORAGE_KEY = 'credify_offline_evidence';

export function getOfflineQueue(): QueuedEvidence[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function queueEvidenceOffline(evidence: Omit<QueuedEvidence, 'id' | 'synced'>): QueuedEvidence {
  const item: QueuedEvidence = {
    ...evidence,
    id: 'offline-' + Date.now(),
    synced: false,
  };

  const queue = getOfflineQueue();
  queue.push(item);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  } catch (err) {
    console.warn('Storage quota exceeded for offline queue:', err);
  }

  return item;
}

export function markEvidenceSynced(id: string): void {
  const queue = getOfflineQueue();
  const updated = queue.map(item => item.id === id ? { ...item, synced: true } : item);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {}
}

export function clearSyncedEvidence(): void {
  const queue = getOfflineQueue();
  const pending = queue.filter(item => !item.synced);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pending));
  } catch {}
}
