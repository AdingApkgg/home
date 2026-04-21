"use client";

import { useMain } from "@/store/main";
import { Message } from "./message";
import { SocialLinks } from "./social-links";

export function MainLeft() {
  const mobileOpen = useMain((s) => s.mobileOpenState);
  return (
    <div className={`md:w-1/2 mr-0 md:mr-2.5 translate-y-5 w-full ${mobileOpen ? "hidden md:block" : "block"}`}>
      <Message />
      <SocialLinks />
    </div>
  );
}
