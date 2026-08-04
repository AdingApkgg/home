import { useState } from "react";
import { Download, MessageSquare, Settings } from "lucide-react";
import { toast } from "sonner";
import { downloadWallpaper } from "@/lib/api";
import { prefetchArtalk } from "@/lib/artalk";
import { useMain } from "@/store/main";

export function TopBar() {
  const set = useMain((s) => s.set);
  const wallpaperUrl = useMain((s) => s.wallpaperUrl);
  const [downloading, setDownloading] = useState(false);

  const onDownload = async () => {
    if (!wallpaperUrl || downloading) return;
    setDownloading(true);
    try {
      await downloadWallpaper(wallpaperUrl);
      toast("壁纸已保存");
    } catch {
      toast.error("壁纸下载失败");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <nav
      aria-label="全局操作"
      className="fixed right-3 z-40 flex items-center gap-0.5 safe-inset-top"
    >
      <IconButton
        label="下载当前壁纸"
        onClick={onDownload}
        disabled={!wallpaperUrl || downloading}
        busy={downloading}
      >
        <Download size={18} aria-hidden />
      </IconButton>
      <IconButton
        label="留言板"
        dialog
        prefetch={prefetchArtalk}
        onClick={() => set("commentsOpen", true)}
      >
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
  dialog,
  disabled,
  busy,
  prefetch,
  onClick,
  children,
}: {
  label: string;
  /** opens a modal dialog */
  dialog?: boolean;
  disabled?: boolean;
  busy?: boolean;
  /** warms the lazy chunk this button opens, on pointer/keyboard intent */
  prefetch?: () => void;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-haspopup={dialog ? "dialog" : undefined}
      aria-busy={busy ? true : undefined}
      disabled={disabled}
      onPointerEnter={prefetch}
      onFocus={prefetch}
      onClick={onClick}
      className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-md text-white/80 drop-shadow-sm transition-colors hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-50"
    >
      {children}
    </button>
  );
}
