import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from "../context/AuthContext";
import '../styles/Dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ ultimasSolicitacoes: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filtroStatus, setFiltroStatus] = useState('TODOS');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/dashboard-stats');
                setStats(response.data);
            } catch (err) {
                setError('Não foi possível carregar os dados do dashboard.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

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
                            <th>Descrição</th>
                        </tr>
                    </thead>
                    <tbody>
                            {chamadosFiltrados.length > 0 ? (
                                chamadosFiltrados.map((os, index) => (
                                    <tr key={os.ID_SOLICITACAO}>
                                        <td>#{index + 1}</td>
                                        <td>{os.NOME_SOLICITANTE || 'N/A'}</td>
                                        <td>{os.NOME_SETOR || 'N/A'}</td>
                                        <td>{os.STATUS}</td>
                                        <td>{os.DEFEITO_RELATADO || 'N/A'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="5" style={{ textAlign: 'center' }}>Nenhum chamado encontrado.</td></tr>
                            )}
                        </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;