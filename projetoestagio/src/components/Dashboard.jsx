import React from "react";
import { useAuth } from "./Authtab";

const Dashboard = () => {
  const { authUser,
        setAuthUser,
        isLoggedin,
        setisLoggedin } = useAuth()

        const logIn = (e) => {
          e.preventDefault()
         isLoggedin(true)
         {setAuthUser({ name: "Gustavo" })}
        }

          const logOut = (e) => {
          e.preventDefault()
         isLoggedin(false)
         {setAuthUser(null)};

    }
return (
    <>
    <span>User is currently: {isLoggedin ? 'logged in' : 'logged out'}</span>
{isLoggedin ? (<span>User name: {authUser.Name}</span>) : null}
<br />
{isLoggedin ? (
  <button onClick={logOut}>Log Out</button>
) : (
  <button onClick={logIn}>Log In</button>
)}

    </>

  }