import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/bsbug/page',
    method: 'get',
    params
  })
}
