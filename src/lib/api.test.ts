import { describe, expect, it, vi } from "vitest";
import { getPlayerList } from "@/lib/api";

const jsonResponse = (body: unknown) =>
  new Response(JSON.stringify(body), { status: 200, headers: { "content-type": "application/json" } });

const textResponse = (body: string) =>
  new Response(body, { status: 200, headers: { "content-type": "text/javascript" } });

const urlPayload = {
  req_0: { data: { sip: ["http://ws.stream.qqmusic.qq.com"], midurlinfo: [{ purl: "/a.mp3" }] } },
};

describe("getPlayerList", () => {
  it("直接可播放的地址原样返回，不再二次请求", async () => {
    const fetchMock = vi.fn(async () => jsonResponse([{ name: "A", artist: "B", url: "https://x/a.mp3" }]));
    vi.stubGlobal("fetch", fetchMock);

    await expect(getPlayerList("netease", "playlist", "1")).resolves.toEqual([
      { name: "A", artist: "B", url: "https://x/a.mp3", cover: "" },
    ]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("解析 JSONP 外壳并拼出真实地址", async () => {
    const fetchMock = vi.fn(async (input: string) =>
      String(input).includes("type=playlist")
        ? jsonResponse([{ name: "A", artist: "B", url: "@1@2@3@https://api.test/url" }])
        : textResponse(`cb(${JSON.stringify(urlPayload)})`),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(getPlayerList("netease", "playlist", "1")).resolves.toEqual([
      { name: "A", artist: "B", url: "https://ws.stream.qqmusic.qq.com/a.mp3", cover: "" },
    ]);
    expect(fetchMock.mock.calls[1]?.[0]).toContain("callback=cb");
  });

  it("地址缺失时抛错", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => jsonResponse([{ name: "A", url: "@1@2@3@" }])),
    );
    await expect(getPlayerList("netease", "playlist", "1")).rejects.toThrow(/Missing JSONP URL/);
  });
});
