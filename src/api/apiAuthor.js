import axiosInstance from "./axios";

const apiAuthor = {
  getAll: () => {
    return axiosInstance
      .get(
        "/tac-gias?sort[0]=createdAt:desc&pagination[pageSize]=10000000000000000&populate=*"
      )
      .then((res) => res.data);
  },
  getBySts: (sts) => {
    return axiosInstance
      .get(
        `/tac-gias?sort[0]=createdAt:desc&filters[sts][$eq]=${sts}&pagination[page]=1&pagination[pageSize]=10000000000&populate=*`
      )
      .then((res) => res.data);
  },
  createAuthor: (data) => {
    return axiosInstance.post("/tac-gias", data);
  },
  updateAuthor: (documentId, data) => {
    return axiosInstance.put(`/tac-gias/${documentId}`, data);
  },
  delAuthorById: (documentId) => {
    return axiosInstance.delete(`/tac-gias/${documentId}`);
  },
  //chi tiết nha xuat ban
  getDetailAuthorById: (documentId) => {
    return axiosInstance.get(`tac-gias/${documentId}`).then((res) => res.data);
  },
  getAuthorPagination: (page, limit) => {
    return axiosInstance
      .get(
        `/tac-gias?sort[0]=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${limit}&populate=*`
      )
      .then((res) => res.data);
  },
};
export default apiAuthor;
