import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const pending = JSON.parse(localStorage.getItem("pendingReservation") || "null");

  const [email, setEmail] = useState(pending?.email || "");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);



  // useEffect(() => {
  //   if (!pending) {
  //     navigate("/");
  //   }
  // }, []);

  const fromReservation = Boolean(pending);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (password !== password2) {
      setError("Hasła nie są takie same");
      return;
    }

    try {
      setLoading(true);

      await register(email, password);
      // const token = localStorage.getItem("token");

      // const res = await fetch("http://localhost:3001/api/rezerwacje", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`
      //   },
      //   body: JSON.stringify(pending)
      // });

      if (fromReservation) {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:3001/api/rezerwacje", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(pending)
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        localStorage.removeItem("pendingReservation");
        navigate("/dashboard");
    } else {
      navigate("/");
    }

      // const data = await res.json();
      // if (!res.ok) throw new Error(data.error);

      localStorage.removeItem("pendingReservation");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Błąd rejestracji");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section">
      <h1>{fromReservation ? "Dokończ rejestrację" : "Załóż konto"}</h1>

      {fromReservation && (
        <p>Tworzymy konto dla: <b>{email}</b></p>
      )}

      <form onSubmit={handleSubmit}>
        {/* <input value={email} disabled /> */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          disabled={fromReservation}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Powtórz hasło"
          value={password2}
          onChange={e => setPassword2(e.target.value)}
          required
        />

        {error && <p className="invalid-text">{error}</p>}

        <button className="submit-btn" disabled={loading}>
          {loading ? "Tworzenie konta..." : "Załóż konto i zapisz rezerwację"}
        </button>
      </form>
    </section>
  );
}
