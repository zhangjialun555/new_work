<template>
  <div v-loading="loading"
        element-loading-text="拼命加载中">
    <el-card style="margin-bottom:10px;overflow:visible">
      <el-form :model="formInline" ref="formInline" label-position="top" size="mini">
        <el-row :gutter="10">
          <el-col :md="6" :lg="4">
            <el-form-item label="机构" prop="branchNo">
               <select-tree :tree-data="brnoList"
               :single-check="true" 
                v-model="formInline.selBrno" :node-key="'branchId'" 
                :props="{id:'branchId',label:'branchName',children:'childBranch'}"
              ></select-tree>
            </el-form-item>        
          </el-col>
          <el-col :md="6" :lg="4">
            <el-form-item label="开始日期" prop="startdate">
              <el-date-picker
                v-model="formInline.startdate"
                :editable=false
                :picker-options="pickerOptionsStart"
                value-format="yyyyMMdd"
                type="date"
                placeholder="选择日期" >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :md="6" :lg="4">
            <el-form-item label="结束日期" prop="enddate">
              <el-date-picker
                v-model="formInline.enddate"
                :editable=false
                :picker-options="pickerOptionsStart"
                value-format="yyyyMMdd"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :md="6" :lg="4">
            <el-form-item label="坐席工号" prop="assistno">
              <el-input v-model="formInline.assistno" placeholder="请输入坐席工号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="6" :lg="4">
            <el-form-item label="多媒体连接号" prop="multimediano">
              <el-input v-model="formInline.multimediano" placeholder="请输入多媒体连接号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :md="6" :lg="4">
            <el-form-item label="客户评价" prop="customerevaluate">
              <el-select v-model="formInline.customerevaluate" placeholder="请选择客户评价">
                <el-option
                  v-for="item in customSpinner"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>            
          </el-col>
          <el-col :md="3" :lg="2" class="searchBtnMarginTop">
            <el-form-item>
              <el-button type="primary" @click="queryExactlyInfoList"
              icon="el-icon-search">查询</el-button>
            </el-form-item>
          </el-col>
          <el-col  :md="3" :lg="2" class="searchBtnMarginTop">
            <el-form-item>
              <el-button type='warning' icon='el-icon-refresh' 
              @click="resetForm('formInline')">重置</el-button>
            </el-form-item>
          </el-col>
          <el-col :md="3" :lg="2"  class="searchBtnMarginTop">
            <el-form-item>
              <el-button type="primary" icon="el-icon-download" 
              @click="export_VideoFlow" v-if="btnPermission('Button_VideoQue_Export')">导出</el-button>
            </el-form-item>
          </el-col>      
        </el-row>

      </el-form>
    </el-card>
    
    <el-card>
        <el-table :data="tableDataVideo"
        header-row-class-name="tableHeaderClass"
        border style="min-height=390px">
            <el-table-column
              fixed prop="channelserno" label="渠道流水号" width="200">
            </el-table-column>
            <el-table-column
              prop="workdate" :formatter="dFormat" label="连接日期" width="120">
            </el-table-column>
            <el-table-column
              prop="multimediano" label="多媒体连接号" width="200">
            </el-table-column>
            <el-table-column
              prop="meetingname" label="会议名称" width="200">
            </el-table-column>
            <el-table-column
              prop="devNum" label="视频发起端设备号" width="140">
            </el-table-column>
            <el-table-column
              prop="multimediabegintime" :formatter="tFormat" label="多媒体申请时间" width="120">
            </el-table-column>
            <el-table-column
              prop="multimediaendtime" :formatter="tFormat" label="多媒体退出时间" width="120">
            </el-table-column>
            <el-table-column
              prop="assistno" label="坐席工号" width="100">
            </el-table-column>
            <el-table-column
              prop="multimediastatus" :formatter="vdataFormat" label="多媒体状态" width="100">
            </el-table-column>
            <el-table-column
              prop="customerevaluate" :formatter="cdataFormat" label="客户评价" width="180">
            </el-table-column>
            <el-table-column
              prop="branchNo" label="视频机构" width="120">
            </el-table-column>
            <el-table-column 
              prop="tellerNo" label="视频柜员" width="120">
            </el-table-column>
            <el-table-column 
            align="center"
              width="100" label="视频" fixed="right">
                <template slot-scope="scope">
                  <el-button type="text" size="mini"
                  @click="export_Video(scope.$index, scope.row)">查看</el-button>
                </template>
              </el-table-column>
        </el-table>

      <el-pagination
        style="text-align: right; margin-top:20px;"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        background
        layout="sizes, total, prev, pager, next, jumper"
        :total="tolNum">
      </el-pagination>

    </el-card>
  <!-- 视频播放弹窗 -->
  <!-- <el-dialog title="" @open="OpenVideoDialog"  @close="closeVideoDialog"
    :lock-scroll=false
    :visible.sync="isShowVideo" width="900px">
      <el-card >
        <div>
          <video controls autoplay  id="media">
            <source :src="VedioUrl" type="video/mp4">
          </video>
        </div>
      </el-card>
    </el-dialog> -->
  <!-- 弹窗 -->
  <component :is='dialogList.videoDialog' :paramObj="rowObj" :option='dialogVedioParameter'></component>
  </div>
</template>

