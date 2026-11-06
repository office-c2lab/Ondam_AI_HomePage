const nowKst = () =>
  new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date());

const clone = value => structuredClone(value);

const createResponse = value => Promise.resolve(clone(value));

const normalizeKind = kind => {
  if (kind === 'departments') return 'departments';
  if (kind === 'positions') return 'positions';

  return kind;
};

const singularTypeByKind = {
  departments: 'department',
  positions: 'position',
};

const mockStore = {
  domains: {
    domains: [
      {
        service_code: 'chatgpt',
        service_name: 'ChatGPT',
        url: 'https://chatgpt.com/',
        enabled: true,
      },
      {
        service_code: 'gemini',
        service_name: 'Gemini',
        url: 'https://gemini.google.com/',
        enabled: true,
      },
      {
        service_code: 'claude',
        service_name: 'Claude',
        url: 'https://claude.ai/',
        enabled: true,
      },
      {
        service_code: 'genspark',
        service_name: 'Genspark',
        url: 'https://www.genspark.ai/',
        enabled: true,
      },
      {
        service_code: 'ms_copilot',
        service_name: 'MS Copilot',
        url: 'https://copilot.microsoft.com/',
        enabled: true,
      },
    ],
  },
  policies: {
    applied_services: ['ChatGPT', 'Gemini', 'Claude', 'Genspark', 'MS Copilot'],
    policies: [
      {
        code: 'pii_protection',
        name: '개인정보 보호 정책',
        description: '입력 프롬프트의 개인정보를 탐지합니다.',
        enabled: true,
        updated_at_kst: '2026-06-30 20:30:58',
      },
      {
        code: 'file_upload_protection',
        name: '파일 업로드 보호 정책',
        description: '외부 AI 서비스에 업로드되는 파일의 확장자를 기준으로 전송을 차단합니다.',
        enabled: true,
        updated_at_kst: '2026-06-30 20:31:07',
      },
    ],
  },
  fileUploadExtensions: {
    policy_code: 'file_upload_protection',
    enabled: true,
    extensions: [
      {
        extension: '7z',
        label: '7-Zip 압축파일',
        category: 'archive',
        mime_types: ['application/x-7z-compressed'],
        blocked: true,
      },
      {
        extension: 'gz',
        label: 'Gzip 압축파일',
        category: 'archive',
        mime_types: ['application/gzip'],
        blocked: true,
      },
      {
        extension: 'rar',
        label: 'RAR 압축파일',
        category: 'archive',
        mime_types: ['application/vnd.rar', 'application/x-rar-compressed'],
        blocked: true,
      },
      {
        extension: 'tar',
        label: 'TAR 압축파일',
        category: 'archive',
        mime_types: ['application/x-tar'],
        blocked: true,
      },
      {
        extension: 'zip',
        label: 'ZIP 압축파일',
        category: 'archive',
        mime_types: ['application/zip'],
        blocked: true,
      },
      {
        extension: 'env',
        label: '환경 변수 파일',
        category: 'credential',
        mime_types: ['text/plain'],
        blocked: true,
      },
      {
        extension: 'key',
        label: '키 파일',
        category: 'credential',
        mime_types: ['application/octet-stream', 'text/plain'],
        blocked: true,
      },
      {
        extension: 'pem',
        label: 'PEM 인증서/키 파일',
        category: 'credential',
        mime_types: ['application/x-pem-file', 'text/plain'],
        blocked: true,
      },
      {
        extension: 'csv',
        label: 'CSV 파일',
        category: 'data',
        mime_types: ['text/csv'],
        blocked: true,
      },
      {
        extension: 'json',
        label: 'JSON 파일',
        category: 'data',
        mime_types: ['application/json'],
        blocked: false,
      },
      {
        extension: 'tsv',
        label: 'TSV 파일',
        category: 'data',
        mime_types: ['text/tab-separated-values'],
        blocked: false,
      },
      {
        extension: 'xml',
        label: 'XML 파일',
        category: 'data',
        mime_types: ['application/xml', 'text/xml'],
        blocked: false,
      },
      {
        extension: 'yaml',
        label: 'YAML 파일',
        category: 'data',
        mime_types: ['application/yaml', 'text/yaml', 'text/x-yaml'],
        blocked: false,
      },
      {
        extension: 'doc',
        label: 'Word 97-2003 문서',
        category: 'document',
        mime_types: ['application/msword'],
        blocked: false,
      },
      {
        extension: 'docx',
        label: 'Word 문서',
        category: 'document',
        mime_types: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        blocked: false,
      },
      {
        extension: 'hwp',
        label: '한글 문서',
        category: 'document',
        mime_types: ['application/x-hwp'],
        blocked: false,
      },
      {
        extension: 'hwpx',
        label: '한글 표준 문서',
        category: 'document',
        mime_types: ['application/hwp+zip'],
        blocked: false,
      },
      {
        extension: 'pdf',
        label: 'PDF 문서',
        category: 'document',
        mime_types: ['application/pdf'],
        blocked: true,
      },
      {
        extension: 'ppt',
        label: 'PowerPoint 97-2003 문서',
        category: 'document',
        mime_types: ['application/vnd.ms-powerpoint'],
        blocked: false,
      },
      {
        extension: 'pptx',
        label: 'PowerPoint 문서',
        category: 'document',
        mime_types: ['application/vnd.openxmlformats-officedocument.presentationml.presentation'],
        blocked: false,
      },
      {
        extension: 'xls',
        label: 'Excel 97-2003 문서',
        category: 'document',
        mime_types: ['application/vnd.ms-excel'],
        blocked: false,
      },
      {
        extension: 'xlsx',
        label: 'Excel 문서',
        category: 'document',
        mime_types: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
        blocked: false,
      },
      {
        extension: 'gif',
        label: 'GIF 이미지',
        category: 'image',
        mime_types: ['image/gif'],
        blocked: false,
      },
      {
        extension: 'jpeg',
        label: 'JPEG 이미지',
        category: 'image',
        mime_types: ['image/jpeg'],
        blocked: false,
      },
      {
        extension: 'jpg',
        label: 'JPEG 이미지',
        category: 'image',
        mime_types: ['image/jpeg'],
        blocked: false,
      },
      {
        extension: 'png',
        label: 'PNG 이미지',
        category: 'image',
        mime_types: ['image/png'],
        blocked: true,
      },
      {
        extension: 'webp',
        label: 'WebP 이미지',
        category: 'image',
        mime_types: ['image/webp'],
        blocked: false,
      },
      {
        extension: 'java',
        label: 'Java 소스 파일',
        category: 'source_code',
        mime_types: ['text/x-java-source', 'text/plain'],
        blocked: false,
      },
      {
        extension: 'js',
        label: 'JavaScript 소스 파일',
        category: 'source_code',
        mime_types: ['text/javascript', 'application/javascript'],
        blocked: false,
      },
      {
        extension: 'py',
        label: 'Python 소스 파일',
        category: 'source_code',
        mime_types: ['text/x-python', 'text/plain'],
        blocked: false,
      },
      {
        extension: 'sql',
        label: 'SQL 파일',
        category: 'source_code',
        mime_types: ['application/sql', 'text/plain'],
        blocked: false,
      },
      {
        extension: 'ts',
        label: 'TypeScript 소스 파일',
        category: 'source_code',
        mime_types: ['text/plain'],
        blocked: false,
      },
      {
        extension: 'md',
        label: 'Markdown 문서',
        category: 'text',
        mime_types: ['text/markdown', 'text/plain'],
        blocked: false,
      },
      {
        extension: 'txt',
        label: '텍스트 파일',
        category: 'text',
        mime_types: ['text/plain'],
        blocked: false,
      },
    ],
  },
  templateSettings: {
    logo_path: '',
    company_name: '(주) 씨투랩',
    company_description: '씨투랩 C2Lab은 신뢰할 수 있는 AI 보안을 만드는 AI 보안 전문 기업입니다.',
    support_email: 'info@aictl.kr',
    support_phone: '02-6956-7950',
  },
  downloadSettings: {
    download_path: '/download',
  },
  clients: {
    clients: [
      {
        id: 1,
        client_id: '4e4d13f8-fbcc-4436-a604-86ca9871e871',
        client_ip: '127.0.0.2',
        time_kst: '2026-06-30 18:25:46',
        user_name: '백종현',
        email: 'bjh@aictl.kr',
        department_option_id: 2,
        position_option_id: 4,
        department: '혁신연구팀',
        position: '주임',
      },

      {
        id: 3,
        client_id: '249175fd-25be-4546-8ffa-86ec03202933',
        client_ip: '127.0.0.29',
        time_kst: '2026-06-10 12:37:33',
        user_name: '유동석',
        email: 'yds@aictl.kr',
        department_option_id: 3,
        position_option_id: 4,
        department: '기술개발팀',
        position: '주임',
      },
    ],
  },
  dropdowns: {
    departments: {
      options: [
        {
          id: 2,
          type: 'department',
          name: '혁신연구팀',
          description: '신규 기술과 서비스 아이디어를 연구합니다.',
          sort_order: 3,
          employee_count: 1,
          created_at_kst: '2026-06-29 14:43:06',
          updated_at_kst: '2026-07-02 11:29:04',
        },

        {
          id: 3,
          type: 'department',
          name: '기술개발팀',
          description: '제품 기능과 내부 시스템 개발을 담당합니다.',
          sort_order: 5,
          employee_count: 1,
          created_at_kst: '2026-06-29 14:43:06',
          updated_at_kst: '2026-07-02 11:29:04',
        },
      ],
    },
    positions: {
      options: [
        {
          id: 5,
          type: 'position',
          name: '선임',
          description: '주요 과제를 주도하고 실무를 리딩합니다.',
          sort_order: 2,
          employee_count: 0,
          created_at_kst: '2026-06-29 14:43:06',
          updated_at_kst: '2026-07-02 11:10:58',
        },
        {
          id: 4,
          type: 'position',
          name: '주임',
          description: '실무 업무를 안정적으로 수행하는 직책입니다.',
          sort_order: 3,
          employee_count: 2,
          created_at_kst: '2026-06-29 14:43:06',
          updated_at_kst: '2026-07-02 11:10:58',
        },
        {
          id: 6,
          type: 'position',
          name: '팀장',
          description: '팀 운영과 목표 달성을 책임지는 직책입니다.',
          sort_order: 4,
          employee_count: 0,
          created_at_kst: '2026-06-29 14:43:06',
          updated_at_kst: '2026-07-02 11:10:58',
        },
      ],
    },
  },
  monitoring: {
    events: [
      {
        no: 5,
        client_ip: '127.0.0.2',
        user_name: '백종현',
        department: '혁신연구팀',
        position: '주임',
        time_kst: '2026-06-29 11:22:18',
        service: 'ChatGPT',
        original_input: '신규 보안 정책 공지문 초안 작성해줘',
        forwarded_input: '신규 보안 정책 공지문 초안 작성해줘',
        ai_response: '임직원 안내용 공지문 형식으로 핵심 변경 사항을 정리해드릴게요.',
        status: '정상',
        guardrail_reason: '',
        policy_code: '',
        policy_name: '',
      },
      {
        no: 4,
        client_ip: '127.0.0.2',
        user_name: '백종현',
        department: '혁신연구팀',
        position: '주임',
        time_kst: '2026-06-29 11:26:42',
        service: 'Gemini',
        original_input: '이번 주 시장 조사 요약해줘',
        forwarded_input: '이번 주 시장 조사 요약해줘',
        ai_response: '주요 시장 변화와 경쟁사 동향을 중심으로 요약해드릴게요.',
        status: '정상',
        guardrail_reason: '',
        policy_code: '',
        policy_name: '',
      },
      {
        no: 3,
        client_ip: '127.0.0.2',
        user_name: '백종현',
        department: '혁신연구팀',
        position: '주임',
        time_kst: '2026-06-29 11:28:11',
        service: 'Claude',
        original_input:
          '교수님 이메일은 test123@gmail.com이야 이 이메일로 교수님께 문의드릴 내용이 있다고 메일 작성해서 보내줘',
        forwarded_input:
          '교수님 이메일은 *****************이야 이 이메일로 교수님께 문의드릴 내용이 있다고 메일 작성해서 보내줘',
        ai_response: '문의 내용이 아직 비어 있어서 바로 보내기보다는 메일 초안을 먼저 쓰면 됩니다.',
        status: '마스킹',
        guardrail_reason: '개인정보 보호 정책: 이메일 주소가 포함되어 있습니다.',
        policy_code: 'pii_protection',
        policy_name: '개인정보 보호 정책',
      },
      {
        no: 2,
        client_ip: '127.0.0.2',
        user_name: '백종현',
        department: '혁신연구팀',
        position: '주임',
        time_kst: '2026-06-30 19:27:11',
        service: 'Genspark',
        original_input: '파일 업로드: 고객사_제안서_초안.pdf',
        uploaded_files: [{ name: '고객사_제안서_초안.pdf', size: '2.4MB' }],
        file_analysis_results: [
          {
            file_name: '고객사_제안서_초안.pdf',
            status: '차단',
            reason: '파일 업로드 보호 정책에 의해 PDF 확장자가 차단되었습니다.',
          },
        ],
        forwarded_input: '파일 업로드 보호 정책에 의해 차단되어 외부 AI에 전달되지 않았습니다.',
        ai_response: '파일 업로드 보호 정책에 의해 차단되어 외부 AI에 전달되지 않았습니다.',
        status: '차단',
        guardrail_reason: '파일 업로드 보호 정책: 차단 확장자 .pdf 파일 업로드가 탐지되었습니다.',
        policy_code: 'file_upload_protection',
        policy_name: '파일 업로드 보호 정책',
      },
      {
        no: 1,
        client_ip: '127.0.0.2',
        user_name: '백종현',
        department: '혁신연구팀',
        position: '주임',
        time_kst: '2026-06-30 19:24:11',
        service: 'MS Copilot',
        original_input:
          '직원 주민등록번호 900101-1234567, 계좌번호 110-123-456789를 외부 메일 본문으로 작성해줘.',
        forwarded_input: '개인정보 보호 정책에 의해 차단되어 외부 AI에 전달되지 않았습니다.',
        ai_response: '개인정보 보호 정책에 의해 차단되어 외부 AI에 전달되지 않았습니다.',
        status: '차단',
        guardrail_reason:
          '개인정보 보호 정책: 주민등록번호와 계좌번호가 포함되어 있어 고위험 개인정보로 분류됩니다.',
        policy_code: 'pii_protection',
        policy_name: '개인정보 보호 정책',
      },
    ],
  },
  systemIpaddr: {
    hostname: 'c2lab-server',
    ip_addresses: [
      { interface: 'enp0s25', address: '127.0.0.1', family: 'ipv4' },
      { interface: 'enp0s25', address: 'asdf:4asd:1234:abc:1234:123s:fv32:4333', family: 'ipv6' },
    ],
  },
  systemResource: {
    cpu: {
      percent: 3.7,
      load_average: {
        used_cores: 0.89,
        total_cores: 24,
        '1m': 0.19,
        '5m': 0.1,
        '15m': 0.03,
      },
    },
    memory: {
      total: '62.7 GB',
      used: '3.3 GB',
      available: '59.4 GB',
      percent: 5.2,
    },
    disk: {
      mount: '/',
      total: '97.9 GB',
      used: '16.7 GB',
      free: '76.1 GB',
      percent: 18,
    },
    timestamp: '2026-07-02 14:41:10 KST',
  },
};

