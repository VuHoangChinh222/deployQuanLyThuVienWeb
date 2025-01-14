import Home from "../frontend/pages/home/home";
import NotFound from "../frontend/pages/notFound/notFound";
import LapPhieu from "../frontend/pages/BorrowingVoucher/lapphieu";
import Login from "../frontend/pages/user/logIn";
import LogOut from "../frontend/pages/user/logOut";
import Loc from "../frontend/pages/BorrowingVoucher/loc";
//Reader
import ShowReaderManagement from "../frontend/pages/readerManagement/show";
import AddReaderManagement from "../frontend/pages/readerManagement/add";
import EditReaderManagement from "../frontend/pages/readerManagement/edit";

//Book
import ShowBookManagement from "../frontend/pages/bookManagement/show";
import EditBookManagement from "../frontend/pages/bookManagement/edit";
import AddBookManagement from "../frontend/pages/bookManagement/add";

//BookLoan
import ShowBookLoanManagement from "../frontend/pages/bookLoanManagement/show";
import EditBookLoanManagement from "../frontend/pages/bookLoanManagement/edit";
import DetailBookLoanManagement from "../frontend/pages/bookLoanManagement/detail";

//System
import ShowSystemManagement from "../frontend/pages/systemManagement/show";
import AddSystemManagement from "../frontend/pages/systemManagement/add";
import EditSystemManagement from "../frontend/pages/systemManagement/edit";

//statistics
import ShowStatistics from "../frontend/pages/statistics/show";
import AddStatistics from "../frontend/pages/statistics/add";
import EditStatistics from "../frontend/pages/statistics/edit";
//viewstatistics
import viewThongKeSachMuon from "../frontend/pages/statistics/view/viewThongKeSachMuon";
import ViewThongKeSinhVien from "../frontend/pages/statistics/view/viewThongKeSinhVien";
import ViewThongKePhieuMuon from "../frontend/pages/statistics/view/viewThongKePhieuMuon";
//Author
import ShowAuthorManagement from "../frontend/pages/authorManagement/show";
import EditAuthorManagement from "../frontend/pages/authorManagement/edit";
import AddAuthorManagement from "../frontend/pages/authorManagement/add";
import DetailAuthorManagement from "../frontend/pages/authorManagement/detail";

//Genre
import ShowGenreManagement from "../frontend/pages/genreManagement/show";
import EditGenreManagement from "../frontend/pages/genreManagement/edit";
import AddGenreManagement from "../frontend/pages/genreManagement/add";
import DetailGenreManagement from "../frontend/pages/genreManagement/detail";

//Publisher
import ShowPublisherManagement from "../frontend/pages/publisherManagement/show";
import EditPublisherManagement from "../frontend/pages/publisherManagement/edit";
import AddPublisherManagement from "../frontend/pages/publisherManagement/add";
import DetailPublisherManagement from "../frontend/pages/publisherManagement/detail";

//Search
import SearchBook from "../frontend/pages/search";

import Menu from "../frontend/partial/menu";
const FrontEndRoute = [
  { path: "/", component: Home },
  { path: "/TrangChu", component: Home },
  { path: "/*", component: NotFound },

  { path: "/Menu", component: Menu },
  { path: "/LapPhieu", component: LapPhieu },
  { path: "/Loc/:mssv", component: Loc },

  //user
  { path: "/DangNhap", component: Login },
  { path: "/DangXuat", component: LogOut },

  //Reader
  { path: "/QuanLyDocGia/:page", component: ShowReaderManagement },
  { path: "/QuanLyDocGia/Them", component: AddReaderManagement },
  { path: "/QuanLyDocGia/Sua/:id", component: EditReaderManagement },

  //Book
  { path: "/QuanLyKhoSach/:page", component: ShowBookManagement },
  { path: "/QuanLyKhoSach/Them", component: AddBookManagement },
  { path: "/QuanLyKhoSach/Sua/:id", component: EditBookManagement },

  //BookLoan
  { path: "/QuanLyMuonTraSach/:page", component: ShowBookLoanManagement },
  {
    path: "/QuanLyMuonTraSach/Sua/:id",
    component: EditBookLoanManagement,
  },
  {
    path: "/QuanLyMuonTraSach/chitiet/:id",
    component: DetailBookLoanManagement,
  },

  //System
  { path: "/QuanLyHeThong/:page", component: ShowSystemManagement },
  { path: "/QuanLyHeThong/Them", component: AddSystemManagement },
  { path: "/QuanLyHeThong/Sua/:id", component: EditSystemManagement },

  //Author
  { path: "/QuanLyTacGia/:page", component: ShowAuthorManagement },
  { path: "/QuanLyTacGia/Them", component: AddAuthorManagement },
  { path: "/QuanLyTacGia/Sua/:id", component: EditAuthorManagement },
  { path: "/QuanLyTacGia/ChiTiet/:id", component: DetailAuthorManagement },

  //Genre
  { path: "/QuanLyTheLoai/:page", component: ShowGenreManagement },
  { path: "/QuanLyTheLoai/Them", component: AddGenreManagement },
  { path: "/QuanLyTheLoai/Sua/:id", component: EditGenreManagement },
  { path: "/QuanLyTheLoai/ChiTiet/:id", component: DetailGenreManagement },

  //Publisher
  { path: "/QuanLyNhaXuatBan/:page", component: ShowPublisherManagement },
  { path: "/QuanLyNhaXuatBan/Them", component: AddPublisherManagement },
  { path: "/QuanLyNhaXuatBan/Sua/:id", component: EditPublisherManagement },
  {
    path: "/QuanLyNhaXuatBan/ChiTiet/:id",
    component: DetailPublisherManagement,
  },

  //statistics
  { path: "/BaoCaoThongKe/:page", component: ShowStatistics },
  { path: "/BaoCaoThongKe/Them", component: AddStatistics },
  { path: "/BaoCaoThongKe/Sua", component: EditStatistics },

  //viewstatistics
  {
    path: "/BaoCaoThongKe/viewThongKeSachMuon/",
    component: viewThongKeSachMuon,
  },
  {
    path: "/BaoCaoThongKe/ThongKeSinhVien/",
    component: ViewThongKeSinhVien,
  },
  {
    path: "/BaoCaoThongKe/ThongKePhieuMuon/",
    component: ViewThongKePhieuMuon,
  },
  //Search
  {
    path: "/TimKiemSach/:data/:page",
    component: SearchBook,
  },
];

export default FrontEndRoute;
