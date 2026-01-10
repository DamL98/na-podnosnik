import { useState } from "react";
import { useNavigate, Link, replace } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      await login(form.email, form.password);

      navigate("/dashboard", { replace: true }); // albo /reservation
    } catch (err) {
      setError(err.message || "Błąd logowania");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section">
      <h1>Zaloguj się</h1>

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

        {error && <p className="invalid-text">{error}</p>}

        <button className="submit-btn" disabled={loading}>
          {loading ? "Logowanie..." : "Zaloguj"}
        </button>
      </form>

      <p style={{ marginTop: 16 }}>
        Nie masz konta? <Link to="/register">Załóż konto</Link>
      </p>

      {/* OAuth (na razie jako linki – backend dodamy później) */}
      <div style={{ marginTop: 24, display: "grid", gap: 12 }}>
        <a className="btn-secondary" href="http://localhost:3001/api/auth/google">
          Zaloguj przez Google
        </a>
        <a className="btn-secondary" href="http://localhost:3001/api/auth/github">
          Zaloguj przez GitHub
        </a>
      </div>
    </section>
  );
}
