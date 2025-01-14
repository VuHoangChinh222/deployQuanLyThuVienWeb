import { imageURL } from "../../../api/config";
import { useDispatch } from "react-redux";
import { REMOVE } from "../../../redux/action/cartAction";
import { useState, useEffect } from "react";
import apiAuthor from "../../../api/apiAuthor";
import apiGenre from "../../../api/apiGenre";
import apiPublisher from "../../../api/apiPublisher";
function ListBook(props) {
  const disPatch = useDispatch();
  const [authors, setAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [publishers, setPublishers] = useState([]);
  // console.log(props.item.the_loai_documentId);

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
    const genreNames = documentIdArray
      .map((docId) => {
        const genre = genres.find((item) => item.documentId === docId.trim());
        return genre ? genre.name : null;
      })
      .filter((name) => name !== null); // Bỏ qua các tên không tìm thấy
    return genreNames.join(", "); // Ghép lại thành chuỗi
  };

  //Xu ly nha xuat ban
  //Xu ly the loai
  useEffect(() => {
    // Lấy danh sách tác giả từ API
    apiPublisher.getBySts(1).then((res) => {
      try {
        const publisherData = res.data.map((item) => ({
          id: item.id,
          documentId: item.documentId,
          name: item.name,
        }));
        setPublishers(publisherData);
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
    const publisherName = documentIdArray
      .map((docId) => {
        const publisher = publishers.find(
          (item) => item.documentId === docId.trim()
        );
        return publisher ? publisher.name : null;
      })
      .filter((name) => name !== null); // Bỏ qua các tên không tìm thấy
    return publisherName.join(", "); // Ghép lại thành chuỗi
  };

  const removeItem = (item) => {
    disPatch(REMOVE(item));
  };
  return (
    <tr>
      <td>
        <img
          style={{ height: "100px", width: "90px" }}
          src={imageURL + props.item.image}
          alt="props.item.image"
        />
      </td>
      <td className="fw-bold text-primary">{props.item.name}</td>
      <td>
        {typeof props.item.tac_gia_documentId === "string"
          ? getAuthorNames(props.item.tac_gia_documentId)
          : null}
      </td>
      <td>
        {typeof props.item.the_loai_documentId === "string"
          ? getGenreNames(props.item.the_loai_documentId)
          : null}
      </td>
      <td>
        {typeof props.item.nha_xuat_ban_documentId === "string"
          ? getPublisherNames(props.item.nha_xuat_ban_documentId)
          : null}
      </td>
      <td>{Math.round(props.item.price) * 0.1}</td>
      <td>{props.item.quantity}</td>
      <td>{Math.round(props.item.price) * 0.1 * props.item.quantity}</td>
      <td>
        <button
          type="button"
          className="btn btn-danger shadow-10 me-1"
          onClick={() => removeItem(props.item)}
        >
          <i class="fas fa-solid fa-trash"></i>
        </button>
      </td>
    </tr>
  );
}

export default ListBook;
