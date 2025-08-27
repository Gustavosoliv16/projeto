import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/GerenciarEntidades.css"; 

const GerenciarSetores = () => {
    const [nomeSetor, setNomeSetor] = useState("");
    const [setores, setSetores] = useState([]);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/setores', { nome: nomeSetor });
            setNomeSetor("");
            fetchSetores(); 
            alert("Setor cadastrado com sucesso!");
        } catch (error) {
            console.error("Erro ao cadastrar setor:", error);
            alert("Erro ao cadastrar setor.");
        }
    };

    return (
        <main className="entidades-container">
            <div className="form-card-entidade">
                <h2 className="form-title">Cadastrar Novo Setor</h2>
                <form onSubmit={handleSubmit} className="form-inline">
                    <input
                        type="text"
                        placeholder="Nome do novo setor"
                        className="form-input"
                        value={nomeSetor}
                        onChange={(e) => setNomeSetor(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn-primary">
                        Salvar
                    </button>
                </form>
            </div>

            <div className="results-card-entidade">
                <h3 className="results-title">Setores Cadastrados</h3>
                <table className="results-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {setores.map((setor) => (
                            <tr key={setor.id}>
                                <td>{setor.id}</td>
                                <td>{setor.nome}</td>
                                <td>
                                    <button className="btn-secondary">Editar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}

export default GerenciarSetores;