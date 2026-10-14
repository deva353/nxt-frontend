import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="loading">Checking your session...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
  return (
    <Navigate
      to={user.role === "admin" ? "/admin" : "/"}
      replace
    />
  );
}

  return <Outlet />;
}

export default ProtectedRoute;