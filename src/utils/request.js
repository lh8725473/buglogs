import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
import { getToken, setToken, setUserId, setBaseURL, getBaseURL, removeToken, removeUserId} from '@/utils/auth'

// create an axios instance
function GetRequest() {
  var url = location.hash.split('?')[1] // 获取url中"?"符后的字串
  var theRequest = new Object()
  if (url) {
    var strs = url.split('&')
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
    }
  }
  return theRequest
}
let baseURL = process.env.VUE_APP_BASE_API
console.log(GetRequest())
if (GetRequest()) {
  if (GetRequest().prefix) {
    baseURL = baseURL + '/' + GetRequest().prefix
    setBaseURL(baseURL)
  } else {
    if (getBaseURL()) {
      baseURL = getBaseURL()
    }
  }
  if (GetRequest().token) {
    setToken(GetRequest().token)
  }
  if (GetRequest().userId) {
    setUserId(GetRequest().userId)
  }
}
console.log(baseURL)
const service = axios.create({
  baseURL: baseURL, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (config.params) {
      if (store.getters.token) {
        config.params.token = store.getters.token
      }

      if (store.getters.userId) {
        config.params.userId = store.getters.userId
      }
    } else {
      config.params = {}
      if (store.getters.token) {
        config.params.token = store.getters.token
      }

      if (store.getters.userId) {
        config.params.userId = store.getters.userId
      }
    }
    // if (store.getters.token) {
    //   config.headers['X-Token'] = getToken()
    // }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.status !== 1) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      // if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
      //   // to re-login
      //   MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
      //     confirmButtonText: 'Re-Login',
      //     cancelButtonText: 'Cancel',
      //     type: 'warning'
      //   }).then(() => {
      //     store.dispatch('user/resetToken').then(() => {
      //       location.reload()
      //     })
      //   })
      // }
      if (res.status === -7) {
        console.log(res)
        removeToken()
        removeUserId()
        router.push({ path: '/401' })
      }

      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res.data
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
