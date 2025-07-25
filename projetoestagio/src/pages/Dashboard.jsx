// src/pages/Dashboard.jsx
import Content from "../components/Content.jsx";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import { useAuth } from "../context/Authtab.jsx";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const { logout, authUser } = useAuth();

  return (
   
         <div id="dashcontainer">  
         
      <Sidebar />
      <Content  />
      <Topbar />
      
      <button onClick={logout}>Sair ({authUser.email})</button>
    </div>
  );
}
