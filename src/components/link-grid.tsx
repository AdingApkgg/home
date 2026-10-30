import {
  ArrowUpRight, BarChart3, BookOpen, Clapperboard, Code, Disc3, Fish, Gamepad2, Hash, Images,
  Laptop, Link as LinkIcon, ListMusic, MessageCircle, PackageOpen, Play, Radar, Search, Server,
  Shapes, Tags, Tv, Umbrella, User,
} from "lucide-react";
import { linkGroups } from "@/data/site-links";

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Blog: BookOpen, Fish, LaptopCode: Laptop, UmbrellaBeach: Umbrella, Images, CompactDisc: Disc3,
  User, BoxOpen: PackageOpen, Server, Search, SlackHash: Hash, Tags, Code, Icons: Shapes,
  BarChart: BarChart3, Tv, Clapperboard, Radar, MessageCircle, Play, Gamepad2, ListMusic,
};

export function LinkGrid() {
  return (
    <div className="flex w-full flex-col gap-9 sm:gap-11">
      {linkGroups.map((group) => (
        <section key={group.id} aria-labelledby={`group-${group.id}`} className="w-full">
          <h2
            id={`group-${group.id}`}
            className="text-xs font-medium uppercase tracking-[0.18em] text-white/55 text-shadow-soft"
          >
            {group.title}
          </h2>
          <p className="mt-2 max-w-prose text-sm leading-relaxed text-white/65 text-shadow-soft">
            {group.intro}
          </p>
          <ul className="mt-4 divide-y divide-white/10 border-t border-white/10">
            {group.links.map((item) => {
              const Icon = ICONS[item.icon] ?? LinkIcon;
              return (
                <li key={item.link}>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="focus-ring group flex items-start gap-3 rounded-md px-1 py-3 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <Icon size={17} className="mt-0.5 shrink-0 opacity-70 group-hover:opacity-100" />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1 text-sm font-medium">
                        {item.name}
                        <ArrowUpRight
                          size={13}
                          aria-hidden
                          className="opacity-0 transition-opacity group-hover:opacity-60"
                        />
                      </span>
                      <span className="mt-1 block text-xs leading-relaxed text-white/55 group-hover:text-white/70">
                        {item.desc}
                      </span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
