import { useEffect, useState } from "react";
import apiBook from "../../../api/apiBook";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../api/axios";
import apiAuthor from "../../../api/apiAuthor";
import apiGenre from "../../../api/apiGenre";
import apiPublisher from "../../../api/apiPublisher";
import { imageURL } from "../../../api/config";

function EditBookManagement() {
  const { id } = useParams();

  const [bookname, setBookName] = useState("");
  const [theloai, setTheLoai] = useState([]);
  const [nhaxuatban, setNhaXuatBan] = useState([]);
  const [price, setPrice] = useState("");
  const [tacgia, setTacGia] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imageId, setImageId] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [originalAuthors, setOriginalAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [originalGenres, setOriginalGenres] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [originalPublishers, setOriginalPublishers] = useState([]);
  const [sts, setSts] = useState("");

  const navigate = useNavigate();

  const handleAuthorSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    if (searchValue === "") {
      setAuthors(originalAuthors); // Hiển thị danh sách gốc nếu ô tìm kiếm rỗng
    } else {
      const filteredAuthors = originalAuthors.filter((author) =>
        author.name.toLowerCase().includes(searchValue)
      );
      setAuthors(filteredAuthors);
    }
  };
  const handleCheckboxChange = (e, setFunction, currentValue) => {
    const value = e.target.value;
    if (e.target.checked) {
      // Thêm giá trị vào danh sách nếu được chọn
      setFunction([...currentValue, value]);
    } else {
      // Loại bỏ giá trị khỏi danh sách nếu bỏ chọn
      setFunction(currentValue.filter((item) => item !== value));
    }
  };

  const handleGenreSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    if (searchValue === "") {
      setGenres(originalGenres); // Hiển thị danh sách gốc nếu ô tìm kiếm rỗng
    } else {
      const filteredGenres = originalGenres.filter((genre) =>
        genre.name.toLowerCase().includes(searchValue)
      );
      setGenres(filteredGenres);
    }
  };

  const handlePublisherSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    if (searchValue === "") {
      setPublishers(originalPublishers); // Hiển thị danh sách gốc nếu ô tìm kiếm rỗng
    } else {
      const filteredPublishers = originalPublishers.filter((publisher) =>
        publisher.name.toLowerCase().includes(searchValue)
      );
      setPublishers(filteredPublishers);
    }
  };

  useEffect(() => {
    apiBook.getDetailBookById(id).then((res) => {
      try {
        const book = res.data[0];
        setBookName(book.sach_name);
        setPrice(book.price);
        setQuantity(book.quantity);
        setDescription(book.description);
        setTacGia(book.tac_gia_documentId?.split(",") || []);
        setTheLoai(book.the_loai_documentId?.split(",") || []);
        setNhaXuatBan(book.nha_xuat_ban_documentId?.split(",") || []);
        setImage(book.image?.url);
        setImageId(book.image?.id);
        setSts(book.sts);
      } catch (err) {
        console.error(err);
      }
    });

    apiAuthor.getBySts(1).then((res) => {
      const authorData = res.data.map((item) => ({
        id: item.id,
        documentId: item.documentId,
        name: item.name,
      }));
      setAuthors(authorData);
      setOriginalAuthors(authorData);
      // console.log(authorData);
    });

    apiGenre.getBySts(1).then((res) => {
      const genreData = res.data.map((item) => ({
        id: item.id,
        documentId: item.documentId,
        name: item.name,
      }));
      setGenres(genreData);
      setOriginalGenres(genreData);
    });

    apiPublisher.getBySts(1).then((res) => {
      const publisherData = res.data.map((item) => ({
        id: item.id,
        documentId: item.documentId,
        name: item.name,
      }));
      setPublishers(publisherData);
      setOriginalPublishers(publisherData);
    });
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        alert("Chỉ chấp nhận các định dạng JPEG và PNG.");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        alert("Kích thước file không được vượt quá 2MB.");
        return;
      }
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bookData = {
      sach_name: bookname,
      price: price,
      sts: sts,
      the_loai_documentId: theloai.join(","),
      tac_gia_documentId: tacgia.join(","),
      nha_xuat_ban_documentId: nhaxuatban.join(","),
      quantity: quantity,
      description: description,
      image: [],
    };

    if (image instanceof File) {
      const formData = new FormData();
      formData.append("files", image);
      axiosInstance.enableUploadFile();

      try {
        const uploadRes = await axiosInstance.post("/upload", formData);
        bookData.image.push(uploadRes.data[0].id);
      } catch (err) {
        console.error("Error uploading file:", err);
        alert("Cập nhật hình ảnh thất bại.");
        return;
      }
    } else {
      bookData.image.push(imageId);
    }

    axiosInstance.enableJson();
    try {
      await apiBook.updateBook(id, { data: bookData });
      alert("Cập nhật sách thành công");
      navigate("/QuanLyKhoSach/1");
    } catch (err) {
      console.error("Error updating book:", err);
      alert("Cập nhật sách thất bại.");
    }
  };

  return (
    <div>
      <h3>
        <strong>Sửa sách</strong>
      </h3>
      <form className="styled-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label for="bookName">Tên sách</label>
          <input
            type="text"
            value={bookname}
            onChange={(e) => setBookName(e.target.value)}
            id="bookName"
            name="bookName"
            required
          />
        </div>
        {/* <div className="form-group">
          <label for="authorName">Tên tác giả</label>
          <select
            className="form-select"
            value={tacgia}
            onChange={(e) =>
              setTacGia(Array.from(e.target.selectedOptions, (o) => o.value))
            }
            multiple
            required
          >
            {authors.map((author) => (
              <option key={author.id} value={author.documentId}>
                {author.name}
              </option>
            ))}
          </select>
        </div> */}
        <div className="form-group">
          <label htmlFor="authorName" className="form-label">
            Tên tác giả
          </label>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Tìm kiếm tác giả..."
            onChange={handleAuthorSearch}
          />
          <div
            className="btn-group-toggle d-flex flex-wrap"
            data-toggle="buttons"
          >
            {authors.map((author, index) => (
              <div
                key={index}
                className="form-check form-check-inline me-3 mb-2"
              >
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="author"
                  id={`author-${author.documentId}`}
                  value={author.documentId}
                  checked={tacgia.includes(author.documentId)}
                  onChange={(e) => handleCheckboxChange(e, setTacGia, tacgia)}
                />
                <label
                  className="btn btn-outline-primary"
                  htmlFor={`author-${author.documentId}`}
                >
                  {author.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* <div className="form-group">
          <label for="category">Thể loại</label>
          <select
            className="form-select"
            value={theloai}
            onChange={(e) =>
              setTheLoai(Array.from(e.target.selectedOptions, (o) => o.value))
            }
            multiple
            required
          >
            {genres.map((genre) => (
              <option key={genre.id} value={genre.documentId}>
                {genre.name}
              </option>
            ))}
          </select>
        </div> */}
        <div className="form-group">
          <label htmlFor="genre" className="form-label">
            Thể loại
          </label>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Tìm kiếm thể loại..."
            onChange={handleGenreSearch}
          />
          <div
            className="btn-group-toggle d-flex flex-wrap"
            data-toggle="buttons"
          >
            {genres.map((genre, index) => (
              <div
                key={index}
                className="form-check form-check-inline me-3 mb-2"
              >
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="genre"
                  id={`genre-${genre.documentId}`}
                  value={genre.documentId}
                  checked={theloai.includes(genre.documentId)}
                  onChange={(e) => handleCheckboxChange(e, setTheLoai, theloai)}
                />
                <label
                  className="btn btn-outline-success"
                  htmlFor={`genre-${genre.documentId}`}
                >
                  {genre.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* <div className="form-group">
          <label htmlFor="publisher">Nhà xuất bản</label>
          <select
            className="form-select"
            value={nhaxuatban}
            onChange={(e) =>
              setNhaXuatBan(
                Array.from(e.target.selectedOptions, (o) => o.value)
              )
            }
            multiple
            required
          >
            {publishers.map((publisher) => (
              <option key={publisher.id} value={publisher.documentId}>
                {publisher.name}
              </option>
            ))}
          </select>
        </div> */}
        <div className="form-group">
          <label htmlFor="publisher" className="form-label">
            Nhà xuất bản
          </label>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Tìm kiếm nhà xuất bản..."
            onChange={handlePublisherSearch}
          />
          <div
            className="btn-group-toggle d-flex flex-wrap"
            data-toggle="buttons"
          >
            {publishers.map((publisher, index) => (
              <div
                key={index}
                className="form-check form-check-inline me-3 mb-2"
              >
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="publisher"
                  id={`publisher-${publisher.documentId}`}
                  value={publisher.documentId}
                  checked={nhaxuatban.includes(publisher.documentId)}
                  onChange={(e) =>
                    handleCheckboxChange(e, setNhaXuatBan, nhaxuatban)
                  }
                />
                <label
                  className="btn btn-outline-warning"
                  htmlFor={`publisher-${publisher.documentId}`}
                >
                  {publisher.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label for="price">Đơn giá sách</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            id="price"
            name="price"
            required
          />
        </div>
        <div className="form-group">
          <label for="quantity">Số lượng sách</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            id="quantity"
            name="quantity"
            required
          />
        </div>
        <div className="form-group">
          <label for="description">Mô tả sách</label>
          <textarea
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            id="description"
            name="description"
            required
          />
        </div>
        <div className="form-group">
          <label for="sts">Trạng thái</label>
          <select
            class="form-control"
            id="sts"
            value={sts}
            onChange={(e) => setSts(e.target.value)}
          >
            <option value="0" selected>
              Ẩn
            </option>
            <option value="1">Hiển thị</option>
          </select>
        </div>
        <div className="form-group">
          <label for="image">Hình ảnh</label>
          <input
            type="file"
            accept="image/jpeg, image/png"
            onChange={handleFileChange}
          />
          {image && !(image instanceof File) && (
            <img
              src={imageURL + image}
              alt="Current"
              style={{ height: "150px" }}
            />
          )}
        </div>
        <div className="form-actions">
          <Link to="/QuanLyKhoSach">
            <button type="button" className="btn-quaylai">
              Quay lại
            </button>
          </Link>
          <button type="submit" className="btn primary">
            Lưu chỉnh sửa
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditBookManagement;
