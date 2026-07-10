import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { EditorView } from "@codemirror/view";
import { MarkdownEditor } from "../components/MarkdownEditor";
import { MarkdownPreview } from "../components/MarkdownPreview";
import { PresenceBar } from "../components/PresenceBar";
import { SplitLayout } from "../components/SplitLayout";
import { useCollaboration } from "../hooks/useCollaboration";
import { useEditorPreviewScrollSync } from "../hooks/useEditorPreviewScrollSync";
import { getDocument, updateDocumentTitle } from "../lib/api";
import { addRecentDocument } from "../lib/recentDocuments";
import { cn } from "../shared/ui/cn";
import { ThemeToggle } from "../shared/ui/ThemeToggle";

export function DocumentPage() {
  const { documentId = "" } = useParams();
  const collaboration = useCollaboration(documentId);
  const [title, setTitle] = useState("Untitled");
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editorView, setEditorView] = useState<EditorView | null>(null);
  const [previewScroller, setPreviewScroller] = useState<HTMLDivElement | null>(null);

  useEditorPreviewScrollSync({
    editorView,
    previewScroller,
  });

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
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-6">
        <p className="text-sm text-destructive">{loadError}</p>
        <Link to="/" className="text-sm font-medium text-primary hover:text-primary/80">
          Back to home
        </Link>
      </main>
    );
  }

  if (!collaboration) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-6">
        <p className="text-sm text-muted-foreground">Loading editor...</p>
      </main>
    );
  }

  return (
    <main className="flex h-screen flex-col bg-background">
      <header className="sticky top-0 z-30 shrink-0 border-b bg-background/95 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Link
              to="/"
              className="shrink-0 text-sm font-bold text-foreground hover:text-primary"
            >
              Collabe MD
            </Link>
            <input
              className={cn(
                "min-w-0 flex-1 rounded-md border border-input bg-background px-3 py-1.5",
                "text-sm font-medium shadow-sm transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              onBlur={handleTitleBlur}
              aria-label="Document title"
              data-testid="document-title"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <PresenceBar provider={collaboration.provider} localUser={collaboration.awarenessUser} />
            <button
              type="button"
              onClick={handleCopyLink}
              data-testid="copy-link"
              className={cn(
                "rounded-md border border-input bg-background px-2.5 py-1.5",
                "text-xs font-medium text-muted-foreground shadow-sm transition-colors",
                "hover:bg-accent hover:text-foreground",
              )}
            >
              Copy link
            </button>
            {copyMessage && (
              <span className="text-xs font-medium text-green-600 dark:text-green-400">
                {copyMessage}
              </span>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {collaboration.status === "disconnected" && (
        <div
          className={cn(
            "mx-4 mt-3 rounded-md border border-amber-500/25 bg-amber-500/10",
            "px-3 py-2 text-xs text-amber-700 dark:text-amber-400",
          )}
          data-testid="disconnect-banner"
        >
          Connection lost. Reconnecting...
        </div>
      )}
      {collaboration.status === "connected" && (
        <div data-testid="connection-status" hidden>
          connected
        </div>
      )}

      <div className="min-h-0 flex-1 p-4">
        <SplitLayout
          rightScrollRef={setPreviewScroller}
          left={
            <MarkdownEditor
              ytext={collaboration.ytext}
              provider={collaboration.provider}
              className="h-full"
              onViewReady={setEditorView}
            />
          }
          right={<MarkdownPreview content={collaboration.content} />}
        />
      </div>
    </main>
  );
}
