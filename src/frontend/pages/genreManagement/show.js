import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import apiGenre from "../../../api/apiGenre";
// import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

function ShowGenreManagement() {
  const [Genre, setGenre] = useState([]);
  const [delGenreItem, setDelGenreItem] = useState(false);
  const [pages, setPages] = useState(1);
  const page = parseInt(useParams().page) || 1; // Lấy page từ URL hoặc mặc định là 1
  const limit = 10; // Mỗi trang sẽ có 10 mục
  const [allGenreNotPagenation, setAllGenreNotPagenation] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State để lưu từ khóa tìm kiếm

  useEffect(() => {
    apiGenre.getGenrePagination(page, limit).then((res) => {
      try {
        const numberOfPages = Math.ceil(
          res.meta.pagination.total / res.meta.pagination.pageSize
        );
        setPages(numberOfPages);
        const GenreData = res.data.map((genre) => ({
          id: genre.id,
          documentationId: genre.documentId,
          name: genre.name,
          description: genre.description,
          sts: genre.sts,
        }));
        setGenre(GenreData);
      } catch (err) {
        console.error("Error: ", err);
      }
    });
  }, [delGenreItem, page]);

  useEffect(() => {
    apiGenre.getAll().then((res) => {
      const genreData = res.data.map((genre) => ({
        id: genre.id,
        documentationId: genre.documentId,
        name: genre.name,
        description: genre.description,
        sts: genre.sts,
      }));
      setAllGenreNotPagenation(genreData);
    });
  }, [delGenreItem]);

  const delGenre = async (id) => {
    apiGenre.delGenreById(id).then((res) => {
      try {
        alert("Xóa thể loại thành công");
        setDelGenreItem(id);
      } catch (e) {
        console.error(e);
      }
    });
  };

  // Export Excel
  const exportExcel = () => {
    const exportData = filteredGenres.map((publisher) => ({
      Id: publisher.id,
      "Document Id": publisher.documentationId,
      "Tên thể loại": publisher.name,
      "Mô tả": publisher.description,
      "Trạng thái": publisher.sts === "1" ? "Hiển thị" : "Ẩn",
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    let date = new Date();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Thể loại");
    XLSX.writeFile(workbook, `The-loai-${date}.xlsx`);
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
      // Kiểm tra xem tên thể loại có bị trùng hay không
      const flat = importedData
        .map((x) => {
          const check = allGenreNotPagenation.some(
            (y) => y.name.toLowerCase() === x.name.toLowerCase()
          );
          if (check) {
            return x;
          } else {
            return null;
          }
        })
        .filter((x) => x !== null);

      if (flat.length === 0) {
        try {
          // Sử dụng Promise.all để gửi tất cả các yêu cầu API song song
          const apiPromises = importedData.map((genre) => {
            const Genredata = {
              name: genre.name,
              description: genre.description,
              sts: genre.sts === "Đăng lên" ? "1" : "0",
            };
            return apiGenre.createGenre({ data: Genredata });
          });

          await Promise.all(apiPromises);
          alert("Import thành công!");
          setDelGenreItem(!delGenreItem); // Refresh giao diện
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

  const filteredGenres = searchTerm
    ? allGenreNotPagenation.filter((genre) =>
        genre.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : Genre;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="text-primary">
          <strong>Quản lý thể loại</strong>
        </h3>
        <div>
          <button className="btn btn-success me-2" onClick={exportExcel}>
            Xuất file Excel
          </button>
          <label className="btn btn-info me-1" style={{ marginTop: "0.5rem" }}>
            Thêm bằng file Excel
            <input
              type="file"
              className="d-none"
              accept=".xlsx, .xls"
              onChange={(e) => importExcel(e)}
            />
          </label>
          <Link className="btn btn-primary" to="/QuanLyTheLoai/Them">
            Thêm thể loại
          </Link>
        </div>
      </div>

      <div className="card p-4 shadow-sm">
        <div className="row mb-3">
          <div className="mb-2 ">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Tìm kiếm theo tên thể loại"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ display: "inline", width: "100%" }}
            />
          </div>
        </div>

        <table className="table table-hover table-bordered">
          <thead className="table-dark">
            <tr>
              <th className="text-center">ID</th>
              <th className="text-center">Tên thể loại</th>
              <th className="text-center">Mô tả</th>
              <th className="text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {Genre.length > 0 ? (
              filteredGenres.map((genre, index) => (
                <tr key={index}>
                  <td className="text-center">{genre.id}</td>
                  <td style={{ width: "10em" }}>{genre.name}</td>
                  <td>{genre.description}</td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center align-items-center gap-2">
                      <button
                        className={`btn btn-link text-decoration-none ${
                          genre.sts === "1" ? "text-success" : "text-muted"
                        }`}
                        title={genre.sts === "1" ? "Đang hiển thị" : "Đang ẩn"}
                      >
                        <i
                          className={`fas ${
                            genre.sts === "1" ? "fa-eye" : "fa-eye-slash"
                          }`}
                        ></i>
                      </button>
                      <Link
                        to={`/QuanLyTheLoai/ChiTiet/${genre.documentationId}`}
                        className="btn btn-info btn-sm"
                        title="Chi tiết"
                      >
                        <i className="fas fa-info-circle"></i>
                      </Link>
                      <Link
                        to={`/QuanLyTheLoai/Sua/${genre.documentationId}`}
                        className="btn btn-warning btn-sm"
                        title="Sửa"
                      >
                        <i className="fas fa-edit"></i>
                      </Link>
                      {genre.sts === "1" ? (
                        <button
                          className="btn btn-danger btn-sm"
                          title="Xóa"
                          disabled
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      ) : (
                        <button
                          onClick={() => delGenre(genre.documentationId)}
                          className="btn btn-danger btn-sm"
                          title="Xóa"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <nav className="mt-3">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
            <Link className="page-link" to={`/QuanLyTheLoai/${page - 1}`}>
              Trang trước
            </Link>
          </li>
          {Array.from(Array(pages).keys()).map((index) => (
            <li
              key={index}
              className={`page-item ${index + 1 === page ? "active" : ""}`}
            >
              <Link className="page-link" to={`/QuanLyTheLoai/${index + 1}`}>
                {index + 1}
              </Link>
            </li>
          ))}
          <li className={`page-item ${page === pages ? "disabled" : ""}`}>
            <Link className="page-link" to={`/QuanLyTheLoai/${page + 1}`}>
              Trang sau
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default ShowGenreManagement;
