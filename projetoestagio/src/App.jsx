import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login.jsx";
import PrivateRoute from "./routes/PrivateRoute.jsx";
import GerenciarUsuarios from "./pages/gerenciarUsuarios.jsx";
import Template from "./components/Maintemplate.jsx";

import GerenciarSetores from "./pages/GerenciarSetores.jsx";
import GerenciarEquipamentos from "./pages/GerenciarEquipamentos.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import MeuPerfil from "./pages/MeuPerfil.jsx";
import OrdemServicoRouter from "./routes/OrdemServicoRouter.jsx";


function App() {
  return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route

          path="/" 
          element={ <PrivateRoute> <Template />  </PrivateRoute>} >

          <Route path="tela-inicial" element={<Dashboard />} />
          <Route path="usuarios-cadastro" element={<GerenciarUsuarios />} />
          <Route path="ordens-servico" element={<OrdemServicoRouter />} />
          <Route path="setores" element={<GerenciarSetores />} />
          <Route path="equipamentos" element={<GerenciarEquipamentos />} />
          <Route path="meu-perfil" element={<MeuPerfil />} />
        </Route>

       <Route path="*" element={<Login />} />
        
      </Routes>
  );
}

export default App;