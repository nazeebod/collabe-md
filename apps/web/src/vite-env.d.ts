/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GITHUB_REPO_URL?: string;
}

declare module "*.css" {
  const classes: Record<string, string>;
  export default classes;
}
