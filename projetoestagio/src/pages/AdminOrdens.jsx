import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/GerenciarOrdens.css";
import "../styles/Mode.css";

const ModalResposta = ({os, onClose, onSave}) => {
    const [solucao, setSolucao] = useState("");

    const handleSave = () => {
        if (!solucao.trim()) {
            alert("Por favor, descreva a solução.");
            return;
        }
        const solicitacaoId = os.ID_SOLICITACAO || os.id_solicitacao;

        if (!solicitacaoId) {
            alert("ERRO: ID do chamado não encontrado. Não foi possível salvar.");
            console.error("Objeto 'os' que está causando o erro:", os);
            return;
        }
        
        onSave(solicitacaoId, solucao);
    };

    return(
         <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2 className="modal-title">Responder Chamado #{os.ID_SOLICITACAO}</h2>
                <p><b>Solicitante:</b> {os.NOME_SOLICITANTE}</p>
                <p><b>Descrição do Problema:</b> {os.DESCRICAO}</p>
                <hr style={{ margin: '1rem 0' }} />
                <label className="form-label">Solução Aplicada / Defeito Encontrado</label>
                <textarea
                    className="form-textarea"
                    rows="4"
                    value={solucao}
                    onChange={(e) => setSolucao(e.target.value)}
                    placeholder="Descreva a solução para este chamado..."
                    autoFocus
                />
                <div className="modal-actions">
                    <button onClick={onClose} className="btn-secondary">Cancelar</button>
                    <button onClick={handleSave} className="btn-primary">Salvar e Fechar Chamado</button>
                </div>
            </div>
        </div>
    );
};

const AdminOrdens = () => {
    const [ordens, setOrdens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ordemSelecionada, setOrdemSelecionada] = useState(null);

    const fetchOrdens = async () => {
        setLoading(true);
        try {
            const response = await axios.get("/api/solicitacoes");
            const sorted = response.data.sort((a, b) => b.ID_SOLICITACAO - a.ID_SOLICITACAO);
            setOrdens(sorted);
        } catch (error) {
            console.error("Erro ao buscar ordens de serviço:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrdens();
    }, []);
    
    const handleOpenModal = (ordem) => setOrdemSelecionada(ordem);
    const handleCloseModal = () => setOrdemSelecionada(null);

    const handleSaveResposta = async (id, solucao) => {
        try {
            await axios.put(`/api/solicitacoes/${id}/responder`, { solucao });
            alert("Chamado respondido e fechado com sucesso!");
            handleCloseModal();
            fetchOrdens();
        } catch (error) {
            console.error("Erro ao salvar resposta:", error);
            alert("Falha ao salvar a resposta.");
        }
    };

    return (
        <main className="ordens-container" style={{ display: 'block' }}>
             {ordemSelecionada && (
                <ModalResposta
                    os={ordemSelecionada}
                    onClose={handleCloseModal}
                    onSave={handleSaveResposta}
                />
            )}
            <div className="results-card">
                <h2 className="form-title">Gerenciamento de Ordens de Serviço</h2>
                {loading ? <div className="loading">Carregando chamados...</div> : (
                    <table className="results-table">
                        <thead>
                            <tr>
                                <th>Nº</th>
                                <th>Solicitante</th>
                                <th>Setor</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ordens.map((os) => (
                                <tr key={os.ID_SOLICITACAO}>
                                    <td>{os.ID_SOLICITACAO}</td>
                                    <td>{os.NOME_SOLICITANTE}</td>
                                    <td>{os.NOME_SETOR}</td>
                                    <td>{os.STATUS}</td>
                                    <td>
                                        <button 
                                            onClick={() => handleOpenModal(os)} 
                                            className="btn-secondary"
                                            disabled={os.STATUS === 'FECHADA'}
                                        >
                                            {os.STATUS === 'FECHADA' ? 'Visualizar' : 'Responder'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </main>
    );
};

export default AdminOrdens;