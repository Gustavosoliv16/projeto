import { useState, useEffect } from "react";
import axios from "axios";

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
            const resEquipamentos = await axios.get('/api/equipamentos');
            const resSetores = await axios.get('/api/setores');
            setEquipamentos(resEquipamentos.data);
            setSetores(resSetores.data);
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const novoEquipamento = { nome, modelo, numero_serie: NumPatrimonio, id_setor: idSetor, status: 'Operacional' };
            await axios.post('/api/equipamentos', novoEquipamento);
            
           
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
                        <label className="form-label">Nome do Equipamento</label>
                        <input type="text" placeholder="Ex: Computador Dell" className="form-input" value={nome} onChange={(e) => setNome(e.target.value)} required />
                    </div>
                    <div>
                        <label className="form-label">Modelo</label>
                        <input type="text" placeholder="Ex: OptiPlex 3080" className="form-input" value={modelo} onChange={(e) => setModelo(e.target.value)} />
                    </div>
                 
                    <div>
                        <label className="form-label">Patrimônio</label>
                        <input type="text" placeholder="..." className="form-input" value={NumPatrimonio} onChange={(e) => setNumPatrimonio(e.target.value)} required />
                    </div>
                    <div>
                        <label className="form-label">Secretaria (Setor)</label>
                        <select className="form-input" value={idSetor} onChange={(e) => setIdSetor(e.target.value)} required>
                            <option value="">Selecione a secretaria</option>
                            {setores.map(setor => <option key={setor.id} value={setor.id}>{setor.nome}</option>)}
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
                                <tr key={eq.id}>
                                    <td>{eq.nome}</td>
                                    <td>{eq.modelo}</td>
                                    <td>{eq.numero_serie}</td>
                                    <td>{eq.setor?.nome || 'N/A'}</td>
                                    <td>{eq.status}</td>
                                    <td>
                                        <button className="btn-secondary">Editar</button>
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