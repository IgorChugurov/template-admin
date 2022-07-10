import { createContext, useReducer } from "react";
import actionResultMessageReducer from "./actionResultMessageReducer";

const INITIAL_STATE = {
  actionResultMessage: "",
};

export const ActionResultMessageContext = createContext(INITIAL_STATE);

export const ActionResultMessageProvider = ({ children }) => {
  const [state, dispatchActionResult] = useReducer(actionResultMessageReducer, INITIAL_STATE);

  return (
    <ActionResultMessageContext.Provider
      value={{
        className: state.className,
        dispatchActionResult,
      }}
    >
      {children}
    </ActionResultMessageContext.Provider>
  );
};
