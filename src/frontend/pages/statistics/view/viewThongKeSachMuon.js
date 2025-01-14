import React, { useState } from "react";
import apiBookLoan from "../../../../api/apiBookLoan";
import apiBook from "../../../../api/apiBook";
import { Link } from "react-router-dom";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

function ViewThongKeSachMuon() {
  const [fromMonth, setFromMonth] = useState("");
  const [toMonth, setToMonth] = useState("");
  const [year, setYear] = useState("");
  const [dataByMonth, setDataByMonth] = useState([]);
  const [quantityBookMonth, setQuantityBookMonth] = useState(1);

  const handleFilter = async () => {
    if (!fromMonth || !toMonth || !year) {
      alert("Vui lòng chọn đầy đủ Từ tháng, Đến tháng, và Năm.");
      return;
    }

    const startMonth = parseInt(fromMonth);
    const endMonth = parseInt(toMonth);
    const selectedYear = parseInt(year);

    try {
      const chiTietResponse = await apiBookLoan.getAllBookLoanDetail();
      const bookResponse = await apiBook.getAll();

      const chiTietData = chiTietResponse.data;
      const bookData = bookResponse.data;

      const filteredData = chiTietData.filter((item) => {
        const createdAt = new Date(item.createdAt);
        const month = createdAt.getMonth() + 1;
        const year = createdAt.getFullYear();
        return (
          month >= startMonth && month <= endMonth && year === selectedYear
        );
      });

      const groupedByMonth = {};

      filteredData.forEach((item) => {
        const createdAt = new Date(item.createdAt);
        const month = createdAt.getMonth() + 1;

        if (!groupedByMonth[month]) {
          groupedByMonth[month] = {};
        }

        const bookId = item.sach_documentId;
        if (!groupedByMonth[month][bookId]) {
          groupedByMonth[month][bookId] = 0;
        }

        groupedByMonth[month][bookId] += parseInt(item.quantity);
      });

      const topBooksByMonth = {};

      Object.keys(groupedByMonth).forEach((month) => {
        const books = groupedByMonth[month];
        const sortedBooks = Object.entries(books)
          .sort((a, b) => b[1] - a[1])
          .slice(0, quantityBookMonth)
          .map(([bookId, quantity]) => {
            const book = bookData.find((b) => b.documentId === bookId);
            return {
              name: book?.sach_name || "Unknown",
              documentId: bookId,
              quantity,
            };
          });

        topBooksByMonth[month] = sortedBooks;
      });

      setDataByMonth(topBooksByMonth);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  //Xuất excel danh sách sinh viên không còn liên quan
  const exportToExcel = () => {
    const formattedBooks = Object.entries(dataByMonth).flatMap(
      ([month, books]) =>
        books.map((book) => ({
          Tháng: month,
          "Tên sách": book.name,
          "Mã sách": book.documentId,
          "Số lượng sách được mượn": book.quantity,
        }))
    );

    const worksheet = XLSX.utils.json_to_sheet(formattedBooks);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Sach`);

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    saveAs(
      data,
      `danh-sach-cac-sach-duoc-muon-xuat-vao-${day}-${
        month < 10 ? `0${month}` : month
      }-${year}.xlsx`
    );
  };

  return (
    <div className="container mt-4">
      <Link to="/BaoCaoThongKe/1">
        <i className="fas fa-arrow-left iconspacing"></i>
        <button className="btn-trove">Quay lại</button>
      </Link>
      <h3 className="text-center fw-bold mb-4">
        Thống kê sách mượn nhiều nhất
      </h3>
      {/* Bộ lọc */}
      <div className="card p-4 shadow-sm mb-4">
        <div className="row g-3">
          <div className="col-md-3">
            <label htmlFor="from-month" className="form-label">
              Từ tháng:
            </label>
            <select
              id="from-month"
              value={fromMonth}
              onChange={(e) => setFromMonth(e.target.value)}
              className="form-select"
            >
              <option value="">Chọn tháng</option>
              {[...Array(12)].map((_, i) => (
                <option value={i + 1} key={i}>
                  Tháng {i + 1}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label htmlFor="to-month" className="form-label">
              Đến tháng:
            </label>
            <select
              id="to-month"
              value={toMonth}
              onChange={(e) => setToMonth(e.target.value)}
              className="form-select"
            >
              <option value="">Chọn tháng</option>
              {[...Array(12)].map((_, i) => (
                <option value={i + 1} key={i}>
                  Tháng {i + 1}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label htmlFor="year" className="form-label">
              Năm:
            </label>
            <select
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="form-select"
            >
              <option value="">Chọn năm</option>
              {[...Array(30)].map((_, i) => (
                <option value={2000 + i} key={i}>
                  {2000 + i}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label htmlFor="quantity" className="form-label">
              Số lượng sách:
            </label>
            <input
              type="number"
              min={1}
              onChange={(e) => setQuantityBookMonth(e.target.value)}
              value={quantityBookMonth}
              style={{ height: "2.3rem" }}
            />
          </div>
        </div>
        <div className="row mt-3 ">
          <div className="col-2">
            <button className="btn btn-success" onClick={exportToExcel}>
              Xuất file excel
            </button>
          </div>
          <div className="col-8"></div>
          <div className="col-2 text-end">
            <button className="btn btn-primary" onClick={handleFilter}>
              Thống kê
            </button>
          </div>
        </div>
      </div>
      {/* Hiển thị dữ liệu */}
      <div>
        {Object.keys(dataByMonth).length > 0 ? (
          Object.keys(dataByMonth).map((month) => (
            <div className="mb-3" key={month}>
              <h5 className="fw-bold">Tháng {month}</h5>
              <ul className="list-group">
                {dataByMonth[month].map((book, index) => (
                  <li
                    className="list-group-item d-flex justify-content-between align-items-center"
                    key={index}
                  >
                    {book.name}
                    <span className="badge bg-primary rounded-pill">
                      {book.quantity} lần mượn
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <div className="alert alert-warning text-center">
            Không có dữ liệu trong khoảng thời gian đã chọn.
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewThongKeSachMuon;
