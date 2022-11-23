import { createContext, useReducer } from "react";

export const ChatContext = createContext();

const INITIAL_STATE = {
  chatID: "null",
  user: {},
};

export const ChatContextProvider = ({ children }) => {
  //ze wzgledu na "zlozonosc" stanu wykorzystujemy useReducer zamiast useState

  const chatReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_USER":
        return {
          user: action.payload.user,
          chatID: action.payload.chatID,
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
