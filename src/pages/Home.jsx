import SolutionLaptop from '../components/SolutionLaptop.jsx';

export default function Home() {
  return (
    <section
      id="platform"
      className="relative min-h-screen pt-[70px] min-[681px]:pt-[80px] min-[981px]:pt-[90px]"
    >
      <section
        aria-labelledby="platform-title"
        className="flex min-h-[calc(100svh-70px)] items-center justify-center px-6 py-16 text-center min-[681px]:min-h-[calc(100svh-80px)] min-[981px]:min-h-[calc(100svh-90px)]"
      >
        <div className="mx-auto w-full max-w-[1280px]">
          <h1
            id="platform-title"
            className="text-[clamp(3rem,5.8vw,6.6rem)] leading-[1.08] font-semibold tracking-[-0.06em] text-slate-950 [text-wrap:balance]"
          >
            모든 AI를, 하나의 통제 안에
          </h1>
          <p className="mt-8 text-[clamp(1rem,1.35vw,1.4rem)] leading-[1.7] font-medium tracking-[-0.02em] text-slate-600">
            <span className="block">기업 내부와 외부의 모든 AI를</span>
            <span className="block">하나의 플랫폼에서 발견·통제·관리합니다</span>
          </p>
        </div>
      </section>

      <div id="platform-overview" className="w-full" aria-label="ONDAM AI 플랫폼 미리보기">
        <SolutionLaptop />
      </div>
    </section>
  );
}
