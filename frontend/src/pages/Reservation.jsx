import { useAuth } from "../auth/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


const services = [
  // { id: 1, nazwa: "Podnośnik", typ: "H", stawka: 50 },
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
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    podnosnikId: 1,
    firstName: "",
    lastName: "",
    email: "",
    paymentMethod: "",
    startAt: "",
    endAt: "",
  });

  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [pendingReservation, setPendingReservation] = useState(null);
  const [showAccountPopup, setShowAccountPopup] = useState(false);

  const [form, setForm] = useState({
      podnosnikId: null,
      firstName: "",
      lastName: "",
      email: "",
      paymentMethod: "karta",
      startAt: "",
      endAt: "",
    });

    useEffect(() => {
      fetch("http://localhost:3001/api/podnosniki")
        .then(r => r.json())
        .then(data => {
          setPodnosniki(data);

          if (data.length > 0) {
            setForm(f => ({ ...f, podnosnikId: data[0].id }));
          }
        })
        .catch(() => {
          setPodnosniki([]);
        });
    }, []);
  

  const validRange =
    form.startAt &&
    form.endAt &&
    new Date(form.startAt) < new Date(form.endAt);

  const isValid = {
    firstName: form.firstName.trim().length > 0,
    lastName: form.lastName.trim().length > 0,
    email: form.email.includes("@"),
    paymentMethod: ["karta", "gotowka"].includes(form.paymentMethod),
    startAt: validRange,
    endAt: validRange,
    services: selected.length > 0,
    // availability: availability !== false,
    availability:
      form.podnosnikId !== null &&
      availablePodnosniki.some(p => p.id === form.podnosnikId),
      
    podnosnik: form.podnosnikId !== null,
    paymentMethod: form.paymentMethod === "karta" || form.paymentMethod === "gotowka",
  };

  const formValid =
    isValid.firstName &&
    isValid.lastName &&
    isValid.email &&
    isValid.startAt &&
    isValid.endAt &&
    isValid.services &&
    isValid.podnosnik &&
    isValid.availability &&
    isValid.paymentMethod;

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
      // checkAvailability(updated.startAt, updated.endAt);
      // loadAvailablePodnosniki(updated.startAt, updated.endAt);

      refreshAvailablePodnosniki(updated.startAt, updated.endAt);
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
         `http://localhost:3001/api/availability/podnosniki?${params}`
      );
      const data = await res.json();
      setAvailablePodnosniki(data);
    } catch {
      setAvailability(null);
    }
  }

  async function refreshAvailablePodnosniki(start, end) {
    const free = [];

    for (const p of podnosniki) {
      const params = new URLSearchParams({
        podnosnikId: p.id,
        od: new Date(start).toISOString(),
        do: new Date(end).toISOString(),
      });

      const res = await fetch(`http://localhost:3001/api/availability?${params}`);
      const data = await res.json();

      if (data.available) {
        free.push(p);
      }
    }

    setAvailablePodnosniki(free);

    if (free.length > 0) {
      setForm(f => ({ ...f, podnosnikId: free[0].id }));
    } else {
      setForm(f => ({ ...f, podnosnikId: null }));
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

    const hours = calculateHours(form.startAt, form.endAt);

    const payload = {
      podnosnikId: form.podnosnikId,
      imie: form.firstName,
      nazwisko: form.lastName,
      email: form.email,
      sposob_platnosci: form.paymentMethod,
      od_ts: new Date(form.startAt).toISOString(),
      do_ts: new Date(form.endAt).toISOString(),
      uslugi_json: services
        .filter(s => selected.includes(s.id))
        .map(s => ({
          uslugaId: s.id,
          nazwa: s.nazwa,
          typ: s.typ,
          stawka: s.stawka,
          ilosc: s.typ === "H" ? hours : 1,
          koszt: s.stawka * (s.typ === "H" ? hours : 1),
        }))
    };

    // 👇 jeśli niezalogowany → popup
    if (!user) {
      setPendingReservation(payload);
      setShowAccountPopup(true);
      return;
    }

    // 👇 jeśli zalogowany → normalny zapis
    sendReservation(payload);
  }





  async function sendReservation(payload) {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:3001/api/rezerwacje", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Błąd zapisu");
      }

      // ✅ SUKCES
      setSuccess(true);
      setShowAccountPopup(false);
      setPendingReservation(null);
    } catch (err) {
      console.error(err);
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

        <h2 className="h2-reservation-tittle">Nowa rezerwacja</h2>
        <form onSubmit={handleSubmit}>

          {!user && (
          <>
          <h3 className="h3-reservation-tittle"> Dane osobowe </h3>
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
          </>
          )}

          {user && (
            <div className="user-autofill h3-reservation-tittle-loggedin">
               <h3>Na konto: 👤 <b>{user.email}</b></h3>
            </div>
          )}

          

          <h3 className="h3-reservation-tittle">Termin</h3>
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
          
          {/* Termin dostepny / zajety */}
          {availability !== null && (
            <p className={availability ? "valid-text" : "invalid-text"}>
              {availability ? "Termin dostępny" : "Termin zajęty"}
            </p>
          )}

          <h3>Płatność</h3>
          <select
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={handleChange}
            className={`payment-method ${fieldClass("paymentMethod")}`}
          >
            <option value="">Wybierz metodę płatności</option>
            <option value="karta">Karta</option>
            <option value="gotowka">Gotówka</option>
          </select>

          <h3>Usługi</h3>
          <div className="services-list">
            {services.map((s) => (
              <label
                key={s.id}
                className={`service-option ${
                  selected.includes(s.id)
                    ? "valid"
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
              

          </div>

          <h3 className="h3-reservation-tittle">Płatność</h3>
                    <select
                      name="paymentMethod"
                      value={form.paymentMethod}
                      onChange={handleChange}
                      className={`payment-method ${fieldClass("paymentMethod")}`}
                    >
                      <option value="karta">Karta</option>
                      <option value="gotowka">Gotówka</option>
                    </select>


          <div className="summary">Suma: {previewTotal} zł</div>


          

          {error && <p className="invalid-text">{error}</p>}
          {success && <p className="valid-text">✔ Zapisano</p>}

          <button 
            className="submit-btn"
            disabled={loading || !formValid}>
            {loading ? "Wysyłanie..." : "Wyślij"}
          </button>
        </form>

        {showAccountPopup && (
          <div className="modal-backdrop">
            <div className="modal">

              <h3>Chcesz założyć konto?</h3>
              <p>
                Dzięki temu będziesz mógł:
                <br />• zobaczyć rezerwacje
                <br />• anulować termin
                <br />• pobrać fakturę
              </p>

              <div className="modal-actions">
                <button
                  className="btn-secondary"
                  onClick={() => sendReservation(pendingReservation)}
                >
                  Kontynuuj bez konta
                </button>

                <button
                className="btn-primary"
                onClick={() => {
                  localStorage.setItem(
                    "pendingReservation",
                    JSON.stringify(pendingReservation)
                    // JSON.stringify({
                    //   ...payload,
                    //   email: form.email   // 👈 ten mail MUSI być źródłem prawdy
                    // })
                  );
                  navigate("/register");
                }}
              >
                Załóż konto
              </button>

              
              </div>

            </div>
          </div>
        )}



        {success && (
          <div className="toast">
            ✔ Rezerwacja zapisana
          </div>
        )}

        
      </section>
    </section>
  );  
}
