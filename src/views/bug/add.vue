<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="标题">
        <el-input v-model="form.name" maxlength="100" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.description" type="textarea" :rows="4" placeholder="请输入内容" maxlength="1000" show-word-limit />
      </el-form-item>
      <el-form-item label="收件人邮箱">
        <el-select v-model="form.extEmail" clearable remote multiple filterable allow-create default-first-option placeholder="输入邮箱，用回车添加" @change="changeEmails">
          <el-option v-for="item in knowledge" :key="item.value" :label="item.label" :value="item.label" />
        </el-select>
      </el-form-item>
      <el-form-item label="log记录时间">
        <el-button-group>
          <el-button @click="changeTimeRange(3)">3分钟内</el-button>
          <el-button @click="changeTimeRange(5)">5分钟内</el-button>
          <el-button @click="changeTimeRange(10)">10分钟内</el-button>
        </el-button-group>
      </el-form-item>
      <el-form-item label="">
        <el-col :span="8">
          <el-date-picker
            v-model="form.startTime"
            :format="'yyyy-MM-dd HH:mm'"
            type="datetime"
            placeholder="选择开始时间"
            style="width: 100%;"
          />
        </el-col>
        <el-col :span="2" class="line">至</el-col>
        <el-col :span="8">
          <el-date-picker
            v-model="form.endTime"
            :format="'yyyy-MM-dd HH:mm'"
            type="datetime"
            placeholder="选择结束时间"
            style="width: 100%;"
          />
        </el-col>
      </el-form-item>
      <el-form-item label="是否上传到云端">
        <el-radio-group v-model="form.storageType">
          <el-radio label="2" disabled>是</el-radio>
          <el-radio label="1">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="收集的日志类型">
        <el-tree
          ref="tree"
          :data="bugfiletypes"
          :props="props"
          node-key="id"
          show-checkbox
          :default-checked-keys="defaultCheckedKeys"
          @check-change="handleCheckChange"
        >
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <el-tooltip class="item" effect="dark" :content="data.description" placement="right">
              <span>{{ node.label }}</span>
            </el-tooltip>
          </span>
        </el-tree>
        <!-- <el-checkbox-group v-model="form.fileType">
          <el-checkbox v-for="bugfiletype in bugfiletypes" :key="bugfiletype" :label="bugfiletype" name="type" />
        </el-checkbox-group> -->
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addbsbug">提 交</el-button>
        <!-- <el-button @click="onCancel">取消</el-button> -->
      </el-form-item>
    </el-form>

    <el-dialog
      title="提交成功"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :show-close="false"
      width="40%"
    >
      <div class="bug-info">系统生成bug成功，已生成bug编号<span class="bug-id">{{ bugInfo.bugId }}</span></div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="goList()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { addbsbug, getbsbugfiletypes, getMaxBugTime } from '@/api/bug'
import { getBugContentTemplate } from '@/api/config'
import { formatSeconds } from '@/utils/index'
import _ from 'lodash'

export default {
  filters: {
    // formatSeconds(value) {
    //   const result = parseInt(value)
    //   const h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600)
    //   const m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60))
    //   const s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60))

    //   let res = ''
    //   if (h !== '00') res += `${h}h`
    //   if (m !== '00') res += `${m}min`
    //   res += `${s}s`
    //   return res
    // }
  },
  data() {
    return {
      form: {
        name: '',
        description: '',
        userId: this.$store.state.app.userId,
        userName: 'tester',
        email: 'tester@163.com',
        osVer: '',
        startTime: new Date(((new Date()).getTime() - 60 * 1000 * 3)),
        endTime: new Date(),
        storageType: '1',
        fileType: [],
        timeRange: 3,
        extEmail: []
      },
      props: {
        children: 'childs',
        label: 'name'
      },
      bugfiletypes: [],
      defaultCheckedKeys: [],
      knowledge: [],
      maxBugTime: 0,
      dialogVisible: false,
      bugInfo: {
        bugId: 0
      }
    }
  },
  created() {
    this.getbsbugfiletypes()
    this.getBugContentTemplate()
    this.getMaxBugTime()
  },
  mounted() {
    this.$socket.emit('bs_message_to', {
      opera: 'on',
      token: this.$store.state.app.token
    })
    this.$socket.on('bs_message_get', (data) => {
      console.log(data)
    })
  },
  methods: {
    getBugContentTemplate() {
      getBugContentTemplate().then(response => {
        this.form.description = response
      })
    },
    onSubmit() {
      this.$message('submit!')
    },
    changeTimeRange(time) {
      this.form.startTime = new Date(((new Date()).getTime() - 60 * 1000 * time))
      this.form.endTime = new Date()
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    },
    addbsbug() {
      if (!this.form.name) {
        this.$message('标题不能为空')
        return
      }
      if (!this.form.description) {
        this.$message('描述不能为空')
        return
      }
      if (this.form.endTime.getTime() - this.form.startTime.getTime() > this.maxBugTime * 1000) {
        this.$message('log记录时间超过最大限制:' + formatSeconds(this.maxBugTime))
        return
      }
      if (this.form.endTime.getTime() - this.form.startTime.getTime() <= 0) {
        this.$message('开始时间不能大于结束时间')
        return
      }
      if (this.form.endTime.getTime() - (new Date()).getTime() > 0) {
        this.$message('结束时间不能大于当前时间')
        return
      }
      const postform = _.clone(this.form)
      if (this.form.extEmail) {
        postform.extEmail = this.form.extEmail.join(';')
      }
      if (this.form.fileType) {
        postform.fileType = this.$refs.tree.getCheckedKeys().join(';')
        if (!postform.fileType) {
          this.$message('请选择收集日志类型')
          return
        }
      }
      addbsbug(postform).then(response => {
        if (response.status === true) {
          this.bugInfo = response
          this.dialogVisible = true
          // this.$message('提交bug成功')
          // this.$router.push({ path: '/bug/list' })
        }
      })
    },
    getbsbugfiletypes() {
      getbsbugfiletypes().then(response => {
        this.bugfiletypes = response
        console.log(this.getTreeAllIds(this.bugfiletypes))
        this.defaultCheckedKeys = this.getTreeAllIds(this.bugfiletypes)
        this.form.fileType = response
      })
    },
    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate)
    },
    getTreeAllIds(tree, ids) {
      if (ids === undefined) {
        ids = []
      }
      _.forEach(tree, (items) => {
        ids.push(items.id)
        if (items.childs.length > 0) {
          this.getTreeAllIds(items.childs, ids)
        }
      })
      return ids
    },
    changeEmails(emails) {
      var reg = /^([a-zA-Z0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
      _.remove(emails, email => {
        return !(reg.test(email))
      })
      console.log(emails)
    },
    getMaxBugTime() {
      getMaxBugTime().then(response => {
        this.maxBugTime = response
        console.log(response)
      })
    },
    goList() {
      this.$router.push({ path: '/bug/list' })
    }
  }
}
</script>

<style lang="scss" scoped>
.line{
  text-align: center;
}
.el-select{
  width: 100%;
}
.bug-info{
  font-size: 16px;
  .bug-id{
    font-size: 25px;
    color: #409EFF;
  }
}
</style>

