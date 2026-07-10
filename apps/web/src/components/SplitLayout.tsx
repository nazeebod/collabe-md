import { useCallback, useEffect, useRef, useState, type ReactNode, type Ref } from "react";
import { cn } from "../shared/ui/cn";

type SplitLayoutProps = {
  left: ReactNode;
  right: ReactNode;
  initialLeftPercent?: number;
  rightScrollRef?: Ref<HTMLDivElement | null>;
};

export function SplitLayout({ left, right, initialLeftPercent = 60, rightScrollRef }: SplitLayoutProps) {
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
    <div
      className="flex h-full min-h-0 overflow-hidden rounded-lg border bg-card shadow-sm"
      ref={containerRef}
    >
      <div className="min-h-0 min-w-0 overflow-auto border-r bg-muted/30" style={{ width: `${leftPercent}%` }}>
        {left}
      </div>
      <div
        className={cn(
          "w-1.5 shrink-0 cursor-col-resize bg-border transition-colors hover:bg-primary",
        )}
        role="separator"
        aria-orientation="vertical"
        onMouseDown={() => {
          draggingRef.current = true;
        }}
      />
      <div
        ref={rightScrollRef}
        className="min-h-0 min-w-0 flex-1 overflow-auto p-4 lg:p-6"
      >
        {right}
      </div>
    </div>
  );
}
