import axiosInstance from "./axios";

const apiBook = {
  getAll: () => {
    return axiosInstance
      .get(
        "/saches?sort[0][createdAt]=desc&pagination[pageSize]=100000000000000000000&populate=*"
      )
      .then((res) => res.data);
  },
  createBook: (data) => {
    return axiosInstance.post("/saches", data);
  },
  updateBook: (id, data) => {
    return axiosInstance.put(`/saches/${id}`, data);
  },
  delBookById: (id) => {
    return axiosInstance.delete(`/saches/${id}`);
  },
  //chi tiết sản phẩm
  getDetailBookById: (id) => {
    return axiosInstance
      .get(`saches?filters[documentId][$eq]=${id}&populate=*`)
      .then((res) => res.data);
  },
  getBookById: (id) => {
    return axiosInstance.get(`saches/${id}`);
  },
  getBookPagination: (page, limit) => {
    return axiosInstance
      .get(
        `/saches?sort[0]=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${limit}&populate=*`
      )
      .then((res) => res.data);
  },
  searchBookPagination: (data, page, limit) => {
    return axiosInstance
      .get(
        `/saches?sort[0]=createdAt:desc&filters[sach_name][$containsi]=${data}&pagination[page]=${page}&pagination[pageSize]=${limit}&populate=*`
      )
      .then((res) => res.data);
  },
  getNew: () => {
    return axiosInstance
      .get("/saches?sort[0]=createdAt:desc&pagination[pageSize]=5&populate=*")
      .then((res) => res.data);
  },
  getAllBookByDateFromAndDateTo: (dateFrom, dateTo) => {
    return axiosInstance
      .get(
        `/saches?sort[0]=createdAt:desc&filters[$and][0][createdAt][$gte]=${dateFrom}&filters[$and][1][createdAt][$lte]=${dateTo}&pagination[pageSize]=10000000000&populate=*`
      )
      .then((res) => res.data);
  },
};
export default apiBook;
