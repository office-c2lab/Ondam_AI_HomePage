const leadership = [
  {
    name: '권영길',
    role: 'CTO',
    title: '플랫폼 개발 총괄',
    experience: ['플랫폼 개발 및 유지보수 경력 8년', '삼성청년SW·AI아카데미(SSAFY) 수료'],
    responsibilities: [
      '플랫폼 아키텍처 및 핵심 기술 설계',
      'AI 및 제품 기능 개발 총괄',
      '기술 로드맵 및 R&D 전략 수립',
      '제품 기술 경쟁력 확보 및 고도화',
    ],
  },
  {
    name: '김상우',
    role: 'Business Director',
    title: '사업 전략 기획 및 영업',
    experience: ['금융·공공·기업 AX 사업 경력 20년', '보안 엔지니어 10년'],
    responsibilities: [
      '파트너십 제휴 및 협력 사업 개발',
      '고객 맞춤형 AX 사업 기획 및 제안',
      '신규 고객 발굴 및 영업 전략 수립',
      '시장 확대 및 사업화 전략 추진',
    ],
  },
  {
    name: '김은석',
    role: 'Platform Lead',
    title: '제품 개발 및 서비스 구현 총괄',
    experience: ['스타트업 창업 및 개발 경력 5년', 'SW마에스트로 과정 수료'],
    responsibilities: [
      'Core Platform 및 제품 기능 설계',
      '백엔드 시스템 및 API 개발',
      '온프레미스 인프라 및 서비스 운영 환경 구축',
      '제품 안정성 확보 및 기능 고도화',
    ],
  },
  {
    name: '최명원',
    role: 'AI Lead',
    title: 'AI 기술 개발 총괄',
    experience: ['실리콘밸리 소재 기업 AI 기술 개발 경력 4년', 'SW마에스트로 과정 수료'],
    responsibilities: [
      'LLM 기반 AI 서비스 및 핵심 기능 개발',
      'AI Policy 및 Intelligence 기술 개발',
      'AI 모델 연동 및 추론 성능 최적화',
      'AI 기술 검증 및 모델 성능 고도화',
    ],
  },
];

function ResponsibilityList({ items, inverse = false }) {
  return (
    <ul
      className={`space-y-3 text-[15px] leading-6 ${inverse ? 'text-white/68' : 'text-[#667085]'}`}
    >
      {items.map(item => (
        <li key={item} className="flex gap-3">
          <span
            className={`mt-[0.62rem] h-1.5 w-1.5 shrink-0 rounded-full ${
              inverse ? 'bg-[#65a1ff]' : 'bg-[var(--brand-primary)]'
            }`}
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function Team() {
  return (
    <section id="team" className="bg-white">
      <div className="mx-auto w-full max-w-[1600px] px-5 pt-[calc(var(--site-header-height)+5rem)] pb-28 sm:px-6 lg:px-8 lg:pt-[calc(var(--site-header-height)+7rem)] lg:pb-36 min-[1600px]:px-0">
        <header className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl leading-tight font-bold tracking-[-0.045em] text-[#101828] sm:text-5xl lg:text-[60px]">
            핵심 인력
          </h1>
          <p className="mt-6 text-base leading-8 text-[#667085] sm:text-lg">
            사업 전략부터 플랫폼과 AI 기술 개발까지,
            <br className="hidden sm:block" /> 각 분야의 경험을 갖춘 리더가 ONDAM AI를 만들어갑니다.
          </p>
        </header>

        <article className="relative mt-16 overflow-hidden rounded-[28px] bg-[#071126] p-7 text-white sm:p-10 lg:mt-20 lg:p-14">
          <div
            className="absolute inset-0 opacity-80 [background-image:radial-gradient(circle_at_82%_15%,rgba(22,139,255,0.32),transparent_32%),radial-gradient(circle_at_12%_92%,rgba(7,93,246,0.24),transparent_34%)]"
            aria-hidden="true"
          />
          <div className="relative grid gap-12 lg:grid-cols-[0.86fr_1.14fr] lg:items-center lg:gap-20">
            <div>
              <span className="inline-flex rounded-full border border-[#6ca5ff]/35 bg-[#075df6]/15 px-4 py-2 text-sm font-bold text-[#8db8ff]">
                CEO
              </span>
              <h2 className="mt-7 text-4xl font-bold tracking-[-0.045em] sm:text-5xl">이호진</h2>
              <p className="mt-4 text-xl font-bold text-[#72a9ff] sm:text-2xl">사업 총괄 및 기획</p>
              <div className="mt-8 space-y-2 text-[15px] leading-7 text-white/68 sm:text-base">
                <p>정보보안, AI 사업 및 교육 경력 10년</p>
                <p>차세대보안리더양성프로그램 Best10 선정</p>
                <p>한국정보처리학회 협동이사</p>
              </div>
            </div>

            <div className="border-t border-white/12 pt-9 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-14">
              <p className="mb-7 text-sm font-bold tracking-[0.12em] text-white/45">주요 역할</p>
              <ResponsibilityList
                inverse
                items={[
                  'Enterprise AI 전략 및 사업 방향 수립',
                  '제품 및 사업 포트폴리오 총괄',
                  '시장 진입 및 사업 성장 전략 수립',
                  '투자 유치 및 중장기 경영 전략 추진',
                ]}
              />
            </div>
          </div>
        </article>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {leadership.map(person => (
            <article
              key={person.name}
              className="rounded-2xl border border-[#dfe5ee] bg-[#f8fafc] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#a8c4f7] hover:bg-white hover:shadow-[0_20px_45px_rgba(15,23,42,0.08)] sm:p-9"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#e4e7ec] pb-7">
                <div>
                  <h2 className="text-3xl font-bold tracking-[-0.04em] text-[#101828]">
                    {person.name}
                  </h2>
                  <p className="mt-3 text-lg font-bold text-[var(--brand-primary)]">
                    {person.title}
                  </p>
                </div>
                <span className="rounded-full bg-[#eaf2ff] px-4 py-2 text-sm font-bold text-[var(--brand-primary)]">
                  {person.role}
                </span>
              </div>

              <div className="mt-7 space-y-2 text-[15px] leading-7 font-semibold text-[#344054]">
                {person.experience.map(item => (
                  <p key={item}>{item}</p>
                ))}
              </div>

              <div className="mt-8">
                <p className="mb-5 text-sm font-bold tracking-[0.08em] text-[#98a2b3]">주요 역할</p>
                <ResponsibilityList items={person.responsibilities} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
