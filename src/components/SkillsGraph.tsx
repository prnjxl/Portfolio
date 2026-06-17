"use client";

import { useEffect, useRef, useCallback } from "react";

// ── Skills data ───────────────────────────────────────────
interface SkillNode {
  id: string;
  label: string;
  r: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  fx: number | null;
  fy: number | null;
}

const SKILL_DATA: { id: string; label: string; r: number }[] = [
  { id: "core", label: "Tools", r: 16 },
  // Languages
  { id: "js", label: "JavaScript", r: 10 },
  { id: "ts", label: "TypeScript", r: 10 },
  { id: "py", label: "Python", r: 9 },
  { id: "java", label: "Java", r: 8 },
  { id: "cpp", label: "C++", r: 7 },
  // Frontend
  { id: "react", label: "React", r: 11 },
  { id: "next", label: "Next.js", r: 10 },
  { id: "html", label: "HTML / CSS", r: 8 },
  { id: "tw", label: "Tailwind", r: 8 },
  { id: "fm", label: "Framer Motion", r: 7 },
  // Backend
  { id: "node", label: "Node.js", r: 10 },
  { id: "express", label: "Express", r: 8 },
  { id: "rest", label: "REST APIs", r: 7 },
  { id: "gql", label: "GraphQL", r: 7 },
  // Data & DevOps
  { id: "mongo", label: "MongoDB", r: 8 },
  { id: "sql", label: "SQL", r: 8 },
  { id: "git", label: "Git", r: 9 },
  { id: "docker", label: "Docker", r: 7 },
  { id: "aws", label: "AWS", r: 7 },
  // Other
  { id: "figma", label: "Figma", r: 7 },
  { id: "linux", label: "Linux", r: 7 },
];

const EDGES: [string, string][] = [
  // Core connections
  ["core", "js"], ["core", "ts"], ["core", "py"], ["core", "react"],
  ["core", "node"], ["core", "git"], ["core", "mongo"], ["core", "sql"],
  // Language family
  ["js", "ts"], ["js", "react"], ["js", "node"],
  ["py", "java"], ["java", "cpp"],
  // Frontend cluster
  ["react", "next"], ["react", "html"], ["react", "tw"], ["react", "fm"],
  ["next", "ts"], ["html", "tw"],
  // Backend cluster
  ["node", "express"], ["express", "rest"], ["rest", "gql"],
  ["node", "mongo"], ["node", "docker"],
  // Data & DevOps
  ["mongo", "sql"], ["docker", "aws"], ["git", "docker"],
  ["aws", "linux"], ["linux", "docker"],
  // Design
  ["figma", "html"], ["figma", "tw"],
  // Cross connections
  ["ts", "next"], ["ts", "node"], ["py", "sql"],
  ["gql", "ts"],
];

