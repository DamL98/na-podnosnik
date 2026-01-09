import { Routes, Route, Link, useLocation } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";

import Home from "./pages/Home";
import Reservation from "./pages/Reservation";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isReservationPage = location.pathname === "/reservation";

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <>
      <header className="nav">
        <div className="nav-inner">
          {/* LOGO */}
          <Link to="/" className="logo" onClick={scrollToTop}>
            <img src="/gallery/logo3.png" alt="Na Podnośnik" className="logo-img" />
          </Link>

          <nav className="nav-links">
            <a href="#services">Usługi</a>
            <a href="#gallery">Galeria</a>
            <a href="#opinions">Opinie</a>
            <a href="#faq">FAQ</a>

            {/* AUTH UI */}
            {user ? (
              <>
                <span className="nav-user">👋 {user.email}</span>
                <button onClick={logout} className="nav-cta">
                  Wyloguj
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Zaloguj</Link>
                <Link to="/register">
                  <button className="nav-cta">Załóż konto</button>
                </Link>
              </>
            )}

            {/* CTA rezerwacji – tylko jeśli NIE jest sie na /reservation */}
            {!isReservationPage && (
              <Link to="/reservation">
                <button className="nav-cta">Rezerwuj</button>
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;
