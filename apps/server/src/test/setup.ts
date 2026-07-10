import WebSocket from "ws";

// HocuspocusProvider uses global WebSocket in Node tests (not available in Node 20).
if (typeof globalThis.WebSocket === "undefined") {
  globalThis.WebSocket = WebSocket as unknown as typeof globalThis.WebSocket;
}
