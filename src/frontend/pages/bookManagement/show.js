import { useEffect, useState } from "react";
import apiBook from "../../../api/apiBook";
import { Link, useParams } from "react-router-dom";
import { imageURL } from "../../../api/config";
import { useDispatch } from "react-redux";
import { ADD } from "../../../redux/action/cartAction";
import apiAuthor from "../../../api/apiAuthor";
import apiBookLoan from "../../../api/apiBookLoan";
import apiPublisher from "../../../api/apiPublisher";
import apiGenre from "../../../api/apiGenre";

import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import Fuse from "fuse.js";

function ShowBookManagement() {
  const disPatch = useDispatch();
  //Lay tat ca sach va phan trang
  const [saches, setSaches] = useState([]);

  const [delBookItem, setDelBookItem] = useState(false);
  const [pages, setPages] = useState(1);
  const page = parseInt(useParams().page); //Lấy page từ url
  const limit = 10; //Mỗi trang sẽ có 10 sản phẩm
  const [amountItem, setAmountItem] = useState(1);
  const [checkAddToCart, setCheckAddToCart] = useState(false);
  const [authors, setAuthors] = useState([]);
  const [NXBs, setNXBs] = useState([]);
  const [bookLoan, setBookLoan] = useState([]);
  const [bookLoanDetail, setBookLoanDetail] = useState([]);

  //tìm kiếm
  const [books, setBooks] = useState([]);
  const [theloais, setTheLoais] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [timKiemKetQua, setTimKiemKetQua] = useState([]);
  const [searchType, setSearchType] = useState("sach"); // Loại tìm kiếm mặc định là sách

  //lấy tên nhà xuất bản
  const getNXBNames = (documentIds) => {
    // Tách các documentId từ chuỗi
    const documentIdArray = (documentIds || "").split(",");
    // console.log(documentIdArray);
    // Lọc danh sách tên tác giả dựa trên documentId
    const NXBNames = documentIdArray
      .map((docId) => {
        const NXB = NXBs.find((item) => item.documentId === docId.trim());
        return NXB ? NXB.name : null;
      })
      .filter((name) => name !== null); // Bỏ qua các tên không tìm thấy
    return NXBNames.join(", "); // Ghép lại thành chuỗi
  };
  //lấy tên tá giả
  const getAuthorNames = (documentIds) => {
    // Tách các documentId từ chuỗi
    const documentIdArray = (documentIds || "").split(",");
    // console.log(documentIdArray);
    // Lọc danh sách tên tác giả dựa trên documentId
    const authorNames = documentIdArray
      .map((docId) => {
        const author = authors.find((item) => item.documentId === docId.trim());
        return author ? author.name : null;
      })
      .filter((name) => name !== null); // Bỏ qua các tên không tìm thấy
    return authorNames.join(", "); // Ghép lại thành chuỗi
  };
  //lấy tên thể loại
  const getTheLoaiNames = (documentIds) => {
    // Tách các documentId từ chuỗi
    const documentIdArray = (documentIds || "").split(",");
    // console.log(documentIdArray);
    // Lọc danh sách tên thể loại dựa trên documentId
    const theloaiNames = documentIdArray
      .map((docId) => {
        const theloai = theloais.find(
          (item) => item.documentId === docId.trim()
        );
        return theloai ? theloai.name : null;
      })
      .filter((name) => name !== null); // Bỏ qua các tên không tìm thấy
    return theloaiNames.join(", "); // Ghép lại thành chuỗi
  };

  // Hàm tìm kiếm tổng quát
  const handleSearch = (event) => {
    const tim = event.target.value;
    setSearchText(tim);

    if (!tim.trim()) {
      setTimKiemKetQua([]);
      return;
    }

    let data = [];
    let searchKey = "";
    let dataset = [];

    switch (searchType) {
      case "sach":
        searchKey = "sach_name";
        dataset = books;
        break;
      case "tacgia":
        searchKey = "name";
        dataset = authors;
        break;
      case "nxb":
        searchKey = "name";
        dataset = NXBs;
        break;
      case "theloai":
        searchKey = "name";
        dataset = theloais;
        break;
      default:
        break;
    }

    // Sử dụng Fuse.js để tìm kiếm
    const fuse = new Fuse(dataset, {
      keys: [searchKey],
      includeScore: true,
      threshold: 0.3,
    });
    const result = fuse.search(tim).map((r) => r.item);

    if (
      searchType === "tacgia" ||
      searchType === "nxb" ||
      searchType === "theloai"
    ) {
      const documentIds = result.map((r) => r.documentId);
      for (let i = 0; i < documentIds.length; i++) {
        const loc = books.filter((b) => {
          const ids = (
            searchType === "tacgia"
              ? b.tac_gia_documentId
              : searchType === "nxb"
              ? b.nha_xuat_ban_documentId
              : b.the_loai_documentId || ""
          ).split(",");
          return ids.includes(documentIds[i]);
        });
        data = [...data, ...loc];
      }
    } else {
      data = result;
    }

    setTimKiemKetQua(data);
  };

  // Hàm thay đổi loại tìm kiếm
  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    setSearchText(""); // Reset input khi thay đổi loại tìm kiếm
    setTimKiemKetQua([]); // Xóa kết quả tìm kiếm cũ
  };

  useEffect(() => {
    // Lấy danh sách tác giả
    apiAuthor.getBySts(1).then((res) => {
      try {
        const authorData = res.data.map((item) => ({
          id: item.id,
          documentId: item.documentId,
          name: item.name,
        }));
        setAuthors(authorData);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách tác giả:", err);
      }
    });
    // Lấy danh sách NXB
    apiPublisher.getBySts(1).then((res) => {
      try {
        const NXBData = res.data.map((item) => ({
          id: item.id,
          documentId: item.documentId,
          name: item.name,
        }));
        setNXBs(NXBData);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách tác giả:", err);
      }
    });
    //Lay danh sach the loai
    apiGenre.getBySts(1).then((res) => {
      try {
        const theloaiData = res.data.map((item) => ({
          id: item.id,
          documentId: item.documentId,
          name: item.name,
        }));
        setTheLoais(theloaiData);
      } catch (err) {
        console.log("Lỗi:", err);
      }
    });
    //Lay chi tiet phieu muon
    apiBookLoan.getAllBookLoanDetail().then((res) => {
      try {
        const bookLoanDetailData = res.data.map((item) => ({
          id: item.id,
          documentId: item.documentId,
          phieu_muon_documentId: item.phieu_muon_documentId,
          sach_documentId: item.sach_documentId,
        }));
        setBookLoanDetail(bookLoanDetailData);
        // console.log(bookLoanDetailData);
      } catch (err) {
        console.error("Lỗi:", err);
      }
    });
    // Lấy danh sách phiếu mượn
    apiBookLoan.getBookLoanBySts(1).then((res) => {
      try {
        const bookLoanData = res.data.map((item) => ({
          id: item.id,
          documentId: item.documentId,
        }));
        setBookLoan(bookLoanData);
      } catch (err) {
        console.error("Lỗi:", err);
      }
    });
    //Lấy tất cả sách
    apiBook.getAll().then((res) => {
      try {
        const bookData = res.data.map((book) => {
          return {
            id: book.id,
            documentationId: book.documentId,
            sach_name: book.sach_name,
            price: book.price,
            description: book.description,
            image: book.image.url,
            tac_gia_documentId: book.tac_gia_documentId,
            the_loai_documentId: book.the_loai_documentId,
            nha_xuat_ban_documentId: book.nha_xuat_ban_documentId,
            quantity: book.quantity,
            sts: book.sts,
          };
        });
        // console.log(bookData);
        setBooks(bookData);
      } catch (err) {
        console.log("Error: ", err);
      }
    });

    //Xử lý sách có phân trang
    apiBook.getBookPagination(page, limit).then((res) => {
      try {
        const numberOfPages = Math.ceil(
          res.meta.pagination.total / res.meta.pagination.pageSize
        );
        setPages(numberOfPages);
        const bookData = res.data.map((book) => {
          return {
            id: book.id,
            documentationId: book.documentId,
            sach_name: book.sach_name,
            price: book.price,
            description: book.description,
            image: book.image.url,
            tac_gia_documentId: book.tac_gia_documentId,
            the_loai_documentId: book.the_loai_documentId,
            nha_xuat_ban_documentId: book.nha_xuat_ban_documentId,
            quantity: book.quantity,
            sts: book.sts,
          };
        });
        // console.log(bookData);
        setSaches(bookData);
      } catch (err) {
        console.log("Error: ", err);
      }
    });
  }, [delBookItem, page]);

  //Xoa sach
  const delBook = async (id) => {
    //Kiểm tra xem có sách nào đang được lưu trong chi tiết phiếu mượn mới nhất không
    const documentIdBLD = bookLoanDetail.find(
      (item) => item.sach_documentId === id
    )?.phieu_muon_documentId;
    // console.log(documentIdBLD);
    // Kiểm tra phiếu mượn có phải sts=1 thông qua chi tiết phiếu mượn
    const flat = bookLoan.find((item) => item.documentId === documentIdBLD)
      ? 1
      : 0;
    // console.log(flat);
    if (flat === 0) {
      const confirmDelete = window.confirm(
        "Bạn có chắc chắn muốn xóa sách này không?"
      );
      if (confirmDelete) {
        apiBook.delBookById(id).then((res) => {
          try {
            alert("Xóa sách thành công");
            setDelBookItem(id);
          } catch (e) {
            console.log(e);
          }
        });
      }
    } else {
      alert("Sách đang được mượn");
    }
  };

  //Thêm sản phẩm vào giỏ hàng
  const handleAddToCart = (amountItem, index) => {
    // document.getElementById(bookId).style.backgroundColor = "#FFFF66";
    const product = {
      ...saches[index],
      amount: amountItem,
    };
    if (product.sts === "1") {
      disPatch(ADD(product));
      saches[index].quantity -= 1;
      setCheckAddToCart(saches[index].quantity - 1);
    }
    // ADD(product);
  };

  //export
  const exportToExcel = async (b) => {
    const formattedBooks = await b.map((book) => ({
      sach_name: book.sach_name,
      price: book.price,
      description: book.description,
      image: book.image.url,
      tac_gia_documentId: book.tac_gia_documentId,
      the_loai_documentId: book.the_loai_documentId,
      nha_xuat_ban_documentId: book.nha_xuat_ban_documentId,
      quantity: book.quantity,
      sts: book.sts,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedBooks);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Books");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `sach-trang-${page}.xlsx`);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-end mb-4">
        <button
          className="btn btn-success text-right"
          onClick={() => exportToExcel(saches)}
        >
          Xuất file Excel
        </button>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-primary">Quản Lý Kho Sách</h1>
        <Link className="btn btn-success" to="/QuanLyKhoSach/Them">
          Thêm Sách
        </Link>
      </div>

      <div className="row mb-3">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control"
            placeholder={`Tìm kiếm ${
              searchType === "sach"
                ? "sách"
                : searchType === "tacgia"
                ? "tác giả"
                : searchType === "nxb"
                ? "nhà xuất bản"
                : "thể loại"
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
            <option value="sach">Tên sách</option>
            <option value="tacgia">Tác giả</option>
            <option value="nxb">Nhà xuất bản</option>
            <option value="theloai">Thể loại</option>
          </select>
        </div>
      </div>
      <div className="card shadow-sm">
        <table className="table table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Hình ảnh</th>
              <th>Tên sách</th>
              <th>Tác giả</th>
              <th>Thể loại</th>
              <th style={{ width: "8rem" }}>Nhà xuất bản</th>
              <th style={{ width: "8rem" }}>Số lượng</th>
              <th style={{ width: "8rem" }}>Giá sách</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {timKiemKetQua.length > 0
              ? timKiemKetQua.map((book, index) => (
                  <tr key={index} id={book.id}>
                    <td>{book.id}</td>
                    <td>
                      <img
                        className="img-thumbnail"
                        src={imageURL + book.image}
                        alt={book.name}
                        style={{
                          height: "80px",
                          width: "80px",
                          objectFit: "cover",
                        }}
                      />
                    </td>
                    <td>{book.sach_name}</td>
                    <td>{getAuthorNames(book.tac_gia_documentId)}</td>
                    <td>{getTheLoaiNames(book.the_loai_documentId)}</td>
                    <td>{getNXBNames(book.nha_xuat_ban_documentId)}</td>
                    <td>{book.quantity}</td>
                    <td>{book.price}</td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center align-items-center gap-2">
                        <button
                          className={`btn btn-link btn-sm text-decoration-none ${
                            book.sts === "1" ? "text-success" : "text-muted"
                          }`}
                          title={book.sts === "1" ? "Đang hiển thị" : "Đang ẩn"}
                        >
                          <i
                            className={`fas ${
                              book.sts === "1" ? "fa-eye" : "fa-eye-slash"
                            }`}
                          ></i>
                        </button>
                        <Link
                          to={`/QuanLyKhoSach/Sua/${book.documentationId}`}
                          className="btn btn-warning btn-sm"
                        >
                          <i className="fas fa-edit"></i>
                        </Link>
                        {book.sts === "1" ? (
                          <button className="btn btn-danger btn-sm" disabled>
                            <i className="fas fa-trash"></i>
                          </button>
                        ) : (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => delBook(book.documentationId)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        )}

                        {parseInt(book.quantity, 10) <= 10 ||
                        book.sts === "0" ? (
                          <button
                            className="btn btn-primary btn-sm shadow-0 me-1"
                            disabled
                          >
                            <i className="fas fa-solid fa-plus"></i>
                          </button>
                        ) : (
                          <button
                            className="btn btn-primary btn-sm shadow-0 me-1"
                            onClick={() => handleAddToCart(amountItem, index)}
                          >
                            <i className="fas fa-solid fa-plus"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              : saches.map((book, index) => (
                  <tr key={index} id={book.id}>
                    <td>{book.id}</td>
                    <td>
                      <img
                        className="img-thumbnail"
                        src={imageURL + book.image}
                        alt={book.name}
                        style={{
                          height: "80px",
                          width: "80px",
                          objectFit: "cover",
                        }}
                      />
                    </td>
                    <td>{book.sach_name}</td>
                    <td>{getAuthorNames(book.tac_gia_documentId)}</td>
                    <td>{getTheLoaiNames(book.the_loai_documentId)}</td>
                    <td>{getNXBNames(book.nha_xuat_ban_documentId)}</td>
                    <td>{book.quantity}</td>
                    <td>{book.price}</td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center align-items-center gap-2">
                        <button
                          className={`btn btn-link btn-sm text-decoration-none ${
                            book.sts === "1" ? "text-success" : "text-muted"
                          }`}
                          title={book.sts === "1" ? "Đang hiển thị" : "Đang ẩn"}
                        >
                          <i
                            className={`fas ${
                              book.sts === "1" ? "fa-eye" : "fa-eye-slash"
                            }`}
                          ></i>
                        </button>
                        <Link
                          to={`/QuanLyKhoSach/Sua/${book.documentationId}`}
                          className="btn btn-warning btn-sm"
                        >
                          <i className="fas fa-edit"></i>
                        </Link>
                        {book.sts === "1" ? (
                          <button className="btn btn-danger btn-sm" disabled>
                            <i className="fas fa-trash"></i>
                          </button>
                        ) : (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => delBook(book.documentationId)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        )}
                        {parseInt(book.quantity, 10) <= 10 ||
                        book.sts === "0" ? (
                          <button
                            className="btn btn-primary btn-sm shadow-0 me-1"
                            disabled
                          >
                            <i className="fas fa-solid fa-plus"></i>
                          </button>
                        ) : (
                          <button
                            className="btn btn-primary btn-sm shadow-0 me-1"
                            onClick={() => handleAddToCart(amountItem, index)}
                          >
                            <i className="fas fa-solid fa-plus"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      {timKiemKetQua.length <= 0 ? (
        <nav className="mt-4">
          <ul className="pagination justify-content-center">
            {Array.from({ length: pages }, (_, i) => (
              <li
                key={i}
                className={`page-item ${page === i + 1 ? "active" : ""}`}
              >
                <Link className="page-link" to={`/QuanLyKhoSach/${i + 1}`}>
                  {i + 1}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
export default ShowBookManagement;
