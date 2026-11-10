import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { motion as Motion, useReducedMotion } from 'motion/react';

// Adapted from the supplied OndamAsciiCards.jsx for the four solution detail links.

const CONFIG = [
  {
    id: 'discover',
    title: 'Discover',
    description: '기업 안팎의 AI 서비스를 탐색하고 분석합니다.',
    color: '#0b5cff',
    rgb: '11,92,255',
  },
  {
    id: 'control-internal',
    title: 'Control Internal',
    description: '사내 AI 사용 환경부터 연동과 사용 이력까지 통합 관리합니다.',
    color: '#0b5cff',
    rgb: '37,99,235',
  },
  {
    id: 'control-external',
    title: 'Control External',
    description: '외부 AI 사용에 기업의 정책을 적용하고 데이터를 보호합니다.',
    color: '#0b5cff',
    rgb: '14,116,218',
  },
  {
    id: 'manage',
    title: 'Manage',
    description: 'AI 앱과 에이전트를 등록하고 통합 운영합니다.',
    color: '#0b5cff',
    rgb: '42,105,225',
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
  const seeds = { discover: 11, 'control-internal': 23, 'control-external': 31, manage: 37 };
  const random = makeRandom(seeds[kind]);
  const points = [];
  const add = (x, y, z, type = 0, group = 0, style) =>
    points.push({ x, y, z, type, group, ...style });
  const line = (from, to, type = 1, style) => {
    const steps = Math.max(
      2,
      Math.ceil(Math.hypot(...to.map((value, i) => value - from[i])) / 0.04)
    );
    for (let i = 0; i <= steps; i++) {
      const u = i / steps;
      add(...from.map((value, axis) => value + (to[axis] - value) * u), type, 0, style);
    }
  };
  const flow = (from, to, count, blocked = false) => {
    for (let i = 0; i < count; i++) {
      points.push({ x: 0, y: 0, z: 0, type: 4, from, to, phase: i / count, blocked });
    }
  };
  const roundedRect = (cx, cy, halfWidth, halfHeight, radius, z, style) => {
    line(
      [cx - halfWidth + radius, cy - halfHeight, z],
      [cx + halfWidth - radius, cy - halfHeight, z],
      1,
      style
    );
    line(
      [cx + halfWidth, cy - halfHeight + radius, z],
      [cx + halfWidth, cy + halfHeight - radius, z],
      1,
      style
    );
    line(
      [cx + halfWidth - radius, cy + halfHeight, z],
      [cx - halfWidth + radius, cy + halfHeight, z],
      1,
      style
    );
    line(
      [cx - halfWidth, cy + halfHeight - radius, z],
      [cx - halfWidth, cy - halfHeight + radius, z],
      1,
      style
    );
    for (let corner = 0; corner < 4; corner++) {
      const centerX = cx + (corner < 2 ? 1 : -1) * (halfWidth - radius);
      const centerY = cy + (corner === 0 || corner === 3 ? -1 : 1) * (halfHeight - radius);
      for (let i = 0; i <= 7; i++) {
        const angle = -Math.PI / 2 + (corner * Math.PI) / 2 + ((i / 7) * Math.PI) / 2;
        add(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius, z, 1, 0, style);
      }
    }
  };

  if (kind === 'discover') {
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
        const r = 1.1 + ring * 0.115;
        add(r * Math.cos(a), Math.sin(a * 2 + ring) * 0.18, r * Math.sin(a) * 0.54, 1, ring);
      }
    }
    for (let i = 0; i < 110; i++) {
      const a = random() * Math.PI * 2;
      const r = 1.25 + random() * 0.5;
      add(Math.cos(a) * r, (random() - 0.5) * 1.45, Math.sin(a) * r, 2);
    }
  } else if (kind === 'control-internal') {
    // Three server chassis, front drive slots and status lights on a plinth.
    const outline = { glyph: '+', opacity: 0.85 };
    const frontNormal = [0, 0, 1];
    for (const y of [-0.6, -0.08, 0.44]) {
      for (let row = -4; row <= 4; row++) {
        for (let col = -20; col <= 20; col++) {
          for (const side of [-1, 1]) {
            add(col * 0.03, y + row * 0.03, side * 0.36, 0, 0, {
              opacity: side === 1 ? 0.6 : 0.5,
              normal: [0, 0, side],
            });
          }
        }
        for (let depth = -10; depth <= 10; depth++) {
          for (const side of [-1, 1]) {
            add(side * 0.68, y + row * 0.025, depth * 0.03, 0, 0, {
              opacity: 0.5,
              normal: [side, 0, 0],
            });
          }
        }
      }
      for (let col = -20; col <= 20; col++) {
        for (let depth = -10; depth <= 10; depth++) {
          add(col * 0.03, y - 0.19, depth * 0.03, 0, 0, {
            opacity: 0.45,
            normal: [0, -1, 0],
          });
        }
      }
      for (const z of [-0.36, 0.36]) roundedRect(0, y, 0.68, 0.19, 0.08, z, outline);
      for (const side of [-1, 1]) {
        for (const dy of [-0.11, 0.11])
          line([side * 0.68, y + dy, -0.36], [side * 0.68, y + dy, 0.36], 1, outline);
        line([side * 0.6, y - 0.19, -0.36], [side * 0.6, y - 0.19, 0.36], 1, outline);
        line([side * 0.6, y + 0.19, -0.36], [side * 0.6, y + 0.19, 0.36], 1, outline);
      }
      roundedRect(-0.22, y, 0.24, 0.04, 0.025, 0.39, {
        glyph: '=',
        opacity: 0.95,
        normal: frontNormal,
      });
      for (let i = 0; i < 28; i++) {
        const angle = (i / 28) * Math.PI * 2;
        add(0.43 + Math.cos(angle) * 0.065, y + Math.sin(angle) * 0.065, 0.39, 1, 0, {
          glyph: '·',
          opacity: 1,
          normal: frontNormal,
        });
      }
      add(0.43, y, 0.4, 0, 0, { glyph: '@', opacity: 0.8, normal: frontNormal });
    }
    for (const z of [-0.46, 0.46]) roundedRect(0, 0.82, 0.8, 0.065, 0.04, z, outline);
    for (const x of [-0.76, 0.76]) line([x, 0.755, -0.46], [x, 0.755, 0.46], 1, outline);
    for (let col = -14; col <= 14; col++) {
      for (let depth = -8; depth <= 8; depth++) {
        add(col * 0.05, 0.755, depth * 0.05, 0, 0, { opacity: 0.45, normal: [0, -1, 0] });
      }
    }
  } else if (kind === 'control-external') {
    // An inspection gateway filters the traffic crossing the enterprise boundary.
    for (let ring = 0; ring < 168; ring++) {
      const angle = (ring / 168) * Math.PI * 2;
      for (let tube = 0; tube < 7; tube++) {
        const around = (tube / 7) * Math.PI * 2;
        add(
          Math.sin(around) * 0.09,
          Math.cos(angle) * (0.9 + Math.cos(around) * 0.065),
          Math.sin(angle) * (0.7 + Math.cos(around) * 0.065)
        );
      }
    }
    for (let row = -7; row <= 7; row++) {
      for (let col = -5; col <= 5; col++) {
        const y = row * 0.1;
        const z = col * 0.1;
        if ((y / 0.9) ** 2 + (z / 0.7) ** 2 < 0.85) add(0, y, z, 2);
      }
    }
    for (let i = 0; i < 42; i++) add(0.04, 0, -0.64 + (i / 41) * 1.28, 5);
    for (const y of [-0.38, 0, 0.38]) {
      const from = [-1.5, y, 0];
      const to = [1.5, y, 0];
      line(from, to, 2);
      flow(from, to, 18);
    }
    flow([-1.5, 0.65, 0.08], [-0.12, 0.65, 0.08], 10, true);
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
            let px = a,
              py = b,
              pz = 0;
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

const CHARS = ['·', '.', ':', '+', '=', '*', '#', '%', '@'];

function AsciiCanvas({ type, rgb }) {
  const canvasRef = useRef(null);
  const points = useMemo(() => generatePoints(type), [type]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const parent = canvas.parentElement;
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reducedMotion = motionPreference.matches;
    let width = 1;
    let height = 1;
    let animationId = 0;
    let visible = false;
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
      const glow = ctx.createRadialGradient(
        width / 2,
        height / 2,
        8,
        width / 2,
        height / 2,
        height * 0.52
      );
      glow.addColorStop(0, `rgba(${rgb}, 0.10)`);
      glow.addColorStop(1, `rgba(${rgb}, 0)`);
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      // 오브젝트 주변의 미세한 신호/먼지.
      for (let i = 0; i < 32; i++) {
        const px = (((i * 79 + 23) % 997) / 997) * width;
        const py = (((i * 163 + 67) % 991) / 991) * height;
        const opacity = 0.12 + 0.08 * Math.sin(t * 1.6 + i);
        ctx.fillStyle = `rgba(${rgb},${opacity})`;
        ctx.fillRect(px, py, 1, 1);
      }

      let angle = t * 0.16 + pointer.x * 0.7 + 0.32;
      if (type === 'control-internal') angle = t * 0.16 + pointer.x * 0.7 - 0.45;
      if (type === 'control-external') angle = 0.75 + Math.sin(t * 0.3) * 0.12 + pointer.x * 0.3;
      const tilt =
        type === 'control-internal'
          ? -0.22 + Math.sin(t * 0.3) * 0.04 + pointer.y * 0.15
          : Math.sin(t * 0.34) * 0.1 + pointer.y * 0.35;
      const cosA = Math.cos(angle),
        sinA = Math.sin(angle);
      const cosB = Math.cos(tilt),
        sinB = Math.sin(tilt);
      const scale = Math.min(width * 0.82, height * 0.78);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

      for (let i = 0; i < points.length; i++) {
        const point = points[i];
        let px = point.x;
        let py = point.y;
        let pz = point.z;
        let glyph = point.glyph ?? null;

        if (type === 'discover') {
          py += Math.sin(t * 0.75 + px * 4) * 0.024;
        } else if (type === 'manage' && point.type !== 3) {
          const wave = Math.sin(t * 0.85 + point.group * 1.65);
          px += Math.cos(point.group * 2.3) * 0.055 * wave;
          py += Math.sin(point.group * 1.7) * 0.055 * wave;
        }
        if (point.from) {
          const phase = (t * 0.22 + point.phase) % 1;
          const u = point.blocked ? 1 - Math.abs(1 - phase * 2) : phase;
          [px, py, pz] = point.from.map((value, axis) => value + (point.to[axis] - value) * u);
          glyph =
            point.blocked && u > 0.9 ? 'X' : type === 'control-external' && px > 0.1 ? '>' : '+';
        } else if (point.type === 5) {
          py = Math.sin(t * 0.8) * 0.72;
          pz *= Math.sqrt(1 - (py / 0.9) ** 2);
          glyph = '=';
        }

        const rotatedX = px * cosA + pz * sinA;
        const rotatedZ = -px * sinA + pz * cosA;
        const rotatedY = py * cosB - rotatedZ * sinB;
        const depth = py * sinB + rotatedZ * cosB;
        if (point.normal) {
          const [nx, ny, nz] = point.normal;
          const normalX = nx * cosA + nz * sinA;
          const normalZ = -nx * sinA + nz * cosA;
          const normalY = ny * cosB - normalZ * sinB;
          const normalDepth = ny * sinB + normalZ * cosB;
          if (-normalX * rotatedX - normalY * rotatedY + normalDepth * (3.9 - depth) <= 0) continue;
        }
        if (type === 'discover' && point.type === 1 && depth < 0) {
          // Preserve the front arc; mask the rear arc behind the sphere's silhouette.
          const dz = depth - 3.9;
          const rayLengthSquared = rotatedX ** 2 + rotatedY ** 2 + dz ** 2;
          const cameraDotRay = 3.9 * dz;
          const discriminant = cameraDotRay ** 2 - rayLengthSquared * (3.9 ** 2 - 0.9 ** 2);
          if (discriminant > 0) {
            const hit = (-cameraDotRay - Math.sqrt(discriminant)) / rayLengthSquared;
            if (hit > 0 && hit < 1) continue;
          }
        }
        const projection = 3.1 / (3.9 - depth);
        const x = width * 0.5 + rotatedX * scale * projection * 0.56;
        const y = height * 0.5 + rotatedY * scale * projection * 0.55;
        if (x < 5 || x > width - 5 || y < 5 || y > height - 5) continue;

        const light = Math.max(0.05, Math.min(1, (depth + 1.45) / 2.9));
        const shimmer = Math.sin(t * 1.8 + i * 0.12) * 0.09;
        const glyphIndex = Math.max(
          0,
          Math.min(CHARS.length - 1, Math.floor((light + shimmer) * CHARS.length))
        );
        const alpha =
          point.opacity ??
          (glyph
            ? 0.9
            : (0.24 + light * 0.72) * (point.type === 3 ? 0.55 : point.type === 1 ? 0.82 : 1));
        ctx.fillStyle = `rgba(${rgb},${alpha})`;
        ctx.fillText(glyph ?? CHARS[glyphIndex], x, y);
      }

      // 탐색 스캔 포인트.
      if (type === 'discover') {
        const a = t * 0.8;
        ctx.font = 'bold 14px ui-monospace, monospace';
        ctx.fillStyle = 'rgba(11,92,255,.85)';
        ctx.fillText(
          '+',
          width / 2 + Math.cos(a) * scale * 0.52,
          height * 0.5 + Math.sin(a) * scale * 0.38
        );
      }
    }

    const loop = time => {
      animationId = 0;
      if (disposed || !visible || document.hidden || reducedMotion) return;
      animationId = window.requestAnimationFrame(loop);
      if (time - lastFrame < 42) return; // 약 24fps로 제한하여 CPU 부담 감소
      lastFrame = time;
      draw(time);
    };

    const syncAnimation = () => {
      window.cancelAnimationFrame(animationId);
      animationId = 0;
      lastFrame = -Infinity;
      if (reducedMotion) draw(0);
      if (visible && !document.hidden && !reducedMotion && !disposed) {
        animationId = window.requestAnimationFrame(loop);
      }
    };
    const updateMotionPreference = () => {
      reducedMotion = motionPreference.matches;
      syncAnimation();
    };

    const move = event => {
      const rect = canvas.getBoundingClientRect();
      pointer.targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 1.5;
      pointer.targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 1.1;
    };
    const leave = () => {
      pointer.targetX = 0;
      pointer.targetY = 0;
    };

    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerleave', leave);
    const observer = new ResizeObserver(resize);
    observer.observe(parent);
    const viewObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        syncAnimation();
      },
      { threshold: 0.05 }
    );
    viewObserver.observe(canvas);
    resize();
    document.addEventListener('visibilitychange', syncAnimation);
    motionPreference.addEventListener('change', updateMotionPreference);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(animationId);
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerleave', leave);
      document.removeEventListener('visibilitychange', syncAnimation);
      motionPreference.removeEventListener('change', updateMotionPreference);
      observer.disconnect();
      viewObserver.disconnect();
    };
  }, [points, rgb, type]);

  return <canvas ref={canvasRef} className="ascii-canvas" aria-hidden="true" />;
}

