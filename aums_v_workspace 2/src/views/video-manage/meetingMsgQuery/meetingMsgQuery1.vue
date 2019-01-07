<template>
  <div class="mettingInfoQuery" v-loading="loading" element-loading-text="加载中。。。">
    <!-- 主页面  -->
    <div>
      <el-card>
        <el-form ref="queryForm" :model="queryForm" size="mini" label-position="top">
          <el-row :gutter="10">
            <el-col :md="6" :lg="4">
              <el-form-item label="多媒体连接号" prop="MMID">
                <el-input v-model="queryForm.MMID" placeholder="请输入多媒体连接号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="6" :lg="4">
              <el-form-item label="会议号" prop="CONFERID">
                <el-input v-model="queryForm.CONFERID" placeholder="请输入会议号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="6" :lg="4">
              <el-form-item label="会议状态" prop="STATUS">
                <el-select v-model="queryForm.STATUS" placeholder="请输会议状态">
                  <el-option
                    v-for="item in mettingStatus"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="6" :lg="4">
              <el-form-item label="开始日期" prop="STARTDATE">
                <el-date-picker
                  v-model="queryForm.STARTDATE"
                  value-format="yyyyMMdd"
                  type="date"
                  placeholder="选择日期"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :md="6" :lg="4">
              <el-form-item label="结束日期" prop="ENDDATE">
                <el-date-picker
                  v-model="queryForm.ENDDATE"
                  value-format="yyyyMMdd"
                  type="date"
                  placeholder="结束日期"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :md="3" :lg="2" class="searchBtnMarginTop">
              <el-button type="primary" size="mini" icon="el-icon-search" @click="queryModel">查询</el-button>
            </el-col>
            <el-col :md="3" :lg="2" class="searchBtnMarginTop">
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-refrech"
                @click="clearForm('queryForm')"
              >重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <el-card>
        <el-row>
          <el-col :md="12" :lg="12">
            <el-button
              type="danger"
              size="mini"
              @click="closeMetting"
              :disabled="!(selectList.length==1&&selectList[0].STATUS==1)"
            >终止会议</el-button>
          </el-col>
        </el-row>
        <el-table
          ref="tableData"
          :data="tableData"
          @selection-change="tableCheckBoxChange"
          border
          style="margin:10px 0 0 0"
        >
          <el-table-column fixed type="selection" width="40"></el-table-column>
          <el-table-column fixed prop="MMID" label="多媒体连接号" min-width="160"></el-table-column>
          <el-table-column prop="WORKDATE" label="日期" :formatter="dataFormatDate" min-width="100"></el-table-column>
          <el-table-column prop="CONFERID" label="会议号" min-width="100"></el-table-column>
          <el-table-column prop="CONFERNAME" label="会议名称"></el-table-column>
          <el-table-column prop="APPLYTIME" label="申请时间" :formatter="dataFormatTime"></el-table-column>
          <el-table-column prop="STARTTIME" label="开始时间" :formatter="dataFormatTime"></el-table-column>
          <el-table-column prop="ENDTIME" label="结束时间" :formatter="dataFormatTime"></el-table-column>

          <el-table-column prop="STATUS" label="会议状态" :formatter="meetingStatuFormat"></el-table-column>
          <el-table-column prop="CONFEPASSWORD" label="会议密码"></el-table-column>
          <el-table-column prop="CONFENUMBER" label="会议人数"></el-table-column>
          <el-table-column prop="CONFER1IP" label="参会者1IP" min-width="120"></el-table-column>
          <el-table-column prop="CONFER1NAME" label="参会者1编号"></el-table-column>
          <el-table-column prop="CONFER2IP" label="参会者2IP" min-width="120"></el-table-column>
          <el-table-column prop="CONFER2NAME" label="参会者2编号"></el-table-column>

          <el-table-column label="操作" align="center" fixed="right" width="100">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="checkDetail(scope.row,tableData)">查看详情</el-button>
              <el-button size="mini" type="text" @click="playOnline(scope.row)">在线播放</el-button>
              <el-button size="mini" type="text" @click="dowloadVideo(scope.row)">下载视频</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="box">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-sizes="[10,20,50,100]"
            :page-size="pageSize"
            layout="sizes,total,prev,pager,next,jumper"
            :total="tableTotal"
          ></el-pagination>
        </div>
      </el-card>
    </div>
    <!-- 新增弹窗  -->
    <!-- <el-dialog :title="popTitle"></el-dialog> -->
    <!-- 查看详情弹窗 -->
    <el-dialog title="详细信息" :visible.sync="detailPopStatus" :lock-scroll="false" width="800px">
      <el-form ref="detailForm" :model="detailForm" size="mini" label-position="top">
        <el-form-item>
          <el-card style="margin-top:10px">
            <h4>参会者1</h4>
            <div style="border-top: 1px solid #ebeef5;margin:15px 22px 12px;"></div>
            <el-row :gutter="10">
              <el-col :md="6" :lg="12">
                <el-form-item label="编号" prop="CONFER1">
                  <el-input v-model="detailForm.CONFER1" placeholder readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :md="6" :lg="12">
                <el-form-item label="姓名" prop="CONFER1NAME">
                  <el-input v-model="detailForm.CONFER1NAME" placeholder readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :md="6" :lg="12">
                <el-form-item label="状态" prop="CONFER1STATUS">
                  <el-select placeholder="请选择" v-model="detailForm.CONFER1STATUS" :disabled="true">
                    <el-option
                      v-for="item in [{value:'0',label:'未进入'},{value:'1',label:'进入'},{value:'2',label:'离开'}]"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="6" :lg="12">
                <el-form-item label="IP" prop="CONFER1IP">
                  <el-input v-model="detailForm.CONFER1IP" placeholder readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :md="6" :lg="12">
                <el-form-item label="进入时间" prop="CONFER1INTIME">
                  <el-input v-model="detailForm.CONFER1INTIME" placeholder readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :md="6" :lg="12">
                <el-form-item label="离开时间" prop="CONFER1OUTTIME">
                  <el-input v-model="detailForm.CONFER1OUTTIME" placeholder readonly></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
          <el-card style="margin-top:10px">
            <h4>参会者2</h4>
            <div style="border-top: 1px solid #ebeef5;margin:15px 22px 12px;"></div>
            <el-row :gutter="10">
              <el-col :md="6" :lg="12">
                <el-form-item label="编号" prop="CONFER2">
                  <el-input v-model="detailForm.CONFER2" placeholder readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :md="6" :lg="12">
                <el-form-item label="姓名" prop="CONFER2NAME">
                  <el-input v-model="detailForm.CONFER2NAME" placeholder readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :md="6" :lg="12">
                <el-form-item label="状态" prop="CONFER2STATUS">
                  <el-select placeholder="请选择" v-model="detailForm.CONFER2STATUS" :disabled="true">
                    <el-option
                      v-for="item in [{value:'0',label:'未进入'},{value:'1',label:'进入'},{value:'2',label:'离开'}]"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="6" :lg="12">
                <el-form-item label="IP" prop="CONFER2IP">
                  <el-input v-model="detailForm.CONFER2IP" placeholder readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :md="6" :lg="12">
                <el-form-item label="进入时间" prop="CONFER2INTIME">
                  <el-input v-model="detailForm.CONFER2INTIME" placeholder readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :md="6" :lg="12">
                <el-form-item label="离开时间" prop="CONFER2OUTTIME">
                  <el-input v-model="detailForm.CONFER2OUTTIME" placeholder readonly></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
          <el-card style="margin-top:10px">
            <h4>参会者3</h4>
            <div style="border-top: 1px solid #ebeef5;margin:15px 22px 12px;"></div>
            <el-row :gutter="10">
              <el-col :md="6" :lg="12">
                <el-form-item label="编号" prop="CONFER3">
                  <el-input v-model="detailForm.CONFER3" placeholder readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :md="6" :lg="12">
                <el-form-item label="姓名" prop="CONFER3NAME">
                  <el-input v-model="detailForm.CONFER3NAME" placeholder readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :md="6" :lg="12">
                <el-form-item label="状态" prop="CONFER3STATUS">
                  <el-select placeholder="请选择" v-model="detailForm.CONFER3STATUS" :disabled="true">
                    <el-option
                      v-for="item in [{value:'0',label:'未进入'},{value:'1',label:'进入'},{value:'2',label:'离开'}]"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="6" :lg="12">
                <el-form-item label="IP" prop="CONFER3IP">
                  <el-input v-model="detailForm.CONFER3IP" placeholder readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :md="6" :lg="12">
                <el-form-item label="进入时间" prop="CONFER3INTIME">
                  <el-input v-model="detailForm.CONFER3INTIME" placeholder readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :md="6" :lg="12">
                <el-form-item label="离开时间" prop="CONFER3OUTTIME">
                  <el-input v-model="detailForm.CONFER3OUTTIME" placeholder readonly></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
          <el-card style="margin-top:10px">
            <h4>其他信息</h4>
            <div style="border-top: 1px solid #ebeef5;margin:15px 22px 12px;"></div>
            <el-row :gutter="10">
              <el-col :md="6" :lg="12">
                <el-form-item label="音视频分离" prop="FLFLAG">
                  <el-select placeholder="请选择" v-model="detailForm.FLFLAG" :disabled="true">
                    <el-option
                      v-for="item in [{value:'0',label:'不分离'},{value:'1',label:'分离'}]"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="6" :lg="12">
                <el-form-item label="视频文件名" prop="VIDEOFILENAME">
                  <el-input v-model="detailForm.VIDEOFILENAME" placeholder readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :md="6" :lg="12">
                <el-form-item label="视频创建ID" prop="VIDEOUSERID">
                  <el-input v-model="detailForm.VIDEOUSERID" placeholder readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :md="6" :lg="12">
                <el-form-item label="处理代码" prop="DEALCODE">
                  <el-input v-model="detailForm.DEALCODE" placeholder readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :md="6" :lg="12">
                <el-form-item label="处理信息" prop="DEALMSG">
                  <el-input v-model="detailForm.DEALMSG" placeholder readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :md="6" :lg="12">
                <el-form-item label="最后活跃时间" prop="LASTACTIVETIME">
                  <el-input v-model="detailForm.LASTACTIVETIME" placeholder readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :md="6" :lg="12">
                <el-form-item label="会话类型" prop="CONFERTYPE">
                  <el-select placeholder="请选择" v-model="detailForm.CONFERTYPE" :disabled="true">
                    <el-option
                      v-for="item in [{value:'appchat',label:'文字'},{value:'video',label:'视频'}]"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="detailPopStatus=false">确定</el-button>
      </div>
    </el-dialog>
    <!-- 在线播放弹窗 -->
    <keep-alive>
      <el-dialog
        :visible.sync="playVideoStatus"
        :lock-scroll="false"
        :close-on-click-modal="false"
        @close="closeVideoWindow"
        width="1200px"
      >
        <el-card>
          <video controls autoplay id="playVideoWindow" ref="playVideoWindow">
            <source :src="videoUrl" type="video/mp4">
          </video>
        </el-card>
        <div slot="footer" class="dialog-footer">
          <el-button @click="playVideoStatus=false" size="mini">取消</el-button>
        </div>
      </el-dialog>
    </keep-alive>
  </div>
