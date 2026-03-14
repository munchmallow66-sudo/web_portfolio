"use client";

import { useEffect, useRef, useCallback } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  glowColor: string;
  opacity: number;
  pulseSpeed: number;
  pulsePhase: number;
}

const COLORS = [
  { color: "rgba(99, 102, 241, ", glow: "rgba(99, 102, 241, " },     // Indigo
  { color: "rgba(139, 92, 246, ", glow: "rgba(139, 92, 246, " },     // Violet
  { color: "rgba(59, 130, 246, ", glow: "rgba(59, 130, 246, " },     // Blue
  { color: "rgba(6, 182, 212, ", glow: "rgba(6, 182, 212, " },      // Cyan
  { color: "rgba(168, 85, 247, ", glow: "rgba(168, 85, 247, " },    // Purple
];

const PARTICLE_COUNT = 50;
const CONNECTION_DISTANCE = 150;
const MOUSE_RADIUS = 200;

export function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const dimensionsRef = useRef({ width: 0, height: 0 });
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const createParticle = useCallback((width: number, height: number): Particle => {
    const colorSet = COLORS[Math.floor(Math.random() * COLORS.length)];
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1,
      color: colorSet.color,
      glowColor: colorSet.glow,
      opacity: Math.random() * 0.5 + 0.3,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      pulsePhase: Math.random() * Math.PI * 2,
    };
  }, []);

  const initParticles = useCallback((width: number, height: number) => {
    particlesRef.current = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particlesRef.current.push(createParticle(width, height));
    }
  }, [createParticle]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);

      dimensionsRef.current = { width: rect.width, height: rect.height };

      if (particlesRef.current.length === 0) {
        initParticles(rect.width, rect.height);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    handleResize();

    let time = 0;

    const animate = () => {
      const { width, height } = dimensionsRef.current;
      if (!width || !height) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      time += 1;

      // Clear with fade trail effect - transparent for theme compatibility
      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      // Update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Pulse opacity
        p.pulsePhase += p.pulseSpeed;
        const pulseFactor = Math.sin(p.pulsePhase) * 0.3 + 0.7;

        // Mouse attraction/repulsion
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * 0.02;
          p.vx += dx / dist * force;
          p.vy += dy / dist * force;
        }

        // Apply velocity with damping
        p.vx *= 0.99;
        p.vy *= 0.99;
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Draw particle glow
        const glowRadius = p.radius * 6 * pulseFactor;
        const gradient = ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, glowRadius
        );
        gradient.addColorStop(0, `${p.glowColor}${(p.opacity * pulseFactor * 0.6).toFixed(2)})`);
        gradient.addColorStop(0.5, `${p.glowColor}${(p.opacity * pulseFactor * 0.15).toFixed(2)})`);
        gradient.addColorStop(1, `${p.glowColor}0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw particle core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * pulseFactor, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${(p.opacity * pulseFactor).toFixed(2)})`;
        ctx.fill();
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DISTANCE) {
            const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.25;

            // Create gradient line
            const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
            grad.addColorStop(0, `${a.color}${opacity.toFixed(3)})`);
            grad.addColorStop(1, `${b.color}${opacity.toFixed(3)})`);

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 0.5;
            ctx.stroke();

            // Brighter lines near mouse
            const midX = (a.x + b.x) / 2;
            const midY = (a.y + b.y) / 2;
            const mouseDist = Math.sqrt(
              (mouse.x - midX) ** 2 + (mouse.y - midY) ** 2
            );

            if (mouseDist < MOUSE_RADIUS) {
              const mouseOpacity = (1 - mouseDist / MOUSE_RADIUS) * 0.4 * opacity * 3;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.strokeStyle = `rgba(139, 92, 246, ${mouseOpacity.toFixed(3)})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        }
      }

      // Draw ambient nebula clouds (very subtle)
      const nebulaTime = time * 0.001;
      for (let i = 0; i < 3; i++) {
        const nx = width * (0.3 + 0.4 * Math.sin(nebulaTime + i * 2));
        const ny = height * (0.3 + 0.4 * Math.cos(nebulaTime * 0.7 + i * 1.5));
        const nRadius = Math.min(width, height) * 0.3;
        const nebulaGrad = ctx.createRadialGradient(nx, ny, 0, nx, ny, nRadius);
        const nebulaColors = [
          "rgba(99, 102, 241, 0.015)",
          "rgba(139, 92, 246, 0.015)",
          "rgba(6, 182, 212, 0.015)",
        ];
        nebulaGrad.addColorStop(0, nebulaColors[i]);
        nebulaGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.beginPath();
        ctx.arc(nx, ny, nRadius, 0, Math.PI * 2);
        ctx.fillStyle = nebulaGrad;
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener("resize", handleResize);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
    />
  );
}
