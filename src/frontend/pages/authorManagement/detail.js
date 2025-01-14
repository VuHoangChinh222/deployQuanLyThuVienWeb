import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiAuthor from "../../../api/apiAuthor";
import { Link } from "react-router-dom";

function DetailAuthorManagement() {
  const { id } = useParams(); // Lấy id từ URL
  const [authorDetail, setAuthorDetail] = useState(null);

  useEffect(() => {
    // Gọi API để lấy thông tin chi tiết
    apiAuthor.getDetailAuthorById(id).then((res) => {
      try {
        setAuthorDetail(res.data); // Cập nhật state với dữ liệu nhận được
      } catch (err) {
        console.error("Error fetching author detail: ", err);
      }
    });
  }, [id]);

  if (!authorDetail) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Chi tiết tác giả</h1>
      <div className="card shadow">
        <div className="card-header bg-info text-white">
          <h2 className="mb-0">{authorDetail.name}</h2>
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-4">
              <strong>ID:</strong>
            </div>
            <div className="col-8">{authorDetail.id}</div>
          </div>
          <div className="row mb-3">
            <div className="col-4">
              <strong>Tên tác giả:</strong>
            </div>
            <div className="col-8">{authorDetail.name}</div>
          </div>
          <div className="row mb-3">
            <div className="col-4">
              <strong>Giới tính:</strong>
            </div>
            <div className="col-8">
              {authorDetail.gender === "Female" ? "Nữ" : "Nam"}
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-4">
              <strong>Ngày sinh:</strong>
            </div>
            <div className="col-8">
              {new Date(authorDetail.birthday).toLocaleDateString()}
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-4">
              <strong>Mô tả:</strong>
            </div>
            <div className="col-8">
              <div
                style={{
                  maxHeight: "150px", // Giới hạn chiều cao
                  overflowY: "auto", // Thêm thanh cuộn dọc
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                {authorDetail.description}
              </div>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-4">
              <strong>Trạng thái:</strong>
            </div>
            <div className="col-8">
              {authorDetail.sts === "1" ? (
                <span className="badge bg-success">Hiển thị</span>
              ) : (
                <span className="badge bg-danger">Ẩn</span>
              )}
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-4">
              <strong>Ngày tạo:</strong>
            </div>
            <div className="col-8">
              {new Date(authorDetail.createdAt).toLocaleString()}
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-4">
              <strong>Ngày cập nhật:</strong>
            </div>
            <div className="col-8">
              {new Date(authorDetail.updatedAt).toLocaleString()}
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-4">
              <strong>Ngày xuất bản:</strong>
            </div>
            <div className="col-8">
              {new Date(authorDetail.publishedAt).toLocaleString()}
            </div>
          </div>
        </div>
        <div className="card-footer text-center">
          <button
            className="btn btn-secondary me-3"
            onClick={() => window.history.back()}
          >
            Quay lại
          </button>
          <button className="btn btn-primary shadow-0 me-1">
            <Link
              style={{ color: "white", textDecoration: "none" }}
              to={`/QuanLyTacGia/Sua/${authorDetail.documentId}`}
            >
              Chỉnh sửa
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetailAuthorManagement;
