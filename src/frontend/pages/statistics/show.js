import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import apiBook from "../../../api/apiBook";
import apiBookLoan from "../../../api/apiBookLoan";
import apiPublisher from "../../../api/apiPublisher";
import apiGenre from "../../../api/apiGenre";
import apiAuthor from "../../../api/apiAuthor";
import { imageURL } from "../../../api/config";
function ShowStatistics() {
  const [saches, setSaches] = useState([]);
  const [theloais, setTheLoais] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [NXBs, setNXBs] = useState([]);
  const [bookLoanDetail, setBookLoanDetail] = useState([]);
  const [bookStatistics, setBookStatistics] = useState([]);
  const [pages, setPages] = useState(1);

  const page = parseInt(useParams().page); // Lấy page từ URL
  const limit = 10; // Mỗi trang sẽ có 10 sản phẩm

  // Lấy dữ liệu từ API
  useEffect(() => {
    // Lấy danh sách tác giả
    apiAuthor.getBySts(1).then((res) => {
      const authorData = res.data.map((item) => ({
        id: item.id,
        documentId: item.documentId,
        name: item.name,
      }));
      setAuthors(authorData);
    });

    // Lấy danh sách nhà xuất bản
    apiPublisher.getBySts(1).then((res) => {
      const NXBData = res.data.map((item) => ({
        id: item.id,
        documentId: item.documentId,
        name: item.name,
      }));
      setNXBs(NXBData);
    });

    // Lấy danh sách thể loại
    apiGenre.getBySts(1).then((res) => {
      const theloaiData = res.data.map((item) => ({
        id: item.id,
        documentId: item.documentId,
        name: item.name,
      }));
      setTheLoais(theloaiData);
    });

    // Lấy chi tiết phiếu mượn
    apiBookLoan.getAllBookLoanDetail().then((res) => {
      const bookLoanDetailData = res.data.map((item) => ({
        id: item.id,
        documentId: item.documentId,
        phieu_muon_documentId: item.phieu_muon_documentId,
        sach_documentId: item.sach_documentId,
        quantity: item.quantity, // Lấy thêm quantity nếu có
      }));
      setBookLoanDetail(bookLoanDetailData);
    });

    // Lấy danh sách sách có phân trang
    apiBook.getBookPagination(page, limit).then((res) => {
      const numberOfPages = Math.ceil(
        res.meta.pagination.total / res.meta.pagination.pageSize
      );
      setPages(numberOfPages);
      const bookData = res.data.map((book) => ({
        id: book.id,
        documentId: book.documentId,
        sach_name: book.sach_name,
        price: book.price,
        description: book.description,
        image: book.image.url,
        tac_gia_documentId: book.tac_gia_documentId,
        the_loai_documentId: book.the_loai_documentId,
        nha_xuat_ban_documentId: book.nha_xuat_ban_documentId,
        quantity: book.quantity,
        createdAt: book.createdAt,
        sts: book.sts,
      }));
      setSaches(bookData);
    });
  }, [page]);

  // Tính toán thống kê sách
  useEffect(() => {
    const calculateStatistics = () => {
      return saches.map((book) => {
        const loansForBook = bookLoanDetail.filter(
          (loan) => loan.sach_documentId === book.documentId
        );
        const totalQuantity = loansForBook.reduce(
          (sum, loan) => parseInt(sum) + parseInt(loan.quantity || 0), // Tổng số lượng mượn
          0
        );
        const loanCount = loansForBook.length; // Số lần mượn

        return {
          ...book,
          totalQuantity,
          loanCount,
        };
      });
    };

    setBookStatistics(calculateStatistics());
  }, [saches, bookLoanDetail]);

  // Các hàm lấy tên
  const getNXBNames = (documentIds) => {
    const documentIdArray = (documentIds || "").split(",");
    const NXBNames = documentIdArray
      .map((docId) => {
        const NXB = NXBs.find((item) => item.documentId === docId.trim());
        return NXB ? NXB.name : null;
      })
      .filter((name) => name !== null);
    return NXBNames.join(", ");
  };

  const getAuthorNames = (documentIds) => {
    const documentIdArray = (documentIds || "").split(",");
    const authorNames = documentIdArray
      .map((docId) => {
        const author = authors.find((item) => item.documentId === docId.trim());
        return author ? author.name : null;
      })
      .filter((name) => name !== null);
    return authorNames.join(", ");
  };

  const getTheLoaiNames = (documentIds) => {
    const documentIdArray = (documentIds || "").split(",");
    const theloaiNames = documentIdArray
      .map((docId) => {
        const theloai = theloais.find(
          (item) => item.documentId === docId.trim()
        );
        return theloai ? theloai.name : null;
      })
      .filter((name) => name !== null);
    return theloaiNames.join(", ");
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center text-primary mb-4">
        <strong>Báo cáo thống kê</strong>
      </h3>
      <div className="status-bar mb-3 text-center">
        <Link
          to="/BaoCaoThongKe/viewThongKeSachMuon"
          className="btn btn-primary mx-2"
        >
          Thống kê sách mượn
        </Link>
        <Link
          to="/BaoCaoThongKe/ThongKePhieuMuon"
          className="btn btn-success mx-2"
        >
          Thống kê phiếu mượn
        </Link>
        <Link
          to="/BaoCaoThongKe/ThongKeSinhVien"
          className="btn btn-warning mx-2"
        >
          Thống kê sinh viên
        </Link>
      </div>
      <div className="card shadow-sm">
        <div className="card-body">
          <table className="table table-hover">
            <thead className="thead-dark">
              <tr>
                <th>Mã sách</th>
                <th>Hình ảnh</th>
                <th>Tên sách</th>
                <th>Tác giả</th>
                <th>Thể loại</th>
                <th>Nhà xuất bản</th>
                <th>Giá mượn</th>
                <th>Số lượng mượn</th>
                <th>Số lần mượn</th>
              </tr>
            </thead>
            <tbody>
              {bookStatistics.map((book) => (
                <tr key={book.id}>
                  <td>{book.id}</td>
                  <td>
                    <img
                      src={imageURL + book.image}
                      alt={book.name}
                      className="img-thumbnail"
                      style={{ height: "80px", width: "80px" }}
                    />
                  </td>
                  <td>{book.sach_name}</td>
                  <td>{getAuthorNames(book.tac_gia_documentId)}</td>
                  <td>{getTheLoaiNames(book.the_loai_documentId)}</td>
                  <td>{getNXBNames(book.nha_xuat_ban_documentId)}</td>
                  <td>{Math.round(book.price * 0.1)} VND</td>
                  <td>{book.totalQuantity}</td>
                  <td>{book.loanCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <nav className="mt-4">
        <ul className="pagination justify-content-center">
          {Array.from({ length: pages }, (_, i) => (
            <li
              key={i}
              className={`page-item ${page === i + 1 ? "active" : ""}`}
            >
              <Link className="page-link" to={`/BaoCaoThongKe/${i + 1}`}>
                {i + 1}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default ShowStatistics;
