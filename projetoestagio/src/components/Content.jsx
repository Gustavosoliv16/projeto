import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Content.css";

const Content = () => {
    const [pecas, setPecas] = useState([]);
    const [pecasExibidas, setPecasExibidas] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchPecas = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/api/pecas');
                setPecas(response.data);
                setPecasExibidas(response.data);
                setError(null); 
            } catch (err) {
                setError("Não foi possível carregar os dados.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPecas();
    }, []);

    const handleSearchSubmit = (event) => {
        event.preventDefault();

        if (searchTerm.trim() === "") {
            setPecasExibidas(pecas); 
        } else {
            const termoLowerCase = searchTerm.toLowerCase();
            const filtrados = pecas.filter(peca => 
                peca.nome.toLowerCase().includes(termoLowerCase) ||
                peca.modelo.toLowerCase().includes(termoLowerCase)
            );
            setPecasExibidas(filtrados);
        }
    };

if (loading) {
    return null;
}

if (error) {
    return  <div className="main-content">
                <p className="status-message error-message">{error}</p>
            </div>;
}

    return (
        <div className="main-content">
            <div className="search-container">
                <form onSubmit={handleSearchSubmit}>
                    <input 
                        id="inputsearch" 
                        type="text" 
                        placeholder="Pesquisar por nome ou modelo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit" className="search-button">
                        Pesquisar
                    </button>
                </form>
            </div>

            <div id="contentbox">
                <table>
                    <thead>
                        <tr>
                            <th>Nome da Peça</th>
                            <th>Modelo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pecasExibidas.length > 0 ? (
                            pecasExibidas.map((peca) => (
                                <tr key={peca.id}>
                                    <td>{peca.nome}</td>
                                    <td>{peca.modelo}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2">Nenhuma peça encontrada.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Content;