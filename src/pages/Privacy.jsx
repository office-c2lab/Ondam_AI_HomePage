import { useEffect } from 'react';

const privacySections = [
  {
    title: '수집·이용 목적',
    content: (
      <p>
        제품·서비스 문의 접수, 문의자 확인, 상담 및 답변, 후속 문의 대응과 서비스 개선을 위해
        개인정보를 이용합니다.
      </p>
    ),
  },
  {
    title: '수집·이용 항목',
    content: (
      <ul>
        <li>
          <strong>필수 항목</strong> 문의 유형, 관심 솔루션, 회사·기관명, 이름, 연락처, 이메일, 문의
          내용
        </li>
        <li>
          <strong>선택 항목</strong> 마케팅 정보 수신 동의 여부
        </li>
      </ul>
    ),
  },
  {
    title: '보유 및 이용 기간',
    content: (
      <p>
        문의 처리 완료일로부터 2년간 보유·이용한 후 지체 없이 파기합니다. 다만, 관련 법령에 따라
        보존할 필요가 있는 경우에는 해당 기간 동안 보관합니다.
      </p>
    ),
  },
  {
    title: '동의 거부 권리 및 불이익',
    content: (
      <>
        <p>
          개인정보 수집·이용에 대한 동의를 거부할 수 있습니다. 다만, 필수 항목에 동의하지 않을 경우
          온라인 문의 접수와 답변 제공이 제한될 수 있습니다.
        </p>
        <p>
          본 동의는 문의·상담을 위한 것이며, 안내된 목적 외의 용도로 개인정보를 이용하지 않습니다.
        </p>
      </>
    ),
  },
];

const marketingSections = [
  {
    title: '개인정보 이용 목적',
    content: (
      <p>
        ONDAM AI의 제품·서비스 업데이트, 기술 자료, 행사와 세미나 등 유용한 소식을 안내하기 위해
        개인정보를 이용합니다.
      </p>
    ),
  },
  {
    title: '이용하는 개인정보 항목',
    content: <p>회사·기관명, 이름, 연락처, 이메일</p>,
  },
  {
    title: '보유 및 이용 기간',
    content: (
      <p>
        동의 철회 또는 마케팅 정보 제공 업무 종료 시까지 보유·이용하며, 이후 지체 없이 파기합니다.
        다만, 관련 법령에 따라 보존할 필요가 있는 경우에는 해당 기간 동안 보관합니다.
      </p>
    ),
  },
  {
    title: '광고성 정보 수신 안내',
    content: (
      <>
        <p>동의한 고객에게 이메일, 문자 또는 전화로 마케팅 정보를 안내할 수 있습니다.</p>
        <p>
          광고성 정보에는 전송자 명칭과 수신 거부 방법을 표시하며, 수신 동의 여부를 관련 법령이 정한
          주기에 따라 확인합니다.
        </p>
      </>
    ),
  },
  {
    title: '동의 거부 및 철회',
    content: (
      <>
        <p>본 동의는 선택 사항이며, 동의하지 않아도 문의와 상담 이용에 불이익이 없습니다.</p>
        <p>
          동의 후에도 수신된 안내의 수신 거부 방법을 이용하거나
          <a href="mailto:info@aictl.kr"> info@aictl.kr</a>로 요청하여 언제든지 철회할 수 있습니다.
        </p>
      </>
    ),
  },
];

function PolicyDocument({ id, title, description, sections }) {
  return (
    <article
      id={id}
      className="scroll-mt-32 border-b border-[#dfe4ec] py-16 first:pt-0 last:border-0 last:pb-0 sm:py-20"
    >
      <h1 className="text-3xl leading-tight font-bold tracking-[-0.04em] text-[#101828] sm:text-4xl lg:text-[46px]">
        {title}
      </h1>
      <p className="mt-6 max-w-4xl text-base leading-8 text-[#475467]">{description}</p>

      <div className="mt-12 space-y-11 sm:mt-14 sm:space-y-12">
        {sections.map((section, index) => (
          <section
            key={section.title}
            className="grid gap-4 sm:grid-cols-[64px_minmax(0,1fr)] sm:gap-6"
          >
            <span className="text-2xl font-bold text-[var(--brand-primary)]">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div>
              <h2 className="text-xl font-bold tracking-[-0.02em] text-[#101828] sm:text-2xl">
                {section.title}
              </h2>
              <div className="mt-4 space-y-3 text-[15px] leading-7 text-[#475467] [&_a]:font-semibold [&_a]:text-[var(--brand-primary)] [&_a]:hover:underline [&_li]:relative [&_li]:pl-4 [&_li]:before:absolute [&_li]:before:top-[0.72em] [&_li]:before:left-0 [&_li]:before:h-1 [&_li]:before:w-1 [&_li]:before:rounded-full [&_li]:before:bg-[#98a2b3] [&_strong]:mr-2 [&_strong]:font-bold [&_strong]:text-[#344054]">
                {section.content}
              </div>
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}

export default function Privacy() {
  useEffect(() => {
    if (!window.location.hash) return;

    const target = document.querySelector(window.location.hash);
    if (target) requestAnimationFrame(() => target.scrollIntoView());
  }, []);

  return (
    <section className="bg-white">
      <div className="mx-auto w-full max-w-[1120px] px-5 pt-[calc(var(--site-header-height)+4rem)] pb-16 sm:px-6 sm:pt-[calc(var(--site-header-height)+5rem)] sm:pb-20 lg:px-8 lg:pt-[calc(var(--site-header-height)+7rem)] lg:pb-28">
        <PolicyDocument
          id="privacy"
          title="개인정보 수집·이용 동의 안내"
          description="온담AI는 온라인 문의 접수와 상담을 위해 아래와 같이 개인정보를 수집·이용합니다."
          sections={privacySections}
        />

        <PolicyDocument
          id="marketing"
          title="마케팅 정보 수신 동의 안내"
          description="온담AI는 동의한 고객에게 제품·서비스와 행사 소식을 안내하기 위해 아래와 같이 개인정보를 이용하고 광고성 정보를 전송합니다."
          sections={marketingSections}
        />
      </div>
    </section>
  );
}
