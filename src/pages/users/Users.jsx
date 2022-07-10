import Navbar from "../../components/navbar/Navbar";
import "./users.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns } from "../../datatablesource";

import { useState, useContext, useEffect } from "react";
import { Add, Check, DeleteOutline, LockReset, Login } from "@mui/icons-material";
import { Button, Modal, Typography } from "@mui/material";
import { Box } from "@mui/system";

import InnerForNewUser from "../../components/users/InnerForNewUser";
import InnerForNewPswd from "../../components/users/InnerForNewPswd";
import InnerForDelete from "../../components/users/InnerForDelete";

import { AuthContext } from "../../context/AuthContext";
import { ActionResultMessageContext } from "../../context/actionResultMessageContext";
import { useNavigate } from "react-router-dom";
import userService from "../../services/users";
const Users = () => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "#fff",
    border: "0.5px solid #000",
    boxShadow: 24,
    p: 3,
  };
  const navigate = useNavigate();
  const { user, dispatchUser } = useContext(AuthContext);
  const { dispatchActionResult } = useContext(ActionResultMessageContext);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const [currentUserId, setCurrentUserId] = useState(null);

  const [openModal, setOpenModal] = useState(false);
  const [modalInner, setModalInner] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [typeModal, setTypeModal] = useState(null);

  useEffect(() => {
    let list = [];
    const fetchdata = async () => {
      try {
        // get destinations
        const resDest = await userService.getAll();
        resDest.data.forEach((doc, i) => {
          list.push({ id: doc._id, number: i + 1, ...doc });
        });

        setData(list);
      } catch (err) {
        console.log(err);
      }
    };

    fetchdata();
  }, []);

  const handleDelete = async (id) => {
    try {
      await userService.deleteOne(id);
      let users = data.filter((item) => item.id !== id);
      users.forEach((item, i) => (item.number = i + 1));
      setData(users);
      dispatchActionResult({ type: "CN_SUCCESS" });
      setTimeout(() => {
        dispatchActionResult({ type: "CN_CLEAR" });
      }, 5000);
    } catch (err) {
      dispatchActionResult({ type: "CN_ERROR" });
      setTimeout(() => {
        dispatchActionResult({ type: "CN_CLEAR" });
      }, 5000);
      console.log(err);
      let errorMessage =
        err && err.response && err.response.data
          ? err.response.data.message
          : "Request failed with status code 500";
      setError(errorMessage);
      setTimeout(() => {
        setError("");
      }, 7000);
    }
  };
  const handleLogin = async (id) => {
    dispatchUser({ type: "FORCE_LOGIN_START" });
    try {
      const res = await userService.forcelogin(id);
      dispatchUser({ type: "FORCE_LOGIN_SUCCESS", payload: res.data });
      navigate("/");
    } catch (err) {
      dispatchActionResult({ type: "CN_ERROR" });
      setTimeout(() => {
        dispatchActionResult({ type: "CN_CLEAR" });
      }, 5000);
      console.log(err);
      let errorMessage =
        err && err.response && err.response.data
          ? err.response.data.message
          : "Request failed with status code 500";
      setError(errorMessage);
      setTimeout(() => {
        setError("");
      }, 7000);
    }
  };
  const handleOpenModal = (type, id) => {
    setTypeModal(type);
    switch (type) {
      case "pswd": {
        setModalTitle("New password");
        setModalInner(null);
        setCurrentUserId(id);

        break;
      }
      case "newUser": {
        setModalTitle("New User");
        setModalInner(null);
        break;
      }
      case "login": {
        const user = data.find((u) => u._id === id);
        setModalTitle("Login as " + user.email);
        setModalInner(InnerForDelete({ handleDelete: handleLogin, setOpenModal, id }));
        break;
      }
      case "delete": {
        setModalTitle("Delete?");
        setModalInner(InnerForDelete({ handleDelete, setOpenModal, id }));
        break;
      }
      default:
        break;
    }

    setOpenModal(true);
  };
  const handleCloseModal = () => setOpenModal(false);

  const handleNewUser = async (newItem) => {
    try {
      const res = await userService.createOne(newItem);
      newItem = { id: res.data._id, ...res.data };
      newItem.number = data.length + 1;

      setData((prev) => [...prev, newItem]);
      dispatchActionResult({ type: "CN_SUCCESS" });
      setTimeout(() => {
        dispatchActionResult({ type: "CN_CLEAR" });
      }, 5000);
    } catch (err) {
      dispatchActionResult({ type: "CN_ERROR" });
      setTimeout(() => {
        dispatchActionResult({ type: "CN_CLEAR" });
      }, 5000);
      console.log(err);
      let errorMessage =
        err && err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : "Request failed with status code 500";
      setError(errorMessage);
      setTimeout(() => {
        setError("");
      }, 7000);
    }
  };
  const handleNewPswd = async (newPswd) => {
    try {
      await userService.updateOne(currentUserId, newPswd);
      setData((prev) => {
        let item = data.find((i) => i._id === currentUserId);
        if (item) {
          item.success = true;
        }

        return [...prev];
      });
      setTimeout(() => {
        setData((prev) => {
          let item = data.find((i) => i._id === currentUserId);
          if (item) {
            item.success = false;
          }

          return [...prev];
        });
      }, 7000);

      dispatchActionResult({ type: "CN_SUCCESS" });
      setTimeout(() => {
        dispatchActionResult({ type: "CN_CLEAR" });
      }, 5000);
    } catch (err) {
      dispatchActionResult({ type: "CN_ERROR" });
      setTimeout(() => {
        dispatchActionResult({ type: "CN_CLEAR" });
      }, 5000);
      console.log(err);
      let errorMessage =
        err && err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : "Request failed with status code 500";
      setError(errorMessage);
      setTimeout(() => {
        setError("");
      }, 7000);
    }
  };
  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            {params.row.role !== "admin" && (
              <div onClick={(e) => handleOpenModal("pswd", params.row.id)}>
                <LockReset className="icon" />
              </div>
            )}
            {params.row.role !== "admin" && (
              <div onClick={(e) => handleOpenModal("login", params.row.id)}>
                <Login className="icon" />
              </div>
            )}
            {params.row.role !== "admin" && (
              <div onClick={(e) => handleOpenModal("delete", params.row.id)}>
                <DeleteOutline className="deleteIcon" />
              </div>
            )}
            {params.row.success && (
              <div>
                <Check className="okicon" />
              </div>
            )}
          </div>
        );
      },
    },
  ];
  return (
    <div className="users">
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="newUserModal">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {modalTitle}
          </Typography>
          <div id="modal-modal-description">
            {modalInner}
            {typeModal === "newUser" && (
              <InnerForNewUser handleNewUser={handleNewUser} setOpenModal={setOpenModal} />
            )}
            {typeModal === "pswd" && (
              <InnerForNewPswd handleNewPswd={handleNewPswd} setOpenModal={setOpenModal} />
            )}
          </div>
        </Box>
      </Modal>
      <div className="usersContainer">
        <Navbar />

        <div className="listContainer">
          <div className="top">
            <h3 className="listTitle">List of Users</h3>
            <div className="datatableTitle">
              <Button
                size="small"
                startIcon={<Add />}
                variant="outlined"
                onClick={(e) => handleOpenModal("newUser")}
              >
                new
              </Button>
            </div>
          </div>

          <div className="datatable">
            {error && (
              <Typography component="p" color="red" sx={{ marginBottom: "10px" }}>
                {error}
              </Typography>
            )}

            <DataGrid
              className="datagrid"
              rows={data}
              columns={userColumns.concat(actionColumn)}
              pageSize={100}
              rowsPerPageOptions={[100]}
              checkboxSelection={false}
              disableSelectionOnClick
              autoHeight={true}
              hideFooter={true}
              hideFooterPagination={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
