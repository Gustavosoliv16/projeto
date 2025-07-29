import "../styles/Topbar.css";
import { useAuth } from "../context/Authtab";


const Topbar = () => {

const {logout}= useAuth();
return(
<div className="topbar">
    <h1 id="logo">
      <img id="logo-img" src="./public/Brasao_Caratinga.png" alt="" />
    </h1>
    <nav>
      <a href="#Userlogged">Usuario ativo</a>
      <div id="botaosair" >  <button id="botaoum" onClick={logout}>Sair</button>
     </div>
    </nav>
  </div>
);
}
export default Topbar;
