import { h } from "vue";
import { ElMessage } from "element-plus";
import { Flame } from "lucide-vue-next";
import dayjs from "dayjs";

export interface CurrentTime {
  year: number;
  month: string | number;
  day: string | number;
  hour: string | number;
  minute: string | number;
  second: string | number;
  weekday: string;
}

interface TimeDifference {
  name: string;
  total: number;
  passed: number;
  remaining: number;
  percentage: string;
}

interface TimeCapsule {
  day: TimeDifference;
  week: TimeDifference;
  month: TimeDifference;
  year: TimeDifference;
}

// 时钟
export const getCurrentTime = (): CurrentTime => {
  const time = new Date();
  const year = time.getFullYear();
  const month =
    time.getMonth() + 1 < 10
      ? `0${  time.getMonth() + 1}`
      : time.getMonth() + 1;
  const day = time.getDate() < 10 ? `0${  time.getDate()}` : time.getDate();
  const hour =
    time.getHours() < 10 ? `0${  time.getHours()}` : time.getHours();
  const minute =
    time.getMinutes() < 10 ? `0${  time.getMinutes()}` : time.getMinutes();
  const second =
    time.getSeconds() < 10 ? `0${  time.getSeconds()}` : time.getSeconds();
  const weekday = [
    "星期日",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六",
  ];
  return {
    year,
    month,
    day,
    hour,
    minute,
    second,
    weekday: weekday[time.getDay()]!,
  };
};

// 时光胶囊
export const getTimeCapsule = (): TimeCapsule => {
  const now = dayjs();
  const dayText: Record<string, string> = {
    day: "今日",
    week: "本周",
    month: "本月",
    year: "本年",
  };

  /**
   * 计算时间差的函数
   * @param unit 时间单位，可以是 'day', 'week', 'month', 'year'
   */
  const getDifference = (unit: dayjs.OpUnitType): TimeDifference => {
    const start = now.startOf(unit);
    const end = now.endOf(unit);
    const total =
      end.diff(start, unit === "day" ? "hour" : "day") + 1;
    let passed = now.diff(start, unit === "day" ? "hour" : "day");
    if (unit === "week") {
      passed = (passed + 6) % 7;
    }
    const remaining = total - passed;
    const percentage = (passed / total) * 100;
    return {
      name: dayText[unit]!,
      total,
      passed,
      remaining,
      percentage: percentage.toFixed(2),
    };
  };

  return {
    day: getDifference("day"),
    week: getDifference("week"),
    month: getDifference("month"),
    year: getDifference("year"),
  };
};

// 欢迎提示
export const helloInit = (): void => {
  const hour = new Date().getHours();
  let hello: string;
  if (hour < 6) {
    hello = "凌晨好";
  } else if (hour < 9) {
    hello = "早上好";
  } else if (hour < 12) {
    hello = "上午好";
  } else if (hour < 14) {
    hello = "中午好";
  } else if (hour < 17) {
    hello = "下午好";
  } else if (hour < 19) {
    hello = "傍晚好";
  } else if (hour < 22) {
    hello = "晚上好";
  } else {
    hello = "夜深了";
  }
  ElMessage({
    dangerouslyUseHTMLString: true,
    message: `<strong>${hello}</strong> 欢迎来到我的主页`,
  });
};

// 默哀模式
const anniversaries: Record<string, string> = {
  "4.4": "清明节",
  "5.12": "汶川大地震纪念日",
  "7.7": "中国人民抗日战争纪念日",
  "9.18": "九·一八事变纪念日",
  "12.13": "南京大屠杀死难者国家公祭日",
};

export const checkDays = (): void => {
  const myDate = new Date();
  const mon = myDate.getMonth() + 1;
  const date = myDate.getDate();
  const key = `${mon}.${date}`;
  if (Object.prototype.hasOwnProperty.call(anniversaries, key)) {
    console.info(`今天是${anniversaries[key]}`);
    const gray = document.createElement("style");
    gray.innerHTML = "html{filter: grayscale(100%)}";
    document.head.appendChild(gray);
    ElMessage({
      message: `今天是${anniversaries[key]}`,
      duration: 14000,
      icon: h(Flame, { size: 20, color: "#efefef" }),
    });
  }
};

// 建站日期统计
export const siteDateStatistics = (startDate: Date): string => {
  const currentDate = new Date();
  const differenceInTime = currentDate.getTime() - startDate.getTime();
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  const differenceInMonths = differenceInDays / 30;
  const differenceInYears = differenceInMonths / 12;
  if (differenceInYears >= 1) {
    return `本站已经苟活了 ${Math.floor(differenceInYears)} 年 ${Math.floor(
      differenceInMonths % 12,
    )} 月 ${Math.round(differenceInDays % 30)} 天`;
  } else if (differenceInMonths >= 1) {
    return `本站已经苟活了 ${Math.floor(differenceInMonths)} 月 ${Math.round(
      differenceInDays % 30,
    )} 天`;
  } else {
    return `本站已经苟活了 ${Math.round(differenceInDays)} 天`;
  }
};
