import axios from "axios";
import { toast } from "react-toastify";
import { API_URL_CONSTANT } from "../Utilities/constants";
import { authActionTypes } from "../Store/Auth";

// The fetchArticleById action creator
export function fetchArticleByIdApiCall(id: number) {
  return (dispatch: any) => {
    // Dispatch action for the start of the API call (loading state)
    dispatch({
      type: authActionTypes.FETCH_ARTICLES,
      payload: {
        data: [],
        loader: true,
        error: null,
      },
    });

    // Define the API URL for fetching the article by ID
    const url = `${API_URL_CONSTANT.GET_ALL_ARTICLES}${id}`;

    // Make the API call
    axios
      .get(url, {
        headers: {
          "Accept": "application/json",
        },
      })
      .then((response: any) => {
        // Dispatch action with data if API call is successful
        const { data } = response.data;

        dispatch({
          type: authActionTypes.FETCH_ARTICLES,
          payload: {
            data: data, // Article data returned
            loader: false,
            error: null,
          },
        });
        toast.success(`Article fetched successfully!`);
      })
      .catch((error: any) => {
        // Dispatch action with error if API call fails
        dispatch({
          type: authActionTypes.FETCH_ARTICLES,
          payload: {
            data: [],
            loader: false,
            error: error.message || "Failed to fetch article",
          },
        });
        toast.error("Failed to fetch article. Please try again.");
      });
  };
}
