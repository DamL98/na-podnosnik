import { Routes, Route, Link } from "react-router-dom";
import { useState } from 'react'
import './App.css'

import Home from "./pages/Home";
import Reservation from "./pages/Reservation";
import Footer from "./components/Footer";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <header className="nav">
        <div className="nav-inner">
          <div className="logo">
            Na <span> Podnośnik</span>
          </div>

          <nav className="nav-links">
            <a href="#services">Usługi</a>
            <a href="#gallery">Galeria</a>
            <a href="#opinions">Opinie</a>
            <a href="#faq">FAQ</a>

            <Link to="/reservation">
              <button className="nav-cta">Rezerwuj</button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reservation" element={<Reservation />} />
        </Routes>
      </main>

      <Footer />
    </>
  )
}

export default App
