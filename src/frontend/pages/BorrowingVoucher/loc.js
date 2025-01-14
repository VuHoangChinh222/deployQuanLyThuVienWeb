import { useEffect, useState } from "react";
import apiBookLoan from "../../../api/apiBookLoan";
import { Link, useParams } from "react-router-dom";

function Loc() {
  const { mssv } = useParams();
  const [phieumuons, setPhieumuons] = useState([]);
  const [sts, setSts] = useState(1);
  const [delBookLoanItem, setDelBookLoanItem] = useState(false);

  useEffect(() => {
    apiBookLoan.getBookLoanByMssv(mssv).then((res) => {
      console.log(res.data.data);
      try {
        const bookData = res.data.data.map((book) => ({
          id: book.id,
          documentId: book.documentId,
          mssv: book.mssv,
          date_out: book.date_out,
          date_entry: book.date_entry,
          nhan_vien_name: book.nhan_vien_name,
          nhan_vien_documentId: book.nhan_vien_documentId,
          sts: book.sts,
        }));

        setPhieumuons(bookData);
        console.log(bookData);
      } catch (err) {
        console.log("Error: ", err);
      }
    });
  }, [sts, delBookLoanItem]);

  const delBookLoan = async (id) => {
    apiBookLoan.delBookLoanById(id).then((res) => {
      try {
        alert("Xóa phiếu mượn thành công");
        setDelBookLoanItem(id);
      } catch (e) {
        console.log(e);
      }
    });
  };

  const changeStatus = async (id) => {
    try {
      const data = {
        sts: "0",
      };
      apiBookLoan.updateBookLoan(id, { data: data });
      setSts(id);
    } catch (err) {
      console.error("Lỗi khi thay đổi status:", err);
    }
  };

  const isOverdue = (dateOut) => {
    const currentDate = new Date();
    const outDate = new Date(dateOut);
    if (outDate <= currentDate) {
      return false;
    } else {
      return true;
    }
  };

  return (
    <div>
      <Link to="/QuanLyMuonTraSach/1">
        <i className="fas fa-arrow-left iconspacing"></i>
        <button className="btn-trove">Quay lại</button>
      </Link>
      <h3>
        <strong>Phiếu mượn của sinh viên</strong>
      </h3>
      <hr />
      <div className="card">
        <table className="table">
          <thead className="table-title">
            <tr className="text-qlms">
              <th>Số phiếu</th>
              <th>Mã độc giả</th>
              <th>Tên nhân viên</th>
              <th>Ngày mượn</th>
              <th>Ngày hẹn trả</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {phieumuons.map((data, index) => (
              <tr key={index} className="text-center">
                <td>{data.id}</td>
                <td>{data.mssv}</td>
                <td>{data.nhan_vien_name}</td>
                <td>{data.date_entry}</td>
                <td>{data.date_out}</td>
                {parseInt(data.sts) === 1 ? (
                  <td>Đang mượn</td>
                ) : parseInt(data.sts) === 0 ? (
                  <td>Đã trả</td>
                ) : (
                  <td>Quá hạn</td>
                )}
                <td>
                  {isOverdue(data.date_out) === true ? (
                    parseInt(data.sts) === 1 ? (
                      <button
                        className="btn btn-primary shadow-0 me-1"
                        onClick={() => changeStatus(data.documentId)}
                      >
                        <i className="fas fa-solid fa-eye"></i>
                      </button>
                    ) : (
                      <button
                        className="btn btn-success shadow-0 me-1"
                        disabled
                      >
                        <i className="fas fa-solid fa-eye"></i>
                      </button>
                    )
                  ) : (
                    <button
                      className="btn btn-danger shadow-0 me-1"
                      onClick={() => changeStatus(data.documentId)}
                    >
                      <i className="fas fa-solid fa-eye-slash"></i>
                    </button>
                  )}
                  <Link to={`/QuanLyMuonTraSach/ChiTiet/${data.documentId}`}>
                    <button
                      style={{ width: "20%" }}
                      className="btn btn-primary shadow-0 me-1"
                    >
                      <i className="fas fa-solid fa-info"></i>
                    </button>
                  </Link>

                  {parseInt(data.sts) === 1 ? (
                    <button className="btn btn-primary shadow-0 me-1" disabled>
                      <Link style={{ color: "white", marginRight: "-0.5em" }}>
                        <i className="fas fa-trash iconspacing"></i>
                      </Link>
                    </button>
                  ) : (
                    <button className="btn btn-primary shadow-0 me-1">
                      <Link
                        style={{ color: "white", marginRight: "-0.5em" }}
                        onClick={(e) => delBookLoan(data.documentId)}
                      >
                        <i className="fas fa-trash iconspacing"></i>
                      </Link>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default Loc;
