import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";


export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({ email: "", password: "", password2: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  // async function handleSubmit(e) {
  //   e.preventDefault();
  //   setError(null);

  //   if (form.password !== form.password2) {
  //     setError("Hasła nie są takie same.");
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     await register(form.email, form.password);
  //     navigate("/");
  //   } catch (err) {
  //     setError(err.response?.data?.error || "Błąd rejestracji");
  //   } finally {
  //     setLoading(false);
  //   }
  // }


  // TEN JEST OK
  // async function handleSubmit(e) {
  //   e.preventDefault();
  //   setError(null);

  //   if (form.password !== form.password2) {
  //     setError("Hasła nie są takie same.");
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     const user = await register(form.email, form.password);
  //     const token = localStorage.getItem("token");

  //     const pending = localStorage.getItem("pendingReservation");

  //     if (pending) {
  //       const reservation = JSON.parse(pending);
  //       localStorage.removeItem("pendingReservation");

  //       await fetch("http://localhost:3001/api/rezerwacje", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: JSON.stringify(reservation),
  //       });

  //       navigate("/dashboard"); // lub /profile
  //     } else {
  //       navigate("/");
  //     }
  //   } catch (err) {
  //     setError("Błąd rejestracji");
  //   } finally {
  //     setLoading(false);
  //   }
  // }

    async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (form.password !== form.password2) {
      setError("Hasła nie są takie same.");
      return;
    }

    try {
      setLoading(true);

      await register(form.email, form.password);

      const token = localStorage.getItem("token");
      const pending = localStorage.getItem("pendingReservation");

      if (pending && token) {
        const reservation = JSON.parse(pending);

        //reservation.email = form.email;   // email konta
        //reservation.imie = "";            // backend weźmie z user.firstName
        //reservation.nazwisko = "";

        localStorage.removeItem("pendingReservation");

        const res = await fetch("http://localhost:3001/api/rezerwacje", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(reservation)
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Nie udało się zapisać rezerwacji");
        }

        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Błąd rejestracji");
    } finally {
      setLoading(false);
    }
  }




  return (
    <section className="section">
      <h1>Załóż konto</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Hasło"
          value={form.password}
          onChange={handleChange}
          required
        />

        <input
          name="password2"
          type="password"
          placeholder="Powtórz hasło"
          value={form.password2}
          onChange={handleChange}
          required
        />

        {error && <p className="invalid-text">{error}</p>}

        <button className="submit-btn" disabled={loading}>
          {loading ? "Tworzenie konta..." : "Zarejestruj"}
        </button>

        {error && <p className="invalid-text">{error}</p>}
      </form>

      <p style={{ marginTop: 16 }}>
        Masz już konto? <Link to="/login">Zaloguj się</Link>
      </p>
    </section>
  );
}
