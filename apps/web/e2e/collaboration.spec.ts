import { expect, test } from "@playwright/test";

test("collaborative editing shows shared text and presence", async ({ browser }) => {
  const contextA = await browser.newContext();
  const contextB = await browser.newContext();
  const pageA = await contextA.newPage();
  const pageB = await contextB.newPage();

  await pageA.goto("/");
  await pageA.getByTestId("create-document").click();
  await pageA.waitForURL(/\/d\//);

  const url = pageA.url();
  await pageB.goto(url);

  await expect(pageA.getByTestId("markdown-editor")).toBeVisible();
  await expect(pageB.getByTestId("markdown-editor")).toBeVisible();
  await expect(pageA.getByTestId("connection-status")).toBeAttached({ timeout: 15000 });
  await expect(pageB.getByTestId("connection-status")).toBeAttached({ timeout: 15000 });

  await pageA.locator(".cm-content").click();
  await pageA.keyboard.type("# Shared title");

  await expect(pageB.getByTestId("markdown-preview")).toContainText("Shared title", {
    timeout: 20000,
  });

  await expect(pageA.getByTestId("presence-user")).toHaveCount(2, { timeout: 15000 });
  await expect(pageB.getByTestId("presence-user")).toHaveCount(2, { timeout: 15000 });

  await contextA.close();
  await contextB.close();
});
