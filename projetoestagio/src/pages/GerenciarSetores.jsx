import { useState, useEffect, useMemo} from "react";
import axios from "axios";
import "../styles/GerenciarUsuarios.css";
import "../styles/GerenciarEntidades.css"; 
import EditMode from "../components/EditMode.jsx";

const GerenciarSetores = () => {
    const [nomeSetor, setNomeSetor] = useState("");
    const [setores, setSetores] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isCadastroVisible, setIsCadastroVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSetor, setEditingSetor] = useState(null);

    const fetchSetores = async () => {
        try {
            const response = await axios.get('/api/setores');
            setSetores(response.data);
        } catch (error) {
            console.error("Erro ao buscar setores:", error);
        }
    };

    useEffect(() => {
        fetchSetores();
    }, []);

    const handleEdit = (setor) => {
        setEditingSetor(setor);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir este setor?")) {
            try {
                await axios.delete(`/api/setores/${id}`);
                fetchSetores();
                alert("Setor excluído com sucesso!");
            } catch (error) {
                console.error("Erro ao excluir setor:", error);
                alert("Erro ao excluir setor.");
            }
        }
    };

    const handleSave = async (id, novoNome) => {
        try {
            await axios.put(`/api/setores/${id}`, { NOME_SETOR: novoNome });
            fetchSetores();
            setIsModalOpen(false);
            alert("Setor atualizado com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar setor:", error);
            alert("Erro ao atualizar setor.");
        }
    };

    const handleCadastro = async (e) => {
        e.preventDefault();
        if (nomeSetor.trim() === '') {
            alert('O nome do setor não pode ser vazio.');
            return;
        }
        try {
            await axios.post('/api/setores', { NOME_SETOR: nomeSetor });
            setNomeSetor("");
            fetchSetores();
            setIsCadastroVisible(false);
            alert("Setor cadastrado com sucesso!");
        } catch (error) {
            console.error("Erro ao cadastrar setor:", error);
            alert("Erro ao cadastrar setor.");
        }
    };

    const filtroSetores = useMemo(() => 
        setores.filter(setor =>
            (setor.NOME_SETOR || "").toLowerCase().includes(searchTerm.toLowerCase())
        ), [setores, searchTerm]);

    return (
        <>
            <EditMode
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                entity={editingSetor}
                entityName="Setor"
            />

            <div className="setores-container">

                <div className="actions-header">
                    <button onClick={() => setIsCadastroVisible(!isCadastroVisible)} className="action-button">
                        {isCadastroVisible ? 'Cancelar' : 'Adicionar Setor'}
                    </button>
                    <button className="action-button">Configurações</button>
                    <button className="action-button">Gerar Relatório</button>
                    <button className="action-button" disabled>Ação Futura</button>
                </div>

                {isCadastroVisible && (
                    <div className="cadastro-card">
                        <h3 className="card-title">Cadastrar Novo Setor</h3>
                        <form onSubmit={handleCadastro} className="form-inline">
                            <input
                                type="text"
                                placeholder="Nome do novo setor"
                                className="form-input"
                                value={nomeSetor}
                                onChange={(e) => setNomeSetor(e.target.value)}
                                required
                                autoFocus
                            />
                            <button type="submit" className="btn-primary">Salvar</button>
                        </form>
                    </div>
                )}

                <div className="results-card">
                    <div className="results-header">
                        <h3 className="card-title">Setores Cadastrados</h3>
                        <input
                            type="text"
                            placeholder="Pesquisar setor..."
                            className="form-input search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="table-wrapper">
                        <table className="results-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtroSetores.map((setor) => (
                                    <tr key={setor.ID_SETOR}>
                                        <td>{setor.ID_SETOR}</td>
                                        <td>{setor.NOME_SETOR}</td>
                                        <td className="actions-cell">
                                            <button onClick={() => handleEdit(setor)} className="btn-action btn-edit">Editar</button>
                                            <button onClick={() => handleDelete(setor.ID_SETOR)} className="btn-action btn-delete">Excluir</button>
                                        </td>
                                    </tr>

                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

export default GerenciarSetores;