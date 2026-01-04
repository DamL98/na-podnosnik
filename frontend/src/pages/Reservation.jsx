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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [availability, setAvailability] = useState(null);

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
    const updated = { ...form, [e.target.name]: e.target.value };
    setForm(updated);

    if (
      (e.target.name === "startAt" ||
        e.target.name === "endAt") &&
      updated.startAt &&
      updated.endAt
    ) {
      checkAvailability(updated.startAt, updated.endAt);
    }
  }

  /**
   * Submit formularza
   */
  async function handleSubmit(e) {
    e.preventDefault();

    setError(null);
    setSuccess(false);

    // 🔒 Walidacja
    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.startAt ||
      !form.endAt
    ) {
      setError("Uzupełnij wszystkie wymagane pola.");
      return;
    }

    try {
      setLoading(true);

      // ⏱️ liczba godzin
      const liczbaGodzin = calculateHours(
        form.startAt,
        form.endAt
      );

      // 🧾 uslugi_json
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

      if (uslugi_json.length === 0) {
        setError("Wybierz przynajmniej jedną usługę.");
        return;
      }

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

      // 🌐 FETCH DO BACKENDU
      const response = await fetch(
        "http://localhost:3001/api/rezerwacje",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Błąd zapisu rezerwacji");
      }

      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function checkAvailability(startAt, endAt) {
    if (!startAt || !endAt) return;

    try {
      const params = new URLSearchParams({
        podnosnikId: form.podnosnikId,
        od: new Date(startAt).toISOString(),
        do: new Date(endAt).toISOString(),
      });

      const res = await fetch(
        `http://localhost:3001/api/availability?${params}`
      );

      const data = await res.json();

      setAvailability(data.available);
    } catch (err) {
      console.error(err);
      setAvailability(null);
    }
  }

  // 💰 podsumowanie real time
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

        {availability === true && (
          <p style={{ color: "green" }}>
            ✅ Termin jest dostępny
          </p>
        )}

        {availability === false && (
          <p style={{ color: "red" }}>
            ❌ Termin jest zajęty
          </p>
        )}


        <h2>Płatność</h2>
        <div className="services-list">
          <label className="service-option">
            <input
              type="radio"
              name="paymentMethod"
              value="karta"
              checked={form.paymentMethod === "karta"}
              onChange={handleChange}
            />
            Karta
          </label>

          <label className="service-option">
            <input
              type="radio"
              name="paymentMethod"
              value="gotowka"
              checked={form.paymentMethod === "gotowka"}
              onChange={handleChange}
            />
            Gotówka
          </label>
        </div>


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
        

        {error && (
        <p style={{ color: "red", marginTop: "12px" }}>
          {error}
        </p>
        )}

        {success && (
          <p style={{ color: "green", marginTop: "12px" }}>
            Rezerwacja zapisana poprawnie ✔
          </p>
        )}


        <button
          style={{ marginTop: "24px" }}
          disabled={loading || availability === false}
        >
          {loading ? "Wysyłanie..." : "Wyślij rezerwację"}
        </button>

      </form>
    </section>
  );
}
