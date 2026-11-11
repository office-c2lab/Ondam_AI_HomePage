import { ArrowRight } from 'lucide-react';
import { motion as Motion, useReducedMotion } from 'motion/react';
import DiscoverSequence from '../components/DiscoverSequence.jsx';
import { solutions } from '../data/solutions.js';

export default function SolutionDetail({ solutionId }) {
  const solution = solutions[solutionId];
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-white px-6 pt-[calc(var(--site-header-height)+4rem)] pb-24 sm:px-8 sm:pb-32">
      {solutionId !== 'discover' && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[700px] bg-[radial-gradient(ellipse_at_65%_30%,#eaf2ff,transparent_65%)]"
        />
      )}
      <div className="relative mx-auto max-w-[1600px]">
        {solutionId === 'discover' ? (
          <DiscoverSequence />
        ) : (
          <Motion.div
            className="mt-14 sm:mt-20"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-sm font-semibold tracking-[0.08em] text-[#0b5cff]">
              {solution.name} <span className="mx-3 text-blue-200">/</span>
              <span className="tracking-[-0.02em]">{solution.category}</span>
            </p>
            <h1 className="mt-7 text-[clamp(2.25rem,4.8vw,5rem)] leading-[1.18] font-semibold tracking-[-0.055em] break-keep text-slate-950">
              {solution.headline.map(line => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <p className="mt-8 max-w-[760px] text-[clamp(1rem,1.35vw,1.4rem)] leading-[1.8] tracking-[-0.025em] break-keep text-slate-600">
              {solution.description}
            </p>
            <a
              href="/contact"
              className="mt-9 inline-flex items-center gap-8 rounded-full bg-[#0b5cff] px-7 py-4 text-base font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0b5cff]"
            >
              도입 문의 <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
          </Motion.div>
        )}

        <div className="mt-20 grid gap-5 md:grid-cols-3 sm:mt-28">
          {solution.features.map((feature, index) => (
            <article
              key={feature.title}
              className="rounded-3xl border border-blue-100 bg-[#f8fbff] p-7 lg:p-10"
            >
              <p className="text-sm font-semibold text-[#0b5cff]">0{index + 1}</p>
              <h2 className="mt-6 text-xl leading-snug font-semibold tracking-[-0.035em] break-keep text-slate-950 lg:text-2xl">
                {feature.title}
              </h2>
              <p className="mt-4 text-base leading-[1.8] tracking-[-0.02em] break-keep text-slate-600">
                {feature.description}
              </p>
            </article>
          ))}
        </div>

        <nav aria-label="다른 솔루션 살펴보기" className="mt-16 flex flex-wrap gap-3">
          {Object.entries(solutions)
            .filter(([id]) => id !== solutionId)
            .map(([id, item]) => (
              <a
                key={id}
                href={`/solutions/${id}`}
                className="inline-flex items-center gap-4 rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 transition-colors hover:border-blue-300 hover:text-[#0b5cff] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0b5cff]"
              >
                {item.name} <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </a>
            ))}
        </nav>
      </div>
    </section>
  );
}
