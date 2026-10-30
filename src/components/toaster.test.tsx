import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { Toaster } from "@/components/toaster";
import { toast, useToasts } from "@/lib/toast";

describe("Toaster", () => {
  beforeEach(() => useToasts.setState({ items: [] }));

  it("没有提示时不渲染容器", () => {
    const { container } = render(<Toaster />);
    expect(container.querySelector("[data-toaster]")).toBeNull();
  });

  it("渲染提示文案", () => {
    render(<Toaster />);
    act(() => {
      toast("壁纸已切换");
    });
    expect(screen.getByText("壁纸已切换")).toBeTruthy();
  });
});
