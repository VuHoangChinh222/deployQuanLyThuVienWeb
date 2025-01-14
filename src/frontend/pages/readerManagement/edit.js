import { Link } from "react-router-dom";
import { useState } from "react";

function AddReaderManagement() {
  const [readername, setReaderName] = useState("");
  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [mssv, setMssv] = useState("");
  const [readerid, setReaderId] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const readerData = {
      id: readerid,
      name: readername,
      gender: gender,
      birthday: birthday,
      address: address,
      phone: phone,
      email: email,
      mssv: mssv,
    };
    console.log("reader Data", readerData);
  };

  return (
    <div>
      <h3>
        <strong>Thêm độc giả</strong>
      </h3>
      <div className="form-container">
        <form className="styled-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label for="readerName">Tên độc giả</label>
            <input
              type="text"
              value={readername}
              onChange={(e) => setReaderName(e.target.value)}
              id="readerName"
              name="readerName"
              required
            />
          </div>
          <div className="form-group">
            <label for="studentID">Mã sinh viên</label>
            <input
              type="text"
              value={mssv}
              onChange={(e) => setMssv(e.target.value)}
              id="studentID"
              name="studentID"
              required
            />
          </div>
          <div className="form-group">
            <label for="gender">Giới tính</label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              name="gender"
              required
            >
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>
          <div className="form-group">
            <label for="dob">Ngày sinh</label>
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              id="dob"
              name="dob"
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
            <label for="phone">Số điện thoại</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              id="phone"
              name="phone"
              required
            />
          </div>
          <div className="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              name="email"
              required
            />
          </div>
          <div className="form-actions">
            <Link to="/QuanLyDocGia">
              <button type="button" className="btn">
                Quay lại
              </button>
            </Link>
            <button type="submit" className="btn primary">
              Tạo độc giả mới
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default AddReaderManagement;
