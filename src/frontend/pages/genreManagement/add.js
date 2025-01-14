import { useState } from "react";
import apiGenre from "../../../api/apiGenre";
import { Link, useNavigate } from "react-router-dom";

function AddGenreManagement() {
  const [Genrename, setGenreName] = useState("");
  const [description, setDescription] = useState("");
  const [sts, setSts] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const GenreData = {
      name: Genrename,
      description: description,
      sts: sts,
    };
    console.log(GenreData);
    try {
      const res = await apiGenre.createGenre({ data: GenreData });
      alert("Thêm thể loại thành công");
      navigate("/QuanLyTheLoai/1");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div>
        <h3>
          <strong>Thêm thể loại mới</strong>
        </h3>
        <form className="styled-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label for="GenreName">Tên thể loại</label>
            <input
              type="text"
              value={Genrename}
              onChange={(e) => setGenreName(e.target.value)}
              id="GenreName"
              name="GenreName"
              required
            />
          </div>
          <div className="form-group">
            <label for="description">Sơ lược về thể loại</label>
            <input
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
          <div className="form-actions">
            <Link to="/QuanLyTheLoai/1">
              <button type="button" className="btn-quaylai">
                Quay lại
              </button>
            </Link>
            <button type="submit" className="btn primary">
              Thêm thể loại
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
export default AddGenreManagement;