function getDropdownOptionsByKind(kind) {
  return mockStore.dropdowns[normalizeKind(kind)]?.options ?? [];
}

function refreshEmployeeCounts() {
  Object.entries(mockStore.dropdowns).forEach(([kind, group]) => {
    const key = kind === 'departments' ? 'department_option_id' : 'position_option_id';

    group.options.forEach(option => {
      option.employee_count = mockStore.clients.clients.filter(
        client => client[key] === option.id
      ).length;
    });
  });
}

export function mockGetDomains() {
  return createResponse(mockStore.domains);
}

export function mockPatchDomainEnabled({ serviceCode, enabled }) {
  const domain = mockStore.domains.domains.find(item => item.service_code === serviceCode);

  if (domain) {
    domain.enabled = Boolean(enabled);
  }

  return createResponse(domain ?? {});
}

export function mockGetPolicies() {
  return createResponse(mockStore.policies);
}

export function mockPatchPolicyEnabled({ code, enabled }) {
  const policy = mockStore.policies.policies.find(item => item.code === code);

  if (policy) {
    policy.enabled = Boolean(enabled);
    policy.updated_at_kst = nowKst();
  }

  if (code === 'file_upload_protection') {
    mockStore.fileUploadExtensions.enabled = Boolean(enabled);
  }

  return createResponse(policy ?? {});
}

