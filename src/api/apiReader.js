import axiosInstance from "./axios";

const apiReader = {
  getAll: () => {
    return axiosInstance
      .get("/doc-gias?pagination[pageSize]=1000000000000000000&populate=*")
      .then((res) => res.data);
  },
  getBySts: (sts) => {
    return axiosInstance
      .get(
        `/doc-gias?filters[sts][$eq]=${sts}&pagination[pageSize]=1000000000000000000&populate=*`
      )
      .then((res) => res.data);
  },
  getReaderPagination: (page, limit) => {
    return axiosInstance
      .get(
        `/doc-gias?sort[0]=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${limit}&populate=*`
      )
      .then((res) => res.data);
  },
  delReaderById: (id) => {
    return axiosInstance.delete(`/doc-gias/${id}`);
  },
  getDetailReaderById: (id) => {
    return axiosInstance
      .get(`doc-gias?filters[id][$eq]=${id}&populate=*`)
      .then((res) => res.data);
  },
  getDetailReaderByMSSV: (mssv) => {
    return axiosInstance
      .get(`doc-gias?filters[mssv][$eq]=${mssv}&filters[sts][$eq]=1&populate=*`)
      .then((res) => res.data);
  },
};
export default apiReader;
