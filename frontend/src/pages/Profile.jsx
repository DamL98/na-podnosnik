import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "" });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3001/api/me", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(d => {
        setData(d);
        setForm({
          firstName: d.firstName || "",
          lastName: d.lastName || "",
          phone: d.phone || ""
        });
      });
  }, []);

  async function save() {
    await fetch("http://localhost:3001/api/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(form)
    });

    setData({ ...data, ...form });
    setEditing(false);
  }

  if (!data) return <p>Ładowanie…</p>;

  return (
    <section className="section profile">
      <h1>Mój profil</h1>

      {/* INFO O KONCIE */}
      <div className="profile-card">
        <h3>Konto</h3>
        <p><b>Email:</b> {user.email}</p>
      </div>

      {/* DANE */}
      <div className="profile-card">
        <h3>Dane osobowe</h3>

        {!editing ? (
          <>
            <p><b>Imię:</b> {data.firstName || "—"}</p>
            <p><b>Nazwisko:</b> {data.lastName || "—"}</p>
            <p><b>Telefon:</b> {data.phone || "—"}</p>

            <button className="btn-secondary" onClick={() => setEditing(true)}>
              Edytuj dane
            </button>
          </>
        ) : (
          <>
            <input
              placeholder="Imię"
              value={form.firstName}
              onChange={e => setForm({ ...form, firstName: e.target.value })}
            />
            <input
              placeholder="Nazwisko"
              value={form.lastName}
              onChange={e => setForm({ ...form, lastName: e.target.value })}
            />
            <input
              placeholder="Telefon"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
            />

            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={save}>Zapisz</button>
              <button
                className="btn-secondary"
                onClick={() => setEditing(false)}
              >
                Anuluj
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
