import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MarkdownEditor } from "../components/MarkdownEditor";
import { MarkdownPreview } from "../components/MarkdownPreview";
import { PresenceBar } from "../components/PresenceBar";
import { SplitLayout } from "../components/SplitLayout";
import { useCollaboration } from "../hooks/useCollaboration";
import { getDocument, updateDocumentTitle } from "../lib/api";
import { addRecentDocument } from "../lib/recentDocuments";
import "./DocumentPage.css";

export function DocumentPage() {
  const { documentId = "" } = useParams();
  const collaboration = useCollaboration(documentId);
  const [title, setTitle] = useState("Untitled");
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!documentId) {
      return;
    }

    getDocument(documentId)
      .then((document) => {
        setTitle(document.title);
        addRecentDocument({
          id: document.id,
          title: document.title,
          visitedAt: new Date().toISOString(),
        });
      })
      .catch((error: Error) => {
        setLoadError(error.message);
      });
  }, [documentId]);

  const handleTitleBlur = async () => {
    if (!documentId || !title.trim()) {
      return;
    }

    try {
      const updated = await updateDocumentTitle(documentId, title.trim());
      setTitle(updated.title);
      addRecentDocument({
        id: updated.id,
        title: updated.title,
        visitedAt: new Date().toISOString(),
      });
    } catch {
      // Keep local title on failure.
    }
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopyMessage("Link copied");
    window.setTimeout(() => setCopyMessage(null), 2000);
  };

  if (loadError) {
    return (
      <main className="document-page">
        <p className="error-text">{loadError}</p>
        <Link to="/">Back to home</Link>
      </main>
    );
  }

  if (!collaboration) {
    return (
      <main className="document-page">
        <p className="loading-text">Loading editor...</p>
      </main>
    );
  }

  return (
    <main className="document-page">
      <header className="document-header">
        <div className="document-header-main">
          <Link to="/" className="back-link">
            Collabe MD
          </Link>
          <input
            className="title-input"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onBlur={handleTitleBlur}
            aria-label="Document title"
            data-testid="document-title"
          />
        </div>
        <div className="document-header-actions">
          <PresenceBar provider={collaboration.provider} localUser={collaboration.awarenessUser} />
          <button type="button" onClick={handleCopyLink} data-testid="copy-link">
            Copy link
          </button>
          {copyMessage && <span className="copy-message">{copyMessage}</span>}
        </div>
      </header>

      {collaboration.status === "disconnected" && (
        <div className="status-banner" data-testid="disconnect-banner">
          Connection lost. Reconnecting...
        </div>
      )}
      {collaboration.status === "connected" && (
        <div data-testid="connection-status" hidden>
          connected
        </div>
      )}

      <div className="document-workspace">
        <SplitLayout
          left={
            <MarkdownEditor
              ytext={collaboration.ytext}
              provider={collaboration.provider}
              className="editor-surface"
            />
          }
          right={<MarkdownPreview content={collaboration.content} />}
        />
      </div>
    </main>
  );
}
