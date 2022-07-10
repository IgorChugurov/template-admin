import Navbar from "../../components/navbar/Navbar";
import "./logs.scss";
import { AuthContext } from "../../context/AuthContext";
import { ActionResultMessageContext } from "../../context/actionResultMessageContext";
import axios from "axios";

import React, { useState, useEffect, useContext } from "react";

import Log from "../../components/log/Log";
import logService from "../../services/logs";

import {
  Button,
  FormControl,
  InputAdornment,
  MenuItem,
  Pagination,
  Select,
  TextField,
  Box,
} from "@mui/material";

import { Search } from "@mui/icons-material";

import ModalForDelete from "../../components/log/ModalForDelete";
import { useLocation } from "react-router-dom";
const Logs = () => {
  const location = useLocation();
  //console.log(location.pathname);
  const { user } = useContext(AuthContext);
  const { dispatchActionResult } = useContext(ActionResultMessageContext);

  const [openModal, setOpenModal] = useState(false);
  const [currentLog, setCurrentLog] = useState(null);

  const [items, setItems] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [showSearch, setShowSearch] = useState(true);

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  const pageSizes = [15, 25, 50, 100];

  // useEffect(() => {
  //   axios.defaults.headers.common["x-access-token"] = user
  //     ? user.accessToken
  //     : null;
  // }, [user]);

  const onChangeSearchTitle = (e) => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  };

  const getRequestParams = (searchTitle, page, pageSize) => {
    let params = {};

    if (searchTitle) {
      params["search"] = searchTitle;
    }

    if (page) {
      params["page"] = page;
    }

    if (pageSize) {
      params["perPage"] = pageSize;
    }
    if (location.pathname === "/alllogs" && user.role === "admin") {
      params.condition = { alllogs: true };
    }

    return params;
  };

  const retrieveItems = (e) => {
    if (e) {
      e.preventDefault();
    }

    const params = getRequestParams(searchTitle, page, pageSize);

    //axios
    //.get("/api/log", { params })
    logService
      .getAll({ ...params })
      .then((response) => {
        const { items, totalPages } = response.data;

        setItems(items);
        setCount(totalPages);
        if (!searchTitle && !items.length) {
          setShowSearch(false);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(retrieveItems, [page, pageSize]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(1);
  };
  const handleRemoveAll = () => {
    //console.log("handleRemoveAll");
    setCurrentLog(null);
    setOpenModal(true);
  };

  const handleDelete = (log) => {
    //console.log("handledelete", log);
    setCurrentLog(log);
    setOpenModal(true);
  };
  const deleteLogItem = async (log) => {
    //console.log("deleteLogItem", log);
    try {
      if (log) {
        await logService.deleteOne(log._id);
        setItems((prev) => prev.filter((item) => item._id !== log._id));
      } else {
        await logService.deleteMany();
        setCount(0);
        setItems([]);
      }

      dispatchActionResult({ type: "CN_SUCCESS" });
      setTimeout(() => {
        dispatchActionResult({ type: "CN_CLEAR" });
      }, 5000);
    } catch (e) {
      dispatchActionResult({ type: "CN_ERROR" });
      setTimeout(() => {
        dispatchActionResult({ type: "CN_CLEAR" });
      }, 5000);
      console.log(e);
    }
  };

  return (
    <>
      <ModalForDelete
        setOpenModal={setOpenModal}
        deleteLog={deleteLogItem}
        openModal={openModal}
        currentLog={currentLog}
      />
      <div className="logsPage">
        <div className="logsContainer">
          <Navbar />
          <div className="listContainer">
            <div className="logs">
              <div className="header-container">
                <h3 className="listTitle">List of Logs</h3>
                {!!count && location.pathname !== "/alllogs" && (
                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    className="deleteAll"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveAll();
                    }}
                  >
                    Remove All Logs
                  </Button>
                )}
              </div>

              <div className="logsTop">
                {(!!count || showSearch) && (
                  <div className="search-panel">
                    <Box component="form" noValidate autoComplete="off" onSubmit={retrieveItems}>
                      <TextField
                        id="standard-basic"
                        size="small"
                        label="Search file"
                        variant="standard"
                        value={searchTitle}
                        onChange={onChangeSearchTitle}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Search />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Box>
                  </div>
                )}

                {!!count && (
                  <div className="paginateBlock">
                    <div className="perPage">
                      <span>{"Items per Page: "}</span>
                      <FormControl variant="standard" className="select">
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={pageSize}
                          size="small"
                          //sx={{ width: 30 }}
                          label="pageSize"
                          onChange={handlePageSizeChange}
                        >
                          {pageSizes.map((size) => (
                            <MenuItem key={size} value={size}>
                              {size}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>

                    <Pagination
                      className="my-3"
                      size="small"
                      count={count}
                      page={page}
                      siblingCount={1}
                      boundaryCount={1}
                      variant="outlined"
                      shape="rounded"
                      onChange={handlePageChange}
                    />
                  </div>
                )}
              </div>

              {!count && (
                <div className="logsTop" style={{ textAlign: "center" }}>
                  {" "}
                  List is empty
                </div>
              )}

              <div className="list-group">
                {items &&
                  items.map((item, index) => (
                    <Log
                      data={item}
                      key={index}
                      index={index}
                      handleDelete={handleDelete}
                      user={user}
                    />
                  ))}
              </div>

              {/* <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={removeAllItems}
            >
              Remove All
            </Button> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Logs;
