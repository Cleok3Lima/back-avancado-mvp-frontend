// components/Navbar.jsx
// Barra de navegação global — exibe links e estado de autenticação do usuário

import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const linkClass = ({ isActive }) =>
    isActive ? "navbar__link navbar__link--active" : "navbar__link";

  return (
    <header className="navbar">
      <div className="navbar__brand">
        <Link to="/">🛸 Rick &amp; Morty Diário</Link>
      </div>
      <nav className="navbar__links">
        <NavLink to="/" end className={linkClass}>
          Episódios
        </NavLink>
        {user && (
          <NavLink to="/diario" className={linkClass}>
            Meu Diário
          </NavLink>
        )}
        {user ? (
          <>
            <span className="navbar__user">👤 {user.username}</span>
            <button className="btn btn--outline navbar__logout" onClick={handleLogout}>
              Sair
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={linkClass}>
              Entrar
            </NavLink>
            <NavLink to="/register" className={linkClass}>
              Registrar
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
}
