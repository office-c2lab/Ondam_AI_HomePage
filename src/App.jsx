import Header from './components/Header.jsx';

const footerMenus = [
  {
    title: '솔루션&서비스',
    links: [
      ['ONDAM AI', '#ondam-ai'],
      ['AI 에이전트', '#ai-agent'],
      ['업무 자동화', '#automation'],
      ['AI 컨설팅', '#consulting'],
    ],
  },
  {
    title: '회사소개',
    links: [
      ['회사소개', '#about'],
      ['비전과 미션', '#vision'],
      ['핵심역량', '#capabilities'],
      ['연혁', '#history'],
    ],
  },
  {
    title: '홍보센터',
    links: [
      ['회사소식', '#news'],
      ['보도자료', '#press'],
      ['자료실', '#resources'],
    ],
  },
  {
    title: '고객지원',
    links: [
      ['도입 문의', '#contact'],
      ['제휴 문의', '#partnership'],
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

export default function App() {
  return (
    <div className="min-h-screen bg-white text-[#171717]">
      <Header />

      <main className="mx-auto min-h-[calc(100vh-90px)] w-full max-w-[1600px] px-5 pt-[90px] sm:px-6 lg:px-8 min-[1600px]:px-0" />

      <footer className="border-t border-[#e5e7eb] bg-[#f7f9fc]">
        <div className="mx-auto w-full max-w-[1600px] px-5 py-14 sm:px-6 lg:px-8 lg:py-18 min-[1600px]:px-0">
          <div className="grid gap-12 border-b border-[#dfe4ec] pb-12 lg:grid-cols-[1.4fr_3fr] lg:gap-20 lg:pb-16">
            <div>
              <a href="#" aria-label="ONDAM AI 홈" className="inline-flex">
                <FooterLogo />
              </a>
              <p className="mt-6 max-w-xs text-sm leading-6 text-[#667085]">
                사람과 AI가 함께 일하는 더 나은 방식을 설계합니다.
              </p>
            </div>

            <nav
              className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4"
              aria-label="푸터 메뉴"
            >
              {footerMenus.map(menu => (
                <div key={menu.title}>
                  <strong className="text-sm font-bold text-[#1d2939]">{menu.title}</strong>
                  <ul className="mt-5 flex flex-col gap-3">
                    {menu.links.map(([label, href]) => (
                      <li key={href}>
                        <a
                          href={href}
                          className="text-sm text-[#667085] transition hover:text-[var(--brand-primary)]"
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

          <div className="flex flex-col gap-4 pt-7 text-xs text-[#8a94a6] sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 ONDAM AI. All rights reserved.</p>
            <div className="flex items-center gap-5">
              <a href="#privacy" className="transition hover:text-[#344054]">
                개인정보처리방침
              </a>
              <a href="#contact" className="transition hover:text-[#344054]">
                문의하기
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
