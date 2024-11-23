import store from "../Store/store";
import { ROUTER_URL_CONSTANT } from "./constants";
import { deleteItem, getItem } from "./storage";

export const headers = {
  accept: "application/json",
  "Content-Type": "application/json",
};

export const formHeaders = {
  accept: "application/json",
  "Content-Type": "application/x-www-form-urlencoded",
};

export const dispatchStore = store.dispatch as
  | typeof store.dispatch
  | React.Dispatch<any>;

export const authHeaders = {
  // 'accept': 'application/json',
  "Content-Type": "application/json",
  "Authorization": `Bearer ${getItem("token")}`
};

export const authStatus = getItem("token")

export const Logout = () => {
  deleteItem("token")
  window.location.reload();
  window.location.href = ROUTER_URL_CONSTANT.MAIN;
};