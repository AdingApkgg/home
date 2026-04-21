import { useMain } from "@/store/main";

export function useIsMobile() {
  const w = useMain((s) => s.innerWidth);
  return w !== null && w < 721;
}
