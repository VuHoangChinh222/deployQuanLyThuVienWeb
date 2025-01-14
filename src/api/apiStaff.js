import axiosInstance from "./axios";

const apiStaff = {
  getAll: () => {
    return axiosInstance
      .get(
        "/nhan-viens?sort[0]=createdAt:desc&pagination[page]=1&pagination[pageSize]=1000000000&populate=*"
      )
      .then((res) => res.data);
  },
  getBySts: (sts) => {
    return axiosInstance
      .get(
        `/nhan-viens?sort[0]=createdAt:desc&filters[sts][$eq]=${sts}&pagination[page]=1&pagination[pageSize]=10000000000&populate=*`
      )
      .then((res) => res.data);
  },
  createAuthor: (data) => {
    return axiosInstance.post("/nhan-viens", data);
  },
  updateAuthor: (documentId, data) => {
    return axiosInstance.put(`/nhan-viens/${documentId}`, data);
  },
  delAuthorById: (documentId) => {
    return axiosInstance.delete(`/nhan-viens/${documentId}`);
  },
  //chi tiết nha xuat ban
  getDetailAuthorById: (documentId) => {
    return axiosInstance
      .get(`nhan-viens/${documentId}`)
      .then((res) => res.data);
  },
  getAuthorPagination: (page, limit) => {
    return axiosInstance
      .get(
        `/nhan-viens?sort[0]=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${limit}&populate=*`
      )
      .then((res) => res.data);
  },
};
export default apiStaff;
