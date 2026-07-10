import { useEffect, useState } from "react";
import * as Y from "yjs";
import { HocuspocusProvider } from "@hocuspocus/provider";
import type { AwarenessUser } from "@collabe-md/shared";
import { createAwarenessUser } from "../lib/awareness";

export type ConnectionStatus = "connecting" | "connected" | "disconnected";

function getCollaborationUrl(): string {
  if (import.meta.env.DEV) {
    return "ws://localhost:3002";
  }

  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const host = window.location.host;
  return `${protocol}//${host}/collaboration`;
}

export type CollaborationState = {
  ydoc: Y.Doc;
  ytext: Y.Text;
  provider: HocuspocusProvider;
  awarenessUser: AwarenessUser;
  status: ConnectionStatus;
  content: string;
};

export function useCollaboration(documentId: string): CollaborationState | null {
  const [state, setState] = useState<CollaborationState | null>(null);

  useEffect(() => {
    const ydoc = new Y.Doc();
    const ytext = ydoc.getText("content");
    const awarenessUser = createAwarenessUser();

    const buildState = (status: ConnectionStatus): CollaborationState => ({
      ydoc,
      ytext,
      provider,
      awarenessUser,
      status,
      content: ytext.toString(),
    });

    const provider = new HocuspocusProvider({
      url: getCollaborationUrl(),
      name: documentId,
      document: ydoc,
      onConnect: () => {
        setState((current) =>
          current ? { ...current, status: "connected" } : buildState("connected"),
        );
      },
      onDisconnect: () => {
        setState((current) =>
          current ? { ...current, status: "disconnected" } : buildState("disconnected"),
        );
      },
      onSynced: () => {
        setState((current) =>
          current
            ? { ...current, status: "connected", content: ytext.toString() }
            : buildState("connected"),
        );
      },
      onStatus: ({ status }) => {
        if (status === "connected") {
          setState((current) =>
            current ? { ...current, status: "connected" } : buildState("connected"),
          );
        }
        if (status === "disconnected") {
          setState((current) =>
            current ? { ...current, status: "disconnected" } : buildState("disconnected"),
          );
        }
      },
    });

    provider.awareness?.setLocalStateField("user", awarenessUser);

    const updateContent = () => {
      setState((current) =>
        current ? { ...current, content: ytext.toString() } : buildState("connected"),
      );
    };

    ytext.observe(updateContent);
    setState(buildState("connecting"));

    return () => {
      ytext.unobserve(updateContent);
      provider.destroy();
      ydoc.destroy();
    };
  }, [documentId]);

  return state;
}
