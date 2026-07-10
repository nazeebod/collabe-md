export type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  error: string | null;
};

export type DocumentMeta = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateDocumentResponse = {
  id: string;
  url: string;
};

export type AwarenessUser = {
  name: string;
  color: string;
  colorLight: string;
};

export const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidUuid(value: string): boolean {
  return UUID_REGEX.test(value);
}
