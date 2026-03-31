// App.jsx
// Componente raiz — define as rotas e o layout global da aplicação

import { BrowserRouter, Routes, Route, Link, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import EpisodeDetail from "./pages/EpisodeDetail";
import MyDiary from "./pages/MyDiary";

export default function App() {
  return (
    <BrowserRouter>
      {/* Barra de navegação global */}
      <header className="navbar">
        <div className="navbar__brand">
          <Link to="/">🛸 Rick &amp; Morty Diário</Link>
        </div>
        <nav className="navbar__links">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "navbar__link navbar__link--active" : "navbar__link"
            }
          >
            Episódios
          </NavLink>
          <NavLink
            to="/diario"
            className={({ isActive }) =>
              isActive ? "navbar__link navbar__link--active" : "navbar__link"
            }
          >
            Meu Diário
          </NavLink>
        </nav>
      </header>

      {/* Conteúdo principal */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/episodio/:id" element={<EpisodeDetail />} />
          <Route path="/diario" element={<MyDiary />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>
          Dados fornecidos pela{" "}
          <a href="https://rickandmortyapi.com" target="_blank" rel="noreferrer">
            Rick and Morty API
          </a>{" "}
          • Licença MIT
        </p>
      </footer>
    </BrowserRouter>
  );
}
