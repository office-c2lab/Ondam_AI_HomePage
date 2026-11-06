import { useEffect, useMemo, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';

const HEADER_HEIGHT = 90;

function Container({ children, className = '' }) {
  return (
    <div className={`mx-auto w-full max-w-[1380px] px-5 sm:px-6 lg:px-8 xl:px-10 ${className}`}>
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
  const items = useMemo(
    () => [
      { label: 'AI GOVERNANCE', href: '#ai-governance' },
      { label: '구성도', href: '#architecture' },
      { label: '대시보드', href: '#usage-dashboard' },
      { label: '모니터링', href: '#prompt-monitoring' },
      { label: '정책', href: '#policy-management' },
      { label: '운영지원', href: '#easy-deployment' },
      { label: 'FAQ', href: '#faq' },
    ],
    []
  );
  const [isAtTop, setIsAtTop] = useState(true);
  const [isHidden, setIsHidden] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    setIndicator(current => ({ ...current, visible: false }));
  };

  const moveIndicator = event => {
    const nav = navRef.current;
    const menuItem = event.currentTarget;

    if (!nav) return;

    const navRect = nav.getBoundingClientRect();
    const itemRect = menuItem.getBoundingClientRect();

    setIndicator({
      left: itemRect.left - navRect.left,
      width: itemRect.width,
      visible: true,
    });
  };

  const hasSolidBackground = !isAtTop;
  const foregroundClass = 'text-[#1c2025]';

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[80] transition-[transform,background-color,box-shadow] duration-400 ease-out ${
          isHidden && !isMenuOpen ? '-translate-y-full' : 'translate-y-0'
        } ${hasSolidBackground ? 'bg-white shadow-[0_8px_30px_rgba(23,23,23,0.08)]' : 'bg-transparent'}`}
      >
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
            className="absolute inset-y-0 left-1/2 hidden -translate-x-1/2 items-stretch min-[1501px]:flex"
            aria-label="주요 메뉴"
            onMouseLeave={() => setIndicator(current => ({ ...current, visible: false }))}
          >
            {items.map(item => (
              <a
                key={item.href}
                href={item.href}
                className={`relative flex whitespace-nowrap px-5 text-[15px] font-semibold transition-colors duration-300 hover:text-[var(--brand-primary)] focus-visible:text-[var(--brand-primary)] ${foregroundClass}`}
                onMouseEnter={moveIndicator}
                onFocus={moveIndicator}
                onClick={closeMenus}
              >
                <span className="flex items-center">{item.label}</span>
              </a>
            ))}
            <span
              className="pointer-events-none absolute bottom-0 h-0.5 bg-[var(--brand-primary)] transition-[left,width,opacity] duration-350 ease-out"
              style={{
                left: indicator.left,
                width: indicator.width,
                opacity: indicator.visible ? 1 : 0,
              }}
              aria-hidden="true"
            />
          </nav>

          <button
            type="button"
            className={`relative z-10 grid h-11 w-11 place-items-center transition-colors duration-300 hover:text-[var(--brand-primary)] ${foregroundClass}`}
            aria-label="전체 메뉴 열기"
            aria-expanded={isMenuOpen}
            onClick={() => {
              setIsMenuOpen(true);
              setIsHidden(false);
            }}
          >
            <Menu className="h-7 w-7" strokeWidth={1.7} />
          </button>
        </Container>
      </header>

      <div
        className={`fixed inset-0 z-[90] bg-[var(--brand-primary)] text-white transition-[opacity,visibility] duration-400 ${
          isMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
        aria-hidden={!isMenuOpen}
      >
        <Container className="flex h-[70px] items-center justify-between border-b border-white/20 min-[681px]:h-[80px] min-[981px]:h-[90px]">
          <a
            href="#"
            className="inline-flex items-center min-[981px]:-ml-2.5"
            aria-label="ONDAM AI 홈"
            onClick={closeMenus}
          >
            <HeaderLogo inverse />
          </a>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center transition hover:rotate-90"
            aria-label="전체 메뉴 닫기"
            onClick={() => setIsMenuOpen(false)}
          >
            <X className="h-8 w-8" strokeWidth={1.6} />
          </button>
        </Container>

        <Container className="flex h-[calc(100dvh-70px)] items-center overflow-y-auto py-10 min-[681px]:h-[calc(100dvh-80px)] min-[981px]:h-[calc(100dvh-90px)]">
          <nav
            className="grid w-full grid-cols-1 gap-0 min-[681px]:grid-cols-2 min-[981px]:grid-cols-3 min-[1501px]:grid-cols-7"
            aria-label="전체 메뉴"
          >
            {items.map((item, index) => (
              <a
                key={`sitemap-${item.href}`}
                href={item.href}
                className="group border-b border-white/20 py-6 min-[681px]:min-h-40 min-[681px]:border-r min-[681px]:px-7 min-[681px]:py-9 min-[1501px]:min-h-56"
                onClick={closeMenus}
              >
                <span className="mb-4 block text-xs font-semibold tracking-[0.14em] text-white/55">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="block text-2xl font-semibold tracking-[-0.03em] transition-transform duration-300 group-hover:translate-x-2 sm:text-3xl">
                  {item.label}
                </span>
              </a>
            ))}
          </nav>
        </Container>
      </div>
    </>
  );
}
