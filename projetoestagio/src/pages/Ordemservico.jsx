import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/GerenciarOrdens.css"; 

const GerenciarOrdensServico = () => {
    // Estados para o formulário de nova ordem
    const [solicitante, setSolicitante] = useState("");
    const [idSetor, setIdSetor] = useState("");
    const [idTipoServico, setIdTipoServico] = useState("");
    const [descricao, setDescricao] = useState("");

    // Estados para carregar dados dos selects (setores e tipos de serviço)
    const [setores, setSetores] = useState([]);
    const [tiposServico, setTiposServico] = useState([]);

    // Estados para a pesquisa
    const [resultados, setResultados] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pesquisaRealizada, setPesquisaRealizada] = useState(false);

    // Efeito para carregar dados dos setores e tipos de serviço no início
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Substitua pelas suas rotas de API reais
                const resSetores = await axios.get('/api/setores');
                const resTipos = await axios.get('/api/tipos-servico');
                setSetores(resSetores.data);
                setTiposServico(resTipos.data);
            } catch (error) {
                console.error("Erro ao carregar dados iniciais:", error);
            }
        };
        fetchData();
    }, []);

    const handleCadastroSubmit = async (e) => {
        e.preventDefault();
        try {
            const novaOrdem = { solicitante, idSetor, idTipoServico, descricao, status: 'Aberto' };
            const response = await axios.post("/api/solicitacoes", novaOrdem);
            console.log("Ordem de Serviço cadastrada:", response.data);
            // Limpar formulário
            setSolicitante("");
            setIdSetor("");
            setIdTipoServico("");
            setDescricao("");
            alert("Ordem de Serviço criada com sucesso!");
        } catch (error) {
            console.error("Erro ao cadastrar Ordem de Serviço:", error);
            alert("Erro ao criar Ordem de Serviço.");
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setPesquisaRealizada(true);
        const searchValue = e.target.elements.inputsearch.value;
        try {
            const response = await axios.get(`/api/solicitacoes?search=${searchValue}`);
            setResultados(response.data || []);
        } catch (error) {
            console.error("Erro ao buscar ordens de serviço:", error);
            setResultados([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="ordens-container">
            {/* Card de Cadastro */}
            <div className="form-card">
                <h2 className="form-title">Abrir Nova Ordem de Serviço</h2>
                <form onSubmit={handleCadastroSubmit} className="form-grid">
                    <div>
                        <label htmlFor="solicitante" className="form-label">Solicitante</label>
                        <input id="solicitante" type="text" placeholder="Nome do solicitante" className="form-input" value={solicitante} onChange={(e) => setSolicitante(e.target.value)} required />
                    </div>
                    <div>
                        <label htmlFor="setor" className="form-label">Setor</label>
                        <select id="setor" className="form-input" value={idSetor} onChange={(e) => setIdSetor(e.target.value)} required>
                            <option value="">Selecione o setor</option>
                            {setores.map(setor => <option key={setor.id} value={setor.id}>{setor.nome}</option>)}
                        </select>
                    </div>
                    <div className="full-width">
                        <label htmlFor="tipo_servico" className="form-label">Tipo de Serviço</label>
                        <select id="tipo_servico" className="form-input" value={idTipoServico} onChange={(e) => setIdTipoServico(e.target.value)} required>
                            <option value="">Selecione o tipo de serviço</option>
                            {tiposServico.map(tipo => <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>)}
                        </select>
                    </div>
                    <div className="full-width">
                        <label htmlFor="descricao" className="form-label">Descrição do Problema</label>
                        <textarea id="descricao" placeholder="Descreva o problema ou a solicitação..." className="form-textarea" value={descricao} onChange={(e) => setDescricao(e.target.value)} required />
                    </div>
                    <div className="full-width mt-4">
                        <button type="submit" className="btn-primary">
                            Abrir Chamado
                        </button>
                    </div>
                </form>
            </div>

            {/* Card de Pesquisa */}
            <div className="form-card">
                <h2 className="form-title">Consultar Ordens de Serviço</h2>
                <form onSubmit={handleSearch} className="search-form">
                    <input id="inputsearch" name="inputsearch" type="text" placeholder="Pesquisar por solicitante, setor ou status..." className="form-input search-input" />
                    <button id="search-button" type="submit" className="btn-primary btn-search">
                        Pesquisar
                    </button>
                </form>
            </div>

            {/* Card de Resultados */}
            {pesquisaRealizada && (
                <div className="results-card">
                    <h3 className="results-title">Resultados da Pesquisa</h3>
                    {loading ? (
                        <div className="loading">Buscando...</div>
                    ) : resultados.length > 0 ? (
                        <table className="results-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Solicitante</th>
                                    <th>Setor</th>
                                    <th>Data</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {resultados.map((os) => (
                                    <tr key={os.id}>
                                        <td>{os.id}</td>
                                        <td>{os.solicitante}</td>
                                        <td>{os.setor.nome}</td>
                                        <td>{new Date(os.createdAt).toLocaleDateString()}</td>
                                        <td>{os.status}</td>
                                        <td>
                                            <button className="btn-secondary">Detalhes</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="no-results">Nenhuma ordem de serviço encontrada.</div>
                    )}
                </div>
            )}
        </main>
    );
};

export default GerenciarOrdensServico;