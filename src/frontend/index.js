import React from "react";
import "./assets/css/index.css";
import "./assets/plugins/fontawesome-free/css/all.min.css";
import "./assets/dist/css/adminlte.min.css";
import Header from "./partial/header";
import { Outlet } from "react-router-dom";
import Login from "./pages/user/logIn";
import { useCookies } from "react-cookie";
import backGound from "./assets/img/1.jpg";
function Index() {
  const cookies = useCookies([]);
  return cookies[0].email ? (
    <div>
      <div className="wrapper">
        <Header />
        <div className="content-wrapper">
          <section className="content">
            <Outlet />
          </section>
        </div>
        {/* <aside className="control-sidebar control-sidebar-dark"></aside> */}
      </div>
    </div>
  ) : (
    <div
      className="wrapper"
      style={{
        backgroundImage: `url(${backGound})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
      }}
    >
      <div style={{ paddingTop: "20vh" }}>
        <Login />
      </div>
    </div>
  );
}
export default Index;
