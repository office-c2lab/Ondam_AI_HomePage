import SolutionLaptop from '../components/SolutionLaptop.jsx';

export default function Home() {
  return (
    <section id="platform" className="relative min-h-screen bg-[#f2f0ec]">
      <div className="h-screen">
        <div id="platform-overview" className="h-full w-full">
          <SolutionLaptop activeSolution="Discover" />
        </div>
      </div>
    </section>
  );
}
