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

const anniversaries: Record<string, string> = {
  "4.4": "清明节",
  "5.12": "汶川大地震纪念日",
  "7.7": "中国人民抗日战争纪念日",
  "9.18": "九·一八事变纪念日",
  "12.13": "南京大屠杀死难者国家公祭日",
};

export const getAnniversary = (): string | null => {
  const d = new Date();
  return anniversaries[`${d.getMonth() + 1}.${d.getDate()}`] ?? null;
};
