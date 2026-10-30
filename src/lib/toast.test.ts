import { beforeEach, describe, expect, it, vi } from "vitest";
import { toast, useToasts } from "@/lib/toast";

const items = () => useToasts.getState().items;

describe("toast", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useToasts.setState({ items: [] });
  });

  it("入队并在超时后移除", () => {
    toast("壁纸已保存");
    expect(items()).toHaveLength(1);
    vi.advanceTimersByTime(3300);
    expect(items()).toHaveLength(0);
  });

  it("同样文案只留一条", () => {
    toast("重复");
    toast("重复");
    expect(items()).toHaveLength(1);
  });

  it("error 停留更久", () => {
    toast.error("一言获取失败");
    vi.advanceTimersByTime(3300);
    expect(items()).toHaveLength(1);
    vi.advanceTimersByTime(1000);
    expect(items()).toHaveLength(0);
  });
});
