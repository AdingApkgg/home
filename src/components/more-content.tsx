"use client";

import { MessageSquare } from "lucide-react";
import { useMain } from "@/store/main";
import { Card } from "@/components/ui/card";

export function MoreContent() {
  const setStore = useMain((s) => s.set);
  return (
    <div className="mt-5 flex items-center justify-center w-full">
      <Card
        onClick={() => setStore("commentOpenState", true)}
        className="flex items-center gap-2 px-6 py-2.5 cursor-pointer transition-all hover:bg-white/20 hover:scale-105 active:scale-[0.97]"
      >
        <MessageSquare size={20} />
        <span className="text-[0.95rem]">留言板</span>
      </Card>
    </div>
  );
}
