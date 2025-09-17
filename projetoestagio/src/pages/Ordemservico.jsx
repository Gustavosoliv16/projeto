import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/GerenciarOrdens.css";

const formatarData = (dataValor) => {
    if (!dataValor) return 'N/A';
    const data = new Date(dataValor);
    if (isNaN(data.getTime())) return 'Data Inválida';
    return data.toLocaleDateString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    });
};

const GerenciarOrdensServico = () => {
    const { user } = useAuth();
    
    // 1. Estados corrigidos para o formulário
    const [idTipoServico, setIdTipoServico] = useState("");
    const [patrimonio, setPatrimonio] = useState(""); // Novo estado para o patrimônio
    const [descricao, setDescricao] = useState("");
    const [tiposServico, setTiposServico] = useState([]); // Para popular o dropdown

    const [resultados, setResultados] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pesquisaRealizada, setPesquisaRealizada] = useState(false);

    // 2. useEffect agora busca os tipos de serviço para o dropdown
    useEffect(() => {
        const fetchTiposServico = async () => {
            try {
                const res = await axios.get('/api/tipos-servico');
                setTiposServico(res.data);
            } catch (error) {
                console.error("Erro ao carregar tipos de serviço:", error);
            }
        };
        fetchTiposServico();
    }, []);

    // 3. Lógica de submissão corrigida
    const handleCadastroSubmit = async (e) => {
        e.preventDefault();

        if (!user || !user.id) {
            alert("Erro: Utilizador não autenticado.");
            return;
        }
        try {
            const novaOrdem = {
                ID_USUARIO_SOLICITANTE: user.id,
                ID_SERVICO: idTipoServico, // Agora envia o ID do serviço correto
                PATRIMONIO: patrimonio,   // E o patrimônio no campo correto
                DESCRICAO: descricao
            };

            await axios.post("/api/solicitacoes", novaOrdem);
            alert("Ordem de Serviço criada com sucesso!");
            
            // Limpa o formulário
            setIdTipoServico("");
            setPatrimonio("");
            setDescricao("");

            // Se uma pesquisa foi feita, limpa os resultados para forçar uma nova busca
            if (pesquisaRealizada) {
                handleSearch({ preventDefault: () => {}, target: { elements: { inputsearch: { value: '' } } } });
            }
        } catch (error) {
            console.error("Erro ao cadastrar Ordem de Serviço:", error);
            alert(error.response?.data?.error || "Erro ao criar Ordem de Serviço.");
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setPesquisaRealizada(true);
        const searchValue = e.target.elements.inputsearch.value.toLowerCase();
        try {
            const response = await axios.get(`/api/solicitacoes`); 
            
            const filtrados = response.data.filter(os =>
                (os.NOME_SOLICITANTE || '').toLowerCase().includes(searchValue) ||
                (os.STATUS || '').toLowerCase().includes(searchValue) ||
                (os.NOME_SERVICO || '').toLowerCase().includes(searchValue) ||
                (os.NOME_SETOR || '').toLowerCase().includes(searchValue)
            );
            setResultados(filtrados || []);
        } catch (error) {
            console.error("Erro ao buscar ordens de serviço:", error);
            setResultados([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDetalhes = (e, os) => {
        e.preventDefault();
        const detalhes = `
            Detalhes do Chamado #${os.ID_SOLICITACAO}:
            ---------------------------------
            Solicitante: ${os.NOME_SOLICITANTE || 'N/A'}
            Responsável: ${os.NOME_RESPONSAVEL || 'Não atribuído'}
            Setor: ${os.NOME_SETOR || 'N/A'}
            Serviço: ${os.NOME_SERVICO || 'N/A'}
            Status: ${os.STATUS}
            Data: ${formatarData(os.DATA_CRIACAO)}
            ---------------------------------
            Descrição: ${os.DESCRICAO}
        `;
        alert(detalhes);
    };

    return (
        <main className="ordens-container">
            
            <div className="form-card">
                <h2 className="form-title">Abrir Nova Ordem de Serviço</h2>
                <form onSubmit={handleCadastroSubmit} className="form-grid">
                   <div className="full-width">
                        <label className="form-label">Solicitante</label>
                        <input type="text" className="form-input" value={user ? user.nome : "Carregando..."} disabled />
                    </div>
                    <div>
                        <label htmlFor="tipo_servico" className="form-label">Tipo de Serviço</label>
                        <select 
                            id="tipo_servico" 
                            className="form-input" 
                            value={idTipoServico} 
                            onChange={(e) => setIdTipoServico(e.target.value)} 
                            required
                        >
                            <option value="">Selecione um serviço...</option>
                            {tiposServico.map(servico => (
                                <option key={servico.ID_SERVICO} value={servico.ID_SERVICO}>
                                    {servico.NOME_SERVICO}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="patrimonio" className="form-label">Nº do Patrimônio (Opcional)</label>
                        <input 
                            id="patrimonio" 
                            className="form-input" 
                            placeholder="Digite o número do patrimônio" 
                            value={patrimonio} 
                            onChange={(e) => setPatrimonio(e.target.value)} 
                        />
                    </div>
                    
                    <div className="full-width">
                        <label htmlFor="descricao" className="form-label">Descrição do Problema</label>
                        <textarea id="descricao" placeholder="Descreva o problema..." className="form-textarea" value={descricao} onChange={(e) => setDescricao(e.target.value)} required />
                    </div>

                    <div className="full-width mt-4">
                        <button type="submit" className="btn-primary">
                            Abrir Chamado
                        </button>
                    </div>
                </form>
            </div>
            <div className="form-card">
                <h2 className="form-title">Consultar Ordens de Serviço</h2>
                <form onSubmit={handleSearch} className="search-form">
                    <input id="inputsearch" name="inputsearch" type="text" placeholder="Pesquisar..." className="form-input search-input" />
                    <button id="search-button" type="submit" className="btn-primary btn-search">
                        Pesquisar
                    </button>
                </form>
            </div>

            {pesquisaRealizada && (
                <div className="results-card">
                    <h3 className="results-title">Resultados da Pesquisa</h3>
                    {loading ? (
                        <div className="loading">Buscando...</div>
                    ) : resultados.length > 0 ? (
                        <table className="results-table">
                            <thead>
                                <tr>
                                    <th>Nº</th>
                                    <th>Serviço</th>
                                    <th>Solicitante</th>
                                    <th>Responsável</th>
                                    <th>Setor</th>
                                    <th>Data</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                           
                            <tbody>
                                {resultados.map((os) => (
                                    <tr key={os.ID_SOLICITACAO}>
                                        <td>{os.ID_SOLICITACAO}</td>
                                        <td>{os.NOME_SERVICO || 'Não especificado'}</td>
                                        <td>{os.NOME_SOLICITANTE || 'Usuário não encontrado'}</td>
                                        <td>{os.NOME_RESPONSAVEL || 'Não atribuído'}</td>
                                        <td>{os.NOME_SETOR || 'Não informado'}</td>
                                        <td>{formatarData(os.DATA_CRIACAO)}</td>
                                        <td>{os.STATUS}</td>
                                        <td>
                                            <button onClick={(e) => handleDetalhes(e, os)} className="btn-secondary">Detalhes</button>
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