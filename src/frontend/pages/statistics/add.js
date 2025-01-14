import { Link } from "react-router-dom";
function AddStatistics() {
  return (
    <div>
      <h3>
        <strong>Quản lý sách cũ</strong>
      </h3>
      
    <div className="row">
        <div className="col-md-10">
            <div className="status-bar">
                <div className="status-group">
                    <Link to = "viewDanhSachPhat"><button className="status-item active">Danh sách sách phạt</button></Link>
                    <Link to = "viewSachNhapKhoQua2Nam"><button className="status-item ">Danh sách nhập kho quá 2 năm</button></Link>     
                </div>
            </div>
        </div>
        <div className="col-md-2">
            <Link to="Them">
                <button className="taomoink"> + Tạo mới</button> 
          </Link>
        </div>
      </div>
        <hr/>
      <div className="card">
        <table className="table">
          <thead className="table-title">
            <tr className="text">
              <th>Mã sách</th>
              <th>Tên sách</th>
              <th>Tên tác giả</th>
              <th>Tên thể loại</th>
              <th>Ngày nhập</th>
              <th>Giá bán</th>
              <th>Số lượng</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>13</td>
              <td>sếp tôi</td>
              <td>Nguyen Van A</td>
              <td>loại 1</td>
              <td>03/07/2000</td>
              <td>12.000</td>
              <td>50</td>
              <td>
                <Link to = "Sua">
                  <i class="fas fa-wrench iconspacing"></i> 
                </Link>
                  <i class="fas fa-trash"></i> 
              </td>
            </tr>
            <tr>
              <td>13</td>
              <td>sếp tôi</td>
              <td>Nguyen Van A</td>
              <td>loại 1</td>
              <td>03/07/2000</td>
              <td>12.000</td>
              <td>50</td>
              <td>
                <Link to = "Sua">
                  <i class="fas fa-wrench iconspacing"></i> 
                </Link>
                  <i class="fas fa-trash"></i> 
              </td>
            </tr>
            <tr>
              <td>13</td>
              <td>sếp tôi</td>
              <td>Nguyen Van A</td>
              <td>loại 1</td>
              <td>03/07/2000</td>
              <td>12.000</td>
              <td>50</td>
              <td>
                <Link to = "Sua">
                  <i class="fas fa-wrench iconspacing"></i> 
                </Link>
                  <i class="fas fa-trash"></i> 
              </td>
            </tr>
            <tr>
              <td>13</td>
              <td>sếp tôi</td>
              <td>Nguyen Van A</td>
              <td>loại 1</td>
              <td>03/07/2000</td>
              <td>12.000</td>
              <td>50</td>
              <td>
                <Link to = "Sua">
                  <i class="fas fa-wrench iconspacing"></i> 
                </Link>
                  <i class="fas fa-trash"></i> 
                
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AddStatistics;
