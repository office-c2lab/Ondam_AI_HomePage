export const solutions = {
  discover: {
    name: 'Discover',
    category: 'AI 서비스 발견 · 분석',
    headline: ['AI 서비스를 발견하고,', '위험을 먼저 파악하세요.'],
    description:
      '끊임없이 등장하는 LLM 서비스를 발견하고 분석합니다. 서비스의 식별 정보와 위험도를 확인하고, 기업의 AI 보안 정책에 활용합니다.',
    features: [
      {
        title: 'URL 기반 서비스 검사',
        description: 'AI 서비스의 URL을 검사해 제공사와 서비스 유형, 식별 근거를 확인합니다.',
      },
      {
        title: 'LLM Intelligence DB',
        description: 'AI 서비스의 최신 정보를 모아 서비스 특성과 위험도를 파악합니다.',
      },
      {
        title: '보안 정책에 활용',
        description: '분석한 서비스 정보를 바탕으로 기업의 AI 사용 정책을 수립하고 관리합니다.',
      },
    ],
  },
  'control-internal': {
    name: 'Control Internal',
    category: '내부 AI 사용 환경 · 통합 관리',
    headline: ['사내 AI 사용 환경을,', '하나의 플랫폼에서.'],
    description:
      '기업 내부에 멀티 LLM 사용 환경을 제공합니다. AI 서비스 연결부터 대화형 AI 이용, 사용 이력과 감사 로그까지 한곳에서 관리합니다.',
    features: [
      {
        title: '멀티 LLM 사용 환경',
        description: '연결된 AI 서비스를 하나의 대화형 플랫폼에서 이용합니다.',
      },
      {
        title: 'AI 서비스 연동',
        description: 'AI 서비스의 엔드포인트와 API Key를 통합 관리합니다.',
      },
      {
        title: '사용 이력 · 감사 로그',
        description: '사내 AI 사용 이력과 감사 로그를 모아 운영 현황을 확인합니다.',
      },
    ],
  },
  'control-external': {
    name: 'Control External',
    category: '외부 AI 사용 통제 · 데이터 보호',
    headline: ['외부 AI를 사용하는 순간에도,', '기업의 정책이 함께합니다.'],
    description:
      '외부 AI 서비스의 프롬프트와 데이터를 분석하고 사용 경로를 통제합니다. 기업의 보안 정책에 맞춰 개인정보와 기밀정보를 보호합니다.',
    features: [
      {
        title: '프롬프트 · 데이터 분석',
        description: '외부 AI로 전달되는 프롬프트와 데이터를 분석해 보안 정책을 적용합니다.',
      },
      {
        title: '개인정보 · 기밀정보 보호',
        description: '개인정보 마스킹과 기밀정보 차단, 프롬프트 허용 정책을 적용합니다.',
      },
      {
        title: '탐지 · 차단 이력 관리',
        description: '정책에 따른 탐지와 차단 이력을 감사 로그로 관리합니다.',
      },
    ],
  },
  manage: {
    name: 'Manage',
    category: 'AI App · Agent 운영 관리',
    headline: ['AI App과 Agent의', '시작부터 운영까지.'],
    description:
      '임직원이 만든 AI App과 Agent를 안전하게 등록하고 검사·배포·운영합니다. 등록부터 검토와 승인, 버전 관리와 폐기까지 전 과정을 관리합니다.',
    features: [
      {
        title: '등록 · 보안 검사',
        description: '소스코드와 설명서, 생성 정보를 등록하고 자동 보안 검사를 수행합니다.',
      },
      {
        title: '검토 · 승인 · 배포',
        description: '검토와 승인을 거친 AI App과 Agent를 App Store에 배포합니다.',
      },
      {
        title: '버전 · 수명 주기 관리',
        description: '배포 이후의 버전 관리와 운영, 폐기까지 일관된 흐름으로 관리합니다.',
      },
    ],
  },
};
