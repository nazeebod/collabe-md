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
    <div className="presence-bar" data-testid="presence-bar">
      <span className="presence-label">Online:</span>
      {users.map((user) => (
        <span
          key={user.clientId}
          className="presence-user"
          style={{ backgroundColor: user.color }}
          data-testid="presence-user"
        >
          {user.name}
        </span>
      ))}
    </div>
  );
}
