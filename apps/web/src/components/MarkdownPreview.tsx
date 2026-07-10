import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { markdownPreviewComponents } from "../lib/markdownPreviewComponents";
import { cn } from "../shared/ui/cn";

type MarkdownPreviewProps = {
  content: string;
  className?: string;
};

export function MarkdownPreview({ content, className }: MarkdownPreviewProps) {
  return (
    <div
      className={cn("prose prose-neutral dark:prose-invert max-w-none", className)}
      data-testid="markdown-preview"
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownPreviewComponents}>
        {content || "*Start writing markdown...*"}
      </ReactMarkdown>
    </div>
  );
}
