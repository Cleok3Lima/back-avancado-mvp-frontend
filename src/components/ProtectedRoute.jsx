import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Aguarda a validação inicial do token antes de decidir redirecionar
  if (loading) {
    return <div className="loading-session">Verificando sessão...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
