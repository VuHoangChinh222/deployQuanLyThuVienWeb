import { useEffect, useState } from "react";
import apiBook from "../../../api/apiBook";
import apiBookLoan from "../../../api/apiBookLoan";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { imageURL } from "../../../api/config";
import apiAuthor from "../../../api/apiAuthor";
import apiGenre from "../../../api/apiGenre";

function DetailBookLoanManagement() {
  const { id } = useParams();

  const [phieumuons, setPhieumuons] = useState([]);
  const [TTSach, setTTSach] = useState([]);
  const [saches, setSaches] = useState([]);
  const [author, setAuthor] = useState([]);
  const [genre, setGenre] = useState([]);

  const getSach = (docId) => {
    const sach = saches.find((s) => s.documentId === docId);
    return sach ? sach.sach_name : "not found";
  };
  const getTG = (docId) => {
    // Tách các documentId từ chuỗi
    const documentIdArray = (docId || "").split(",");
    // console.log(documentIdArray);
    // Lọc danh sách tên tác giả dựa trên documentId
    const authorNames = documentIdArray
      .map((docId) => {
        const authorname = author.find(
          (item) => item.documentId === docId.trim()
        );
        return authorname ? authorname.name : null;
      })
      .filter((name) => name !== null); // Bỏ qua các tên không tìm thấy
    return authorNames.join(", "); // Ghép lại thành chuỗi
  };
  const getTL = (docId) => {
    // Tách các documentId từ chuỗi
    const documentIdArray = (docId || "").split(",");
    // console.log(documentIdArray);
    // Lọc danh sách tên thể loại dựa trên documentId
    const theloaiNames = documentIdArray
      .map((docId) => {
        const theloainame = genre.find(
          (item) => item.documentId === docId.trim()
        );
        return theloainame ? theloainame.name : null;
      })
      .filter((name) => name !== null); // Bỏ qua các tên không tìm thấy
    return theloaiNames.join(", "); // Ghép lại thành chuỗi
  };

  useEffect(() => {
    Promise.all([apiBookLoan.getDetailBookLoanById(id), apiBook.getAll()]).then(
      ([loanRes, bookRes]) => {
        try {
          const bookData = bookRes.data.map((book) => ({
            id: book.id,
            documentId: book.documentId,
            sach_name: book.sach_name,
            image: book.image.url,
            tac_gia_documentId: book.tac_gia_documentId,
            the_loai_documentId: book.the_loai_documentId,
          }));
          setSaches(bookData);

          const bookLData = loanRes.data.map((bookL) => {
            const sach =
              bookData.find((s) => s.documentId === bookL.sach_documentId) ||
              {};
            return sach
              ? {
                  id: bookL.id,
                  sach_documentId: bookL.sach_documentId,
                  phieu_muon_documentId: bookL.phieu_muon_documentId,
                  quantity: bookL.quantity,
                  price: bookL.price,
                  sach_name: sach.sach_name || "not found",
                  image: sach.image || "",
                  tac_gia_documentId: sach.tac_gia_documentId,
                  the_loai_documentId: sach.the_loai_documentId,
                }
              : null;
          });
          setPhieumuons(bookLData);
          console.log(bookLData);
        } catch (err) {
          console.log("Error: ", err);
        }
      }
    );
    // Lấy danh sách tác giả
    apiAuthor.getBySts(1).then((res) => {
      try {
        const authorData = res.data.map((item) => ({
          id: item.id,
          documentId: item.documentId,
          name: item.name,
        }));
        setAuthor(authorData);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách tác giả:", err);
      }
    });
    //Lây danh sách thể loại
    apiGenre.getBySts(1).then((res) => {
      try {
        const theloaiData = res.data.map((item) => ({
          id: item.id,
          documentId: item.documentId,
          name: item.name,
        }));
        setGenre(theloaiData);
      } catch (err) {
        console.log("Lỗi:", err);
      }
    });
  }, [id]);
  return (
    <div>
      <Link to="/QuanLyMuonTraSach/1">
        <i className="fas fa-arrow-left iconspacing"></i>
        <button className="btn-trove">Quay lại</button>
      </Link>
      <h3>
        <strong>Chi tiết phiếu mượn</strong>
      </h3>
      <hr />
      <div className="card">
        <table className="table">
          <thead className="table-title">
            <tr className="text-qlms">
              <th>Hình ảnh</th>
              <th>Mã sách</th>
              <th>Tên sách</th>
              <th>Tác giả</th>
              <th>Thể loại</th>
              <th>Số lượng mượn</th>
              <th>Giá sách</th>
            </tr>
          </thead>
          {phieumuons.map((bookL) => (
            <tr className="text-center" key={bookL.id}>
              <td>
                <img
                  src={imageURL + bookL.image}
                  alt={bookL.name}
                  style={{ height: "100px" }}
                />
              </td>
              <td>{bookL.sach_documentId}</td>
              <td>{getSach(bookL.sach_documentId)}</td>
              <td>{getTG(bookL.tac_gia_documentId)}</td>
              <td>{getTL(bookL.the_loai_documentId)}</td>
              <td>{bookL.quantity}</td>
              <td>{bookL.price}</td>
            </tr>
          ))}
        </table>
      </div>
    </div>
  );
}
export default DetailBookLoanManagement;
