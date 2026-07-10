# Collabe MD

**Collabe MD** is an open-source web service for real-time collaborative editing of Markdown documents. Each document lives at a unique shareable URL — no user accounts required. Anyone with the link can edit together and see each other's cursors in the editor.

Licensed under the [MIT License](LICENSE).

## What it does

Collabe MD solves lightweight team writing: meeting notes, specs, runbooks, and drafts where you want Google Docs–style live editing without onboarding friction. You create a document, copy the link, and collaborators join instantly as anonymous animals (Fox, Bear, Otter, …) with color-coded cursors.

### Highlights

- **Shareable documents** — every file gets a secure UUID link (`/d/:id`)
- **Real-time sync** — Yjs CRDT + Hocuspocus WebSocket server
- **Live cursors** — see who is editing and where
- **Split view** — CodeMirror 6 editor + live Markdown preview (GFM)
- **Durable storage** — PostgreSQL persistence of Yjs document state
- **Self-hostable** — Docker Compose or pre-built GHCR images

## Architecture

```
Browser (React + CodeMirror + Yjs)
    │  REST          WebSocket
    ▼                ▼
Fastify API     Hocuspocus (WS)
    │                │
    └────── PostgreSQL ──────┘
```

| Component | Path | Role |
|-----------|------|------|
| Web app | `apps/web` | React UI, editor, preview |
| API + sync | `apps/server` | Fastify REST, Hocuspocus WS |
| Shared types | `packages/shared` | API contracts |

Each `documentId` is an isolated Yjs room. Thousands of documents can run concurrently without interfering with each other.

## Quick start (development)

```bash
cp .env.example .env
docker compose up -d postgres
pnpm install
pnpm db:push
pnpm dev
```

| Service | URL |
|---------|-----|
| Web | http://localhost:5173 |
| REST API | http://localhost:3001 |
| Collaboration WS | ws://localhost:3002 |

## Docker (local full stack)

```bash
docker compose up --build
```

Open http://localhost:5173

## Production deploy (release images)

Download a release bundle from [GitHub Releases](https://github.com/YOUR_ORG/collabe-md/releases) or pull images directly:

```bash
# Replace OWNER and VERSION
export VERSION=1.0.0
export OWNER=your-github-username

docker pull ghcr.io/${OWNER}/collabe-md-server:${VERSION}
docker pull ghcr.io/${OWNER}/collabe-md-web:${VERSION}
```

Use the `docker-compose.yml` attached to the release, or see `deploy/docker-compose.release.yml` in this repo.

## Makefile commands

```bash
make help          # all targets
make install       # pnpm install
make build         # build all packages
make test          # unit + integration tests
make test-e2e      # Playwright collaboration demo
make docker-smoke  # build + health-check Docker stack
make release-push VERSION=1.0.0   # tag and push release
```

## CI/CD

| Workflow | Trigger | What it does |
|----------|---------|--------------|
| [CI](.github/workflows/ci.yml) | push/PR to `main` | build, tests, E2E demo, Docker smoke |
| [Release](.github/workflows/release.yml) | tag `v*.*.*` | tests, GHCR images, GitHub Release assets |

E2E test proves collaboration: two browser contexts share a document, text syncs, and presence shows two users.

## Creating releases

**For humans and AI agents** — see [`.cursor/rules/release-workflow.mdc`](.cursor/rules/release-workflow.mdc).

Short version:

```bash
make test
make release-push VERSION=1.0.0
```

GitHub Actions publishes container images and release artifacts automatically.

## Scripts (pnpm)

- `pnpm dev` — run web and server in parallel
- `pnpm build` — build all packages
- `pnpm test` — unit and integration tests
- `pnpm --filter @collabe-md/web test:e2e` — Playwright E2E
- `pnpm db:push` — apply database schema

## Security model

Access is **capability-based**: document URLs contain unguessable UUID v4 identifiers. There is no authentication layer in the current version — anyone with the link can read and edit. Do not share links in untrusted channels if the content is sensitive.

## Contributing

1. Fork and clone the repo
2. `make install && make build && make test`
3. Open a pull request — CI must pass

## License

MIT — see [LICENSE](LICENSE).
