import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';

export default function App() {
  return (
    <div className="min-h-screen bg-white text-[#171717]">
      <Header />

      <main className="mx-auto min-h-[calc(100vh-90px)] w-full max-w-[1600px] px-5 pt-[90px] sm:px-6 lg:px-8 min-[1600px]:px-0" />

      <Footer />
    </div>
  );
}
