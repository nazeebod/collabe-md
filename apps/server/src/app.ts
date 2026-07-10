import Fastify, { type FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import { Server } from "@hocuspocus/server";
import { registerDocumentRoutes } from "./routes/documents.js";
import {
  documentExists,
  loadDocumentState,
  storeDocumentState,
} from "./hocuspocus/persistence.js";

export type AppContext = {
  app: FastifyInstance;
  hocuspocus: ReturnType<typeof Server.configure>;
};

export function createHocuspocusServer() {
  return Server.configure({
    debounce: 2000,
    maxDebounce: 10000,

    async onConnect({ documentName }) {
      const exists = await documentExists(documentName);
      if (!exists) {
        throw new Error("Document not found");
      }
    },

    async onLoadDocument({ document, documentName }) {
      const state = await loadDocumentState(documentName);
      if (state) {
        const Y = await import("yjs");
        Y.applyUpdate(document, state);
      }
    },

    async onStoreDocument({ document, documentName }) {
      await storeDocumentState(documentName, document);
    },
  });
}

export async function buildApp(): Promise<AppContext> {
  const app = Fastify({ logger: false });

  await app.register(cors, {
    origin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "OPTIONS"],
  });

  await app.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
  });

  await registerDocumentRoutes(app);

  const hocuspocus = createHocuspocusServer();

  return { app, hocuspocus };
}
