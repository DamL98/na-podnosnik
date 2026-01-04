import { useState } from "react";

/**
 * Usługi zgodne z tabelą `uslugi`
 * id = INT (jak w DB)
 * typ = H (godzinowa) | FIX (stała)
 */
const services = [
  { id: 1, nazwa: "Podnośnik", typ: "H", stawka: 50 },
  { id: 2, nazwa: "Zestaw narzędzi", typ: "H", stawka: 30 },
  { id: 3, nazwa: "Diagnostyka OBD", typ: "FIX", stawka: 40 },
  { id: 4, nazwa: "Pomoc mechanika", typ: "H", stawka: 100 },
];

/**
 * Oblicz liczbę godzin między datami
 */
function calculateHours(startAt, endAt) {
  const start = new Date(startAt);
  const end = new Date(endAt);

  const diffMs = end - start;
  const diffHours = diffMs / (1000 * 60 * 60);

  return Math.max(1, Math.ceil(diffHours));
}

export default function Reservation() {
  const [selected, setSelected] = useState([]); // tablica ID usług

  const [form, setForm] = useState({
    podnosnikId: 1,
    firstName: "",
    lastName: "",
    email: "",
    paymentMethod: "karta",
    startAt: "",
    endAt: "",
  });

  function toggleService(id) {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  /**
   * FINALNY SUBMIT
   */
  function handleSubmit(e) {
    e.preventDefault();

    // 🔒 Walidacja podstawowa
    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.startAt ||
      !form.endAt
    ) {
      alert("Uzupełnij wszystkie wymagane pola.");
      return;
    }

    // ⏱️ liczba godzin rezerwacji
    const liczbaGodzin = calculateHours(
      form.startAt,
      form.endAt
    );

    // 🧾 SNAPSHOT USŁUG → uslugi_json
    const uslugi_json = services
      .filter((s) => selected.includes(s.id))
      .map((s) => {
        const ilosc = s.typ === "H" ? liczbaGodzin : 1;

        return {
          uslugaId: s.id,
          nazwa: s.nazwa,
          typ: s.typ,
          stawka: s.stawka,
          ilosc,
          koszt: s.stawka * ilosc,
        };
      });

    // 💰 suma końcowa (z JSON-a, nie „na oko”)
    const total = uslugi_json.reduce(
      (sum, u) => sum + u.koszt,
      0
    );

    // 📦 PAYLOAD 1:1 POD POSTGRES / PRISMA
    const payload = {
      podnosnikId: form.podnosnikId,

      imie: form.firstName,
      nazwisko: form.lastName,
      email: form.email,

      sposob_platnosci: form.paymentMethod,

      od_ts: new Date(form.startAt).toISOString(),
      do_ts: new Date(form.endAt).toISOString(),

      uslugi_json,
    };

    console.log("Wysyłam do backendu:", payload);
    console.log("Suma:", total, "zł");

    alert("Rezerwacja przygotowana (demo)");
  }

  // 💰 podsumowanie na żywo (frontend UX)
  const previewTotal = services
    .filter((s) => selected.includes(s.id))
    .reduce((sum, s) => sum + s.stawka, 0);

  return (
    <section className="section">
      <h1>Rezerwacja warsztatu</h1>

      <form onSubmit={handleSubmit}>
        <h2>Dane klienta</h2>

        <input
          name="firstName"
          placeholder="Imię"
          value={form.firstName}
          onChange={handleChange}
          required
        />

        <input
          name="lastName"
          placeholder="Nazwisko"
          value={form.lastName}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Adres email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <h2>Termin rezerwacji</h2>

        <label>
          Od:
          <input
            type="datetime-local"
            name="startAt"
            value={form.startAt}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Do:
          <input
            type="datetime-local"
            name="endAt"
            value={form.endAt}
            onChange={handleChange}
            required
          />
        </label>

        <h2>Płatność</h2>

        <label>
          <input
            type="radio"
            name="paymentMethod"
            value="karta"
            checked={form.paymentMethod === "karta"}
            onChange={handleChange}
          />
          Karta
        </label>

        <label>
          <input
            type="radio"
            name="paymentMethod"
            value="gotowka"
            checked={form.paymentMethod === "gotowka"}
            onChange={handleChange}
          />
          Gotówka
        </label>

        <h2>Wybierz usługi</h2>

        <div className="services-list">
          {services.map((service) => (
            <label key={service.id} className="service-option">
              <input
                type="checkbox"
                checked={selected.includes(service.id)}
                onChange={() => toggleService(service.id)}
              />
              <span className="service-name">{service.nazwa}</span>
              <span className="service-price">
                {service.stawka} zł
              </span>
            </label>
          ))}
        </div>

        <div className="summary">
          Szacowany koszt (bez czasu): {previewTotal} zł
        </div>

        <button style={{ marginTop: "24px" }}>
          Wyślij rezerwację
        </button>
      </form>
    </section>
  );
}
