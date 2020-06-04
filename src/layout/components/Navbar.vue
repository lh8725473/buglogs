<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu" :class="{ 'show-avatar': role === 'bugadmin' }">
      <span class="total-file-size">日志总大小: <span>{{ totalBugFileSize | statusFilter }}</span></span>
      <el-dropdown v-show="role === 'bugadmin'" class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <a>
            <el-dropdown-item @click.native="dialogFormVisible = true">修改密码</el-dropdown-item>
          </a>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-dialog title="修改密码" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="旧密码">
          <el-input v-model="form.LOGIN_PWD_OLD" type="password" />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="form.LOGIN_PWD" type="password" />
        </el-form-item>
        <el-form-item label="确认新密码">
          <el-input v-model="form.LOGIN_PWD_REVIEW" type="password" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="restPwd()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { logout } from '@/api/user'
import { totalBugFileSize } from '@/api/bug'
import { restPwd } from '@/api/config'
import { removeToken, removeUserId } from '@/utils/auth'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'role'
    ])
  },
  filters: {
    statusFilter(limit) {
      var size = ''
      if (limit < 0.1 * 1024) { // 如果小于0.1KB转化成B
        size = limit.toFixed(2) + 'B'
      } else if (limit < 0.1 * 1024 * 1024) { // 如果小于0.1MB转化成KB
        size = (limit / 1024).toFixed(2) + 'KB'
      } else if (limit < 0.1 * 1024 * 1024 * 1024) { // 如果小于0.1GB转化成MB
        size = (limit / (1024 * 1024)).toFixed(2) + 'MB'
      } else { // 其他转化成GB
        size = (limit / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
      }

      var sizestr = size + ''
      var len = sizestr.indexOf('\.')
      var dec = sizestr.substr(len + 1, 2)
      if (dec === '00') { // 当小数点后为00时 去掉小数部分
        return sizestr.substring(0, len) + sizestr.substr(len + 3, 2)
      }
      return sizestr
    }
  },
  data() {
    return {
      totalBugFileSize: 0,
      dialogFormVisible: false,
      form: {
        LOGIN_PWD: '',
        LOGIN_PWD_OLD: '',
        LOGIN_PWD_REVIEW: ''
      }
    }
  },
  created() {
    this.getTotalBugFileSize()
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    logout() {
      logout().then(response => {
        if (response) {
          this.$router.push(`/login?redirect=${this.$route.fullPath}`)
        }
      })
    },
    getTotalBugFileSize() {
      totalBugFileSize().then(response => {
        this.totalBugFileSize = response
      })
    },
    restPwd() {
      if (!this.form.LOGIN_PWD_OLD) {
        this.$message('旧密码不能为空')
        return
      }
      if (!this.form.LOGIN_PWD) {
        this.$message('新密码不能为空')
        return
      }
      if (this.form.LOGIN_PWD !== this.form.LOGIN_PWD_REVIEW) {
        this.$message('新密码与确认密码不一致')
        return
      }
      restPwd(this.form).then(response => {
        if (response) {
          this.dialogFormVisible = false
          removeToken()
          removeUserId()
          this.$message('修改密码成功')
          this.$router.push({ path: '/login' })
        } else {
          this.$message('旧密码不正确')
          return
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    &.show-avatar{
      .total-file-size{
        position: relative;
        margin-right: 0px;
        top: -15px;
        span{
          color: #409EFF;
        }
      }
    }
    .total-file-size{
      position: relative;
      margin-right: 10px;
      span{
        color: #409EFF;
      }
    }
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          opacity: 0;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
