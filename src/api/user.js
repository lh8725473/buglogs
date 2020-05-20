import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/adminlogin',
    method: 'post',
    data
  })
}

export function logout(data) {
  return request({
    url: '/user/adminlogout',
    method: 'post',
    data
  })
}

export function getuserrole(params) {
  return request({
    url: '/user/getuserrole',
    method: 'get',
    params
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}
