import type { ApiResponse, CreateDocumentResponse, DocumentMeta } from "@collabe-md/shared";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    ...init,
  });

  const body = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !body.success || body.data === null) {
    throw new Error(body.error ?? `Request failed: ${response.status}`);
  }

  return body.data;
}

export function createDocument(title?: string): Promise<CreateDocumentResponse> {
  return request<CreateDocumentResponse>("/api/documents", {
    method: "POST",
    body: JSON.stringify({ title }),
  });
}

export function getDocument(id: string): Promise<DocumentMeta> {
  return request<DocumentMeta>(`/api/documents/${id}`);
}

export function updateDocumentTitle(id: string, title: string): Promise<DocumentMeta> {
  return request<DocumentMeta>(`/api/documents/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ title }),
  });
}
