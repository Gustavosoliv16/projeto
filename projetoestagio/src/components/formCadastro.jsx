import { useState } from "react";
import axios from "axios";
import "../styles/Cadastropag.css"; 



const CadastroUsuario = () => {
  
    const [NOME_USUARIO, setNome] = useState("");
    const [EMAIL, setEmail] = useState("");
    const [SENHA, setSenha] = useState("");
    const [CPF, setCpf] = useState("");
    const [DEPARTAMENTO, setDepartamento] = useState("");
    const [TIPO_USUARIO, setTipoUsuario] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        
    if(NOME_USUARIO.length === 0 || EMAIL.length === 0 || SENHA.length === 0 || CPF.length === 0 || DEPARTAMENTO.length === 0 || TIPO_USUARIO.length === 0){
                alert("Por favor, preencha todos os campos.");
                return; 
            }

        try {
            const response = await axios.post("/api/cadastro", { NOME_USUARIO, EMAIL, SENHA, CPF, DEPARTAMENTO, TIPO_USUARIO });
            console.log("Usuário cadastrado:", response.data);

            setNome("");
            setEmail("");
            setSenha("");
            setCpf("");
            setDepartamento("");
            setTipoUsuario("");
            alert("Usuário cadastrado com sucesso!");
        } catch (error) {
            console.error("Erro ao cadastrar:", error);
            alert("Erro ao cadastrar usuário.");
        }
    }

    return (
      <main>

        <div className="form-cadastro form-card">
          <h2 className="form-title">Cadastrar Novo Usuário</h2>
          <form onSubmit={handleSubmit} className="form-grid">
            
            <div>
              <label htmlFor="nome" className="form-label">Nome</label>
              <input 
                id="nome" 
                type="text" 
                placeholder="Nome completo" 
                className="form-input"
                value={NOME_USUARIO} 
                onChange={(e) => setNome(e.target.value)} 
              />
            </div>

            <div>
              <label htmlFor="email" className="form-label">Email</label>
              <input 
                id="email" 
                type="email" 
                placeholder="exemplo@email.com" 
                className="form-input"
                value={EMAIL}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="senha" className="form-label">Senha</label>
              <input 
                id="senha" 
                type="password" 
                placeholder="••••••••" 
                className="form-input"
                value={SENHA}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="cpf" className="form-label">CPF</label>
              <input 
                id="cpf" 
                type="text" 
                placeholder="000.000.000-00" 
                className="form-input"
                value={CPF}
                onChange={(e) => setCpf(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="departamento" className="form-label">Departamento</label>
              <select 
                id="departamento" 
                className="form-input"
                value={DEPARTAMENTO}
                onChange={(e) => setDepartamento(e.target.value)}
              >
                <option value="">Selecione o departamento</option>
                <option value="TI">TI</option>
                <option value="RH">RH</option>
                <option value="Financeiro">Financeiro</option>
              </select>
            </div>

            <div>
              <label htmlFor="tipo_usuario" className="form-label">Tipo de Usuário</label>
              <select 
                id="tipo_usuario" 
                className="form-input"
                value={TIPO_USUARIO}
                onChange={(e) => setTipoUsuario(e.target.value)}
              >
                <option value="">Selecione o tipo de usuário</option>
                <option value="administrador">Admin</option>
                <option value="usuario">User</option>
              </select>
            </div>

            <div className="md:col-span-2 mt-4">
              <button type="submit" className="btn-primary">
                Cadastrar
              </button>
            </div>
          </form>
        </div>
      </main>
    );
}

export default CadastroUsuario;