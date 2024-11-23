import "./App.css";
import { BrowserRouter, Routes, Route, Navigate  } from "react-router-dom";
import Home from "./Components/Home/Home";
import { ROUTER_URL_CONSTANT } from "./Utilities/constants";
import SignIn from "./Components/Authentication/SignIn/SignIn";
import SignUp from "./Components/Authentication/SIgnUp/SignUp";
import AutoScrollUp from "./Utilities/autoScrollUp";
import Header from "./Components/Header/Header";
import DashBoard from "./Components/Dashboard/Dashboard";
import PostArticle from "./Components/PostArticle/PostArticle";
import ViewArticle from "./Components/ViewArticle/ViewArticle";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { getItem } from "./Utilities/storage";
import { useEffect } from "react";
import { dispatchStore } from "./Utilities/common";
import { getLoginUserApiCall } from "./Services/GetLoginUser";

const authStatus = getItem("token");

function App() {

  useEffect(()=>{
    dispatchStore(getLoginUserApiCall())
  },[])

  return (
    <div className="App">
      <ToastContainer position="top-right"
        autoClose={3000}
        style={{ marginTop: "70px" }}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      // theme="colored"
      />
      <BrowserRouter>
        <Header />
        <AutoScrollUp />
        <Routes>
          <Route path={ROUTER_URL_CONSTANT.MAIN} element={<Home />} />
          <Route path={ROUTER_URL_CONSTANT.ALLPOSTS} element={<Home />} />
          <Route path={ROUTER_URL_CONSTANT.SIGN_IN} element={<SignIn />} />
          <Route path={ROUTER_URL_CONSTANT.SIGN_UP} element={<SignUp />} />
          <Route
            path={ROUTER_URL_CONSTANT.DASHBOARD}
            element={authStatus ? <DashBoard /> : <Navigate to={ROUTER_URL_CONSTANT.SIGN_IN} />}
          />
          <Route
            path={ROUTER_URL_CONSTANT.POST_ARTICLE}
            element={authStatus ? <PostArticle /> : <Navigate to={ROUTER_URL_CONSTANT.SIGN_IN} />}
          />
          <Route path={`${ROUTER_URL_CONSTANT.VIEW_ARTICLE}/:data`} element={<ViewArticle />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
