import request from '@/utils/request'

export function listSysConfig(params) {
  return request({
    url: '/bsconfig/listSysConfig',
    method: 'get',
    params
  })
}

export function updateSysConfig(data) {
  return request({
    url: '/bsconfig/updateSysConfig',
    method: 'post',
    data
  })
}

export function isInited(params) {
  return request({
    url: '/bsconfig/isInited',
    method: 'get',
    params
  })
}

export function getBugContentTemplate(params) {
  return request({
    url: '/bsconfig/getBugContentTemplate',
    method: 'get',
    params
  })
}

export function testmailconfig(data) {
  return request({
    url: '/bsconfig/testmailconfig',
    method: 'post',
    data
  })
}

export function restPwd(data) {
  return request({
    url: '/bsconfig/restPwd',
    method: 'post',
    data
  })
}
