import "../styles/Sidebar.css";
import { Link } from "react-router-dom";
const Sidebar = ({ isOpen, setOpen }) => {
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
          <li className="listarotas"><Link to="/ordens-servico" className="paginacao">Ordens de Serviço</Link></li>
          
          <li className="listarotas"><Link to="/telainicial" className="paginacao">Peças</Link></li>

          <li className="listarotas"><Link to="/equipamentos" className="paginacao">Equipamentos</Link></li>

          <li className="listarotas"><Link to="/setores" className="paginacao">Secretarias</Link></li>
          
          <li className="listarotas"><Link to="/usuarios-cadastro" className="paginacao">Usuários</Link></li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;