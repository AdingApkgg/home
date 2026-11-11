import {
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Clapperboard,
  Code,
  Disc3,
  Fish,
  Gamepad2,
  Hash,
  Images,
  Laptop,
  Link as LinkIcon,
  ListMusic,
  MessageCircle,
  PackageOpen,
  Play,
  Radar,
  Search,
  Server,
  Shapes,
  Tags,
  Tv,
  Umbrella,
  User,
} from "lucide-react";
import { linkGroups } from "@/data/site-links";
import { rowHover } from "@/lib/fx/reveal";

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Blog: BookOpen,
  Fish,
  LaptopCode: Laptop,
  UmbrellaBeach: Umbrella,
  Images,
  CompactDisc: Disc3,
  User,
  BoxOpen: PackageOpen,
  Server,
  Search,
  SlackHash: Hash,
  Tags,
  Code,
  Icons: Shapes,
  BarChart: BarChart3,
  Tv,
  Clapperboard,
  Radar,
  MessageCircle,
  Play,
  Gamepad2,
  ListMusic,
};

export function LinkGrid() {
  return (
    <div className="flex w-full flex-col gap-14 sm:gap-16">
      {linkGroups.map((group, groupIndex) => (
        <section key={group.id} aria-labelledby={`group-${group.id}`} className="w-full">
          <div className="grid gap-4 lg:grid-cols-12 lg:gap-14">
            {/* 编号 + 标题占左侧一栏，编号只做引导，真正读的是标题。 */}
            <div className="flex items-baseline gap-3 lg:col-span-3 lg:flex-col lg:items-start lg:gap-1.5">
              <span
                data-reveal="ordinal"
                className="font-mono text-[11px] tabular-nums tracking-[0.2em] text-ring text-shadow-soft"
              >
                {String(groupIndex + 2).padStart(2, "0")}
              </span>
              <h2
                id={`group-${group.id}`}
                data-reveal="section"
                className="font-display text-xl leading-tight tracking-tight text-shadow-soft sm:text-2xl"
              >
                {group.title}
              </h2>
            </div>

            <div className="lg:col-span-9">
              <p
                data-reveal="body"
                className="max-w-prose border-l-2 border-white/15 pl-4 text-[13px] leading-[1.9] text-white/65 text-shadow-soft sm:pl-5"
              >
                {group.intro}
              </p>

              {/* 索引本体：两列细线表格，悬停时整格浮起、茶色竖线拉长。 */}
              <ul className="-mx-2 mt-6 grid gap-x-10 sm:grid-cols-2">
                {group.links.map((item) => {
                  const Icon = ICONS[item.icon] ?? LinkIcon;
                  return (
                    <li key={item.link} data-reveal="row" className="border-t border-white/10">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        onPointerEnter={(e) => rowHover(e.currentTarget, true)}
                        onPointerLeave={(e) => rowHover(e.currentTarget, false)}
                        className="focus-ring group relative flex items-start gap-3 rounded-sm px-2 py-3.5 transition-colors hover:bg-white/[0.06]"
                      >
                        <span
                          aria-hidden
                          data-row-rail
                          style={{ transform: "scaleY(0)" }}
                          className="absolute top-1/2 -left-px h-6 -mt-3 w-px bg-ring/80 opacity-0"
                        />
                        <Icon
                          size={15}
                          data-row-icon
                          className="mt-[3px] shrink-0 text-ring/70 group-hover:text-ring"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-1.5 text-[13.5px] font-medium tracking-tight text-white/85 group-hover:text-white">
                            {item.name}
                            <ArrowUpRight
                              size={12}
                              aria-hidden
                              data-row-arrow
                              className="opacity-0 transition-opacity group-hover:opacity-60"
                            />
                          </span>
                          <span className="mt-1 block text-[11.5px] leading-relaxed text-white/50 text-shadow-soft group-hover:text-white/70">
                            {item.desc}
                          </span>
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
