import CadastroUsuario from '../components/formCadastro';
import BuscaUsuarios from '../components/buscarUsuarios.jsx';
import "../styles/Cadastropag.css";

const GerenciarUsuarios = () => {
    return (
      <main className="forms-container">
        <BuscaUsuarios />
        <CadastroUsuario />
        
      </main>
    );
}

export default GerenciarUsuarios;