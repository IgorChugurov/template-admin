import { createContext, useEffect, useReducer } from "react";
import DarkModeReducer from "./darkModeReducer";

const INITIAL_STATE = {
  darkMode: JSON.parse(localStorage.getItem(`${process.env.REACT_APP_STORAGE}-MODE`)) || false,
};

export const DarkModeContext = createContext(INITIAL_STATE);

export const DarkModeContextProvider = ({ children }) => {
  const [state, dispatchDarkMode] = useReducer(DarkModeReducer, INITIAL_STATE);
  useEffect(() => {
    localStorage.setItem(`${process.env.REACT_APP_STORAGE}-MODE`, JSON.stringify(state.darkMode));
  }, [state.darkMode]);

  return (
    <DarkModeContext.Provider value={{ darkMode: state.darkMode, dispatchDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};
