import { getItem } from "./storage";
import axios from "axios";

export function getReq(url: string) {
  return axios.get(url);
}

export function getReqParam(url: string) {
  return axios.get(url);
}

export function getReqParamheader(url: string) {
  const authHeader = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getItem("token")}`,
  };
  return axios({
    method: "get",
    url,
    headers: authHeader,
  });
}

export function postReq(url: string) {
  return axios.post(url);
}

export function postReqParam(url: string, args: any) {
  return axios({
    method: "post",
    url,
    data: args,
  });
}

export function postReqUrlParamheader(url: string) {
  const authHeader = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getItem("token")}`,
  };
  return axios({
    method: "post",
    url,
    headers: authHeader,
  });
}

export function postReqParamheader(url: string, args: any) {
  const authHeader = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getItem("token")}`,
  };
  return axios({
    method: "post",
    url,
    headers: authHeader,
    data: args,
  });
}

export function postReqParamheaderFile(url: string, args: any) {
  const authHeader = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getItem("token")}`,
  };
  return axios({
    method: "post",
    url,
    headers: authHeader,
    data: args,
    responseType: "arraybuffer",
  });
}
export function patchReqParam(url: string, args: any) {
  return axios({
    method: "patch",
    url,
    data: args,
  });
}

export function deleteReqParam(url: string) {
  return axios.delete(url);
}

export function deleteReqParamheader(url: string) {
  const authHeader = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getItem("token")}`,
  };
  return axios({
    method: "delete",
    url,
    headers: authHeader,
  });
}

export function putReq(url: string) {
  return axios({
    method: "put",
    url,
  });
}

export function putReqParamheader(url: string, args: any) {
  const authHeader = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getItem("token")}`,
  };
  return axios({
    method: "put",
    url,
    headers: authHeader,
    data: args,
  });
}


export function formatURL(url: any, params: any) {
  let uri = url;

  if (params !== null) {
    Object.keys(params).forEach((key: any) => {
      uri = uri.replace(`{${key}}`, encodeURIComponent(params[key].toString()));
    });
  }

  return uri;
}
