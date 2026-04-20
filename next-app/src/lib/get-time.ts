import dayjs from "dayjs";

export interface CurrentTime {
  year: number;
  month: string;
  day: string;
  hour: string;
  minute: string;
  second: string;
  weekday: string;
}

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

export const getCurrentTime = (): CurrentTime => {
  const t = new Date();
  const weekday = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  return {
    year: t.getFullYear(),
    month: pad(t.getMonth() + 1),
    day: pad(t.getDate()),
    hour: pad(t.getHours()),
    minute: pad(t.getMinutes()),
    second: pad(t.getSeconds()),
    weekday: weekday[t.getDay()]!,
  };
};

export interface TimeDifference {
  name: string;
  total: number;
  passed: number;
  remaining: number;
  percentage: string;
}

export interface TimeCapsule {
  day: TimeDifference;
  week: TimeDifference;
  month: TimeDifference;
  year: TimeDifference;
}

export const getTimeCapsule = (): TimeCapsule => {
  const now = dayjs();
  const label: Record<string, string> = { day: "今日", week: "本周", month: "本月", year: "本年" };

  const diff = (unit: dayjs.OpUnitType): TimeDifference => {
    const start = now.startOf(unit);
    const end = now.endOf(unit);
    const total = end.diff(start, unit === "day" ? "hour" : "day") + 1;
    let passed = now.diff(start, unit === "day" ? "hour" : "day");
    if (unit === "week") passed = (passed + 6) % 7;
    const remaining = total - passed;
    return {
      name: label[unit as string]!,
      total,
      passed,
      remaining,
      percentage: ((passed / total) * 100).toFixed(2),
    };
  };

  return {
    day: diff("day"),
    week: diff("week"),
    month: diff("month"),
    year: diff("year"),
  };
};

export const getHello = (): string => {
  const h = new Date().getHours();
  if (h < 6) return "凌晨好";
  if (h < 9) return "早上好";
  if (h < 12) return "上午好";
  if (h < 14) return "中午好";
  if (h < 17) return "下午好";
  if (h < 19) return "傍晚好";
  if (h < 22) return "晚上好";
  return "夜深了";
};

export const anniversaries: Record<string, string> = {
  "4.4": "清明节",
  "5.12": "汶川大地震纪念日",
  "7.7": "中国人民抗日战争纪念日",
  "9.18": "九·一八事变纪念日",
  "12.13": "南京大屠杀死难者国家公祭日",
};

export const getAnniversary = (): string | null => {
  const d = new Date();
  const key = `${d.getMonth() + 1}.${d.getDate()}`;
  return anniversaries[key] ?? null;
};

export const siteDateStatistics = (startDate: Date): string => {
  const diffMs = Date.now() - startDate.getTime();
  const days = diffMs / 86400000;
  const months = days / 30;
  const years = months / 12;
  if (years >= 1) {
    return `本站已经苟活了 ${Math.floor(years)} 年 ${Math.floor(months % 12)} 月 ${Math.round(days % 30)} 天`;
  }
  if (months >= 1) {
    return `本站已经苟活了 ${Math.floor(months)} 月 ${Math.round(days % 30)} 天`;
  }
  return `本站已经苟活了 ${Math.round(days)} 天`;
};
