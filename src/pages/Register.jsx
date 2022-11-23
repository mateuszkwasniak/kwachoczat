import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage, db } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import registerImg from "../img/addAvatar.png";

import checkmark from "../img/checkmark.svg";

const Register = () => {
  const [err, setErr] = useState(false);
  const [fileIsSelected, setFileIsSelected] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const submitFormHandler = async (e) => {
    e.preventDefault();
    setErr(false);
    setErrorMessage("");

    const name = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    if (name.trim() === "") {
      setErrorMessage("Proszę uzupełnić Imię");
      setErr(true);
      return;
    }

    try {
      //utworzenie uzytkownika, zapisanie go w "zakladke" Authentication
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (!file) {
        await updateProfile(response.user, {
          displayName: name,
          photoURL: "",
        });

        await setDoc(doc(db, "users", response.user.uid), {
          uid: response.user.uid,
          name,
          email,
          photoURL: "",
        });

        await setDoc(doc(db, "userChats", response.user.uid), {});
        navigate("/");
      } else {
        //wyslanie pliku i przechowywanie go w "zakladce" Storage (Cloud Storage)
        //1.stworzenie unikalnej "sciezki" dla obrazka z uzyciem daty i czasu
        const date = new Date().getTime();
        //stworzenie referencji do Cloud Storage (nazwa sciezki w Cloud Storage)
        const storageRef = ref(storage, `${name + date}`);

        //wyslanie pliku do Cloud Storage poprzez referencje. Zwrocony zostaje promise uploadTask
        const uploadTask = uploadBytesResumable(storageRef, file);

        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion

        uploadTask.on(
          "state_changed",
          null,
          (error) => {
            setErr(true);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                //po prawidlowym wyslaniu obrazka do Cloud Storage i pozyskania URL do obrazka mozemy zupdatowac profil uzytkownika (w zakladce Authentication, dodajac jego imie oraz URL obrazka)
                await updateProfile(response.user, {
                  displayName: name,
                  photoURL: downloadURL,
                });

                //dodatkowo, aby uzyskac pozniej dostep do "znajomych" w aplikacji, musimy stworzyc osobna baze danych (Firestore)  przechowujaca uzytkowników -> funkcja setDoc przyjmuje jako argument doc() w ktorym okreslamy 1.nasza baze danych, 2.kolekcje gdzie dane maja byc zapisane ("users") 3. unikalne ID przechowywanego tam obiektu ktory bedzie zawieral pola uid, name, email i photo
                await setDoc(doc(db, "users", response.user.uid), {
                  uid: response.user.uid,
                  name,
                  email,
                  photoURL: downloadURL,
                });
                //Tworzymy dla kazdego nowego uzytkownika dokument userChats ktory bedzie przechowywal jego czaty z innymi uzytkownikami
                await setDoc(doc(db, "userChats", response.user.uid), {});
                navigate("/");
              }
            );
          }
        );
      }
    } catch (error) {
      const { message } = error;
      if (message.includes("weak-password")) {
        setErrorMessage("Hasło powinno zawierać przynajmniej 6 znaków");
      } else if (message.includes("missing-email")) {
        setErrorMessage("Proszę uzupełnić pole Email");
      } else if (message.includes("invalid-email")) {
        setErrorMessage("Taki email nie istnieje");
      }
      setErr(true);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Kwachoczat</span>
        <span className="title">Zarejestruj się</span>
        <form onSubmit={submitFormHandler}>
          <input type="text" placeholder="Imię"></input>
          <input type="email" placeholder="Email"></input>
          <input type="password" placeholder="Hasło"></input>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={(e) => {
              e.target.files[0].length !== 0 && setFileIsSelected(true);
            }}
          ></input>
          <label htmlFor="file">
            <img src={registerImg} alt="Avatar"></img>
            <span>Dodaj awatar</span>
            {fileIsSelected && (
              <img style={{ marginLeft: "auto" }} src={checkmark}></img>
            )}
          </label>
          <button type="submit">Zarejestruj się</button>
          {err && (
            <span style={{ color: "red", fontSize: "1.1rem" }}>
              {errorMessage}
            </span>
          )}
        </form>
        <p>
          Masz już konto? <Link to="/login">Zaloguj się</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
