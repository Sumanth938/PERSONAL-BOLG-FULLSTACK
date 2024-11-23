export const END_POINT = "http://127.0.0.1:8000/";

export const API_URL_CONSTANT = {
  SIGN_IN: `${END_POINT}auth/token`,
  SIGN_UP: `${END_POINT}auth/create_normal_user`,
  GOOGLE_AUTH: `${END_POINT}social-login`,
  POST_ARTICLE : `${END_POINT}articles/` ,
  GET_ALL_ARTICLES : `${END_POINT}articles/`,
  GET_USER_ARTICLES :`${END_POINT}articles/user_articles`,
  GET_LOGIN_USER:`${END_POINT}auth/`,
  GET_AUTHORS:`${END_POINT}articles/authors`,
};

export const ROUTER_URL_CONSTANT = {
  MAIN: "/",
  SIGN_IN: "/signin",
  SIGN_UP: "/signup",
  DASHBOARD:"/dashboard",
  ALLPOSTS:"/allPosts",
  POST_ARTICLE:"/post_article",
  VIEW_ARTICLE:"/view_article"
};

export const USER_ID = "user_id";

