import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { apiColumns, groupColumns } from "../../datatablesource";

import { useEffect, useState, useContext, useRef } from "react";

import {
  VisibilityOutlined,
  DeleteOutlineOutlined,
  FmdGoodOutlined,
  StickyNote2Outlined,
  FormatListBulleted,
  Check,
  ModeEditOutlined,
} from "@mui/icons-material";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

import Collapse from "@mui/material/Collapse";
import AddIP from "../AddItem/AddIP";
import { Stack, Tab, Tabs } from "@mui/material";
import PropTypes from "prop-types";
import axios from "axios";
import AddGroup from "../addGroup/AddGroup";

import { AuthContext } from "../../context/AuthContext";
import { ActionResultMessageContext } from "../../context/actionResultMessageContext";

import UploadFile from "../uploadFile/UploadFile";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          <Typography component={"div"}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",
  border: "0.5px solid #000",
  boxShadow: 24,
  p: 3,
};

const theme = createTheme({
  palette: {
    action: {
      disabledBackground: "none",
      disabled: "white",
    },
  },
});

const ModalInner = ({ handleDelete, setOpenModal, id, type }) => {
  //console.log(type);
  return (
    <div className="modalButton">
      <Button
        size="small"
        variant="contained"
        className="deleteYes"
        onClick={(e) => {
          setOpenModal(false);
          handleDelete(id, type);
        }}
      >
        YES
      </Button>
      <Button
        size="small"
        variant="contained"
        color="error"
        className="deleteNo"
        onClick={(e) => setOpenModal(false)}
      >
        NO
      </Button>
    </div>
  );
};
const ModalInnerGroup = ({ data }) => {
  return (
    <div className="modalInnerGroup">
      {data.map((d) => {
        return (
          <p key={d._id}>
            <span>{d.name}</span>
            <span>{d.ip}</span>
          </p>
        );
      })}
    </div>
  );
};

