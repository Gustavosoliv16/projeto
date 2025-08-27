import { useState } from "react";
import axios from "axios";
import "../styles/Cadpage.css"; 



const CadastroUsuario = () => {
    const [NOME_USUARIO, setNome] = useState("");
    const [EMAIL, setEmail] = useState("");
    const [SENHA, setSenha] = useState("");
    const [CPF, setCpf] = useState("");
    const [DEPARTAMENTO, setDepartamento] = useState("");
    const [TIPO_USUARIO, setTipoUsuario] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post("/api/cadastro", { NOME_USUARIO, EMAIL, SENHA, CPF, DEPARTAMENTO, TIPO_USUARIO });
            console.log("Usuário cadastrado:", response.data);
           
            setNome("");
            setEmail("");
            setSenha("");
            setCpf("");
            setDepartamento("");
            setTipoUsuario("");
        } catch (error) {
            console.error("Erro ao cadastrar:", error);
        }
    }

    const [resultados, setResultados] = useState([]);
const [loading, setLoading] = useState(false);
const [pesquisaRealizada, setPesquisaRealizada] = useState(false);
const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPesquisaRealizada(true);
    
    const searchValue = e.target.elements.inputsearch.value;
    try {
        const response = await axios.get(`/api/cadastro?search=${searchValue}`);
        console.log("Resultado da busca:", response.data);
        setResultados(response.data || []); 
    } catch (error) {
        console.error("Erro ao buscar:", error);
        setResultados([]);
    } finally {
        setLoading(false);
    }
}
    return (
      <main className="forms-container">

        <div className="form-card">
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

     
        <div className="form-card">
          <h2 className="form-title">Pesquisar Usuários</h2>
          <form onSubmit={handleSearch} className="search-form">
            <input
              id="inputsearch"
              name="inputsearch" 
              type="text"
              placeholder="Pesquisar por nome, email ou CPF..."
              className="form-input search-input"
            />
            <button id="search-button" type="submit" className="btn-primary btn-search">
              Pesquisar
            </button>
          </form>
        </div>

        {pesquisaRealizada && (
  <div className="results-card">
    <h3 className="results-title">Resultados da Pesquisa</h3>
    
    {loading ? (
      <div className="loading">Buscando usuários...</div>
    ) : resultados.length > 0 ? (
      <table className="results-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>CPF</th>
            <th>Departamento</th>
            <th>Tipo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {resultados.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.NOME_USUARIO || usuario.nome}</td>
              <td>{usuario.EMAIL || usuario.email}</td>
              <td>{usuario.CPF || usuario.cpf}</td>
              <td>{usuario.DEPARTAMENTO || usuario.departamento}</td>
              <td>{usuario.TIPO_USUARIO || usuario.tipo}</td>
              <td>
                <button 
                  className="btn-primary" 
                  style={{padding: '0.4rem 0.8rem', fontSize: '0.8rem'}}
                  onClick={() => console.log('Editar usuário:', usuario.id)}
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <div className="no-results">
        Nenhum usuário encontrado para os critérios de pesquisa.
      </div>
    )}
  </div>
)}


      </main>
    );
}

export default CadastroUsuario;