import React, { useState } from "react";
import "../styles/Sidebar.css";

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
          <li>Opcao 1</li>
          <li>Opcao 2</li>
          <li>Opcao 3</li>
          <li>Opcao 4</li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;