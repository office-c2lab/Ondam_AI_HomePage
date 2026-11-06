import { useEffect, useRef, useState } from 'react';
import { Building2, Check, ChevronDown, ExternalLink } from 'lucide-react';

const fieldClass =
  'mt-2 h-12 w-full rounded-lg border border-[#d9dee8] bg-white px-4 text-[15px] text-[#101828] outline-none transition placeholder:text-[#98a2b3] focus:border-[var(--brand-primary)] focus:ring-3 focus:ring-[#075df6]/10';
const individualSolutionOptions = ['Discover', 'Control Internal', 'Control External', 'Manage'];
const allSolutionOption = '전체 솔루션';
const solutionOptions = [...individualSolutionOptions, allSolutionOption];

function CustomSelect({
  label,
  name,
  placeholder,
  options,
  value,
  onChange,
  required = false,
  multiple = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);
  const selectedValues = multiple ? value : value ? [value] : [];
  const displayValue = multiple ? selectedValues.join(', ') : value;
  const hasSelection = selectedValues.length > 0;

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = event => {
      if (!selectRef.current?.contains(event.target)) setIsOpen(false);
    };
    const handleKeyDown = event => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={selectRef} className="relative">
      <span className="block text-sm font-bold text-[#344054]">
        {label} {required && <span className="text-[#f04438]">*</span>}
      </span>
      <input type="hidden" name={name} value={displayValue} />
      <button
        type="button"
        className={`${fieldClass} flex items-center justify-between gap-3 text-left font-normal ${
          hasSelection ? 'text-[#101828]' : 'text-[#98a2b3]'
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(current => !current)}
        onKeyDown={event => {
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            setIsOpen(true);
          }
        }}
      >
        <span className="truncate">{displayValue || placeholder}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[#667085] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          strokeWidth={1.8}
        />
      </button>

      <div
        role="listbox"
        aria-multiselectable={multiple || undefined}
        className={`absolute inset-x-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-xl border border-[#d9dee8] bg-white p-1.5 shadow-[0_16px_40px_rgba(15,23,42,0.14)] transition-[opacity,transform,visibility] duration-200 ${
          isOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0'
        }`}
      >
        {options.map(option => {
          const isSelected = selectedValues.includes(option);

          return (
            <button
              key={option}
              type="button"
              role="option"
              aria-selected={isSelected}
              className={`flex min-h-11 w-full items-center justify-between rounded-lg px-3 text-left text-sm transition ${
                isSelected
                  ? 'bg-[#edf5ff] font-bold text-[var(--brand-primary)]'
                  : 'text-[#344054] hover:bg-[#f5f7fa]'
              }`}
              onClick={() => {
                if (multiple) {
                  onChange(
                    isSelected
                      ? selectedValues.filter(selected => selected !== option)
                      : [...selectedValues, option]
                  );
                } else {
                  onChange(option);
                  setIsOpen(false);
                }
              }}
            >
              {option}
              {multiple ? (
                <span
                  className={`grid h-5 w-5 place-items-center rounded border transition ${
                    isSelected
                      ? 'border-[var(--brand-primary)] bg-[var(--brand-primary)] text-white'
                      : 'border-[#cbd2dc] bg-white text-transparent'
                  }`}
                >
                  <Check className="h-3.5 w-3.5" strokeWidth={2.4} />
                </span>
              ) : (
                isSelected && <Check className="h-4 w-4" strokeWidth={2} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Contact() {
  const [inquiryType, setInquiryType] = useState('');
  const [solution, setSolution] = useState([]);
  const [formError, setFormError] = useState('');

  const handleSolutionChange = nextValues => {
    const selectedAllNow =
      nextValues.includes(allSolutionOption) && !solution.includes(allSolutionOption);

    if (selectedAllNow) {
      setSolution([allSolutionOption]);
    } else {
      const individualValues = nextValues.filter(value => value !== allSolutionOption);
      setSolution(
        individualValues.length === individualSolutionOptions.length
          ? [allSolutionOption]
          : individualValues
      );
    }

    setFormError('');
  };

  const handleSubmit = event => {
    event.preventDefault();

    if (!inquiryType || solution.length === 0) {
      setFormError('문의 유형과 관심 솔루션을 선택해 주세요.');
      return;
    }

    setFormError('');

    const formData = new FormData(event.currentTarget);
    const subject = `[ONDAM AI 문의] ${formData.get('inquiryType')} - ${formData.get('company')}`;
    const body = [
      `문의 유형: ${formData.get('inquiryType')}`,
      `관심 솔루션: ${formData.get('solution')}`,
      `회사/기관명: ${formData.get('company')}`,
      `이름: ${formData.get('name')}`,
      `연락처: ${formData.get('phone')}`,
      `이메일: ${formData.get('email')}`,
      `마케팅 목적 개인정보 이용 및 광고성 정보 수신: ${formData.get('marketingConsent')}`,
      '',
      '문의 내용',
      formData.get('message'),
    ].join('\n');

    window.location.href = `mailto:info@aictl.kr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section
      id="contact"
      className="min-h-screen bg-white bg-[radial-gradient(ellipse_72%_78%_at_92%_68%,#075df6_0%,#3f7af0_28%,#a9c0f2_52%,#e9effb_72%,#ffffff_100%)]"
    >
      <div className="mx-auto grid w-full max-w-[1600px] gap-12 px-5 pt-[calc(var(--site-header-height)+4rem)] pb-16 sm:px-6 sm:pt-[calc(var(--site-header-height)+5rem)] sm:pb-20 lg:grid-cols-[minmax(0,0.9fr)_minmax(540px,1.1fr)] lg:gap-20 lg:px-8 lg:pt-[calc(var(--site-header-height)+6rem)] lg:pb-24 min-[1600px]:px-0">
        <div className="lg:sticky lg:top-[120px] lg:self-start lg:pt-5">
          <div className="page-enter page-enter-up">
            <h1 className="mt-6 text-4xl leading-[1.18] font-bold tracking-[-0.045em] text-[#101828] sm:text-5xl lg:text-[56px]">
              기업의 AI 활용,
              <br />
              온담AI와 함께 시작하세요.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-[#667085] sm:text-lg sm:leading-8">
              ONDAM AI 도입과 기술 협력에 대해 궁금한 점을 남겨주세요.
              <br className="hidden sm:block" /> 담당자가 확인 후 안내해 드리겠습니다.
            </p>
          </div>

          <div className="page-enter page-enter-up contact-enter-logo relative mt-12 min-h-[430px] overflow-hidden rounded-2xl bg-[#e8f0ff] p-7 sm:p-10">
            <div
              className="absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(7,93,246,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(7,93,246,0.08)_1px,transparent_1px)] [background-size:32px_32px]"
              aria-hidden="true"
            />
            <div
              className="absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#168bff]/20 blur-3xl"
              aria-hidden="true"
            />

            <div className="relative flex h-full min-h-[350px] flex-col items-center justify-center">
              <div className="flex h-40 w-40 items-center justify-center rounded-[42px] bg-white shadow-[0_24px_60px_rgba(7,93,246,0.18)] sm:h-48 sm:w-48">
                <img src="/ondam_simbol.png" alt="ONDAM AI" className="h-28 w-28 sm:h-36 sm:w-36" />
              </div>
            </div>
          </div>
        </div>

        <form
          className="page-enter page-enter-up contact-enter-form rounded-2xl border border-[#e1e6ef] bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.08)] sm:p-9 lg:p-11"
          onSubmit={handleSubmit}
        >
          <div className="space-y-6">
            <CustomSelect
              label="문의 유형"
              name="inquiryType"
              placeholder="문의 유형을 선택해 주세요"
              options={['제품 도입', '기술 문의', '제휴 및 협력', '기타 문의']}
              value={inquiryType}
              onChange={value => {
                setInquiryType(value);
                setFormError('');
              }}
              required
            />

            <CustomSelect
              label="관심 솔루션 (중복가능)"
              name="solution"
              placeholder="관심 솔루션을 선택해 주세요"
              options={solutionOptions}
              value={solution}
              onChange={handleSolutionChange}
              multiple
              required
            />

            {formError && (
              <p role="alert" className="rounded-lg bg-[#fff1f0] px-4 py-3 text-sm text-[#d92d20]">
                {formError}
              </p>
            )}

            <label className="block text-sm font-bold text-[#344054]">
              회사·기관명 <span className="text-[#f04438]">*</span>
              <input
                type="text"
                name="company"
                required
                placeholder="회사 또는 기관명을 입력해 주세요"
                className={fieldClass}
              />
            </label>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-bold text-[#344054]">
                이름 <span className="text-[#f04438]">*</span>
                <input type="text" name="name" required placeholder="이름" className={fieldClass} />
              </label>
              <label className="block text-sm font-bold text-[#344054]">
                연락처 <span className="text-[#f04438]">*</span>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="010-0000-0000"
                  className={fieldClass}
                />
              </label>
            </div>

            <label className="block text-sm font-bold text-[#344054]">
              이메일 <span className="text-[#f04438]">*</span>
              <input
                type="email"
                name="email"
                required
                placeholder="name@company.com"
                className={fieldClass}
              />
            </label>

            <label className="block text-sm font-bold text-[#344054]">
              문의 내용 <span className="text-[#f04438]">*</span>
              <textarea
                name="message"
                required
                rows="7"
                placeholder="도입 환경과 궁금한 내용을 자유롭게 작성해 주세요"
                className={`${fieldClass} h-auto min-h-44 resize-y py-3.5`}
              />
            </label>
          </div>

          <div className="mt-10 space-y-9 border-t border-[#e4e7ec] pt-9">
            <section>
              <a
                href="/privacy"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#101828] underline underline-offset-4"
              >
                개인정보 수집 동의
                <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.8} />
              </a>
              <span className="ml-1.5 text-[#f04438]">*</span>
              <p className="mt-3 text-sm leading-6 text-[#667085]">
                개인정보 처리방침에 설명된 내용에 따라 문의 확인과 답변을 위해 입력하신 개인정보를
                처리하는 것에 동의합니다.
              </p>
              <label className="mt-4 flex cursor-pointer items-center gap-2.5 text-sm font-semibold text-[#344054]">
                <input
                  type="checkbox"
                  name="privacyConsent"
                  required
                  className="h-[18px] w-[18px] rounded border-[#b8c0cc] accent-[var(--brand-primary)]"
                />
                동의합니다.
              </label>
            </section>

            <section>
              <a
                href="/privacy#marketing"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#101828] underline underline-offset-4"
              >
                마케팅 정보 수신 동의
                <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.8} />
              </a>
              <span className="ml-1.5 text-[#f04438]">*</span>
              <p className="mt-3 text-sm leading-6 text-[#667085]">
                제품·서비스 소식과 기술 자료를 받아보는 데 동의합니다.
                <br /> 선택 사항이며, 비동의해도 문의와 상담을 이용할 수 있습니다.
              </p>
              <div className="mt-4 space-y-3 text-sm text-[#344054]">
                <label className="flex cursor-pointer items-center gap-2.5">
                  <input
                    type="radio"
                    name="marketingConsent"
                    value="동의"
                    required
                    className="h-[18px] w-[18px] accent-[var(--brand-primary)]"
                  />
                  동의합니다.
                </label>
                <label className="flex cursor-pointer items-center gap-2.5">
                  <input
                    type="radio"
                    name="marketingConsent"
                    value="비동의"
                    className="h-[18px] w-[18px] accent-[var(--brand-primary)]"
                  />
                  동의하지 않습니다.
                </label>
              </div>
            </section>
          </div>

          <button
            type="submit"
            className="mt-8 h-14 w-full rounded-xl bg-[var(--brand-primary)] text-base font-bold text-white transition hover:bg-[var(--brand-primary-dark)]"
          >
            문의하기
          </button>
        </form>
      </div>
    </section>
  );
}
