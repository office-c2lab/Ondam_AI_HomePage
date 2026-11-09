import { createElement, useEffect } from 'react';
import {
  ArrowRight,
  BrainCircuit,
  BriefcaseBusiness,
  Code2,
  Compass,
  GraduationCap,
  Handshake,
  Laptop2,
  Layers3,
  Lightbulb,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Target,
  UsersRound,
} from 'lucide-react';
import BlueShaderBackground from '../components/BlueShaderBackground.jsx';

const teams = [
  {
    icon: BrainCircuit,
    title: 'AI Research',
    description: 'LLM과 AI 에이전트의 품질, 평가, 안전성을 연구하고 제품의 기술 기반을 만듭니다.',
    tags: ['LLM', 'Agent', 'Evaluation'],
  },
  {
    icon: Code2,
    title: 'Platform Engineering',
    description:
      'Discover, Control, Manage가 안정적으로 연결되는 엔터프라이즈 AI 플랫폼을 개발합니다.',
    tags: ['Backend', 'Cloud', 'MLOps'],
  },
  {
    icon: Layers3,
    title: 'Product & Experience',
    description: '복잡한 AI 운영 경험을 명확한 제품 흐름과 사용하기 쉬운 인터페이스로 설계합니다.',
    tags: ['Product', 'Frontend', 'UX'],
  },
  {
    icon: ShieldCheck,
    title: 'AI Governance',
    description: '정책, 권한, 데이터 흐름을 설계해 기업이 AI를 통제 가능하게 활용하도록 돕습니다.',
    tags: ['Policy', 'Security', 'Compliance'],
  },
  {
    icon: BriefcaseBusiness,
    title: 'Business & Consulting',
    description: '고객의 AI 도입 과제를 정의하고 기술과 업무 환경을 연결하는 실행 전략을 만듭니다.',
    tags: ['Consulting', 'Sales', 'Partnership'],
  },
  {
    icon: UsersRound,
    title: 'Corporate Operations',
    description: '팀이 빠르게 성장하고 몰입할 수 있도록 채용, 조직 운영과 경영 기반을 지원합니다.',
    tags: ['People', 'Finance', 'Operations'],
  },
];

const values = [
  {
    icon: Target,
    title: '문제의 본질에 집중합니다',
    description: '기능보다 고객의 실제 문제를 먼저 이해하고, 가장 중요한 문제부터 해결합니다.',
  },
  {
    icon: Lightbulb,
    title: '끝까지 탐구합니다',
    description: '빠르게 변하는 AI 기술을 학습하고 검증하며 더 나은 답을 찾습니다.',
  },
  {
    icon: MessageSquare,
    title: '투명하게 소통합니다',
    description: '맥락과 근거를 공유하고, 솔직한 피드백으로 함께 더 좋은 결정을 만듭니다.',
  },
  {
    icon: Handshake,
    title: '함께 완성합니다',
    description: '직무의 경계를 넘어 협업하고, 개인의 성과를 팀의 성장으로 연결합니다.',
  },
];

const talentTraits = [
  { title: '전문성', symbol: '🏅' },
  { title: '창의성', symbol: '🎨' },
  { title: '문제해결능력', symbol: '🧩' },
  { title: '윤리의식', symbol: '🖊️' },
  { title: '도전정신', symbol: '🎲' },
  { title: '소통능력', symbol: '🔊' },
  { title: '팀워크', symbol: '⚽' },
  { title: '책임의식', symbol: '📋' },
];

const environments = [
  {
    icon: Laptop2,
    title: '몰입을 돕는 업무 환경',
    description: '좋은 도구와 명확한 우선순위로 깊이 있는 업무에 집중하는 환경을 지향합니다.',
  },
  {
    icon: GraduationCap,
    title: '성장을 위한 학습',
    description: '새로운 기술을 실험하고 배운 내용을 팀의 자산으로 나누는 문화를 만듭니다.',
  },
  {
    icon: Compass,
    title: '자율과 책임',
    description: '충분한 맥락을 공유하고 각자의 전문성을 바탕으로 주도적인 판단을 존중합니다.',
  },
  {
    icon: Sparkles,
    title: '지속 가능한 협업',
    description: '서로의 몰입과 휴식을 존중하며 오래 함께 성장할 수 있는 방식을 고민합니다.',
  },
];

const hiringSteps = ['지원', '서류 검토', '직무 인터뷰', '처우 협의', '최종 합류'];

function SectionHeading({ label, title, description, align = 'left' }) {
  const alignment = align === 'center' ? 'mx-auto text-center' : '';

  return (
    <div className={`max-w-3xl ${alignment}`}>
      <p className="text-sm font-bold tracking-[0.14em] text-[#74a8ff]">{label}</p>
      <h2 className="mt-4 text-3xl leading-[1.2] font-bold tracking-[-0.04em] text-white sm:text-4xl lg:text-[48px]">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-base leading-8 text-white/60 sm:text-lg">{description}</p>
      )}
    </div>
  );
}