function IdentityCard({ item, index, shouldReduceMotion }) {
  return (
    <Motion.a
      id={item.id}
      href={`/solutions/${item.id}`}
      aria-label={`${item.title} 솔루션 자세히 보기`}
      className={`identity-card identity-card--${item.id}`}
      style={{ '--card-accent': item.color, '--card-rgb': item.rgb }}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={
        shouldReduceMotion ? undefined : { y: -7, transition: { duration: 0.25, delay: 0 } }
      }
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.8,
        delay: shouldReduceMotion ? 0 : index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <div className="identity-card__top">
        <h3 className="identity-card__title">{item.title}</h3>
      </div>
      <div className="identity-card__visual" aria-hidden="true">
        <AsciiCanvas type={item.visual ?? item.id} rgb={item.rgb} />
      </div>
      <div className="identity-card__content">
        <p>{item.description}</p>
      </div>
    </Motion.a>
  );
}

export default function OndamAsciiCards() {
  const shouldReduceMotion = useReducedMotion();
  const gridRef = useRef(null);

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const descriptions = [...grid.querySelectorAll('.identity-card__content p')];
    const updateDescriptionHeight = () => {
      const height = Math.max(
        ...descriptions.map(element => element.getBoundingClientRect().height)
      );
      const value = `${height}px`;
      if (grid.style.getPropertyValue('--description-height') !== value) {
        grid.style.setProperty('--description-height', value);
      }
    };
    const observer = new ResizeObserver(updateDescriptionHeight);
    descriptions.forEach(element => observer.observe(element));
    updateDescriptionHeight();
    return () => observer.disconnect();
  }, []);

  return (
    <section className="ondam-ascii-section" aria-label="온담AI 핵심 솔루션">
      <div className="ondam-ascii-container">
        <div ref={gridRef} className="identity-grid">
          {CONFIG.map((item, index) => (
            <IdentityCard
              key={item.id}
              item={item}
              index={index}
              shouldReduceMotion={shouldReduceMotion}
            />
          ))}
        </div>
      </div>
      <style>{STYLES}</style>
    </section>
  );
}

