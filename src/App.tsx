import { useEffect, useRef, useState, ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import Login from './components/Login';
import Quiz from './components/Quiz';
import Formulario from './pages/Formulario';
import Aprovacao from './pages/Aprovacao';
import Chat from './pages/Chat';
import PagamentoGRU from './pages/PagamentoGRU';
import { LocationProvider } from './context/LocationContext';
import { UserProvider } from './context/UserContext';

/* ─── Page transition variants ───────────────────────────────────────────── */
const pageVariants = {
  initial: { opacity: 0, y: 16 },
  in:      { opacity: 1, y: 0 },
  out:     { opacity: 0, y: -8 },
};

const pageTransition = {
  type: 'tween' as const,
  ease: [0.4, 0, 0.2, 1],
  duration: 0.28,
};

function Page({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Top progress bar ────────────────────────────────────────────────────── */
function TopProgressBar() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setVisible(true);
    setWidth(0);

    // Quick ramp to 80%, then hold until component re-renders (route done)
    const ramp = setTimeout(() => setWidth(80), 20);
    const finish = setTimeout(() => {
      setWidth(100);
      timerRef.current = setTimeout(() => setVisible(false), 300);
    }, 260);

    return () => {
      clearTimeout(ramp);
      clearTimeout(finish);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [location.pathname]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '3px',
        width: `${width}%`,
        background: 'linear-gradient(90deg, #1351b4, #0072c6)',
        zIndex: 9999,
        transition: width === 100 ? 'width 0.15s ease, opacity 0.3s ease' : 'width 0.24s cubic-bezier(0.4,0,0.2,1)',
        opacity: width === 100 ? 0 : 1,
        borderRadius: '0 2px 2px 0',
        boxShadow: '0 0 8px rgba(19,81,180,0.6)',
      }}
    />
  );
}

/* ─── Scroll to top on route change ──────────────────────────────────────── */
function ScrollToTop() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);
  return null;
}

/* ─── Layout ──────────────────────────────────────────────────────────────── */
function Layout() {
  const location = useLocation();
  const hideHeader = location.pathname === '/login';

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      <TopProgressBar />
      {!hideHeader && <Header />}
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/"             element={<Page><Main /></Page>} />
          <Route path="/login"        element={<Page><Login /></Page>} />
          <Route path="/quiz"         element={<Page><Quiz /></Page>} />
          <Route path="/formulario"   element={<Page><Formulario /></Page>} />
          <Route path="/aprovacao"    element={<Page><Aprovacao /></Page>} />
          <Route path="/chat"         element={<Page><Chat /></Page>} />
          <Route path="/pagamento-gru" element={<Page><PagamentoGRU /></Page>} />
          <Route path="*"             element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </div>
  );
}

/* ─── App ─────────────────────────────────────────────────────────────────── */
function App() {
  return (
    <UserProvider>
      <LocationProvider>
        <Router>
          <ScrollToTop />
          <Layout />
        </Router>
      </LocationProvider>
    </UserProvider>
  );
}

export default App;