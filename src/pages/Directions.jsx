import { BusFront, CarFront, MapPin, TrainFront } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import kakaoMapIcon from '../assets/images/kakaomap.png';
import naverMapIcon from '../assets/images/navermap.jpg';

const companyAddress = '서울특별시 구로구 디지털로31길 20, 에이스테크노타워5차 310호 (08380)';
const encodedAddress = encodeURIComponent(companyAddress);
const mapCoordinates = '37.485527,126.894338';

const transportOptions = [
  {
    title: '지하철 이용 시',
    icon: TrainFront,
    details: [
      '7호선 남구로역 1번 출구에서 도보 약 10분',
      '2호선 구로디지털단지역 2번 출구에서 구로09번 버스 환승',
    ],
  },
  {
    title: '버스 이용 시',
    icon: BusFront,
    details: [
      '마을버스 구로09번 이용',
      '에이스테크노타워5차 정류장 하차',
      '구로디지털단지역에서 3정거장',
    ],
  },
  {
    title: '자가용 이용 시',
    icon: CarFront,
    details: ["내비게이션에 '에이스테크노타워 5차 주차장' 검색", '건물 지상·지하 주차장 이용'],
  },
];

export default function Directions() {
  const shouldReduceMotion = useReducedMotion();
  const reveal = ({ delay = 0, x = 0, y = 28, scale = 1 } = {}) =>
    shouldReduceMotion
      ? { initial: false }
      : {
          initial: { opacity: 0, x, y, scale },
          animate: { opacity: 1, x: 0, y: 0, scale: 1 },
          transition: { duration: 0.82, delay, ease: [0.22, 1, 0.36, 1] },
        };

  return (
    <section id="location" className="scroll-mt-[90px] bg-white">
      <div className="mx-auto w-full max-w-[1600px] px-5 pt-[calc(var(--site-header-height)+3rem)] pb-16 sm:px-6 sm:pt-[calc(var(--site-header-height)+3.5rem)] sm:pb-20 lg:px-8 lg:pt-[calc(var(--site-header-height)+4rem)] lg:pb-28 min-[1600px]:px-0">
        <motion.div
          className="mx-auto mb-10 max-w-4xl text-center lg:mb-14"
          {...reveal()}
        >
          <h1 className="text-4xl leading-tight font-bold tracking-[-0.04em] text-[#101828] sm:text-5xl lg:text-[56px]">
            오시는 길
          </h1>
          <p className="mt-5 text-base leading-7 text-[#667085] sm:text-lg">
            온담AI를 방문하시는 길을 안내해 드립니다.
          </p>
          <p className="mt-5 flex items-center justify-center gap-2 text-center text-[15px] leading-7 font-semibold text-[#344054] sm:text-base">
            <MapPin className="h-5 w-5 shrink-0 text-[var(--brand-primary)]" />
            {companyAddress}
          </p>
        </motion.div>

        <div className="grid items-stretch gap-10 xl:grid-cols-[minmax(0,1.65fr)_minmax(360px,0.7fr)] xl:gap-12">
          <motion.div
            className="flex min-h-[520px] flex-col overflow-hidden rounded-3xl border border-[#dfe5ee] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] lg:min-h-[650px]"
            {...reveal({ delay: 0.16, x: -34, y: 10, scale: 0.985 })}
          >
            <iframe
              title="온담AI 위치 지도"
              src={`https://www.google.com/maps?q=${mapCoordinates}&z=17&output=embed`}
              className="min-h-[430px] w-full flex-1 border-0 lg:min-h-[560px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <div className="grid gap-3 border-t border-[#e4e7ec] p-5 sm:grid-cols-2 sm:p-6">
              <a
                href={`https://map.kakao.com/link/search/${encodedAddress}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-xl border border-[#fee500] bg-[#fee500] px-5 text-sm font-bold text-black transition hover:bg-[#f4dc00]"
              >
                <img src={kakaoMapIcon} alt="" className="h-8 w-8 rounded-lg object-cover" />
                카카오맵에서 보기
              </a>
              <a
                href={`https://map.naver.com/p/search/${encodedAddress}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-xl border border-[#03c75a] bg-[#03c75a] px-5 text-sm font-bold text-white transition hover:bg-[#02ae4f]"
              >
                <img src={naverMapIcon} alt="" className="h-8 w-8 rounded-lg object-cover" />
                네이버지도에서 보기
              </a>
            </div>
          </motion.div>

          <aside className="h-full">
            <div className="grid h-full border-y border-[#dfe5ee] md:grid-cols-3 xl:grid-cols-1 xl:grid-rows-3">
              {transportOptions.map((option, index) => {
                const Icon = option.icon;

                return (
                  <motion.article
                    key={option.title}
                    className={`py-8 md:px-8 xl:flex xl:flex-col xl:justify-center xl:px-1 ${
                      index < transportOptions.length - 1
                        ? 'border-b border-[#dfe5ee] md:border-r md:border-b-0 xl:border-r-0 xl:border-b'
                        : ''
                    }`}
                    {...reveal({ delay: 0.34 + index * 0.14, x: 30, y: 0 })}
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#edf5ff] text-[var(--brand-primary)]">
                      <Icon className="h-7 w-7" strokeWidth={1.7} />
                    </div>
                    <h3 className="mt-6 text-xl font-bold tracking-[-0.02em] text-[#101828]">
                      {option.title}
                    </h3>
                    <ul className="mt-4 space-y-2.5">
                      {option.details.map(detail => (
                        <li
                          key={detail}
                          className="flex gap-2 text-[15px] leading-6 text-[#667085]"
                        >
                          <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-[#98a2b3]" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </motion.article>
                );
              })}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
