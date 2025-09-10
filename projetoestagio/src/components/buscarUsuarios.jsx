import { useState } from "react";
import axios from "axios";

const BuscaUsuarios = () => {
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

    const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
        try {
            await axios.delete(`/api/cadastro/${id}`);
            setResultados((prev) => prev.filter((usuario) => usuario.id !== id));
            alert("Usuário excluído com sucesso!");
        } catch (error) {
            console.error("Erro ao excluir usuário:", error);
            alert("Erro ao excluir usuário.");
        }
    }
};

    return (
        <div className="form-pesquisa">

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
                            <button 
                              className="btn-primary btn-delete" 
                              style={{marginTop: '0.2rem', padding: '0.4rem 0.8rem', fontSize: '0.8rem'}}
                              onClick={() => handleDelete(usuario.id)}
                            >
                              Excluir
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
        </div>
    );
}

export default BuscaUsuarios;