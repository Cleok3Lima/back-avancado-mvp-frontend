// pages/Register.jsx
// Página de cadastro — cria uma nova conta de usuário

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      await register({ username, email, password });
      navigate("/login", { state: { registered: true } });
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Criar conta</h1>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form__field">
            <label htmlFor="username">Usuário</label>
            <input
              id="username"
              className="auth-form__input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              maxLength={50}
              autoComplete="username"
            />
          </div>

          <div className="auth-form__field">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              className="auth-form__input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="auth-form__field">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              className="auth-form__input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          <div className="auth-form__field">
            <label htmlFor="confirmPassword">Confirmar senha</label>
            <input
              id="confirmPassword"
              className="auth-form__input"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          {error && <p className="auth-form__error">{error}</p>}

          <button className="btn btn--primary auth-form__submit" type="submit" disabled={loading}>
            {loading ? "Criando conta..." : "Registrar"}
          </button>
        </form>

        <p className="auth-form__footer">
          Já tem conta?{" "}
          <Link to="/login">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