</template>
<script>
import getGlobalParams from "@/utils/getGlobalParams";
import request from "@/utils/requestTest";
import tableIns from "@/message/video-manage/meetingQuery";
import editIns from "@/message/video-manage/meetingControl";
export default {
  name: "mettingMsgQuery",
  data() {
    return {
      loading: false,
      tableData: [],
      currentPage: 1,
      tableTotal: 0,
      pageSize: getGlobalParams.get("PageSize"),
      selectList: [],
      videoUrl: "",
      detailPopStatus: false,
      playVideoStatus: false,
      queryForm: {
        MMID: "",
        CONFERID: "",
        STATUS: "",
        STARTDATE: "",
        ENDDATE: ""
      },
      detailForm: {
        CONFER1: "",
        CONFER1NAME: "",
        CONFER1STATUS: "",
        CONFER1IP: "",
        CONFER1INTIME: "",
        CONFER1OUTTIME: "",
        CONFER2: "",
        CONFER2NAME: "",
        CONFER2STATUS: "",
        CONFER2IP: "",
        CONFER2INTIME: "",
        CONFER2OUTTIME: "",
        CONFER3: "",
        CONFER3NAME: "",
        CONFER3STATUS: "",
        CONFER3IP: "",
        CONFER3INTIME: "",
        CONFER3OUTTIME: "",

        FLFLAG: "",
        VIDEOFILENAME: "",
        VIDEOUSERID: "",
        DEALCODE: "",
        DEALMSG: "",
        LASTACTIVETIME: "",
        CONFERTYPE: ""
      },
      mettingStatus: [
        { value: "", label: "" },
        { value: "0", label: "未开始" },
        { value: "1", label: "正常" },
        { value: "2", label: "结束" },
        { value: "3", label: "异常" }
      ]
    };
  },
  methods: {
    async queryModel() {
      //查询
      this.loading = true;
      let resBody = new tableIns();
      resBody.data.MMID = this.queryForm.MMID;
      resBody.data.CONFERID = this.queryForm.CONFERID;
      resBody.data.STATUS = this.queryForm.STATUS;
      resBody.data.STARTDATE = this.queryForm.STARTDATE;
      resBody.data.ENDDATE = this.queryForm.ENDDATE;
      resBody.data.currpage = this.currentPage + "";
      resBody.data.pagerownum = this.pageSize + "";
      let response = await request(resBody);
      this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        this.tableData = response.RSP_BODY.RspStruct;
        this.tableTotal =
          response.RSP_BODY.RecordNum ||
          response.QUERY_INFO_HEAD.QueryAllDataCount;
      } else if (response.SYS_HEAD.ReturnCode == "ARBFQ001") {
        this.tableData = [];
        this.tableTotal = 0;
      } else {
        this.$message({
          type: "error",
          message:
            "请求失败，错误码:" +
            response.SYS_HEAD.ReturnCode +
            "，错误信息：" +
            response.SYS_HEAD.ReturnMessage
        });
      }
    },
    clearForm(item) {
      //重置
      this.$refs["" + item].resetFields();
      console.log(this);
    },
    tableCheckBoxChange(val) {
      //选中列
      this.selectList = val;
    },
    closeMetting() {
      //是否终止
      this.$confirm(
        "此操作将关闭" + this.select[0].CONFERID + "会议,是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        this.queryCloseMetting();
      });
    },
    async queryCloseMetting() {
      //终止会议
      this.loading = true;
      let resBody = new editIns();
      resBody.data.WORKDATE = this.selectList[0].WORKDATE;
      resBody.data.CONFERID = this.selectList[0].CONFERID;
      let response = await request(resBody);
      this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        this.$message({
          type: "success",
          message: "终止会议成功"
        });
        this.queryModel();
      } else {
        this.$message({
          type: "error",
          message:
            "请求失败，错误码：" +
            response.SYS_HEAD.ReturnCode +
            ",错误信息：" +
            response.SYS_HEAD.ReturnMessage
        });
      }
    },
    dataFormatDate(row, column) {
      //转义
      return this.toolBox.timeFormat2Date(row[column.property]);
    },
    dataFormatTime(row, column) {
      //转义
      return this.toolBox.timeFormat2Time(row[column.property]);
    },
    meetingStatuFormat(row, column) {
      //转义
      var temp = this.toolBox.objArray2Hash(this.mettingStatus, "value");
      return temp[row[column.property]].label;
    },
    handleSizeChange(val) {
      debugger;
      this.pageSize = val;
      console.log(this);
      this.queryModel();
    },
    handleCurrentChange() {
      this.queryModel();
    },
    checkDetail(row) {
      //查看详情
      this.detailForm = row;
      this.detailPopStatus = true;
    },
    playOnline(row) {
      //在线播放
      this.videoUrl =
        "http://192.168.31.254:8095/" +
        this.toolBox.timeFormat2Date(row.WORKDATE) +
        "/" +
        row.VIDEOFILENAME +
        ".mp4";
      this.$nextTick(() => {
        this.$refs["playVideoWindow"].load();
        this.$refs["playVideoWindow"].play();
      });
      this.playVideoStatus = true;
    },
    closeVideoWindow() {
      //关闭页面
      this.$refs["playVideoWindow"].pause();
    },
    dowloadVideo(row) {
      //下载视频
      var temp =
        "http://192.168.31.254:8095/" +
        this.toolBox.timeFormat2Date(row.WORKDATE) +
        "/" +
        row.VIDEOFILENAME +
        ".mp4";
      this.downloadFile(temp);

      console.log(this.downloadFile);
    }
  },

  mounted() {
    this.queryModel();
  }
};
</script>
<style lang="scss">
.box {
  margin-top: 20px;
  text-align: right;
}
.el-card {
  overflow: inherit;
}
.el-date-editor.el-input {
  width: 100%;
}
#playVideoWindow {
  width: 100%;
}
</style>
