import { useState, useEffect } from "react";
import apiGenre from "../../../api/apiGenre";
import { Link, useNavigate, useParams } from "react-router-dom";

function EditGenreManagement() {
  const { id } = useParams();
  const [Genrename, setGenreName] = useState("");
  const [description, setDescription] = useState("");
  const [sts, setSts] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    apiGenre.getDetailGenreById(id).then((res) => {
      try {
        const GenreData = res.data;
        setSts(GenreData.sts);
        setGenreName(GenreData.name);
        setDescription(GenreData.description);
      } catch (err) {
        console.log(err);
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const GenreData = {
      name: Genrename,
      description: description,
      sts: sts,
    };
    console.log(GenreData);
    try {
      const res = await apiGenre.updateGenre(id, { data: GenreData });
      alert("Sửa thể loại thành công");
      navigate("/QuanLyTheLoai/1");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div>
        <h3>
          <strong>Sửa thông tin thể loại</strong>
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
              Lưu
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
export default EditGenreManagement;
