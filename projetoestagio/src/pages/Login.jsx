import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import "../Styles/Login.css";
import axios from "axios";

export default function Login() {
  const [EMAIL, setEmail] = useState("");
  const [SENHA, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { login } = useAuth();

const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const response = await axios.post("/api/login", { EMAIL, SENHA });
    const { token } = response.data;
    login(token);
    navigate("/telainicial");

  } catch (error) {
    console.error("Login failed:", error);
    if (error.response && error.response.data && error.response.status) { setError(error.response.data.error); } else {
      console.error("Erro desconhecido:", error);
      setError("Credenciais inválidas. Por favor, tente novamente.");
    }
  }
}
  return (
    <form id="login-form" onSubmit={handleLogin}>

      <img id="imglogin" src="/Brasao_Caratinga.png" alt="brasaoctga" />
     <div className="prefeitura-texto">
  <span className="linha-superior">Prefeitura</span>
  <span className="linha-inferior">De Caratinga</span>
</div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      <input id="input-email" className="input"
        type="email"
        placeholder="Email"
        value={EMAIL}
        onChange={(e) => setEmail(e.target.value)}
      />
      
      <input id="input-password" className="input"
        type="password"
        placeholder="Senha"
        value={SENHA}
        onChange={(e) => setPassword(e.target.value)}
      />
      
      <button id="botao" type="submit">Entrar</button>
    </form >
  );
}
