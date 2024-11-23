import axios from "axios";
import { toast } from "react-toastify";
import { API_URL_CONSTANT } from "../Utilities/constants";
import { authActionTypes } from "../Store/Auth";
import { Pagination } from "react-bootstrap";
import {authHeaders} from "../Utilities/common"
import { deleteItem, getItem } from "../Utilities/storage";


// The fetchArticlesApiCall action creator
export function fetchUserArticlesApiCall(page: number, size: number) {
  return (dispatch: any) => {
    // Dispatch action for the start of the API call (loading state)
    dispatch({
      type: authActionTypes.GET_USER_ARTICLES,
      payload: {
        data: [],
        loader: true,
        error: null,
        pagination: {
            current_page: page,
            total_pages: 1, // Placeholder until data is fetched
            total_items: 0,  // Placeholder until data is fetched
          },
      },
    });

    // Define the API URL for fetching articles
    const url = `${API_URL_CONSTANT.GET_USER_ARTICLES}?page=${page}&size=${size}`;

    // Make the API call
    axios
      .get(url, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getItem("token")}`
        },
      })
      .then((response: any) => {
        // Dispatch action with data if API call is successful
        // console.log(response.data.pagination)
        const { data, pagination } = response.data;

        dispatch({
          type: authActionTypes.GET_USER_ARTICLES,
          payload: {
            data: data, // Assuming response.data contains articles in the 'data' field
            pagination:pagination,
            loader: false,
            error: null,
          },
        });
        // toast.success(`Articles fetched successfully!`);
      })
      .catch((error: any) => {
        // Dispatch action with error if API call fails
        dispatch({
          type: authActionTypes.GET_USER_ARTICLES,
          payload: {
            data: [],
            loader: false,
            error: error.message || "Failed to fetch articles",
          },
        });
        toast.error("Failed to fetch articles. Please try again.");
      });
  };
}
