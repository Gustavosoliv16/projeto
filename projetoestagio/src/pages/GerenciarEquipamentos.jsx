import { useState, useEffect } from "react";
import axios from "axios";
import  {StatusIcon}  from '../components/statusicones.jsx';
import "../styles/GerenciarUsuarios.css";
import "../styles/GerenciarEntidades.css";

const GerenciarEquipamentos = () => {

    const [nome, setNome] = useState("");
    const [modelo, setModelo] = useState("");
    const [NumPatrimonio, setNumPatrimonio] = useState("");
    const [idSetor, setIdSetor] = useState("");

    
    const [equipamentos, setEquipamentos] = useState([]);
    const [setores, setSetores] = useState([]);
    const [loading, setLoading] = useState(false);

    
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

    const handleEdit = async (id, novoNome) => {
        try {
            await axios.put(`/api/setores/${id}`, { NOME_SETOR: novoNome });
            fetchData();
            alert("Setor atualizado com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar setor:", error);
            alert("Erro ao atualizar setor.");
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
            const novoEquipamento = { nome, modelo, numero_serie: NumPatrimonio, id_setor: idSetor, status: "vinte" };
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
                                <th>Descrição</th>
                                <th>Secretaria</th>
                                <th>Status</th>
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
                                    <td><StatusIcon status={eq.STATUS} /></td>
                                    <td className="actions-cell">
                                        <div className="actions-grid-container">
                                           
                                            <button className="btn-grid btn-visualizar">Visualizar</button>
                                            <button onClick={() => handleEdit(eq)} className="btn-grid btn-editar">Editar</button>
                                            
                                            <button onClick={() => handleEdit(eq)} className="btn-grid btn-detalhes">Ver Detalhes</button>
                                            <button onClick={() => handleDelete(eq.ID_PECA)} className="btn-grid btn-excluir">Excluir</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </main>
    );
}

export default GerenciarEquipamentos;

 
