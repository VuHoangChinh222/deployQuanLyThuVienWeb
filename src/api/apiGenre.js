import axiosInstance from "./axios";

const apiGenre = {
  getAll: () => {
    return axiosInstance
      .get(
        "/the-loais?sort[0]=createdAt:desc&pagination[pageSize]=100000000000000000000000&populate=*"
      )
      .then((res) => res.data);
  },
  getBySts: (sts) => {
    return axiosInstance
      .get(
        `/the-loais?sort[0]=createdAt:desc&filters[sts][$eq]=${sts}&pagination[page]=1&pagination[pageSize]=1000000000&populate=*`
      )
      .then((res) => res.data);
  },
  createGenre: (data) => {
    return axiosInstance.post("/the-loais", data);
  },
  updateGenre: (documentId, data) => {
    return axiosInstance.put(`/the-loais/${documentId}`, data);
  },
  delGenreById: (documentId) => {
    return axiosInstance.delete(`/the-loais/${documentId}`);
  },
  //chi tiết nha xuat ban
  getDetailGenreById: (documentId) => {
    return axiosInstance.get(`the-loais/${documentId}`).then((res) => res.data);
  },
  getGenrePagination: (page, limit) => {
    return axiosInstance
      .get(
        `/the-loais?sort[0]=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${limit}&populate=*`
      )
      .then((res) => res.data);
  },
  getGenreById: (id) => {
    return axiosInstance
      .get(
        `/the-loais?sort[0]=createdAt:desc&filters[documentId][$eq]=${id}&populate=*`
      )
      .then((res) => res.data);
  },
};
export default apiGenre;
