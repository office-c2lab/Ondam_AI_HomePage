import { useRef } from 'react';
import { ArrowRight, Layers3, Search, ShieldCheck } from 'lucide-react';
import { motion as Motion, useInView, useReducedMotion } from 'motion/react';
import GamgikAgentOrbWithFace from '../embedded/ondam_ai/components/character/GamgikAgentOrbWithFace.jsx';

const cards = [
  {
    id: 'discover',
    number: '01',
    name: 'Discover',
    description: ['AI 서비스를 발견하고,', '위험을 먼저 파악합니다.'],
    icon: Search,
    links: [{ label: '자세히 보기', slug: 'discover' }],
  },
  {
    id: 'control',
    number: '02',
    name: 'Control',
    description: ['내부·외부 AI 사용을', '기업의 정책으로 통제합니다.'],
    icon: ShieldCheck,
    links: [
      { label: 'Internal', slug: 'control-internal' },
      { label: 'External', slug: 'control-external' },
    ],
  },
  {
    id: 'manage',
    number: '03',
    name: 'Manage',
    description: ['AI App과 Agent를', '체계적으로 운영합니다.'],
    icon: Layers3,
    links: [{ label: '자세히 보기', slug: 'manage' }],
  },
];

function SolutionCard({ card, reveal, index }) {
  const Icon = card.icon;
  const isSingleLink = card.links.length === 1;
  const Tag = isSingleLink ? Motion.a : Motion.article;

  return (
    <Tag
      id={card.id}
      href={isSingleLink ? `/solutions/${card.links[0].slug}` : undefined}
      aria-label={isSingleLink ? `${card.name} 솔루션 자세히 보기` : undefined}
      className="group relative flex min-h-[270px] scroll-mt-28 flex-col overflow-hidden rounded-[28px] border border-[#dfe8ff] bg-white/80 p-7 text-left shadow-[0_12px_38px_rgba(44,104,215,0.07)] backdrop-blur-sm transition-[border-color,box-shadow] duration-300 hover:border-blue-300 hover:shadow-[0_20px_48px_rgba(44,104,215,0.13)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0b5cff] sm:p-8 lg:min-h-[286px] lg:p-10"
      {...reveal(index * 0.1)}
    >
      <div
        aria-hidden="true"
        className="absolute top-9 right-7 grid h-20 w-20 rotate-[-8deg] place-items-center rounded-[24px] border border-white bg-[linear-gradient(135deg,#f1f8ff,#c9ddff)] text-[#3684ff] shadow-[inset_0_2px_3px_white,0_10px_25px_rgba(60,125,255,0.13)] transition-transform duration-500 group-hover:rotate-0 sm:right-8 lg:right-10"
      >
        <Icon className="h-11 w-11" strokeWidth={1.6} />
      </div>
      <p className="text-xl font-semibold tracking-[-0.03em] text-[#4a80ff] sm:text-2xl">
        {card.number}
      </p>
      <h3 className="mt-1 text-[clamp(1.75rem,2.2vw,2.5rem)] leading-tight font-semibold tracking-[-0.045em] text-slate-950">
        {card.name}
      </h3>
      <p className="mt-4 text-[clamp(1rem,1.15vw,1.25rem)] leading-[1.65] font-medium tracking-[-0.025em] text-slate-600">
        {card.description.map(line => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 pt-1 text-sm font-semibold text-[#0b5cff] sm:text-[15px]">
        {card.links.map(link =>
          isSingleLink ? (
            <span key={link.slug} className="inline-flex items-center gap-2">
              {link.label}
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              />
            </span>
          ) : (
            <a
              id={link.slug}
              key={link.slug}
              href={`/solutions/${link.slug}`}
              aria-label={`${card.name} ${link.label} 솔루션 자세히 보기`}
              className="inline-flex scroll-mt-28 items-center gap-2 rounded-sm py-1 transition-colors hover:text-blue-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0b5cff]"
            >
              {link.label}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
          )
        )}
      </div>
    </Tag>
  );
}

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
          className="relative mx-auto mt-1 flex h-[270px] max-w-[900px] items-center justify-center sm:mt-4 sm:h-[340px] lg:h-[380px]"
          {...reveal(0.12)}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-1/2 h-[38%] w-[88%] -translate-x-1/2 -translate-y-1/2 rotate-[-14deg] rounded-[50%] border border-white/90 shadow-[0_0_18px_rgba(165,207,255,0.25)]"
          />
          <div
            role="img"
            aria-label="미소 짓는 온담 AI 캐릭터"
            className="pointer-events-none relative h-[340px] w-[340px] shrink-0 sm:h-[440px] sm:w-[440px] lg:h-[500px] lg:w-[500px]"
          >
            {characterVisible && (
              <GamgikAgentOrbWithFace
                size="100%"
                speed={shouldReduceMotion ? 0 : 0.95}
                motion={shouldReduceMotion ? 0 : 0.5}
                expressionOverride="happy"
                trackPointer={false}
                doubleClickEnabled={false}
              />
            )}
          </div>
        </Motion.div>

        <div className="relative grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-6">
          {cards.map((card, index) => (
            <SolutionCard key={card.id} card={card} reveal={reveal} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
