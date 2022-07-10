import axios from "axios";

const getAll = (params) => {
  return axios.get("/api/log", { params });
};
const deleteOne = (id) => {
  return axios.delete(`/api/log/${id}`);
};
const deleteMany = () => {
  return axios.delete(`/api/log`);
};
// other CRUD methods
export default {
  getAll,
  deleteOne,
  deleteMany,
};
