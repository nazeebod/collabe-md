import type { Components, ExtraProps } from "react-markdown";
import type { ReactNode } from "react";

type BlockProps = {
  node?: ExtraProps["node"];
  children?: ReactNode;
  className?: string;
};

function sourceLine(node: ExtraProps["node"]): number | undefined {
  const position = (node as { position?: { start: { line: number } } } | undefined)?.position;
  return position?.start.line;
}

function withLine(Tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "ul" | "ol" | "li" | "blockquote" | "pre" | "table" | "hr") {
  return function Block({ node, children, className }: BlockProps) {
    const line = sourceLine(node);
    const lineProps = line === undefined ? {} : { "data-source-line": line };

    switch (Tag) {
      case "h1":
        return <h1 className={className} {...lineProps}>{children}</h1>;
      case "h2":
        return <h2 className={className} {...lineProps}>{children}</h2>;
      case "h3":
        return <h3 className={className} {...lineProps}>{children}</h3>;
      case "h4":
        return <h4 className={className} {...lineProps}>{children}</h4>;
      case "h5":
        return <h5 className={className} {...lineProps}>{children}</h5>;
      case "h6":
        return <h6 className={className} {...lineProps}>{children}</h6>;
      case "p":
        return <p className={className} {...lineProps}>{children}</p>;
      case "ul":
        return <ul className={className} {...lineProps}>{children}</ul>;
      case "ol":
        return <ol className={className} {...lineProps}>{children}</ol>;
      case "li":
        return <li className={className} {...lineProps}>{children}</li>;
      case "blockquote":
        return <blockquote className={className} {...lineProps}>{children}</blockquote>;
      case "pre":
        return <pre className={className} {...lineProps}>{children}</pre>;
      case "table":
        return <table className={className} {...lineProps}>{children}</table>;
      case "hr":
        return <hr className={className} {...lineProps} />;
      default:
        return null;
    }
  };
}

export const markdownPreviewComponents: Components = {
  h1: withLine("h1"),
  h2: withLine("h2"),
  h3: withLine("h3"),
  h4: withLine("h4"),
  h5: withLine("h5"),
  h6: withLine("h6"),
  p: withLine("p"),
  ul: withLine("ul"),
  ol: withLine("ol"),
  li: withLine("li"),
  blockquote: withLine("blockquote"),
  pre: withLine("pre"),
  table: withLine("table"),
  hr: withLine("hr"),
};
