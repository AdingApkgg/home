"use client";

import { useMemo } from "react";
import { siteConfig } from "@/lib/config";
import { useMain } from "@/store/main";
import { FuncArea } from "./func-area";
import { Links } from "./links";

function parseUrl(raw: string): [string, string] {
  const url = raw || "saop.cc";
  const clean = url.replace(/^(https?:\/\/)/, "");
  const parts = clean.split(".");
  return [parts[0] ?? "saop", parts.slice(1).join(".") || "cc"];
}

export function MainRight() {
  const mobileOpen = useMain((s) => s.mobileOpenState);
  const setStore = useMain((s) => s.set);
  const funcState = useMain((s) => s.mobileFuncState);
  const [name, tld] = useMemo(() => parseUrl(siteConfig.siteUrl), []);

  return (
    <div className={`md:w-1/2 md:ml-3 w-full ${mobileOpen ? "block" : "hidden md:block"}`}>
      <div
        onClick={() => setStore("mobileFuncState", !funcState)}
        className="w-full font-pacifico text-center text-4xl fixed top-[6%] left-0 transition-transform active:scale-95 animate-fade-in md:hidden truncate px-4"
      >
        <span>{name}</span>
        <span>.{tld}</span>
      </div>
      <FuncArea />
      <Links />
    </div>
  );
}
