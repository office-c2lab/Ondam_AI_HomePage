import { ChevronDown } from 'lucide-react';
import { motion as Motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import SolutionLaptop, { SolutionMenu } from '../components/SolutionLaptop.jsx';
import SolutionOverview from '../components/SolutionOverview.jsx';

export default function Home() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const indicatorOpacity = useTransform(scrollY, [0, 120], [1, 0]);
  const indicatorY = useTransform(scrollY, [0, 120], [0, 12]);
  const indicatorPointerEvents = useTransform(scrollY, value => (value > 80 ? 'none' : 'auto'));
  const titleMotion = shouldReduceMotion
    ? { initial: false }
    : {
        initial: { opacity: 0, y: '115%', filter: 'blur(10px)' },
        animate: { opacity: 1, y: '0%', filter: 'blur(0px)' },
        transition: { duration: 1.05, delay: 0.12, ease: [0.16, 1, 0.3, 1] },
      };
  const copyMotion = delay =>
    shouldReduceMotion
      ? { initial: false }
      : {
          initial: { opacity: 0, y: '120%' },
          animate: { opacity: 1, y: '0%' },
          transition: { duration: 0.78, delay, ease: [0.22, 1, 0.36, 1] },
        };

  return (
    <section id="platform" className="relative min-h-screen bg-white">
      <section
        aria-labelledby="platform-title"
        className="relative flex min-h-svh items-center justify-center px-6 pt-[70px] pb-16 text-center min-[681px]:pt-[80px] min-[981px]:pt-[90px]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
        >
          <Motion.div
            className="h-[clamp(420px,58vw,880px)] w-[clamp(420px,58vw,880px)] rounded-full bg-[radial-gradient(circle,rgba(11,92,255,0.14)_0%,rgba(63,122,240,0.065)_38%,transparent_70%)] blur-[18px]"
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.86 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1280px]">
          <h1
            id="platform-title"
            className="overflow-hidden pb-[0.08em] text-[clamp(3rem,5.8vw,6.6rem)] leading-[1.08] font-semibold tracking-[-0.06em] text-slate-950 [text-wrap:balance]"
          >
            <Motion.span className="inline-block" {...titleMotion}>
              모든 <span className="text-[#0b5cff]">AI</span>를, 하나의 통제 안에
            </Motion.span>
          </h1>
          <p className="mt-8 text-[clamp(1rem,1.35vw,1.4rem)] leading-[1.7] font-medium tracking-[-0.02em] text-slate-600">
            <span className="block overflow-hidden">
              <Motion.span className="block" {...copyMotion(0.52)}>
                기업 내부와 외부의 모든 AI를
              </Motion.span>
            </span>
            <span className="block overflow-hidden">
              <Motion.span className="block" {...copyMotion(0.66)}>
                하나의 플랫폼에서 발견·통제·관리합니다
              </Motion.span>
            </span>
          </p>
        </div>

        <Motion.div
          className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 sm:bottom-8 [@media(max-height:720px)]:bottom-3"
          style={{
            opacity: indicatorOpacity,
            y: indicatorY,
            pointerEvents: indicatorPointerEvents,
          }}
        >
          <Motion.a
            href="#platform-overview"
            aria-label="플랫폼 미리보기 섹션으로 이동"
            className="group flex flex-col items-center gap-2 text-slate-400 transition-colors hover:text-slate-700"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: shouldReduceMotion ? 0 : 1.55,
              ease: 'easeOut',
            }}
          >
            <span className="text-[11px] font-semibold tracking-[0.28em] uppercase">Scroll</span>
            <span className="flex h-10 w-6 justify-center rounded-full border border-slate-300 pt-2 transition-colors group-hover:border-slate-500">
              <Motion.span
                className="h-1.5 w-1.5 rounded-full bg-[#0b5cff]"
                animate={shouldReduceMotion ? undefined : { y: [0, 13, 0], opacity: [1, 0.35, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              />
            </span>
            <Motion.span
              animate={shouldReduceMotion ? undefined : { y: [0, 4, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ChevronDown className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
            </Motion.span>
          </Motion.a>
        </Motion.div>
      </section>

      <div id="platform-overview" className="w-full" aria-label="ONDAM AI 플랫폼 미리보기">
        <section className="bg-white px-6 py-16 sm:px-8 sm:py-20 xl:hidden">
          <div className="mx-auto w-full max-w-3xl">
            <SolutionMenu compact />
          </div>
        </section>
        <SolutionLaptop />
      </div>
      <SolutionOverview />
    </section>
  );
}
