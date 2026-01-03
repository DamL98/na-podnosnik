import { useState } from "react";

const services = [
  { id: "lift", name: "Podnośnik", price: 50 },
  { id: "tools", name: "Zestaw narzędzi", price: 30 },
  { id: "diagnostics", name: "Diagnostyka OBD", price: 40 },
  { id: "oil", name: "Wymiana oleju", price: 60 },
  { id: "consultation", name: "Pomoc mechanika", price: 100 },
];

export default function Reservation() {
  const [selected, setSelected] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
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

  const total = services
    .filter((s) => selected.includes(s.id))
    .reduce((sum, s) => sum + s.price, 0);

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.name || !form.email || !form.phone) {
      alert("Uzupełnij wszystkie dane kontaktowe.");
      return;
    }

    console.log({
      client: form,
      services: selected,
      estimatedCost: total,
    });

    alert("Rezerwacja wysłana (demo)");
  }

  return (
    <section className="section">
      <h1>Rezerwacja warsztatu</h1>

      <form onSubmit={handleSubmit}>
        <h2>Dane kontaktowe</h2>

        <input
          name="name"
          placeholder="Imię i nazwisko"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Adres email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="phone"
          placeholder="Numer telefonu"
          value={form.phone}
          onChange={handleChange}
          required
        />

        <h2>Wybierz usługi</h2>

        {services.map((service) => (
          <label key={service.id}>
            <input
              type="checkbox"
              checked={selected.includes(service.id)}
              onChange={() => toggleService(service.id)}
            />
            {service.name} – {service.price} zł
          </label>
        ))}

        <div className="summary">
          Łączny koszt: {total} zł
        </div>

        <button style={{ marginTop: "24px" }}>
          Wyślij rezerwację
        </button>
      </form>
    </section>
  );
}
