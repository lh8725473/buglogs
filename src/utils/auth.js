import Cookies from 'js-cookie'

const TokenKey = 'token'
const UserIdKey = 'userId'
const BaseURLKey = 'baseURL'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUserId() {
  return Cookies.get(UserIdKey)
}

export function setUserId(userId) {
  return Cookies.set(UserIdKey, userId)
}

export function removeUserId() {
  return Cookies.remove(UserIdKey)
}

export function getBaseURL() {
  return Cookies.get(BaseURLKey)
}

export function setBaseURL(baseURL) {
  return Cookies.set(BaseURLKey, baseURL)
}

export function removeBaseURL() {
  return Cookies.remove(BaseURLKey)
}
