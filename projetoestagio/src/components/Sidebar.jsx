import React, { useState } from "react";
import "../styles/Sidebar.css";
import "../styles/paginacao.css";
import { Link } from "react-router-dom";
const Sidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="menubotao"
        onClick={() => setOpen(!open)}

      >
        &#9776;
      </button>
      <div className={`sidebar${open ? " open" : ""}`}>
        <ul>
          <li className="listarotas"><Link to="/telainicial" className="paginacao">Inicio</Link></li>
          <li className="listarotas"><Link to="paginacao" className="paginacao">Secretarias</Link></li>
          <li className="listarotas"><Link to="paginacao" className="paginacao">Equipamentos</Link></li>
          <li className="listarotas"><Link to="/usuarios-cadastro" className="paginacao" > Usuarios</Link> </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;