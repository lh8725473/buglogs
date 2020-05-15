<template>
  <div class="app-container">
    <div class="search-action">
      <el-button type="primary" size="small" @click="addBug()">添加</el-button>
      <el-button type="primary" size="small" :disabled="buttonDis.deleteBug" @click="deletebsbugs()">删除</el-button>
      <el-button type="primary" size="small" :disabled="buttonDis.fixBug" @click="resolves()">修复</el-button>
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
      <el-table-column label="ID" width="150">
        <template slot-scope="scope">
          {{ scope.row.bugId }}
        </template>
      </el-table-column>
      <el-table-column label="标题" width="110">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="版本" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.osVer }}</span>
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
            <el-tag slot="reference" :type="scope.row.status | statusFilter" @click="getbugs(scope.row)">{{ scope.row.status | bugStatus }}</el-tag>
          </el-popover>
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
      <el-table-column
        fixed="right"
        label="操作"
        width="130"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="deletebsbug(scope.row)">删除</el-button>
          <el-button type="text" size="small" @click="editBug(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="fixBug(scope.row)">修复</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="10"
      :total="total"
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
            <el-col :span="2" class="line">-</el-col>
            <el-col :span="11">
              <el-date-picker v-model="bugFileform.endTime" :format="'yyyy-MM-dd HH:mm'" type="datetime" placeholder="选择结束时间" style="width: 100%;" />
            </el-col>
          </el-form-item>
          <el-form-item label="数字类型">
            <el-radio-group v-model="bugFileform.storageType">
              <el-radio label="1">本地</el-radio>
              <el-radio label="2">上传云端</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="收集的日志类型">
            <el-checkbox-group v-model="bugFileform.fileType">
              <el-checkbox v-for="bugfiletype in bugfiletypes" :key="bugfiletype" :label="bugfiletype" name="type" />
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addBugFile()">添加</el-button>
            <el-button>取消</el-button>
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
        <el-table-column property="fileSize" label="文件大小" />
        <el-table-column property="fileType" label="文件类型" />
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
        <el-table-column property="uploadStatus" label="上传状态">
          <template slot-scope="scope">
            {{ scope.row.uploadStatus | uploadStatus }}
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="120"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="downloadFile(scope.row)">下载</el-button>
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
import { getbuglist, listbsbugfile, deletebsbugfile, deletebsbugfiles, addbsbugfile, deletebsbug, deletebsbugs, resolve, resolves, getbsbugfiletypes, logslistbybugid } from '@/api/bug'

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
        7: '日志保存失败'
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
    }
  },
  computed: {
    ...mapGetters([
      'userId'
    ])
  },
  data() {
    return {
      getBugListParams: {
        userId: this.$store.state.app.userId,
        status: '',
        startTime: '2020-04-29 09:10:10',
        endTime: '2020-05-29 09:10:10',
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
        fileType: ['前端', '后端']
      },
      multipleSelection: [],
      bugFileMultipleSelection: [],
      buttonDis: {
        deleteBug: true,
        fixBug: true,
        deleteFile: true
      },
      bugfiletypes: [],
      reverse: true,
      activities: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      console.log(this.getBugListParams)
      getbuglist(this.getBugListParams).then(response => {
        console.log(response)
        this.list = response.data
        this.total = response.total
        this.listLoading = false
      })
    },
    openBugFileList(bugId) {
      this.bugFileform.bugId = bugId
      listbsbugfile({
        bugId: bugId
      }).then(response => {
        console.log(response)
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
    },
    addBugFile() {
      addbsbugfile(this.bugFileform).then(response => {
        if (response) {
          this.$message('添加bug日志成功')
          listbsbugfile({
            bugId: this.bugFileform.bugId
          }).then(response => {
            this.dialogAddBugFile = false
            this.bugFileList = response
          })
        }
        console.log(response)
      })
    },
    downloadFile(file) {
      if (file.filePathType === 2) {
        window.open(file.filePath)
      } else {
        window.open(process.env + '/bsbug/downloadbugfile?id=' + file.id)
      }
    },
    editBug(bug) {
      console.log(bug)
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
    },
    bugFileSelectionChange(val) {
      this.bugFileMultipleSelection = val
      console.log(this.bugFileMultipleSelection.length)
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
            this.fetchData()
          }
        })
      }).catch(() => {
      })
    },
    getbsbugfiletypes() {
      getbsbugfiletypes().then(response => {
        this.bugfiletypes = response
        console.log(this.getTreeAllIds(this.bugfiletypes))
        this.form.fileType = response
      })
    },
    getTreeAllIds(tree, ids) {
      if (ids === undefined) {
        ids = []
      }
      _.forEach(tree, (items) => {
        ids.push(items.items)
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
    }
  }
}
</script>

<style scoped>
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
</style>
