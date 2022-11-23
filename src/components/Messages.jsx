import { useContext, useState, useEffect } from "react";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import { onSnapshot, doc } from "firebase/firestore";
import Message from "./Message";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const {
    data: { chatID },
  } = useContext(ChatContext);

  useEffect(() => {
    const unsubsribe = onSnapshot(doc(db, "chats", chatID), (doc) => {
      if (doc.exists()) {
        setMessages(doc.data().messages);
      }
    });

    return unsubsribe;
  }, [chatID]);

  return (
    <div className="messages">
      {messages.map((msg) => {
        return <Message message={msg} key={msg.id} />;
      })}
    </div>
  );
};

export default Messages;
