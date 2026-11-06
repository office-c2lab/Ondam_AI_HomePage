import Directions from './components/Directions.jsx';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';

export default function App() {
  return (
    <div className="min-h-screen bg-white text-[#171717]">
      <Header />

      <main className="min-h-[calc(100vh-90px)] pt-[70px] min-[681px]:pt-[80px] min-[981px]:pt-[90px]">
        <Directions />
      </main>

      <Footer />
    </div>
  );
}
