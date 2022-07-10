import "./log.scss";
import Destinations from "./Destinations";
import * as moment from "moment";
import Collapse from "@mui/material/Collapse";

import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  DeleteOutline,
} from "@mui/icons-material";
import { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";

const Log = ({ data, index, handleDelete, user }) => {
  const location = useLocation();
  const [item, setItem] = useState(null);
  useEffect(() => {
    if (
      !index &&
      (location.pathname === "/logs" || location.pathname === "/")
    ) {
      data.showInner = true;
    }
    //console.log(data);

    setItem(data);
  }, [data]);

  const setOpen = () => {
    item.showInner = !item.showInner;
    setItem({ ...item });
  };
  return (
    <div className="log-detail">
      {item && (
        <div className="list-group-item">
          <div
            className={item.showInner ? "rowHeader active" : "rowHeader"}
            onClick={() => setOpen(item)}
          >
            <div className="innerRowHeader">
              <div className="number">
                {!item.showInner && <KeyboardArrowDown className="icon" />}
                {item.showInner && <KeyboardArrowUp className="icon" />}
              </div>
              <div className="fileName">
                <div>{item.fileName}</div>
                <div>
                  {" "}
                  {user &&
                    user.email &&
                    item.owner &&
                    item.owner.email &&
                    user.email !== item.owner.email && (
                      <div className="email">
                        <span>{item.owner.email}</span>
                      </div>
                    )}
                </div>
              </div>

              <div className="dateOfLog">
                <span>{moment(item.date).format("LLL")}</span>
                {location.pathname === "/logs" && (
                  <DeleteOutline
                    className="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item);
                    }}
                  />
                )}
              </div>
            </div>
          </div>
          <Collapse in={item.showInner}>
            <div className="rowInner">
              <Destinations
                currentItem={item}
                useSocket={!index ? true : false}
              />
            </div>
          </Collapse>
        </div>
      )}
    </div>
  );
};

export default Log;
