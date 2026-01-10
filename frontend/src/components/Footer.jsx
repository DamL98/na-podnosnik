export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <h4>Na Podnośnik</h4>
          <p>
            Samoobsługowy warsztat samochodowy. Wynajmij stanowisko
            i napraw swoje auto w profesjonalnych warunkach.
          </p>
        </div>

        <div>
          <h4>Kontakt</h4>
          <p>📞 <a href="tel:+48123123123">+48 668 535 243</a></p>
          <p>✉️ <a href="mailto:kontakt@napodnosnik.pl">kontakt@napodnosnik.pl</a></p>
          <p>📍 ul. Jackowskiego 12, 86-300 Grudziąc</p>
        </div>

        <div>
          <h4>Godziny</h4>
          <p>Pn–Pt: 8:00 – 20:00</p>
          <p>Sobota: 9:00 – 18:00</p>
          <p>Niedziela: nieczynne</p>
        </div>

        {/* <div>
          <h4>Rezerwacje</h4>
          <p>Zarezerwuj termin online</p>
          <a href="/reservation">
            <button>Rezerwuj</button>
          </a>
        </div> */}
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Na Podnośnik · Wszelkie prawa zastrzeżone
      </div>
    </footer>
  );
}
