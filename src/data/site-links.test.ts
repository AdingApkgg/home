import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { linkGroups } from "@/data/site-links";

const links = linkGroups.flatMap((group) => group.links);
const llms = readFileSync(resolve("public/llms.txt"), "utf8");

describe("索引文本与数据同步", () => {
  it("llms.txt 收录每一条链接", () => {
    for (const item of links) expect(llms).toContain(item.link);
  });

  it("index.html 的 noscript 收录每一条链接", () => {
    const html = readFileSync(resolve("index.html"), "utf8");
    const block = /<!-- noscript:start -->[\s\S]*<!-- noscript:end -->/.exec(html)?.[0] ?? "";
    for (const item of links) expect(block).toContain(item.link);
  });

  it("每条链接都有说明文字", () => {
    for (const item of links) {
      expect(item.desc.length).toBeGreaterThan(4);
      expect(item.name.length).toBeGreaterThan(0);
    }
  });
});
