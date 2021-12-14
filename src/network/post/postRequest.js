import {baseRequest} from "../api";

//spring security默认的参数键值对请求
export function baseKeyValuePost(url, params) {
  return baseRequest({
    url: `${url}`,
    method: 'post',
    data: params,
    transformRequest: [function (data, headers) {
      let ret = '';
      for (let item in data) {
        ret += encodeURIComponent(item) + '=' + encodeURIComponent(data[item]) + '&'
      }
      return ret
    }],
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  })
}

//json形式的网络请求
export function jsonPost(url, param) {
  return baseRequest({
    url: `${url}`,
    method: 'post',
    data: param
  })
}

export function getRequest(url, param) {
  return baseRequest({
    url: `${url}`,
    method: 'get',
    data: param
  })
}

export function putRequest(url, param) {
  return baseRequest({
    url: `${url}`,
    method: 'put',
    data: param
  })
}

export function deleteRequest(url, param) {
  return baseRequest({
    url: `${url}`,
    method: 'delete',
    data: param
  })
}