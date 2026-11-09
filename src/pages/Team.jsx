import { useEffect, useRef, useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';

const motionEase = [0.22, 1, 0.36, 1];

const leaders = [
  {
    name: '이호진',
    role: 'CEO',
    description: '사업 총괄 및 기획',
    career: [
      '정보보안, AI 사업 및 교육 경력 10년',
      '차세대보안리더양성프로그램 Best10 선정',
      '한국정보처리학회 협동이사',
    ],
    responsibilities: [
      'Enterprise AI 전략 및 사업 방향 수립',
      '제품 및 사업 포트폴리오 총괄',
      '시장 진입 및 사업 성장 전략 수립',
      '투자 유치 및 중장기 경영 전략 추진',
    ],
  },
  {
    name: '권영길',
    role: 'CTO',
    description: '플랫폼 개발 총괄',
    career: ['플랫폼 개발 및 유지보수 경력 8년', '삼성청년SW·AI아카데미(SSAFY) 수료'],
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
    description: '사업 전략 기획 및 영업',
    career: ['금융·공공·기업 AX 사업 경력 20년', '보안 엔지니어 10년'],
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
    description: '제품 개발 및 서비스 구현 총괄',
    career: ['스타트업 창업 및 개발 경력 5년', 'SW마에스트로 과정 수료'],
    responsibilities: [
      'Core Platform 및 제품 기능 설계',
      '백엔드 시스템 및 API 개발',
      '온프레미스 인프라 및 서비스 운영 환경 구축',
      '제품 안정성 확보 및 기능 고도화',
    ],
  },
  /// 리더님 공개 금지

  {
    name: '최명원',
    role: 'AI Lead',
    description: 'AI 기술 개발 총괄',
    career: ['실리콘밸리 소재 기업 AI 기술 개발 경력 4년', 'SW마에스트로 과정 수료'],
    responsibilities: [
      'LLM 기반 AI 서비스 및 핵심 기능 개발',
      'AI Policy 및 Intelligence 기술 개발',
      'AI 모델 연동 및 추론 성능 최적화',
      'AI 기술 검증 및 모델 성능 고도화',
    ],
  },
];

function LeaderCard({ leader, index, onSelect }) {
  return (
    <motion.button
      type="button"
      className="group min-w-0 appearance-none border-0 bg-transparent p-0 text-left"
      onClick={() => onSelect(leader)}
      aria-label={`${leader.name} ${leader.role} 상세 정보 보기`}
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      whileHover={{ y: -7 }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.68, delay: index * 0.07, ease: motionEase }}
    >
      <div
        className="relative aspect-[0.76] overflow-hidden rounded-[28px] bg-[#eef0f3] transition-shadow duration-300 group-hover:shadow-[0_18px_40px_rgba(15,23,42,0.10)] sm:rounded-[32px]"
        role="img"
        aria-label={`${leader.name} 프로필 사진 준비 중`}
      >
        <span className="sr-only">프로필 사진 준비 중</span>
        <span
          className="absolute right-4 bottom-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#20252c] text-white transition-transform duration-300 group-hover:translate-x-1 sm:right-5 sm:bottom-5"
          aria-hidden="true"
        >
          <ArrowRight className="h-[18px] w-[18px]" strokeWidth={1.7} />
        </span>
      </div>

      <div className="pt-5">
        <h2 className="text-[18px] leading-7 font-bold tracking-[-0.025em] text-[#15181d]">
          {leader.name}
          <span className="mx-1.5 text-[#c6c9ce]" aria-hidden="true">
            |
          </span>
          <span className="text-[16px] font-semibold">{leader.role}</span>
        </h2>
        <p className="mt-2 max-w-[36rem] text-[16px] leading-[1.7] tracking-[-0.02em] text-[#5f6670]">
          {leader.description}
        </p>
      </div>
    </motion.button>
  );
}

