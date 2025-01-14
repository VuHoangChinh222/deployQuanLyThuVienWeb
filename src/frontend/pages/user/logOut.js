import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const LogOut = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["user-data"]);

  const handleRemoveCookies = () => {
    const options = { path: "/" }; // Phải trùng khớp với path đã dùng khi set cookie
    removeCookie("username", options);
    removeCookie("email", options);
    removeCookie("password", options);
    removeCookie("documentId", options);
  };

  const nav = useNavigate();

  useEffect(() => {
    console.log("Logging out...");
    try {
      handleRemoveCookies();
      nav("/"); // Điều hướng đến trang đăng nhập
      setTimeout(() => {
        window.location.reload(); // Tải lại trang sau khi điều hướng
      }, 100); // Thời gian ngắn để đảm bảo điều hướng hoàn tất
    } catch (err) {
      console.error("Error during logout:", err);
    }
  }, [nav]);

  return <h1>Logging out...</h1>;
};

export default LogOut;
