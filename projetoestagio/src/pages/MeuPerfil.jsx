import { useAuth } from "../context/AuthContext";
import '../styles/GerenciarEntidades.css';

const MeuPerfil = () => {
    const { user } = useAuth();

    if (!user) {
        return <p>Carregando perfil...</p>;
    }

    return (
        <main className="entidades-container">
            <div className="form-card-entidade">
                <h2 className="form-title">Meu Perfil</h2>
                <div className="profile-details">
                    <p><strong>Nome:</strong> {user.nome}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Tipo de Conta:</strong> {user.tipo_usuario}</p>
                </div>
            </div>
        </main>
    );
};

export default MeuPerfil;