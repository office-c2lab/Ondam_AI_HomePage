import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import { MemoryRouter } from 'react-router-dom';
import OndamPage from './embedded/ondam_ai/pages/user/ondam/OndamPage.jsx';
import Careers from './pages/Careers.jsx';
import Contact from './pages/Contact.jsx';
import Directions from './pages/Directions.jsx';
import Faq from './pages/Faq.jsx';
import Home from './pages/Home.jsx';
import Privacy from './pages/Privacy.jsx';
import SolutionDetail from './pages/SolutionDetail.jsx';
import Team from './pages/Team.jsx';

export default function App() {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/';

  if (pathname === '/embedded/ondam-screen') {
    return (
      <MemoryRouter initialEntries={['/user/ondam']}>
        <div className="h-dvh w-screen overflow-hidden bg-white">
          <OndamPage />
        </div>
      </MemoryRouter>
    );
  }

  const pages = {
    '/': <Home />,
    '/careers': <Careers />,
    '/contact': <Contact />,
    '/location': <Directions />,
    '/faq': <Faq />,
    '/privacy': <Privacy />,
    '/team': <Team />,
    '/solutions/discover': <SolutionDetail solutionId="discover" />,
    '/solutions/control-internal': <SolutionDetail solutionId="control-internal" />,
    '/solutions/control-external': <SolutionDetail solutionId="control-external" />,
    '/solutions/manage': <SolutionDetail solutionId="manage" />,
  };

  return (
    <div className="min-h-screen bg-white text-[#171717]">
      <Header />

      <main className="min-h-screen">{pages[pathname] ?? <Home />}</main>

      <Footer />
    </div>
  );
}
