import { useContext, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

import defaultAvatar from "../img/defaultAvatar.png";

const msToTime = (duration, locale = "PL") => {
  let seconds = Math.floor((duration / 1000) % 60);
  let minutes = Math.floor((duration / (1000 * 60)) % 60);
  let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  if (locale === "PL") hours += 2;

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds;
};

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const {
    data: { user },
  } = useContext(ChatContext);

  const lastMsgRef = useRef();

  useEffect(() => {
    lastMsgRef?.current.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div
      ref={lastMsgRef}
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
    >
      <div className="messageInfo">
        <img
          src={`${
            message.senderId === currentUser.uid
              ? currentUser?.photoURL || defaultAvatar
              : user?.photoURL || defaultAvatar
          }`}
          alt="Message Sender"
        ></img>
        <span>{msToTime(message.date)}</span>
      </div>
      <div className="messageContent">
        {message.text && <p>{message.text}</p>}
        {message?.img && <img src={message?.img} alt="Message Photo"></img>}
      </div>
    </div>
  );
};

export default Message;
