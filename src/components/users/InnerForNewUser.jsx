import { Box, TextField, Button, Typography } from "@mui/material";
import { useState } from "react";
import validator from "validator";
function InnerForNewUser({ handleNewUser, setOpenModal }) {
  const initData = {
    email: "",
    password: "",
  };
  const [fullWidth] = useState(true);
  const [data, setData] = useState(initData);

  const [errorMessage, setErrorMessage] = useState("");

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

  const handleInput = (e) => {
    e.preventDefault();
    const id = e.target.id;
    const value = e.target.value;
    setData({ ...data, [id]: value });
    if (id === "password") {
      setErrorMessage("");
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate(data.password)) {
      setErrorMessage("Not Strong Password");
      return;
    }
    e.preventDefault();
    handleNewUser(data);
    setOpenModal(false);
  };
  return (
    <>
      <div className="addUser">
        <Box component="form" onSubmit={handleSubmit}>
          <div className="inputGroup">
            <TextField
              sx={{ margin: 0.5 }}
              size="small"
              type="email"
              fullWidth={fullWidth}
              required
              onChange={handleInput}
              value={data.email}
              id="email"
              label="Email"
            />
          </div>
          <div className="inputGroup" style={{ marginTop: "10px" }}>
            <TextField
              sx={{ margin: 0.5 }}
              fullWidth={fullWidth}
              size="small"
              required
              value={data.password}
              onChange={handleInput}
              id="password"
              label="Password"
            />
            <Typography
              variant="caption"
              display="block"
              gutterBottom
              sx={{ ml: "6px" }}
            >
              Must contain at least: 12 characters, 1 lowercase character, 1
              uppercase character, 1 number, 1 symbol
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
            <Button
              sx={{ margin: 0.5 }}
              variant="contained"
              type="submit"
              disabled={!!errorMessage}
            >
              Add
            </Button>
          </div>
        </Box>
      </div>
    </>
  );
}
export default InnerForNewUser;
