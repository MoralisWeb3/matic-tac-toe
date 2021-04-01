import Moralis from "moralis";
import React from "react";
import { useUserContext } from "../hooks/Moralis/User";

export const AuthButton = () => {
  const [userData, setUser] = useUserContext();
  const onLogin = async () => {
    const user = await Moralis.authenticate();
    setUser(user.attributes);
  };

  const onLogout = () => {
    Moralis.User.logOut();
    setUser(null);
  };

  return (
    <button
      onClick={userData ? onLogout : onLogin}
      className={userData ? "btn btn-warning" : "btn btn-info"}
    >
      {userData ? "Logout" : "Login"}
    </button>
  );
};
