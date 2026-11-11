import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/lib/toast";
import { useMain } from "@/store/main";

export function SettingsDialog() {
  const open = useMain((s) => s.settingsOpen);
  const set = useMain((s) => s.set);
  const s = useMain((st) => st);

  return (
    <Dialog open={open} onOpenChange={(v) => set("settingsOpen", v)}>
      <DialogContent className="max-w-md p-0">
        <div className="border-b border-white/10 px-5 py-4">
          <DialogTitle className="text-sm font-medium tracking-wide text-white/90">设置</DialogTitle>
        </div>
        <div className="max-h-[70vh] space-y-6 overflow-y-auto px-5 py-5">
          <Section title="壁纸">
            <RadioGroup
              value={s.coverType}
              onValueChange={(v) => {
                set("coverType", v as typeof s.coverType);
                toast("壁纸已切换");
              }}
              className="grid-cols-2"
            >
              <RadioGroupItem value="0" label="默认" />
              <RadioGroupItem value="1" label="每日一图" />
              <RadioGroupItem value="2" label="随机风景" />
              <RadioGroupItem value="3" label="随机动漫" />
            </RadioGroup>
          </Section>

          <Section title="动效">
            <Row
              label="星尘背景与入场动效"
              checked={s.fx}
              onChange={(v) => {
                set("fx", v);
                toast(v ? "动效已开启" : "动效已关闭");
              }}
            />
            <p className="text-xs leading-relaxed text-white/45">
              关掉后只剩壁纸，适合低电量或弱设备；系统「减少动态效果」优先。
            </p>
          </Section>

          <Section title="播放器">
            <Row label="自动播放" checked={s.playerAutoplay} onChange={(v) => set("playerAutoplay", v)} />
            <Row
              label="随机播放"
              checked={s.playerOrder === "random"}
              onChange={(v) => set("playerOrder", v ? "random" : "list")}
            />
            <div className="pt-1">
              <div className="mb-1.5 text-xs text-white/60">循环模式</div>
              <RadioGroup
                value={s.playerLoop}
                onValueChange={(v) => set("playerLoop", v as typeof s.playerLoop)}
                className="grid-cols-3"
              >
                <RadioGroupItem value="all" label="列表" />
                <RadioGroupItem value="one" label="单曲" />
                <RadioGroupItem value="none" label="不循环" />
              </RadioGroup>
            </div>
          </Section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2.5">
      <div className="text-xs font-medium uppercase tracking-widest text-white/40">{title}</div>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

function Row({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-white/80">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