<script>
import selectTree from "@/components/selectTree2/";
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
import toolBox from "@/utils/toolBox";
import devRunList from "@/message/spinnerDataQuery/spinner-data-query";
import queryVideoFlow from "@/message/businessQuery/videoFlow/queryVideoFlow";
import exportVideoFlow from "@/message/businessQuery/videoFlow/exportVideoFlow";
import videoDialog from "./dialog/videoDialog";
export default {
  components: { selectTree },
  data() {
    return {
      pickerOptionsStart: {
        disabledDate(time) {
          let curDate = new Date().getTime();
          let one = 90 * 24 * 3600 * 1000; //一个月
          let oneMonths = curDate - one;
          return time.getTime() > Date.now() || time.getTime() < oneMonths;
        }
      },
      VedioUrl:'',
      brnoList: [], // 机构下拉框数据
      pageSize: undefined,
      tolNum:0,
      urlValue:{
        url:'',
      },
      url:'',
      rowObj:null,
      formInline: {
        selBrno: [],
        startdate: undefined,
        enddate: undefined,
        branchNo: undefined,
        multimediano: undefined,
        customerevaluate: undefined,
        assistno:undefined,
      },
      dialogList:{
        videoDialog
      },
      dialogVedioParameter:{
        isShow:false
      },
      isShowVideo:false,
      currentPage:1,
      loading: false,
      tableDataVideo: [
      ],
      customSpinner: [
        { label: "不满意", value: "0" },
        { label: "一般", value: "1" },
        { label: "满意", value: "2" }
      ],
      videoStatus : getGlobalParams.get("videoStatus"),
      customReviews : getGlobalParams.get("customReviews")
    };
  },
  created() {
    // 初始化日期
    this.formInline.startdate = toolBox.getNowDate(90);
    this.formInline.enddate = toolBox.getNowDate(0);
    this.pageSize = getGlobalParams.get("PageSize");
    this.initBrno()
    this.queryInfoList()
  },
  methods: {
    dFormat(row, column){
      return toolBox.timeFormat2Date(row[column.property])
    },
    tFormat(row, column){
      return toolBox.timeFormat2Time(row[column.property])
    },
    // 初始化机构下拉框
    initBrno() {
      let resBody = new devRunList();
      resBody.data.spinnerList = [{ spinnerName: "branch" }];
      request(resBody)
        .then(response => {
          this.brnoList = response.RSP_BODY.branchSpinner;
        })
        .catch(error => {
          console.error("查询错误", error);
        });
    },

    handleSizeChange(val) { this.pageSize=val;
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.queryInfoList();
    },
    resetForm(formName) {
      this.formInline.selBrno=[];
      this.$refs[formName].resetFields();
    },
    vdataFormat(row, column) {
      return this.videoStatus[row[column.property]];
    },
    cdataFormat(row, column) {
      return this.customReviews[row[column.property]];
    },
    queryInfoList() {
      this.loading = true;
      let resBody = new queryVideoFlow();
      resBody.data.branchNo = this.formInline.selBrno[0],
      resBody.data.startdate = this.formInline.startdate,
      resBody.data.assistno = this.formInline.assistno,
      resBody.data.enddate = this.formInline.enddate,
      resBody.data.multimediano = this.formInline.multimediano,
      resBody.data.customerevaluate = this.formInline.customerevaluate,
      resBody.QueryPageNo = this.currentPage;
      resBody.QueryRowNum = this.pageSize;
      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.loading = false;
            this.tableDataVideo=response.RSP_BODY.videoinfoList||[];
            this.tolNum =response.RSP_BODY.QueryAllDataCount;
          }else{
            this.tableDataVideo=[];
            this.loading = false;
            console.log(response);
          }
        })
        .catch(error => {
          this.loading = false;
          console.log(error);
        });
    },
    //条件查询：
    queryExactlyInfoList() {
      this.currentPage = 1;
      this.loading = true;
      let resBody = new queryVideoFlow();
      resBody.data.branchNo = this.formInline.selBrno[0],
      resBody.data.startdate = this.formInline.startdate,
      resBody.data.assistno = this.formInline.assistno,
      resBody.data.enddate = this.formInline.enddate,
      resBody.data.multimediano = this.formInline.multimediano,
      resBody.data.customerevaluate = this.formInline.customerevaluate,
      resBody.QueryPageNo = this.currentPage;
      resBody.QueryRowNum = this.pageSize;
      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.loading = false;
            this.tableDataVideo=response.RSP_BODY.videoinfoList||[];
            this.tolNum =response.RSP_BODY.QueryAllDataCount;
          }else{
            this.tableDataVideo=[];
            this.loading = false;
            console.log(response);
          }
        })
        .catch(error => {
          this.loading = false;
          console.log(error);
        });
    },
    export_VideoFlow() {
      let resBody = new exportVideoFlow();
      resBody.data.branchNo = this.formInline.selBrno[0],
      resBody.data.startdate = this.formInline.startdate,
      resBody.data.assistno = this.formInline.assistno,
      resBody.data.enddate = this.formInline.enddate,
      resBody.data.multimediano = this.formInline.multimediano,
      resBody.data.customerevaluate = this.formInline.customerevaluate,
      resBody.QueryPageNo = this.currentPage;
      resBody.QueryRowNum = this.pageSize;
      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.downloadFile(response.RSP_BODY.fileName);
          }else{
            console.log(response);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //日期格式化：
    formatDate(val){
      return toolBox.timeFormat2Date(val);
    },
    //点击打开视频
    export_Video(index,row){
      console.log("index",index);
      console.log("row",row);
      //首先对日期进行格式化：
      let date = this.formatDate(row.workdate)
      this.splitUrl(date,row.meetingname);
      this.rowObj = this.urlValue;
      this.dialogVedioParameter.isShow = true;
    },
    //URL拼接；
    splitUrl(val1,val2){
      this.urlValue.url = "http://192.168.31.31:8095/"+val1+"/"+val2;
    },
  }
};
</script>

<style scope>
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}
</style>