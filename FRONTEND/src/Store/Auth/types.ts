import {  SIGN_IN , SIGN_UP , GOOGLE_AUTH ,FETCH_ARTICLES,GET_USER_ARTICLES,GET_LOGIN_USER} from './actionTypes';

interface Signin {
    type: typeof SIGN_IN;
    payload: any;
}

interface Signup {
    type: typeof SIGN_UP;
    payload: any;
}

interface GoogleAuth {
    type: typeof GOOGLE_AUTH;
    payload: any;
}

interface FetchArticles {
    type: typeof FETCH_ARTICLES;
    payload: any;
}
interface GetUserArticles {
    type: typeof GET_USER_ARTICLES;
    payload: any;
}

interface GetLoginUser {
    type: typeof GET_LOGIN_USER;
    payload: any;
}

export type authActionTypes = Signin | Signup | GoogleAuth| FetchArticles|GetUserArticles|GetLoginUser;