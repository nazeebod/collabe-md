import type { FastifyInstance } from "fastify";
import { eq } from "drizzle-orm";
import type { ApiResponse, CreateDocumentResponse, DocumentMeta } from "@collabe-md/shared";
import { isValidUuid } from "@collabe-md/shared";
import { db } from "../db/client.js";
import { documents } from "../db/schema.js";

function success<T>(data: T): ApiResponse<T> {
  return { success: true, data, error: null };
}

function failure<T>(error: string): ApiResponse<T> {
  return { success: false, data: null, error };
}

function toDocumentMeta(row: {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}): DocumentMeta {
  return {
    id: row.id,
    title: row.title,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function registerDocumentRoutes(app: FastifyInstance): Promise<void> {
  app.get("/api/health", async () => {
    return success({ status: "ok" });
  });

  app.post<{ Body: { title?: string } }>("/api/documents", async (request, reply) => {
    const title = request.body?.title?.trim() || "Untitled";

    const [created] = await db
      .insert(documents)
      .values({ title })
      .returning({
        id: documents.id,
        title: documents.title,
        createdAt: documents.createdAt,
        updatedAt: documents.updatedAt,
      });

    const response: CreateDocumentResponse = {
      id: created.id,
      url: `/d/${created.id}`,
    };

    return reply.status(201).send(success(response));
  });

  app.get<{ Params: { id: string } }>("/api/documents/:id", async (request, reply) => {
    const { id } = request.params;

    if (!isValidUuid(id)) {
      return reply.status(400).send(failure<DocumentMeta>("Invalid document id"));
    }

    const rows = await db
      .select({
        id: documents.id,
        title: documents.title,
        createdAt: documents.createdAt,
        updatedAt: documents.updatedAt,
      })
      .from(documents)
      .where(eq(documents.id, id))
      .limit(1);

    const document = rows[0];
    if (!document) {
      return reply.status(404).send(failure<DocumentMeta>("Document not found"));
    }

    return reply.send(success(toDocumentMeta(document)));
  });

  app.patch<{ Params: { id: string }; Body: { title?: string } }>(
    "/api/documents/:id",
    async (request, reply) => {
      const { id } = request.params;
      const title = request.body?.title?.trim();

      if (!isValidUuid(id)) {
        return reply.status(400).send(failure<DocumentMeta>("Invalid document id"));
      }

      if (!title) {
        return reply.status(400).send(failure<DocumentMeta>("Title is required"));
      }

      const [updated] = await db
        .update(documents)
        .set({ title, updatedAt: new Date() })
        .where(eq(documents.id, id))
        .returning({
          id: documents.id,
          title: documents.title,
          createdAt: documents.createdAt,
          updatedAt: documents.updatedAt,
        });

      if (!updated) {
        return reply.status(404).send(failure<DocumentMeta>("Document not found"));
      }

      return reply.send(success(toDocumentMeta(updated)));
    },
  );
}
