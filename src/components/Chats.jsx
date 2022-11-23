import React from "react";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

import defaultAvatar from "../img/defaultAvatar.png";

const Chats = () => {
  const [chats, setChats] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    if (!currentUser.uid) {
      return;
    }

    const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
      setChats(Object.entries(doc.data()));
    });

    return unsub;
  }, [currentUser.uid]);

  return (
    <div className="chats">
      {chats.length !== 0 &&
        chats
          .sort((a, b) => {
            return b[1].date - a[1].date;
          })
          .map((chat) => {
            return (
              <div
                className="userChat"
                key={chat[0]}
                onClick={() => {
                  dispatch({
                    type: "CHANGE_USER",
                    payload: { chatID: chat[0], user: chat[1].userInfo },
                  });
                }}
              >
                <img
                  src={chat[1].userInfo?.photoURL || defaultAvatar}
                  alt="Buddy"
                ></img>
                <div className="userChatInfo">
                  <span>{chat[1].userInfo.name}</span>
                  <p>{chat[1]?.lastMessage}</p>
                </div>
              </div>
            );
          })}
    </div>
  );
};

export default Chats;
