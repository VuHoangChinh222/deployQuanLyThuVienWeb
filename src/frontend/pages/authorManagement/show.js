import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import apiAuthor from "../../../api/apiAuthor";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

function ShowAuthorManagement() {
  const [author, setAuthor] = useState([]);
  const [delAuthorItem, setDelAuthorItem] = useState(false);
  const [pages, setPages] = useState(1);
  const page = parseInt(useParams().page); //Lấy page từ url
  const limit = 10; //Mỗi trang sẽ có 5 sản phẩm
  const [allAuthorNotPagenation, setAllAuthorNotPagenation] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State để lưu từ khóa tìm kiếm

  useEffect(() => {
    apiAuthor.getAll().then((res) => {
      try {
        const authorData = res.data.map((author) => {
          return {
            id: author.id,
            documentationId: author.documentId,
            name: author.name,
            gender: author.gender,
            description: author.description,
            birthday: author.birthday,
            sts: author.sts,
          };
        });
        setAllAuthorNotPagenation(authorData);
      } catch (err) {
        console.log("Error: ", err);
      }
    });
  }, [delAuthorItem]);

  useEffect(() => {
    apiAuthor.getAuthorPagination(page, limit).then((res) => {
      try {
        const numberOfPages = Math.ceil(
          res.meta.pagination.total / res.meta.pagination.pageSize
        );
        setPages(numberOfPages);
        const authorData = res.data.map((author) => {
          return {
            id: author.id,
            documentationId: author.documentId,
            name: author.name,
            gender: author.gender,
            description: author.description,
            birthday: author.birthday,
            sts: author.sts,
          };
        });
        setAuthor(authorData);
      } catch (err) {
        console.log("Error: ", err);
      }
    });
  }, [delAuthorItem, page]);

  const delAuthor = async (id) => {
    apiAuthor.delAuthorById(id).then((res) => {
      try {
        alert("Xóa tác giả thành công");
        setDelAuthorItem(id);
      } catch (e) {
        console.log(e);
      }
    });
  };

  // Export Excel
  const exportExcel = () => {
    const exportData = filteredAuthor.map((author) => ({
      Id: author.id,
      "Document Id": author.documentationId,
      "Tên tác giả": author.name,
      "Giới tính": author.name,
      "Ngày sinh": author.name,
      "Mô tả": author.description,
      "Trạng thái": author.sts === "1" ? "Hiển thị" : "Ẩn",
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    let date = new Date();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tác giả");
    XLSX.writeFile(workbook, `Tac-gia-${date}.xlsx`);
  };

  // Import Excel
  const importExcel = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const importedData = XLSX.utils.sheet_to_json(sheet);
      // console.log(importedData);
      // Simulate sending data to the API

      //Kiểm tra xem tên tác giả có bị trùng không
      const flat = importedData
        .map((x) => {
          const check = allAuthorNotPagenation.some(
            (y) => y.name.toLowerCase() === x.name.toLowerCase()
          );
          if (check) {
            return x;
          } else {
            return null;
          }
        })
        .filter((x) => x !== null);
      // console.log(flat);
      if (flat.length === 0) {
        try {
          // Sử dụng Promise.all để gửi tất cả các yêu cầu API song song
          const apiPromises = importedData.map((author) => {
            let formattedBirthday = null;
            const date = new Date(author.birthday);
            formattedBirthday = date.toISOString().split("T")[0]; // YYYY-MM-DD

            const Authordata = {
              name: author.name,
              gender: author.gender,
              birthday: formattedBirthday,
              description: author.description,
              sts: author.sts === "Đăng lên" ? "1" : "0",
            };
            return apiAuthor.createAuthor({ data: Authordata });
          });

          await Promise.all(apiPromises);
          alert("Import thành công!");
          setDelAuthorItem(!delAuthorItem); // Refresh giao diện
        } catch (error) {
          console.error("Lỗi khi import dữ liệu:", error);
          alert("Đã xảy ra lỗi khi import. Vui lòng thử lại!");
        } finally {
          // Reset giá trị của input file
          event.target.value = null;
        }
      } else {
        alert("Đã xảy ra lỗi khi import. Vui lòng thử lại!");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const filteredAuthor = searchTerm
    ? allAuthorNotPagenation.filter((author) =>
        author.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : author;

  return (
    <>
      <div>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="text-primary">
            <strong>Quản lý tác giả</strong>
          </h3>
          <div>
            <button className="btn btn-success me-2" onClick={exportExcel}>
              Xuất file Excel
            </button>
            <label
              className="btn btn-info me-1"
              style={{ marginTop: "0.5rem" }}
            >
              Thêm bằng file Excel
              <input
                type="file"
                className="d-none"
                accept=".xlsx, .xls"
                onChange={(e) => importExcel(e)}
              />
            </label>
            <Link className="btn btn-primary" to="/QuanLyTacGia/Them">
              Thêm tác giả
            </Link>
          </div>
        </div>
        <div className="row mb-3">
          <div className="mb-2 ">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Tìm kiếm theo tên tác giả"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ display: "inline", width: "100%" }}
            />
          </div>
        </div>
        <div className="card">
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr className="text">
                <th>ID</th>
                <th style={{ width: "7rem" }}>Tên Tác giả</th>
                <th style={{ width: "6rem" }}>Giới tính</th>
                <th style={{ width: "7rem" }}>Ngày sinh</th>
                <th>Mô tả</th>
                <th style={{ width: "7rem" }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredAuthor.map((tacgia, index) => (
                <tr key={index}>
                  <td>{tacgia.id}</td>
                  <td style={{ width: "7rem" }}>{tacgia.name}</td>
                  <td>{tacgia.gender}</td>
                  <td style={{ width: "7rem" }}>{tacgia.birthday}</td>
                  <td>{tacgia.description}</td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center align-items-center gap-2">
                      <button
                        className={`btn btn-link text-decoration-none ${
                          tacgia.sts === "1" ? "text-success" : "text-muted"
                        }`}
                        title={tacgia.sts === "1" ? "Đang hiển thị" : "Đang ẩn"}
                      >
                        <i
                          className={`fas ${
                            tacgia.sts === "1" ? "fa-eye" : "fa-eye-slash"
                          }`}
                        ></i>
                      </button>
                      <Link
                        to={`/QuanLyTacGia/ChiTiet/${tacgia.documentationId}`}
                        className="btn btn-info btn-sm"
                        title="Chi tiết"
                      >
                        <i className="fas fa-info-circle"></i>
                      </Link>
                      <Link
                        to={`/QuanLyTacGia/Sua/${tacgia.documentationId}`}
                        className="btn btn-warning btn-sm"
                        title="Sửa"
                      >
                        <i className="fas fa-edit"></i>
                      </Link>
                      {tacgia.sts === "1" ? (
                        <button
                          className="btn btn-danger btn-sm"
                          title="Xóa"
                          disabled
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      ) : (
                        <button
                          onClick={() => delAuthor(tacgia.documentationId)}
                          className="btn btn-danger btn-sm"
                          title="Xóa"
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
        <nav className="mt-3">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
              <Link className="page-link" to={`/QuanLyTacGia/${page - 1}`}>
                Trang trước
              </Link>
            </li>
            {Array.from(Array(pages).keys()).map((index) => (
              <li
                key={index}
                className={`page-item ${index + 1 === page ? "active" : ""}`}
              >
                <Link className="page-link" to={`/QuanLyTacGia/${index + 1}`}>
                  {index + 1}
                </Link>
              </li>
            ))}
            <li className={`page-item ${page === pages ? "disabled" : ""}`}>
              <Link className="page-link" to={`/QuanLyTacGia/${page + 1}`}>
                Trang sau
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
export default ShowAuthorManagement;
