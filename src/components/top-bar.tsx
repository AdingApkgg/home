"use client";

import { Eye, MessageSquare, Settings } from "lucide-react";
import { useMain } from "@/store/main";

export function TopBar() {
  const set = useMain((s) => s.set);
  const wallpaperPeek = useMain((s) => s.wallpaperPeek);

  return (
    <nav
      aria-label="全局操作"
      className="fixed right-4 top-4 flex items-center gap-1 safe-top"
    >
      <IconButton
        label={wallpaperPeek ? "退出壁纸展示" : "查看壁纸"}
        active={wallpaperPeek}
        onClick={() => set("wallpaperPeek", !wallpaperPeek)}
      >
        <Eye size={18} aria-hidden />
      </IconButton>
      <IconButton label="留言板" onClick={() => set("commentsOpen", true)}>
        <MessageSquare size={18} aria-hidden />
      </IconButton>
      <IconButton label="设置" onClick={() => set("settingsOpen", true)}>
        <Settings size={18} aria-hidden />
      </IconButton>
    </nav>
  );
}

function IconButton({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={`focus-ring inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors ${
        active ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}
