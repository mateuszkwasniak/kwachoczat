import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  doc,
  arrayUnion,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import addImg from "../img/addImg.png";
import checkmark from "../img/checkmark.svg";

const Input = () => {
  const { currentUser } = useContext(AuthContext);
  const {
    data: { user, chatID },
  } = useContext(ChatContext);

  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const handleSend = async () => {
    if (img) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.log(error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", chatID), {
              messages: arrayUnion({
                id: uuid(),
                text,
                img: downloadURL,
                senderId: currentUser.uid,
                date: Date.now(),
              }),
            });
          });
        }
      );
    } else {
      await updateDoc(doc(db, "chats", chatID), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Date.now(),
        }),
      });
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [chatID + ".lastMessage"]: text,
      [chatID + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", user.uid), {
      [chatID + ".lastMessage"]: text,
      [chatID + ".date"]: serverTimestamp(),
    });

    setText("");
    setImg(null);
  };

  return (
    <div className="input">
      {!user && null}
      {user.name && (
        <>
          <input
            type="text"
            placeholder="Napisz coś..."
            onKeyDown={(e) => {
              e.code === "Enter" && handleSend();
            }}
            onChange={(e) => setText(e.target.value)}
            value={text}
          ></input>
          <div className="send">
            {/* <img src={addImg} alt="Add Image"></img> */}
            <input
              type="file"
              style={{ display: "none" }}
              id="file"
              onChange={(e) => {
                setImg(e.target.files[0]);
              }}
            />
            <label htmlFor="file">
              <img src={img ? checkmark : addImg} alt="AddImage"></img>
            </label>
            <button onClick={handleSend}>Wyślij</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Input;
