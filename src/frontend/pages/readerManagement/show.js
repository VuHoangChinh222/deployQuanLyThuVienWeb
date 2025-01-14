import { useEffect, useState } from "react";
import apiReader from "../../../api/apiReader";
import { Link } from "react-router-dom";

function ShowReaderManagement() {
  const [reader, setReader] = useState([]);
  const [delReaderItem, setDelReaderItem] = useState(0);

  useEffect(() => {
    apiReader.getAll().then((res) => {
      try {
        const readerData = res.data.map((reader) => ({
          id: reader.id,
          documentationId: reader.documentId,
          name: reader.doc_gia_name,
          birthday: reader.birthday,
          gender: reader.gender,
          address: reader.address,
          phone: reader.phone,
          email: reader.email,
          mssv: reader.mssv,
        }));
        setReader(readerData);
      } catch (err) {
        console.log("Error: ", err);
      }
    });
  }, [delReaderItem]);

  const delReader = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa độc giả này?")) {
      apiReader.delReaderById(id).then((res) => {
        try {
          alert("Xóa độc giả thành công");
          setDelReaderItem(id);
        } catch (e) {
          console.log(e);
        }
      });
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold">Quản lý độc giả</h3>
        <Link to="/QuanLyDocGia/Them" className="btn btn-primary">
          <i className="fas fa-plus me-2"></i> Thêm độc giả
        </Link>
      </div>
      <div className="card p-4 shadow-sm">
        <div className="row mb-3">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              id="searchInput"
              placeholder="Tìm kiếm theo tên, email,...."
            />
          </div>
          <div className="col-md-6 text-end">
            <button className="btn btn-primary">
              <i className="fas fa-search"></i> Tìm kiếm
            </button>
          </div>
        </div>

        <div className="card">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Mã độc giả</th>
                <th>Mã sinh viên</th>
                <th>Tên độc giả</th>
                <th>Giới tính</th>
                <th>Ngày sinh</th>
                <th>Địa chỉ</th>
                <th>Số điện thoại</th>
                <th>Email</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {reader.map((reader) => (
                <tr key={reader.id}>
                  <td>{reader.id}</td>
                  <td>{reader.mssv}</td>
                  <td>{reader.name}</td>
                  <td>
                    {reader.gender === "male" || reader.gender === "Male"
                      ? "Nam"
                      : "Nữ"}
                  </td>
                  <td>{reader.birthday}</td>
                  <td>{reader.address}</td>
                  <td>{reader.phone}</td>
                  <td>{reader.email}</td>
                  <td className="text-center">
                    <div className="btn-group">
                      <Link
                        to={`/QuanLyDocGia/Sua/${reader.documentationId}`}
                        className="btn btn-warning btn-sm me-2"
                        title="Sửa"
                      >
                        <i className="fas fa-edit"></i>
                      </Link>
                      <button
                        className="btn btn-danger btn-sm me-2"
                        onClick={() => delReader(reader.documentationId)}
                        title="Xóa"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ShowReaderManagement;
