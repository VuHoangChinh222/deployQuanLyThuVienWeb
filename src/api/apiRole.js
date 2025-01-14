import axiosInstance from "./axios";

const apiRole = {
  getAll: () => {
    return axiosInstance.get("/vai-tros?populate=*").then((res) => res.data);
  },
};
export default apiRole;
