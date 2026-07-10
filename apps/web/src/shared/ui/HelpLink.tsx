import { CircleHelp } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "./cn";

type HelpLinkProps = {
  className?: string;
};

export function HelpLink({ className }: HelpLinkProps) {
  return (
    <Link
      to="/help"
      className={cn(
        "rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
        className,
      )}
      title="Справка"
      aria-label="Справка"
      data-testid="help-link"
    >
      <CircleHelp className="h-4 w-4" />
    </Link>
  );
}
