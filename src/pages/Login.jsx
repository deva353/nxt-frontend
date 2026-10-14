import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { user, login, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <p className="loading">Checking session...</p>;
  }

  if (user) {
    return (
      <Navigate
        to={user.role === "admin" ? "/admin" : "/"}
        replace
      />
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const endpoint =
        mode === "register"
          ? "/auth/register"
          : "/auth/login";

      const payload =
        mode === "register"
          ? { name, email, password }
          : { email, password };

      const response = await api.post(endpoint, payload);

      login(response.data.token, response.data.user);

      navigate(
        response.data.user.role === "admin" ? "/admin" : "/",
        { replace: true }
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to connect to the backend."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page">
      <section className="card">
        <h1>Nxt Assess</h1>
        <p className="subtitle">
          {mode === "login"
            ? "Sign in to continue"
            : "Create your student account"}
        </p>

        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <label>
              Full name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
          )}

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              autoComplete={
                mode === "login"
                  ? "current-password"
                  : "new-password"
              }
              required
            />
          </label>

          {error && (
            <p className="error" role="alert">{error}</p>
          )}

          <button type="submit" disabled={submitting}>
            {submitting
              ? "Please wait..."
              : mode === "login"
                ? "Login"
                : "Register"}
          </button>
        </form>

        <p className="switch-mode">
          {mode === "login"
            ? "New student?"
            : "Already registered?"}{" "}
          <button
            className="text-button"
            type="button"
            onClick={() => {
              setMode(
                mode === "login" ? "register" : "login"
              );
              setError("");
            }}
          >
            {mode === "login" ? "Create account" : "Login"}
          </button>
        </p>
      </section>
    </main>
  );
}

export default Login;