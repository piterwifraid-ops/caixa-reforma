import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
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

function ScrollToTop() {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

function App() {
  return (
    <UserProvider>
      <LocationProvider>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
            <Header />
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/login" element={<Login />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/formulario" element={<Formulario />} />
              <Route path="/aprovacao" element={<Aprovacao />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/pagamento-gru" element={<PagamentoGRU />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Footer />
          </div>
        </Router>
      </LocationProvider>
    </UserProvider>
  );
}

export default App;