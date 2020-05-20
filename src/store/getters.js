const getters = {
  getIsInited: state => state.app.getIsInited,
  isInited: state => state.app.isInited,
  userId: state => state.app.userId,
  token: state => state.app.token,
  role: state => state.app.role,
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  avatar: state => state.user.avatar,
  name: state => state.user.name
}
export default getters
