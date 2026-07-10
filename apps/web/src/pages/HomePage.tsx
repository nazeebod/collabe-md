import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GitHubBanner } from "../components/GitHubBanner";
import { RecentDocuments } from "../components/RecentDocuments";
import { createDocument } from "../lib/api";
import { addRecentDocument } from "../lib/recentDocuments";
import { cn } from "../shared/ui/cn";
import { ThemeToggle } from "../shared/ui/ThemeToggle";

export function HomePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentRefreshKey, setRecentRefreshKey] = useState(0);

  const handleCreate = async () => {
    setLoading(true);
    setError(null);

    try {
      const document = await createDocument();
      addRecentDocument({
        id: document.id,
        title: "Untitled",
        visitedAt: new Date().toISOString(),
      });
      setRecentRefreshKey((value) => value + 1);
      navigate(document.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create document");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-background">
      <header className="flex justify-end px-4 py-2">
        <ThemeToggle />
      </header>
      <div className="flex flex-1 items-center justify-center p-6 pb-20">
        <div className="flex w-full max-w-lg flex-col gap-6">
          <section className="rounded-xl border bg-card p-8 text-center shadow-sm">
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary">
            Real-time collaboration
          </span>
          <h1 className="mb-3 text-3xl font-bold tracking-tight">Collabe MD</h1>
          <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
            Create a markdown document, share the link, and edit together with live cursors.
            No accounts — just a secure link.
          </p>
          <button
            type="button"
            onClick={handleCreate}
            disabled={loading}
            data-testid="create-document"
            className={cn(
              "rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm",
              "transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50",
            )}
          >
            {loading ? "Creating..." : "Create document"}
          </button>
          {error && (
            <p className="mt-4 text-sm text-destructive">{error}</p>
          )}
          </section>

          <RecentDocuments refreshKey={recentRefreshKey} />
        </div>
        <GitHubBanner />
      </div>
    </main>
  );
}
