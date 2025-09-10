import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login.jsx";
import PrivateRoute from "./routes/PrivateRoute.jsx";
import GerenciarUsuarios from "./pages/gerenciarUsuarios.jsx";
import Template from "./components/Maintemplate.jsx";

import GerenciarOrdensServico from "./pages/Ordemservico.jsx";
import GerenciarSetores from "./pages/GerenciarSetores.jsx";
import GerenciarEquipamentos from "./pages/GerenciarEquipamentos.jsx";
import Dashboard from "./pages/Dashboard.jsx";



function App() {
  return (
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route 
          path="/" 
          element={ 
            <PrivateRoute>
              <Template />
            </PrivateRoute>
          }
        >
          <Route path="telainicial" element={<Dashboard />} />
          <Route path="usuarios-cadastro" element={<GerenciarUsuarios />} />

          <Route path="ordens-servico" element={<GerenciarOrdensServico />} />
          <Route path="setores" element={<GerenciarSetores />} />
          <Route path="equipamentos" element={<GerenciarEquipamentos />} />
        </Route>

       <Route path="*" element={<Login />} />
        
      </Routes>
  );
}

export default App;