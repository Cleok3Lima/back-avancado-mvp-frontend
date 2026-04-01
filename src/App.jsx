// App.jsx
// Componente raiz — define as rotas, AuthProvider e layout global da aplicação

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import EpisodeDetail from "./pages/EpisodeDetail";
import MyDiary from "./pages/MyDiary";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />

        <main className="main-content">
          <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Rotas protegidas — exigem autenticação */}
            <Route
              path="/episodio/:id"
              element={
                <ProtectedRoute>
                  <EpisodeDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/diario"
              element={
                <ProtectedRoute>
                  <MyDiary />
                </ProtectedRoute>
              }
            />
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
      </AuthProvider>
    </BrowserRouter>
  );
}
