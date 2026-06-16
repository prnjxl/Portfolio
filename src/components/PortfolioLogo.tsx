"use client";

import { Six_Caps } from "next/font/google";

const sixCaps = Six_Caps({
  subsets: ["latin"],
  weight: "400",
});

export default function PortfolioLogo() {
  return (
    <div
      className={`
        ${sixCaps.className}
        text-black
        dark:text-white
        transition-colors
        duration-500
        leading-none
        tracking-wide
        text-[6rem]
        sm:text-[8rem]
        md:text-[10rem]
        lg:text-[12rem]
      `}
    >
      PORTFOLIO
    </div>
  );
}