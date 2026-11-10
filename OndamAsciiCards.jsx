import { useEffect, useMemo, useRef } from "react";

// ONDAM AI — 독립형 ASCII 카드 섹션 (React 18+ / Vite)
// 이 파일 하나만 복사해서 사용할 수 있습니다. 외부 CSS 및 추가 라이브러리 불필요.

const CONFIG = [
  {
    id: "discover",
    no: "01",
    title: "Discover",
    kicker: "AI SERVICE INTELLIGENCE",
    headline: "보이지 않는 AI를 발견하다",
    description: "기업 안팎의 AI 서비스를 탐색하고 분석합니다.",
    status: "SCANNING NETWORK",
    stat: "SIGNAL DETECTED",
    color: "#82b9ff",
    rgb: "110,166,255",
  },
  {
    id: "control",
    no: "02",
    title: "Control",
    kicker: "AI POLICY ENGINE",
    headline: "모든 AI 사용을 안전하게 통제하다",
    description: "정책 기반으로 AI 사용과 데이터 흐름을 보호합니다.",
    status: "POLICY ACTIVE",
    stat: "TRAFFIC PROTECTED",
    color: "#b9a0ff",
    rgb: "168,135,255",
  },
  {
    id: "manage",
    no: "03",
    title: "Manage",
    kicker: "AI APP & AGENT",
    headline: "흩어진 AI를 하나로 연결하다",
    description: "AI 앱과 에이전트를 등록하고 통합 운영합니다.",
    status: "SYSTEM CONNECTED",
    stat: "AGENTS ONLINE",
    color: "#7de4e3",
    rgb: "84,211,223",
  },
];

// 고정 시드를 사용하므로 매 렌더링마다 오브젝트가 달라지지 않음.
function makeRandom(seed) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function generatePoints(kind) {
  const random = makeRandom(kind === "discover" ? 11 : kind === "control" ? 23 : 37);
  const points = [];
  const add = (x, y, z, type = 0, group = 0) => points.push({ x, y, z, type, group });

  if (kind === "discover") {
    // 관측 가능한 AI 네트워크: 입체적인 데이터 행성 + 탐색 궤도.
    const count = 1450;
    for (let i = 0; i < count; i++) {
      const y = 1 - (2 * (i + 0.5)) / count;
      const radius = Math.sqrt(1 - y * y);
      const angle = i * Math.PI * (3 - Math.sqrt(5));
      const uneven = 0.86 + 0.035 * Math.sin(angle * 7 + y * 9);
      add(Math.cos(angle) * radius * uneven, y * uneven, Math.sin(angle) * radius * uneven);
    }
    for (let ring = 0; ring < 3; ring++) {
      for (let i = 0; i < 245; i++) {
        const a = (i / 245) * Math.PI * 2;
        const r = 1.10 + ring * 0.115;
        add(r * Math.cos(a), Math.sin(a * 2 + ring) * 0.18, r * Math.sin(a) * 0.54, 1, ring);
      }
    }
    for (let i = 0; i < 110; i++) {
      const a = random() * Math.PI * 2;
      const r = 1.25 + random() * 0.5;
      add(Math.cos(a) * r, (random() - 0.5) * 1.45, Math.sin(a) * r, 2);
    }
  } else if (kind === "control") {
    // 윤곽뿐 아니라 전·후면까지 있는 3D ASCII 실드.
    const shieldWidth = (y) => {
      if (y < -0.55) return 0.86;
      if (y < 0.08) return 0.86 - (y + 0.55) * 0.07;
      return Math.max(0.025, 0.82 * (1 - (y - 0.08) / 0.96));
    };
    for (let i = 0; i < 1500; i++) {
      const y = -0.94 + random() * 1.98;
      const x = (random() * 2 - 1) * shieldWidth(y);
      const z = (random() > 0.4 ? 0.20 : -0.18) + 0.06 * Math.cos(x * 3);
      add(x, y, z, 0);
    }
    for (let i = 0; i < 560; i++) {
      const y = -0.94 + (i / 559) * 1.98;
      const edge = shieldWidth(y);
      add(-edge, y, 0.23, 1);
      add(edge, y, 0.23, 1);
    }
    for (let i = 0; i < 320; i++) {
      const a = (i / 320) * Math.PI * 2;
      add(1.12 * Math.cos(a), 0.26 * Math.sin(a), 0.66 * Math.sin(a), 2);
    }
    for (let i = 0; i < 110; i++) {
      // 정책 엔진을 통과하는 작은 데이터 조각.
      add(random() * 3.2 - 1.6, random() * 1.8 - 0.9, random() * 1.4 - 0.7, 3, i);
    }
  } else {
    // 여러 AI 앱·에이전트가 관리 플랫폼에 모이는 큐브 네트워크.
    let group = 0;
    for (const y of [-0.48, 0.48]) {
      for (const x of [-0.76, 0, 0.76]) {
        for (const z of [-0.38, 0.38]) {
          for (let i = 0; i < 128; i++) {
            const face = Math.floor(random() * 6);
            const a = random() * 2 - 1;
            const b = random() * 2 - 1;
            let px = a, py = b, pz = 0;
            if (face === 0) [px, py, pz] = [1, a, b];
            if (face === 1) [px, py, pz] = [-1, a, b];
            if (face === 2) [px, py, pz] = [a, 1, b];
            if (face === 3) [px, py, pz] = [a, -1, b];
            if (face === 4) [px, py, pz] = [a, b, 1];
            if (face === 5) [px, py, pz] = [a, b, -1];
            add(x + px * 0.275, y + py * 0.275, z + pz * 0.275, face % 3, group);
          }
          group++;
        }
      }
    }
    for (let i = 0; i < 360; i++) {
      const a = (i / 360) * Math.PI * 2;
      add(Math.cos(a) * 1.43, Math.sin(2 * a) * 0.19, Math.sin(a) * 0.74, 3);
    }
  }

  return points;
}

