"use client";

import { Six_Caps } from "next/font/google";
import RubiksCube from "./RubiksCube";

const sixCaps = Six_Caps({
  subsets: ["latin"],
  weight: "400",
});

export default function PortfolioLogo() {
  return (
    <div className="flex items-center justify-center w-full">
      <RubiksCube />
    </div>
  );
}