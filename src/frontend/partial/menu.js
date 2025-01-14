import "../assets/bootstrap/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import NavDropdown from "react-bootstrap/NavDropdown";
function Menu() {
  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      <Link to="Home" className="nav-link">
        <p className="brand" data-widget="treeview">
          QUAN LY THU VIEN
        </p>
      </Link>
      <div className="sidebar">
        <nav className="mt-2">
          <ul
            className="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role="menu"
            data-accordion="false"
          >
            <li className="nav-item">
              <Link to="/" className="nav-link">
                <i className="nav-icon fas fa-home"></i>
                <p>Dashboard</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/QuanLyHeThong/1" className="nav-link">
                <i className="nav-icon fas fa-database"></i>
                <p>Quản lý hệ thống</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/QuanLyKhoSach/1" className="nav-link">
                <i className="nav-icon fas fa-book"></i>
                <p>Quản lý kho sách</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/QuanLyDocGia/1" className="nav-link">
                <i className="nav-icon fas fa-user"></i>
                <p>Quản lý độc giả</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/QuanLyTacGia/1" className="nav-link">
                <i class="nav-icon fas fa-solid fa-pen"></i>
                <p>Quản lý tác giả</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/QuanLyTheLoai/1" className="nav-link">
                <i class="nav-icon fas fa-solid fa-layer-group"></i>
                <p>Quản lý thể loại</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/QuanLyNhaXuatBan/1" className="nav-link">
                <i class="nav-icon fas fa-solid fa-building"></i>
                <p>Quản lý nhà xuất bản</p>
              </Link>
            </li>
            <li className="nav-item">
              <a href="/QuanLyMuonTraSach/1" className="nav-link">
                <i className="nav-icon fas fa-file"></i>
                <p>Quản lý mượn trả sách</p>
              </a>
            </li>
            <li className="nav-item">
              <Link to="/BaoCaoThongKe/1" className="nav-link">
                <i className="nav-icon fas fa-chart-bar"></i>
                <p>Báo cáo thống kê</p>
              </Link>
              {/* <ul>
                <li className="nav-item">
                  <Link
                    to="/BaoCaoThongKe/viewThongKeSachMuon"
                    className="nav-link"
                  >
                    <i className="far fa-circle nav-icon"></i>
                    <p>Thống kê sách mượn</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/BaoCaoThongKe/viewThongKeDoanhThu"
                    className="nav-link"
                  >
                    <i className="far fa-circle nav-icon"></i>
                    <p>Thống kê doanh thu</p>
                  </Link>
                </li>
              </ul> */}
            </li>
            <li className="nav-item">
              <Link to="/DangXuat" className="nav-link">
                <i className="nav-icon fas fa-sign-out-alt"></i>
                <p>Thoát</p>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}

export default Menu;
