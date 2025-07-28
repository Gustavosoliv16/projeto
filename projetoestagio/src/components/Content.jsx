import "../styles/Content.css";
import { useEffect, useState } from "react";

const Content = () => {
  const [usuarios,setusuarios] = useState([]);
useEffect(() => {
  fetch("http//192.168.3.20:3001/api/usuarios")
  .then((res)=> res.json())
  .then((data)=> setusuarios(data))
  .catch((err)=> console.log("erro ao buscar usuarios", err));

},[]);
 return(
   <main className="main-content">
   <div className="search-container"> 
    <input id="inputsearch" type="text" placeholder="pesquisar"/>
    <button id="search-button" type="submit">Pesquisar</button>
</div>
    <div id="contentbox">
      <table>
        <thead>
          <tr>
            <th id="title">Peças recentes</th>
            <th>Modelo</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuarios) => (
<tr key={usuarios.ID}>
  <td>{usuarios.ID} </td>
  <td>{usuarios.NOME}</td>
  <td>{usuarios.EMAIL}</td>
</tr>
          ))}
          <tr>
            <td>peça 1 - monitor</td>
            <td>asus 144hz</td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
);
};
export default Content;
