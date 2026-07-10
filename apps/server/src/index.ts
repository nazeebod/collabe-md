import "dotenv/config";
import { buildApp } from "./app.js";

const PORT = Number(process.env.PORT ?? 3001);
const WS_PORT = Number(process.env.WS_PORT ?? 3002);

async function main() {
  const { app, hocuspocus } = await buildApp();

  await app.listen({ port: PORT, host: "0.0.0.0" });
  await hocuspocus.listen(WS_PORT);

  app.log.info(`API listening on http://localhost:${PORT}`);
  app.log.info(`Collaboration WS listening on ws://localhost:${WS_PORT}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
