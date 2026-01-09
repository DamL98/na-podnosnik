import { useState } from "react";

const services = [
  { id: 1, nazwa: "Podnośnik", typ: "H", stawka: 50 },
  { id: 2, nazwa: "Zestaw narzędzi", typ: "H", stawka: 30 },
  { id: 3, nazwa: "Diagnostyka OBD", typ: "FIX", stawka: 40 },
  { id: 4, nazwa: "Pomoc mechanika", typ: "H", stawka: 100 },
];

function calculateHours(startAt, endAt) {
  const start = new Date(startAt);
  const end = new Date(endAt);
  return Math.max(1, Math.ceil((end - start) / 36e5));
}

export default function Reservation() {
  const [selected, setSelected] = useState([]);
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

  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const validRange =
    form.startAt &&
    form.endAt &&
    new Date(form.startAt) < new Date(form.endAt);

  const isValid = {
    firstName: form.firstName.trim().length > 0,
    lastName: form.lastName.trim().length > 0,
    email: form.email.includes("@"),
    startAt: validRange,
    endAt: validRange,
    services: selected.length > 0,
    availability: availability !== false,
  };

  const formValid =
    isValid.firstName &&
    isValid.lastName &&
    isValid.email &&
    isValid.startAt &&
    isValid.endAt &&
    isValid.services &&
    isValid.availability;

  function fieldClass(name) {
    if (!touched[name]) return "";
    return isValid[name] ? "valid" : "invalid";
  }

  function toggleService(id) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    setTouched((t) => ({ ...t, services: true }));
  }

  function handleChange(e) {
    const updated = { ...form, [e.target.name]: e.target.value };
    setForm(updated);
    setTouched((t) => ({ ...t, [e.target.name]: true }));

    if (
      (e.target.name === "startAt" || e.target.name === "endAt") &&
      updated.startAt &&
      updated.endAt
    ) {
      checkAvailability(updated.startAt, updated.endAt);
    }
  }

  async function checkAvailability(startAt, endAt) {
    if (new Date(startAt) >= new Date(endAt)) {
      setAvailability(false);
      return;
    }

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
    } catch {
      setAvailability(null);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!formValid) {
      setError("Formularz zawiera błędy.");
      return;
    }

    try {
      setLoading(true);

      const hours = calculateHours(form.startAt, form.endAt);

      const uslugi_json = services
        .filter((s) => selected.includes(s.id))
        .map((s) => ({
          uslugaId: s.id,
          nazwa: s.nazwa,
          typ: s.typ,
          stawka: s.stawka,
          ilosc: s.typ === "H" ? hours : 1,
          koszt: s.stawka * (s.typ === "H" ? hours : 1),
        }));

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

      const res = await fetch("http://localhost:3001/api/rezerwacje", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess(true);
    } catch (err) {
      setError(err.message || "Błąd zapisu");
    } finally {
      setLoading(false);
    }
  }

  const previewTotal = services
    .filter((s) => selected.includes(s.id))
    .reduce((sum, s) => sum + s.stawka, 0);

  return (

    <section className="reservation-wrapper">
      <div className="reservation-bg"></div>

      <div className="reservation-hero">
        <h1>Rezerwacja terminu</h1>
        <p>Wybierz termin i przygotuj swoje stanowisko w warsztacie</p>
      </div>
      <section className="section reservation-card">
      
        {/* <div className="reservation-image">
          <img src="/gallery/reservation.jpg" alt="Warsztat" />
          <div className="image-overlay">
            <h1>Rezerwacja warsztatu</h1>
          </div>
        </div> */}

        <form onSubmit={handleSubmit}>

          <h3> Dane osobowe </h3>
          <input
            name="firstName"
            placeholder="Imię"
            value={form.firstName}
            onChange={handleChange}
            className={fieldClass("firstName")}
          />

          <input
            name="lastName"
            placeholder="Nazwisko"
            value={form.lastName}
            onChange={handleChange}
            className={fieldClass("lastName")}
          />

          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className={fieldClass("email")}
          />
          <h3>Termin</h3>
          <input
            type="datetime-local"
            name="startAt"
            value={form.startAt}
            onChange={handleChange}
            className={fieldClass("startAt")}
          />

          <input
            type="datetime-local"
            name="endAt"
            value={form.endAt}
            onChange={handleChange}
            className={fieldClass("endAt")}
          />
          
          {availability !== null && (
            <p className={availability ? "valid-text" : "invalid-text"}>
              {availability ? "Termin dostępny" : "Termin zajęty"}
            </p>
          )}

          <h3>Usługi</h3>
          <div className="services-list">
            {services.map((s) => (
              <label
                key={s.id}
                className={`service-option ${
                  selected.includes(s.id)
                    ? "valid"
                    // : touched.services
                    // ? "invalid"
                    : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(s.id)}
                  onChange={() => toggleService(s.id)}
                />
                <span>{s.nazwa}</span>
                <span>{s.stawka} zł</span>
              </label>
            ))}
              {/* {touched.services && selected.length === 0 && (
                <p className="invalid-text" style={{ marginTop: "8px" }}>
                  Wybierz przynajmniej jedną usługę
                </p>
              )} */}
          </div>

          <div className="summary">Suma: {previewTotal} zł</div>

          {error && <p className="invalid-text">{error}</p>}
          {success && <p className="valid-text">✔ Zapisano</p>}

          <button 
            className="submit-btn"
            disabled={loading || !formValid}>
            {loading ? "Wysyłanie..." : "Wyślij"}
          </button>
        </form>

        {success && (
          <div className="toast">
            ✔ Rezerwacja zapisana
          </div>
        )}
      </section>
    </section>
  );  
}
