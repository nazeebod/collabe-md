import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import "./SplitLayout.css";

type SplitLayoutProps = {
  left: ReactNode;
  right: ReactNode;
  initialLeftPercent?: number;
};

export function SplitLayout({ left, right, initialLeftPercent = 60 }: SplitLayoutProps) {
  const [leftPercent, setLeftPercent] = useState(initialLeftPercent);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const onMouseMove = useCallback((event: MouseEvent) => {
    if (!draggingRef.current || !containerRef.current) {
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const next = ((event.clientX - rect.left) / rect.width) * 100;
    setLeftPercent(Math.min(80, Math.max(20, next)));
  }, []);

  const onMouseUp = useCallback(() => {
    draggingRef.current = false;
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  return (
    <div className="split-layout" ref={containerRef}>
      <div className="split-pane split-pane-left" style={{ width: `${leftPercent}%` }}>
        {left}
      </div>
      <div
        className="split-divider"
        role="separator"
        aria-orientation="vertical"
        onMouseDown={() => {
          draggingRef.current = true;
        }}
      />
      <div className="split-pane split-pane-right">{right}</div>
    </div>
  );
}
