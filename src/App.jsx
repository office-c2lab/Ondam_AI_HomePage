import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import Careers from './pages/Careers.jsx';
import Contact from './pages/Contact.jsx';
import Directions from './pages/Directions.jsx';
import Faq from './pages/Faq.jsx';
import Privacy from './pages/Privacy.jsx';
import Team from './pages/Team.jsx';

export default function App() {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
  const pages = {
    '/careers': <Careers />,
    '/contact': <Contact />,
    '/location': <Directions />,
    '/faq': <Faq />,
    '/privacy': <Privacy />,
    '/team': <Team />,
  };

  return (
    <div className="min-h-screen bg-white text-[#171717]">
      <Header />

      <main className="min-h-screen">{pages[pathname] ?? null}</main>

      <Footer />
    </div>
  );
}
