import { useContext, useEffect, useState } from "react";
import "./login.scss";

import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [err, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { user, error, isFetching, dispatchUser } = useContext(AuthContext);
  //console.log(user);

  const handleClick = (e) => {
    e.preventDefault();
    loginCall({ email: email, password: password }, dispatchUser);
  };
  const handleResetPswd = async (e) => {
    e.preventDefault();
    return navigate("/resetpassword");
  };
  //console.log(error);
  useEffect(() => {
    if (error) {
      setError(true);
    }
  }, [error]);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLogo">
          <LockOutlinedIcon className="loginIcon" />
        </div>
        <h3 className="loginTitle">Sign in</h3>

        <form className="loginBox" onSubmit={handleClick} autoComplete="off">
          <TextField
            label="Username"
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
          <TextField
            label="Password"
            error={err}
            required
            type="password"
            variant="outlined"
            size="small"
            margin="normal"
            minLength="6"
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
          />
          {err && <span className="spanError">Wrong Email or Password</span>}
          <button className="loginButton" type="submit" disabled={isFetching}>
            SIGN IN
          </button>
          <span className="loginForgot" onClick={handleResetPswd}>
            Reset password?
          </span>

          <span className="loginCopyright">Copyright © 2022.</span>
        </form>
      </div>
    </div>
  );
}
