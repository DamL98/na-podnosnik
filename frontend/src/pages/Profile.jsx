import { useEffect, useState } from "react";

export default function Profile() {
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "" });

  useEffect(() => {
    fetch("http://localhost:3001/api/me", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(setForm);
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
    alert("Zapisano");
  }

  return (
    <section className="section">
      <h1>Mój profil</h1>

      <input
        placeholder="Imię"
        value={form.firstName || ""}
        onChange={e => setForm({ ...form, firstName: e.target.value })}
      />
      <input
        placeholder="Nazwisko"
        value={form.lastName || ""}
        onChange={e => setForm({ ...form, lastName: e.target.value })}
      />
      <input
        placeholder="Telefon"
        value={form.phone || ""}
        onChange={e => setForm({ ...form, phone: e.target.value })}
      />

      <button onClick={save}>Zapisz</button>
    </section>
  );
}
