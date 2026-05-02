"use client";

import { toast } from "sonner";
import { useMain } from "@/store/main";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";

export function SettingsDialog() {
  const open = useMain((s) => s.settingsOpen);
  const set = useMain((s) => s.set);
  const s = useMain((st) => st);

  return (
    <Dialog open={open} onOpenChange={(v) => set("settingsOpen", v)}>
      <DialogContent className="max-w-md p-0">
        <div className="border-b border-white/10 px-5 py-4">
          <DialogTitle className="text-sm font-medium tracking-wide text-white/90">
            设置
          </DialogTitle>
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

function Row({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-white/80">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
