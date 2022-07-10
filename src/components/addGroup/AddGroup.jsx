import { Box, Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import "./addGroup.scss";

const AddGroup = ({
  addGroup,
  selectionDestination,
  groupForEdit,
  cancelUpdateGroup,
  allGroups,
}) => {
  useEffect(() => {
    setIsDisabled(!selectionDestination.length);
  }, [selectionDestination]);

  const initData = {
    name: "",
    notes: "",
  };
  const [fullWidth] = useState(true);
  const [data, setData] = useState(groupForEdit);
  const [isFetching, setIsFetching] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [error, setError] = useState("");

  const handleInput = (e) => {
    e.preventDefault();
    const id = e.target.id;
    const value = e.target.value;
    setData({ ...data, [id]: value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      setIsFetching(true);

      await addGroup(data);
      setData(initData);
      setIsFetching(false);
    } catch (err) {
      setError("");
      setIsFetching(false);
      console.log(err);
    }
  };
  const handleCancel = async (e) => {
    e.preventDefault();
    try {
      cancelUpdateGroup();
      setTimeout(() => {
        setData(initData);
        setIsFetching(false);
        setError("");
      }, 500);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="addGroup">
        <Box component="form" onSubmit={handleAdd}>
          <div className="inputGroup">
            <TextField
              sx={{ margin: 0.5 }}
              size="small"
              fullWidth={fullWidth}
              required
              onChange={handleInput}
              value={data.name}
              id="name"
              label="Name"
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
                type="submit"
                color="success"
                disabled={isFetching || !data.name || isDisabled}
              >
                {!data._id ? "Add" : "Update"}
              </Button>
            </div>
          </div>
        </Box>
        <p className="addGroupError" style={{ color: "red", fontSize: "16px" }}>
          {error}
        </p>
      </div>
    </>
  );
};

export default AddGroup;