export function mockGetFileUploadExtensions() {
  return createResponse(mockStore.fileUploadExtensions);
}

export function mockPutFileUploadExtensions({ blockedExtensions }) {
  const blockedSet = new Set(blockedExtensions ?? []);

  mockStore.fileUploadExtensions.extensions.forEach(item => {
    item.blocked = blockedSet.has(item.extension);
  });

  return createResponse(mockStore.fileUploadExtensions);
}

export function mockGetTemplateSettings() {
  return createResponse(mockStore.templateSettings);
}

export function mockPatchTemplateSettings(template) {
  mockStore.templateSettings = {
    ...mockStore.templateSettings,
    logo_path: template.logo_file
      ? mockStore.templateSettings.logo_path
      : mockStore.templateSettings.logo_path,
    company_name: template.company_name ?? '',
    company_description: template.company_description ?? '',
    support_email: template.support_email ?? '',
    support_phone: template.support_phone ?? '',
  };

  return createResponse(mockStore.templateSettings);
}

export function mockGetDownloadSettings() {
  return createResponse(mockStore.downloadSettings);
}

export function mockPatchDownloadSettings(settings) {
  mockStore.downloadSettings = {
    download_path: settings.download_path ?? mockStore.downloadSettings.download_path,
  };

  return createResponse(mockStore.downloadSettings);
}

