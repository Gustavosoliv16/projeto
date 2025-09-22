import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from "../context/AuthContext";
import  {StatusIcon}  from '../components/statusicones.jsx';
import '../styles/Dashboard.css';
import '../styles/GerenciarEntidades.css';

const formatDate = (dateString) => {
    try {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        });
    } catch (e) {
        return 'Data inválida',e;
    }
};

const ModalDetalhes = ({ os, onClose }) => {
    if (!os) return null;
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
                        <div className="detail-item">
                            <strong>Numero do Patrimonio:</strong>
                            <span>{(os.PATRIMONIO) || 'N/A'}</span>
                        </div>
                    </div>

                    <div className="content-section">
                        <p><strong>Problema Relatado:</strong></p>
                        <div className="content-box">
                            {os.DEFEITO_RELATADO || 'Chamado em Análise.'}
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

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ ultimasSolicitacoes: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filtroStatus, setFiltroStatus] = useState('TODOS');

    const [chamadoSelecionado, setChamadoSelecionado] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);


     useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/dashboard-stats');
                const ultimasSolicitacoes = response.data || [];

                const ordensAbertas = ultimasSolicitacoes.filter(os => os.STATUS === 'ABERTA').length;
                const resolvidos = ultimasSolicitacoes.filter(os => os.STATUS === 'FECHADA').length;
                const pendentes = ultimasSolicitacoes.filter(os => os.STATUS === 'PENDENTE').length;

                setStats({
                    ultimasSolicitacoes,
                    ordensAbertas,
                    resolvidos,
                    pendentes
                });

            } catch (err) {
                setError('Não foi possível carregar os dados do dashboard.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const handleRespostaClick = (e, os) => {
        e.preventDefault();
        setChamadoSelecionado(os);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setChamadoSelecionado(null);
    };


   const chamadosFiltrados = useMemo(() => {
        let chamadosParaExibir = [];

        if (filtroStatus === 'TODOS') {
            chamadosParaExibir = stats.ultimasSolicitacoes;
        } else {
            const statusAlvo = filtroStatus === 'RESOLVIDO' ? 'FECHADA' : filtroStatus;
            chamadosParaExibir = stats.ultimasSolicitacoes.filter(os => os.STATUS === statusAlvo);
        }
        return chamadosParaExibir.sort((a,b) => a.ID_SOLICITACAO - b.ID_SOLICITACAO);
    }, [stats.ultimasSolicitacoes, filtroStatus]);

    if (loading) return <div className="dashboard-container"><p>A carregar dashboard...</p></div>;
    if (error) return <div className="dashboard-container"><p className="error-message">{error}</p></div>;


    return (
        <>
        {isModalVisible && <ModalDetalhes os={chamadoSelecionado} onClose={handleCloseModal} />}

        <div className="dashboard-container">
            <h1 className="dashboard-title">Status dos Chamados</h1>
            <div className="stats-cards">
                <div className={`card ${filtroStatus === 'ABERTA' ? 'active' : ''}`} onClick={() => setFiltroStatus(filtroStatus === 'ABERTA' ? 'TODOS' : 'ABERTA')}>
                    <h2>{stats.ordensAbertas || 0}</h2>
                    <p>Abertos</p>
                </div>
                <div className={`card ${filtroStatus === 'RESOLVIDO' ? 'active' : ''}`} onClick={() => setFiltroStatus(filtroStatus === 'RESOLVIDO' ? 'TODOS' : 'RESOLVIDO')}>
                    <h2>{stats.resolvidos || 0}</h2>
                    <p>Resolvidos</p>
                </div>
                <div className={`card ${filtroStatus === 'PENDENTE' ? 'active' : ''}`} onClick={() => setFiltroStatus(filtroStatus === 'PENDENTE' ? 'TODOS' : 'PENDENTE')}>
                    <h2>{stats.pendentes || 0}</h2>
                    <p>Pendentes</p>
                </div>
                <Link to="/ordens-servico" className="card card-action"><h2>+</h2><p>Abrir Novo Chamado</p></Link>
            </div>
            <div className="quick-access-list">
                <h2 className="quick-access-title">
                    {user.tipo_usuario === 'administrador' ? 'Últimos Chamados (Todos)' : 'Meus Últimos Chamados'}
                </h2>
                <table>
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
                            {chamadosFiltrados.length > 0 ? (
                                chamadosFiltrados.map((os) => (
                                    <tr key={os.ID_SOLICITACAO}>
                                        <td>#{os.ID_SOLICITACAO}</td>
                                        <td>{os.NOME_SOLICITANTE || 'N/A'}</td>
                                        <td>{os.NOME_SETOR || 'N/A'}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <StatusIcon status={os.STATUS} size={20} />
                                                {os.STATUS}
                                            </div>
                                        </td>
                                        <td> <button className='btn-primary' onClick={(e) => handleRespostaClick(e, os)}> Ver Resposta </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                             <tr><td colSpan="6" style={{ textAlign: 'center' }}>Nenhum chamado encontrado.</td></tr>
                            )}
                        </tbody>
                </table>
            </div>
        </div>
        </>
    );
};

export default Dashboard;