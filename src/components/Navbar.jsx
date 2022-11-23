import React, { useContext } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { AuthContext } from "../context/AuthContext";

import defaultAvatar from "../img/defaultAvatar.png";
import { ChatContext } from "../context/ChatContext";

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  const logoutHandler = () => {
    dispatch({ type: "CHANGE_USER", payload: { user: {}, chatID: "null" } });
    signOut(auth);
  };

  return (
    <div className="navbar">
      <span className="logo">Kwachoczat</span>
      <div className="user">
        <img src={currentUser?.photoURL || defaultAvatar} alt="User"></img>
        <span>{currentUser.displayName}</span>
        <button onClick={logoutHandler}>Wyloguj się</button>
      </div>
    </div>
  );
};

export default Navbar;
