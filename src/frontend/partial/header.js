import Menu from "./menu";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useCookies } from "react-cookie";

function SearchBox() {
  const [searchValue, setSearchValue] = useState("");

  const clearSearch = () => {
    setSearchValue("");
  };

  return (
    <div className="search-box">
      <input
        type="text"
        className="search-txt"
        placeholder="Search here ..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      {searchValue && (
        <span className="clear-btn" onClick={clearSearch}>
          &times;
        </span>
      )}
      <Link to={`/TimKiemSach/${searchValue}/1`}>
        <button className="search-btn">
          <i className="fas fa-search"></i>
        </button>
      </Link>
    </div>
  );
}

function Header() {
  const cookies = useCookies([]);

  const totalAmount = useSelector((state) => state.cart.carts).length;
  return (
    <div>
      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a
              className="nav-link"
              data-widget="pushmenu"
              href=""
              role="button"
            >
              <i className="fas fa-bars"></i>
            </a>
          </li>
        </ul>
        <SearchBox />
        <Link to="LapPhieu" style={{ textDecoration: "none", color: "green" }}>
          <i class="fas fa-solid fa-address-book" style={{ fontSize: "150%" }}>
            <span
              class="position-absolute translate-middle badge rounded-pill bg-danger"
              style={{ fontSize: "40%" }}
            >
              {totalAmount}
            </span>
          </i>
        </Link>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <a className="nav-link" href="#">
              <div className="user-container">
                <div className="image">
                  <img
                    src={require("../assets/img/2.jpg")}
                    className="img-circle elevation-2"
                    alt="User"
                  />
                </div>
                <div className="user-info">
                  <span className="name">{cookies[0].username}</span>
                  <span className="role">{cookies[0].vai_tro_name}</span>
                </div>
              </div>
            </a>
          </li>
        </ul>
      </nav>
      <Menu />
    </div>
  );
}

export default Header;
