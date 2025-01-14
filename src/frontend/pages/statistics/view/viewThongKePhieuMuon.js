import { Link } from "react-router-dom";
import apiBookLoan from "../../../../api/apiBookLoan";
import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

function ViewThongKePhieuMuon() {
  const [phieuMuon, setPhieuMuon] = useState([]);
  const [fromMonth, setFromMonth] = useState("");
  const [toMonth, setToMonth] = useState("");
  const [year, setYear] = useState("");
  const [sts, setSts] = useState("");

  useEffect(() => {
    apiBookLoan.getAll().then((res) => {
      try {
        const phieuMuonData = res.data.map((phieuMuon) => {
          return {
            id: phieuMuon.id,
            documentId: phieuMuon.documentId,
            mssv: phieuMuon.mssv,
            nhan_vien_name: phieuMuon.nhan_vien_name,
            dateEntry: phieuMuon.date_entry,
            dateOut: phieuMuon.date_out,
            createdAt: phieuMuon.createdAt,
            updatedAt: phieuMuon.updatedAt,
            sts: phieuMuon.sts,
          };
        });
        setPhieuMuon(phieuMuonData);
        // console.log(phieuMuonData);
      } catch (err) {
        console.log("Error: ", err);
      }
    });
  }, []);

  const handleFilter = () => {
    if (!fromMonth || !toMonth || !year) {
      alert("Vui lòng chọn đầy đủ Từ tháng, Đến tháng, và Năm.");
      return;
    }

    if (parseInt(fromMonth) > parseInt(toMonth)) {
      alert("Tháng bắt đầu không được lớn hơn tháng kết thúc!");
      return;
    }

    const startMonth = parseInt(fromMonth);
    const endMonth = parseInt(toMonth);
    const selectedYear = parseInt(year);

    // Lọc phiếu mượn
    const filteredPhieuMuon = phieuMuon.filter((pm) => {
      // Chuyển đổi `dateOut` từ string sang Date
      const dateOut = new Date(pm.dateOut);

      // Lấy tháng và năm từ `dateOut`
      const month = dateOut.getMonth() + 1; // Tháng từ 0-11 nên cần +1
      const year = dateOut.getFullYear();

      // Kiểm tra điều kiện lọc
      return (
        month >= startMonth &&
        month <= endMonth &&
        year === selectedYear &&
        parseInt(pm.sts) === parseInt(sts)
      );
    });

    if (filteredPhieuMuon.length === 0) {
      alert("Không có dữ liệu phù hợp!");
      return;
    }

    // Lọc chi tiết phiếu mượn liên quan
    apiBookLoan.getAllBookLoanDetailNoSort().then((res) => {
      const allDetails = res.data;
      const filteredDetails = allDetails.filter((detail) =>
        filteredPhieuMuon.find(
          (pm) => pm.documentId === detail.phieu_muon_documentId
        )
      );

      // Xuất dữ liệu ra file Excel
      exportToExcel(filteredPhieuMuon, filteredDetails);
    });
  };

  const exportToExcel = (filteredPhieuMuon, filteredDetails) => {
    const exportToWS1 = filteredPhieuMuon.map((data) => ({
      Id: data.id,
      DocumentId: data.documentId,
      "Mã số sinh viên": data.mssv,
      "Nhân viên": data.nhan_vien_name,
      "Ngày tạo": data.dateEntry,
      "Ngày hẹn trả": data.dateOut,
      "Trạng thái":
        data.sts === "1"
          ? "Đang mượn"
          : data.sts === "0"
          ? "Đã trả"
          : "Quá hạn trả",
    }));

    const exportToWS2 = filteredDetails.map((data) => ({
      Id: data.id,
      "Mã phiếu mượn": data.phieu_muon_documentId,
      "Mã sách": data.sach_documentId,
      "Đơn giá": data.price,
      "Số lượng": data.quantity,
      "Thành tiền": parseInt(data.quantity) * parseFloat(data.price),
    }));

    const ws1 = XLSX.utils.json_to_sheet(exportToWS1);
    const ws2 = XLSX.utils.json_to_sheet(exportToWS2);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws1, "PhieuMuon");
    XLSX.utils.book_append_sheet(wb, ws2, "ChiTietPhieuMuon");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `Thong-ke-phieu-muon_${year}_${fromMonth}-${toMonth}.xlsx`);
  };

  return (
    <div>
      <Link to="/BaoCaoThongKe/1">
        <i className="fas fa-arrow-left iconspacing"></i>
        <button className="btn-trove">Quay lại</button>
      </Link>
      <h3>
        <strong>Thống kê phiếu mượn</strong>
      </h3>
      <hr />
      <h6>
        <strong>Thống kê từ tháng đến tháng</strong>
      </h6>
      <div className="row filter-container">
        <div className="col-2 form-group">
          <label htmlFor="from-month">Từ tháng:</label>
          <select
            id="from-month"
            value={fromMonth}
            onChange={(e) => setFromMonth(e.target.value)}
          >
            <option value="">Chọn tháng</option>
            {[...Array(12)].map((_, i) => (
              <option value={i + 1} key={i}>
                Tháng {i + 1}
              </option>
            ))}
          </select>
        </div>
        <div className="col-2 form-group">
          <label htmlFor="to-month">Đến tháng:</label>
          <select
            id="to-month"
            value={toMonth}
            onChange={(e) => setToMonth(e.target.value)}
          >
            <option value="">Chọn tháng</option>
            {[...Array(12)].map((_, i) => (
              <option value={i + 1} key={i}>
                Tháng {i + 1}
              </option>
            ))}
          </select>
        </div>
        <div className="col-2 form-group">
          <label htmlFor="from-year">Năm:</label>
          <select
            id="from-year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="">Chọn năm</option>
            {[...Array(100)].map((_, i) => (
              <option value={2000 + i} key={i}>
                {2000 + i}
              </option>
            ))}
          </select>
        </div>
        <div className="col-2 form-group">
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
        <div className="col-2">
          <button
            id="filter-button"
            onClick={handleFilter}
            className="mr-sm-2 mr-md-3"
          >
            Thống kê
          </button>
        </div>
      </div>
      {/* <h6>
        <strong>Thống kê theo tuần</strong>
      </h6>
      <h6>
        <strong>Thống kê theo ngày</strong>
      </h6> */}
    </div>
  );
}

export default ViewThongKePhieuMuon;
