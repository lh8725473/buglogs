import Cookies from 'js-cookie'

const state = {
  getIsInited: false,
  isInited: false,
  userId: '',
  token: '',
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop'
}

const mutations = {
  TOGGLE_GETISINITED: (state, getIsInited) => {
    state.getIsInited = getIsInited
  },
  TOGGLE_ISINITED: (state, isInited) => {
    state.isInited = isInited
  },
  TOGGLE_USERID: (state, userId) => {
    state.userId = userId
  },
  TOGGLE_TOKEN: (state, token) => {
    state.token = token
  },
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  }
}

const actions = {
  toggleGetIsInited({ commit }, getIsInited) {
    console.log(getIsInited)
    commit('TOGGLE_GETISINITED', getIsInited)
  },
  toggleIsInited({ commit }, isInited ) {
    commit('TOGGLE_ISINITED', isInited)
  },
  toggleUserId({ commit }, userId) {
    commit('TOGGLE_USERID', userId)
  },
  toggleToken({ commit }, token) {
    commit('TOGGLE_TOKEN', token)
  },
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
