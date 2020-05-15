import Mock from 'mockjs'

const data = Mock.mock({
  'items|30': [{
    bugId: '@id',
    name: '@sentence(1, 10)',
    description: '@sentence(10, 20)',
    createTime: '@datetime',
    updateTime: '@datetime',
    userId: '@id',
    userName: '@sentence(1, 10)',
    email: 'tester@163.com',
    'status|1': [1, 2, 3],
    fixer: 'fixer',
    fixTime: '@datetime',
    osVer: '1.0.0.1',
    logFileNum: '1'
  }]
})

export default [
  {
    url: '/123/132',
    type: 'get',
    response: config => {
      const items = data.items
      return {
        code: 888,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  }
]
