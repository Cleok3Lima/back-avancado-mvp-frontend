// components/Navbar.jsx
// Barra de navegação global — exibe links e estado de autenticação do usuário

import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fecha o dropdown sempre que a rota mudar
  useEffect(() => {
    setDropdownOpen(false);
  }, [location.pathname]);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          <div className="navbar__user-menu" ref={dropdownRef}>
            <button
              className="navbar__user-btn"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              👤 {user.username}
            </button>
            {dropdownOpen && (
              <div className="navbar__dropdown">
                <div className="navbar__dropdown-info">
                  <p className="navbar__dropdown-label">Usuário</p>
                  <p className="navbar__dropdown-value">{user.username}</p>
                </div>
                <div className="navbar__dropdown-info">
                  <p className="navbar__dropdown-label">E-mail</p>
                  <p className="navbar__dropdown-value">{user.email}</p>
                </div>
                <hr className="navbar__dropdown-divider" />
                <button className="navbar__dropdown-logout" onClick={handleLogout}>
                  Sair
                </button>
              </div>
            )}
          </div>
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
