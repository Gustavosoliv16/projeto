import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { StatusIcon } from '../components/statusicones.jsx'; 
import "../styles/GerenciarOrdens.css";
import "../styles/Mode.css";

const formatarData = (dataValor) => {
    if (!dataValor) return 'N/A';
    const data = new Date(dataValor);
    if (isNaN(data.getTime())) return 'Data Inválida';
    return data.toLocaleDateString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    });
};
const ModalDetalhes = ({ os, onClose }) => {
    if (!os) return null;

    const formatDate = (dateString) => {
    try {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        });
    } catch (e) { 
        return 'Data inválida',e;
    }
};

    const statusClass = os.STATUS ? os.STATUS.toLowerCase().trim() : '';

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content modal-details" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Detalhes do Chamado #{os.ID_SOLICITACAO}</h2>
                    <span className={`status-badge ${statusClass}`}>
                        <StatusIcon status={os.STATUS} size={16} />
                        {os.STATUS}
                    </span>
                </div>
                <div className="modal-body">
                    <div className="details-grid">
                        <div className="detail-item">
                            <strong>Solicitante:</strong>
                            <span>{os.NOME_SOLICITANTE || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                            <strong>Setor:</strong>
                            <span>{os.NOME_SETOR || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                            <strong>Data de Criação:</strong>
                            <span>{formatDate(os.DATA_CRIACAO)}</span>
                        </div>
                    </div>
                    <div className="content-section">
                        <p><strong>Problema Relatado:</strong></p>
                        <div className="content-box">
                            {os.DEFEITO_RELATADO || 'Nenhuma descrição fornecida.'}
                        </div>
                    </div>
                    {os.STATUS === 'FECHADA' && (
                        <div className="content-section">
                            <p><strong>Solução Aplicada:</strong></p>
                            <div className="content-box solution-box">
                                {os.DEFEITO_ENCONTRADO || 'Nenhuma solução registrada.'}
                            </div>
                        </div>
                    )}
                </div>
                <div className="modal-actions">
                    <button onClick={onClose} className="btn-primary">Fechar</button>
                </div>
            </div>
        </div>
    );
};


const GerenciarOrdensServico = () => {
    const { user } = useAuth();
    
    const [patrimonio, setPatrimonio] = useState(""); 
    const [defeito, setDefeito] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const [todasOrdens, setTodasOrdens] = useState([]); 
    const [loading, setLoading] = useState(true);

    const [chamadoSelecionado, setChamadoSelecionado] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const fetchOrdens = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/solicitacoes`); 
            setTodasOrdens(response.data || []);
        } catch (error) {
            console.error("Erro ao buscar ordens de serviço:", error);
            setTodasOrdens([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrdens(); 
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
            fetchOrdens(); 
        } catch (error) {
            console.error("Erro ao cadastrar Ordem de Serviço:", error);
            alert(error.response?.data?.error || "Erro ao criar Ordem de Serviço.");
        }
    };
    
    const resultadosFiltrados = useMemo(() => {

        const ordensOrdenaadasParaContagem = [...todasOrdens].sort((a,b) => new Date(a.DATA_CRIACAO) - new Date(b.DATA_CRIACAO));
        
        const ordensComOrdem = ordensOrdenaadasParaContagem.map((os, index) => ({ ...os, ordem: index + 1 }));

        if (!searchTerm) {
            return ordensComOrdem.sort((a, b) => a.ID_SOLICITACAO - b.ID_SOLICITACAO);
        }
        const termo = searchTerm.toLowerCase();
        return ordensComOrdem.filter(os =>
            (os.NOME_SOLICITANTE || '').toLowerCase().includes(termo) ||
            (os.STATUS || '').toLowerCase().includes(termo) ||
            (os.NOME_SETOR || '').toLowerCase().includes(termo) ||
            (String(os.ID_SOLICITACAO) || '').includes(termo)
        ).sort((a, b) => b.ID_SOLICITACAO - a.ID_SOLICITACAO);
    }, [searchTerm, todasOrdens]);

    const handleDetalhesClick = (os) => {
        setChamadoSelecionado(os);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setChamadoSelecionado(null);
    };

    return (
        <>
            {isModalVisible && <ModalDetalhes os={chamadoSelecionado} onClose={handleCloseModal} />}
            <main className="ordens-container">
                <div className="form-card">
                    <h2 className="form-title">Abrir Nova Ordem de Serviço</h2>
                    <form onSubmit={handleCadastroSubmit} className="form-grid">
                       <div className="full-width">
                            <label className="form-label">Solicitante</label>
                            <input type="text" className="form-input" value={user ? user.nome : "Carregando..."} disabled />
                        </div>
                        <div>
                            <label htmlFor="patrimonio" className="form-label">Nº do Patrimônio (Opcional)</label>
                            <input id="patrimonio" className="form-input" placeholder="Digite o número do patrimônio" value={patrimonio} onChange={(e) => setPatrimonio(e.target.value)} />
                        </div>
                        <div className="full-width">
                            <label htmlFor="descricao" className="form-label">Descrição do Problema</label>
                            <textarea id="descricao" placeholder="Descreva o problema detalhadamente..." className="form-textarea" value={defeito} onChange={(e) => setDefeito(e.target.value)} required />
                        </div>
                        <div className="full-width mt-4">
                            <button type="submit" className="btn-primary">Abrir Chamado</button>
                        </div>
                    </form>
                </div>

                <div className="results-card">
                    <div className="results-header">
                        <h3 className="card-title">Ordens de Serviço</h3>
                        <input
                            type="text"
                            placeholder="Pesquisar por nº, solicitante, setor ou status..."
                            className="form-input search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {loading ? <div className="loading">Buscando...</div> : (
                        <div className="table-wrapper">
                            <table className="results-table">
                                <thead>
                                    <tr>
                                        <th>Nº</th>
                                        <th>Solicitante</th>
                                        <th>Setor</th>
                                        <th>Status</th>
                                        <th>Data</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resultadosFiltrados.length > 0 ? (
                                        resultadosFiltrados.map((os) => (
                                            <tr key={os.ID_SOLICITACAO}>
                                                <td>#{user && user.tipo_usuario === 'administrador' ? os.ID_SOLICITACAO : os.ordem}</td>
                                                <td>{os.NOME_SOLICITANTE || 'N/A'}</td>
                                                <td>{os.NOME_SETOR || 'N/A'}</td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <StatusIcon status={os.STATUS} size={20} />
                                                        {os.STATUS}
                                                    </div>
                                                </td>
                                                <td>{formatarData(os.DATA_CRIACAO)}</td>
                                                <td>
                                                    <button onClick={() => handleDetalhesClick(os)} className="btn-secondary">Detalhes</button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="6" style={{ textAlign: 'center' }}>Nenhuma ordem de serviço encontrada.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
};

export default GerenciarOrdensServico;