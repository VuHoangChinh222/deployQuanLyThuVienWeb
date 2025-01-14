import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiSystem from "../../../api/apiSystem";
import CryptoJS from "crypto-js";
import { useCookies } from "react-cookie";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [users, setUsers] = useState([]);

  //Use cookie
  const [cookies, setCookie] = useCookies(["user-data"]);
  // Hàm xử lý lưu cookie
  const handleSaveCookie = (
    username,
    email,
    password,
    documentId,
    vai_tro_name
  ) => {
    // Lưu từng trường vào cookie với thời hạn 1 tuần
    const options = {
      path: "/",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };
    setCookie("username", username, options);
    setCookie("email", email, options);
    setCookie("password", password, options);
    setCookie("documentId", documentId, options);
    setCookie("vai_tro_name", vai_tro_name, options);

    // alert("Thông tin đã được lưu vào cookie!");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const navigate = useNavigate();

  // const encryptedPassword = CryptoJS.SHA256(password).toString();

  useEffect(() => {
    apiSystem.getAll().then((res) => {
      try {
        const userData = res.data.map((item) => ({
          id: item.id,
          documentId: item.documentId,
          email: item.email,
          password: item.password,
          username: item.user_name,
          vai_tro_name: item.vai_tro_name,
        }));
        // console.log(userData);
        setUsers(userData);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách tài khoản:", err);
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const docId = users
      .filter((i) => i.email.includes(email))
      .map((users) => users.documentId);
    try {
      const emailIn = users.filter((i) => i.email.includes(email));
      const passwordIn = users
        .filter((i) => i.email.includes(email))
        .map((users) => users.password);

      // console.log(typeof passwordIn[0]);
      // console.log(emailIn[0].email);

      if (emailIn.length > 0) {
        if (password === passwordIn[0]) {
          handleSaveCookie(
            emailIn[0].username,
            emailIn[0].email,
            emailIn[0].password,
            emailIn[0].documentId,
            emailIn[0].vai_tro_name
          );
          alert("Đăng nhập thành công");
          navigate("/TrangChu");
          setTimeout(() => {
            window.location.reload(); // Tải lại trang sau khi điều hướng
          }, 100); // Thời gian ngắn để đảm bảo điều hướng hoàn tất
        } else {
          alert("Sai mật khẩu");
        }
      } else {
        alert("Sai Email");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Đăng nhập</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              style={{
                position: "absolute",
                right: "8px",
                top: "50%",
                transform: "translateY(-10%)",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              {showPassword ? "👁️" : "🙈"}
            </button>
          </div>
          <button type="submit" className="btn-login">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
// export  {docId};
export default Login;
