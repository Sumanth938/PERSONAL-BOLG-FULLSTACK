import { toast } from "react-toastify";

import axios from "axios";
import { authActionTypes } from "../Store/Auth";
import { API_URL_CONSTANT, ROUTER_URL_CONSTANT } from "../Utilities/constants";
import { setItem } from "../Utilities/storage";

export function googleAuth(userDetails: any, navigate: any) {
  return (dispatch: any) => {
    dispatch({
      type: authActionTypes.GOOGLE_AUTH,
      payload: {
        data: [],
        loader: true,
        error: null,
      },
    });
    const url = API_URL_CONSTANT.GOOGLE_AUTH;
    axios
      .post(url, userDetails)
      .then((response: any) => {
        if (response.data?.data) {
          dispatch({
            type: authActionTypes.GOOGLE_AUTH,
            payload: {
              data: [],
              loader: false,
              error: null,
            },
          });
          setItem("token", response.data.data.access_token);
          toast.success(`successfully logged in !`);
          window.location.reload();
          window.location.href = ROUTER_URL_CONSTANT.MAIN;
        }
      })
      .catch((error: any) => {
        dispatch({
          type: authActionTypes.GOOGLE_AUTH,
          payload: {
            data: [],
            loader: false,
            error: error,
          },
        });
        if (error.response.status === 422) toast.info("you need to signup !");
        else toast.error("Something went wrong. Please Try Again..!");
      });
  };
}
