import SolutionLaptop from '../components/SolutionLaptop.jsx';

export default function Home() {
  return (
    <section
      id="platform"
      className="relative min-h-screen pt-[70px] min-[681px]:pt-[80px] min-[981px]:pt-[90px]"
    >
      <div id="platform-overview" className="w-full">
        <SolutionLaptop />
      </div>
    </section>
  );
}
