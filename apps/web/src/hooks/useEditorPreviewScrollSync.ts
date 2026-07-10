import { useEffect, useRef } from "react";
import type { EditorView } from "@codemirror/view";
import {
  getEditorTopLine,
  getPreviewTopLine,
  scrollEditorToLine,
  scrollPreviewToLine,
} from "../lib/scrollSync";

type UseEditorPreviewScrollSyncOptions = {
  editorView: EditorView | null;
  previewScroller: HTMLElement | null;
};

export function useEditorPreviewScrollSync({
  editorView,
  previewScroller,
}: UseEditorPreviewScrollSyncOptions) {
  const syncingRef = useRef(false);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!editorView || !previewScroller) {
      return;
    }

    const runSynced = (action: () => void) => {
      if (syncingRef.current) {
        return;
      }

      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }

      frameRef.current = requestAnimationFrame(() => {
        syncingRef.current = true;
        action();
        syncingRef.current = false;
        frameRef.current = null;
      });
    };

    const onEditorScroll = () => {
      runSynced(() => {
        if (!editorView || !previewScroller) {
          return;
        }

        scrollPreviewToLine(previewScroller, getEditorTopLine(editorView));
      });
    };

    const onPreviewScroll = () => {
      runSynced(() => {
        if (!editorView || !previewScroller) {
          return;
        }

        scrollEditorToLine(editorView, getPreviewTopLine(previewScroller));
      });
    };

    editorView.scrollDOM.addEventListener("scroll", onEditorScroll, { passive: true });
    previewScroller.addEventListener("scroll", onPreviewScroll, { passive: true });

    return () => {
      editorView.scrollDOM.removeEventListener("scroll", onEditorScroll);
      previewScroller.removeEventListener("scroll", onPreviewScroll);

      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [editorView, previewScroller]);
}
