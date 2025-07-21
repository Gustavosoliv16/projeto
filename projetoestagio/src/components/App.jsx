import React from "react";
import "./App.css";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";
import Content from "./Content.jsx";
import { AuthProvider } from "./Authtab.jsx";
import Dashboard from "./Dashboard.jsx";

const App = () => (
  <AuthProvider>
  <div className="container">
    <Topbar />
    <Sidebar />
    <Dashboard/>
    <Content />

  </div>
  </AuthProvider>
);

export default App;
