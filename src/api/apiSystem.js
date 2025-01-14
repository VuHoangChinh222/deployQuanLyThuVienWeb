import axiosInstance from "./axios";

const apiSystem = {
  getAll: () => {
    return axiosInstance.get("/tai-khoans?populate=*").then((res) => res.data);
  },
  delSystemById: (id) => {
    return axiosInstance.delete(`/tai-khoans/${id}`);
  },
  getDetailSystemById: (id) => {
    return axiosInstance
      .get(`tai-khoans?filters[id][$eq]=${id}&populate=*`)
      .then((res) => res.data);
  },
  createSystemAccount: (data) => {
    return axiosInstance.post("/tai-khoans", data);
  },
  updateSystemAccount: (id, data) => {
    return axiosInstance.put(`/tai-khoans/${id}`, data);
  },
  getSystemPagination: (page, limit) => {
    return axiosInstance
      .get(
        `/tai-khoans?sort[0]=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${limit}&populate=*`
      )
      .then((res) => res.data);
  },
};

export default apiSystem;
