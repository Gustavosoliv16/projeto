/* src/pages/Dashboard.jsx
import Content from "../components/Content.jsx";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import { useAuth } from "../context/Authtab.jsx";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const { logout } = useAuth();

  return (
   
      <div>
          <Topbar />
          <div id="botaosair">
         <button onClick={logout}>Sair</button>
      </div>
      <Sidebar />
      <Content  />
      </div>
  );
}
  */