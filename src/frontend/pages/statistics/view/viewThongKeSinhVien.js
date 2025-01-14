import React, { useState, useEffect } from "react";
import apiBookLoan from "../../../../api/apiBookLoan";
import apiReader from "../../../../api/apiReader";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { Link } from "react-router-dom";

function ViewThongKeSinhVien() {
  const [allSV, setAllSV] = useState([]);
  const [allBookLoanDangMuon, setAllBookLoanDangMuon] = useState([]);
  const [allBookLoanQuaHan, setAllBookLoanQuaHan] = useState([]);

  useEffect(() => {
    //get all sinh vien
    apiReader.getBySts(1).then((res) => {
      try {
        const svData = res.data.map((sv) => {
          return {
            id: sv.id,
            documentId: sv.documentId,
            doc_gia_name: sv.doc_gia_name,
            gender: sv.gender,
            birthday: sv.birthday,
            address: sv.address,
            phone: sv.phone,
            email: sv.email,
            mssv: sv.mssv,
          };
        });
        setAllSV(svData);
      } catch (err) {
        console.log("Error: ", err);
      }
    });
    //get all phieu muon voi trang thai dang muon
    apiBookLoan.getBookLoanBySts(1).then((res) => {
      try {
        const data = res.data.map((bl) => {
          return {
            id: bl.id,
            mssv: bl.mssv,
            documentId: bl.documentId,
            sts: bl.sts,
          };
        });
        setAllBookLoanDangMuon(data);
      } catch (err) {
        console.log("Error: ", err);
      }
    });
    //get all phieu muon voi trang thai qua han
    apiBookLoan.getBookLoanBySts(2).then((res) => {
      try {
        const data = res.data.map((bl) => {
          return {
            id: bl.id,
            mssv: bl.mssv,
            documentId: bl.documentId,
            sts: bl.sts,
          };
        });
        setAllBookLoanQuaHan(data);
      } catch (err) {
        console.log("Error: ", err);
      }
    });
  }, []);

  //Xuất danh sách sinh viên không còn liên quan đến thư viện
  const handleSVKLQ = () => {
    //Lấy danh sách sinh viên đang mượn sách
    const DSSVDMuonSach = [];
    for (let i = 0; i < allSV.length; i++) {
      for (let j = 0; j < allBookLoanDangMuon.length; j++) {
        if (allBookLoanDangMuon[j].mssv === allSV[i].mssv) {
          DSSVDMuonSach.push(allSV[i]);
          break;
        }
      }
    }
    //Lấy danh sách sinh viên quá hạn trả sách
    const DSSVQuaHanTraSach = [];
    for (let i = 0; i < allSV.length; i++) {
      for (let j = 0; j < allBookLoanQuaHan.length; j++) {
        if (allBookLoanQuaHan[j].mssv === allSV[i].mssv) {
          DSSVQuaHanTraSach.push(allSV[i]);
          break;
        }
      }
    }
    // console.log("dabmuon", DSSVDMuonSach);
    // console.log("qya han", DSSVQuaHanTraSach);

    //Kiểm tra và xuất file
    if (DSSVDMuonSach.length == 0 && DSSVQuaHanTraSach.length == 0) {
      //Không có sinh viên nào mượn sách
      exportToExcel(allSV);
      return;
    } else if (DSSVDMuonSach.length > 0 && DSSVQuaHanTraSach.length == 0) {
      // Xuất danh sách sinh viên không nằm trong danh sách đang mượn sách
      let DSSVConLai = [];
      for (let i = 0; i < allSV.length; i++) {
        let flat = 0;
        for (let j = 0; j < DSSVDMuonSach.length; j++) {
          if (DSSVDMuonSach[j].mssv === allSV[i].mssv) {
            flat = 1;
            break;
          }
        }
        if (flat === 0) {
          DSSVConLai.push(allSV[i]);
        }
      }
      exportToExcel(DSSVConLai);
      return;
    } else if (DSSVQuaHanTraSach.length > 0 && DSSVDMuonSach.length == 0) {
      //Xuất danh sách sinh viên không nằm trong danh sách sinh viên quá hạn trả sách
      let DSSVConLai = [];
      for (let i = 0; i < allSV.length; i++) {
        let flat = 0;
        for (let j = 0; j < DSSVQuaHanTraSach.length; j++) {
          if (DSSVQuaHanTraSach[j].mssv === allSV[i].mssv) {
            flat = 1;
            break;
          }
        }
        if (flat === 0) {
          DSSVConLai.push(allSV[i]);
        }
      }
      exportToExcel(DSSVConLai);
      return;
    } else if (DSSVQuaHanTraSach.length > 0 && DSSVDMuonSach.length > 0) {
      //Xuất danh sách sinh viên không mượn hay nợ sách
      let DSSVConLai = [];
      //Lấy sinh viên không trong danh sách mượn sách
      for (let i = 0; i < allSV.length; i++) {
        let flat = 0;
        for (let j = 0; j < DSSVDMuonSach.length; j++) {
          if (DSSVDMuonSach[j].mssv === allSV[i].mssv) {
            flat = 1;
            break;
          }
        }
        if (flat === 0) {
          DSSVConLai.push(allSV[i]);
        }
      }

      //Lấy sinh viên không trong danh sách quá hạn trả sách
      for (let i = 0; i < allSV.length; i++) {
        let flat = 0;
        for (let j = 0; j < DSSVQuaHanTraSach.length; j++) {
          if (DSSVQuaHanTraSach[j].mssv === allSV[i].mssv) {
            flat = 1;
            break;
          }
        }
        if (flat === 0) {
          for (let j = 0; j < DSSVConLai.length; j++) {
            if (DSSVConLai[j].mssv === allSV[i].mssv) {
              flat = 1;
              break;
            }
          }
        }
        if (flat === 0) {
          DSSVConLai.push(allSV[i]);
        }
      }
      exportToExcel(DSSVConLai);
      return;
    } else {
      alert("Sinh vien nao cung dang muon hoac chua tra sach");
      return;
    }
  };
  //Xuất danh sách sinh viên còn liên quan đến thư viện
  const handleSVLQ = () => {
    //Lấy danh sách sinh viên đang mượn sách
    const DSSVDMuonSach = [];
    for (let i = 0; i < allSV.length; i++) {
      for (let j = 0; j < allBookLoanDangMuon.length; j++) {
        if (allBookLoanDangMuon[j].mssv === allSV[i].mssv) {
          DSSVDMuonSach.push(allSV[i]);
          break;
        }
      }
    }
    //Lấy danh sách sinh viên quá hạn trả sách
    const DSSVQuaHanTraSach = [];
    for (let i = 0; i < allSV.length; i++) {
      for (let j = 0; j < allBookLoanQuaHan.length; j++) {
        if (allBookLoanQuaHan[j].mssv === allSV[i].mssv) {
          DSSVQuaHanTraSach.push(allSV[i]);
          break;
        }
      }
    }
    //Kiểm tra và xuất file
    if (DSSVDMuonSach.length === 0 && DSSVQuaHanTraSach.length === 0) {
      alert("Không có sinh viên nào liên quan đến thư viện");
      return;
    } else {
      //Xuất danh sách sinh viên đang mượn hay nợ sách
      let dangMuon = [];
      //Lấy sinh viên trong danh sách mượn sách
      for (let i = 0; i < allSV.length; i++) {
        for (let j = 0; j < DSSVDMuonSach.length; j++) {
          if (DSSVDMuonSach[j].mssv === allSV[i].mssv) {
            dangMuon.push(allSV[i]);
            break;
          }
        }
      }

      let quaHan = [];
      //Lấy sinh viên trong danh sách quá hạn trả sách
      for (let i = 0; i < allSV.length; i++) {
        let flat = 0;
        for (let j = 0; j < DSSVQuaHanTraSach.length; j++) {
          if (DSSVQuaHanTraSach[j].mssv === allSV[i].mssv) {
            flat = 1;
            break;
          }
        }
        if (flat === 1) {
          for (let j = 0; j < dangMuon.length; j++) {
            if (dangMuon[j].mssv === allSV[i].mssv) {
              flat = 0;
              break;
            }
          }
        }
        if (flat === 1) {
          quaHan.push(allSV[i]);
        }
      }
      exportToExcelCLQ(dangMuon, quaHan);
      return;
    }
  };
  //Kiểm tra bằng file excel
  const handleImportExcel = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const importedData = XLSX.utils.sheet_to_json(worksheet);

      // Lấy danh sách mã số sinh viên từ file Excel
      const importedMSSV = importedData.map((row) => row["Mã số sinh viên"]);
      // Danh sách sinh viên không liên quan đến thư viện
      const unrelatedSV = importedMSSV
        .map((mssv) => {
          // Tìm trong danh sách sinh viên đang mượn hoặc quá hạn trả sách
          //Hàm some() là một phương thức trong JavaScript dùng để kiểm tra xem ít nhất một phần tử trong mảng thỏa mãn một điều kiện nào đó. Nếu có ít nhất một phần tử thỏa mãn điều kiện, hàm sẽ trả về true, ngược lại trả về false.
          const isDangMuon = allBookLoanDangMuon.some(
            (loan) => loan.mssv == mssv
          );
          const isQuaHan = allBookLoanQuaHan.some((loan) => loan.mssv == mssv);
          // console.log(isDangMuon);
          // console.log(isQuaHan);
          if (!isDangMuon && !isQuaHan) {
            // Tìm thông tin sinh viên trong hệ thống
            const sv = allSV.find((student) => student.mssv == mssv);

            // Nếu không tìm thấy trong hệ thống, tạo dữ liệu cơ bản từ mã số sinh viên
            return sv
              ? sv
              : {
                  mssv: mssv,
                  doc_gia_name: "Không có trong hệ thống",
                  gender: "N/A",
                  birthday: "N/A",
                  address: "N/A",
                  phone: "N/A",
                  email: "N/A",
                };
          } else {
            return null; // Nếu liên quan, bỏ qua
          }
        })
        .filter((sv) => sv !== null); // Loại bỏ các giá trị null

      if (unrelatedSV.length > 0) {
        exportToExcel(unrelatedSV); // Xuất file kết quả
      } else {
        alert("Không có sinh viên nào không liên quan đến thư viện.");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  //export
  // ------------------------
  //Xuất excel danh sách sinh viên không còn liên quan
  const exportToExcel = async (sv) => {
    const formattedBooks = sv.map((data) => ({
      "Mã số sinh viên": data.mssv,
      "Họ và tên": data.doc_gia_name,
      "Giới tính": data.gender,
      "Ngày sinh": data.birthday,
      "Quê quán": data.address,
      "Số điện thoại": data.phone,
      "Địa chỉ email": data.email,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedBooks);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sinh Viên");

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
      `danh-sach-khong-con-lien-quan-${day}-${
        month < 10 ? `0${month}` : month
      }-${year}.xlsx`
    );
  };
  //Xuất excel danh sách sinh viên còn liên quan
  const exportToExcelCLQ = async (dangMuon, quaHan) => {
    // Chuẩn bị dữ liệu cho sheet "Sinh viên đang mượn sách"
    const dangMuonBook = dangMuon.map((data) => ({
      "Mã số sinh viên": data.mssv,
      "Họ và tên": data.doc_gia_name,
      "Giới tính": data.gender,
      "Ngày sinh": data.birthday,
      "Quê quán": data.address,
      "Số điện thoại": data.phone,
      "Địa chỉ email": data.email,
    }));

    // Chuẩn bị dữ liệu cho sheet "Sinh viên quá hạn trả sách"
    const quaHanBook = quaHan.map((data) => ({
      "Mã số sinh viên": data.mssv,
      "Họ và tên": data.doc_gia_name,
      "Giới tính": data.gender,
      "Ngày sinh": data.birthday,
      "Quê quán": data.address,
      "Số điện thoại": data.phone,
      "Địa chỉ email": data.email,
    }));

    // Tạo workbook và thêm cả hai sheet
    const workbook = XLSX.utils.book_new();

    // Tạo và thêm sheet "Sinh viên đang mượn sách"
    const worksheetDangMuon = XLSX.utils.json_to_sheet(dangMuonBook);
    XLSX.utils.book_append_sheet(workbook, worksheetDangMuon, "Đang mượn sách");

    // Tạo và thêm sheet "Sinh viên quá hạn trả sách"
    const worksheetQuaHan = XLSX.utils.json_to_sheet(quaHanBook);
    XLSX.utils.book_append_sheet(workbook, worksheetQuaHan, "Quá hạn trả sách");

    // Xuất workbook thành file Excel
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Lưu file Excel
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    saveAs(
      data,
      `danh-sach-con-lien-quan-${day}-${
        month < 10 ? `0${month}` : month
      }-${year}.xlsx`
    );
  };

  //import excel

  return (
    <div>
      <Link to="/BaoCaoThongKe/1">
        <i className="fas fa-arrow-left iconspacing"></i>
        <button className="btn-trove">Quay lại</button>
      </Link>
      <div className="container py-5">
        <div className="text-center mb-4">
          <h2 className="text-primary">Thống Kê Sinh Viên</h2>
          <p className="text-muted">
            Quản lý danh sách sinh viên liên quan và không liên quan đến thư
            viện.
          </p>
        </div>

        <div className="card shadow p-4 mb-4">
          <h5 className="card-title text-center text-info">
            Thao tác thống kê sinh viên
          </h5>
          <div className="d-flex flex-column flex-md-row justify-content-center gap-3 mt-4">
            <button className="btn btn-primary btn-lg" onClick={handleSVKLQ}>
              Sinh viên không liên quan
            </button>
            <button
              className="btn btn-outline-secondary btn-lg"
              onClick={handleSVLQ}
            >
              Sinh viên còn liên quan
            </button>
          </div>
        </div>

        <div className="card shadow p-4">
          <h5 className="card-title text-center text-info">
            Kiểm tra từ file Excel
          </h5>
          <div className="text-center mt-4">
            <input
              type="file"
              accept=".xlsx, .xls"
              id="import-excel"
              style={{ display: "none" }}
              onChange={handleImportExcel}
            />
            <button
              className="btn btn-success btn-lg"
              onClick={() => document.getElementById("import-excel").click()}
            >
              Import File Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewThongKeSinhVien;
