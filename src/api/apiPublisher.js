import axiosInstance from "./axios";

const apiPublisher = {
  getAll: () => {
    return axiosInstance
      .get(
        "/nhan-xuat-bans?sort[0]=createdAt:desc&pagination[pageSize]=100000000000000000&populate=*"
      )
      .then((res) => res.data);
  },
  getBySts: (sts) => {
    return axiosInstance
      .get(
        `/nhan-xuat-bans?sort[0]=createdAt:desc&filters[sts][$eq]=${sts}&pagination[page]=1&pagination[pageSize]=1000000000&populate=*`
      )
      .then((res) => res.data);
  },
  createPublisher: (data) => {
    return axiosInstance.post("/nhan-xuat-bans", data);
  },
  updatePublisher: (documentId, data) => {
    return axiosInstance.put(`/nhan-xuat-bans/${documentId}`, data);
  },
  delPublisherById: (documentId) => {
    return axiosInstance.delete(`/nhan-xuat-bans/${documentId}`);
  },
  //chi tiết nha xuat ban
  getDetailPublisherById: (documentId) => {
    return axiosInstance
      .get(`nhan-xuat-bans/${documentId}`)
      .then((res) => res.data);
  },
  getPublisherPagination: (page, limit) => {
    return axiosInstance
      .get(
        `/nhan-xuat-bans?sort[0]=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${limit}&populate=*`
      )
      .then((res) => res.data);
  },
};
export default apiPublisher;
