export default function Faq() {
  return (
    <section id="faq" className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-[1600px] px-5 pt-[calc(var(--site-header-height)+5rem)] pb-28 text-center sm:px-6 lg:px-8 lg:pt-[calc(var(--site-header-height)+7rem)] min-[1600px]:px-0">
        <h1 className="text-4xl leading-tight font-bold tracking-[-0.04em] text-[#101828] sm:text-5xl lg:text-[56px]">
          FAQ
        </h1>
        <p className="mt-5 text-base leading-7 text-[#667085] sm:text-lg">
          자주 묻는 질문을 준비하고 있습니다.
        </p>
      </div>
    </section>
  );
}