const CHARS = ["·", ".", ":", "+", "=", "*", "#", "%", "@"];

function AsciiCanvas({ type, rgb }) {
  const canvasRef = useRef(null);
  const points = useMemo(() => generatePoints(type), [type]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const parent = canvas.parentElement;
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 1;
    let height = 1;
    let animationId = 0;
    let visible = true;
    let lastFrame = -Infinity;
    let disposed = false;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(0);
    };

    function draw(timeMs) {
      if (width < 10 || height < 10) return;
      const t = timeMs * 0.001;
      pointer.x += (pointer.targetX - pointer.x) * 0.075;
      pointer.y += (pointer.targetY - pointer.y) * 0.075;

      ctx.clearRect(0, 0, width, height);
      const glow = ctx.createRadialGradient(width / 2, height / 2, 8, width / 2, height / 2, height * 0.52);
      glow.addColorStop(0, `rgba(${rgb}, 0.10)`);
      glow.addColorStop(1, `rgba(${rgb}, 0)`);
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      // 오브젝트 주변의 미세한 신호/먼지.
      for (let i = 0; i < 32; i++) {
        const px = ((i * 79 + 23) % 997) / 997 * width;
        const py = ((i * 163 + 67) % 991) / 991 * height;
        const opacity = 0.12 + 0.08 * Math.sin(t * 1.6 + i);
        ctx.fillStyle = `rgba(${rgb},${opacity})`;
        ctx.fillRect(px, py, 1, 1);
      }

      let angle = t * 0.16 + pointer.x * 0.7 + 0.32;
      if (type === "control") angle = 0.16 + Math.sin(t * 0.48) * 0.21 + pointer.x * 0.38;
      const tilt = Math.sin(t * 0.34) * 0.10 + pointer.y * 0.35;
      const cosA = Math.cos(angle), sinA = Math.sin(angle);
      const cosB = Math.cos(tilt), sinB = Math.sin(tilt);
      const scale = Math.min(width * 0.74, height * 0.9);

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

      for (let i = 0; i < points.length; i++) {
        const point = points[i];
        let px = point.x;
        let py = point.y;
        let pz = point.z;

        if (type === "discover") {
          py += Math.sin(t * 0.75 + px * 4) * 0.024;
        } else if (type === "control" && point.type === 3) {
          px = ((px + t * 0.42 + 2) % 3.6) - 1.8;
        } else if (type === "manage" && point.type !== 3) {
          const wave = Math.sin(t * 0.85 + point.group * 1.65);
          px += Math.cos(point.group * 2.3) * 0.055 * wave;
          py += Math.sin(point.group * 1.7) * 0.055 * wave;
        }

        const rotatedX = px * cosA + pz * sinA;
        const rotatedZ = -px * sinA + pz * cosA;
        const rotatedY = py * cosB - rotatedZ * sinB;
        const depth = py * sinB + rotatedZ * cosB;
        const projection = 3.1 / (3.9 - depth);
        const x = width * 0.5 + rotatedX * scale * projection * 0.56;
        const y = height * 0.49 + rotatedY * scale * projection * 0.55;
        if (x < 5 || x > width - 5 || y < 5 || y > height - 5) continue;

        const light = Math.max(0.05, Math.min(1, (depth + 1.45) / 2.9));
        const shimmer = Math.sin(t * 1.8 + i * 0.12) * 0.09;
        const glyphIndex = Math.max(0, Math.min(CHARS.length - 1, Math.floor((light + shimmer) * CHARS.length)));
        const alpha = (0.24 + light * 0.72) * (point.type === 3 ? 0.55 : point.type === 1 ? 0.82 : 1);
        ctx.fillStyle = `rgba(${rgb},${alpha})`;
        ctx.fillText(CHARS[glyphIndex], x, y);
      }

      // 탐색 스캔 포인트.
      if (type === "discover") {
        const a = t * 0.8;
        ctx.font = "bold 14px ui-monospace, monospace";
        ctx.fillStyle = "rgba(210,233,255,.85)";
        ctx.fillText("+", width / 2 + Math.cos(a) * scale * .52, height / 2 + Math.sin(a) * scale * .38);
      }
    }

    const loop = (time) => {
      if (disposed) return;
      animationId = window.requestAnimationFrame(loop);
      if (!visible || document.hidden || reducedMotion) return;
      if (time - lastFrame < 42) return; // 약 24fps로 제한하여 CPU 부담 감소
      lastFrame = time;
      draw(time);
    };

    const move = (event) => {
      const rect = canvas.getBoundingClientRect();
      pointer.targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 1.5;
      pointer.targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 1.1;
    };
    const leave = () => {
      pointer.targetX = 0;
      pointer.targetY = 0;
    };

    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerleave", leave);
    const observer = new ResizeObserver(resize);
    observer.observe(parent);
    const viewObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    }, { threshold: 0.05 });
    viewObserver.observe(canvas);
    resize();
    if (!reducedMotion) animationId = window.requestAnimationFrame(loop);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(animationId);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerleave", leave);
      observer.disconnect();
      viewObserver.disconnect();
    };
  }, [points, rgb, type]);

  return <canvas ref={canvasRef} className="ascii-canvas" aria-hidden="true" />;
}

