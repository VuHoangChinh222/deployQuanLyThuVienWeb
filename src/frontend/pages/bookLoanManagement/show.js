import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import apiBookLoan from "../../../api/apiBookLoan";
import "bootstrap/dist/css/bootstrap.min.css";

function ShowBookLoanManagement() {
  const [borrowingVouchers, setborrowingVouchers] = useState([]);
  const [delBookLoanItem, setDelBookLoanItem] = useState(false);
  const [detailData, setDetailData] = useState([]);
  const [pages, setPages] = useState(1);
  const page = parseInt(useParams().page);
  const limit = 15;

  useEffect(() => {
    apiBookLoan.getBookLoanPagination(page, limit).then((res) => {
      try {
        const numberOfPages = Math.ceil(
          res.meta.pagination.total / res.meta.pagination.pageSize
        );
        setPages(numberOfPages);
        const borrowData = res.data.map((borrow) => {
          return {
            id: borrow.id,
            documentId: borrow.documentId,
            date_out: borrow.date_out,
            date_entry: borrow.date_entry,
            nhan_vien_name: borrow.nhan_vien_name,
            nhan_vien_documentId: borrow.nhan_vien_documentId,
            mssv: borrow.mssv,
            sts: borrow.sts,
          };
        });
        setborrowingVouchers(borrowData);
      } catch (err) {
        console.log("Error: ", err);
      }
    });
  }, [page, delBookLoanItem]);

  const delBookLoan = async (id) => {
    try {
      const res = await apiBookLoan.getDetailBookLoanById(id).then((data) => {
        const detailData1 = data.data.map((data1) => {
          return {
            documentId: data1.documentId,
          };
        });
        setDetailData(detailData1);
      });
      for (let i = 0; i <= detailData.length; i++) {
        await apiBookLoan.delDetailBookLoanById(detailData[i]);
      }
      await apiBookLoan.delBookLoanById(id);
      alert("Xóa phiếu mượn và chi tiết phiếu mượn thành công");
      setDelBookLoanItem(id);
    } catch (e) {
      console.error("Lỗi khi xóa phiếu mượn:", e);
      alert("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  const changeStatus = async (id, sts) => {
    try {
      const data = {
        sts: sts,
      };
      apiBookLoan.updateBookLoan(id, { data: data });
      setborrowingVouchers((prev) =>
        prev.map((voucher) =>
          voucher.documentId === id ? { ...voucher, sts } : voucher
        )
      );
    } catch (err) {
      console.error("Lỗi khi thay đổi status:", err);
    }
  };

  // Kiểm tra quá hạn
  useEffect(() => {
    const checkOverdue = async () => {
      for (const data of borrowingVouchers) {
        const currentDate = new Date();
        const outDate = new Date(data.date_out);

        if (outDate < currentDate && parseInt(data.sts) === 1) {
          // Gọi hàm thay đổi trạng thái nếu quá hạn
          await changeStatus(data.documentId, "2");
        }
      }
    };
    checkOverdue();
  }, [borrowingVouchers, delBookLoanItem, page]); // Chạy lại khi borrowingVouchers thay đổi

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">
        <strong>Quản lý mượn trả sách</strong>
      </h3>
      <hr />
      <div className="card shadow-sm">
        <table className="table table-hover table-bordered">
          <thead className="table-dark">
            <tr className="text-center">
              <th>Số phiếu</th>
              <th>Mã phiếu</th>
              <th>Mã độc giả</th>
              <th>Tên nhân viên</th>
              <th>Ngày mượn</th>
              <th>Ngày hẹn trả</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {borrowingVouchers.map((data, index) => (
              <tr key={index} className="text-center align-middle">
                <td>{data.id}</td>
                <td>{data.documentId}</td>
                <td>{data.mssv}</td>
                <td>{data.nhan_vien_name}</td>
                <td>{data.date_entry}</td>
                <td>{data.date_out}</td>
                <td>
                  {parseInt(data.sts) === 1
                    ? "Đang mượn"
                    : parseInt(data.sts) === 0
                    ? "Đã trả"
                    : "Quá hạn"}
                </td>
                <td>
                  <div className="d-flex justify-content-center">
                    {parseInt(data.sts) === 1 ? (
                      <button
                        className="btn btn-primary btn-sm me-2"
                        onClick={() => changeStatus(data.documentId, "0")}
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                    ) : data.sts === "0" ? (
                      <button className="btn btn-success btn-sm me-2">
                        <i className="fas fa-eye"></i>
                      </button>
                    ) : (
                      <button
                        className="btn btn-danger btn-sm me-2"
                        onClick={() => changeStatus(data.documentId, "0")}
                        disabled
                      >
                        <i className="fas fa-eye-slash"></i>
                      </button>
                    )}

                    <Link to={`/QuanLyMuonTraSach/ChiTiet/${data.documentId}`}>
                      <button className="btn btn-info btn-sm me-2">
                        <i className="fas fa-info-circle"></i>
                      </button>
                    </Link>
                    <Link
                      to={`/QuanLyMuonTraSach/Sua/${data.documentId}`}
                      className="btn btn-warning btn-sm me-2"
                      title="Sửa"
                    >
                      <i className="fas fa-edit"></i>
                    </Link>
                    {parseInt(data.sts) === 1 || parseInt(data.sts) === 2 ? (
                      <button className="btn btn-secondary btn-sm" disabled>
                        <i className="fas fa-trash"></i>
                      </button>
                    ) : (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => delBookLoan(data.documentId)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-center mt-4">
        <ul className="pagination">
          <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
            <Link className="page-link" to={`/QuanLyMuonTraSach/${page - 1}`}>
              Trang trước
            </Link>
          </li>
          {Array.from({ length: pages }, (_, index) => (
            <li
              key={index}
              className={`page-item ${index + 1 === page ? "active" : ""}`}
            >
              <Link
                className="page-link"
                to={`/QuanLyMuonTraSach/${index + 1}`}
              >
                {index + 1}
              </Link>
            </li>
          ))}
          <li className={`page-item ${page === pages ? "disabled" : ""}`}>
            <Link className="page-link" to={`/QuanLyMuonTraSach/${page + 1}`}>
              Trang sau
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default ShowBookLoanManagement;
