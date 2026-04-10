import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginApi, getMe } from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const auth = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const loginRes = await loginApi({ username, password });
      const token = loginRes.data.access_token;

      localStorage.setItem("token", token);

      const meRes = await getMe();
      auth.login(token, meRes.data);

      navigate("/");
    } catch {
      localStorage.removeItem("token");
      setError("Usuário ou senha incorretos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Entrar</h1>

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
              autoComplete="username"
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
              autoComplete="current-password"
            />
          </div>

          {error && <p className="auth-form__error">{error}</p>}

          <button className="btn btn--primary auth-form__submit" type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="auth-form__footer">
          Não tem conta?{" "}
          <Link to="/register">Registrar-se</Link>
        </p>
      </div>
    </div>
  );
}
