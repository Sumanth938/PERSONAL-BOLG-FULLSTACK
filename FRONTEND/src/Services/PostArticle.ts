import axios from "axios";
import { toast } from "react-toastify";
import { authActionTypes } from "../Store/Auth";
import { API_URL_CONSTANT ,ROUTER_URL_CONSTANT} from "../Utilities/constants";
import { headers,formHeaders,authHeaders } from "../Utilities/common";

export function postArticleAPICall(articleDetails: any) {
  return (dispatch: any) => {
    dispatch({
      type: authActionTypes.POST_ARTICLE,
      payload: {
        data: [],
        loader: true,
        error: null,
      },
    });
    const url = API_URL_CONSTANT.POST_ARTICLE;
    axios
      .post(url, articleDetails,{ headers: authHeaders })
      .then((response: any) => {
        if (response.data) {
          dispatch({
            type: authActionTypes.POST_ARTICLE,
            payload: {
              data: [],
              loader: false,
              error: null,
            },
          });
          toast.success(`Article Posted Sucessfully  !`);
          setTimeout(() => {
            window.location.href = ROUTER_URL_CONSTANT.DASHBOARD;
          }, 1000);
          
        }
      })
      .catch((error: any) => {
        if (error?.response?.status === 400) {
          dispatch({
            type: authActionTypes.POST_ARTICLE,
            payload: {
              data: [],
              loader: false,
              error: null,
            },
          });
          toast.error(error?.response?.data?.detail);
        } else {
          dispatch({
            type: authActionTypes.POST_ARTICLE,
            payload: {
              data: [],
              loader: false,
              error: null,
            },
          });
          toast.error("Something went wrong. Please Try Again..!");
        }
      });
  };
}
