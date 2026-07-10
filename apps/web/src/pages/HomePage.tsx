import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RecentDocuments } from "../components/RecentDocuments";
import { createDocument } from "../lib/api";
import { addRecentDocument } from "../lib/recentDocuments";
import "./HomePage.css";

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
    <main className="home-page">
      <div className="home-content">
        <section className="home-hero">
          <span className="home-badge">Real-time collaboration</span>
          <h1>Collabe MD</h1>
          <p>
            Create a markdown document, share the link, and edit together with live cursors.
            No accounts — just a secure link.
          </p>
          <button type="button" onClick={handleCreate} disabled={loading} data-testid="create-document">
            {loading ? "Creating..." : "Create document"}
          </button>
          {error && <p className="error-text">{error}</p>}
        </section>

        <RecentDocuments refreshKey={recentRefreshKey} />
      </div>
    </main>
  );
}
