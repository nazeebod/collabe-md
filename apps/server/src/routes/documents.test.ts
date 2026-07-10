import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { buildApp, type AppContext } from "../app.js";
import { db } from "../db/client.js";
import { documents } from "../db/schema.js";

describe("documents API", () => {
  let context: AppContext;

  beforeAll(async () => {
    context = await buildApp();
  });

  afterAll(async () => {
    await context.app.close();
  });

  it("creates and fetches a document", async () => {
    const createResponse = await context.app.inject({
      method: "POST",
      url: "/api/documents",
      payload: { title: "Test doc" },
    });

    expect(createResponse.statusCode).toBe(201);
    const created = createResponse.json();
    expect(created.success).toBe(true);
    expect(created.data.url).toMatch(/^\/d\//);

    const documentId = created.data.id as string;

    const getResponse = await context.app.inject({
      method: "GET",
      url: `/api/documents/${documentId}`,
    });

    expect(getResponse.statusCode).toBe(200);
    const fetched = getResponse.json();
    expect(fetched.data.title).toBe("Test doc");

    await db.delete(documents).where(eq(documents.id, documentId));
  });

  it("rejects invalid document id", async () => {
    const response = await context.app.inject({
      method: "GET",
      url: "/api/documents/not-a-uuid",
    });

    expect(response.statusCode).toBe(400);
  });
});
