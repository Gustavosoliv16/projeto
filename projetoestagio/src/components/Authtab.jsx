import React, { useState, useContext } from 'react';

const AuthContext = React.createContext();

const Authtab = () => (
  <div className="auth-tab">
    <h2>Autenticação</h2>
    <p>Faça login ou crie uma conta para continuar.</p>
  </div>
);

// Custom hook for consuming AuthContext
export function useAuth() {
  return useContext(AuthContext);
}

// AuthProvider component to wrap your app
export function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(null);
  const [isLoggedin, setisLoggedin] = useState(false);

  const value = {
    authUser,
    setAuthUser,
    isLoggedin,
    setisLoggedin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}