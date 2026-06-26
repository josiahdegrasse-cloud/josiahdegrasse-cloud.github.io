import { useEffect, useRef } from "react";

type Obstacle = { x: number; y: number; kind: "tree" | "rock" | "flake" };

const BEST_KEY = "josiah-snowboard-best";

/**
 * A hidden downhill arcade game — triggered by grabbing the bedroom snowboard. Pure 2D canvas,
 * fully self-contained: steer with A/D or arrows, avoid trees and rocks, grab snowflakes for
 * bonus distance. Esc or Q exits back to the bedroom.
 */
export function SnowboardGame({ onExit }: { onExit: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    const keys = new Set<string>();
    let best = Number(localStorage.getItem(BEST_KEY) || 0);
    let raf = 0;
    let last = performance.now();

    let px = 0.5;
    let vx = 0;
    let dist = 0;
    let speed = 340;
    let scroll = 0;
    let gameOver = false;
    let obstacles: Obstacle[] = [];
    let spawnTimer = 0;
    let keepsakeAwarded = false;
    const flakes = Array.from({ length: 60 }, () => ({ x: Math.random(), y: Math.random(), s: 0.4 + Math.random() }));

    const reset = () => {
      px = 0.5; vx = 0; dist = 0; speed = 340; gameOver = false; obstacles = []; spawnTimer = 0;
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.code === "Escape" || event.code === "KeyQ") { onExit(); return; }
      if (gameOver && (event.code === "Space" || event.code === "Enter")) { reset(); return; }
      keys.add(event.code);
    };
    const onKeyUp = (event: KeyboardEvent) => keys.delete(event.code);
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKeyUp);

    const drawBoarder = (x: number, y: number, lean: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(lean * 0.5);
      // board
      ctx.fillStyle = "#f6c83f";
      ctx.beginPath();
      ctx.ellipse(0, 26, 34, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      // body
      ctx.fillStyle = "#d82f24";
      ctx.fillRect(-11, -10, 22, 34);
      // head
      ctx.fillStyle = "#fff9e9";
      ctx.beginPath();
      ctx.arc(0, -20, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const draw = () => {
      // slope gradient
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, "#cfe6f7");
      sky.addColorStop(0.5, "#eef6fc");
      sky.addColorStop(1, "#ffffff");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // scrolling slope guide stripes for a sense of speed
      ctx.strokeStyle = "rgba(140,170,200,0.25)";
      ctx.lineWidth = 2;
      const gap = 90;
      for (let i = -1; i < h / gap + 1; i += 1) {
        const y = ((i * gap + scroll * 0.4) % (h + gap)) - gap;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y + 30);
        ctx.stroke();
      }

      // drifting snow
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      for (const f of flakes) {
        const fy = (f.y + (scroll / h) * f.s * 0.6) % 1;
        ctx.beginPath();
        ctx.arc(f.x * w, fy * h, f.s * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // obstacles
      for (const o of obstacles) {
        const ox = o.x * w;
        const oy = o.y * h;
        if (o.kind === "tree") {
          ctx.fillStyle = "#5b321f";
          ctx.fillRect(ox - 5, oy + 6, 10, 18);
          ctx.fillStyle = "#174f3a";
          ctx.beginPath();
          ctx.moveTo(ox, oy - 28);
          ctx.lineTo(ox - 24, oy + 10);
          ctx.lineTo(ox + 24, oy + 10);
          ctx.closePath();
          ctx.fill();
        } else if (o.kind === "rock") {
          ctx.fillStyle = "#667278";
          ctx.beginPath();
          ctx.ellipse(ox, oy, 22, 15, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = "#3e8ede";
          ctx.beginPath();
          ctx.arc(ox, oy, 9, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      drawBoarder(px * w, h * 0.82, vx);

      // HUD
      ctx.fillStyle = "#17130f";
      ctx.font = "700 28px Arial, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`${Math.floor(dist)} m`, 28, 46);
      ctx.font = "600 16px Arial, sans-serif";
      ctx.fillStyle = "rgba(23,19,15,0.65)";
      ctx.fillText(`best ${best} m   ·   A/D or ←/→ to steer   ·   grab the blue flakes   ·   Esc to exit`, 28, 72);

      if (gameOver) {
        ctx.fillStyle = "rgba(8,6,4,0.55)";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#fff9e9";
        ctx.textAlign = "center";
        ctx.font = "900 56px Arial, sans-serif";
        ctx.fillText("WIPEOUT", w / 2, h / 2 - 20);
        ctx.font = "600 24px Arial, sans-serif";
        ctx.fillText(`${Math.floor(dist)} m  ·  best ${best} m`, w / 2, h / 2 + 24);
        ctx.font = "600 18px Arial, sans-serif";
        ctx.fillText("Space to ride again   ·   Esc to head back inside", w / 2, h / 2 + 60);
      }
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;

      if (!gameOver) {
        const dir = (keys.has("ArrowRight") || keys.has("KeyD") ? 1 : 0) - (keys.has("ArrowLeft") || keys.has("KeyA") ? 1 : 0);
        vx += dir * 2.4 * dt;
        vx *= 0.86;
        px = Math.min(0.93, Math.max(0.07, px + vx * dt));
        dist += (speed * dt) / 50;
        if (dist >= 250 && !keepsakeAwarded) {
          keepsakeAwarded = true;
          window.dispatchEvent(new CustomEvent("portfolio-keepsake", { detail: "snow-line" }));
        }
        speed = Math.min(760, speed + dt * 9);
        scroll += speed * dt;

        spawnTimer -= dt;
        if (spawnTimer <= 0) {
          spawnTimer = Math.max(0.22, 0.72 - speed / 2200);
          const roll = Math.random();
          const kind: Obstacle["kind"] = roll < 0.18 ? "flake" : roll < 0.74 ? "tree" : "rock";
          obstacles.push({ x: 0.07 + Math.random() * 0.86, y: -0.08, kind });
        }
        const pxPx = px * w;
        const pyPx = h * 0.82;
        for (const o of obstacles) {
          o.y += (speed * dt) / h;
          const ox = o.x * w;
          const oy = o.y * h;
          if (Math.abs(ox - pxPx) < (o.kind === "flake" ? 30 : 30) && Math.abs(oy - pyPx) < 28) {
            if (o.kind === "flake") {
              o.y = 2;
              dist += 6;
            } else {
              gameOver = true;
              best = Math.max(best, Math.floor(dist));
              localStorage.setItem(BEST_KEY, String(best));
            }
          }
        }
        obstacles = obstacles.filter((o) => o.y < 1.15);
      }

      draw();
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [onExit]);

  return (
    <div className="pq4-snow" role="dialog" aria-label="Hidden snowboard game">
      <canvas ref={canvasRef} />
      <button type="button" className="pq4-snow-exit" onClick={onExit}>Exit ✕</button>
    </div>
  );
}
