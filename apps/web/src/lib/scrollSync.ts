import type { EditorView } from "@codemirror/view";

export function getEditorTopLine(view: EditorView): number {
  const top = view.scrollDOM.scrollTop;
  const block = view.lineBlockAtHeight(top + 4);
  return view.state.doc.lineAt(block.from).number;
}

export function scrollEditorToLine(view: EditorView, line: number): void {
  const clamped = Math.max(1, Math.min(line, view.state.doc.lines));
  const docLine = view.state.doc.line(clamped);
  const block = view.lineBlockAt(docLine.from);
  view.scrollDOM.scrollTop = block.top;
}

export function getPreviewTopLine(scroller: HTMLElement): number {
  const markers = scroller.querySelectorAll<HTMLElement>("[data-source-line]");
  if (markers.length === 0) {
    return 1;
  }

  const scrollerTop = scroller.getBoundingClientRect().top + 4;
  let line = Number(markers[0]!.dataset.sourceLine) || 1;

  for (const marker of markers) {
    const markerLine = Number(marker.dataset.sourceLine);
    if (Number.isNaN(markerLine)) {
      continue;
    }

    if (marker.getBoundingClientRect().top <= scrollerTop) {
      line = markerLine;
    } else {
      break;
    }
  }

  return line;
}

export function scrollPreviewToLine(scroller: HTMLElement, line: number): void {
  const markers = scroller.querySelectorAll<HTMLElement>("[data-source-line]");
  if (markers.length === 0) {
    return;
  }

  let target: HTMLElement | null = null;
  for (const marker of markers) {
    const markerLine = Number(marker.dataset.sourceLine);
    if (Number.isNaN(markerLine)) {
      continue;
    }

    if (markerLine <= line) {
      target = marker;
    } else {
      break;
    }
  }

  target ??= markers[0]!;

  const scrollerRect = scroller.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  scroller.scrollTop += targetRect.top - scrollerRect.top;
}
