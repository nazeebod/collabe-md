import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import userGuide from "../content/user-guide.md?raw";
import { ThemeToggle } from "../shared/ui/ThemeToggle";
import { cn } from "../shared/ui/cn";

export function HelpPage() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between border-b px-4 py-2">
        <Link to="/" className="text-sm font-bold text-foreground hover:text-primary">
          Collabe MD
        </Link>
        <div className="flex items-center gap-1">
          <ThemeToggle />
        </div>
      </header>

      <article
        className={cn(
          "mx-auto w-full max-w-2xl flex-1 px-6 py-8",
          "prose prose-neutral dark:prose-invert max-w-none",
        )}
        data-testid="help-page"
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{userGuide}</ReactMarkdown>
      </article>
    </main>
  );
}
