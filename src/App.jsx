import Contact from './components/Contact.jsx';
import Directions from './components/Directions.jsx';
import Faq from './components/Faq.jsx';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';

export default function App() {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
  const pages = {
    '/contact': <Contact />,
    '/location': <Directions />,
    '/faq': <Faq />,
  };

  return (
    <div className="min-h-screen bg-white text-[#171717]">
      <Header />

      <main className="min-h-[calc(100vh-90px)] pt-[70px] min-[681px]:pt-[80px] min-[981px]:pt-[90px]">
        {pages[pathname] ?? null}
      </main>

      <Footer />
    </div>
  );
}
