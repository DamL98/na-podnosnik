import { Routes, Route, Link, useLocation } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";

import Home from "./pages/Home";
import Reservation from "./pages/Reservation";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

function App() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const isHome = location.pathname === "/";

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

            {/* <nav className="nav-links">
              <a href="#services">Usługi</a>
              <a href="#gallery">Galeria</a>
              <a href="#opinions">Opinie</a>
              <a href="#faq">FAQ</a>

              {user ? (
                <div className="nav-user-menu">
                  <div className="nav-user">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg> Profil ▾
                  </div>

                  <div className="nav-dropdown">
                    <Link to="/profile">Mój Profil</Link>
                    <Link to="/dashboard">Moje rezerwacje</Link>
                    <Link to="/reservation">Nowa rezerwacja</Link>
                    <button onClick={logout}>Wyloguj</button>
                  </div>
                </div>
              ) : (
                <>
                  <Link to="/login">Zaloguj</Link>
                  <Link to="/register">
                    <button className="nav-cta">Załóż konto</button>
                  </Link>
                </>
              )}

            </nav> */}

            <nav className="nav-links">

            {/* ==== MARKETING (tylko na stronie głównej) ==== */}
            {isHome && (
              <>
                <a href="#services">Usługi</a>
                <a href="#gallery">Galeria</a>
                <a href="#opinions">Opinie</a>
                <a href="#faq">FAQ</a>
              </>
            )}

            {/* ==== ZALOGOWANY USER ==== */}
            {user ? (
              <>
                {/* Poza home pokazuj tylko powrót */}
                {!isHome && <Link to="/">Strona główna</Link>}

                <div className="nav-user-menu">
                  <div className="nav-user">👤 Profil</div>

                  <div className="nav-dropdown">
                    <Link to="/dashboard">Moje rezerwacje</Link>
                    <Link to="/profile">Moje dane</Link>
                    <Link to="/reservation" className="dropdown-cta">Zarezerwuj</Link>
                    <button onClick={logout}>Wyloguj</button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login">Zaloguj</Link>
                <Link to="/register">
                  <button className="nav-cta">Załóż konto</button>
                </Link>
              </>
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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;
