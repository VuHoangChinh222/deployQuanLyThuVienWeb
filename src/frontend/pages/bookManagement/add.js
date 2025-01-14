import { useState, useEffect } from "react";
import apiBook from "../../../api/apiBook";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axios";
import apiAuthor from "../../../api/apiAuthor";
import apiGenre from "../../../api/apiGenre";
import apiPublisher from "../../../api/apiPublisher";

function AddBookManagement() {
  const [bookname, setBookName] = useState("");
  const [theloai, setTheLoai] = useState([]);
  const [nhaxuatban, setNhaXuatBan] = useState([]);
  const [price, setPrice] = useState("");
  const [tacgia, setTacGia] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [sts, setSts] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const [authors, setAuthors] = useState([]);
  const [originalAuthors, setOriginalAuthors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [originalGenres, setOriginalGenres] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [originalPublishers, setOriginalPublishers] = useState([]);

  //Xu ly tac gia
  //Hien thi thong tin
  useEffect(() => {
    apiAuthor.getBySts(1).then((res) => {
      try {
        const authorData = res.data.map((item) => {
          return {
            id: item.id,
            documentId: item.documentId,
            name: item.name,
          };
        });
        setAuthors(authorData);
        setOriginalAuthors(authorData);
        // console.log(authorData);
      } catch (err) {
        console.log(err);
      }
    });
  }, []);

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

  const handleAuthorChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );
    setTacGia(selectedOptions);
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

  //Xu ly the loai
  //Hien thi thong tin
  useEffect(() => {
    apiGenre.getBySts(1).then((res) => {
      try {
        const genreData = res.data.map((item) => {
          return {
            id: item.id,
            documentId: item.documentId,
            name: item.name,
          };
        });
        setGenres(genreData);
        setOriginalGenres(genreData);
        // console.log(genreData);
      } catch (err) {
        console.log(err);
      }
    });
  }, []);

  const handleGenreChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );
    setTheLoai(selectedOptions);
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

  //Xu ly nha xuat ban
  //Hien thi thong tin
  useEffect(() => {
    apiPublisher.getBySts(1).then((res) => {
      try {
        const publisherData = res.data.map((item) => {
          return {
            id: item.id,
            documentId: item.documentId,
            name: item.name,
          };
        });
        setPublishers(publisherData);
        setOriginalPublishers(publisherData);
        // console.log(publisherData);
      } catch (err) {
        console.log(err);
      }
    });
  }, []);

  const handlePublisherChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );
    setNhaXuatBan(selectedOptions);
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

  //Add
  const handleFileChange = (e) => {
    // console.log(e.target.files[0]);
    const file = e.target.files[0];
    if (file) {
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        alert("Chỉ chấp nhận các định dạng JPEG và PNG.");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        // 2MB
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
      the_loai_documentId: theloai.join(","), // Chuyển mảng thể loại thành chuỗi
      tac_gia_documentId: tacgia.join(","), // Chuyển mảng tác giả thành chuỗi
      nha_xuat_ban_documentId: nhaxuatban.join(","), // Chuyển mảng nhà xuất bản thành chuỗi
      quantity: quantity,
      description: description,
      sts: sts,
      image: [],
    };

    let file = new FormData();
    file.append("files", image); // Đưa giá trị của hình vào file
    axiosInstance.enableUploadFile();

    axiosInstance
      .post("/upload", file)
      .then(async (res) => {
        const fileId = res.data[0].id;
        bookData.image.push(fileId);
        axiosInstance.enableJson();
        const responseProduct = await apiBook.createBook({
          data: bookData,
        });
        // console.log(responseProduct);
        alert("Tạo sách thành công");
        navigate("/QuanLyKhoSach/1");
      })
      .catch((error) => {
        console.error("Error creating book:", error);
        alert("Tạo sách thất bại.");
      });
  };

  return (
    <>
      <div>
        <h3>
          <strong>Thêm sách mới</strong>
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
              required
              value={tacgia}
              onChange={handleAuthorChange}
              name="authorName"
              id="authorName"
              multiple
            >
              {authors.map((author, index) => {
                return (
                  <option key={index} value={author.documentId}>
                    {author.name}
                  </option>
                );
              })}
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
            <label for="theloai">Thể loại</label>
            <select
              className="form-select"
              required
              value={theloai}
              onChange={handleGenreChange}
              name="genre"
              id="genre"
              multiple
            >
              {genres.map((genre, index) => {
                return (
                  <option key={index} value={genre.documentId}>
                    {genre.name}
                  </option>
                );
              })}
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
                    onChange={(e) =>
                      handleCheckboxChange(e, setTheLoai, theloai)
                    }
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
              required
              value={nhaxuatban}
              onChange={handlePublisherChange}
              name="publisher"
              id="publisher"
              multiple
            >
              {publishers.map((publisher, index) => {
                return (
                  <option key={index} value={publisher.documentId}>
                    {publisher.name}
                  </option>
                );
              })}
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
            <label for="quantity">Mô tả sách</label>
            <textarea
              rows="4"
              cols="100"
              type="text"
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
            <label for="image">Image:</label>
            <input
              type="file"
              className="form-control"
              name="image"
              id="image"
              required
              onChange={handleFileChange}
            />
          </div>
          <div className="form-actions">
            <Link to="/QuanLyKhoSach">
              <button type="button" className="btn-quaylai">
                Quay lại
              </button>
            </Link>
            <button type="submit" className="btn primary">
              Thêm sách
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
export default AddBookManagement;
