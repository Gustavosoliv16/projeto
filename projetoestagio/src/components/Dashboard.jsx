import React from "react";
import { useAuth } from "./Authtab.jsx";
import "./dashboard.css";

const Dashboard = () => {
  const { authUser, setAuthUser, isLoggedin, setisLoggedin } = useAuth();

  const logIn = (e) => {
    e.preventDefault();
    setisLoggedin(true);
    setAuthUser({ name: "Gustavo" });
  };

  const logOut = (e) => {
    e.preventDefault();
    setisLoggedin(false);
    setAuthUser(null);
  };

  return (
    <div className="dashboard-container">
      <span>User is currently: {isLoggedin ? "logged in" : "logged out"}</span>
      {isLoggedin && authUser ? (
        <span> | User name: {authUser.name}</span>
      ) : null}
      <br />
      {isLoggedin ? (
        <button onClick={logOut}>Log Out</button>
      ) : (
        <button onClick={logIn}>Log In</button>
      )}
    </div>
  );
};

export default Dashboard;
