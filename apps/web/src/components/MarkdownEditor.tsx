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
  onViewReady?: (view: EditorView | null) => void;
};

const editorTheme = EditorView.theme({
  "&": {
    height: "100%",
    backgroundColor: "var(--color-card)",
    color: "var(--color-foreground)",
  },
  ".cm-scroller": {
    overflow: "auto",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    lineHeight: "1.6",
  },
  ".cm-gutters": {
    backgroundColor: "var(--color-muted)",
    color: "var(--color-muted-foreground)",
    borderRight: "1px solid var(--color-border)",
  },
  ".cm-activeLine": {
    backgroundColor: "color-mix(in oklch, var(--color-primary) 8%, transparent)",
  },
  ".cm-cursor": {
    borderLeftColor: "var(--color-primary)",
  },
  ".cm-selectionBackground, &.cm-focused .cm-selectionBackground": {
    backgroundColor: "color-mix(in oklch, var(--color-primary) 22%, transparent) !important",
  },
});

export function MarkdownEditor({ ytext, provider, className, onViewReady }: MarkdownEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onViewReadyRef = useRef(onViewReady);

  useEffect(() => {
    onViewReadyRef.current = onViewReady;
  }, [onViewReady]);

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
        editorTheme,
      ],
    });

    const view = new EditorView({
      state,
      parent: containerRef.current,
    });

    viewRef.current = view;
    onViewReadyRef.current?.(view);

    return () => {
      onViewReadyRef.current?.(null);
      view.destroy();
      viewRef.current = null;
      undoManager.destroy();
    };
  }, [provider, ytext]);

  return (
    <div ref={containerRef} className={className} data-testid="markdown-editor">
      <style>{`.cm-editor { height: 100%; }`}</style>
    </div>
  );
}
