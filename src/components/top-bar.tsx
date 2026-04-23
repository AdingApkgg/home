"use client";

import { Eye, MessageSquare, Settings } from "lucide-react";
import { useMain } from "@/store/main";

export function TopBar() {
  const set = useMain((s) => s.set);
  const wallpaperPeek = useMain((s) => s.wallpaperPeek);

  return (
    <nav
      aria-label="全局操作"
      className="fixed right-4 top-4 z-40 flex items-center gap-1 safe-top"
    >
      <IconButton
        label={wallpaperPeek ? "退出壁纸展示" : "查看壁纸"}
        pressed={wallpaperPeek}
        onClick={() => set("wallpaperPeek", !wallpaperPeek)}
      >
        <Eye size={18} aria-hidden />
      </IconButton>
      <IconButton label="留言板" dialog onClick={() => set("commentsOpen", true)}>
        <MessageSquare size={18} aria-hidden />
      </IconButton>
      <IconButton label="设置" dialog onClick={() => set("settingsOpen", true)}>
        <Settings size={18} aria-hidden />
      </IconButton>
    </nav>
  );
}

function IconButton({
  label,
  pressed,
  dialog,
  onClick,
  children,
}: {
  label: string;
  /** toggle button only — undefined for dialog triggers and plain actions */
  pressed?: boolean;
  /** opens a modal dialog */
  dialog?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      aria-haspopup={dialog ? "dialog" : undefined}
      onClick={onClick}
      className={`focus-ring inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors ${
        pressed ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}
