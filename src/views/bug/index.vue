<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="标题">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.description" />
      </el-form-item>
      <el-form-item label="当前系统版本">
        <el-input v-model="form.osVer" />
      </el-form-item>
      <el-form-item label="log记录时间">
        <el-col :span="11">
          <el-date-picker v-model="form.startTime" type="datetime" placeholder="选择开始时间" style="width: 100%;" />
        </el-col>
        <el-col :span="2" class="line">-</el-col>
        <el-col :span="11">
          <el-time-picker v-model="form.endTime" type="datetime" placeholder="选择结束时间" style="width: 100%;" />
        </el-col>
      </el-form-item>
      <el-form-item label="数字类型">
        <el-radio-group v-model="form.storageType">
          <el-radio label="1">本地</el-radio>
          <el-radio label="2">上传云端</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="收集的日志类型">
        <el-checkbox-group v-model="form.fileType">
          <el-checkbox label="前端" name="type" />
          <el-checkbox label="后端" name="type" />
          <el-checkbox label="底层" name="type" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Create</el-button>
        <el-button @click="onCancel">Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
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
        startTime: '',
        endTime: '',
        storageType: '1',
        fileType: ['前端', '后端']
      }
    }
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
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

