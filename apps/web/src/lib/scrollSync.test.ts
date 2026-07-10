import { describe, expect, it } from "vitest";
import { getPreviewTopLine, scrollPreviewToLine } from "./scrollSync";

describe("scrollPreviewToLine", () => {
  it("scrolls preview to the nearest block at or above the target line", () => {
    const scroller = document.createElement("div");
    scroller.style.height = "100px";
    scroller.style.overflow = "auto";

    const first = document.createElement("p");
    first.dataset.sourceLine = "1";
    first.textContent = "First";
    first.style.height = "80px";

    const second = document.createElement("p");
    second.dataset.sourceLine = "10";
    second.textContent = "Second";
    second.style.height = "80px";

    scroller.append(first, second);
    document.body.append(scroller);

    scrollPreviewToLine(scroller, 10);

    expect(getPreviewTopLine(scroller)).toBe(10);

    document.body.removeChild(scroller);
  });
});
