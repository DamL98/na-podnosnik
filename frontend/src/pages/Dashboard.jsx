import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const { user, loading: authLoading } = useAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/");
    }
  }, [user, authLoading]);


  useEffect(() => {
  if (!user) return; // jeszcze nie wiemy kto to

  fetch("http://localhost:3001/api/me/rezerwacje", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  })
    .then(res => res.json())
    .then(data => {
      setList(data);
      setLoading(false);
    });
}, [user]);

  return (
    <section className="section dashboard">
      <h1>Moje rezerwacje</h1>
      <p className="dashboard-sub">
        {/* Zalogowany jako <b>{user.email}</b> */}
      </p>

      {loading && <p>Ładowanie...</p>}

      {!loading && list.length === 0 && (
        <p className="empty">Nie masz jeszcze żadnych rezerwacji</p>
      )}

      <div className="dashboard-grid">
        {list.map(r => {
          const start = new Date(r.od_ts);
          const end = new Date(r.do_ts);

          return (
            <div key={r.id} className="reservation-tile">
              <div className="tile-header">
                <span className="date">
                  {start.toLocaleDateString()}
                </span>
                <span className="time">
                  {start.toLocaleTimeString().slice(0,5)} – {end.toLocaleTimeString().slice(0,5)}
                </span>
              </div>

              <div className="tile-body">
                <div className="station">
                  🛠 Rezerwacja - Podnośnik #{r.podnosnikid}
                </div>

                <div className="services">
                  {r.uslugi_json.map((u, i) => (
                    <div key={i} className="service-row">
                      <span>{u.nazwa}</span>
                      <span>{u.koszt} zł</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="tile-footer">
                <span className="payment">
                  {r.sposob_platnosci === "karta" ? "💳 Karta" : "💵 Gotówka"}
                </span>

                <span className="total">
                  {r.uslugi_json.reduce((s,u)=>s+u.koszt,0)} zł
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
