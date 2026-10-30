import { beforeEach, describe, expect, it, vi } from "vitest";

const load = async () => {
  vi.resetModules();
  return import("@/store/main");
};

describe("useMain 持久化", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it("默认值", async () => {
    const { useMain } = await load();
    expect(useMain.getState().coverType).toBe("0");
    expect(useMain.getState().musicVolume).toBe(0.7);
  });

  it("只写入偏好，不写运行时状态", async () => {
    const { useMain } = await load();
    useMain.setState({ musicVolume: 0.2, playIndex: 7, playerTitle: "歌" });
    const saved = JSON.parse(localStorage.getItem("data") ?? "{}") as Record<string, unknown>;
    expect(saved.musicVolume).toBe(0.2);
    expect(saved).not.toHaveProperty("playIndex");
  });

  it("启动时读回偏好，忽略坏值", async () => {
    localStorage.setItem(
      "data",
      JSON.stringify({ state: { coverType: "2", playerLoop: "wrong", musicVolume: "x" } }),
    );
    const { useMain } = await load();
    expect(useMain.getState().coverType).toBe("2");
    expect(useMain.getState().playerLoop).toBe("all");
    expect(useMain.getState().musicVolume).toBe(0.7);
  });

  it("坏 JSON 不炸", async () => {
    localStorage.setItem("data", "{oops");
    const { useMain } = await load();
    expect(useMain.getState().coverType).toBe("0");
  });
});
