import router from './router'
import store from './store'
// import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken, getUserId } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { isInited } from '@/api/config'
import { getuserrole } from '@/api/user'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = ['/login', '/bug/list', '/configuration/index'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)
  if (!store.getters.getIsInited) {
    isInited().then(response => {
      store.dispatch('app/toggleGetIsInited', true)
      store.dispatch('app/toggleIsInited', response)
      if (response) {
        if (to.query.userId && to.query.token) {
          store.dispatch('app/toggleToken', to.query.token)
          store.dispatch('app/toggleUserId', to.query.userId)
          getuserrole().then(response => {
            store.dispatch('app/toggleRole', response)
            next()
          })
        } else {
          if (getToken() && getUserId()) {
            store.dispatch('app/toggleToken', getToken())
            store.dispatch('app/toggleUserId', getUserId())
            getuserrole().then(response => {
              store.dispatch('app/toggleRole', response)
              next()
            })
          } else {
            next('/login')
          }
        }
      } else {
        if (to.query.userId && to.query.token) {
          store.dispatch('app/toggleToken', to.query.token)
          store.dispatch('app/toggleUserId', to.query.userId)
          next('/configuration/index')
        } else {
          if (getToken() && getUserId()) {
            store.dispatch('app/toggleToken', getToken())
            store.dispatch('app/toggleUserId', getUserId())
            next('/configuration/index')
          } else {
            next('/login')
          }
        }
      }
    })
  } else {
    if (!store.getters.token || !store.getters.userId) {
      if (to.path !== '/login') {
        next('/login')
      } else {
        next()
      }
    } else {
      next()
    }
    // if (!store.getters.userId && to.path !== '/login' && to.path !== '/configuration/index') {
    //   if (to.query.userId) {
    //     store.dispatch('app/toggleUserId', to.query.userId)
    //     next()
    //   } else {
    //     next('/login')
    //   }
    // } else {
    //   next()
    // }
  }

  // determine whether the user has logged in
  // const hasToken = getToken()

  // if (hasToken) {
  //   if (to.path === '/login') {
  //     // if is logged in, redirect to the home page
  //     next({ path: '/' })
  //     NProgress.done()
  //   } else {
  //     const hasGetUserInfo = store.getters.name
  //     if (hasGetUserInfo) {
  //       next()
  //     } else {
  //       try {
  //         // get user info
  //         await store.dispatch('user/getInfo')

  //         next()
  //       } catch (error) {
  //         // remove token and go to login page to re-login
  //         await store.dispatch('user/resetToken')
  //         Message.error(error || 'Has Error')
  //         next(`/login?redirect=${to.path}`)
  //         NProgress.done()
  //       }
  //     }
  //   }
  // } else {
  //   /* has no token*/

  //   if (whiteList.indexOf(to.path) !== -1) {
  //     // in the free login whitelist, go directly
  //     next()
  //   } else {
  //     // other pages that do not have permission to access are redirected to the login page.
  //     next(`/login?redirect=${to.path}`)
  //     NProgress.done()
  //   }
  // }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
