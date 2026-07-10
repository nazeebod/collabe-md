import { eq } from "drizzle-orm";
import * as Y from "yjs";
import { db } from "../db/client.js";
import { documents } from "../db/schema.js";
import { isValidUuid } from "@collabe-md/shared";

export async function documentExists(documentId: string): Promise<boolean> {
  if (!isValidUuid(documentId)) {
    return false;
  }

  const rows = await db
    .select({ id: documents.id })
    .from(documents)
    .where(eq(documents.id, documentId))
    .limit(1);

  return rows.length > 0;
}

export async function loadDocumentState(documentId: string): Promise<Uint8Array | null> {
  const rows = await db
    .select({ yjsState: documents.yjsState })
    .from(documents)
    .where(eq(documents.id, documentId))
    .limit(1);

  const state = rows[0]?.yjsState;
  if (!state || state.length === 0) {
    return null;
  }

  return new Uint8Array(state);
}

export async function storeDocumentState(documentId: string, document: Y.Doc): Promise<void> {
  const state = Buffer.from(Y.encodeStateAsUpdate(document));

  await db
    .update(documents)
    .set({
      yjsState: state,
      updatedAt: new Date(),
    })
    .where(eq(documents.id, documentId));
}
