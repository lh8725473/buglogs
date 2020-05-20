import request from '@/utils/request'

export function addbsbug(data) {
  return request({
    url: '/bsbug/addbsbug',
    method: 'post',
    data
  })
}

export function getbuglist(params) {
  return request({
    url: '/bsbug/page',
    method: 'get',
    params
  })
}

export function listbsbugfile(params) {
  return request({
    url: '/bsbug/listbsbugfile',
    method: 'get',
    params
  })
}

export function getbsbug(params) {
  return request({
    url: '/bsbug/getbsbug',
    method: 'get',
    params
  })
}

export function updatebsbug(data) {
  return request({
    url: '/bsbug/updatebsbug',
    method: 'post',
    data
  })
}

export function deletebsbugfile(data) {
  return request({
    url: '/bsbug/deletebsbugfile',
    method: 'post',
    data
  })
}

export function deletebsbugfiles(data) {
  return request({
    url: '/bsbug/deletebsbugfiles',
    method: 'post',
    data
  })
}

export function addbsbugfile(data) {
  return request({
    url: '/bsbug/addbsbugfile',
    method: 'post',
    data
  })
}

export function getbsbugfiletypes(params) {
  return request({
    url: '/bsbug/getbsbugfiletypes',
    method: 'get',
    params
  })
}

export function deletebsbug(data) {
  return request({
    url: '/bsbug/deletebsbug',
    method: 'post',
    data
  })
}

export function deletebsbugs(data) {
  return request({
    url: '/bsbug/deletebsbugs',
    method: 'post',
    data
  })
}

export function resolve(data) {
  return request({
    url: '/bsbug/resolve',
    method: 'post',
    data
  })
}

export function resolves(data) {
  return request({
    url: '/bsbug/resolves',
    method: 'post',
    data
  })
}

export function logslistbybugid(params) {
  return request({
    url: '/bslog/listbybugid',
    method: 'get',
    params
  })
}

export function totalBugFileSize(params) {
  return request({
    url: '/bsbug/totalBugFileSize',
    method: 'get',
    params
  })
}

export function getMaxBugTime(params) {
  return request({
    url: '/bsbug/getMaxBugTime',
    method: 'get',
    params
  })
}