export default function SkillsGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<{
    nodes: SkillNode[];
    W: number;
    H: number;
    tx: number;
    ty: number;
    sc: number;
    hovNode: SkillNode | null;
    dragNode: SkillNode | null;
    panning: boolean;
    lastMX: number;
    lastMY: number;
    simActive: boolean;
    animId: number;
    isDark: boolean;
  } | null>(null);

  const getTheme = useCallback(() => {
    return document.documentElement.classList.contains("dark");
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const wrap = wrapRef.current!;

    // ── Sizing ──
    let W = wrap.clientWidth;
    let H = wrap.clientHeight;
    canvas.width = W;
    canvas.height = H;

    // ── Init nodes ──
    const cx = W / 2,
      cy = H / 2;
    const nodes: SkillNode[] = SKILL_DATA.map((d, i) => {
      if (i === 0) {
        return { ...d, x: cx, y: cy, vx: 0, vy: 0, fx: null, fy: null };
      }
      const a = ((i - 1) / (SKILL_DATA.length - 1)) * Math.PI * 2 - Math.PI / 2;
      const rad = Math.min(W, H) * 0.32;
      return {
        ...d,
        x: cx + Math.cos(a) * rad,
        y: cy + Math.sin(a) * rad,
        vx: 0,
        vy: 0,
        fx: null,
        fy: null,
      };
    });

    // ── State ──
    const state = {
      nodes,
      W,
      H,
      tx: 0,
      ty: 0,
      sc: 1,
      hovNode: null as SkillNode | null,
      dragNode: null as SkillNode | null,
      panning: false,
      lastMX: 0,
      lastMY: 0,
      simActive: true,
      animId: 0,
      isDark: getTheme(),
    };
    stateRef.current = state;

    // ── Physics constants ──
    const LINK_DIST = Math.min(W, H) * 0.28;
    const REPEL = 3200;
    const LINK_K = 0.04;
    const DAMP = 0.76;
    const CENTER_K = 0.003;

    function toWorld(mx: number, my: number) {
      return { x: (mx - state.tx) / state.sc, y: (my - state.ty) / state.sc };
    }

    function getNodeAt(mx: number, my: number) {
      const { x, y } = toWorld(mx, my);
      for (const n of state.nodes) {
        const dx = n.x - x,
          dy = n.y - y;
        const hit = Math.max(n.r + 6, 14);
        if (dx * dx + dy * dy < hit * hit) return n;
      }
      return null;
    }

    // ── Force tick ──
    function tick() {
      const cxNow = state.W / 2,
        cyNow = state.H / 2;
      state.nodes.forEach((n) => {
        if (n.fx !== null) {
          n.x = n.fx;
          n.y = n.fy!;
          n.vx = 0;
          n.vy = 0;
          return;
        }

        // repulsion
        state.nodes.forEach((m) => {
          if (m === n) return;
          const dx = n.x - m.x,
            dy = n.y - m.y;
          const d2 = dx * dx + dy * dy,
            d = Math.sqrt(d2) || 1;
          const f = REPEL / (d2 + 1);
          n.vx += (dx / d) * f;
          n.vy += (dy / d) * f;
        });

        // attraction along edges
        EDGES.forEach(([ai, bi]) => {
          const a = state.nodes.find((x) => x.id === ai)!;
          const b = state.nodes.find((x) => x.id === bi)!;
          if (a !== n && b !== n) return;
          const other = a === n ? b : a;
          const dx = other.x - n.x,
            dy = other.y - n.y;
          const d = Math.sqrt(dx * dx + dy * dy) || 1;
          const f = (d - LINK_DIST) * LINK_K;
          n.vx += (dx / d) * f;
          n.vy += (dy / d) * f;
        });

        // center pull
        n.vx += (cxNow - n.x) * CENTER_K;
        n.vy += (cyNow - n.y) * CENTER_K;

        n.vx *= DAMP;
        n.vy *= DAMP;
        n.x += n.vx;
        n.y += n.vy;

        // bounds
        const pad = 40;
        n.x = Math.max(pad, Math.min(state.W - pad, n.x));
        n.y = Math.max(pad, Math.min(state.H - pad, n.y));
      });
    }

    // warm up
    for (let i = 0; i < 300; i++) tick();

    // ── Draw ──
    function draw() {
      const dark = document.documentElement.classList.contains("dark");

      // We leave the canvas transparent here!
      // The body handles the smooth color transition behind the canvas.
      const GREY_NODE = dark ? "#9b9b9b" : "#666";
      const GREY_EDGE = dark ? "rgba(160,158,148,0.25)" : "rgba(80,80,80,0.18)";
      const ACCENT = "#7B68EE";
      const TEXT_COL = dark
        ? "rgba(220,218,210,0.85)"
        : "rgba(30,30,30,0.8)";

      // Clear the canvas to be transparent
      ctx.clearRect(0, 0, state.W, state.H);

      ctx.save();
      ctx.translate(state.tx, state.ty);
      ctx.scale(state.sc, state.sc);

      // highlight sets
      const hlEdgeSet = new Set<string>();
      const hlNodeSet = new Set<string>();
      if (state.hovNode) {
        EDGES.forEach(([a, b]) => {
          if (a === state.hovNode!.id || b === state.hovNode!.id) {
            hlEdgeSet.add(a + "|" + b);
            hlNodeSet.add(a);
            hlNodeSet.add(b);
          }
        });
        hlNodeSet.add(state.hovNode.id);
      }

      // edges
      EDGES.forEach(([ai, bi]) => {
        const a = state.nodes.find((n) => n.id === ai)!;
        const b = state.nodes.find((n) => n.id === bi)!;
        const hl = hlEdgeSet.has(ai + "|" + bi);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        if (hl) {
          ctx.strokeStyle = ACCENT;
          ctx.lineWidth = 1.2 / state.sc;
          ctx.globalAlpha = 0.9;
        } else {
          ctx.strokeStyle = GREY_EDGE;
          ctx.lineWidth = 0.8 / state.sc;
          ctx.globalAlpha = state.hovNode ? 0.18 : 1;
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
      });

      // nodes + labels
      state.nodes.forEach((n) => {
        const isHov = state.hovNode === n;
        const isConn = hlNodeSet.has(n.id);
        const dim = state.hovNode && !isHov && !isConn;

        ctx.globalAlpha = dim ? 0.2 : 1;

        // glow
        if (isHov) {
          const g = ctx.createRadialGradient(
            n.x, n.y, 0,
            n.x, n.y, n.r * 3.5
          );
          g.addColorStop(0, "rgba(123,104,238,0.35)");
          g.addColorStop(1, "rgba(123,104,238,0)");
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = g;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = isHov
          ? ACCENT
          : isConn && state.hovNode
          ? (dark ? "#aaa" : "#555")
          : GREY_NODE;
        ctx.fill();

        // label
        const fs = 12 / state.sc;
        ctx.font = `${fs}px -apple-system, "Segoe UI", sans-serif`;
        ctx.fillStyle = isHov ? (dark ? "#e8e6f0" : "#2a2a2a") : TEXT_COL;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(n.label, n.x, n.y + n.r + 4 / state.sc);

        ctx.globalAlpha = 1;
      });

      ctx.restore();
    }

    // ── Animation loop ──
    function loop() {
      if (state.simActive) tick();
      draw();
      state.animId = requestAnimationFrame(loop);
    }
    loop();

    // stop sim after initial settle
    const settleTimer = setTimeout(() => {
      state.simActive = false;
    }, 4000);

    // ── Events ──
    function evXY(e: MouseEvent | TouchEvent) {
      const r = canvas.getBoundingClientRect();
      if ("touches" in e && e.touches.length) {
        return {
          x: e.touches[0].clientX - r.left,
          y: e.touches[0].clientY - r.top,
        };
      }
      const me = e as MouseEvent;
      return { x: me.clientX - r.left, y: me.clientY - r.top };
    }

    function onMouseMove(e: MouseEvent) {
      const { x, y } = evXY(e);
      if (state.dragNode) {
        const w = toWorld(x, y);
        state.dragNode.fx = w.x;
        state.dragNode.fy = w.y;
        state.dragNode.x = w.x;
        state.dragNode.y = w.y;
        state.simActive = true;
        return;
      }
      const n = getNodeAt(x, y);
      if (n !== state.hovNode) state.hovNode = n;
      canvas.style.cursor = n ? "pointer" : "default";
    }

    function onMouseDown(e: MouseEvent) {
      const { x, y } = evXY(e);
      const n = getNodeAt(x, y);
      if (n) {
        state.dragNode = n;
        n.fx = n.x;
        n.fy = n.y;
        canvas.style.cursor = "grabbing";
      }
    }

    function onMouseUp() {
      if (state.dragNode) {
        state.dragNode.fx = null;
        state.dragNode.fy = null;
        state.dragNode = null;
      }
      state.panning = false;
      canvas.style.cursor = state.hovNode ? "pointer" : "default";
      state.simActive = true;
      setTimeout(() => {
        state.simActive = false;
      }, 3000);
    }

    function onMouseLeave() {
      state.hovNode = null;
      state.panning = false;
      if (state.dragNode) {
        state.dragNode.fx = null;
        state.dragNode.fy = null;
        state.dragNode = null;
      }
    }

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mouseleave", onMouseLeave);

    // ── Resize ──
    function handleResize() {
      state.W = wrap.clientWidth;
      state.H = wrap.clientHeight;
      canvas.width = state.W;
      canvas.height = state.H;
    }

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(wrap);

    return () => {
      clearTimeout(settleTimer);
      cancelAnimationFrame(state.animId);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      resizeObserver.disconnect();
    };
  }, [getTheme]);

  return (
    <section
      id="skills"
      ref={wrapRef}
      className="relative w-full h-screen overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
        style={{ cursor: "default" }}
      />
    </section>
  );
}
