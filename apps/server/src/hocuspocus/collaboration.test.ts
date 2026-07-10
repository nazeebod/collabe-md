import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import * as Y from "yjs";
import WebSocket from "ws";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { db } from "../db/client.js";
import { documents } from "../db/schema.js";
import { createHocuspocusServer } from "../app.js";

describe("collaboration websocket", () => {
  let documentId: string;
  const wsPort = 3102;

  beforeAll(async () => {
    const [created] = await db
      .insert(documents)
      .values({ title: "WS test" })
      .returning({ id: documents.id });

    documentId = created.id;

    const hocuspocus = createHocuspocusServer();
    await hocuspocus.listen(wsPort);
  });

  afterAll(async () => {
    if (documentId) {
      await db.delete(documents).where(eq(documents.id, documentId));
    }
  });

  it(
    "syncs document content between provider and server",
    async () => {
      const ydoc = new Y.Doc();
      const ytext = ydoc.getText("content");

      await new Promise<void>((resolve, reject) => {
        const provider = new HocuspocusProvider({
          url: `ws://127.0.0.1:${wsPort}`,
          name: documentId,
          document: ydoc,
          WebSocketPolyfill: WebSocket,
          onSynced: () => {
            ytext.insert(0, "synced text");
          },
          onConnect: () => {
            setTimeout(() => {
              try {
                expect(ytext.toString()).toBe("synced text");
                provider.destroy();
                resolve();
              } catch (error) {
                reject(error);
              }
            }, 500);
          },
          onAuthenticationFailed: () => {
            reject(new Error("authentication failed"));
          },
        });

        setTimeout(() => {
          provider.destroy();
          reject(new Error("websocket sync timeout"));
        }, 10000);
      });
    },
    15000,
  );
});
