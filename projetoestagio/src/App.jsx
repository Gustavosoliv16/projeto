import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Content from "./components/Content.jsx";
import PrivateRoute from "./routes/PrivateRoute.jsx";
import GerenciarUsuarios from "./pages/gerenciarUsuarios.jsx";
import Template from "./components/Maintemplate.jsx";

import GerenciarOrdensServico from "./pages/Ordemservico.jsx";
import GerenciarSetores from "./pages/GerenciarSetores.jsx";
import GerenciarEquipamentos from "./pages/GerenciarEquipamentos.jsx";



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
          {/* ROTAS FILHAS (PÁGINAS) */}
          {/* O path aqui é relativo ao pai. Como o pai é "/", o path final será "/telainicial" */}
          <Route path="telainicial" element={<Content />} />
          <Route path="usuarios-cadastro" element={<GerenciarUsuarios />} />
          <Route path="ordens_servico" element={<GerenciarOrdensServico />} />
          <Route path="setores" element={<GerenciarSetores />} />
          <Route path="equipamentos" element={<GerenciarEquipamentos />} />
        </Route>

       <Route path="*" element={<Login />} />
        
      </Routes>
  );
}

export default App;