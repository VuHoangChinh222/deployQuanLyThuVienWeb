import { Link } from "react-router-dom";
function EditSystemManagement() {
  return (
    <div>
      <h3><strong>Sửa tài khoản</strong></h3>
            <form className="styled-form">
                <div className="form-group">
                    <label for="username">Tên tài khoản:</label>
                    <input type="text" id="username" name="username" required/>
                </div>
                <div className="form-group">
                    <label for="email">Email:</label>
                    <input type="text" id="email" name="email" required/>
                </div>
                <div className="form-group">
                    <label for="password">Mật khẩu:</label>
                    <input type="password" id="password" name="password" required/>
                </div>
                <div className="form-group">
                    <label for="confirmPassword">Xác nhận mật khẩu:</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" required/>
                </div>
                <div className="form-group">
                    <label for="role">Chọn vai trò:</label>
                    <select id="role" name="role">
                        <option value="admin">Admin</option>
                        <option value="librarian">Thủ thư</option>
                        <option value="reader">Độc giả</option>
                    </select>
                </div>
                <div className="form-actions">
                    <Link to ="/QuanLyHeThong">
                        <button type="button" className="btn-quaylai">Quay lại</button>
                    </Link>
                    <button type="submit" className="btn primary">Cập nhật</button>
                </div>
            </form>
    </div>
  );
}
export default EditSystemManagement;

