import axios from "axios";
import { toast } from "react-toastify";
import { API_URL_CONSTANT, ROUTER_URL_CONSTANT } from "../Utilities/constants";
import { setItem } from "../Utilities/storage";
import { authActionTypes } from "../Store/Auth";
import { formHeaders } from "../Utilities/common";


export function SigninApiCall(data: any) {
  return (dispatch: any) => {
    dispatch({
      type: authActionTypes.SIGN_IN,
      payload: {
        data: [],
        loader: true,
        error: null,
      },
    });
    const url = `${API_URL_CONSTANT.SIGN_IN}`;
    const loginDetails = new URLSearchParams();
    loginDetails.append("username", data.username);
    loginDetails.append("password", data.password);
    axios
      .post(url, loginDetails.toString(), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response: any) => {
        dispatch({
          type: authActionTypes.SIGN_IN,
          payload: {
            data: [],
            loader: false,
            error: null,
          },
        });
        setItem("token", response.data.access_token);
        toast.success(`successfully logged in !`);
        setTimeout(() => {
          window.location.reload();
          window.location.href = ROUTER_URL_CONSTANT.MAIN;
        }, 1000);
        
      })
      .catch((error: any) => {
        dispatch({
          type: authActionTypes.SIGN_IN,
          payload: {
            data: [],
            loader: false,
            error: error,
          },
        });
        toast.error("Authentication failed..!");
      });
  };
}