<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import { getuserrole } from '@/api/user'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'sidebar',
      'role'
    ]),
    routes() {
      console.log(this.role)
      if (this.role === 'sysadmin') {
        this.$router.options.routes[3].hidden = false
        return this.$router.options.routes
      } else {
        this.$router.options.routes[3].hidden = true
        return this.$router.options.routes
      }
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  created() {
    this.getuserrole()
  },
  methods: {
    getuserrole() {
      getuserrole().then(response => {
        this.$store.dispatch('app/toggleRole', response)
      })
    }
  }
}
</script>
