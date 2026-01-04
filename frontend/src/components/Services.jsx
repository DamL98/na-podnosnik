// const services = [
//   {
//     title: "Podnośnik samochodowy",
//     description:
//       "Profesjonalny podnośnik – idealny do napraw zawieszenia, hamulców i podwozia.",
//     price: "od 50 zł",
//     icon: "🛠️",
//   },
//   {
//     title: "Zestaw narzędzi",
//     description:
//       "Komplet kluczy, nasadek i narzędzi ręcznych – wszystko na miejscu.",
//     price: "od 30 zł",
//     icon: "🔧",
//   },
//   {
//     title: "Diagnostyka OBD",
//     description:
//       "Szybka diagnostyka komputerowa – odczyt i kasowanie błędów.",
//     price: "od 40 zł",
//     icon: "💻",
//   },
//   {
//     title: "Pomoc mechanika",
//     description:
//       "Wsparcie doświadczonego mechanika, gdy utkniesz z naprawą.",
//     price: "od 100 zł",
//     icon: "👨‍🔧",
//   },
// ];

export const services = [
  { id: 1, nazwa: "Podnośnik", typ: "H", stawka: 50, icon: "🛠️" },
  { id: 2, nazwa: "Zestaw narzędzi", typ: "H", stawka: 30, icon: "🔧" },
  { id: 3, nazwa: "Diagnostyka OBD", typ: "FIX", stawka: 40, icon: "💻" },
  { id: 4, nazwa: "Pomoc mechanika", typ: "H", stawka: 100, icon: "👨‍🔧" },
];

export default function Services() {
  return (
    <section id="services" className="section">
      <h2 >Nasze usługi</h2>

      <div className="cards">
        {services.map((service) => (
          <div key={service.id} className="card">
            <div className="card-icon">{service.icon}</div>
            <h3>{service.nazwa}</h3>

            <p>
              Rozliczenie: {service.typ === "H" ? "godzinowo" : "jednorazowo"}
            </p>

            <strong>
              {service.stawka} zł {service.typ === "H" ? "/ godz." : ""}
            </strong>
          </div>
        ))}
      </div>
    </section>
  );
}
