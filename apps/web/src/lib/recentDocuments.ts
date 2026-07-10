export type RecentDocument = {
  id: string;
  title: string;
  visitedAt: string;
};

const STORAGE_KEY = "collabe-md-recent-documents";
const MAX_RECENT = 20;

function readRecentDocuments(): RecentDocument[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (item): item is RecentDocument =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as RecentDocument).id === "string" &&
        typeof (item as RecentDocument).title === "string" &&
        typeof (item as RecentDocument).visitedAt === "string",
    );
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

function writeRecentDocuments(documents: RecentDocument[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
}

export function getRecentDocuments(): RecentDocument[] {
  return readRecentDocuments().sort(
    (left, right) => new Date(right.visitedAt).getTime() - new Date(left.visitedAt).getTime(),
  );
}

export function addRecentDocument(document: RecentDocument): RecentDocument[] {
  const withoutDuplicate = readRecentDocuments().filter((item) => item.id !== document.id);
  const next = [document, ...withoutDuplicate].slice(0, MAX_RECENT);
  writeRecentDocuments(next);
  return next;
}

export function removeRecentDocument(documentId: string): RecentDocument[] {
  const next = readRecentDocuments().filter((item) => item.id !== documentId);
  writeRecentDocuments(next);
  return next;
}

export function clearRecentDocuments(): void {
  localStorage.removeItem(STORAGE_KEY);
}
