import "./App.css";
import Index from "./frontend/index";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import FrontEndRoute from "./route/frontend";
// import "bootstrap/dist/css/bootstrap.min.css";
import store from "./redux/store";
import { Provider } from "react-redux";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />}>
            {FrontEndRoute.map((route, index) => {
              const Page = route.component;
              return <Route key={index} path={route.path} element={<Page />} />;
            })}
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
