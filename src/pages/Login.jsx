import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase";

import registerImg from "../img/addAvatar.png";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const submitFormHandler = async (e) => {
    e.preventDefault();
    setErr(false);
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      setErr(true);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Kwachoczat</span>
        <span className="title">Zaloguj się</span>
        <form onSubmit={submitFormHandler}>
          <input type="text" placeholder="Email"></input>
          <input type="password" placeholder="Hasło"></input>
          <button type="submit">Zaloguj się</button>
          {err && (
            <span style={{ color: "red", fontSize: "1.1rem" }}>
              Coś poszło źle..Spróbuj ponownie
            </span>
          )}
        </form>
        <p>
          Nie masz konta? <Link to="/register">Zarejestruj się</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
