import { useEffect, useState } from "react";
import type { HocuspocusProvider } from "@hocuspocus/provider";
import type { AwarenessUser } from "@collabe-md/shared";

type PresenceUser = AwarenessUser & {
  clientId: number;
};

type PresenceBarProps = {
  provider: HocuspocusProvider;
  localUser: AwarenessUser;
};

export function PresenceBar({ provider, localUser }: PresenceBarProps) {
  const [users, setUsers] = useState<PresenceUser[]>([
    { ...localUser, clientId: provider.awareness?.clientID ?? 0 },
  ]);

  useEffect(() => {
    const awareness = provider.awareness;
    if (!awareness) {
      return;
    }

    const syncUsers = () => {
      const states = Array.from(awareness.getStates().entries());
      const nextUsers = states
        .map(([clientId, state]) => {
          const user = state?.user as AwarenessUser | undefined;
          if (!user) {
            return null;
          }
          return { ...user, clientId };
        })
        .filter((user): user is PresenceUser => user !== null);

      setUsers(nextUsers);
    };

    syncUsers();
    awareness.on("change", syncUsers);

    return () => {
      awareness.off("change", syncUsers);
    };
  }, [provider]);

  return (
    <div className="flex flex-wrap items-center gap-2" data-testid="presence-bar">
      <span className="text-[11px] font-medium text-muted-foreground">Online:</span>
      {users.map((user) => (
        <span
          key={user.clientId}
          className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-white shadow-sm ring-1 ring-inset ring-white/10"
          style={{ backgroundColor: user.color }}
          data-testid="presence-user"
        >
          {user.name}
        </span>
      ))}
    </div>
  );
}