export function mockGetRegisteredClients(params = {}) {
  const offset = Number(params.offset ?? 0);
  const limit = Number(params.limit ?? mockStore.clients.clients.length);
  const clients = mockStore.clients.clients.slice(offset, offset + limit);

  return createResponse({
    clients,
    total: mockStore.clients.clients.length,
    returned: clients.length,
    offset,
    limit,
  });
}

export function mockPatchClientMetadata({ id, metadata }) {
  const client = mockStore.clients.clients.find(item => String(item.id) === String(id));

  if (client) {
    const department = getDropdownOptionsByKind('departments').find(
      item => item.id === metadata.department_option_id
    );
    const position = getDropdownOptionsByKind('positions').find(
      item => item.id === metadata.position_option_id
    );

    client.user_name = metadata.user_name ?? client.user_name;
    client.department_option_id = metadata.department_option_id ?? null;
    client.position_option_id = metadata.position_option_id ?? null;
    client.department = department?.name ?? '';
    client.position = position?.name ?? '';
    refreshEmployeeCounts();
  }

  return createResponse(client ?? {});
}

export function mockGetDropdownSelectOptions() {
  return createResponse({
    departments: getDropdownOptionsByKind('departments').map(({ id, name }) => ({ id, name })),
    positions: getDropdownOptionsByKind('positions').map(({ id, name }) => ({ id, name })),
  });
}

