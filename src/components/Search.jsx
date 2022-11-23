import { useState, useContext } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  getDoc,
  updateDoc,
  query,
  where,
  setDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import defaultAvatar from "../img/defaultAvatar.png";

const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);
  const [searchMessage, setSearchMessage] = useState("");

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  const searchUser = async () => {
    setErr(false);
    setUser(null);
    setSearchMessage("");
    const usersCollectionRef = collection(db, "users");
    const q = query(usersCollectionRef, where("name", "==", username));

    try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.docs.length === 0) {
        setSearchMessage("Nie udało się znaleźć żadnego użytkownika..");
      }
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (error) {
      setErr(true);
      setSearchMessage("Coś poszło źle..");
    }
  };

  const handleSelect = async () => {
    //check whether the group (chats in firestore) exists, if not create
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    try {
      //create a chat in chats collection
      const docSnap = await getDoc(doc(db, "chats", combinedId));

      if (!docSnap.exists()) {
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            name: user.name,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            name: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }

      dispatch({ type: "CHANGE_USER", payload: { chatID: combinedId, user } });
    } catch (error) {
      console.log(error);
    }

    setUser(null);
    setUsername("");
  };

  // const handleKey = (e) => {
  //   (e.code === "Enter" || e.code === "13") && searchUser();
  // };

  return (
    <div className="search">
      <div className="searchForm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            searchUser();
          }}
        >
          <input
            type="text"
            placeholder="Szukaj znajomych"
            value={username}
            // onKeyDown={handleKey}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          ></input>
        </form>
      </div>
      {(err || searchMessage) && (
        <span
          style={{
            display: "block",
            fontSize: "1.1rem",
            color: "gray",
            marginLeft: "20px",
            marginBottom: "5px",
          }}
        >
          {searchMessage}
        </span>
      )}
      {user && (
        <div className="userChat" onClick={handleSelect}>
          <img src={user?.photoURL || defaultAvatar} alt="Buddy"></img>
          <div className="userChatInfo">
            <span>{user.name}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
