import { Link } from "react-router-dom";

import Services from "../components/Services";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";
import Gallery from "../components/Gallery";

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="hero">

        
        <div className="hero-content">

            <h1>
              Samoobsługowy <span>warsztat</span> samochodowy
            </h1>

            <img
              src="/gallery/logo3.png"
              alt="Na Podnośnik"
              className="hero-brand-logo"
            />


          <p>
            Wynajmij profesjonalne stanowisko, narzędzia i podnośnik.
            Napraw swoje auto samodzielnie — oszczędnie i bez presji.
          </p>

          <div className="hero-actions">
            <Link to="/reservation">
              <button className="btn-primary">Zarezerwuj termin</button>
            </Link>

            <a href="#services" className="btn-secondary">
              Zobacz usługi
            </a>
          </div>
        </div>

        {/* <div className="hero-visual">
          🏗️
        </div> */}
      </section>



      {/* JAK TO DZIAŁA */}
<section className="section process">
  <header className="section-header">
    <h2>Jak to działa?</h2>
    <p className="section-subtitle">Prosty proces, bez formalności i bez stresu.</p>
  </header>

  <div className="process-steps">
    <div className="process-step">
      <div className="step-left">
        <div className="step-number">1</div>
        <h3 className="step-title">Zarezerwuj termin</h3>
      </div>
      <p className="step-desc">
        Wybierz dogodną datę i godzinę. Rezerwacja zajmuje mniej niż minutę.
      </p>
    </div>

    <div className="process-step">
      <div className="step-left">
        <div className="step-number">2</div>
        <h3 className="step-title">Wybierz usługi</h3>
      </div>
      <p className="step-desc">
        Podnośnik, narzędzia, diagnostyka lub pomoc mechanika — tylko to, czego naprawdę potrzebujesz.
      </p>
    </div>

    <div className="process-step">
      <div className="step-left">
        <div className="step-number">3</div>
        <h3 className="step-title">Napraw auto</h3>
      </div>
      <p id="services" className="step-desc">
        Przyjeżdżasz, korzystasz z warsztatu i naprawiasz auto w swoim tempie.
      </p>
    </div>
  </div>
</section>

      {/* USŁUGI */}
      <Services />

      {/* GALERIA */}
      <Gallery />

      {/* OPINIE */}
      <Testimonials />

      {/* FAQ */}
      <FAQ />
    </>
  );
}
