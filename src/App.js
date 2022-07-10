import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Resetpassword from "./pages/resetpassword/Resetpassword";
import Resetpasswordform from "./pages/resetpasswordform/Resetpasswordform";
import Users from "./pages/users/Users";
import Logs from "./pages/logs/Logs";

import "./style/dark.scss";
import { DarkModeContext } from "./context/darkModeContext";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext, useMemo } from "react";
import { AuthContext } from "./context/AuthContext";
import { SocketContext, socket } from "./context/socket";
import { useEffect } from "react";
import axios from "axios";

function App() {
  const { user } = useContext(AuthContext);
  const { darkMode } = useContext(DarkModeContext);
  useEffect(() => {
    // as soon as the component is mounted, do the following tasks:

    // emit USER_ONLINE event
    if (user) {
      socket.emit("USER_ONLINE", user.id);
      axios.defaults.headers.common["x-access-token"] = user.accessToken;
      //console.log(axios.defaults.headers.common);
      //httpCommon.defaultConfig.headers["x-access-token"] = user.accessToken;
    } else {
      socket.emit("USER_LOGUOT");
      axios.defaults.headers.common["x-access-token"] = null;
      //httpCommon.defaultConfig.headers["x-access-token"] = null;
    }
  }, [socket, user]);
  const RequireAuth = ({ children }) => {
    return user ? children : <Navigate to="/login" />;
  };
  const RequireAdminAuth = ({ children }) => {
    return user && user.role === "admin" ? children : <Navigate to="/login" />;
  };
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
        },
      }),
    [darkMode],
  );

  return (
    //https://mui.com/material-ui/customization/dark-mode/#dark-mode-by-default
    <ThemeProvider theme={theme}>
      <SocketContext.Provider value={socket}>
        <div className={darkMode ? "app dark" : "app"}>
          <BrowserRouter>
            <Routes>
              <Route path="/">
                <Route
                  index
                  element={
                    <RequireAuth>
                      <Home />
                    </RequireAuth>
                  }
                />
                <Route path="resetpassword" element={<Resetpassword />} />
                <Route path="resetpasswordform/:key" element={<Resetpasswordform />} />
                <Route path="login" element={<Login />} />
                <Route path="users">
                  <Route
                    index
                    element={
                      <RequireAuth>
                        <Users />
                      </RequireAuth>
                    }
                  />

                  {/* <Route path=":userId" element={<SingleUser />} />
              <Route
                path="new"
                element={<NewUser/>}
              /> */}
                </Route>
                <Route path="logs">
                  <Route
                    index
                    element={
                      <RequireAuth>
                        <Logs />
                      </RequireAuth>
                    }
                  />
                </Route>
                <Route path="alllogs">
                  <Route
                    index
                    element={
                      <RequireAdminAuth>
                        <Logs />
                      </RequireAdminAuth>
                    }
                  />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </div>
      </SocketContext.Provider>
    </ThemeProvider>
  );
}

export default App;
