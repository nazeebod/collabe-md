import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getRecentDocuments,
  removeRecentDocument,
  type RecentDocument,
} from "../lib/recentDocuments";
import { cn } from "../shared/ui/cn";

type RecentDocumentsProps = {
  refreshKey?: number;
};

export function RecentDocuments({ refreshKey = 0 }: RecentDocumentsProps) {
  const [documents, setDocuments] = useState<RecentDocument[]>([]);

  useEffect(() => {
    setDocuments(getRecentDocuments());
  }, [refreshKey]);

  const handleRemove = (documentId: string) => {
    setDocuments(removeRecentDocument(documentId));
  };

  if (documents.length === 0) {
    return null;
  }

  return (
    <section
      className="rounded-xl border bg-card p-6 shadow-sm"
      data-testid="recent-documents"
    >
      <div>
        <h2 className="text-sm font-bold">Your recent documents</h2>
        <p className="mt-1 text-xs text-muted-foreground">Stored only in this browser</p>
      </div>
      <ul className="mt-4 space-y-2">
        {documents.map((document) => (
          <li key={document.id} className="flex items-center gap-2">
            <Link
              to={`/d/${document.id}`}
              className={cn(
                "group flex min-w-0 flex-1 flex-col gap-0.5 rounded-lg border bg-background p-3 text-left shadow-sm",
                "transition-all hover:border-primary/50 hover:shadow-md",
              )}
            >
              <span className="truncate text-sm font-semibold text-foreground">
                {document.title}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {formatVisitedAt(document.visitedAt)}
              </span>
            </Link>
            <button
              type="button"
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-input",
                "text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive",
              )}
              aria-label={`Remove ${document.title} from recent list`}
              onClick={() => handleRemove(document.id)}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function formatVisitedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Recently opened";
  }

  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
