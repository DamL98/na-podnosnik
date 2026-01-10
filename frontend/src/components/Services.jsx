import { useState } from "react";

// dane pod backend - dziala zapis z formularza
// export const services = [
//   { id: 1, nazwa: "Podnośnik", typ: "H", stawka: 50, icon: "🛠️" },
//   { id: 2, nazwa: "Zestaw narzędzi", typ: "H", stawka: 30, icon: "🔧" },
//   { id: 3, nazwa: "Diagnostyka OBD", typ: "FIX", stawka: 40, icon: "💻" },
//   { id: 4, nazwa: "Pomoc mechanika", typ: "H", stawka: 100, icon: "👨‍🔧" },
// ];

export const services = [
  {
    id: 1,
    nazwa: "Podnośnik",
    typ: "H",
    stawka: 50,
    icon: "🛠️",
    opis: "Stanowisko z profesjonalnym podnośnikiem hydraulicznym.",
    wskazowki: [
      "Podnośnik hydrauliczny o udźwigu do 5 ton",
      "Możliwość samodzielnej naprawy pojazdu",
      "Bezpieczna i komfortowa praca przy pojeździe",
      "Oszczędność czasu podczas napraw i przeglądów"
    ],
  },
  {
    id: 2,
    nazwa: "Zestaw narzędzi",
    typ: "H",
    stawka: 30,
    icon: "🔧",
    opis: "Kompletny zestaw narzędzi warsztatowych.",
    wskazowki: [
      "Dostępne klucze: Oczkowe, nasadkowe, imbusy",
      "Grzechotki wraz z wszystkimi rozmiarami nasadek",
      "Klucze specjalistyczne: dynamometryczny, udarowy oraz do filtrów oleju",
      "Elektonarzędzia: wkrętarka, szlifierka kątowa, wyrzynarka",
      "Specjalne przyrządy ułatwiające prace takie jak: ściągacz sprężyn, zestaw do cofania tłoczków hamulcowych",
      "Oraz wiele innych potrzebnych do wykonania pracy przy Twoim pojeździe!"
    ],
  },
  {
    id: 3,
    nazwa: "Diagnostyka OBD",
    typ: "FIX",
    stawka: 40,
    icon: "💻",
    opis: "Odczyt i kasowanie błędów z komputera auta.",
    wskazowki: [
      "Dostępne są urządzenia diagnostyki komputerowej przez OBD2",
      "Wiele interface pasujących to wszystkich modeli  samochodu",
      "Możliwość sprawdzenia/usunięcia błędu w Twoim pojeździe!",
      "Doposaż swoje auto w nowe funkcje dzięki możliwości programowania!",
      "Przedsprzedażowe sprawdzenie komputerowe pojazdu"
    ],
  },
  {
    id: 4,
    nazwa: "Pomoc mechanika",
    typ: "H",
    stawka: 100,
    icon: "👨‍🔧",
    opis: "Wsparcie profesjonalnego mechanika.",
    wskazowki: [
      "Gdy tylko będziesz potrzebował pomocy zawołaj naszego mechanika!",
      "Podpowie Ci jak coś naprawić",
      "Sprawdzi czy wszystko jest w porządku",
      "Naprawi pojazd za Ciebie! Gdy tylko będziesz tego potrzebował"
    ],
  },
];

export default function Services() {
  const [activeService, setActiveService] = useState(null);


  return (

    <section id="services" className="section">
      <h2 >Nasze usługi</h2>

      <div className="cards">
        {services.map((service) => (

          // <div 
          //   key={service.id} 
          //   className="card-services"
          //   onClick={() => setActiveService(service)}
          //   >
            
          //   <div className="card-icon">{service.icon}</div>
          //   <h3>{service.nazwa}</h3>

          //   <p>
          //     Rozliczenie: {service.typ === "H" ? "godzinowo" : "jednorazowo"}
          //   </p>

          //   <strong>
          //     {service.stawka} zł {service.typ === "H" ? "/ godz." : ""}
          //   </strong>

          // </div>

          <div
            key={service.id}
            className="service-flip"
            onClick={() => setActiveService(service)}
          >
            <div className="service-flip-inner">

              {/* FRONT */}
              <div className="service-face service-front">
                <div className="card-icon">{service.icon}</div>
                <h3>{service.nazwa}</h3>
                <p>
                  {service.typ === "H" ? "Rozliczenie godzinowe" : "Opłata jednorazowa"}
                </p>
                <strong>
                  {service.stawka} zł {service.typ === "H" && "/ godz."}
                </strong>
              </div>

              {/* BACK */}
              <div className="service-face service-back">
                <h4>{service.nazwa}</h4>
                <p>{service.opis}</p>
                <span className="service-hint">
                  Kliknij aby zobaczyć szczegóły
                </span>
              </div>

            </div>
          </div>

        ))}

      </div>

      {activeService && (
        <div className="modal-backdrop" onClick={() => setActiveService(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{activeService.icon} {activeService.nazwa}</h2>
            <p>{activeService.opis}</p>

            <h4>Zapewniamy:</h4>
            <ul>
              {activeService.wskazowki.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>

            <button onClick={() => setActiveService(null)}>
              Zamknij
            </button>
          </div>
        </div>
      )}

    </section>
  );
}
