
import React, {useState, useEffect, useContext} from 'react';

const  AuthContext = React.createContext();

const Authtab = () => (
  <div className="auth-tab">
    <h2>Autenticação</h2>
    <p>Faça login ou crie uma conta para continuar.</p>
  </div>
);


export function useAuth() {
    return useContext(AuthContext);}

export function AuthProvider({props})
{
    const [authUser, setAuthUser] = useState(null)
    const [isLoggedin,setisLoggedin] = useState(null)


    const value ={
        authUser,
        setAuthUser,
        isLoggedin,
        setisLoggedin
    }

return(
    <AuthContext.Provider value={value}>
      {props.children}
    </AuthContext.Provider>
)



}





export default Authtab;
