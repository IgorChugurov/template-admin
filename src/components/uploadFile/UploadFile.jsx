import { Add, DeleteOutlined } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import axios from "axios";
import { useRef, useState, useEffect } from "react";
import "./uploadFile.scss";
import ListDistinations from "./ListDestinations";

import Log from "../log/Log";

const UploadFile = ({
  selectionDestination,
  selectionGroup,
  data,
  dataGroup,
  setSelectionDestination,
  setSelectionGroup,
  disabledElement,
  hideListDestinations,
}) => {
  const [file, setFile] = useState("");
  const [error, setError] = useState("");
  const [log, setLog] = useState({});
  const [success, setSuccess] = useState(null);
  const [isFetching, setIsfetching] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    if (file) {
      setSuccess(null);
    }
  }, [file]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsfetching(true);
    setSuccess(null);
    const dataForSend = {
      destinations: [
        ...selectionDestination.map((d) => {
          const el = data.find((i) => i._id === d);
          return { ip: el.ip, name: el.name, status: "Pending" };
        }),
      ],
    };
    try {
      const destinationsFromGroup = selectionGroup
        .map((d) =>
          dataGroup
            .find((i) => i._id === d)
            .destinations.map((f) => {
              return { ip: f.ip, name: f.name, status: "Pending" };
            })
        )
        .reduce((arr, el) => {
          arr.push(...el);
          return arr;
        }, []);

      dataForSend.destinations.push(...destinationsFromGroup);
      dataForSend.destinations = dataForSend.destinations.filter(
        (tag, index, array) => array.findIndex((t) => t.ip == tag.ip) == index
      );

      //dataForSend.destinations = [...new Set(dataForSend.destinations)];
    } catch (err) {
      console.log(err);
    }

    if (file) {
      const data = new FormData();
      const fileName = file.name;
      data.append("name", fileName);
      data.append("file", file);
      dataForSend.fileName = fileName;

      try {
        const newLog = {
          fileName: fileName,
          destinations: dataForSend.destinations,
        };

        const newLogFromServer = await axios.post("/api/log", newLog);
        console.log(newLogFromServer);
        setLog(newLogFromServer.data);

        await axios.post("/api/upload/toServer", data);
        dataForSend.logId = newLogFromServer.data._id;
        const r = await axios.post(
          "/api/upload/sendToDistinations",
          dataForSend
        );
        setLog(r.data);

        setFile(null);
        inputRef.current.value = null;
        setSelectionDestination([]);
        setSelectionGroup([]);
        setSuccess(true);
      } catch (err) {
        setError(err.message || "Request failed");
        setTimeout(() => {
          setError("");
        }, 5000);
      }
      setIsfetching(false);
    }
  };

  return (
    <div className="uploadFile">
      <div className="fileSelectForm">
        <form onSubmit={submitHandler}>
          <div className="formInput">
            <Button
              size="small"
              startIcon={<Add />}
              variant="outlined"
              disabled={isFetching || disabledElement}
            >
              <label htmlFor="file"> Select </label>
            </Button>

            <input
              type="file"
              ref={inputRef}
              id="file"
              onChange={(e) => {
                if (typeof e.target.files[0] !== "undefined") {
                  setFile(e.target.files[0]);
                }
              }}
              style={{ display: "none" }}
            />

            <Button
              type="submit"
              disabled={
                disabledElement ||
                isFetching ||
                !file ||
                (!selectionDestination.length && !selectionGroup.length)
              }
              variant="contained"
              size="small"
              sx={{
                backgroundColor: "green",
                color: "white",

                "&:hover": {
                  backgroundColor: "rgba(0, 100, 0, 0.575);",
                },
              }}
            >
              Send File
            </Button>
          </div>
          {success && (
            <Button
              onClick={(e) => {
                setSuccess(null);
              }}
              variant="contained"
              size="small"
              sx={{
                maxWidth: "120px",
                backgroundColor: "blue",
                color: "white",

                "&:hover": {
                  backgroundColor: "lightblue",
                },
              }}
            >
              Clear Logs
            </Button>
          )}
        </form>
      </div>

      {file && !isFetching && (
        <div className="chosenFile">
          <span>{file.name}</span>
          <DeleteOutlined
            className="icon"
            onClick={(e) => {
              setFile(null);
              inputRef.current.value = null;
            }}
          />
        </div>
      )}

      <div className="bottom">
        {file && !success && !isFetching && !hideListDestinations && (
          <ListDistinations
            selectionDestination={selectionDestination}
            selectionGroup={selectionGroup}
            data={data}
            dataGroup={dataGroup}
          />
        )}
        {(success || isFetching) && log && log._id && (
          <Log data={log} index={0} style={{ "margin-top": "15px" }} />
        )}
      </div>
      {error && (
        <Typography variant="h6" component="p" color="red">
          {error}
        </Typography>
      )}
    </div>
  );
};

export default UploadFile;
