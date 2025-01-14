import { useState } from "react";
import apiPublisher from "../../../api/apiPublisher";
import { Link, useNavigate } from "react-router-dom";

function AddPublisherManagement() {
  const [Publishername, setPublisherName] = useState("");
  const [address, setAddress] = useState("");
  const [sts, setSts] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const PublisherData = {
      name: Publishername,
      address: address,
      sts: sts,
    };
    // console.log(PublisherData);
    try {
      const res = await apiPublisher.createPublisher({ data: PublisherData });
      alert("Thêm nhà xuất bản thành công");
      navigate("/QuanLyNhaXuatBan/1");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div>
        <h3>
          <strong>Thêm nhà xuất bản mới</strong>
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
            <label for="address">Địa chỉ</label>
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
              Thêm nhà xuất bản
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
export default AddPublisherManagement;
