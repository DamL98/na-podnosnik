import { Routes, Route, Link, useLocation } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import RequireGuest from "./auth/RequireGuest";
import { useNavigate } from "react-router-dom";

import Home from "./pages/Home";
import Reservation from "./pages/Reservation";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  
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

                      {/* WYLOGUJ BUTN */}
                      <button
                        onClick={() => {
                          logout();
                          navigate("/");
                        }}
                      >
                        Wyloguj
                      </button>

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

          <Route path="/login" element={
            <RequireGuest>
              <Login />
            </RequireGuest>
          } />

          <Route path="/register" element={
            <RequireGuest>
              <Register />
            </RequireGuest>
          } />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;
