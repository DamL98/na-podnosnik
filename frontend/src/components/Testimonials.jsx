const testimonials = [
  {
    name: "Paweł K.",
    text:
      "Świetne miejsce! W końcu mogłem spokojnie wymienić hamulce bez pośpiechu.",
    rating: 5,
  },
  {
    name: "Anna M.",
    text:
      "Bardzo dobrze wyposażony warsztat, miła obsługa i jasne ceny.",
    rating: 5,
  },
  {
    name: "Michał R.",
    text:
      "Mega opcja dla osób, które lubią grzebać przy aucie. Polecam!",
    rating: 4,
  },
];

function Stars({ count }) {
  return <span>{"⭐".repeat(count)}</span>;
}

export default function Testimonials() {
  return (
    <section id="opinions" className="section">
      <h2>Opinie klientów</h2>

      <div className="cards">
        {testimonials.map((opinion, index) => (
          <div key={index} className="card">
            <Stars count={opinion.rating} />
            <p style={{ margin: "12px 0" }}>{opinion.text}</p>
            <strong>{opinion.name}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
