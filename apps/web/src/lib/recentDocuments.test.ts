import { beforeEach, describe, expect, it } from "vitest";
import {
  addRecentDocument,
  clearRecentDocuments,
  getRecentDocuments,
  removeRecentDocument,
} from "./recentDocuments";

describe("recentDocuments", () => {
  beforeEach(() => {
    clearRecentDocuments();
  });

  it("stores and returns recent documents from localStorage", () => {
    addRecentDocument({
      id: "doc-1",
      title: "Notes",
      visitedAt: "2026-07-10T10:00:00.000Z",
    });

    expect(getRecentDocuments()).toEqual([
      {
        id: "doc-1",
        title: "Notes",
        visitedAt: "2026-07-10T10:00:00.000Z",
      },
    ]);
  });

  it("moves reopened documents to the top and limits list size", () => {
    for (let index = 0; index < 22; index += 1) {
      addRecentDocument({
        id: `doc-${index}`,
        title: `Doc ${index}`,
        visitedAt: new Date(2026, 0, index + 1).toISOString(),
      });
    }

    const recent = getRecentDocuments();
    expect(recent).toHaveLength(20);
    expect(recent[0]?.id).toBe("doc-21");

    addRecentDocument({
      id: "doc-5",
      title: "Doc 5 updated",
      visitedAt: "2026-07-10T12:00:00.000Z",
    });

    expect(getRecentDocuments()[0]).toEqual({
      id: "doc-5",
      title: "Doc 5 updated",
      visitedAt: "2026-07-10T12:00:00.000Z",
    });
  });

  it("removes a document from recent list", () => {
    addRecentDocument({
      id: "doc-1",
      title: "One",
      visitedAt: "2026-07-10T10:00:00.000Z",
    });
    addRecentDocument({
      id: "doc-2",
      title: "Two",
      visitedAt: "2026-07-10T11:00:00.000Z",
    });

    removeRecentDocument("doc-1");

    expect(getRecentDocuments().map((item) => item.id)).toEqual(["doc-2"]);
  });
});