function IdentityCard({ item }) {
  return (
    <article
      className={`identity-card identity-card--${item.id}`}
      style={{ "--card-accent": item.color, "--card-rgb": item.rgb }}
    >
      <div className="identity-card__top">
        <span>{item.no} / {item.title.toUpperCase()}</span>
        <span className="identity-card__plus" aria-hidden="true">✳</span>
      </div>
      <div className="identity-card__visual">
        <div className="visual-grid" aria-hidden="true" />
        <AsciiCanvas type={item.id} rgb={item.rgb} />
        <span className="visual-cross visual-cross--tl" aria-hidden="true">+</span>
        <span className="visual-cross visual-cross--br" aria-hidden="true">+</span>
        <div className="visual-bottom">
          <span><i className="tiny-dot" /> {item.status}</span>
          <span className="visual-bottom__code">{item.no}:ACTIVE</span>
        </div>
      </div>
      <div className="identity-card__content">
        <div className="identity-card__kicker">{item.kicker}</div>
        <div className="identity-card__name">
          <h3>{item.title}</h3>
          <span aria-hidden="true">↗</span>
        </div>
        <h4>{item.headline}</h4>
        <p>{item.description}</p>
      </div>
      <div className="identity-card__footer">
        <span>{item.stat}</span>
        <span className="footer-equalizer" aria-hidden="true"><i /><i /><i /><i /><i /></span>
      </div>
    </article>
  );
}

/**
 * 붙여 넣기:
 *   import OndamAsciiCards from "./components/OndamAsciiCards";
 *   <OndamAsciiCards />
 *
 * 옵션:
 *   <OndamAsciiCards showHeading={false} className="my-section" />
 */
