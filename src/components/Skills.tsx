"use client";

import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import { DM_Sans } from "next/font/google";
import { BrandIcons, BRAND_COLORS } from "./BrandIcons";
import { useTheme } from "./ThemeProvider";

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "700", "800"] });

interface Skill {
  id: string;
  name: string;
}

const SKILLS_LIST: Skill[] = [
  { id: "js", name: "JavaScript" },
  { id: "ts", name: "TypeScript" },
  { id: "py", name: "Python" },
  { id: "java", name: "Java" },
  { id: "cpp", name: "C++" },
  { id: "react", name: "React" },
  { id: "next", name: "Next.js" },
  { id: "html", name: "HTML / CSS" },
  { id: "tw", name: "Tailwind CSS" },
  { id: "fm", name: "Framer Motion" },
  { id: "node", name: "Node.js" },
  { id: "express", name: "Express" },
  { id: "gql", name: "GraphQL" },
  { id: "mongo", name: "MongoDB" },
  { id: "sql", name: "SQL" },
  { id: "git", name: "Git" },
  { id: "docker", name: "Docker" },
  { id: "figma", name: "Figma" },
];

export default function Skills() {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const { theme } = useTheme();

  // Framer Motion animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const hoverBorderColor = theme === "light" ? "#000000" : "#ffffff";
  const hoverShadow = theme === "light"
    ? "0 8px 25px rgba(0, 0, 0, 0.08), inset 0 0 10px rgba(0, 0, 0, 0.03)"
    : "0 8px 25px rgba(255, 255, 255, 0.08), inset 0 0 10px rgba(255, 255, 255, 0.03)";
  const hoverBgGradient = theme === "light"
    ? "radial-gradient(circle at 10% 20%, rgba(0, 0, 0, 0.02) 0%, transparent 50%)"
    : "radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.02) 0%, transparent 50%)";

  return (
    <section
      id="skills"
      className="relative w-full min-h-screen py-24 px-4 flex flex-col justify-center items-center z-10"
    >
      <div className="max-w-6xl w-full mx-auto flex flex-col items-center">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base">
            A comprehensive list of technologies, frameworks, databases, and design systems in my stack.
          </p>
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="
            grid
            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-4
            lg:grid-cols-5
            xl:grid-cols-6
            gap-4
            w-full
          "
        >
          {SKILLS_LIST.map((skill) => {
            const IconComponent = BrandIcons[skill.id];
            const brandColor = BRAND_COLORS[skill.id] || "#7B68EE";
            const isHovered = hoveredSkill === skill.id;

            // Icons are always colored in both light and dark themes
            const iconStyle = { color: brandColor };

            return (
              <motion.div
                key={skill.id}
                variants={itemVariants}
                onMouseEnter={() => setHoveredSkill(skill.id)}
                onMouseLeave={() => setHoveredSkill(null)}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                style={{
                  borderColor: isHovered ? hoverBorderColor : undefined,
                  boxShadow: isHovered ? hoverShadow : undefined,
                }}
                className={`
                  relative
                  flex
                  items-center
                  gap-3.5
                  p-4
                  rounded-[3px]
                  border
                  border-zinc-200
                  dark:border-zinc-800/70
                  bg-[#fbfbfb]/80
                  dark:bg-[#151515]/30
                  backdrop-blur-md
                  transition-colors
                  duration-300
                  overflow-hidden
                  group
                `}
              >
                {/* Glow Background Overlay */}
                <div
                  className="
                    absolute
                    inset-0
                    opacity-0
                    group-hover:opacity-100
                    transition-opacity
                    duration-500
                    pointer-events-none
                  "
                  style={{
                    background: hoverBgGradient,
                  }}
                />

                {/* Branded Icon Container */}
                <div
                  className="
                    flex-shrink-0
                    transition-all
                    duration-300
                    group-hover:scale-110
                  "
                >
                  {IconComponent ? (
                    <IconComponent
                      size={22}
                      style={iconStyle}
                      className="
                        text-zinc-400
                        dark:text-zinc-600
                        transition-colors
                        duration-300
                      "
                    />
                  ) : (
                    <div className="w-[22px] h-[22px] rounded-full bg-zinc-200 dark:bg-zinc-800" />
                  )}
                </div>

                {/* Skill Title */}
                <span
                  className={`
                    ${dmSans.className}
                    text-[13px]
                    font-medium
                    tracking-tight
                    text-zinc-600
                    dark:text-zinc-400
                    group-hover:text-zinc-900
                    dark:group-hover:text-zinc-100
                    transition-colors
                    duration-300
                  `}
                >
                  {skill.name}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
