import { useEffect, useState } from "react";
import apiBookLoan from "../../../api/apiBookLoan";
import { Link } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";

function EditBookManagement() {
  const { id } = useParams();
  const [documentId, setDocumentId] = useState("");
  const [sts, setSts] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    apiBookLoan.getBookLoanById(id).then((res) => {
      try {
        const bl = res.data[0];
        setDocumentId(bl.documentId);
        setSts(bl.sts);
      } catch (e) {
        console.log(e);
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      sts: sts,
    };
    try {
      const uploadRes = await apiBookLoan.updateBookLoan(id, { data: data });
      alert("Cập nhật thành công.");
      navigate("/QuanLyMuonTraSach/1");
    } catch (err) {
      console.error("Error:", err);
      alert("Cập nhật thất bại.");
      return;
    }
  };

  return (
    <div>
      <h3>
        <strong>Sửa thông tin phiếu mượn</strong>
      </h3>
      <div className="form-container">
        <form className="styled-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label for="documentId">Mã phiếu mượn</label>
            <input
              type="text"
              id="documentId"
              name="documentId"
              value={documentId}
              disable
            />
          </div>
          <div className="form-group">
            <label htmlFor="from-year">Trạng thái:</label>
            <select
              id="from-year"
              value={sts}
              onChange={(e) => setSts(e.target.value)}
            >
              <option value="0">Đã trả</option>
              <option value="1">Đang mượn</option>
              <option value="2">Quá hạn</option>
            </select>
          </div>
          <div className="form-actions">
            <Link to="/QuanLyMuonTraSach/1">
              <button className="btn btn-primary">Quay lại</button>
            </Link>
            <button type="submit" className="btn primary">
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default EditBookManagement;