export function mockGetDropdownOptions({ kind, q = '' }) {
  const normalizedQuery = q.trim().toLowerCase();
  const options = getDropdownOptionsByKind(kind)
    .filter(item => (normalizedQuery ? item.name.toLowerCase().includes(normalizedQuery) : true))
    .sort((a, b) => a.sort_order - b.sort_order);

  return createResponse({ options });
}

export function mockCreateDropdownOption({ kind, option }) {
  const normalizedKind = normalizeKind(kind);
  const options = getDropdownOptionsByKind(normalizedKind);
  const nextId = Math.max(0, ...options.map(item => Number(item.id))) + 1;
  const now = nowKst();
  const createdOption = {
    id: nextId,
    type: singularTypeByKind[normalizedKind],
    name: option.name,
    description: option.description ?? '',
    sort_order: Math.max(0, ...options.map(item => Number(item.sort_order))) + 1,
    employee_count: 0,
    created_at_kst: now,
    updated_at_kst: now,
  };

  options.push(createdOption);

  return createResponse(createdOption);
}

export function mockPatchDropdownOrder({ kind, ids }) {
  const options = getDropdownOptionsByKind(kind);

  ids.forEach((id, index) => {
    const option = options.find(item => String(item.id) === String(id));

    if (option) {
      option.sort_order = index + 1;
      option.updated_at_kst = nowKst();
    }
  });

  return createResponse({ options });
}

