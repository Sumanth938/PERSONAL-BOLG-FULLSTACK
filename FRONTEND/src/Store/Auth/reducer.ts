import { SIGN_IN, SIGN_UP, GOOGLE_AUTH, FETCH_ARTICLES,GET_USER_ARTICLES ,GET_LOGIN_USER} from "./actionTypes";
import { authActionTypes } from "./types";  // Adjust the import based on your project structure

export const initialLoginState = {
  signin: {
    data: [],
    loader: false,
    error: null,
  },
  signup: {
    data: [],
    loader: false,
    error: null,
  },
  googleauth: {
    data: [],
    loader: false,
    error: null,
  },
  get_login_user: {
    data: [],
    loader: false,
    error: null,
  },
  articles: {
    data: [], // For articles data
    loader: false, // To track loading state for articles
    error: null, // For any errors
    pagination: {
      current_page: 1,
      total_pages: 1,
      total_items: 0,
    },
  },
  article: {  // New state for single article
    data: null,
    loader: false,
    error: null,
  },
};

export default (state = initialLoginState, action: authActionTypes) => {
  switch (action.type) {
    case SIGN_IN:
      return {
        ...state,
        signin: {
          ...state.signin,
          data: action.payload.data,
          loader: action.payload.loader,
          error: action.payload.error,
        },
      };
    case SIGN_UP:
      return {
        ...state,
        signup: {
          ...state.signup,
          data: action.payload.data,
          loader: action.payload.loader,
          error: action.payload.error,
        },
      };
    
    case GET_LOGIN_USER:
        return {
          ...state,
          get_login_user: {
            ...state.get_login_user,
            data: action.payload.data,
            loader: action.payload.loader,
            error: action.payload.error,
          },
        };
    case GOOGLE_AUTH:
      return {
        ...state,
        googleauth: {
          ...state.googleauth,
          data: action.payload.data,
          loader: action.payload.loader,
          error: action.payload.error,
        },
      };
    case FETCH_ARTICLES: // Handling the new action for fetching articles
      return {
        ...state,
        articles: {
          ...state.articles,
          data: action.payload.data,
          loader: action.payload.loader,
          error: action.payload.error,
          pagination: action.payload.pagination,
        },
        article: { // If the action is to fetch a single article
          ...state.article,
          data: action.payload.data || state.article.data,
          loader: action.payload.loader,
          error: action.payload.error,
        },
      };
      case GET_USER_ARTICLES: // Handling the new action for fetching articles
      return {
        ...state,
        articles: {
          ...state.articles,
          data: action.payload.data,
          loader: action.payload.loader,
          error: action.payload.error,
          pagination: action.payload.pagination,
        },
        article: { // If the action is to fetch a single article
          ...state.article,
          data: action.payload.data || state.article.data,
          loader: action.payload.loader,
          error: action.payload.error,
        },
      };
    default:
      return state;
  }
};
