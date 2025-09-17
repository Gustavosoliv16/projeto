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
    
    const [patrimonio, setPatrimonio] = useState(""); 
    const [defeito, setDefeito] = useState("");

    const [resultados, setResultados] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pesquisaRealizada, setPesquisaRealizada] = useState(false);

    useEffect(() => {
    }, []);

    const handleCadastroSubmit = async (e) => {
        e.preventDefault();

        if (!user || !user.id) {
            alert("Erro: Utilizador não autenticado.");
            return;
        }
        try {
            const novaOrdem = {
                ID_USUARIO_SOLICITANTE: user.id,
                PATRIMONIO: patrimonio,
                DEFEITO_RELATADO: defeito
            };

            await axios.post("/api/solicitacoes", novaOrdem);
            alert("Ordem de Serviço criada com sucesso!");
            setPatrimonio("");
            setDefeito("");

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
                (os.NOME_SETOR || '').toLowerCase().includes(searchValue)            
            );
            const ordenados = filtrados.sort((a, b) => a.ID_SOLICITACAO - b.ID_SOLICITACAO);
            setResultados(ordenados || []);
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
            Status: ${os.STATUS}
            Data: ${formatarData(os.DATA_CRIACAO)}
            ---------------------------------
            Descrição: ${os.DEFEITO_RELATADO || 'N/A'}`;
            console.log(detalhes);
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
                        <label htmlFor="patrimonio" className="form-label">Nº do Patrimônio </label>
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
                        <textarea id="descricao" placeholder="Descreva o problema..." className="form-textarea" value={defeito} onChange={(e) => setDefeito(e.target.value)} required />
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
                                    <th>Solicitante</th>
                                    <th>Responsável</th>
                                    <th>Setor</th>
                                    <th>Data</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                           
                            <tbody>
                                {resultados.map((os, index) => (
                                    <tr key={os.ID_SOLICITACAO}>
                                        <td>#{index + 1}</td>
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