import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("合并条件类名", () => {
    expect(cn("a", false && "b", "c")).toBe("a c");
  });

  it("后者覆盖冲突的 tailwind 工具类", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });
});
