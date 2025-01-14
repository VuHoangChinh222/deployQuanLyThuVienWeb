import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiBook from "../../../api/apiBook";
import apiReader from "../../../api/apiReader";
import apiBookLoan from "../../../api/apiBookLoan";
import apiSystem from "../../../api/apiSystem";
import apiGenre from "../../../api/apiGenre";
import apiAuthor from "../../../api/apiAuthor";
import { imageURL } from "../../../api/config";

function Home() {
  const [saches, setSaches] = useState([]);
  const [docgias, setDocGias] = useState([]);
  const [phieumuons, setPhieuMuons] = useState([]);
  const [taikhoans, setTaiKhoans] = useState([]);
  const [vaitros, setVaiTros] = useState([]);
  const [tongSach, setTongSach] = useState(0); // Tổng số sách
  const [tongDocGia, setTongDocGia] = useState(0); // Tổng số độc giả
  const [tongPhieu, setTongPhieu] = useState(0); // Tổng số Phiếu
  const [tongTaiKhoan, setTongTaiKhoan] = useState(0); // Tổng số tài khoản
  const [authors, setAuthors] = useState([]);
  const [theloais, setTheLoais] = useState([]);
  const [sachNew, setSachNew] = useState([]);

  useEffect(() => {
    //số sách
    apiBook.getBookPagination(1, 100000000000).then((res) => {
      try {
        const bookData = res.data.map((book) => {
          return {
            id: book.id,
            sts: book.sts,
          };
        });
        // console.log(bookData);
        setSaches(bookData);
        setTongSach(bookData.filter((book) => book.sts === "1").length);
      } catch (err) {
        console.log("Error: ", err);
      }
    });
    //số độc giả
    apiReader.getReaderPagination(1, 100000000000000).then((res) => {
      try {
        const readerData = res.data.map((reader) => {
          return {
            id: reader.id,
            sts: reader.sts,
          };
        });
        // console.log(readerData);
        setDocGias(readerData);
        setTongDocGia(readerData.filter((reader) => reader.sts === "1").length);
      } catch (err) {
        console.log("Error: ", err);
      }
    });
    //số tài khoản
    apiSystem.getSystemPagination(1, 100000000000000).then((res) => {
      try {
        const systemData = res.data.map((system) => {
          return {
            id: system.id,
            sts: system.sts,
            vai_tro_name: system.vai_tro_name,
            email: system.email,
            image: system.image?.url || "",
          };
        });
        // console.log(systemData);
        setTaiKhoans(systemData);
        setTongTaiKhoan(systemData.length);
        // .filter((system) => system.sts === "1")
      } catch (err) {
        console.log("Error: ", err);
      }
    });
    // apiRole.getAll().then((res) => {
    //   try {
    //     const roleData = res.data.map((role) => {
    //       return {
    //         id: role.id,
    //         sts: role.sts,
    //         vai_tro_name: role.vai_tro_name,
    //       };
    //     });
    //     // console.log(roleData);
    //     setVaiTros(roleData);
    //   } catch (err) {
    //     console.log("Error: ", err);
    //   }
    // });
    //số phiếu
    apiBookLoan.getBookLoanPagination(1, 1000000000000000000).then((res) => {
      try {
        const bookLData = res.data.map((bookL) => {
          return {
            id: bookL.id,
            sts: bookL.sts,
          };
        });
        // console.log(bookLData);
        setPhieuMuons(bookLData);
        setTongPhieu(bookLData.filter((bookL) => bookL.sts === "1").length);
      } catch (err) {
        console.log("Error: ", err);
      }
    });
    //lấy sách mới
    apiBook.getNew().then((res) => {
      try {
        const bookData = res.data.map((book) => {
          return {
            sach_name: book.sach_name,
            tac_gia_documentId: book.tac_gia_documentId,
            the_loai_documentId: book.the_loai_documentId,
          };
        });
        // console.log(bookData);
        setSachNew(bookData);
      } catch (err) {
        console.log("Error: ", err);
      }
    });
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
  }, []);

  // Lấy tên tác giả dựa trên documentId
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
  // Lấy tên thể loại dựa trên documentId
  const getTheLoaiNames = (documentIds) => {
    // Tách các documentId từ chuỗi
    const documentIdArray = documentIds.split(",");
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

  return (
    <div>
      <div className="container-fluid">
        {/* Thống kê */}
        <div className="row mb-4">
          <div className="col-lg-3 col-6">
            <div className="small-box bg-info">
              <Link
                className="inner"
                to="/QuanLyDocGia/1"
                style={{ textDecoration: "none" }}
              >
                <h3>{tongDocGia}</h3>
                <p>Độc giả</p>
              </Link>
              <div className="icon">
                <i className="fas fa-users"></i>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-6">
            <div className="small-box bg-success">
              <Link
                className="inner"
                to="/QuanLyKhoSach/1"
                style={{ textDecoration: "none" }}
              >
                <h3>{tongSach}</h3>
                <p>Sách</p>
              </Link>
              <div className="icon">
                <i className="fas fa-book"></i>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-6">
            <div className="small-box bg-warning">
              <Link
                className="inner"
                to="/QuanLyHeThong/1"
                style={{ textDecoration: "none" }}
              >
                <h3>{tongTaiKhoan}</h3>
                <p>Tài khoản</p>
              </Link>
              <div className="icon">
                <i className="fas fa-users-cog"></i>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-6">
            <div className="small-box bg-danger">
              <Link
                className="inner"
                to="/QuanLyMuonTraSach/1"
                style={{ textDecoration: "none" }}
              >
                <h3>{tongPhieu}</h3>
                <p>Lượt mượn sách</p>
              </Link>
              <div className="icon">
                <i className="fas fa-cart-plus"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Nội dung chính */}
        <div className="row">
          <div className="col-md-7">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h3 className="card-title">Sách mới</h3>
                {/* Nút "Xem tất cả" */}
                <Link
                  to="/QuanLyKhoSach/1"
                  className="btn btn-primary btn-sm ml-auto"
                >
                  Xem tất cả
                </Link>
              </div>
              <div className="card-body">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Tên sách</th>
                      <th>Tác giả</th>
                      <th>Thể loại</th>
                    </tr>
                  </thead>
                  {sachNew.map((sach, index) => (
                    <tr key={index}>
                      <td>{sach.sach_name}</td>
                      <td>{getAuthorNames(sach.tac_gia_documentId)}</td>
                      <td>{getTheLoaiNames(sach.the_loai_documentId)}</td>
                    </tr>
                  ))}
                </table>
              </div>
            </div>
          </div>

          <div className="col-md-5">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h3 className="card-title">Thành viên mới</h3>
                {/* Nút "Xem tất cả" */}
                <Link
                  to="/QuanLyHeThong/1"
                  className="btn btn-primary btn-sm ml-auto"
                >
                  Xem tất cả
                </Link>
              </div>
              <div className="card-body">
                <table className="table table-striped">
                  {taikhoans.map((taikhoan) => (
                    <>
                      <tr>
                        <td className="d-flex align-items-center">
                          <div className="row">
                            <div className="col-2">
                              <img
                                className="list-group-item avt mr-3 d-flex align-items-center"
                                src={imageURL + taikhoan.image}
                                alt="Avt"
                              />
                            </div>
                            <div className="col-8">
                              <p className="mb-1 email">{taikhoan.email}</p>
                              <span className="role">
                                {taikhoan.vai_tro_name}
                              </span>
                            </div>
                            <div className="col-2">
                              <div className="ml-auto actions">
                                <i className="fas fa-user mr-2"></i>
                                <i className="fas fa-comment mr-2"></i>
                                <i className="fas fa-phone"></i>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </>
                  ))}
                </table>

                {/* </ul> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
