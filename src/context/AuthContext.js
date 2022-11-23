import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { createContext, useState, useEffect } from "react";

//Tworzymy kontext ktory bedzie przechowywal informacje na temat zalogowanego uzytkownika (przy pomocy wrapper AuthContextProvider). Wykorzystujemy useEffect!

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
