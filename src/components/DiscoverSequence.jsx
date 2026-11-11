import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import worldDots from '../data/worldDots.json';

const clamp = value => Math.min(1, Math.max(0, value));
const lerp = (from, to, progress) => from + (to - from) * progress;
const smoothStep = (from, to, value) => {
  const progress = clamp((value - from) / (to - from));
  return progress * progress * (3 - 2 * progress);
};

function MorphingWorld({ reducedMotion }) {
  const canvasRef = useRef(null);
  const dots = worldDots;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return undefined;

    let animationFrame = 0;
    let width = 1;
    let height = 1;
    let startedAt = null;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = now => {
      const morphElapsed = startedAt === null ? 0 : Math.max(0, now - startedAt - 250);
      const progress = reducedMotion ? 1 : clamp(morphElapsed / 2200);
      const wrapProgress = smoothStep(0.04, 0.68, progress);
      const sphereProgress = smoothStep(0.28, 1, progress);
      const spinElapsed = Math.max(0, morphElapsed / 1000 - 2.2);
      const rotation =
        sphereProgress * 0.36 +
        (reducedMotion ? 0 : spinElapsed * 0.045 * smoothStep(0.85, 1, progress));
      const mapWidth = Math.min(width * 0.88, height * 1.62);
      const mapHeight = mapWidth * 0.5;
      const globeRadius = Math.min(width, height) * 0.37;
      const dotRadius = Math.max(2.6, Math.min(4.8, globeRadius / 75));

      context.clearRect(0, 0, width, height);
      context.fillStyle = '#0b5cff';

      dots.forEach(([latitude, longitude]) => {
        const latitudeRadians = (latitude * Math.PI) / 180;
        const longitudeRadians = (longitude * Math.PI) / 180;
        const mercator = Math.log(Math.tan(Math.PI / 4 + latitudeRadians / 2)) / Math.PI;
        const flatX = width / 2 + (longitude / 360) * mapWidth;
        const flatY = height / 2 - (mercator / 1.55) * mapHeight;
        const rotatedLongitude = longitudeRadians + rotation;
        const latitudeRadius = Math.cos(latitudeRadians);
        const sphereX = latitudeRadius * Math.sin(rotatedLongitude);
        const sphereZ = latitudeRadius * Math.cos(rotatedLongitude);
        const sphereY = Math.sin(latitudeRadians);
        const cylinderX = width / 2 + Math.sin(rotatedLongitude) * globeRadius;
        const globeX = width / 2 + sphereX * globeRadius;
        const globeY = height / 2 - sphereY * globeRadius;
        const wrappedX = lerp(flatX, cylinderX, wrapProgress);
        const x = lerp(wrappedX, globeX, sphereProgress);
        const y = lerp(flatY, globeY, sphereProgress);
        const backFade = sphereZ < 0 ? lerp(1, 0.22, smoothStep(0.58, 0.92, progress)) : 1;

        context.globalAlpha = backFade;
        context.beginPath();
        context.arc(x, y, dotRadius, 0, Math.PI * 2);
        context.fill();
      });

      context.globalAlpha = 1;
      animationFrame = window.requestAnimationFrame(draw);
    };

    const resizeObserver = new ResizeObserver(resize);
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && startedAt === null) startedAt = performance.now();
      },
      { threshold: 0.25 }
    );
    resizeObserver.observe(canvas);
    visibilityObserver.observe(canvas);
    resize();
    draw(performance.now());
    return () => {
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      window.cancelAnimationFrame(animationFrame);
    };
  }, [dots, reducedMotion]);

  return (
    <div
      className="h-[min(76svh,760px)] min-h-[520px] w-full"
      role="img"
      aria-label="펼쳐진 세계 지도가 도트 지구본으로 변환되는 애니메이션"
    >
      <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />
    </div>
  );
}

export default function DiscoverSequence() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="discover-sequence">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col items-center px-6 pt-12 text-center sm:px-10 sm:pt-16">
        <h1 className="discover-title text-[clamp(2rem,4.4vw,4.75rem)] leading-[1.16] font-semibold tracking-[-0.06em] text-[#0b5cff]">
          Discover
        </h1>
      </div>

      <section className="mx-auto w-full max-w-[1600px]" aria-label="지도에서 지구본으로">
        <MorphingWorld reducedMotion={reducedMotion} />
      </section>

      <div className="mx-auto flex w-full max-w-[1600px] flex-col items-center px-6 pb-16 text-center sm:px-10 sm:pb-24">
        <h2 className="text-[clamp(2rem,4.4vw,4.75rem)] leading-[1.16] font-semibold tracking-[-0.06em] break-keep text-slate-950">
          <span className="block">AI 서비스를 발견하고,</span>
          <span className="block text-[#0b5cff]">위험을 먼저 파악하세요.</span>
        </h2>
        <p className="mt-6 max-w-[800px] text-[clamp(1rem,1.35vw,1.4rem)] leading-[1.7] font-medium tracking-[-0.025em] break-keep text-slate-600">
          끊임없이 등장하는 LLM 서비스를 실시간으로 발견하고 분석해, 기업의 AI 보안 정책에 필요한
          인텔리전스를 제공합니다.
        </p>
      </div>

      <style>{`
        .discover-sequence { position:relative; width:100vw; margin-top:-4rem; margin-inline:calc(50% - 50vw); overflow:clip; }
        .discover-title { animation:discover-title-in .85s .05s cubic-bezier(.16,1,.3,1) both; }
        @keyframes discover-title-in { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @media (prefers-reduced-motion:reduce) { .discover-title { animation:none; } }
      `}</style>
    </div>
  );
}
