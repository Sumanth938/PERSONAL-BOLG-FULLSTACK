import axios from "axios";
import { toast } from "react-toastify";
import { GET_LOGIN_USER } from "../Store/Auth/actionTypes";
import { authHeaders } from "../Utilities/common";
import { API_URL_CONSTANT } from "../Utilities/constants";
import { deleteItem, getItem, setItem } from "../Utilities/storage";
import { ROUTER_URL_CONSTANT, USER_ID } from "../Utilities/constants";

export function getLoginUserApiCall() {
  function checkLoginTime() {
    const storedLoginTime = getItem("loginTime");
    if (storedLoginTime) {
      const currentTime = new Date().getTime();
      const timeDifference = currentTime - storedLoginTime;
      const oneDay = 24 * 60 * 60 * 1000;
      if (timeDifference >= oneDay) {
        deleteItem("loginTime");
        deleteItem("token");
        localStorage.clear();
        toast.info("Session expired. Please log in again.");
        window.location.reload();
        window.location.href = ROUTER_URL_CONSTANT.SIGN_IN;
      }
    }
  }
  return (dispatch: any) => {
    dispatch({
      type: GET_LOGIN_USER,
      payload: {
        data: [],
        loader: true,
        error: null,
      },
    });

    const url = `${API_URL_CONSTANT.GET_LOGIN_USER}`;

    axios
      .get(url, {
        headers: authHeaders,
      })
      .then((response) => {
        dispatch({
          type: GET_LOGIN_USER,
          payload: {
            data: response.data,
            loader: false,
            error: null,
          },
        });
        checkLoginTime();
        setItem(USER_ID, response?.data?.data?.id);
      })
      .catch((error) => {
        dispatch({
          type: GET_LOGIN_USER,
          payload: {
            data: [],
            loader: false,
            error: error.message || "An error occurred",
          },
        });
        checkLoginTime();
      });
  };
}
