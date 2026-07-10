import { describe, expect, it } from "vitest";
import { createAwarenessUser } from "./awareness";

describe("awareness", () => {
  it("creates user with animal name and colors", () => {
    const user = createAwarenessUser();

    expect(user.name).toMatch(/^(Fox|Bear|Owl|Wolf|Hawk|Lynx|Panda|Tiger|Eagle|Otter|Badger|Heron|Koala|Raven|Seal|Falcon|Moose|Crane|Bison|Gecko)$/);
    expect(user.color).toMatch(/^#[0-9a-f]{6}$/i);
    expect(user.colorLight).toBe(`${user.color}50`);
  });

  it("assigns independent random identities per call", () => {
    const users = Array.from({ length: 20 }, () => createAwarenessUser());
    const uniqueNames = new Set(users.map((user) => user.name));

    expect(uniqueNames.size).toBeGreaterThan(1);
  });
});
