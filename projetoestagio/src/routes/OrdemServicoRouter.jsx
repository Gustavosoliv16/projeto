import { useAuth } from "../context/AuthContext";
import GerenciarOrdensServico from "../pages/Ordemservico";
import AdminOrdens from "../pages/AdminOrdens";
 const OrdemServicoRouter = () => {
    const {user} = useAuth();

    if (!user) {
        return <p>Carregando...</p>;
    }
    return user.tipo_usuario === 'administrador' ? <AdminOrdens /> : <GerenciarOrdensServico />;
};
 
export default OrdemServicoRouter;