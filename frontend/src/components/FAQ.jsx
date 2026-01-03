const faq = [
  {
    question: "Czy muszę mieć doświadczenie mechaniczne?",
    answer:
      "Nie. Warsztat jest przeznaczony zarówno dla amatorów, jak i osób z doświadczeniem. W razie potrzeby możesz skorzystać z pomocy mechanika.",
  },
  {
    question: "Czy narzędzia są w cenie?",
    answer:
      "Tak, podstawowe narzędzia są dostępne na miejscu. Specjalistyczne usługi są dodatkowo płatne.",
  },
  {
    question: "Co jeśli nie zdążę w zarezerwowanym czasie?",
    answer:
      "Możesz przedłużyć czas, jeśli stanowisko jest dostępne. Rozliczenie odbywa się godzinowo.",
  },
  {
    question: "Czy mogę anulować rezerwację?",
    answer:
      "Tak, rezerwację można anulować najpóźniej 24 godziny przed terminem.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="section">
      <h2>FAQ – Najczęściej zadawane pytania</h2>

      {faq.map((item, index) => (
        <details key={index} style={{ marginBottom: "12px" }}>
          <summary style={{ cursor: "pointer", fontWeight: 600 }}>
            {item.question}
          </summary>
          <p style={{ marginTop: "8px" }}>{item.answer}</p>
        </details>
      ))}
    </section>
  );
}
