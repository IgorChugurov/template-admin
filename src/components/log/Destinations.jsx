import "./destinations.scss";

import { SocketContext } from "../../context/socket";
import { useCallback } from "react";
import { useContext, useEffect, useState } from "react";

const Destinations = ({ currentItem, useSocket }) => {
  const [destinations, setDestinations] = useState(currentItem.destinations);

  const socket = useContext(SocketContext);

  const handleStatusAccepted = (data) => {
    if (currentItem._id && currentItem._id === data[0]) {
      setDestinations((prev) => [
        ...prev.map((d) => {
          if (d.ip === data[1]) {
            d.status = data[2];
          }
          return d;
        }),
      ]);
    }
  };

  useEffect(() => {
    setDestinations(currentItem.destinations);
  }, [currentItem]);
  useEffect(() => {
    // subscribe to socket events
    if (useSocket) {
      //console.log("subscribe STATUS_REQUEST_ACCEPTED");
      socket.on("STATUS_REQUEST_ACCEPTED", handleStatusAccepted);
    }

    return () => {
      if (useSocket) {
        //console.log("unsubscribe STATUS_REQUEST_ACCEPTED");
        socket.off("STATUS_REQUEST_ACCEPTED", handleStatusAccepted);
      }
    };
  }, [useSocket, socket, handleStatusAccepted]);

  return (
    <div className="activeLog">
      <div className="listDestinations">
        {destinations &&
          destinations.map((destination, index) => (
            <div key={index}>
              <div
                className={
                  index !== destinations.length - 1
                    ? "destionation"
                    : "destionation lastDestination"
                }
              >
                <div className="name">
                  <span>{destination.name}</span>
                </div>

                <div className="status">
                  <div
                    className={
                      "icon " +
                      (destination.status === "Pending" ? "pending" : "") +
                      (destination.status === "Error" ? "error" : "") +
                      (destination.status === "Success" ? "success" : "")
                    }
                  >
                    <span>{destination.status}</span>
                  </div>
                </div>
                <div className="ip">
                  <span>{destination.ip}</span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
export default Destinations;
