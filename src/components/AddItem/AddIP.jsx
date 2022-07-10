import { Box, Button, TextField } from "@mui/material";
import { useState, useEffect, useContext } from "react";
import "./addIP.scss";
import { ActionResultMessageContext } from "../../context/actionResultMessageContext";
const AddIP = ({ addDestination, destinationForEdit, cancelUpdate, allDestinations }) => {
  const initData = {
    ip: "",
    name: "",
    notes: "",
  };
  const { actionResultMessage, dispatchActionResult } = useContext(ActionResultMessageContext);
  const [fullWidth] = useState(true);
  const [data, setData] = useState(initData);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setData({ ...destinationForEdit });
  }, [destinationForEdit]);

  const handleInput = (e) => {
    e.preventDefault();
    const id = e.target.id;
    const value = e.target.value;
    setData({ ...data, [id]: value });
    setError("");
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      setIsFetching(true);

      if (allDestinations.some((d) => d.ip === data.ip && d._id !== data._id)) {
        throw "Destination with the same IP is exist!";
      }
      await addDestination(data);
      setData(initData);
      setIsFetching(false);
      setError("");
    } catch (err) {
      dispatchActionResult({ type: "CN_ERROR" });
      setTimeout(() => {
        dispatchActionResult({ type: "CN_CLEAR" });
      }, 5000);
      console.log(err);
      setError(err);
      setIsFetching(false);
    }
  };
  const handleCancel = async (e) => {
    e.preventDefault();
    try {
      cancelUpdate();
      setTimeout(() => {
        setData(initData);
        setIsFetching(false);
        setError("");
      }, 300);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="addIP">
        <Box component="form" onSubmit={handleAdd}>
          <div className="inputGroup">
            <TextField
              sx={{ margin: 0.5 }}
              size="small"
              fullWidth={fullWidth}
              required
              value={data.ip}
              onChange={handleInput}
              id="ip"
              label="PlayoutBee destination"
            />
            <TextField
              sx={{ margin: 0.5 }}
              size="small"
              fullWidth={fullWidth}
              required
              onChange={handleInput}
              value={data.name}
              id="name"
              label="Friendly name"
            />
          </div>
          <div className="inputGroup">
            <TextField
              sx={{ margin: 0.5 }}
              fullWidth={fullWidth}
              size="small"
              value={data.notes}
              onChange={handleInput}
              id="notes"
              label="Notes"
            />
            <div className="inputGroupForButton">
              <Button
                sx={{ margin: 0.5 }}
                type="button"
                disabled={isFetching}
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                sx={{ margin: 0.5 }}
                variant="contained"
                color="success"
                type="submit"
                disabled={isFetching || !data.ip || !data.name}
              >
                {!data._id ? "Add" : "Update"}
              </Button>
            </div>
          </div>
        </Box>
        <p className="addIPError">{error}</p>
      </div>
    </>
  );
};

export default AddIP;
