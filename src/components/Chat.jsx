import React from "react";
import Messages from "./Messages";
import Input from "./Input";
import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";

const Chat = () => {
  const {
    data: { user, chatID },
  } = useContext(ChatContext);

  return (
    <div className="chat">
      <div className="chatInfo">
        <span>{user?.name}</span>
        <div className="chatIcons">
          {/* <img src="" alt="Camera"></img>
          <img src="" alt="Add Buddy"></img>
          <img src="" alt="More"></img> */}
        </div>
      </div>
      <Messages></Messages>
      <Input></Input>
    </div>
  );
};

export default Chat;
