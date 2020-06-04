<template>
  <div class="app-container">
    <div class="search-action">
      <el-button type="primary" size="small" @click="addBug()">添加</el-button>
      <el-button type="primary" size="small" :disabled="buttonDis.deleteBug" @click="deletebsbugs()">删除</el-button>
      <el-button type="primary" size="small" :disabled="buttonDis.fixBug" @click="resolves()">标记修复</el-button>
      <el-button type="primary" size="small" :disabled="buttonDis.download" @click="downloadBug()">下载</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="40"
      />
      <el-table-column label="ID" width="110">
        <template slot-scope="scope">
          {{ scope.row.bugId }}
        </template>
      </el-table-column>
      <el-table-column label="标题" width="110">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center">
        <template slot-scope="scope">
          <el-tooltip
            placement="top"
          >
            <div slot="content">
              <div class="tooltipdescription">  {{ scope.row.description }} </div>
            </div>
            <div class="wrap_one"> {{ scope.row.description }} </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="版本" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.osVer }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="110" align="center">
        <template slot-scope="scope">
          <el-popover
            placement="right"
            width="400"
            trigger="click"
          >
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
            <el-link slot="reference" :type="scope.row.status | statusFilter" @click="getbugs(scope.row)">{{ scope.row.status | bugStatus }}</el-link>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="日志状态" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bugFileStatus | bugFileStatusFilter }}<i v-show="scope.row.bugFileStatus === 1" class="el-icon-loading" /></span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="160" align="center">
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column label="提出人" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.userName }}
        </template>
      </el-table-column>
      <el-table-column label="修复人" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.fixer }}
        </template>
      </el-table-column>
      <el-table-column label="修复时间" width="160" align="center">
        <template slot-scope="scope">
          {{ scope.row.fixTime }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" class-name="status-col" label="日志数量" width="110" align="center">
        <template slot-scope="scope">
          <el-link type="primary" @click="openBugFileList(scope.row.bugId)">{{ scope.row.logFileNum }}</el-link>
        </template>
      </el-table-column>
      <!-- <el-table-column
        fixed="right"
        label="操作"
        width="130"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="deletebsbug(scope.row)">删除</el-button>
          <el-button type="text" size="small" @click="editBug(scope.row)">编辑</el-button>
          <el-button type="text" size="small" :disabled="scope.row.status === 2" @click="fixBug(scope.row)">修复</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="10"
      :total="total"
      @current-change="pageChange"
    />

    <el-dialog title="日志列表" :visible.sync="dialogBugFileList" width="70%">
      <div class="search-action">
        <el-button type="primary" size="small" @click="onpenDialogBugFile()">添加日志</el-button>
        <el-button type="primary" size="small" :disabled="buttonDis.deleteFile" @click="deleteFiles()">删除</el-button>
      </div>
      <el-dialog
        width="50%"
        title="添加bug日志文件"
        :visible.sync="dialogAddBugFile"
        append-to-body
      >
        <el-form :model="bugFileform" label-width="120px">
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
              <el-date-picker v-model="bugFileform.startTime" :format="'yyyy-MM-dd HH:mm'" type="datetime" placeholder="选择开始时间" style="width: 100%;" />
            </el-col>
            <el-col :span="2" class="line">至</el-col>
            <el-col :span="11">
              <el-date-picker v-model="bugFileform.endTime" :format="'yyyy-MM-dd HH:mm'" type="datetime" placeholder="选择结束时间" style="width: 100%;" />
            </el-col>
          </el-form-item>
          <el-form-item label="收件人邮箱">
            <el-select v-model="bugFileform.extEmail" clearable remote multiple filterable allow-create default-first-option placeholder="输入邮箱，用回车添加" @change="changeEmails">
              <el-option v-for="item in knowledge" :key="item.value" :label="item.label" :value="item.label" />
            </el-select>
          </el-form-item>
          <el-form-item label="是否上传到云端">
            <el-radio-group v-model="bugFileform.storageType">
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
            <!-- <el-checkbox-group v-model="bugFileform.fileType">
              <el-checkbox v-for="bugfiletype in bugfiletypes" :key="bugfiletype" :label="bugfiletype" name="type" />
            </el-checkbox-group> -->
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addBugFile()">添加</el-button>
            <el-button @click="dialogAddBugFile = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <el-table
        :data="bugFileList"
        border
        fit
        highlight-current-row
        @selection-change="bugFileSelectionChange"
      >
        <el-table-column
          type="selection"
          width="40"
        />
        <el-table-column property="id" label="ID" />
        <el-table-column property="startTime" label="开始时间" />
        <el-table-column property="endTime" label="结束时间" />
        <el-table-column property="createTime" label="创建时间" />
        <el-table-column property="fileSize" label="文件大小">
          <template slot-scope="scope">
            {{ scope.row.fileSize | fileSizeFilter }}
          </template>
        </el-table-column>
        <el-table-column property="fileTypeHTML" label="文件类型" width="200" show-overflow-tooltip />
        <el-table-column property="status" label="状态">
          <template slot-scope="scope">
            {{ scope.row.status | bugFileStatus }}
          </template>
        </el-table-column>
        <el-table-column property="storageType" label="存储方式">
          <template slot-scope="scope">
            {{ scope.row.storageType | storageType }}
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100"
        >
          <template slot-scope="scope">
            <el-button v-show="scope.row.status == 5" type="text" size="small" @click="downloadFile(scope.row)">下载</el-button>
            <el-button type="text" size="small" @click="deleteFile(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
import { formatSeconds } from '@/utils/index'
import { getBaseURL } from '@/utils/auth'
import { getbuglist, listbsbugfile, deletebsbugfile, deletebsbugfiles, addbsbugfile, deletebsbug, deletebsbugs, resolve, resolves, getbsbugfiletypes, logslistbybugid, getMaxBugTime } from '@/api/bug'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'danger',
        2: 'success'
      }
      return statusMap[status]
    },
    bugStatus(status) {
      const statusMap = {
        1: '已提交',
        2: '已解决'
      }
      return statusMap[status]
    },
    bugFileStatus(status) {
      const statusMap = {
        1: '已提交',
        2: '读取中',
        3: '压缩中',
        4: '上传中',
        5: '已完成',
        6: '日志文件类型错误',
        7: '日志保存失败',
        8: '日志为空'
      }
      return statusMap[status]
    },
    storageType(storageType) {
      const storageTypeMap = {
        1: '本地',
        2: '上传云端',
        3: '自己选择'
      }
      return storageTypeMap[storageType]
    },
    uploadStatus(uploadStatus) {
      const uploadStatusMap = {
        1: '未开始',
        2: '上传中',
        3: '上传完毕'
      }
      return uploadStatusMap[uploadStatus]
    },
    bugFileStatusFilter(bugFileStatus) {
      const bugFileStatusMap = {
        1: '生成中',
        2: '已完成'
      }
      return bugFileStatusMap[bugFileStatus]
    },
    fileSizeFilter(limit) {
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
  computed: {
    ...mapGetters([
      'userId',
      'token'
    ])
  },
  data() {
    return {
      stringText: '模板：↵版本',
      getBugListParams: {
        userId: this.$store.state.app.userId,
        status: '',
        startTime: '2020-04-29 09:10:10',
        endTime: '',
        index: 0,
        size: 10
      },
      list: [],
      total: 0,
      listLoading: true,
      dialogBugFileList: false,
      bugFileList: [],
      dialogAddBugFile: false,
      bugFileform: {
        startTime: new Date(((new Date()).getTime() - 60 * 1000 * 3)),
        endTime: new Date(),
        storageType: '1',
        fileType: []
      },
      multipleSelection: [],
      bugFileMultipleSelection: [],
      buttonDis: {
        deleteBug: true,
        fixBug: true,
        deleteFile: true,
        download: true
      },
      bugfiletypes: [],
      reverse: false,
      activities: [],
      defaultCheckedKeys: [],
      props: {
        children: 'childs',
        label: 'name'
      },
      maxBugTime: 0,
      knowledge: []
    }
  },
  created() {
    this.fetchData()
  },
  mounted() {
    this.$socket.emit('bs_message_to', {
      opera: 'on',
      token: this.$store.state.app.token
    })
    this.$socket.on('bs_message_get', (data) => {
      console.log(data)
      const bugInfo = _.find(this.list, { bugId: data.bugId })
      if (bugInfo) {
        this.$set(bugInfo, 'bugFileStatus', data.bugFileStatus)
      }
      const bugFileInfo = _.find(this.bugFileList, { id: data.bugFileId })
      if (bugFileInfo) {
        this.$set(bugFileInfo, 'status', data.status)
      }
    })
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getbuglist(this.getBugListParams).then(response => {
        this.list = response.data
        this.total = response.total
        _.forEach(this.list, (item) => {
          console.log(item.description)
        })
        this.listLoading = false
      })
    },
    openBugFileList(bugId) {
      this.bugFileform.bugId = bugId
      listbsbugfile({
        bugId: bugId
      }).then(response => {
        this.dialogBugFileList = true
        this.bugFileList = response
        // this.list = response.data
        // this.total = response.total
        // this.listLoading = false
      })
    },
    deleteFile(file) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletebsbugfile({
          id: file.id
        }).then(response => {
          if (response) {
            this.$message('删除bug日志成功')
            listbsbugfile({
              bugId: this.bugFileform.bugId
            }).then(response => {
              this.bugFileList = response
            })
          }
        })
      }).catch(() => {
      })
    },
    deleteFiles() {
      this.$confirm('此操作将永久删除文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletebsbugfiles({
          ids: _.map(this.bugFileMultipleSelection, 'id')
        }).then(response => {
          if (response) {
            this.$message('删除日志成功')
            listbsbugfile({
              bugId: this.bugFileform.bugId
            }).then(response => {
              this.bugFileList = response
            })
          }
        })
      }).catch(() => {
      })
    },
    onpenDialogBugFile() {
      this.dialogAddBugFile = true
      this.getbsbugfiletypes()
      this.getMaxBugTime()
    },
    addBugFile() {
      if (this.bugFileform.endTime.getTime() - this.bugFileform.startTime.getTime() > this.maxBugTime * 1000) {
        this.$message('log记录时间超过最大限制:' + formatSeconds(this.maxBugTime))
        return
      }
      if (this.bugFileform.endTime.getTime() - this.bugFileform.startTime.getTime() <= 0) {
        this.$message('开始时间不能大于结束时间')
        return
      }
      if (this.bugFileform.endTime.getTime() - (new Date()).getTime() > 0) {
        this.$message('结束时间不能大于当前时间')
        return
      }
      const postform = _.clone(this.bugFileform)
      if (this.bugFileform.fileType) {
        postform.fileType = this.$refs.tree.getCheckedKeys().join(';')
        if (!postform.fileType) {
          this.$message('请选择收集日志类型')
          return
        }
      }
      if (this.bugFileform.extEmail) {
        postform.extEmail = this.bugFileform.extEmail.join(';')
      }
      addbsbugfile(postform).then(response => {
        if (response) {
          this.$message('添加bug日志成功')
          listbsbugfile({
            bugId: this.bugFileform.bugId
          }).then(response => {
            this.dialogAddBugFile = false
            this.bugFileList = response
          })
        }
      })
    },
    downloadFile(file) {
      if (file.filePathType === 2) {
        window.open(file.filePath)
      } else {
        if (getBaseURL()) {
          window.open(getBaseURL() + '/bsbug/downloadbugfile?id=' + file.id + '&token=' + this.$store.state.app.token + '&userId=' + this.$store.state.app.userId)
        } else {
          window.open(process.env.VUE_APP_BASE_API + '/bsbug/downloadbugfile?id=' + file.id + '&token=' + this.$store.state.app.token + '&userId=' + this.$store.state.app.userId)
        }
      }
    },
    editBug(bug) {
      this.$router.push('/bug/edit?bugId=' + bug.bugId)
    },
    addBug() {
      this.$router.push({ path: '/bug/add' })
    },
    deletebsbug(bug) {
      this.$confirm('是否删除此记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletebsbug({
          bugId: bug.bugId
        }).then(response => {
          if (response) {
            this.$message('删除成功')
            this.fetchData()
          }
        })
      }).catch(() => {
      })
    },
    fixBug(bug) {
      this.$confirm('确认标记此bug为已修复?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$prompt('请输入bug修复人', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
          // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
          // inputErrorMessage: '邮箱格式不正确'
        }).then(({ value }) => {
          resolve({
            bugId: bug.bugId,
            fixer: value
          }).then(response => {
            if (response) {
              this.$message('修复成功')
              this.fetchData()
            }
          })
        }).catch(() => {
        })
      }).catch(() => {
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.buttonDis.deleteBug = !(this.multipleSelection.length > 0)
      if (this.multipleSelection.length > 0 && !(_.find(this.multipleSelection, { status: 2 }))) {
        this.buttonDis.fixBug = false
      } else {
        this.buttonDis.fixBug = true
      }
      if (this.multipleSelection.length === 1 && _.find(this.multipleSelection, { bugFileStatus: 2 })) {
        this.buttonDis.download = false
      } else {
        this.buttonDis.download = true
      }
    },
    bugFileSelectionChange(val) {
      this.bugFileMultipleSelection = val
      this.buttonDis.deleteFile = !(this.bugFileMultipleSelection.length > 0)
    },
    resolves() {
      this.$confirm('确认标记为已修复?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$prompt('请输入bug修复人', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
          // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
          // inputErrorMessage: '邮箱格式不正确'
        }).then(({ value }) => {
          resolves({
            bugIds: _.map(this.multipleSelection, 'bugId'),
            fixer: value
          }).then(response => {
            if (response) {
              this.$message('修复成功')
              this.fetchData()
            }
          })
        }).catch(() => {
        })
      }).catch(() => {
      })
    },
    deletebsbugs(bug) {
      this.$confirm('是否删除记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletebsbugs({
          bugIds: _.map(this.multipleSelection, 'bugId')
        }).then(response => {
          if (response) {
            this.$message('删除成功')
            this.getBugListParams.index = 0
            this.fetchData()
          }
        })
      }).catch(() => {
      })
    },
    getbsbugfiletypes() {
      getbsbugfiletypes().then(response => {
        this.bugfiletypes = response
        this.defaultCheckedKeys = this.getTreeAllIds(this.bugfiletypes)
        this.bugFileform.fileType = response
      })
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
    getbugs(bug) {
      logslistbybugid({
        bugId: bug.bugId
      }).then(response => {
        this.activities = response
      })
    },
    pageChange(page) {
      this.getBugListParams.index = (page - 1) * 10
      this.fetchData()
    },
    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate)
    },
    changeTimeRange(time) {
      this.bugFileform.startTime = new Date(((new Date()).getTime() - 60 * 1000 * time))
      this.bugFileform.endTime = new Date()
    },
    getMaxBugTime() {
      getMaxBugTime().then(response => {
        this.maxBugTime = response
        console.log(response)
      })
    },
    downloadBug() {
      console.log(_.map(this.multipleSelection, 'bugId'))
      if (getBaseURL()) {
        window.open(getBaseURL() + '/bsbug/downloadbug?bugIds=' + _.map(this.multipleSelection, 'bugId') + '&token=' + this.$store.state.app.token + '&userId=' + this.$store.state.app.userId)
      } else {
        window.open(process.env.VUE_APP_BASE_API + '/bsbug/downloadbug?bugIds=' + _.map(this.multipleSelection, 'bugId') + '&token=' + this.$store.state.app.token + '&userId=' + this.$store.state.app.userId)
      }
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

<style lang="scss">
.search-action{
  margin-bottom: 15px;
}
.el-pagination{
  float: right;
  margin-top: 15px;
}
.line{
  text-align: center;
}
.el-tag{
  cursor: pointer;
}
.wrap_one{
  max-width: 500px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 18px;
  cursor: pointer;
}
.tooltipdescription{
  max-width: 500px;
  white-space: pre-wrap;
}

// .el-link{
//   text-decoration: underline;
// }

.el-link.is-underline:after{
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  height: 0;
  bottom: 0;
  border-bottom: 1px solid #409EFF;
}

.el-link--danger.is-underline:after{
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  height: 0;
  bottom: 0;
  border-bottom: 1px solid #F56C6C;
}

.el-link--success.is-underline:after{
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  height: 0;
  bottom: 0;
  border-bottom: 1px solid #67C23A;
}

.el-select{
  width: 100%;
}

</style>
