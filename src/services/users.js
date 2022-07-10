import axios from "axios";

const getAll = (params) => {
  return axios.get("/api/user", { params });
};
const deleteOne = (id) => {
  return axios.delete(`/api/user/${id}`);
};
const getOne = (id) => {
  return axios.get(`/api/user/${id}`);
};
const updateOne = (id, params) => {
  return axios.put(`/api/user/${id}`, params);
};
const createOne = (item) => {
  return axios.post("/api/user", item);
};
const forcelogin = (id) => {
  return axios.get(`/api/auth/forcelogin/${id}`);
};
// other CRUD methods
export default {
  getAll,
  deleteOne,
  createOne,
  updateOne,
  getOne,
  forcelogin,
};
