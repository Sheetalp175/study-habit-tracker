import React, { useState } from "react";
import axios from "axios";
import "../App.css";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/users/register", {
        name,
        email,
        password,
      });
      alert("Registered successfully! Please login.");
      window.location.href = "/login";
    } catch (err) {
      console.error(err?.response?.data || err);
      alert(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-center">
      <div className="card auth-card">
        <h2 className="title">Create account</h2>
        <p className="muted">Start tracking your study habits</p>

        <form onSubmit={handleRegister} className="form-grid">
          <label className="label">
            Full name
            <input className="input" type="text" required value={name} onChange={(e) => setName(e.target.value)} />
          </label>

          <label className="label">
            Email
            <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>

          <label className="label">
            Password
            <input className="input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </button>

          <div className="muted small">
            Already have an account? <a href="/login">Sign in</a>
          </div>
        </form>
      </div>
    </div>
  );
}
