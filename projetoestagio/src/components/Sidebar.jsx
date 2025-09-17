import "../styles/Sidebar.css";
import { NavLink } from "react-router-dom"; 
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ isOpen, setOpen }) => {
  const { user } = useAuth();

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      setOpen(false);
    }
  };

  return (
    <>
      <button
        className="menubotao"
        onClick={() => setOpen(!isOpen)}
      >
        &#9776;
      </button>
      <div className={`sidebar${isOpen ? " open" : ""}`}>
       <ul>
          <li className="listarotas">
            <NavLink to="/tela-inicial" className={({isActive}) => isActive ? "paginacao active" : "paginacao"} onClick={handleLinkClick}>
              Chamadas
            </NavLink>
          </li>
          <li className="listarotas">
            <NavLink to="/ordens-servico" className={({isActive}) => isActive ? "paginacao active" : "paginacao"} onClick={handleLinkClick}>
              Ordens de Serviço
            </NavLink>
          </li>
          
          {user && user.tipo_usuario === 'administrador' && (
            <>
              <li className="listarotas">
                <NavLink to="/equipamentos" className={({isActive}) => isActive ? "paginacao active" : "paginacao"} onClick={handleLinkClick}>
                  Equipamentos
                </NavLink>
              </li>
              <li className="listarotas">
                <NavLink to="/setores" className={({isActive}) => isActive ? "paginacao active" : "paginacao"} onClick={handleLinkClick}>
                  Setores
                </NavLink>
              </li>
              <li className="listarotas">
                <NavLink to="/usuarios-cadastro" className={({isActive}) => isActive ? "paginacao active" : "paginacao"} onClick={handleLinkClick}>
                  Usuários
                </NavLink>
              </li>
            </>
          )}

           <li className="listarotas">
             <NavLink to="/meu-perfil" className={({isActive}) => isActive ? "paginacao active" : "paginacao"} onClick={handleLinkClick}>
               Meu Perfil
             </NavLink>
           </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;