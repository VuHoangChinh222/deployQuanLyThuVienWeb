import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiReader from "../../../api/apiReader";
import apiBookLoan from "../../../api/apiBookLoan";
import { useDispatch, useSelector } from "react-redux";
import ListBook from "./listBook";
import { TOTAL, CLEAR } from "../../../redux/action/cartAction";
import apiBook from "../../../api/apiBook";

function LapPhieu() {
  const getDataCart = useSelector((state) => state.cart.carts);
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const navigate = useNavigate();
  const disPatch = useDispatch();
  disPatch(TOTAL()); //Cập nhật trạng thái của total
  const [readerInfo, setReaderInfo] = useState({
    mssv: "",
    name: "",
    phone: "",
    address: "",
  });
  const [date_out, setdate_out] = useState("");
  const [phieumuons, setPhieuMuons] = useState([]);
  const [flat, setFlat] = useState();

  // console.log(getDataCart);

  useEffect(() => {
    // Lấy danh sách phiếu mượn
    apiBookLoan.getAll().then((res) => {
      try {
        const data = res.data.map((bl) => {
          return {
            id: bl.id,
            mssv: bl.mssv,
            sts: bl.sts,
          };
        });
        setPhieuMuons(data);
        console.log("asdfg", phieumuons);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách phiếu mượn:", error);
      }
    });
  }, []);

  // Hàm xử lý khi thay đổi giá trị trong form
  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    // Cập nhật trạng thái tạm thời cho trường đang nhập
    setReaderInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Nếu thay đổi "mssv", gọi API để lấy thông tin
    if (name === "mssv" && value) {
      try {
        const data = await apiReader.getDetailReaderByMSSV(value);
        if (data.data[0]) {
          const reader = data.data[0]; // Lấy độc giả đầu tiên
          setReaderInfo({
            mssv: reader.mssv,
            name: reader.doc_gia_name,
            phone: reader.phone,
            address: reader.address,
            documentId: reader.documentId,
            id: reader.id, // Lưu id độc giả để sử dụng
          });
          const ktPM = phieumuons.some(
            (v) => v.mssv === reader.mssv && (v.sts === "1" || v.sts === "2")
          );
          setFlat(0);
          if (ktPM) {
            setFlat(1);
            alert("Sinh viên chưa trả sách đã mượn.");
            return;
          }
        } else {
          // Nếu không tìm thấy, chỉ giữ giá trị "mssv"
          setReaderInfo((prev) => ({
            ...prev,
            name: "",
            phone: "",
            address: "",
            documentId: null,
            id: null,
          }));
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin độc giả:", error);
      }
    }
  };

  // Hàm xử lý khi thay đổi ngày trả
  const handleDateChange = (e) => {
    setdate_out(e.target.value);
  };

  // Hàm xử lý khi nhấn "Lập phiếu"
  const handleSubmit = async (e) => {
    e.preventDefault();

    const date_entry = new Date().toISOString().split("T")[0]; // Ngày hiện tại (yyyy-mm-dd)
    if (new Date(date_out) < new Date(date_entry)) {
      alert("Ngày trả phải lớn hơn hoặc bằng ngày hiện tại.");
      return;
    }
    try {
      const borrowingData = {
        mssv: readerInfo.mssv,
        nhan_vien_documentId: "ptiyy2q0bqc62c3w1yrwwa2h",
        date_entry,
        date_out,
        sts: "1",
      };

      const response = await apiBookLoan.createBookLoan({
        data: borrowingData,
      });

      //Lấy DocumentId của phiếu mượn ms thêm
      const currentBookLoanDocumentId =
        await apiBookLoan.getCurrentBookLoanDocumentId(
          borrowingData.nhan_vien_documentId,
          borrowingData.mssv
        );
      // console.log(currentBookLoanDocumentId);

      const borrowDetailData = getDataCart.map((e) => {
        return {
          phieu_muon_documentId: currentBookLoanDocumentId.data[0].documentId,
          sach_documentId: e.documentationId,
          quantity: e.quantity,
          price: e.price * 0.1,
        };
      });

      borrowDetailData.map((e) => {
        return apiBookLoan.createBookLoanDetail({ data: e });
      });

      //Code chức năng khi thêm xong BookLoanDetail thì sẽ trừ đi "quantity" của sách tương ứng
      for (const detail of borrowDetailData) {
        const currentQuantity = await apiBook.getBookById(
          detail.sach_documentId
        );
        const bookData = {
          quantity: currentQuantity.data.data.quantity - detail.quantity,
        };
        // console.log(bookData);
        await apiBook.updateBook(detail.sach_documentId, { data: bookData }); // Cập nhật số lượng sách
      }
      disPatch(CLEAR());
      navigate("/QuanLyMuonTraSach/1");
    } catch (e) {
      console.log("Error", e);
    }
  };
  const btnLoc = (mssv) => {
    navigate(`/Loc/${mssv}`);
  };

  return (
    <div className="container py-5">
      <h3 className="text-center text-primary mb-4">
        <strong>Lập Phiếu Mượn Sách</strong>
      </h3>
      <div className="row">
        <div className="col-md-8">
          <table className="table table-striped table-bordered">
            <thead>
              <tr className="text-center">
                <th>Hình ảnh</th>
                <th>Tên sách</th>
                <th>Tác giả</th>
                <th>Thể loại</th>
                <th>Nhà xuất bản</th>
                <th>Đơn giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
                <th>Xóa</th>
              </tr>
            </thead>
            <tbody>
              {getDataCart.map((e) => {
                return <ListBook item={e} key={e.documentationId} />;
              })}
              <tr>
                <th colSpan={6}>Tổng tiền</th>
                <th
                  style={{ textAlign: "right" }}
                  colSpan={3}
                  className="text-center"
                >
                  {totalAmount.toLocaleString()} VND
                </th>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Form thông tin người mượn */}
        <div className="col-md-4">
          <h4 className="text-secondary">Thông Tin Người Mượn</h4>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="mssv">Mã số sinh viên</label>
              <input
                type="text"
                id="mssv"
                name="mssv"
                className="form-control"
                value={readerInfo.mssv}
                onChange={handleInputChange}
                required
                placeholder="Nhập mã số sinh viên"
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="name">Họ và tên</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                value={readerInfo.name}
                disabled
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="phone">Số điện thoại</label>
              <input
                type="text"
                id="phone"
                name="phone"
                className="form-control"
                value={readerInfo.phone}
                disabled
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="address">Địa chỉ</label>
              <input
                type="text"
                id="address"
                name="address"
                className="form-control"
                value={readerInfo.address}
                disabled
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="date_out">Ngày trả</label>
              <input
                type="date"
                id="date_out"
                name="date_out"
                className="form-control"
                value={date_out}
                onChange={handleDateChange}
                required
              />
            </div>
            <div className="form-actions d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => btnLoc(readerInfo.mssv)}
              >
                Xem phiếu mượn
              </button>
              {totalAmount > 0 && flat === 0 ? (
                <button type="submit" className="btn btn-primary">
                  Lập phiếu
                </button>
              ) : (
                <button type="submit" className="btn btn-primary" disabled>
                  Lập phiếu
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LapPhieu;
