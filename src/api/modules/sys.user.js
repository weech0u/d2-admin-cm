import {
  find,
  assign
} from 'lodash'

const users = [{
    username: 'admin',
    password: 'admin',
    uuid: 'admin-uuid',
    name: 'Admin'
  },
  {
    username: 'editor',
    password: 'editor',
    uuid: 'editor-uuid',
    name: 'Editor'
  },
  {
    username: 'user1',
    password: 'user1',
    uuid: 'user1-uuid',
    name: 'User1'
  }
]

export default ({
  service,
  request,
  serviceForMock,
  requestForMock,
  mock,
  faker,
  tools
}) => ({
  /**
   * @description 登录
   * @param {Object} data 登录携带的信息
   */
  SYS_USER_LOGIN(data = {}) {
    // 模拟数据
    mock
      .onAny('/login')
      .reply(config => {
        const user = find(users, tools.parse(config.data))
        return user ?
          tools.responseSuccess(assign({}, user, {
            token: faker.random.uuid()
          })) :
          tools.responseError({}, '账号或密码不正确')
      })
    // 接口请求
    return requestForMock({
      url: '/login',
      method: 'post',
      data
    })
  },
  getList(target, page = 1, ...rest) {
    let temp = ''
    if (rest.length != 0) temp = rest[0]
    return request({
      url: target + '?page=' + page + `&${temp}`,
      method: 'get',
    })
  },
  getOneList(target, id) {
    return request({
      url: target + '/' + id,
      method: 'get',
    })
  },
  addList(target, data) {
    return request({
      url: target,
      method: 'post',
      data
    })
  },
  editList(target, data = {}, id) {
    return request({
      url: target + '/' + id,
      method: 'post',
      data
    })
  },
  deleteList(target, data = {}, id) {
    return request({
      url: target + '/' + id,
      method: 'delete',
      data
    })
  },
})