export default function Careers() {
  useEffect(() => {
    if (!window.location.hash) return;

    const target = document.querySelector(window.location.hash);
    if (target) requestAnimationFrame(() => target.scrollIntoView());
  }, []);

  return (
    <div className="bg-black text-white">
      <section className="relative isolate flex min-h-screen items-center overflow-hidden bg-[#020817]">
        <BlueShaderBackground />
        <div
          className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black via-black/55 to-transparent"
          aria-hidden="true"
        />

        <div className="relative mx-auto flex min-h-screen w-full max-w-[1600px] flex-col items-center justify-center px-5 py-24 text-center sm:px-6 lg:px-8 min-[1600px]:px-0">
          <div className="ondam-career-hero__copy max-w-4xl">
            <h1 className="text-4xl leading-[1.1] font-bold tracking-[-0.05em] sm:text-5xl lg:text-[64px]">
              Build AI we can trust.
              <br />
              <span className="text-[#6ca5ff]">Shape the way we work.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
              기업이 AI를 더 안전하고 유용하게 활용할 수 있도록,
              <br className="hidden sm:block" /> 기술과 제품의 새로운 기준을 함께 만들어갑니다.
            </p>
          </div>

          <div className="ondam-career-hero__action">
            <a
              href="#openings"
              className="group mt-9 inline-flex h-14 items-center gap-3 rounded-2xl border border-white/12 bg-white/8 px-7 text-base font-bold text-white backdrop-blur-sm transition duration-300 hover:scale-[1.03] hover:border-[#69a5ff]/70 hover:bg-[#075df6] hover:shadow-[0_0_70px_rgba(7,93,246,0.38)]"
            >
              채용 안내 보기
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </section>

      <section
        className="relative z-10 -mt-px bg-black px-5 pt-12 pb-0 sm:px-6 sm:pt-14 lg:px-8 lg:pt-16"
        aria-labelledby="career-about"
      >
        <div className="mx-auto w-full max-w-[1200px] pb-20 sm:pb-24 lg:pb-20">
          <p className="text-base leading-none font-bold tracking-[-0.02em] text-[#168bff] sm:text-lg">
            회사소개
          </p>
          <h2
            id="career-about"
            className="mt-5 text-[32px] leading-tight font-bold tracking-[-0.05em] text-white sm:text-[38px]"
          >
            온담AI
          </h2>

          <div className="mt-10 max-w-[680px] space-y-6 text-[15px] leading-[1.65] font-semibold tracking-[-0.025em] text-white/90 sm:text-base">
            <p>
              온담AI는 기업이 다양한 AI 서비스와 에이전트를 발견하고, 사용을 통제하며,
              <br className="hidden sm:block" /> 운영 전반을 관리할 수 있도록 돕는 엔터프라이즈 AI
              플랫폼을 만듭니다.
            </p>
            <p>
              AI 서비스 탐색부터 Internal·External AI 사용 통제, AI App Store와 에이전트 운영까지
              <br className="hidden sm:block" /> 기업이 신뢰할 수 있는 AI 활용 환경을 구축하도록
              지원합니다.
            </p>
          </div>
        </div>
      </section>

      <section
        id="talent"
        className="scroll-mt-28 px-5 py-24 sm:px-6 sm:py-32 lg:px-8"
        aria-labelledby="career-talent"
      >
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="text-center">
            <p className="text-base leading-none font-bold tracking-[-0.02em] text-[#168bff] sm:text-lg">
              인재
            </p>
            <h2
              id="career-talent"
              className="mt-5 text-[32px] leading-tight font-bold tracking-[-0.05em] text-white sm:text-[38px]"
            >
              바라는 인재상
            </h2>
          </div>

          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {talentTraits.map(({ title, symbol }) => (
              <article
                key={title}
                className="group flex min-h-[230px] flex-col items-center justify-center rounded-2xl bg-[#181818] px-5 py-10 text-center transition duration-300 hover:-translate-y-1 hover:bg-[#343434] sm:min-h-[250px]"
              >
                <h3 className="text-lg font-bold tracking-[-0.03em] text-white/90 sm:text-xl">
                  {title}
                </h3>
                <span
                  className="mt-7 text-[58px] leading-none transition duration-300 group-hover:scale-110 sm:text-[64px]"
                  aria-hidden="true"
                >
                  {symbol}
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="roles" className="scroll-mt-28 px-5 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto w-full max-w-[1200px]">
          <SectionHeading
            label="TEAMS"
            title="전문성이 제품으로 이어지는 팀"
            description="각자의 전문 분야에서 깊이 고민하고, 하나의 제품 경험을 위해 긴밀하게 협업합니다."
          />

          <div className="mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {teams.map(({ icon, title, description, tags }) => (
              <article
                key={title}
                className="group rounded-2xl border border-white/10 bg-[#11151d] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#5d98ff]/70 sm:p-8"
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#075df6]/18 text-[#6fa4ff] transition group-hover:bg-[#075df6] group-hover:text-white">
                  {createElement(icon, { className: 'h-6 w-6', strokeWidth: 1.8 })}
                </div>
                <h3 className="mt-8 text-2xl font-bold tracking-[-0.03em]">{title}</h3>
                <p className="mt-4 min-h-20 text-[15px] leading-7 text-white/55">{description}</p>
                <div className="mt-7 flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="values" className="scroll-mt-28 px-5 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto w-full max-w-[1200px]">
          <SectionHeading
            label="OUR VALUES"
            title="우리가 함께 일하는 방식"
            description="정답이 빠르게 바뀌는 AI 시장에서 좋은 동료와 좋은 판단이 가장 강한 경쟁력이라고 믿습니다."
            align="center"
          />

          <div className="mt-16 grid gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon, title, description }) => (
              <article key={title} className="min-h-72 bg-[#090c12] p-7 sm:p-8">
                {createElement(icon, { className: 'h-8 w-8 text-[#6fa4ff]', strokeWidth: 1.65 })}
                <h3 className="mt-14 text-xl leading-7 font-bold">{title}</h3>
                <p className="mt-4 text-[15px] leading-7 text-white/52">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="benefits"
        className="scroll-mt-28 px-5 py-24 sm:px-6 sm:py-32 lg:px-8"
      >
        <div className="mx-auto w-full max-w-[1200px]">
          <SectionHeading
            label="WORK ENVIRONMENT"
            title="더 좋은 성과를 위한 업무 환경"
            description="제도보다 중요한 것은 일하는 경험입니다. ONDAM AI는 몰입과 성장, 지속 가능한 협업을 지원하는 환경을 만들어갑니다."
          />

          <div className="mt-16 grid gap-5 sm:grid-cols-2">
            {environments.map(({ icon, title, description }) => (
              <article
                key={title}
                className="rounded-2xl border border-white/10 bg-white/[0.045] p-7 sm:p-9"
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#075df6]/18 text-[#6fa4ff]">
                  {createElement(icon, { className: 'h-6 w-6', strokeWidth: 1.8 })}
                </div>
                <h3 className="mt-7 text-xl font-bold sm:text-2xl">{title}</h3>
                <p className="mt-4 text-[15px] leading-7 text-white/55">{description}</p>
              </article>
            ))}
          </div>
          <p className="mt-6 text-sm leading-6 text-white/45">
            구체적인 근무 조건과 복리후생은 채용 포지션별 공고에서 안내합니다.
          </p>
        </div>
      </section>

      <section id="hiring-process" className="scroll-mt-28 px-5 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto w-full max-w-[1200px]">
          <SectionHeading
            label="HIRING PROCESS"
            title="ONDAM AI 합류 여정"
            description="서로의 경험과 가능성을 충분히 이해할 수 있도록 대화를 중심으로 진행합니다."
          />

          <ol className="mt-16 grid gap-4 md:grid-cols-5">
            {hiringSteps.map((step, index) => (
              <li
                key={step}
                className="relative rounded-2xl border border-white/10 bg-white/[0.045] p-6"
              >
                <span className="text-sm font-bold text-[#6fa4ff]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="mt-10 text-lg font-bold">{step}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-sm leading-6 text-white/45">
            포지션에 따라 과제 또는 추가 인터뷰가 진행될 수 있으며, 상세 절차는 개별 안내합니다.
          </p>
        </div>
      </section>

      <section id="openings" className="scroll-mt-28 px-5 pb-24 sm:px-6 sm:pb-32 lg:px-8">
        <div className="relative mx-auto w-full max-w-[1200px] overflow-hidden rounded-[28px] bg-[var(--brand-primary)] px-7 py-16 sm:px-12 sm:py-20 lg:px-20">
          <div
            className="absolute inset-0 opacity-35 [background-image:radial-gradient(circle_at_80%_20%,#73b2ff_0%,transparent_28%),repeating-linear-gradient(120deg,transparent_0px,transparent_32px,rgba(255,255,255,0.18)_33px,rgba(255,255,255,0.18)_35px,transparent_36px)]"
            aria-hidden="true"
          />
          <div className="relative grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-sm font-bold tracking-[0.14em] text-white/65">JOIN US</p>
              <h2 className="mt-4 text-3xl leading-[1.18] font-bold tracking-[-0.04em] sm:text-4xl lg:text-[52px]">
                함께 만들 다음 장면을
                <br /> 기다리고 있습니다.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/70">
                현재 모집 중인 포지션과 채용 관련 문의는 이메일로 안내해 드립니다.
              </p>
            </div>
            <a
              href="mailto:info@aictl.kr?subject=%5BONDAM%20AI%20%EC%B1%84%EC%9A%A9%20%EB%AC%B8%EC%9D%98%5D"
              className="inline-flex h-14 w-fit items-center gap-3 rounded-full bg-white px-7 font-bold text-[#075df6] transition hover:-translate-y-0.5 hover:bg-[#eef5ff]"
            >
              채용 문의하기
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3 text-sm leading-6 text-white/55">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#6fa4ff]" strokeWidth={1.8} />
            <span>서울특별시 구로구 디지털로31길 20, 에이스테크노타워5차 310호</span>
          </div>
          <a
            href="/location"
            className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-[#8db7ff]"
          >
            오시는 길
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
