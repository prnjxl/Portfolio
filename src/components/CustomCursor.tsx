"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Raw mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Big ball: smooth spring with lag
  const bigBallX = useSpring(mouseX, { damping: 25, stiffness: 150, mass: 0.5 });
  const bigBallY = useSpring(mouseY, { damping: 25, stiffness: 150, mass: 0.5 });

  // Small ball: snappy spring (nearly instant)
  const smallBallX = useSpring(mouseX, { damping: 30, stiffness: 600, mass: 0.2 });
  const smallBallY = useSpring(mouseY, { damping: 30, stiffness: 600, mass: 0.2 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    // Attach hover listeners to all .hoverable elements and interactive elements
    const attachHoverListeners = () => {
      const hoverables = document.querySelectorAll(
        ".hoverable, a, button, [role='button'], input, textarea, select"
      );
      hoverables.forEach((el) => {
        el.addEventListener("mouseenter", handleMouseEnter);
        el.addEventListener("mouseleave", handleMouseLeave);
      });
      return hoverables;
    };

    document.addEventListener("mousemove", handleMouseMove);
    const hoverables = attachHoverListeners();

    // Re-attach on DOM changes (for dynamic content)
    const observer = new MutationObserver(() => {
      // Detach old listeners from current set
      hoverables.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
      attachHoverListeners();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      hoverables.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
      observer.disconnect();
    };
  }, [mouseX, mouseY, isVisible]);

  // Don't render on touch-only devices
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      {/* Big ball – blend mode cursor */}
      <motion.div
        className="cursor__ball cursor__ball--big"
        style={{
          x: bigBallX,
          y: bigBallY,
          position: "fixed",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 9999,
          mixBlendMode: "difference",
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible ? 1 : 0,
        }}
        animate={{
          scale: isHovering ? 3.5 : 1,
        }}
        transition={{
          scale: { duration: 0.3, ease: "easeOut" },
        }}
      >
        <svg height="30" width="30" viewBox="0 0 30 30">
          <circle cx="15" cy="15" r="12" strokeWidth="0" fill="#f7f8fa" />
        </svg>
      </motion.div>

      {/* Small ball – precise dot */}
      <motion.div
        className="cursor__ball cursor__ball--small"
        style={{
          x: smallBallX,
          y: smallBallY,
          position: "fixed",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 9999,
          mixBlendMode: "difference",
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible ? 1 : 0,
        }}
      >
        <svg height="10" width="10" viewBox="0 0 10 10">
          <circle cx="5" cy="5" r="4" strokeWidth="0" fill="#f7f8fa" />
        </svg>
      </motion.div>
    </>
  );
}
