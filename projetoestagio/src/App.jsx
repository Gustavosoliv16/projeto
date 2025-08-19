import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";


import Login from "./pages/Login.jsx";
import Content from "./components/Content.jsx";
import PrivateRoute from "./routes/PrivateRoute.jsx";
import CadastroUsuario from "./pages/cadastros.jsx";
import Template from "./components/Maintemplate.jsx";
import tailwindcss from "@tailwindcss/vite";


function App() {
  return (
      <Routes>
        {/* Rota pública de Login */}
        <Route path="/login" element={<Login />} />

        {/* ROTA PAI (LAYOUT
          - Todas as rotas DENTRO dela serão renderizadas no <Outlet /> do seu Template.
        */}

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
        
          <Route path="usuarios-cadastro" element={<CadastroUsuario />} />
          {/* Para adicionar novas páginas, basta criar uma nova rota filha aqui */}
        </Route>

        <Route path="*" element={<Login />} />
        
      </Routes>
  );
}

export default App;