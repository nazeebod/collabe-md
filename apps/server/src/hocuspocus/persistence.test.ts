import { describe, expect, it } from "vitest";
import * as Y from "yjs";
import { isValidUuid } from "@collabe-md/shared";
import { loadDocumentState, storeDocumentState } from "./persistence.js";
import { db } from "../db/client.js";
import { documents } from "../db/schema.js";
import { eq } from "drizzle-orm";

describe("persistence", () => {
  it("validates uuid helper", () => {
    expect(isValidUuid("00000000-0000-4000-8000-000000000000")).toBe(true);
    expect(isValidUuid("invalid")).toBe(false);
  });

  it("stores and loads yjs state", async () => {
    const [created] = await db
      .insert(documents)
      .values({ title: "Persistence test" })
      .returning({ id: documents.id });

    const ydoc = new Y.Doc();
    const ytext = ydoc.getText("content");
    ytext.insert(0, "hello world");

    await storeDocumentState(created.id, ydoc);

    const loaded = await loadDocumentState(created.id);
    expect(loaded).not.toBeNull();

    const restored = new Y.Doc();
    Y.applyUpdate(restored, loaded!);
    expect(restored.getText("content").toString()).toBe("hello world");

    await db.delete(documents).where(eq(documents.id, created.id));
  });
});
