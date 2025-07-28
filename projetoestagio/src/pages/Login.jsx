// src/pages/Login.jsx
import { useState } from "react";
import { useAuth } from "../context/Authtab.jsx";
import { useNavigate } from "react-router-dom";
import "../Styles/Login.css";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

  // Validação simples
    if (!email || !email.includes("@")) {
      setError("Por favor, insira um email válido");
      return;
    }
    
    if (!password || password.length < 8) { // exemplo: senha com pelo menos 6 caracteres
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }
    
    try {
      login({ email, password });
      navigate("/dashboard");
    } catch (err) {
      setError("Credenciais inválidas. Por favor, tente novamente.");
      console.error("Login failed:", err);
    }
  };

  return (
    <form id="login-form" onSubmit={handleSubmit}>

      <img id="imglogin" src="./public/Brasao_caratinga.png" alt="brasaoctga" />
     <div className="prefeitura-texto">
  <span className="linha-superior">Prefeitura</span>
  <span className="linha-inferior">De Caratinga</span>
</div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      <input id="input-email" className="input"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      
      <input id="input-password" className="input"
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      
      <button id="botao" type="submit">Entrar</button>
    </form >
  );
}