const STYLES = `
.ondam-ascii-section {
  width: 100%;
  padding: 0;
  background: transparent;
  color: #0f172a;
  font-family: inherit;
  -webkit-font-smoothing: antialiased;
}
.ondam-ascii-section *, .ondam-ascii-section *::before, .ondam-ascii-section *::after { box-sizing: border-box; }
.ondam-ascii-section .ondam-ascii-container { max-width: 1600px; margin: 0 auto; }
.ondam-ascii-section .identity-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 20px; }
.ondam-ascii-section .identity-card { display: flex; flex-direction: column; min-height: 500px; min-width: 0; overflow: hidden; position: relative; isolation: isolate; scroll-margin-top: 110px; color: #0f172a; border: 1px solid #dfe8ff; border-radius: 28px; background: linear-gradient(155deg, #fff 0%, #f5f9ff 100%); box-shadow: 0 12px 38px rgba(44,104,215,.07); transition: border-color .32s ease, box-shadow .32s ease; }
.ondam-ascii-section .identity-card:hover, .ondam-ascii-section .identity-card:focus-visible { border-color: #93b8ff; box-shadow: 0 20px 48px rgba(44,104,215,.13); }
.ondam-ascii-section .identity-card:focus-visible { outline: 2px solid var(--card-accent); outline-offset: 4px; }
.ondam-ascii-section .identity-card__top { padding: 28px 28px 0; position: relative; z-index: 1; }
.ondam-ascii-section .identity-card__title { margin: 0; color: #020617; font-size: clamp(20px,1.45vw,26px); font-weight: 600; line-height: 1.35; letter-spacing: -.035em; }
.ondam-ascii-section .identity-card__visual { position: absolute; inset: 0; z-index: -1; overflow: hidden; mask-image: linear-gradient(to bottom, transparent 0%, black 10%, black 60%, transparent 82%); -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 10%, black 60%, transparent 82%); }
.ondam-ascii-section .identity-card__visual::before { content: ''; position: absolute; inset: 0; background-image: linear-gradient(to right, rgba(11,92,255,.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(11,92,255,.045) 1px, transparent 1px); background-size: 12px 12px; mask-image: radial-gradient(ellipse, black, transparent 80%); }
.ondam-ascii-section .ascii-canvas { position: relative; display: block; width: 100%; height: 100%; cursor: pointer; }
.ondam-ascii-section .identity-card__content { position: relative; margin-top: auto; min-height: calc(var(--description-height, 0px) + 24px); padding: 0 28px 24px; pointer-events: none; }
.ondam-ascii-section .identity-card__content p { margin: 0; font-size: clamp(16px,1.05vw,18px); line-height: 1.75; font-weight: 500; color: #475569; letter-spacing: -.025em; word-break: keep-all; text-wrap: pretty; }
@media (max-width: 1279px) {
  .ondam-ascii-section .identity-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 639px) {
  .ondam-ascii-section .identity-grid { grid-template-columns: 1fr; gap: 20px; }
  .ondam-ascii-section .identity-card { min-height: 480px; }
}
@media (prefers-reduced-motion: reduce) {
  .ondam-ascii-section *, .ondam-ascii-section *::before, .ondam-ascii-section *::after { animation: none !important; transition: none !important; }
}
`;
