import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getRecentDocuments,
  removeRecentDocument,
  type RecentDocument,
} from "../lib/recentDocuments";
import "./RecentDocuments.css";

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
    <section className="recent-documents" data-testid="recent-documents">
      <div className="recent-documents__header">
        <h2>Your recent documents</h2>
        <p>Stored only in this browser</p>
      </div>
      <ul className="recent-documents__list">
        {documents.map((document) => (
          <li key={document.id} className="recent-documents__item">
            <Link to={`/d/${document.id}`} className="recent-documents__link">
              <span className="recent-documents__title">{document.title}</span>
              <span className="recent-documents__meta">
                {formatVisitedAt(document.visitedAt)}
              </span>
            </Link>
            <button
              type="button"
              className="recent-documents__remove"
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
