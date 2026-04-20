"use client";

import { toast } from "sonner";
import { CircleCheck } from "lucide-react";
import { useMain, THEME_STYLES, type ThemeStyle } from "@/store/main";
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";

const THEME_COLOR: Record<ThemeStyle, string> = {
  zinc: "#52525b", slate: "#475569", stone: "#57534e", gray: "#4b5563",
  neutral: "#525252", red: "#dc2626", rose: "#e11d48", orange: "#f97316",
  green: "#16a34a", blue: "#2563eb", yellow: "#eab308", violet: "#7c3aed",
};

export function SettingsPanel() {
  const s = useMain((st) => st);
  const set = useMain((st) => st.set);

  return (
    <div className="text-white">
      <Accordion type="single" collapsible defaultValue="1" className="w-full">
        <AccordionItem value="1">
          <AccordionTrigger>个性壁纸</AccordionTrigger>
          <AccordionContent>
            <RadioGroup
              value={s.coverType}
              onValueChange={(v) => {
                set("coverType", v as typeof s.coverType);
                toast("壁纸更换成功", { icon: <CircleCheck size={18} /> });
              }}
              className="grid-cols-2 sm:grid-cols-4"
            >
              <RadioGroupItem value="0" label="默认壁纸" />
              <RadioGroupItem value="1" label="每日一图" />
              <RadioGroupItem value="2" label="随机风景" />
              <RadioGroupItem value="3" label="随机动漫" />
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="theme">
          <AccordionTrigger>主题色</AccordionTrigger>
          <AccordionContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>跟随系统随机（每次打开随机主题色）</span>
              <Switch
                checked={s.themeStyle === null}
                onCheckedChange={(c) => set("themeStyle", c ? null : "zinc")}
              />
            </div>
            {s.themeStyle !== null && (
              <div className="grid grid-cols-6 gap-2.5">
                {THEME_STYLES.map((t) => {
                  const selected = s.themeStyle === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      aria-label={`主题色 ${t}`}
                      aria-pressed={selected}
                      onClick={() => set("themeStyle", t)}
                      className={`focus-ring relative h-10 rounded-md border-2 transition-all ${
                        selected
                          ? "border-white scale-105 shadow-lg"
                          : "border-white/20 hover:border-white/60 hover:scale-105"
                      }`}
                      style={{ background: THEME_COLOR[t] }}
                      title={t}
                    >
                      {selected && (
                        <CircleCheck
                          size={16}
                          aria-hidden
                          className="absolute inset-0 m-auto text-white drop-shadow"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
            <div className="text-xs text-white/60">浅色 / 深色 自动跟随系统。</div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="2">
          <AccordionTrigger>个性化调整</AccordionTrigger>
          <AccordionContent className="space-y-3">
            <Row label="建站日期显示" checked={s.siteStartShow} onChange={(v) => set("siteStartShow", v)} />
            <Row label="音乐点击是否打开面板" checked={s.musicClick} onChange={(v) => set("musicClick", v)} />
            <Row label="底栏歌词显示" checked={s.playerLrcShow} onChange={(v) => set("playerLrcShow", v)} />
            <Row label="底栏背景模糊" checked={s.footerBlur} onChange={(v) => set("footerBlur", v)} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="3">
          <AccordionTrigger>播放器配置</AccordionTrigger>
          <AccordionContent className="space-y-3">
            <Row label="自动播放" checked={s.playerAutoplay} onChange={(v) => set("playerAutoplay", v)} />
            <Row
              label="随机播放"
              checked={s.playerOrder === "random"}
              onChange={(v) => set("playerOrder", v ? "random" : "list")}
            />
            <div>
              <div className="mb-2 text-sm">循环模式</div>
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
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

function Row({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span>{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
