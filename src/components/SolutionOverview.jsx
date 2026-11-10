import { useRef } from 'react';
import { motion as Motion, useInView, useReducedMotion } from 'motion/react';
import GamgikAgentOrbWithFace from '../embedded/ondam_ai/components/character/GamgikAgentOrbWithFace.jsx';
import OndamAsciiCards from './OndamAsciiCards.jsx';

export default function SolutionOverview() {
  const characterRef = useRef(null);
  const characterVisible = useInView(characterRef, { margin: '120px' });
  const shouldReduceMotion = useReducedMotion();
  const reveal = (delay = 0) => ({
    initial: shouldReduceMotion ? false : { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: {
      duration: shouldReduceMotion ? 0 : 0.8,
      delay: shouldReduceMotion ? 0 : delay,
      ease: [0.16, 1, 0.3, 1],
    },
  });

  return (
    <section
      id="solutions"
      aria-labelledby="solutions-title"
      className="relative isolate overflow-hidden bg-white px-6 pt-24 pb-24 sm:px-8 sm:pt-32 sm:pb-32 lg:pt-36"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_40%_at_50%_58%,#dceaff_0%,#f0f6ff_50%,white_100%)]"
      />
      <div className="mx-auto w-full max-w-[1600px]">
        <Motion.div className="text-center" {...reveal()}>
          <h2
            id="solutions-title"
            className="mt-6 text-[clamp(2rem,4.4vw,4.75rem)] leading-[1.16] font-semibold tracking-[-0.06em] break-keep text-slate-950"
          >
            <span className="block">기업의 모든 AI,</span>
            <span className="mt-[0.06em] block">
              이제 <span className="text-[#0b5cff]">온담 AI</span>로 관리하세요.
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-[800px] text-[clamp(1rem,1.35vw,1.4rem)] leading-[1.7] font-medium tracking-[-0.025em] break-keep text-slate-600">
            발견부터 통제, 운영까지. 기업의 AI를 하나로 연결합니다.
          </p>
        </Motion.div>

        <Motion.div
          ref={characterRef}
          className="relative mx-auto mt-1 flex h-[340px] max-w-[900px] items-center justify-center sm:mt-4 sm:h-[425px] lg:h-[475px]"
          {...reveal(0.12)}
        >
          <div
            role="img"
            aria-label="온담 AI 캐릭터"
            className="pointer-events-none relative h-[425px] w-[425px] shrink-0 sm:h-[550px] sm:w-[550px] lg:h-[625px] lg:w-[625px]"
          >
            {characterVisible && (
              <GamgikAgentOrbWithFace
                size="100%"
                speed={shouldReduceMotion ? 0 : 8}
                motion={shouldReduceMotion ? 0 : 0.68}
                trackPointer={false}
                doubleClickEnabled={false}
              />
            )}
          </div>
        </Motion.div>

        <OndamAsciiCards />
      </div>
    </section>
  );
}