function LeaderModal({ leader, onClose }) {
  const closeButtonRef = useRef(null);
  const scrollAreaRef = useRef(null);
  const [showBottomFade, setShowBottomFade] = useState(false);

  useEffect(() => {
    if (!leader) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = event => {
      if (event.key === 'Escape') onClose();
    };
    const updateBottomFade = () => {
      const scrollArea = scrollAreaRef.current;
      if (!scrollArea) return;

      setShowBottomFade(
        scrollArea.scrollTop + scrollArea.clientHeight < scrollArea.scrollHeight - 8
      );
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', updateBottomFade);
    requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
      updateBottomFade();
    });

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', updateBottomFade);
    };
  }, [leader, onClose]);

  if (!leader) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[120] flex justify-end bg-[#11151b]/55 backdrop-blur-[2px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28, ease: motionEase }}
      onMouseDown={event => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.div
        className="relative h-full w-full max-w-[680px] overflow-hidden bg-white shadow-[-24px_0_70px_rgba(15,23,42,0.18)] sm:rounded-l-[40px]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="leader-modal-title"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 34, mass: 0.9 }}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-[#20252c] text-white transition hover:scale-105 hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#075df6] sm:top-8 sm:right-8"
          aria-label="상세 정보 닫기"
        >
          <X className="h-5 w-5" strokeWidth={1.7} />
        </button>

        <div
          ref={scrollAreaRef}
          className="h-full overflow-y-auto px-6 py-14 pb-28 sm:px-12 sm:py-16 sm:pb-32 lg:px-16"
          onScroll={() => {
            const scrollArea = scrollAreaRef.current;
            if (!scrollArea) return;
            setShowBottomFade(
              scrollArea.scrollTop + scrollArea.clientHeight < scrollArea.scrollHeight - 8
            );
          }}
        >
          <motion.div
            className="aspect-square w-[72%] max-w-[360px] rounded-[28px] bg-[#eef0f3] sm:rounded-[34px]"
            role="img"
            aria-label={`${leader.name} 프로필 사진 준비 중`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12, ease: motionEase }}
          />

          <motion.div
            className="mt-10 sm:mt-12"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18, ease: motionEase }}
          >
          <h2
            id="leader-modal-title"
            className="text-[30px] leading-tight font-bold tracking-[-0.05em] text-[#202328] sm:text-[36px]"
          >
            {leader.name}
            <span className="mx-2 text-[#c3c7cd]" aria-hidden="true">
              |
            </span>
            {leader.role}
          </h2>
          <p className="mt-4 text-[15px] leading-7 font-semibold tracking-[-0.025em] text-[#5e6570] sm:text-base">
            {leader.description}
          </p>

          <section className="mt-12 sm:mt-14" aria-labelledby="leader-career-title">
            <h3
              id="leader-career-title"
              className="text-lg font-bold tracking-[-0.025em] text-[#252930]"
            >
              주요 경력
            </h3>
            <ul className="mt-4 space-y-3 text-[15px] leading-7 tracking-[-0.02em] text-[#555d68] sm:text-base">
              {leader.career.map(item => (
                <li key={item} className="flex gap-3">
                  <span
                    className="mt-[0.7rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[#aab1bb]"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-9" aria-labelledby="leader-responsibilities-title">
            <h3
              id="leader-responsibilities-title"
              className="text-lg font-bold tracking-[-0.025em] text-[#252930]"
            >
              주요 역할
            </h3>
            <ul className="mt-4 space-y-3 text-[15px] leading-7 tracking-[-0.02em] text-[#555d68] sm:text-base">
              {leader.responsibilities.map(item => (
                <li key={item} className="flex gap-3">
                  <span
                    className="mt-[0.7rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[#aab1bb]"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
          </motion.div>
        </div>

        <div
          className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-t from-white via-white/88 to-transparent transition-opacity duration-300 sm:h-32 ${
            showBottomFade ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden="true"
        />
      </motion.div>
    </motion.div>
  );
}

export default function Team() {
  const [selectedLeader, setSelectedLeader] = useState(null);

  return (
    <>
      <section id="team" className="bg-white">
        <div className="mx-auto w-full max-w-[1600px] px-5 pt-[calc(var(--site-header-height)+4.5rem)] pb-24 sm:px-6 sm:pb-28 lg:px-8 lg:pt-[calc(var(--site-header-height)+6rem)] lg:pb-36 min-[1600px]:px-0">
          <header>
            <h1 className="text-[32px] leading-[1.25] font-bold tracking-[-0.055em] text-[#202328] sm:text-[38px] lg:text-[42px]">
              온담 AI를 이끌어가는 사람들
            </h1>
            <p className="mt-4 text-[17px] leading-7 font-medium tracking-[-0.025em] text-[#464d57] sm:text-[20px]">
              사업 전략부터 AI 기술 개발까지, 전문성을 갖춘 핵심 인력
            </p>
            <div className="mt-8 h-px w-full bg-[#dfe2e6] sm:mt-9" />
          </header>

          <div className="mx-auto mt-10 max-w-[1120px] sm:mt-12">
            <div className="mx-auto grid max-w-[738px] gap-x-5 gap-y-14 sm:grid-cols-2 sm:gap-x-6 lg:gap-x-7">
              {leaders.slice(0, 2).map(leader => (
                <LeaderCard key={leader.name} leader={leader} onSelect={setSelectedLeader} />
              ))}
            </div>
            <div className="mt-14 grid gap-x-5 gap-y-14 sm:mt-16 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-16 md:grid-cols-3 md:gap-x-5 lg:gap-x-7 xl:mt-18 xl:gap-y-18">
              {leaders.slice(2).map(leader => (
                <LeaderCard key={leader.name} leader={leader} onSelect={setSelectedLeader} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <LeaderModal leader={selectedLeader} onClose={() => setSelectedLeader(null)} />
    </>
  );
}
