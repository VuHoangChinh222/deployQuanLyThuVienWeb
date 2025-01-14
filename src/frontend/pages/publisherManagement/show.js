import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import apiPublisher from "../../../api/apiPublisher";

function ShowPublisherManagement() {
  const [publishers, setPublishers] = useState([]);
  const [delPublisherItem, setDelPublisherItem] = useState(false);
  const [pages, setPages] = useState(1);
  const page = parseInt(useParams().page) || 1; // Default page is 1
  const limit = 10; // Items per page
  const [allPublisherNotPagenation, setAllPublisherNotPagenation] = useState(
    []
  );
  const [searchTerm, setSearchTerm] = useState(""); // State để lưu từ khóa tìm kiếm

  useEffect(() => {
    apiPublisher.getAll().then((res) => {
      try {
        const publisherData = res.data.map((publisher) => ({
          id: publisher.id,
          documentId: publisher.documentId,
          name: publisher.name,
          address: publisher.address,
          sts: publisher.sts,
        }));
        setAllPublisherNotPagenation(publisherData);
      } catch (err) {
        console.error("Error: ", err);
      }
    });
  }, [delPublisherItem]);

  useEffect(() => {
    apiPublisher.getPublisherPagination(page, limit).then((res) => {
      try {
        const numberOfPages = Math.ceil(
          res.meta.pagination.total / res.meta.pagination.pageSize
        );
        setPages(numberOfPages);
        const publisherData = res.data.map((publisher) => ({
          id: publisher.id,
          documentId: publisher.documentId,
          name: publisher.name,
          address: publisher.address,
          sts: publisher.sts,
        }));
        setPublishers(publisherData);
      } catch (err) {
        console.error("Error: ", err);
      }
    });
  }, [delPublisherItem, page]);

  // Delete publisher
  const delPublisher = async (id) => {
    apiPublisher.delPublisherById(id).then(() => {
      alert("Xóa nhà xuất bản thành công");
      setDelPublisherItem(!delPublisherItem);
    });
  };

  // Export Excel
  const exportExcel = () => {
    const exportData = filteredPublishers.map((publisher) => ({
      Id: publisher.id,
      "Document Id": publisher.documentId,
      "Tên nhà xuất bản": publisher.name,
      "Địa chỉ": publisher.address,
      "Trạng thái": publisher.sts === "1" ? "Hiển thị" : "Ẩn",
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Publishers");
    XLSX.writeFile(workbook, "Nha-Xuat-Ban.xlsx");
  };

  // Import Excel
  const importExcel = (event) => {
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
      //Kiểm tra xem tên nhà xuất bản có bị trùng không
      const flat = importedData
        .map((x) => {
          const check = allPublisherNotPagenation.some(
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
          const apiPromises = importedData.map((publisher) => {
            let PublisherData = {
              name: publisher.name,
              address: publisher.address,
              sts: publisher.sts === "Đăng lên" ? "1" : "0",
            };
            // console.log(PublisherData);
            return apiPublisher.createPublisher({ data: PublisherData });
          });

          await Promise.all(apiPromises);
          alert("Import thành công!");
          setDelPublisherItem(!delPublisherItem); // Refresh data
        } catch (error) {
          console.error("Lỗi khi import dữ liệu:", error);
          alert("Đã xảy ra lỗi khi import. Vui lòng thử lại!");
        } finally {
          event.target.value = null;
        }
      } else {
        alert("Đã xảy ra lỗi khi import. Vui lòng thử lại!");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Lọc dữ liệu dựa trên từ khóa tìm kiếm
  const filteredPublishers = searchTerm
    ? allPublisherNotPagenation.filter((publisher) =>
        publisher.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : publishers;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="text-primary">Quản lý nhà xuất bản</h1>
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
          <Link className="btn btn-primary" to="/QuanLyNhaXuatBan/Them">
            Thêm nhà xuất bản
          </Link>
        </div>
      </div>
      <div className="card">
        <div className="mb-2 ">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Tìm kiếm theo tên nhà xuất bản"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ display: "inline", width: "100%" }}
          />
        </div>
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Tên nhà xuất bản</th>
              <th>Địa chỉ</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredPublishers.map((publisher, index) => (
              <tr key={index}>
                <td>{publisher.id}</td>
                <td>{publisher.name}</td>
                <td>{publisher.address}</td>
                <td style={{ textAlign: "center" }}>
                  <button
                    className={`btn btn-link text-decoration-none me-1 ${
                      publisher.sts === "1" ? "text-success" : "text-muted"
                    }`}
                    title={publisher.sts === "1" ? "Đang hiển thị" : "Đang ẩn"}
                  >
                    <i
                      className={`fas ${
                        publisher.sts === "1" ? "fa-eye" : "fa-eye-slash"
                      }`}
                    ></i>
                  </button>
                  <Link
                    to={`/QuanLyNhaXuatBan/ChiTiet/${publisher.documentId}`}
                    className="btn btn-info me-1"
                    title="Chi tiết"
                  >
                    <i className="fas fa-info-circle"></i>
                  </Link>
                  <Link to={`/QuanLyNhaXuatBan/Sua/${publisher.documentId}`}>
                    <button className="btn btn-warning shadow-0 me-1">
                      <i className="fas fa-solid fa-wrench"></i>
                    </button>
                  </Link>
                  {publisher.sts === "1" ? (
                    <button className="btn btn-danger shadow-0 me-1 disabled">
                      <i className="fas fa-trash"></i>
                    </button>
                  ) : (
                    <button
                      className="btn btn-danger shadow-0 me-1"
                      onClick={() => delPublisher(publisher.documentId)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <nav>
        <ul className="pagination justify-content-center mt-3">
          <li className={`page-item ${page <= 1 ? "disabled" : ""}`}>
            <Link className="page-link" to={`/QuanLyNhaXuatBan/${page - 1}`}>
              Trang trước
            </Link>
          </li>
          {Array.from({ length: pages }).map((_, i) => (
            <li
              key={i}
              className={`page-item ${page === i + 1 ? "active" : ""}`}
            >
              <Link className="page-link" to={`/QuanLyNhaXuatBan/${i + 1}`}>
                {i + 1}
              </Link>
            </li>
          ))}
          <li className={`page-item ${page >= pages ? "disabled" : ""}`}>
            <Link className="page-link" to={`/QuanLyNhaXuatBan/${page + 1}`}>
              Trang sau
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default ShowPublisherManagement;
