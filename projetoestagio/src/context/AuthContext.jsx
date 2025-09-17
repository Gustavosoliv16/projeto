import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [authData, setAuthData] = useState({ token: null, user: null });
  const [loading, setLoading] = useState(true);

  
  const logout = () => {
    localStorage.removeItem("token");
    setAuthData({ token: null, user: null });
  };


 useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
       try {
        const user = jwtDecode(token);
       
        if (user.exp * 1000 < Date.now()) {
          console.warn("Token expirado. Fazendo logout automático.");
          logout();
        } else {
          setAuthData({ token, user });
        }
      } catch (e) {
        console.error("Token inválido ou malformado. Fazendo logout.", e);
        logout();
      }
    }
    setLoading(false);
  }, []);

  
  const login = (token) => {
    const user = jwtDecode(token);
    localStorage.setItem("token", token);
    setAuthData({ token, user });
  };

  const value ={
    token: authData.token,
    user: authData.user,
    isAuthenticated: !!authData.token,
    loading,
    login,
    logout
  };

   return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}