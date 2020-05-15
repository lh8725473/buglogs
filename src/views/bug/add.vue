<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="标题">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.description" type="textarea" :rows="4" placeholder="请输入内容" />
      </el-form-item>
      <el-form-item label="收件人邮箱">
        <el-select v-model="form.extEmail" clearable remote multiple filterable allow-create default-first-option placeholder="输入邮箱，用回车添加" @change="changeEmails">
          <el-option v-for="item in knowledge" :key="item.value" :label="item.label" :value="item.label" />
        </el-select>
      </el-form-item>
      <el-form-item label="log记录时间">
        <!-- <el-radio-group v-model="form.timeRange">
          <el-radio-button label="3">3分钟内</el-radio-button>
          <el-radio-button label="5">5分钟内</el-radio-button>
          <el-radio-button label="10">5分钟内</el-radio-button>
        </el-radio-group> -->
        <el-button-group>
          <el-button @click="changeTimeRange(3)">3分钟内</el-button>
          <el-button @click="changeTimeRange(5)">5分钟内</el-button>
          <el-button @click="changeTimeRange(10)">10分钟内</el-button>
        </el-button-group>
      </el-form-item>
      <el-form-item label="">
        <el-col :span="11">
          <el-date-picker
            v-model="form.startTime"
            :format="'yyyy-MM-dd HH:mm'"
            type="datetime"
            placeholder="选择开始时间"
            style="width: 100%;"
          />
        </el-col>
        <el-col :span="2" class="line">-</el-col>
        <el-col :span="11">
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
          <el-radio label="1">是</el-radio>
          <el-radio label="2">否</el-radio>
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
        <el-button type="primary" @click="addbsbug">提交bug</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import { addbsbug, getbsbugfiletypes } from '@/api/bug'
import { getBugContentTemplate } from '@/api/config'
import _ from 'lodash'

export default {
  data() {
    return {
      form: {
        name: '',
        description: '',
        userId: '1',
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
      knowledge: []
    }
  },
  created() {
    this.getbsbugfiletypes()
    this.getBugContentTemplate()
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
      // const postForm = this.form
      // postForm.fileType = this.form.splice(',')
      const postform = this.form
      if (this.form.extEmail) {
        postform.extEmail = this.form.extEmail.join(';')
      }
      console.log(this.form.fileType)
      if (this.form.fileType) {
        postform.fileType = this.$refs.tree.getCheckedKeys().join(';')
      }
      addbsbug(this.form).then(response => {
        if (response === true) {
          this.$message('提交bug成功')
          this.$router.push({ path: '/bug/list' })
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

