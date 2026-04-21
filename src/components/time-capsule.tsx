"use client";

import { useEffect, useState } from "react";
import { Hourglass } from "lucide-react";
import { getTimeCapsule, siteDateStatistics, type TimeCapsule as TC } from "@/lib/get-time";
import { siteConfig } from "@/lib/config";
import { useMain } from "@/store/main";
import { Progress } from "@/components/ui/progress";

export function TimeCapsule() {
  const siteStartShow = useMain((s) => s.siteStartShow);
  const [data, setData] = useState<TC>(() => getTimeCapsule());
  const [startText, setStartText] = useState<string | null>(null);

  useEffect(() => {
    const startDate = siteConfig.siteStart ? new Date(siteConfig.siteStart) : null;
    const tick = () => {
      setData(getTimeCapsule());
      if (startDate) setStartText(siteDateStatistics(startDate));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const entries = [
    ["day", data.day] as const,
    ["week", data.week] as const,
    ["month", data.month] as const,
    ["year", data.year] as const,
  ];

  return (
    <div className="w-full">
      <div className="flex items-center mb-6 text-[1.1rem]">
        <Hourglass size={24} className="mr-1.5" />
        <span>时光胶囊</span>
      </div>
      <div>
        {entries.map(([tag, item]) => {
          const unit = tag === "day" ? "小时" : "天";
          return (
            <div key={tag} className="mb-4 last:mb-0">
              <div className="flex items-center justify-between mt-2 mb-2 text-sm">
                <span>
                  {item.name}已度过 <strong>{item.passed}</strong> {unit}
                </span>
                <span className="opacity-60 text-xs italic">剩余 {item.remaining} {unit}</span>
              </div>
              <Progress value={parseFloat(item.percentage)} label={`${item.percentage}%`} />
            </div>
          );
        })}
        {siteStartShow && startText && (
          <div className="mt-2 text-center opacity-80 text-xs">{startText}</div>
        )}
      </div>
    </div>
  );
}
