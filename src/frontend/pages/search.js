import { useEffect, useState } from "react";
import apiBook from "../../api/apiBook";
import { Link, useParams } from "react-router-dom";
import { imageURL } from "../../api/config";
import { useDispatch } from "react-redux";
import { ADD } from "../../redux/action/cartAction";
import apiAuthor from "../../api/apiAuthor";
import apiBookLoan from "../../api/apiBookLoan";
import apiGenre from "../../api/apiGenre";
import apiPublisher from "../../api/apiPublisher";
function SearchBook() {
  const disPatch = useDispatch();
  const { data } = useParams();
  const [saches, setSaches] = useState([]);
  const [delBookItem, setDelBookItem] = useState(false);
  const [pages, setPages] = useState(1);
  const page = parseInt(useParams().page); //Lấy page từ url
  const limit = 10; //Mỗi trang sẽ có 5 sản phẩm
  const [amountItem, setAmountItem] = useState(1);
  const [checkAddToCart, setCheckAddToCart] = useState(false);
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [bookLoan, setBookLoan] = useState([]);
  const [bookLoanDetail, setBookLoanDetail] = useState([]);

  //Xu ly tac gia
  useEffect(() => {
    // Lấy danh sách tác giả từ API
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
  }, []);

  const getAuthorNames = (documentIds) => {
    // Tách các documentId từ chuỗi
    const documentIdArray = documentIds.split(",");
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

  //Xu ly the loai
  useEffect(() => {
    // Lấy danh sách tác giả từ API
    apiGenre.getBySts(1).then((res) => {
      try {
        const genreData = res.data.map((item) => ({
          id: item.id,
          documentId: item.documentId,
          name: item.name,
        }));
        setGenres(genreData);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách thể loại:", err);
      }
    });
  }, []);

  const getGenreNames = (documentIds) => {
    // Tách các documentId từ chuỗi
    const documentIdArray = documentIds.split(",");
    // console.log(documentIdArray);
    // Lọc danh sách tên tác giả dựa trên documentId
    const genreName = documentIdArray
      .map((docId) => {
        const genre = genres.find((item) => item.documentId === docId.trim());
        return genre ? genre.name : null;
      })
      .filter((name) => name !== null); // Bỏ qua các tên không tìm thấy
    return genreName.join(", "); // Ghép lại thành chuỗi
  };

  //Xu ly nha xuat ban
  useEffect(() => {
    // Lấy danh sách tác giả từ API
    apiPublisher.getBySts(1).then((res) => {
      try {
        const publishersData = res.data.map((item) => ({
          id: item.id,
          documentId: item.documentId,
          name: item.name,
        }));
        setPublishers(publishersData);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách nhà xuất bản:", err);
      }
    });
  }, []);

  const getPublisherNames = (documentIds) => {
    // Tách các documentId từ chuỗi
    const documentIdArray = documentIds.split(",");
    // console.log(documentIdArray);
    // Lọc danh sách tên tác giả dựa trên documentId
    const publisherNames = documentIdArray
      .map((docId) => {
        const publisher = publishers.find(
          (item) => item.documentId === docId.trim()
        );
        return publisher ? publisher.name : null;
      })
      .filter((name) => name !== null); // Bỏ qua các tên không tìm thấy
    return publisherNames.join(", "); // Ghép lại thành chuỗi
  };

  //Xu ly phieu muon
  //Lay danh sach chi tiet phieu muon
  useEffect(() => {
    // Lấy danh sách tác giả từ API
    apiBookLoan.getBookLoanBySts(1).then((res) => {
      try {
        const bookLoanData = res.data.map((item) => ({
          id: item.id,
          documentId: item.documentId,
        }));
        setBookLoan(bookLoanData);
        // console.log(bookLoanData);
      } catch (err) {
        console.error("Lỗi:", err);
      }
    });
  }, []);
  //Lay chi tiet phieu muon
  useEffect(() => {
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
  }, []);

  //Xu ly sach
  useEffect(() => {
    apiBook.searchBookPagination(data, page, limit).then((res) => {
      try {
        const numberOfPages = Math.ceil(
          res.meta.pagination.total / res.meta.pagination.pageSize
        );
        setPages(numberOfPages);
        const bookData = res.data.map((book) => {
          return {
            id: book.id,
            documentationId: book.documentId,
            name: book.sach_name,
            price: book.price,
            image: book.image?.url || "",
            tac_gia_documentId: book.tac_gia_documentId,
            the_loai_documentId: book.the_loai_documentId,
            nha_xuat_ban_documentId: book.nha_xuat_ban_documentId,
            quantity: book.quantity,
            sts: book.sts,
          };
        });
        console.log(bookData);
        setSaches(bookData);
      } catch (err) {
        console.log("Error: ", err);
      }
    });
  }, [delBookItem, page, data]);

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
    console.log(flat);
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

  return (
    <div className="container mt-5">
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
            placeholder="Tìm kiếm sách theo tên..."
          />
        </div>
        <div className="col-md-4">
          <button className="btn btn-primary w-100">Tìm kiếm</button>
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
              <th>Nhà xuất bản</th>
              <th>Số lượng</th>
              <th>Giá sách</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {saches.map((book, index) => (
              <tr key={index}>
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
                <td>{book.name}</td>
                <td>{getAuthorNames(book.tac_gia_documentId)}</td>
                <td>{getGenreNames(book.the_loai_documentId)}</td>
                <td>{getPublisherNames(book.nha_xuat_ban_documentId)}</td>
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
                        disabled
                        onClick={() => delBook(book.documentationId)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    )}
                    {parseInt(book.quantity, 10) <= 10 || book.sts === "0" ? (
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
    </div>
  );
}
export default SearchBook;
