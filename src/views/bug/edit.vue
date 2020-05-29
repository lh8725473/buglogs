<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="标题">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.description" type="textarea" :rows="4" placeholder="请输入内容" />
      </el-form-item>
      <el-form-item label="操作记录">
        <el-timeline :reverse="reverse">
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="index"
            :timestamp="activity.createTime"
            :type="'success'"
          >
            {{ activity.description }}
          </el-timeline-item>
        </el-timeline>
      </el-form-item>
      <!-- <el-form-item label="当前系统版本">
        <el-input v-model="form.osVer" />
      </el-form-item> -->
      <!-- <el-form-item label="log记录时间">
        <el-col :span="11">
          <el-date-picker v-model="form.startTime" type="datetime" placeholder="选择开始时间" style="width: 100%;" />
        </el-col>
        <el-col :span="2" class="line">-</el-col>
        <el-col :span="11">
          <el-date-picker v-model="form.endTime" type="datetime" placeholder="选择结束时间" style="width: 100%;" />
        </el-col>
      </el-form-item> -->
      <!-- <el-form-item label="数字类型">
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
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="editbsbug">更新</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getbsbug, updatebsbug, logslistbybugid } from '@/api/bug'

export default {
  data() {
    return {
      bugId: '',
      form: {
        name: '',
        description: ''
      },
      reverse: true,
      activities: []
    }
  },
  created() {
    this.bugId = this.$route.query.bugId
    this.getBugInfo()
    this.getbugsLogs()
  },
  methods: {
    getBugInfo() {
      getbsbug({
        bugId: this.bugId
      }).then(response => {
        this.form = response
      })
    },
    onSubmit() {
      this.$message('submit!')
    },
    onCancel() {
      this.$router.push('/bug/list')
    },
    editbsbug() {
      updatebsbug(this.form).then(response => {
        if (response === true) {
          this.$message('更新bug成功')
          this.$router.push({ path: '/bug/list' })
        }
      })
    },
    getbugsLogs(bug) {
      logslistbybugid({
        bugId: this.bugId
      }).then(response => {
        this.activities = response
      })
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
.el-timeline {
  padding-left: 0;
  line-height: initial;
}
</style>

