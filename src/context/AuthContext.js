import { createContext, useEffect, useReducer } from "react";
import AuthReducer from "./AuthReducer";

const INITIAL_STATE = {
  user: JSON.parse(localStorage.getItem(process.env.REACT_APP_STORAGE)) || null,
  isFetching: false,
  error: false,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatchUser] = useReducer(AuthReducer, INITIAL_STATE);

  useEffect(() => {
    if (state.force) {
      localStorage.setItem(
        `${process.env.REACT_APP_STORAGE}-admin`,
        localStorage.getItem(process.env.REACT_APP_STORAGE),
      );
    }
    if (!state.user && !state.force) {
      localStorage.setItem(`${process.env.REACT_APP_STORAGE}-admin`, JSON.stringify(null));
    }
    localStorage.setItem(process.env.REACT_APP_STORAGE, JSON.stringify(state.user));
  }, [state.user]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isFetching: state.isFetching,
        error: state.error,
        dispatchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
