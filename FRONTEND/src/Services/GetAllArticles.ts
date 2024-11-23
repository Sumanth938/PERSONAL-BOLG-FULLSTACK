import axios from "axios";
import { toast } from "react-toastify";
import { API_URL_CONSTANT } from "../Utilities/constants";
import { authActionTypes } from "../Store/Auth";
import { Pagination } from "react-bootstrap";

// The fetchArticlesApiCall action creator
export function fetchArticlesApiCall(page: number, size: number, user_id: any) {
  return (dispatch: any) => {
    // Dispatch action for the start of the API call (loading state)
    dispatch({
      type: authActionTypes.FETCH_ARTICLES,
      payload: {
        data: [],
        loader: true,
        error: null,
        pagination: {
          current_page: page,
          total_pages: 1, // Placeholder until data is fetched
          total_items: 0, // Placeholder until data is fetched
        },
      },
    });

    // Define the API URL for fetching articles
    const url = `${
      API_URL_CONSTANT.GET_ALL_ARTICLES
    }?page=${page}&size=${size}${user_id ? `&user_id=${user_id}` : ``}`;

    // Make the API call
    axios
      .get(url, {
        headers: {
          Accept: "application/json",
        },
      })
      .then((response: any) => {
        // Dispatch action with data if API call is successful
        // console.log(response.data.pagination)
        const { data, pagination } = response.data;

        dispatch({
          type: authActionTypes.FETCH_ARTICLES,
          payload: {
            data: data, // Assuming response.data contains articles in the 'data' field
            pagination: pagination,
            loader: false,
            error: null,
          },
        });
        // toast.success(`Articles fetched successfully!`);
      })
      .catch((error: any) => {
        // Dispatch action with error if API call fails
        dispatch({
          type: authActionTypes.FETCH_ARTICLES,
          payload: {
            data: [],
            loader: false,
            error: error.message || "Failed to fetch articles",
          },
        });
        // toast.error("Failed to fetch articles. Please try again.");
      });
  };
}
