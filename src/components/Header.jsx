import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';

const HEADER_HEIGHT = 90;

function Container({ children, className = '' }) {
  return (
    <div
      className={`mx-auto w-full max-w-[1600px] px-5 sm:px-6 lg:px-8 min-[1600px]:px-0 ${className}`}
    >
      {children}
    </div>
  );
}

function HeaderLogo({ inverse = false }) {
  return (
    <span className="relative block h-[27px] w-[145px] overflow-hidden min-[981px]:h-8 min-[981px]:w-[173px]">
      <img
        src="/ondam_logo.png"
        alt="ONDAM AI"
        className={`absolute top-[-17px] left-[-19px] h-auto w-[180px] max-w-none object-contain min-[981px]:top-[-21px] min-[981px]:left-[-22px] min-[981px]:w-[215px] ${inverse ? 'brightness-0 invert' : ''}`}
      />
    </span>
  );
}

export default function Header() {
  const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
  const isCareersPage = currentPath === '/careers';
  const items = useMemo(
    () => [
      {
        label: '회사소개',
        href: '#company',
        children: [
          { label: '회사소개', href: '#about' },
          { label: '비전과 미션', href: '#vision' },
          { label: '핵심역량', href: '#capabilities' },
          { label: '핵심 인력', href: '#team' },
        ],
      },
      {
        label: '솔루션&서비스',
        href: '#platform',
        children: [
          { label: '플랫폼 개요', href: '#platform-overview' },
          { label: 'Discover', href: '#discover' },
          { label: 'Control Internal', href: '#control-internal' },
          { label: 'Control External', href: '#control-external' },
          { label: 'Manage', href: '#manage' },
        ],
      },
      {
        label: '핵심기술',
        href: '#technology',
        children: [
          { label: 'AI Intelligence', href: '#enterprise-ai-intelligence' },
          { label: 'Policy Engine', href: '#policy-engine' },
          { label: 'LLM Intelligence', href: '#service-intelligence' },
          { label: 'Multi LLM', href: '#multi-llm' },
          { label: 'AI Governance', href: '#ai-governance' },
        ],
      },
      {
        label: '채용',
        href: '/careers',
        children: [
          { label: '인재상', href: '/careers#talent' },
          { label: '직무 소개', href: '/careers#roles' },
          { label: '채용 공고', href: '/careers#openings' },
          { label: '채용 절차', href: '/careers#hiring-process' },
          { label: '복리후생', href: '/careers#benefits' },
        ],
      },
      {
        label: '고객지원',
        href: '#support',
        children: [
          { label: '도입 문의', href: '/contact' },
          { label: '오시는 길', href: '/location' },
          { label: 'FAQ', href: '/faq' },
        ],
      },
    ],
    []
  );
  const [isAtTop, setIsAtTop] = useState(true);
  const [isHidden, setIsHidden] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [openMobileMenu, setOpenMobileMenu] = useState(null);
  const [activeMenuIndex, setActiveMenuIndex] = useState(null);
  const [activeSitemapChild, setActiveSitemapChild] = useState(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, visible: false });
  const lastScrollTop = useRef(0);
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = Math.max(window.scrollY, 0);
      const delta = scrollTop - lastScrollTop.current;

      setIsAtTop(scrollTop <= 10);

      if (!isMenuOpen && Math.abs(delta) > 5) {
        if (scrollTop > lastScrollTop.current && scrollTop > HEADER_HEIGHT) {
          setIsHidden(true);
          setIsDropdownOpen(false);
          setActiveMenuIndex(null);
        } else {
          const isBeforeDocumentEnd =
            scrollTop + window.innerHeight < document.documentElement.scrollHeight;

          if (isBeforeDocumentEnd) {
            setIsHidden(false);
          }
        }
      }

      if (scrollTop <= 10) {
        setIsHidden(false);
      }

      lastScrollTop.current = scrollTop;
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';

    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
    setOpenMobileMenu(null);
    setActiveMenuIndex(null);
    setActiveSitemapChild(null);
    setIndicator(current => ({ ...current, visible: false }));
  };

  const moveIndicatorTo = (menuItem, index) => {
    const nav = navRef.current;

    if (!nav || !menuItem) return;

    const navRect = nav.getBoundingClientRect();
    const itemRect = menuItem.getBoundingClientRect();

    setIndicator({
      left: itemRect.left - navRect.left,
      width: itemRect.width,
      visible: true,
    });
    setActiveMenuIndex(index);
  };

  const moveIndicator = (event, index) => {
    moveIndicatorTo(event.currentTarget, index);
  };

  const moveIndicatorFromMenuGroup = (event, index) => {
    moveIndicatorTo(event.currentTarget.querySelector('[data-menu-trigger]'), index);
  };

  const hasSolidBackground = isCareersPage || !isAtTop || isDropdownOpen;
  const foregroundClass = 'text-[#1c2025]';

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[80] transition-[transform,background-color,box-shadow] duration-400 ease-out ${
          isHidden && !isMenuOpen ? '-translate-y-full' : 'translate-y-0'
        } ${hasSolidBackground ? 'bg-white shadow-[0_8px_30px_rgba(23,23,23,0.08)]' : 'bg-transparent'}`}
      >
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 hidden overflow-hidden bg-white shadow-[0_12px_32px_rgba(23,23,23,0.1)] transition-[height,opacity] duration-400 min-[1200px]:block ${
            isDropdownOpen ? 'h-[402px] opacity-100' : 'h-[90px] opacity-0'
          }`}
          aria-hidden="true"
        >
          <span className="absolute inset-x-0 top-[89px] h-px bg-[#e5e7eb]" />
        </div>

        <Container className="relative z-20 flex h-[70px] items-center justify-between min-[681px]:h-[80px] min-[981px]:h-[90px]">
          <a
            href="#"
            className="relative z-10 inline-flex items-center min-[981px]:-ml-2.5"
            aria-label="ONDAM AI 홈"
            onClick={closeMenus}
          >
            <HeaderLogo />
          </a>

          <nav
            ref={navRef}
            className={`absolute top-0 left-1/2 z-10 hidden -translate-x-1/2 items-stretch overflow-hidden transition-[height] duration-400 min-[1200px]:flex ${
              isDropdownOpen ? 'h-[402px]' : 'h-[90px]'
            }`}
            aria-label="주요 메뉴"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => {
              setIsDropdownOpen(false);
              setActiveMenuIndex(null);
              setIndicator(current => ({ ...current, visible: false }));
            }}
          >
            {items.map((item, index) => (
              <div
                key={item.href}
                className={`relative flex h-full flex-col items-center transition-[padding] duration-300 ${
                  isDropdownOpen ? 'px-[30px] min-[1501px]:px-[60px]' : 'px-[30px]'
                }`}
                onMouseEnter={event => moveIndicatorFromMenuGroup(event, index)}
                onTransitionEnd={event => {
                  if (
                    index === activeMenuIndex &&
                    (event.propertyName === 'padding-left' ||
                      event.propertyName === 'padding-right')
                  ) {
                    moveIndicatorTo(
                      event.currentTarget.querySelector('[data-menu-trigger]'),
                      index
                    );
                  }
                }}
              >
                <a
                  href={item.href}
                  data-menu-trigger
                  className="flex h-[90px] shrink-0 items-center whitespace-nowrap text-[18px] font-semibold transition-colors duration-300"
                  style={{
                    color: activeMenuIndex === index ? 'var(--brand-primary)' : '#1c2025',
                  }}
                  onFocus={event => {
                    setIsDropdownOpen(true);
                    moveIndicator(event, index);
                  }}
                  onClick={closeMenus}
                >
                  {item.label}
                </a>
                <ul className="flex w-full flex-col items-center gap-2 pt-7">
                  {item.children.map(child => (
                    <li key={child.href}>
                      <a
                        href={child.href}
                        className="whitespace-nowrap text-[16px] leading-6 text-[#60656f] transition hover:font-semibold hover:text-[var(--brand-primary)] hover:underline"
                        onClick={closeMenus}
                      >
                        {child.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <span
              className="pointer-events-none absolute top-[88px] h-0.5 bg-[var(--brand-primary)] transition-[left,width,opacity] duration-350 ease-out"
              style={{
                left: indicator.left,
                width: indicator.width,
                opacity: indicator.visible ? 1 : 0,
              }}
              aria-hidden="true"
            />
          </nav>

          <div
            className={`relative z-10 flex items-center gap-2 min-[981px]:gap-5 ${foregroundClass}`}
          >
            <button
              type="button"
              className="grid h-11 w-11 place-items-center transition-colors hover:text-[var(--brand-primary)]"
              aria-label="전체 메뉴 열기"
              aria-expanded={isMenuOpen}
              onClick={() => {
                setIsMenuOpen(true);
                setIsDropdownOpen(false);
                setOpenMobileMenu(null);
                setIsHidden(false);
              }}
            >
              <Menu className="h-7 w-7" strokeWidth={1.7} />
            </button>
          </div>
        </Container>
      </header>

      <div
        className={`fixed inset-0 z-[90] bg-[var(--brand-primary)] text-white transition-[opacity,visibility] duration-400 ${
          isMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
        aria-hidden={!isMenuOpen}
      >
        <Container className="relative z-20 flex h-[70px] items-center justify-between border-b border-white/20 min-[681px]:h-[80px] min-[981px]:h-[90px]">
          <a
            href="#"
            className="inline-flex items-center min-[981px]:-ml-2.5"
            aria-label="ONDAM AI 홈"
            onClick={closeMenus}
          >
            <HeaderLogo inverse />
          </a>
          <div className="flex items-center gap-2 min-[981px]:gap-5">
            <button
              type="button"
              className="group grid h-11 w-11 place-items-center"
              aria-label="전체 메뉴 닫기"
              onClick={closeMenus}
            >
              <X
                className="h-8 w-8 transition-transform duration-300 ease-out group-hover:rotate-90 group-active:scale-75"
                strokeWidth={1.6}
              />
            </button>
          </div>
        </Container>

        <Container className="absolute inset-x-0 top-[70px] z-10 flex h-[calc(100dvh-70px)] items-start overflow-y-auto py-6 min-[681px]:top-0 min-[681px]:h-full min-[681px]:items-center min-[681px]:py-10">
          <nav className="w-full min-[681px]:hidden" aria-label="모바일 전체 메뉴">
            {items.map((item, index) => {
              const isOpen = openMobileMenu === index;

              return (
                <div key={`mobile-${item.href}`} className="border-b border-white/15">
                  <button
                    type="button"
                    className="flex min-h-16 w-full items-center justify-between px-2 text-left text-lg font-semibold transition-colors hover:bg-white/10 hover:text-[#8BC6FF]"
                    onClick={() => setOpenMobileMenu(current => (current === index ? null : index))}
                    aria-expanded={isOpen}
                  >
                    {item.label}
                    <ChevronDown
                      className={`h-5 w-5 text-white/60 transition-transform duration-300 ${isOpen ? 'rotate-180 text-white' : ''}`}
                    />
                  </button>
                  <div
                    className={`grid overflow-hidden bg-white/5 transition-[grid-template-rows] duration-300 ${
                      isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <ul className="min-h-0">
                      {item.children.map(child => (
                        <li key={`mobile-${child.href}`}>
                          <a
                            href={child.href}
                            className="block px-4 py-3 text-sm text-white/75 transition-[color,transform] duration-300 hover:translate-x-1 hover:text-[#8BC6FF]"
                            onClick={closeMenus}
                          >
                            {child.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </nav>

          <nav
            className="hidden w-full gap-0 min-[681px]:grid min-[681px]:grid-cols-2 min-[981px]:grid-cols-3 min-[1200px]:flex min-[1200px]:gap-[50px]"
            aria-label="전체 메뉴"
          >
            {items.map(item => (
              <div
                key={`sitemap-${item.href}`}
                className="py-6 min-[681px]:min-h-60 min-[681px]:border-r min-[681px]:border-white/15 min-[681px]:px-7 min-[681px]:py-4 min-[1200px]:min-h-[320px] min-[1200px]:w-[calc((100%-200px)/5)] min-[1200px]:shrink-0 min-[1200px]:px-0 min-[1200px]:last:border-r-0"
              >
                <a
                  href={item.href}
                  className="block text-[28px] leading-[40px] font-bold tracking-[-0.84px] transition-colors duration-300"
                  onClick={closeMenus}
                >
                  {item.label}
                </a>
                <ul className="mt-5 flex flex-col gap-1.5">
                  {item.children.map(child => (
                    <li key={`sitemap-${child.href}`}>
                      <a
                        href={child.href}
                        className="inline-block text-[18px] leading-8 font-normal tracking-[-0.54px] transition-[color,transform] duration-300"
                        style={{
                          color:
                            activeSitemapChild === child.href ? '#ffffff' : 'rgba(255,255,255,0.8)',
                        }}
                        onPointerEnter={() => setActiveSitemapChild(child.href)}
                        onPointerLeave={() => setActiveSitemapChild(null)}
                        onClick={closeMenus}
                      >
                        {child.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </Container>
      </div>
    </>
  );
}