export function mockPatchDropdownOption({ kind, optionId, option }) {
  const target = getDropdownOptionsByKind(kind).find(item => String(item.id) === String(optionId));

  if (target) {
    target.name = option.name ?? target.name;
    target.description = option.description ?? target.description;
    target.updated_at_kst = nowKst();

    const clientKey =
      normalizeKind(kind) === 'departments' ? 'department_option_id' : 'position_option_id';
    const clientLabel = normalizeKind(kind) === 'departments' ? 'department' : 'position';

    mockStore.clients.clients.forEach(client => {
      if (client[clientKey] === target.id) {
        client[clientLabel] = target.name;
      }
    });
  }

  return createResponse(target ?? {});
}

export function mockDeleteDropdownOption({ kind, optionId }) {
  const normalizedKind = normalizeKind(kind);
  const group = mockStore.dropdowns[normalizedKind];
  const index = group.options.findIndex(item => String(item.id) === String(optionId));

  if (index >= 0) {
    group.options.splice(index, 1);
  }

  return createResponse({ ok: true });
}

export function mockGetMonitoringEvents(params = {}) {
  const normalizedStatus = params.status ?? 'all';
  const normalizedQuery = String(params.q ?? '')
    .trim()
    .toLowerCase();
  const offset = Number(params.offset ?? 0);
  const limit = Number(params.limit ?? 100);
  const filtered = mockStore.monitoring.events.filter(event => {
    const matchesStatus =
      normalizedStatus === 'all' ||
      (normalizedStatus === 'normal' && event.status === '정상') ||
      (normalizedStatus === 'block' && event.status === '차단') ||
      (normalizedStatus === 'masking' && event.status === '마스킹') ||
      (normalizedStatus === 'allow' && ['검토필요', '허용'].includes(event.status));
    const matchesQuery = normalizedQuery
      ? [
          event.client_ip,
          event.user_name,
          event.department,
          event.position,
          event.service,
          event.original_input,
          event.forwarded_input,
          event.ai_response,
          event.status,
          event.guardrail_reason,
          event.policy_name,
        ]
          .filter(Boolean)
          .some(value => String(value).toLowerCase().includes(normalizedQuery))
      : true;

    return matchesStatus && matchesQuery;
  });
  const events = filtered.slice(offset, offset + limit);

  return createResponse({
    events,
    total: filtered.length,
    returned: events.length,
    offset,
    limit,
    status: normalizedStatus,
  });
}

export function mockGetSystemIpaddr() {
  return createResponse(mockStore.systemIpaddr);
}

export function mockGetSystemResource() {
  return createResponse(mockStore.systemResource);
}

export function mockDownloadWindowsSetupZip() {
  return Promise.resolve(
    new Blob(['GARIM mock windows setup archive'], { type: 'application/zip' })
  );
}
