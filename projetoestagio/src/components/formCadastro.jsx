import { useState, useEffect } from "react"; // 1. Importar o useEffect
import axios from "axios";

const CadastroUsuario = () => {
  
    const [NOME_USUARIO, setNome] = useState("");
    const [EMAIL, setEmail] = useState("");
    const [SENHA, setSenha] = useState("");
    const [CPF, setCpf] = useState("");
    const [ID_SETOR, setIdSetor] = useState(""); 
    const [setores, setSetores] = useState([]);
    const [TIPO_USUARIO, setTipoUsuario] = useState("");

    const tiposDeUsuario = [
        { value: 'administrador', label: 'Admin' },
        { value: 'tecnico', label: 'dev' },
        { value: 'usuario', label: 'User' }
    ];

    useEffect(() => {
        const fetchSetores = async () => {
            try {
                const response = await axios.get('/api/setores');
                setSetores(response.data); 
            } catch (error) {
                console.error("Erro ao buscar os setores:", error);
                alert("Não foi possível carregar a lista de setores.");
            }
        };
        fetchSetores();
    }, []); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if(!NOME_USUARIO || !EMAIL || !SENHA || !CPF || !ID_SETOR || !TIPO_USUARIO){
            alert("Por favor, preencha todos os campos.");
            return; 
        }

        try {
         
            const response = await axios.post("/api/cadastro", { NOME_USUARIO, EMAIL, SENHA, CPF, TIPO_USUARIO, ID_SETOR });
            console.log("Usuário cadastrado:", response.data);

            setNome("");
            setEmail("");
            setSenha("");
            setCpf("");
            setIdSetor("");
            setTipoUsuario("");
            alert("Usuário cadastrado com sucesso!");
        } catch (error) {
            console.error("Erro ao cadastrar:", error);
            const errorMessage = error.response?.data?.error || "Erro ao cadastrar usuário.";
            alert(errorMessage);
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
                id="nome" type="text" placeholder="Nome completo" className="form-input"
                value={NOME_USUARIO} onChange={(e) => setNome(e.target.value)} 
              />
            </div>

            <div>
              <label htmlFor="email" className="form-label">Email</label>
              <input 
                id="email" type="email" placeholder="exemplo@email.com" className="form-input"
                value={EMAIL} onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="senha" className="form-label">Senha</label>
              <input 
                id="senha" type="password" placeholder="••••••••" className="form-input"
                value={SENHA} onChange={(e) => setSenha(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="cpf" className="form-label">CPF</label>
              <input 
                id="cpf" type="text" placeholder="Apenas números" className="form-input"
                value={CPF} onChange={(e) => setCpf(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="Setor" className="form-label">Setor</label>
              <select 
                id="Setor" 
                className="form-input"
                value={ID_SETOR}
                onChange={(e) => setIdSetor(e.target.value)}
              >
                <option value="">Selecione o setor</option>
                {setores.map(setor => (
                  <option key={setor.ID_SETOR} value={setor.ID_SETOR}>
                    {setor.NOME_SETOR}
                  </option>
                ))}
              </select>
            </div>
         <div>
              <label htmlFor="tipo_usuario" className="form-label">Permissões</label>
              <select 
                id="tipo_usuario" className="form-input"
                value={TIPO_USUARIO} onChange={(e) => setTipoUsuario(e.target.value)}
              >
                <option value="">Selecione...</option>
                {tiposDeUsuario.map((tipo) => (
                   <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                ))}
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