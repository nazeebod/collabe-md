import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownPreviewProps = {
  content: string;
  className?: string;
};

export function MarkdownPreview({ content, className }: MarkdownPreviewProps) {
  return (
    <div className={`markdown-preview ${className ?? ""}`} data-testid="markdown-preview">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content || "*Start writing markdown...*"}</ReactMarkdown>
    </div>
  );
}
