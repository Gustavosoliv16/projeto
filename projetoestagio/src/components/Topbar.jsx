import "../styles/Topbar.css";
import { useAuth } from "../context/AuthContext";
import logoCaratinga from "/Brasao_Caratinga.png"; 
import { Link } from 'react-router-dom'; 

const Topbar = () => {
    const { user, logout } = useAuth();

    return (
        <header className="topbar">
           <Link to="/telainicial" className="topbar-logo">
                <img src={logoCaratinga} alt="Brasão de Caratinga" />
                <span>Controle de Patrimônio</span>
            </Link>

           
            {user ? (
                <div className="user-info">
                    <span className="user-name"> <strong>{user.nome || user.email}</strong></span>
                    <button className="logout-button" onClick={logout}>
                        Sair
                    </button>
                </div>
            ) : (
                <div className="user-info">
                    <Link to="/login" className="login-button">Entrar</Link>
                </div>
            )}
        </header>
    );
};

export default Topbar;