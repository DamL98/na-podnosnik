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
      "Upewnij się, że auto jest poprawnie ustawione",
      "Zaciągnij ręczny przed podniesieniem",
      "Nie wchodź pod auto bez blokad bezpieczeństwa",
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
      "Zwróć narzędzia po użyciu",
      "Nie używaj kluczy udarowych do ręcznych śrub",
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
      "Podłącz interfejs do gniazda OBD",
      "Uruchom zapłon, ale nie silnik",
      "Zapisz błędy przed ich skasowaniem",
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
      "Przygotuj listę pytań",
      "Pokaż co już zrobiłeś",
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

            <h4>Wskazówki:</h4>
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
