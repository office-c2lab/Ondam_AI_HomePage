const footerMenus = [
  {
    title: '기업소개',
    links: [
      ['기업소개', '#about'],
      ['비전과 미션', '#vision'],
      ['핵심역량', '#capabilities'],
      ['핵심 인력', '#team'],
    ],
  },
  {
    title: '솔루션&서비스',
    links: [
      ['플랫폼 개요', '#platform-overview'],
      ['Discover', '#discover'],
      ['Control Internal', '#control-internal'],
      ['Control External', '#control-external'],
      ['Manage', '#manage'],
    ],
  },
  {
    title: '핵심기술',
    links: [
      ['AI Intelligence', '#enterprise-ai-intelligence'],
      ['Policy Engine', '#policy-engine'],
      ['LLM Intelligence', '#service-intelligence'],
      ['Multi LLM', '#multi-llm'],
      ['AI Governance', '#ai-governance'],
    ],
  },
  {
    title: '채용',
    links: [
      ['인재상', '#talent'],
      ['직무 소개', '#roles'],
      ['채용 공고', '#openings'],
      ['채용 절차', '#hiring-process'],
      ['복리후생', '#benefits'],
    ],
  },
  {
    title: '고객지원',
    links: [
      ['도입 문의', '#contact'],
      ['오시는 길', '#location'],
      ['FAQ', '#faq'],
    ],
  },
];

function FooterLogo() {
  return (
    <span className="relative block h-8 w-[173px] overflow-hidden">
      <img
        src="/ondam_logo.png"
        alt="ONDAM AI"
        className="absolute top-[-21px] left-[-22px] h-auto w-[215px] max-w-none"
      />
    </span>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-[#dfe4ec] bg-[#f7f9fc]">
      <div className="mx-auto w-full max-w-[1600px] px-5 py-14 sm:px-6 lg:px-8 lg:py-18 min-[1600px]:px-0">
        <div className="grid gap-12 border-b border-[#d7dde7] pb-12 lg:grid-cols-[1.55fr_3fr] lg:gap-20 lg:pb-16">
          <div>
            <a href="#" aria-label="ONDAM AI 홈" className="inline-flex">
              <FooterLogo />
            </a>
            <p className="mt-6 max-w-sm text-base leading-7 font-medium text-[#475467]">
              사람과 AI가 함께 일하는 더 나은 방식을 설계합니다.
            </p>
            <address className="mt-8 space-y-2 text-[15px] leading-7 not-italic text-[#344054]">
              <p>
                <span className="font-bold text-[#101828]">대표이사</span> 이호진
              </p>
              <p>
                <span className="font-bold text-[#101828]">주소</span> 서울특별시 구로구 디지털로
                31길 20 310호 (08380)
              </p>
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="font-bold text-[#101828]">이메일</span>
                <a
                  href="mailto:info@aictl.kr"
                  className="text-[var(--brand-primary)] transition hover:underline"
                >
                  info@aictl.kr
                </a>
                <span className="text-[#98a2b3]" aria-hidden="true">
                  |
                </span>
                <span className="font-bold text-[#101828]">전화번호</span>
                <a
                  href="tel:010-5595-4945"
                  className="transition hover:text-[var(--brand-primary)]"
                >
                  010-5595-4945
                </a>
                <span className="text-[#98a2b3]" aria-hidden="true">
                  |
                </span>
                <span className="font-bold text-[#101828]">FAX</span>
                <span>02-2247-7001</span>
              </p>
            </address>
          </div>

          <nav
            className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 xl:grid-cols-5"
            aria-label="푸터 메뉴"
          >
            {footerMenus.map(menu => (
              <div key={menu.title}>
                <strong className="text-base font-bold text-[#101828]">{menu.title}</strong>
                <ul className="mt-5 flex flex-col gap-3.5">
                  {menu.links.map(([label, href]) => (
                    <li key={href}>
                      <a
                        href={href}
                        className="inline-block text-[15px] leading-6 text-[#475467] transition-[color,transform] duration-200 hover:translate-x-0.5 hover:text-[var(--brand-primary)]"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4 pt-7 text-sm text-[#667085] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 ONDAM AI. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <a
              href="#privacy"
              className="font-semibold text-[#475467] transition hover:text-[#101828]"
            >
              개인정보처리방침
            </a>
            <a href="#contact" className="transition hover:text-[#101828]">
              문의하기
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