const Datatable = () => {
  const { user } = useContext(AuthContext);
  const { dispatchActionResult } = useContext(ActionResultMessageContext);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [notes, setNotes] = useState("");
  const [columns, setColumns] = useState([]);
  const [columnsGroup, setColumnsGroup] = useState([]);
  const [data, setData] = useState([]);
  const [dataGroup, setDataGroup] = useState([]);
  const [modalTitle, setModalTitle] = useState("Notes");
  const [checkedCollapse, setCheckedCollapse] = useState(false);
  const [checkedCollapseGroup, setCheckedCollapseGroup] = useState(false);
  const [selectionDestination, setSelectionDestination] = useState([]);
  const [selectionGroup, setSelectionGroup] = useState([]);
  const [checkForGroup, setCheckForGroup] = useState(false);
  const [destinationForEdit, setDestinationForEdit] = useState(null);
  const [groupForEdit, setGroupForEdit] = useState(null);

  const [valueTab, setValueTab] = useState(0);

  const [initDataForDestination] = useState({
    ip: "",
    name: "",
    notes: "",
  });

  axios.defaults.headers.common["x-access-token"] = user ? user.accessToken : null;

  useEffect(() => {
    setColumns(apiColumns);
    setColumnsGroup(groupColumns);
    let list = [];
    const fetchdata = async () => {
      try {
        // get destinations
        const resDest = await axios.get("/api/destination");
        resDest.data.forEach((doc) => list.push({ id: doc._id, ...doc, showDestination: false }));
        setData(list);
        //get groups
        await getGroup();
      } catch (err) {
        console.log(err);
      }
    };

    fetchdata();
    // return () => {
    //   socket.disconnect();
    // };
  }, []);
  useEffect(() => {
    if (checkedCollapseGroup) {
      setData((prev) =>
        prev.map((p) => {
          p.editingGroup = true;
          return p;
        }),
      );
    } else {
      setData((prev) =>
        prev.map((p) => {
          p.editingGroup = false;
          return p;
        }),
      );
    }
  }, [checkedCollapseGroup]);

  async function getGroup() {
    let list = [];
    const resGroup = await axios.get("/api/group");
    resGroup.data.forEach((doc) => list.push({ id: doc._id, ...doc }));
    setDataGroup(list);
  }

  const handleSHowDistination = (e, row) => {
    e.preventDefault();
    // const item = data.find((r) => r._id === row._id);
    // item.showDestination = !item.showDestination;
    setData((prev) =>
      prev.map((d) => {
        if (d._id === row._id) {
          d.showDestination = !d.showDestination;
        }
        return d;
      }),
    );
  };

  const handleChangeTab = (event, newValue) => {
    setValueTab(newValue);
  };

  const handleChangeCollapse = () => {
    setCheckedCollapse((prev) => !prev);
    if (!checkedCollapse) {
      setCheckedCollapseGroup(false);
    }
  };
  const handleChangeCollapseGroup = () => {
    setCheckedCollapseGroup((prev) => !prev);
    if (!checkedCollapseGroup) {
      setCheckedCollapse(false);
    }
  };

  const handleEditDistination = (id) => {
    const destination = data.find((item) => item.id === id);
    setDestinationForEdit({ ...destination });
    setCheckedCollapse(true);
    setCheckedCollapseGroup(false);
    setTimeout(() => {
      document.getElementById("tabs-header")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };
  const cancelUpdate = () => {
    setDestinationForEdit(null);
    setCheckedCollapse(false);
    setCheckedCollapseGroup(false);
  };
  const handleEditGroup = (id) => {
    setValueTab(0);
    const group = dataGroup.find((item) => item.id === id);
    //console.log(group);
    setGroupForEdit({ ...group });
    setCheckedCollapse(false);
    setCheckedCollapseGroup(true);
    setTimeout(() => {
      document.getElementById("tabs-header")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    const selectedDist = group.destinations.map((d) => d._id);
    setSelectionDestination(selectedDist);
  };
  const cancelUpdateGroup = () => {
    if (groupForEdit && groupForEdit._id) {
      setValueTab(1);
    }
    setGroupForEdit(null);
    setCheckedCollapse(false);
    setCheckedCollapseGroup(false);
    setSelectionDestination([]);
  };

  const handleOpenModal = (data, action, type) => {
    if (action) {
      setModalTitle("Delete?");
      setNotes(ModalInner({ handleDelete, setOpenModal, id: data, type }));
    } else {
      if (typeof data === "string") {
        setModalTitle("Notes");
        setNotes(data);
      } else {
        if (data && data.length) {
          setModalTitle("Destinations");
          setNotes(ModalInnerGroup({ data }));
        }
      }
    }

    setOpenModal(true);
  };
  const handleCloseModal = () => setOpenModal(false);

  const handleDeleteDestinations = (e) => {
    e.preventDefault();
    setModalTitle("Delete?");
    setNotes(
      ModalInner({
        handleDelete,
        setOpenModal,
        id: "deleteMany",
        type: "destination",
      }),
    );
    setOpenModal(true);
  };
  const handleDeleteGroups = (e) => {
    e.preventDefault();
    setModalTitle("Delete?");
    setNotes(
      ModalInner({
        handleDelete,
        setOpenModal,
        id: "deleteMany",
        type: "group",
      }),
    );
    setOpenModal(true);
  };

  const handleDelete = async (id, type) => {
    try {
      if (id === "deleteMany") {
        console.log(selectionDestination, type);

        if (type && type === "group") {
          await axios.delete(`/api/group/`, {
            data: {
              ids: selectionGroup,
            },
          });
          setDataGroup(dataGroup.filter((item) => selectionGroup.indexOf(item.id) < 0));
        } else if (type && type === "destination") {
          await axios.delete(`/api/destination`, {
            data: {
              ids: selectionDestination,
            },
          });
          setData(data.filter((item) => selectionDestination.indexOf(item.id) < 0));
          getGroup();
        }
      } else {
        if (type && type === "group") {
          await axios.delete(`/api/group/${id}`);
          setDataGroup(dataGroup.filter((item) => item.id !== id));
        } else {
          await axios.delete(`/api/destination/${id}`);
          setData(data.filter((item) => item.id !== id));
          getGroup();
        }
      }
      setCheckForGroup(true);
      setTimeout(() => {
        setCheckForGroup(false);
      }, 3000);
      dispatchActionResult({ type: "CN_SUCCESS" });
      setTimeout(() => {
        dispatchActionResult({ type: "CN_CLEAR" });
      }, 5000);
    } catch (err) {
      dispatchActionResult({ type: "CN_ERROR" });
      setTimeout(() => {
        dispatchActionResult({ type: "CN_CLEAR" });
      }, 5000);
      console.log("Error deleting:", err);
      let errorMessage =
        err && err.response && err.response.data ? err.response.data.message : err ? err : "Error";
      setError(errorMessage);
      setTimeout(() => {
        setError("");
      }, 7000);
    }
  };

  const addDestination = async (newDestination) => {
    try {
      if (!newDestination._id) {
        const res = await axios.post("/api/destination", newDestination);
        const newItem = { id: res.data._id, ...res.data };
        setData((prev) => [...prev, newItem]);
      } else {
        const res = await axios.put(`/api/destination/${newDestination._id}`, newDestination);
        const objectToReplace = data.find((item) => item._id === newDestination._id);
        Object.assign(objectToReplace, newDestination);

        setData([...data]);
        setDestinationForEdit(null);
        setCheckedCollapse(false);
      }

      setCheckForGroup(true);
      setTimeout(() => {
        setCheckForGroup(false);
      }, 3000);
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
        err && err.response && err.response.data ? err.response.data.message : err ? err : "Error";
      setError(errorMessage);
      setTimeout(() => {
        setError("");
      }, 7000);
    }
  };
  const addGroup = async (newGroup) => {
    newGroup.destinations = selectionDestination;
    try {
      if (!newGroup._id) {
        const res = await axios.post("/api/group", newGroup);
        const resGroup = await axios.get(`/api/group/${res.data._id}`);

        if (resGroup && resGroup.data) {
          resGroup.data.id = resGroup.data._id;
          setDataGroup((prev) => [...prev, resGroup.data]);
        }
      } else {
        const res = await axios.put(`/api/group/${newGroup._id}`, newGroup);
        const resGroup = await axios.get(`/api/group/${newGroup._id}`);
        const objectToReplace = dataGroup.find((item) => item._id === newGroup._id);

        Object.assign(objectToReplace, resGroup.data);

        setDataGroup([...dataGroup]);
        setGroupForEdit(null);
      }
      setCheckForGroup(true);
      setCheckedCollapseGroup(false);
      setTimeout(() => {
        setCheckForGroup(false);
      }, 3000);
      setSelectionDestination([]);
      setValueTab(1);

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
        err && err.response && err.response.data ? err.response.data.message : err ? err : "Error";
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
      width: 250,

      renderCell: (params) => {
        return (
          <div className="cellAction">
            <FmdGoodOutlined
              className="icon"
              onClick={(e) => {
                handleSHowDistination(e, params.row);
              }}
            />
            {params.row.notes && (
              <StickyNote2Outlined
                className="icon"
                onClick={(e) => handleOpenModal(params.row.notes)}
              />
            )}

            <a
              rel="noreferrer"
              href={params.row.ip}
              style={{ textDecoration: "none" }}
              target="_blank"
            >
              <VisibilityOutlined className="icon" />
            </a>
            <a
              rel="noreferrer"
              href={params.row.ip + "/control"}
              style={{ textDecoration: "none" }}
              target="_blank"
            >
              <FormatListBulleted className="icon" />
            </a>

            {!params.row.editingGroup && (
              <ModeEditOutlined
                onClick={(e) => handleEditDistination(params.row.id)}
                className="icon"
                style={{ color: "green" }}
              />
            )}
            {!params.row.editingGroup && (
              <DeleteOutlineOutlined
                onClick={(e) => handleOpenModal(params.row.id, true)}
                className="icon"
                style={{ color: "red" }}
              />
            )}
          </div>
        );
      },
    },
  ];
  const actionColumnGroup = [
    {
      field: "action",
      headerName: "Action",
      width: 200,

      renderCell: (params) => {
        return (
          <div className="cellAction">
            {params.row.notes && (
              <StickyNote2Outlined
                className="icon"
                onClick={(e) => handleOpenModal(params.row.notes)}
              />
            )}

            <div className="wrapForBadge">
              <VisibilityOutlined
                className="icon"
                onClick={(e) => handleOpenModal(params.row.destinations)}
              ></VisibilityOutlined>
              {params.row.destinations.length && (
                <div className="counter">
                  <span>{params.row.destinations.length}</span>
                </div>
              )}
            </div>
            <ModeEditOutlined
              onClick={(e) => handleEditGroup(params.row.id)}
              className="icon"
              style={{ color: "green" }}
            />
            <DeleteOutlineOutlined
              className="icon"
              onClick={(e) => handleOpenModal(params.row.id, true, "group")}
              style={{ color: "red" }}
            />
          </div>
        );
      },
    },
  ];
  return (
    <>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {modalTitle}
          </Typography>
          <div id="modal-modal-description">{notes}</div>
        </Box>
      </Modal>
      <div className="uploadFileContainer">
        <UploadFile
          selectionDestination={selectionDestination}
          selectionGroup={selectionGroup}
          data={data}
          dataGroup={dataGroup}
          setSelectionDestination={setSelectionDestination}
          setSelectionGroup={setSelectionGroup}
          disabledElement={checkedCollapse || checkedCollapseGroup}
          hideListDestinations={checkedCollapseGroup}
        />
      </div>

      <Box sx={{ width: "100%" }} id="tabs-header">
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={valueTab} onChange={handleChangeTab} aria-label="main tabs">
            <Tab
              label="Destinations"
              {...a11yProps(0)}
              disabled={checkedCollapse || checkedCollapseGroup}
            />
            <Tab
              label="Groups"
              {...a11yProps(1)}
              disabled={checkedCollapse || checkedCollapseGroup}
            />
          </Tabs>
        </Box>
        <TabPanel value={valueTab} index={0}>
          <ThemeProvider theme={theme}>
            <div className="newAndDeleteButton">
              <div className="addButtonGroup">
                {!groupForEdit && (
                  <div>
                    <Button
                      className="buttonGroupForNewItem"
                      id="edit-desination"
                      disabled={!!destinationForEdit}
                      variant={checkedCollapse ? "contained" : "outlined"}
                      onClick={handleChangeCollapse}
                    >
                      {!destinationForEdit ? "New destination" : "Destination Editing"}
                    </Button>
                  </div>
                )}

                {!destinationForEdit && (
                  <div>
                    <Button
                      className="buttonGroupForNewItem"
                      disabled={!!groupForEdit}
                      variant={checkedCollapseGroup ? "contained" : "outlined"}
                      onClick={handleChangeCollapseGroup}
                    >
                      {!groupForEdit ? "New Group" : "Group Editing"}
                    </Button>
                  </div>
                )}
              </div>
              <div className="deleteButtonGroup">
                {!checkedCollapseGroup && !!selectionDestination.length && (
                  <Button
                    className="buttonGroupForDelete"
                    variant="outlined"
                    onClick={handleDeleteDestinations}
                    color="error"
                  >
                    Delete Destinations
                  </Button>
                )}
              </div>
            </div>
          </ThemeProvider>

          <Collapse in={checkedCollapse}>
            <AddIP
              addDestination={addDestination}
              destinationForEdit={destinationForEdit ? destinationForEdit : initDataForDestination}
              cancelUpdate={cancelUpdate}
              allDestinations={data}
            />
          </Collapse>
          <Collapse in={checkedCollapseGroup}>
            <AddGroup
              addGroup={addGroup}
              selectionDestination={selectionDestination}
              groupForEdit={groupForEdit ? groupForEdit : { notes: "", name: "" }}
              cancelUpdateGroup={cancelUpdateGroup}
              allGroups={dataGroup}
            />
          </Collapse>

          {error && (
            <Typography component="p" color="red">
              {error}
            </Typography>
          )}

          <div className="datatable">
            <DataGrid
              className="datagrid"
              rows={data}
              columns={columns.concat(actionColumn)}
              pageSize={100}
              rowsPerPageOptions={[100]}
              checkboxSelection
              disableSelectionOnClick
              onSelectionModelChange={(newSelection) => {
                setSelectionDestination(newSelection);
              }}
              selectionModel={selectionDestination}
              autoHeight={true}
              hideFooter={true}
              hideFooterPagination={true}
            />
          </div>
        </TabPanel>
        <TabPanel value={valueTab} index={1}>
          <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
            <Button
              onClick={handleDeleteGroups}
              color="error"
              variant="outlined"
              //variant={!!selectionGroup.length ? "outlined" : "contained"}
              disabled={!selectionGroup.length}
            >
              Delete Groups
            </Button>
          </Stack>
          {error && (
            <Typography component="p" color="red">
              {error}
            </Typography>
          )}

          <div className="datatable">
            <DataGrid
              className="datagrid"
              rows={dataGroup}
              columns={columnsGroup.concat(actionColumnGroup)}
              pageSize={100}
              rowsPerPageOptions={[100]}
              checkboxSelection
              disableSelectionOnClick
              onSelectionModelChange={(newSelection) => {
                setSelectionGroup(newSelection);
              }}
              selectionModel={selectionGroup}
              autoHeight={true}
              hideFooter={true}
              hideFooterPagination={true}
            />
          </div>
        </TabPanel>
      </Box>
    </>
  );
};

export default Datatable;
