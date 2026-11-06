// Sign-in screen of the internal area.

import { useState } from "react";
import { AdminFormField } from "./AdminFormField.jsx";

export function Login({ db, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      onLogin(await db.auth.signIn(email.trim(), password));
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login">
      <form className="form" onSubmit={handleSubmit}>
        <h1>Área interna da RD</h1>
        {db.mode === "demo" && (
          <p className="admin-notice">
            Modo demonstração: o banco de dados ainda não está ligado. Os dados ficam só neste navegador.
          </p>
        )}
        <AdminFormField label="E-mail">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required />
        </AdminFormField>
        <AdminFormField label="Senha">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </AdminFormField>
        {error && (
          <p className="admin-error" role="alert">
            {error}
          </p>
        )}
        <button className="btn btn-whatsapp btn-large" type="submit" disabled={submitting}>
          {submitting ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
