import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (loading) {
        return <div className="dashboard-container"><p>A carregar dashboard...</p></div>;
    }

    if (error) {
        return <div className="dashboard-container"><p className="error-message">{error}</p></div>;
    }

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Painel de Controlo</h1>
            
            <div className="stats-cards">
                <div className="card">
                    <h2>{stats.ordensAbertas}</h2>
                    <p>Ordens de Serviço Abertas</p>
                </div>
                <div className="card">
                    <h2>{stats.totalEquipamentos}</h2>
                    <p>Equipamentos Cadastrados</p>
                </div>
                <div className="card">
                    <h2>{stats.totalUsuarios}</h2>
                    <p>Utilizadores no Sistema</p>
                </div>
                <Link to="/ordens-servico" className="card card-action">
                    <h2>+</h2>
                    <p>Abrir Novo Chamado</p>
                </Link>
            </div>

            <div className="quick-access-list">
                <h2>Últimos Chamados Abertos</h2>
                {stats.ultimasSolicitacoes.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Nº</th>
                                <th>Descrição</th>
                                <th>Solicitante</th>
                                <th>Setor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.ultimasSolicitacoes.map(os => (
                                <tr key={os.ID_SOLICITACAO}>
                                    <td>#{os.ID_SOLICITACAO}</td>
                                    <td>{os.DESCRICAO}</td>
                                    <td>{os.NOME_SOLICITANTE || 'N/A'}</td>
                                    <td>{os.NOME_SETOR || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Não há nenhuma ordem de serviço aberta no momento.</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;