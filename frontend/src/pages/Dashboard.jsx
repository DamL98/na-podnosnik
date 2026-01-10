import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [list, setList] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/me/rezerwacje", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(setList);
  }, []);

  return (
    <section className="section">
      <h1>Moje rezerwacje</h1>

      {list.map(r => (
        <div key={r.id} className="reservation-card">
          <strong>{new Date(r.od_ts).toLocaleString()}</strong> →{" "}
          {new Date(r.do_ts).toLocaleString()}
          <pre>{JSON.stringify(r.uslugi_json, null, 2)}</pre>
        </div>
      ))}
    </section>
  );
}
