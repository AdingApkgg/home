"use client";

import { CalendarClock, House, LayoutGrid, MessageSquare, Music, Settings } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { useMain } from "@/store/main";

type Action = {
  key: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
};

export function MobileActionBar() {
  const store = useMain((s) => s);
  const set = useMain((s) => s.set);
  const hasPlayer = !!siteConfig.songId;

  const actions: Action[] = [
    {
      key: "home",
      label: "主页",
      icon: <House size={20} aria-hidden />,
      active: !store.mobileOpenState,
      onClick: () => set("mobileOpenState", false),
    },
    {
      key: "func",
      label: "功能",
      icon: <LayoutGrid size={20} aria-hidden />,
      active: store.mobileOpenState && !store.musicOpenState,
      onClick: () => set("mobileOpenState", true),
    },
    ...(hasPlayer
      ? [
          {
            key: "music",
            label: "音乐",
            icon: <Music size={20} aria-hidden />,
            active: store.mobileOpenState && store.musicOpenState,
            onClick: () => {
              set("mobileOpenState", true);
              set("mobileFuncState", true);
              set("musicOpenState", true);
            },
          } satisfies Action,
        ]
      : []),
    {
      key: "box",
      label: "更多",
      icon: <CalendarClock size={20} aria-hidden />,
      active: false,
      onClick: () => set("boxOpenState", true),
    },
    {
      key: "comment",
      label: "留言",
      icon: <MessageSquare size={20} aria-hidden />,
      active: false,
      onClick: () => set("commentOpenState", true),
    },
    {
      key: "settings",
      label: "设置",
      icon: <Settings size={20} aria-hidden />,
      active: false,
      onClick: () => set("setOpenState", true),
    },
  ];

  return (
    <nav
      aria-label="底部导航"
      className="md:hidden absolute bottom-0 left-0 right-0 flex items-stretch justify-around min-h-[60px] bg-black/30 backdrop-blur-md z-[var(--z-overlay)] animate-fade-in safe-bottom"
    >
      {actions.map((a) => (
        <button
          key={a.key}
          type="button"
          aria-label={a.label}
          aria-current={a.active ? "page" : undefined}
          onClick={a.onClick}
          className={`focus-ring flex flex-col items-center justify-center gap-0.5 flex-1 min-h-[48px] px-1 py-2 bg-transparent border-0 text-[0.65rem] transition-colors active:scale-95 ${
            a.active ? "text-white" : "text-white/60 hover:text-white/80"
          }`}
        >
          {a.icon}
          <span>{a.label}</span>
        </button>
      ))}
    </nav>
  );
}
