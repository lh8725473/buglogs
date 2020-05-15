<template>
  <div class="app-container">
    <el-divider content-position="left">客户信息</el-divider>
    <el-form ref="form" :model="form" label-width="150px">
      <el-form-item label="客户名称">
        <el-input v-model="form.CLIENT_NAME" />
      </el-form-item>
      <el-form-item label="功能是否开始">
        <el-radio-group v-model="form.FUNC_ENABLE">
          <el-radio label="1">是</el-radio>
          <el-radio label="2">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="客户地址">
        <el-input v-model="form.CLIENT_CONTACT_ADDRESS" />
      </el-form-item>
      <el-form-item label="客户联系人">
        <el-input v-model="form.CLIENT_CONTACT_USER" />
      </el-form-item>
      <el-form-item label="联系人邮箱">
        <el-input v-model="form.CLIENT_CONTACT_EMAIL" />
      </el-form-item>
      <el-form-item label="联系人电话">
        <el-input v-model="form.CLIENT_CONTACT_PHONE" />
      </el-form-item>
      <el-form-item label="管理员登录用户名">
        <el-input v-model="form.LOGIN_NAME" />
      </el-form-item>
      <!-- <el-form-item label="管理员登录密码">
        <el-input v-model="form.LOGIN_PWD" />
      </el-form-item> -->
      <el-divider content-position="left">bug提交</el-divider>
      <el-form-item label="log上传地址">
        <el-radio-group v-model="form.BUG_FILE_STORAGE_TYPE">
          <el-radio label="1">本地</el-radio>
          <el-radio label="2">上传云端</el-radio>
          <el-radio label="3">客户自己选择</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="邮件发送日志附件">
        <el-radio-group v-model="form.EMAIL_FILE">
          <el-radio label="1">发送</el-radio>
          <el-radio label="2">不发送</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="默认提醒邮箱">
        <el-select v-model="form.BUG_NOTICE_EMAIL" clearable remote multiple filterable allow-create default-first-option placeholder="输入邮箱，用回车添加" @change="changeEmails">
          <el-option v-for="item in knowledge" :key="item.value" :label="item.label" :value="item.label" />
        </el-select>
      </el-form-item>
      <el-form-item label="描述模板">
        <el-input v-model="form.BUG_CONTENT_TEMPLATE" type="textarea" :rows="4" placeholder="请输入内容" />
      </el-form-item>
      <el-divider content-position="left">发送邮箱配置</el-divider>
      <el-form-item label="SMTP服务器地址">
        <el-input v-model="form.MAIL_HOST" />
      </el-form-item>
      <el-form-item label="邮箱用户名">
        <el-input v-model="form.MAIL_USERNAME" />
      </el-form-item>
      <el-form-item label="邮箱密码">
        <el-input v-model="form.MAIL_PWD" />
      </el-form-item>
      <el-form-item label="发送人邮">
        <el-input v-model="form.MAIL_SENDER" />
      </el-form-item>
      <el-form-item label="发件人姓名">
        <el-input v-model="form.MAIL_NAME" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateSysConfig">更新配置</el-button>
        <el-button type="warning" @click="testEmail()">测试邮箱配置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { listSysConfig, updateSysConfig, testmailconfig } from '@/api/config'
import _ from 'lodash'

export default {
  data() {
    return {
      form: {
        CLIENT_CONTACT_ADDRESS: '', // 客户地址
        FUNC_ENABLE: '1', // 功能是否开启 1.开启 2.不开启
        BUG_FILE_STORAGE_TYPE: '', // 客户
        CLIENT_CONTACT_EMAIL: '', // 联系人邮箱
        LOGIN_NAME: '', // bug管理员登陆用户名
        // LOGIN_PWD: '', // bug管理员登陆密码
        CLIENT_NAME: '', // 客户名字
        CLIENT_CONTACT_USER: '', // 客户联系人
        CLIENT_CONTACT_PHONE: '', // 客户联系电话
        EMAIL_FILE: '2', // 邮件中是否发送日志附件 1.发送 2.不发送
        BUG_NOTICE_EMAIL: [], // 默认提醒邮箱
        BUG_CONTENT_TEMPLATE: '' // 描述模板
      },
      knowledge: []
    }
  },
  created() {
    this.getSysConfig()
  },
  methods: {
    onSubmit() {
      this.$message('submit!')
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    },
    getSysConfig() {
      listSysConfig().then(response => {
        console.log(response)
        console.log(response.BUG_NOTICE_EMAIL)
        if (response.BUG_NOTICE_EMAIL) {
          response.BUG_NOTICE_EMAIL = response.BUG_NOTICE_EMAIL.split(';')
        }
        this.form = response
        // this.list = response.data.items
        // this.listLoading = false
      })
    },
    updateSysConfig() {
      const postform = this.form
      if (this.form.BUG_NOTICE_EMAIL) {
        postform.BUG_NOTICE_EMAIL = this.form.BUG_NOTICE_EMAIL.join(';')
      }
      updateSysConfig(this.form).then(response => {
        if (response) {
          this.$message('更新配置成功')
          this.getSysConfig()
        }
      })
    },
    changeEmails(emails) {
      var reg = /^([a-zA-Z0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
      _.remove(emails, email => {
        return !(reg.test(email))
      })
      console.log(emails)
    },
    testEmail() {
      testmailconfig({
        MAIL_HOST: this.form.MAIL_HOST,
        MAIL_SENDER: this.form.MAIL_SENDER,
        MAIL_USERNAME: this.form.MAIL_USERNAME,
        MAIL_PWD: this.form.MAIL_PWD,
        MAIL_NAME: this.form.MAIL_NAME
      }).then(response => {
        console.log(response)
        if (response) {
          this.$message('邮箱测试成功')
        } else {
          this.$message.error('邮箱测试失败')
        }
      })
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
.el-select{
  width: 100%;
}
</style>

