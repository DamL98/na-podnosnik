// import { useAuth } from "./AuthContext";
// import { Navigate } from "react-router-dom";

// export default function RequireGuest({ children }) {
//   const { user, loading } = useAuth();

//   if (loading) return null; // albo spinner

//   if (user) return <Navigate to="/" />;

//   return children;
// }

import { useAuth } from "./AuthContext";
import { Navigate, useLocation } from "react-router-dom";

export default function RequireGuest({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  // jeśli user istnieje i próbuje wejść na login/register → blokuj
  if (user && (location.pathname === "/login" || location.pathname === "/register")) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

