import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import apiSystem from "../../../api/apiSystem";
import apiStaff from "../../../api/apiStaff";
import Fuse from "fuse.js";

function ShowSystemManagement() {
  const [system, setSystem] = useState([]);
  const [delSystemItem, setDelSystemItem] = useState(false);
  const [delStaff, setDelStaff] = useState(false);
  const [pages, setPages] = useState(1);
  const page = parseInt(useParams().page); //Lấy page từ url
  const limit = 10; //Mỗi trang sẽ có 5 sản phẩm
  const [staffs, setStaffs] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [timKiemKetQua, setTimKiemKetQua] = useState([]);
  const [searchType, setSearchType] = useState("sach"); // Loại tìm kiếm mặc định là sách

  const getNameStaff = (documentId) => {
    const staffName = staffs.find(
      (item) => item.tai_khoan_documentId === documentId
    );
    return staffName ? staffName.nhan_vien_name : "Không lấy được";
  };

  useEffect(() => {
    // Lấy danh sách nhân viên từ API
    apiStaff.getAll().then((res) => {
      try {
        const staffData = res.data.map((item) => {
          return {
            ...item,
          };
        });
        setStaffs(staffData);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách nhân viên:", err);
      }
    });
    apiSystem.getSystemPagination(page, limit).then((res) => {
      try {
        const systemData = res.data.map((item) => {
          return {
            id: item.id,
            documentId: item.documentId,
            username: item.user_name,
            name: null,
            email: item.email || "Chưa cập nhật",
            vaitro: item.vai_tro_name || "Chưa cập nhật",
            vaitroDocumentId: item.vai_tro_documentId || "Chưa cập nhật",
            sts: 1,
          };
        });
        setSystem(systemData);
        // console.log(systemData);
      } catch (err) {
        console.error("Error:", err);
      }
    });
  }, [delSystemItem, page]);

  const delSystem = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) {
      apiSystem.delSystemById(id).then((res) => {
        try {
          alert("Xóa tài khoản thành công");
          setDelSystemItem(id);
        } catch (e) {
          console.error(e);
        }
      });
    }
  };

  const handleSearch = (event) => {
    const tim = event.target.value;
    setSearchText(tim);

    if (!tim) {
      setTimKiemKetQua([]); // Nếu không có nội dung tìm kiếm, reset kết quả
      return;
    }

    let dataset = [];
    let keysToSearch = [];

    // Xác định dữ liệu và trường tìm kiếm dựa trên searchType
    switch (searchType) {
      case "name":
        dataset = staffs;
        keysToSearch = ["nhan_vien_name"];
        break;
      case "email":
        dataset = staffs;
        keysToSearch = ["email"];
        break;
      case "phone":
        dataset = staffs;
        keysToSearch = ["phone"];
        break;
      case "role":
        dataset = system;
        keysToSearch = ["vaitro"];
        break;
      default:
        dataset = [];
        break;
    }

    // Tạo đối tượng Fuse.js
    const fuse = new Fuse(dataset, {
      keys: keysToSearch,
      includeScore: true,
      threshold: 0.3, // Độ tương đồng cho phép
    });

    // Tìm kiếm
    const result = fuse.search(tim).map((r) => r.item);

    // Cập nhật kết quả tìm kiếm
    setTimKiemKetQua(result);
  };

  // Hàm thay đổi loại tìm kiếm
  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    setSearchText(""); // Reset input khi thay đổi loại tìm kiếm
    setTimKiemKetQua([]); // Xóa kết quả tìm kiếm cũ
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="text-primary">
          <strong>Danh sách tài khoản trong hệ thống</strong>
        </h3>
        <Link to="/QuanLyHeThong/Them">
          <button className="btn btn-success">
            <i className="fas fa-plus"></i> Thêm tài khoản
          </button>
        </Link>
      </div>

      <div className="card p-4 shadow-sm">
        <div className="row mb-3">
          <div className="col-md-8">
            <input
              type="text"
              className="form-control"
              placeholder={`Tìm kiếm ${
                searchType === "name"
                  ? "tên nhân viên"
                  : searchType === "email"
                  ? "email"
                  : searchType === "phone"
                  ? "số điện thoại"
                  : "quyền"
              }...`}
              value={searchText}
              onChange={handleSearch}
            />
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={searchType}
              onChange={(e) => handleSearchTypeChange(e.target.value)}
            >
              <option value="name">Tên nhân viên</option>
              <option value="email">Email</option>
              <option value="phone">Số điện thoại</option>
              <option value="role">Quyền</option>
            </select>
          </div>
        </div>

        <table className="table table-hover table-bordered">
          <thead className="table-dark">
            <tr>
              <th className="text-center">#</th>
              <th className="text-center">Tên đăng nhập</th>
              <th className="text-center">Họ tên nhân viên</th>
              <th className="text-center">Email</th>
              <th className="text-center">Vai trò</th>
              <th className="text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {timKiemKetQua.length > 0
              ? timKiemKetQua.map((item, index) => (
                  <tr key={item.id || index}>
                    <td className="text-center">{index + 1}</td>
                    <td>{item.username || "Không rõ"}</td>
                    <td>{getNameStaff(item.documentId)}</td>
                    <td>{item.email || "Không rõ"}</td>
                    <td className="text-center">
                      <span
                        className={`badge ${
                          item.vaitro === "admin"
                            ? "bg-primary"
                            : item.vaitro === "root"
                            ? "bg-danger"
                            : "bg-secondary"
                        }`}
                      >
                        {item.vaitro || "Không rõ"}
                      </span>
                    </td>
                    <td className="text-center">
                      <button className="btn btn-link p-0 text-decoration-none me-2">
                        <i
                          className={`fas ${
                            item.sts === 1 ? "fa-eye" : "fa-eye-slash"
                          } text-${item.sts === 1 ? "success" : "muted"}`}
                        ></i>
                      </button>
                      <Link
                        to={`/QuanLyHeThong/Sua/${item.documentId}`}
                        className="btn btn-warning btn-sm me-2"
                      >
                        <i className="fas fa-edit"></i>
                      </Link>
                      <button
                        onClick={() => delSystem(item.documentId)}
                        className="btn btn-danger btn-sm"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              : system.map((item, index) => (
                  <tr key={item.id}>
                    <td className="text-center">{index + 1}</td>
                    <td>{item.username}</td>
                    <td>{getNameStaff(item.documentId)}</td>
                    <td>{item.email}</td>
                    <td className="text-center">
                      <span
                        className={`badge ${
                          item.vaitro === "admin"
                            ? "bg-primary"
                            : item.vaitro === "root"
                            ? "bg-danger"
                            : "bg-secondary"
                        }`}
                      >
                        {item.vaitro}
                      </span>
                    </td>
                    <td className="text-center">
                      <button className="btn btn-link p-0 text-decoration-none me-2">
                        <i
                          className={`fas ${
                            item.sts === 1 ? "fa-eye" : "fa-eye-slash"
                          } text-${item.sts === 1 ? "success" : "muted"}`}
                        ></i>
                      </button>
                      <Link
                        to={`/QuanLyHeThong/Sua/${item.documentId}`}
                        className="btn btn-warning btn-sm me-2"
                      >
                        <i className="fas fa-edit"></i>
                      </Link>
                      <button
                        onClick={() => delSystem(item.documentId)}
                        className="btn btn-danger btn-sm"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      <ul class="pagination">
        <li className="page-item">
          <Link
            className={`page-link ${page - 1 === 0 ? "disabled" : ""}`}
            to={`/QuanLyHeThong/${page - 1}`}
          >
            Trang trước
          </Link>
        </li>
        {Array.from(Array(pages).keys()).map((index) => (
          <li
            key={index}
            className={`page-item ${index + 1 === page ? "active" : ""}`}
          >
            <Link className="page-link" to={`/QuanLyHeThong/${index + 1}`}>
              {index + 1}
            </Link>
          </li>
        ))}
        <li className="page-item">
          <Link
            className={`page-link ${
              page === Array(pages).length ? "disabled" : ""
            }`}
            to={`/QuanLyHeThong/${page + 1}`}
          >
            Trang sau
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default ShowSystemManagement;
