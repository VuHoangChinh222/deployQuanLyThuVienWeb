import axiosInstance from "./axios";

const apiBookLoan = {
  getAll: () => {
    return axiosInstance
      .get("/phieu-muons?pagination[pageSize]=100000000000000000000&populate=*")
      .then((res) => res.data);
  },
  createBookLoan: (data) => {
    return axiosInstance.post("/phieu-muons", data);
  },
  updateBookLoan: (id, data) => {
    return axiosInstance.put(`/phieu-muons/${id}`, data);
  },
  delBookLoanById: (id) => {
    return axiosInstance.delete(`/phieu-muons/${id}`);
  },
  delBookLoanDetailById: (id) => {
    return axiosInstance.delete(`/chi-tiet-phieu-muons/${id}`);
  },
  getBookLoanBySts: (sts) => {
    return axiosInstance
      .get(
        `phieu-muons?filters[sts][$eq]=${sts}&sort[0]=createdAt:desc&pagination[page]=1&pagination[pageSize]=1000000000&populate=*`
      )
      .then((res) => res.data);
  },
  getBookLoanById: (id) => {
    return axiosInstance
      .get(`phieu-muons?filters[documentId][$eq]=${id}&populate=*`)
      .then((res) => res.data);
  },
  getDetailBookLoanById: (id) => {
    return axiosInstance
      .get(
        `chi-tiet-phieu-muons?filters[phieu_muon_documentId][$eq]=${id}&populate=*`
      )
      .then((res) => res.data);
  },
  getCurrentBookLoanDocumentId: (nhanVienDocumentId, docGiaDocumentId) => {
    return axiosInstance
      .get(
        `phieu-muons?sort[0]=createdAt:desc&filters[nhan_vien_documentId][$eq]=${nhanVienDocumentId}&filters[mssv][$eq]=${docGiaDocumentId}&populate=*`
      )
      .then((res) => res.data);
  },

  getBookLoanPagination: (page, limit) => {
    return axiosInstance
      .get(
        `/phieu-muons?sort[0]=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${limit}&populate=*`
      )
      .then((res) => res.data);
  },

  getBookLoanByMssv: (mssv) => {
    return axiosInstance.get(
      `/phieu-muons?sort[0][createdAt]=desc&filters[mssv]=${mssv}&pagination[pageSize]=10000000000&populate=*`
    );
  },

  //Chi tiet phieu muon
  createBookLoanDetail: (data) => {
    return axiosInstance.post("/chi-tiet-phieu-muons", data);
  },
  getBookLoanDetailByDocumentId: (documentId) => {
    return axiosInstance
      .get(
        `/chi-tiet-phieu-muons?filters[phieu_muon_documentId][$eq]=${documentId}&populate=*`
      )
      .then((res) => res.data);
  },
  getAllBookLoanDetail: () => {
    return axiosInstance
      .get(
        `/chi-tiet-phieu-muons?pagination[pageSize]=100000000000000000&sort[0]=createdAt:desc&populate=*`
      )
      .then((res) => res.data);
  },
  getAllBookLoanDetailNoSort: () => {
    return axiosInstance
      .get(
        `/chi-tiet-phieu-muons?pagination[pageSize]=100000000000000000&populate=*`
      )
      .then((res) => res.data);
  },
  delDetailBookLoanById: (id) => {
    return axiosInstance.delete(`/chi-tiet-phieu-muons/${id}`);
  },
};
export default apiBookLoan;
