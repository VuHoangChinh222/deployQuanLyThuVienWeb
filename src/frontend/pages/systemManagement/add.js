import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import apiRole from "../../../api/apiRole";
import apiSystem from "../../../api/apiSystem";

function AddSystemManagement() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [conPass, setConPass] = useState("");
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState(0);

  const [roles, setRole] = useState([]);
  const handleSubmit = async (e) => {
    if (conPass === password) {
      try {
        e.preventDefault();
        const userData = {
          user_name: username,
          email: email,
          password: password,
          vaitro: roleId,
        };
        console.log("user Data", userData);
        const response = await apiSystem.createSystemAccount(userData);
        alert("Tạo mới tài khoản thành công");
      } catch (err) {
        console.error("Err:", err);
      }
    }
  };

  useEffect(() => {
    apiRole.getAll().then((res) => {
      try {
        const roleData = res.data.map((item) => {
          return {
            id: item.id,
            name: item.vai_tro_name,
          };
        });
        setRole(roleData);
        console.log(roleData);
      } catch (err) {
        console.log(err);
      }
    });
  }, []);

  return (
    <div>
      <h3>
        <strong>Tạo mới tài khoản</strong>
      </h3>
      <form className="styled-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label for="username">Tên tài khoản:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            id="username"
            name="username"
            required
          />
        </div>
        <div className="form-group">
          <label for="email">Email:</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            name="email"
            required
          />
        </div>
        <div className="form-group">
          <label for="password">Mật khẩu:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            name="password"
            required
          />
        </div>
        <div className="form-group">
          <label for="confirmPassword">Xác nhận mật khẩu:</label>
          <input
            type="password"
            value={conPass}
            onChange={(e) => setConPass(e.target.value)}
            id="confirmPassword"
            name="confirmPassword"
            required
          />
        </div>
        <div className="form-group">
          <label for="role">Chọn vai trò:</label>
          <select
            id="role"
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
            name="role"
          >
            {roles.map((role, index) => {
              return (
                <option key={index} value={role.id}>
                  {role.name}
                </option>
              );
            })}
          </select>
        </div>
        <div className="form-actions">
          <Link to="/QuanLyHeThong">
            <button type="button" className="btn-quaylai">
              Quay lại
            </button>
          </Link>
          <button type="submit" className="btn primary">
            Tạo Tài khoản
          </button>
        </div>
      </form>
    </div>
  );
}
export default AddSystemManagement;
