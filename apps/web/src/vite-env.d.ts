/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GITHUB_REPO_URL?: string;
}

declare module "*.md?raw" {
  const content: string;
  export default content;
}
