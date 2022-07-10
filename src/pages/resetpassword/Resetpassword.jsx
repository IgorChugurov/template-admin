import { useState } from "react";
import "./resetpassword.scss";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { TextField } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
export default function Resetpassword() {
  const theme = createTheme({
    palette: {
      action: {
        disabledBackground: "gray",
        disabled: "white",
      },
    },
  });
  const [err, setError] = useState(false);
  const [errMsg, setErrorMsg] = useState("");
  const [email, setEmail] = useState("");
  const [disabledButton, seDisabledButtont] = useState(false);

  const [loginForgotMessage, setLoginForgotMessage] = useState(false);

  const handleResetPswd = async (e) => {
    e.preventDefault();
    seDisabledButtont(true);
    setErrorMsg("");
    try {
      const res = await axios.post("/api/auth/reserPassword", { email: email });
      setLoginForgotMessage(true);
      setTimeout(() => {
        setLoginForgotMessage(false);
        seDisabledButtont(false);
      }, 15000);
    } catch (err) {
      seDisabledButtont(false);
      if (err && err.response && err.response.data && err.response.data.message) {
        setErrorMsg(err.response.data.message);
      }
      setError(true);
      //console.log(err.data);
      setTimeout(() => {
        setError(false);
        setErrorMsg("");
      }, 15000);
    }
  };

  return (
    <div className="resetpassword">
      <div className="loginWrapper">
        <div className="loginRight">
          <div className="loginLogo">
            <LockOutlinedIcon className="loginIcon" />
          </div>
          <h3 className="loginTitle">Reset password</h3>

          <form className="loginBox" onSubmit={handleResetPswd} autoComplete="off">
            <TextField
              label="Email"
              error={err}
              required
              variant="outlined"
              size="small"
              type="email"
              margin="normal"
              onChange={(e) => {
                setEmail(e.target.value);
                setError(false);
              }}
            />

            {err && <span className="spanError">{errMsg ? errMsg : "Wrong Email"}</span>}
            <ThemeProvider theme={theme}>
              <button className="loginButton" type="submit" disabled={disabledButton}>
                RESET
              </button>
            </ThemeProvider>

            <div className="backToLogin">
              <Link to="/login" className="backToLogin-link" style={{ textDecoration: "none" }}>
                Back to login
              </Link>
            </div>

            {loginForgotMessage && (
              <span className="loginForgotMessage">Check your email (spam folder too).</span>
            )}
            <span className="loginCopyright">
              Copyright © https://www.bamboostrategicmedia.com 2022.
            </span>
          </form>
        </div>
      </div>
    </div>
  );
}
