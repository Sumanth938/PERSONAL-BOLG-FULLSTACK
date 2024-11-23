import { SystemState } from "../storeTypes";

export const getLoginState = (state: SystemState) => state.auth.signin;

export const getSignUpState = (state: SystemState) => state.auth.signup;

export const getGoogleAuthState = (state: SystemState) => state.auth.googleauth;

export const getLoginUserState = (state: SystemState) => state.auth.get_login_user;