import { useEffect, useRef } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers, highlightActiveLine } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { yCollab } from "y-codemirror.next";
import * as Y from "yjs";
import type { HocuspocusProvider } from "@hocuspocus/provider";

type MarkdownEditorProps = {
  ytext: Y.Text;
  provider: HocuspocusProvider;
  className?: string;
};

export function MarkdownEditor({ ytext, provider, className }: MarkdownEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const undoManager = new Y.UndoManager(ytext);

    const state = EditorState.create({
      doc: ytext.toString(),
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        history(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        markdown({ base: markdownLanguage, codeLanguages: languages }),
        yCollab(ytext, provider.awareness!, { undoManager }),
        EditorView.lineWrapping,
        EditorView.theme({
          "&": {
            height: "100%",
            backgroundColor: "#1e2433",
            color: "#eef1f8",
          },
          ".cm-scroller": {
            overflow: "auto",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            lineHeight: "1.6",
          },
          ".cm-gutters": {
            backgroundColor: "#171b26",
            color: "#6b758c",
            borderRight: "1px solid #232936",
          },
          ".cm-activeLine": {
            backgroundColor: "rgba(108, 140, 255, 0.08)",
          },
          ".cm-cursor": {
            borderLeftColor: "#8aa4ff",
          },
          ".cm-selectionBackground, &.cm-focused .cm-selectionBackground": {
            backgroundColor: "rgba(108, 140, 255, 0.22) !important",
          },
        }),
      ],
    });

    const view = new EditorView({
      state,
      parent: containerRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
      undoManager.destroy();
    };
  }, [provider, ytext]);

  return <div ref={containerRef} className={className} data-testid="markdown-editor" />;
}