export default function OndamAsciiCards({ showHeading = true, className = "" }) {
  return (
    <section className={`ondam-ascii-section ${className}`.trim()} aria-label="온담AI 핵심 솔루션">
      <div className="ondam-ascii-container">
        {showHeading && (
          <header className="ondam-ascii-heading">
            <div className="heading-eyebrow"><span className="heading-line" /> ONE PLATFORM, THREE INTELLIGENCES</div>
            <h2>기업의 모든 AI를, <em>온전히 담다.</em></h2>
            <p>발견하고, 통제하고, 관리하다. 기업을 위한 새로운 AI 운영의 기준.</p>
          </header>
        )}
        <div className="identity-grid">
          {CONFIG.map((item) => <IdentityCard key={item.id} item={item} />)}
        </div>
        <div className="ondam-ascii-caption">
          <span>DISCOVER / CONTROL / MANAGE</span>
          <span>MOVE YOUR CURSOR TO INTERACT</span>
        </div>
      </div>
      <style>{STYLES}</style>
    </section>
  );
}

const STYLES = `
.ondam-ascii-section {
  width: 100%;
  padding: 74px 24px 70px;
  background: #080d18;
  color: #eff4ff;
  font-family: Inter, Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  -webkit-font-smoothing: antialiased;
}
.ondam-ascii-section *, .ondam-ascii-section *::before, .ondam-ascii-section *::after { box-sizing: border-box; }
.ondam-ascii-section .ondam-ascii-container { max-width: 1320px; margin: 0 auto; }
.ondam-ascii-section .ondam-ascii-heading { padding: 0 0 42px; }
.ondam-ascii-section .heading-eyebrow { color: #91b6ff; font: 11px ui-monospace, monospace; letter-spacing: 1.7px; display: flex; align-items: center; gap: 10px; }
.ondam-ascii-section .heading-line { width: 24px; height: 1px; background: #6098ff; }
.ondam-ascii-section .ondam-ascii-heading h2 { margin: 22px 0 18px; font-size: clamp(31px, 4.6vw, 58px); line-height: 1.21; font-weight: 680; letter-spacing: -.065em; }
.ondam-ascii-section .ondam-ascii-heading h2 em { color: #8fb3ff; font-style: normal; }
.ondam-ascii-section .ondam-ascii-heading p { color: #93a3be; font-size: 15px; line-height: 1.8; margin: 0; letter-spacing: -.025em; }
.ondam-ascii-section .identity-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 15px; }
.ondam-ascii-section .identity-card { min-width: 0; overflow: hidden; position: relative; border: 1px solid #26334b; border-radius: 15px; background: linear-gradient(158deg, #131e34 0%, #0c1425 67%, #101729 100%); transition: border-color .32s ease, transform .32s ease, box-shadow .32s ease; }
.ondam-ascii-section .identity-card:hover { transform: translateY(-7px); border-color: var(--card-accent); box-shadow: 0 22px 55px #0007, 0 0 26px rgba(var(--card-rgb), .10); }
.ondam-ascii-section .identity-card__top { padding: 21px 22px 0; position: relative; z-index: 1; display: flex; justify-content: space-between; align-items: center; color: #8b9bb6; font: 11px ui-monospace, monospace; letter-spacing: 1px; }
.ondam-ascii-section .identity-card__plus { font-size: 17px; color: var(--card-accent); }
.ondam-ascii-section .identity-card__visual { height: 310px; position: relative; overflow: hidden; isolation: isolate; background: radial-gradient(ellipse at 50% 45%, rgba(var(--card-rgb), .14) 0%, transparent 65%); }
.ondam-ascii-section .visual-grid { position: absolute; inset: 10px 10px 5px; background-image: linear-gradient(to right, #8aa0cf0c 1px, transparent 1px), linear-gradient(to bottom, #8aa0cf0c 1px, transparent 1px); background-size: 30px 30px; mask-image: radial-gradient(ellipse, black, transparent 78%); pointer-events: none; }
.ondam-ascii-section .ascii-canvas { position: relative; display: block; width: 100%; height: 100%; cursor: crosshair; }
.ondam-ascii-section .visual-cross { position: absolute; color: #667da1; font: 14px ui-monospace, monospace; pointer-events: none; }
.ondam-ascii-section .visual-cross--tl { left: 23px; top: 20px; }
.ondam-ascii-section .visual-cross--br { right: 23px; bottom: 40px; }
.ondam-ascii-section .visual-bottom { position: absolute; left: 22px; right: 22px; bottom: 12px; display: flex; justify-content: space-between; gap: 10px; font: 10px ui-monospace, monospace; letter-spacing: .25px; color: #8c9cba; pointer-events: none; }
.ondam-ascii-section .tiny-dot { display: inline-block; width: 5px; height: 5px; border-radius: 50%; background: var(--card-accent); box-shadow: 0 0 10px var(--card-accent); vertical-align: 2px; margin-right: 5px; animation: ondam-ascii-light-pulse 1.8s ease-in-out infinite; }
.ondam-ascii-section .visual-bottom__code { color: #647493; }
.ondam-ascii-section .identity-card__content { border-top: 1px solid #26334b; padding: 25px 25px 28px; }
.ondam-ascii-section .identity-card__kicker { font: 10px ui-monospace, monospace; letter-spacing: 1px; color: var(--card-accent); margin-bottom: 11px; }
.ondam-ascii-section .identity-card__name { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
.ondam-ascii-section .identity-card__name h3 { font-size: clamp(30px, 3vw, 41px); letter-spacing: -.06em; line-height: 1.1; font-weight: 650; margin: 0; }
.ondam-ascii-section .identity-card__name > span { font-size: 23px; color: #7794bc; transition: transform .3s ease, color .3s ease; }
.ondam-ascii-section .identity-card:hover .identity-card__name > span { color: var(--card-accent); transform: translate(3px, -3px); }
.ondam-ascii-section .identity-card__content h4 { font-size: 15px; letter-spacing: -.045em; margin: 0 0 10px; line-height: 1.5; font-weight: 630; }
.ondam-ascii-section .identity-card__content p { margin: 0; min-height: 36px; font-size: 12px; line-height: 1.75; color: #8c9fbd; letter-spacing: -.015em; }
.ondam-ascii-section .identity-card__footer { border-top: 1px solid #25314a; height: 45px; padding: 0 23px; display: flex; justify-content: space-between; align-items: center; font: 9px ui-monospace, monospace; color: #697f9f; letter-spacing: .6px; }
.ondam-ascii-section .footer-equalizer { display: flex; height: 12px; align-items: center; gap: 3px; }
.ondam-ascii-section .footer-equalizer i { display: block; width: 2px; height: 5px; background: var(--card-accent); opacity: .7; animation: ondam-ascii-eq .9s ease-in-out infinite alternate; }
.ondam-ascii-section .footer-equalizer i:nth-child(2) { animation-delay: -.4s; }
.ondam-ascii-section .footer-equalizer i:nth-child(3) { animation-delay: -.7s; }
.ondam-ascii-section .footer-equalizer i:nth-child(4) { animation-delay: -.2s; }
.ondam-ascii-section .footer-equalizer i:nth-child(5) { animation-delay: -.6s; }
.ondam-ascii-section .ondam-ascii-caption { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 18px; padding-top: 27px; color: #667893; font: 10px ui-monospace, monospace; letter-spacing: .55px; }
@keyframes ondam-ascii-light-pulse { 50% { opacity: .3; } }
@keyframes ondam-ascii-eq { to { height: 12px; opacity: 1; } }
@media (max-width: 1000px) {
  .ondam-ascii-section .identity-grid { gap: 10px; }
  .ondam-ascii-section .identity-card__top { padding: 17px 14px 0; font-size: 9px; }
  .ondam-ascii-section .identity-card__visual { height: 235px; }
  .ondam-ascii-section .identity-card__content { padding: 20px 15px 24px; }
  .ondam-ascii-section .identity-card__content h4 { font-size: 13px; }
  .ondam-ascii-section .identity-card__content p { font-size: 11px; }
  .ondam-ascii-section .identity-card__footer { padding: 0 15px; }
}
@media (max-width: 700px) {
  .ondam-ascii-section { padding: 55px 17px 45px; }
  .ondam-ascii-section .ondam-ascii-heading { padding-bottom: 33px; }
  .ondam-ascii-section .ondam-ascii-heading h2 { font-size: clamp(30px, 7.2vw, 45px); }
  .ondam-ascii-section .ondam-ascii-heading p { font-size: 13px; }
  .ondam-ascii-section .identity-grid { grid-template-columns: 1fr; gap: 15px; }
  .ondam-ascii-section .identity-card__visual { height: 290px; }
  .ondam-ascii-section .identity-card__top { padding: 21px 22px 0; font-size: 11px; }
  .ondam-ascii-section .identity-card__content { padding: 23px 23px 26px; }
  .ondam-ascii-section .identity-card__content h4 { font-size: 15px; }
  .ondam-ascii-section .identity-card__content p { font-size: 12px; min-height: 0; }
  .ondam-ascii-section .identity-card__footer { padding: 0 23px; }
}
@media (prefers-reduced-motion: reduce) {
  .ondam-ascii-section *, .ondam-ascii-section *::before, .ondam-ascii-section *::after { animation: none !important; transition: none !important; }
}
`;
