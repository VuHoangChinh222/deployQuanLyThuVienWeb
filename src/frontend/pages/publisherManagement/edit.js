import { useState, useEffect } from "react";
import apiPublisher from "../../../api/apiPublisher";
import { Link, useNavigate, useParams } from "react-router-dom";

function EditPublisherManagement() {
  const { id } = useParams();
  const [Publishername, setPublisherName] = useState("");
  const [address, setAddress] = useState("");
  const [sts, setSts] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    apiPublisher.getDetailPublisherById(id).then((res) => {
      try {
        const PublisherData = res.data;
        setSts(PublisherData.sts);
        setPublisherName(PublisherData.name);
        setAddress(PublisherData.address);
      } catch (err) {
        console.log(err);
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const PublisherData = {
      name: Publishername,
      address: address,
      sts: sts,
    };
    console.log(PublisherData);
    try {
      const res = await apiPublisher.updatePublisher(id, {
        data: PublisherData,
      });
      alert("Sửa nhà xuất bản thành công");
      navigate("/QuanLyNhaXuatBan/1");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div>
        <h3>
          <strong>Sửa thông tin nhà xuất bản</strong>
        </h3>
        <form className="styled-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label for="PublisherName">Tên nhà xuất bản</label>
            <input
              type="text"
              value={Publishername}
              onChange={(e) => setPublisherName(e.target.value)}
              id="PublisherName"
              name="PublisherName"
              required
            />
          </div>
          <div className="form-group">
            <label for="address">Địa chỉ về nhà xuất bản</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              id="address"
              name="address"
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
            <Link to="/QuanLyNhaXuatBan/1">
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
export default EditPublisherManagement;
