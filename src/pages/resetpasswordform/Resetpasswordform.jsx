import { useContext, useEffect, useState } from "react";
import "./resetpasswordform.scss";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { TextField, Typography } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import validator from "validator";

export default function Resetpasswordform() {
  let { key } = useParams();
  console.log("key", key);
  const navigate = useNavigate();
  const [keyValid, setKeyValid] = useState(false);
  const [err, setError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const { user, error, isFetching, dispatchUser } = useContext(AuthContext);
  //console.log(user);

  const validate = (value) => {
    if (
      validator.isStrongPassword(value, {
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (!validate(password)) {
      setErrorMessage("Not Strong Password");
      return;
    }
    try {
      const res = await axios.post("/api/auth/changepassword/" + key, {
        password: password,
      });
      console.log(res);

      setSuccess(true);
    } catch (err) {
      setKeyValid(false);
      if (err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Wrong key!");
      }
      console.log(err);
    }
  };

  //console.log(error);
  useEffect(() => {
    const sendKey = async () => {
      try {
        const res = await axios.get("/api/auth/checkresetkey/" + key);
        console.log(res);
        setKeyValid(true);
      } catch (err) {
        console.log(err.response.data);
        if (err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError("Wrong key!");
        }
      }
    };
    sendKey();
  }, []);
  useEffect(() => {
    setErrorMessage("");
  }, [password]);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="resetpasswordform">
      <div className="loginWrapper">
        <div className="loginRight">
          <div className="loginLogo">
            <LockOutlinedIcon className="loginIcon" />
          </div>
          <h3 className="loginTitle">New password</h3>
          {err && <span className="spanError">{err}</span>}
          {success && (
            <span className="spanSuccess">
              Password has been changed. Please <Link to="/login">Login</Link>
            </span>
          )}
          {keyValid && !success && (
            <form className="loginBox" onSubmit={handleClick} autoComplete="off">
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
              <Typography variant="caption" display="block" gutterBottom sx={{ ml: "6px" }}>
                Must contain at least: 12 characters, 1 lowercase character, 1 uppercase character,
                1 number, 1 symbol
              </Typography>

              {errorMessage === "" ? null : (
                <p
                  style={{
                    fontWeight: "bold",
                    color: "red",
                    marginLeft: "6px",
                    marginBottom: "10px",
                  }}
                >
                  {errorMessage}
                </p>
              )}

              <button className="loginButton" type="submit" disabled={isFetching}>
                Set New Password
              </button>

              <span className="loginCopyright">
                Copyright © https://www.bamboostrategicmedia.com 2022.
              </span>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
