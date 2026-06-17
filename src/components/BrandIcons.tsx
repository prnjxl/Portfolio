import React from "react";
import {
  SiJavascript,
  SiTypescript,
  SiPython,
  SiCplusplus,
  SiReact,
  SiNextdotjs,
  SiHtml5,
  SiTailwindcss,
  SiFramer,
  SiNodedotjs,
  SiExpress,
  SiGraphql,
  SiMongodb,
  SiGit,
  SiDocker,
  SiFigma,
} from "react-icons/si";
import { FaJava, FaDatabase } from "react-icons/fa";

interface IconProps extends React.ComponentPropsWithoutRef<"svg"> {
  size?: number | string;
}

export const BrandIcons: Record<string, React.FC<IconProps>> = {
  js: ({ size = 22, ...props }) => <SiJavascript size={size} {...props} />,
  ts: ({ size = 22, ...props }) => <SiTypescript size={size} {...props} />,
  py: ({ size = 22, ...props }) => <SiPython size={size} {...props} />,
  java: ({ size = 22, ...props }) => <FaJava size={size} {...props} />,
  cpp: ({ size = 22, ...props }) => <SiCplusplus size={size} {...props} />,
  react: ({ size = 22, ...props }) => <SiReact size={size} {...props} />,
  next: ({ size = 22, ...props }) => <SiNextdotjs size={size} {...props} />,
  html: ({ size = 22, ...props }) => <SiHtml5 size={size} {...props} />,
  tw: ({ size = 22, ...props }) => <SiTailwindcss size={size} {...props} />,
  fm: ({ size = 22, ...props }) => <SiFramer size={size} {...props} />,
  node: ({ size = 22, ...props }) => <SiNodedotjs size={size} {...props} />,
  express: ({ size = 22, ...props }) => <SiExpress size={size} {...props} />,
  gql: ({ size = 22, ...props }) => <SiGraphql size={size} {...props} />,
  mongo: ({ size = 22, ...props }) => <SiMongodb size={size} {...props} />,
  sql: ({ size = 22, ...props }) => <FaDatabase size={size} {...props} />,
  git: ({ size = 22, ...props }) => <SiGit size={size} {...props} />,
  docker: ({ size = 22, ...props }) => <SiDocker size={size} {...props} />,
  figma: ({ size = 22, ...props }) => <SiFigma size={size} {...props} />,
};

export const BRAND_COLORS: Record<string, string> = {
  js: "#F7DF1E",
  ts: "#3178C6",
  py: "#3776AB",
  java: "#007396",
  cpp: "#00599C",
  react: "#61DAFB",
  next: "#7B68EE", // themed purple
  html: "#E34F26",
  tw: "#38BDF8",
  fm: "#F024B6",
  node: "#339933",
  express: "#7F7F7F",
  gql: "#E10098",
  mongo: "#47A248",
  sql: "#00758F",
  git: "#F05032",
  docker: "#2496ED",
  figma: "#F24E1E",
};
