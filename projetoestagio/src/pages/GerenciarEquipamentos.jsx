import { useState, useEffect } from "react";
import axios from "axios";
import { StatusIcon } from '../components/statusicones.jsx';
import "../styles/GerenciarUsuarios.css";
import "../styles/GerenciarEntidades.css";
import "../styles/Mode.css";

const EditModal = ({ equipamento, onClose, onSave, setores }) => {
    const [dadosEditados, setDadosEditados] = useState(equipamento);

    useEffect(() => {
        setDadosEditados(equipamento);
    }, [equipamento]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDadosEditados(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSave = () => {
        onSave(dadosEditados);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2 className="modal-title">Editar Equipamento #{equipamento.ID_PECA}</h2>
                <div className="form-grid-entidade">
                    <div>
                        <label className="form-label">Nome</label>
                        <input name="NOME" value={dadosEditados.NOME || ''} onChange={handleChange} className="form-input" />
                    </div>
                    <div>
                        <label className="form-label">Modelo</label>
                        <input name="MODELO" value={dadosEditados.MODELO || ''} onChange={handleChange} className="form-input" />
                    </div>
                    <div>
                        <label className="form-label">Patrimônio</label>
                        <input name="PATRIMONIO" value={dadosEditados.PATRIMONIO || ''} onChange={handleChange} className="form-input" />
                    </div>
                    <div>
                        <label className="form-label">Setor</label>
                        <select name="ID_SETOR" value={dadosEditados.ID_SETOR || ''} onChange={handleChange} className="form-input">
                            <option value="">Selecione o setor</option>
                            {setores.map(setor => <option key={setor.ID_SETOR} value={setor.ID_SETOR}>{setor.NOME_SETOR}</option>)}
                        </select>
                    </div>
                </div>
                <div className="modal-actions">
                    <button onClick={onClose} className="btn-secondary">Cancelar</button>
                    <button onClick={handleSave} className="btn-primary">Salvar Alterações</button>
                </div>
            </div>
        </div>
    );
};
const GerenciarEquipamentos = () => {

    const [nome, setNome] = useState("");
    const [modelo, setModelo] = useState("");
    const [NumPatrimonio, setNumPatrimonio] = useState("");
    const [idSetor, setIdSetor] = useState("");

    
    const [equipamentos, setEquipamentos] = useState([]);
    const [setores, setSetores] = useState([]);
    const [loading, setLoading] = useState(false);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [equipamentoSelecionado, setEquipamentoSelecionado] = useState(null);

    
    const fetchData = async () => {
        setLoading(true);
        try {
            const resEquipamentos = await axios.get('/api/pecas');
            const resSetores = await axios.get('/api/setores');
            setEquipamentos(resEquipamentos.data);
            setSetores(resSetores.data);
            console.log(resSetores.data);
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (equipamento) => {
        setEquipamentoSelecionado(equipamento);
        setIsEditModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        setEquipamentoSelecionado(null);
    };

    const handleSave = async (dadosAtualizados) => {
        try {
            await axios.put(`/api/pecas/${dadosAtualizados.ID_PECA}`, dadosAtualizados);
            alert("Equipamento atualizado com sucesso!");
            handleCloseModal();
            fetchData();
        } catch (error) {
            console.error("Erro ao atualizar equipamento:", error);
            alert("Erro ao atualizar equipamento.");
        }
    };


    const handleDelete = async (id) => {
        if (window.confirm("Tem certeza que deseja apagar este registro?")) {
            try {
                await axios.delete(`/api/pecas/${id}`);
                fetchData();
                alert("Registro de equipamento excluído com sucesso!");
            } catch (error) {
                console.error("Erro ao excluir equipamento:", error);
                alert("Erro ao excluir equipamento.");
            }
        }
    };


    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    
        const novoEquipamento = { 
            NOME: nome,
            MODELO: modelo,
            PATRIMONIO: NumPatrimonio, 
            ID_SETOR: idSetor,             

            DESCRICAO: "", 
            MARCA: "",     
            FORNECEDOR: "" 
        };

        await axios.post('/api/pecas', novoEquipamento);
        
        setNome("");
        setModelo("");
        setNumPatrimonio("");
        setIdSetor("");
        fetchData();
        alert("Equipamento cadastrado com sucesso!");
    } catch (error) {
        console.error("Erro ao cadastrar equipamento:", error);
        alert("Erro ao cadastrar equipamento.");
    }
};

    return (

         <>
            {/* Adicione o Modal ao seu JSX */}
            {isEditModalOpen && (
                <EditModal
                    equipamento={equipamentoSelecionado}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                    setores={setores}
                />
            )}

        <main className="entidades-container">
            <div className="form-card-entidade">
                <h2 className="form-title">Cadastrar Novo Equipamento</h2>
                <form onSubmit={handleSubmit} className="form-grid-entidade">
                 
                    <div>
                        <label className="form-label">NOME DO EQUIPAMENTO</label>
                        <input type="text" placeholder="Ex: Computador Dell" className="form-input" value={nome} onChange={(e) => setNome(e.target.value)} required />
                    </div>
                    <div>
                        <label className="form-label">MODELO</label>
                        <input type="text" placeholder="Ex: OptiPlex 3080" className="form-input" value={modelo} onChange={(e) => setModelo(e.target.value)} />
                    </div>
                 
                    <div>
                        <label className="form-label">PATRIMÔNIO</label>
                        <input type="text" placeholder="xxx-xx" className="form-input" value={NumPatrimonio} onChange={(e) => setNumPatrimonio(e.target.value)} required />
                    </div>
                    <div>
                        <label className="form-label">SETOR</label>
                        <select className="form-input" value={idSetor} onChange={(e) => setIdSetor(e.target.value)} required>
                            <option value="">Selecione o setor</option>
                            {setores.map(os => <option key={os.ID_SETOR} value={os.ID_SETOR}>{os.NOME_SETOR}</option>)}
                        </select>
                    </div>
                    
                    <div className="full-width-entidade">
                        <button type="submit" className="btn-primary">Salvar Equipamento</button>
                    </div>
                </form>
            </div>

          <div className="results-card-entidade">
                    <h3 className="results-title">Equipamentos Cadastrados</h3>
                    {loading ? <p>Carregando...</p> : (
                        <table className="results-table">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Modelo</th>
                                    <th>Patrimônio</th>
                                    <th>Setor</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {equipamentos.map((eq) => (
                                    <tr key={eq.ID_PECA}>
                                        <td>{eq.NOME}</td>
                                        <td>{eq.MODELO}</td>
                                        <td>{eq.PATRIMONIO}</td>
                                        <td>{eq.NOME_SETOR || 'N/A'}</td>
                                        <td className="actions-cell">
                                            <button className="btn-grid btn-detalhes"> detalhes</button>
                                            <button onClick={() => handleEditClick(eq)} className="btn-grid btn-editar btn-">Editar</button>
                                            <button onClick={() => handleDelete(eq.ID_PECA)} className="btn-grid btn-excluir">Excluir</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
        </>
    );
}

export default GerenciarEquipamentos;
