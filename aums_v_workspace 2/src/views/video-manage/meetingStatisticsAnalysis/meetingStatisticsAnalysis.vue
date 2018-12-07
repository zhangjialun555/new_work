<template>
  <div class="meetingStatisticsAnalysis" v-loading="loading" element-loading-text="加载中。。。">
    <!-- 主页面 -->
    <div>
       <el-card>
         <el-form ref='queryForm' :model='queryForm' size='mini' label-position='top' :rules="rules">
              <el-row  :gutter="10">
                <!-- 这里两个条件必输 -->
                  <el-col :md="6" :lg="4">
                      <el-form-item label='开始日期' prop='STARTDATE'>
                        <el-date-picker
                          v-model="queryForm.STARTDATE"
                          value-format="yyyyMMdd" 
                          type="date"
                          placeholder="选择日期">
                        </el-date-picker>
                      </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="4">
                      <el-form-item label='结束日期' prop='ENDDATE'>
                        <el-date-picker
                          v-model="queryForm.ENDDATE"
                          value-format="yyyyMMdd" 
                          type="date"
                          placeholder="选择日期">
                        </el-date-picker>
                      </el-form-item>
                  </el-col>
                  <el-col :md="3" :lg="2" class="searchBtnMarginTop">
                        <el-button type='primary' size='mini' icon='el-icon-search' @click="queryModel">查询</el-button>
                  </el-col>
                  <el-col  :md="3" :lg="2" class="searchBtnMarginTop">
                        <el-button type='warning' size='mini' icon='el-icon-refresh' @click="clearForm('queryForm')">重置</el-button>
                  </el-col>
              </el-row>
         </el-form>
      </el-card>
       <el-card style="margin:10px 0 0 0">
         <el-row style="text-align:center;">
           <el-col :lg="6" :sm="12">
            <h3>会议总数</h3>
            <p>{{tableData.CONFNUM}}</p>
           </el-col>
           <el-col :lg="6" :sm="12">
            <h3>平均时长</h3>
            <p>{{tableData.AVGTIME}}</p>
           </el-col>
           <el-col :lg="6" :sm="12">
            <h3>会议成功数</h3>
            <p>{{tableData.SUCNUM}}</p>
           </el-col>
           <el-col :lg="6" :sm="12">
            <h3>平均成功率</h3>
            <p>{{tableData.SUCRATE+"%"}}</p>
           </el-col>
         </el-row>
         <el-row style="text-align:center;">
           <el-col :lg="24" :sm="24">
            <ve-histogram :data="chartData" :settings="chartSettings" :extend="chartExtend"></ve-histogram>
           </el-col>
         </el-row>
         
         
         
         
          <!-- <el-table 
          ref="tableData" 
          :data='tableData'
          header-row-class-name="tableHeaderClass"
          @selection-change="tableCheckBoxChange"
          border
          style="margin:10px 0 0 0"
          >
            <el-table-column fixed prop='MMID' label='多媒体连接号' ></el-table-column>
            <el-table-column prop='WORKDATE' label='日期'></el-table-column>
            <el-table-column prop='CONFERID' label='会议号'></el-table-column>
            <el-table-column prop='CONFERNAME' label='会议名称'></el-table-column>
            <el-table-column prop='APPLYTIME' label='申请时间'></el-table-column>
            <el-table-column prop='STARTTIME' label='开始时间'></el-table-column>
            <el-table-column prop='ENDTIME' label='结束时间'></el-table-column>
            <el-table-column prop='STATUS' label='会议状态'></el-table-column>
            <el-table-column prop='CONFEPASSWORD' label='会议密码'></el-table-column>
            <el-table-column prop='CONFENUMBER' label='会议人数'></el-table-column>

            <el-table-column label='操作' align="center" fixed="right" width="80">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="checkDetail(scope.row,tableData)">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table> -->
           <!-- <div class="box">
              <el-pagination background
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page.sync="currentPage"
                  :page-sizes="[10, 20, 50,100]"
                  :page-size="pageSize"
                  layout="sizes, total, prev, pager, next, jumper"
                  :total="tableTotal"> 
              </el-pagination>
         </div> -->
      </el-card>
    </div>

  </div>
</template>

<script>
import getGlobalParams from "@/utils/getGlobalParams";
// import selectTree from "@/components/selectTree2/";
//通讯相关
import request from "@/utils/requestTest";
import tableIns from "@/message/video-manage/meetingSum";
import chartIns from "@/message/video-manage/meetingSumInterval";
import editIns from "@/message/video-manage/vedioParameterEdit";
// import spinnerList from "@/message/spinnerDataQuery/spinner-data-query";

export default {
  name: "meetingStatisticsAnalysis",
  // components: { selectTree },
  data() {
    return {
      //图表
      pollingPause:false,//暂停标记
      queryTimeSpace:20000,//轮询时间间隔
      queryTimeout:{},
      chartForm:{
        WORKDATE:this.toolBox.getNowDate(0),
        STARTTIME:"000000",
        ENDTIME:"235959",
      },
      chartSettings: {
        showLine: ['成功率'],
        axisSite: { right: ['成功率'] },
        yAxisType: ['normal', 'percent'],
        yAxisName: ['数值', '比率']
      },
      chartData: {
        columns: ['日期', '会议总数', '会议成功数', '成功率'],
        rows: [
          { '日期': '1/1', '会议总数': 1393, '会议成功数': 445, '成功率': 0.32 },
          { '日期': '1/2', '会议总数': 3530, '会议成功数': 917, '成功率': 0.26 },
          { '日期': '1/3', '会议总数': 2923, '会议成功数': 2221, '成功率': 0.76 },
          { '日期': '1/4', '会议总数': 1723, '会议成功数': 848, '成功率': 0.49 },
          { '日期': '1/5', '会议总数': 3792, '会议成功数': 1213, '成功率': 0.323 },
          { '日期': '1/6', '会议总数': 4593, '会议成功数': 3582, '成功率': 0.78 }
        ]
      },
      chartExtend:{
        series: {
          // barWidth: 10 ,
          barGap: "-100%"
        },
      },
      loading: false,
      selectList: [],
      // brno: [],
      tableData: {
        CONFNUM:"",
        AVGTIME:"",
        SUCNUM:"",
        SUCRATE:""
      },
      currentPage: 1,
      pageSize: getGlobalParams.get("PageSize"),
      tableTotal: 0,
      queryForm: {
        STARTDATE:this.toolBox.getNowDate(30),
        ENDDATE:this.toolBox.getNowDate(0),
      },
      rules: {//校验对象
      STARTDATE:[
        { required: true, message: "请输入日期", trigger: "blur" },
      ],
      ENDDATE:[
        { required: true, message: "请输入日期", trigger: "blur" },
      ],
        // // userID: [
        // //   { required: true, message: "请输入用户编号", trigger: "blur" }
        // // ],
        // branchId: [
        //   { required: true, message: "请选择机构号", trigger: "change" }
        // ],
        // userName: [
        //   { required: true, message: "请输入用户名称", trigger: "blur" },
        //   { max: 200, message: "用户名称长度少于200个字符", trigger: "blur" }
        // ],
        // // remark: [{ max:10, message: "请输入少于120位字符", trigger: "blur" }],
        // telephone: [
        //   { message: "手机号长度少于20个字符", max: 20, trigger: "blur" },
        //   { require: false, validator: validatorPhone, trigger: "blur" }
        // ],
        // emailAddress: [
        //   { max: 20, message: "邮箱长度少于20个字符", trigger: "blur" },
        //   { require: false, validator: validatorEmail, trigger: "blur" }
        // ],
        // jobNumber: [
        //   { required: true, message: "请输入工号", trigger: "blur" },
        //   {
        //     max: 20,
        //     message: "请输入正确工号，长度少于20个字符",
        //     trigger: "blur"
        //   }
        // ],
        // tellerNo: [
        //   { required: true, message: "请输入柜员号", trigger: "blur" },
        //   {
        //     max: 20,
        //     message: "请输入正确柜员号，长度少于20个字符",
        //     trigger: "blur"
        //   }
        // ]
      },
      //弹窗配置
      currOperation:1,//当前操作
      popTitle:"新增音视频配置模板",
      addForm:{
        showSelfVideoFlag:"",
        cameraWidth:"",
        cameraHeight:"",
        cameraMalv:"",
        cameraZhenlv:"",
        saveDeskFlag:"",
        saveDeskArea:"",//这是个json
        saveDeskMalv:"",
        saveDeskZhenlv:""
      },
      detailForm:{
        CONFER1:"",
        CONFER1NAME:"",
        CONFER1STATUS:"",
        CONFER1IP:"",
        CONFER1INTIME:"",
        CONFER1OUTTIME:"",
        CONFER2:"",
        CONFER2NAME:"",
        CONFER2STATUS:"",
        CONFER2IP:"",
        CONFER2INTIME:"",
        CONFER2OUTTIME:"",
        CONFER3:"",
        CONFER3NAME:"",
        CONFER3STATUS:"",
        CONFER3IP:"",
        CONFER3INTIME:"",
        CONFER3OUTTIME:"",

        FLFLAG:"",
        VIDEOFILENAME:"",
        VIDEOUSERID:"",
        DEALCODE:"",
        DEALMSG:"",
        LASTACTIVETIME:"",
        CONFERTYPE:"",
      },
      addPopStatu:false,
      detailPopStatu:false
    }
  },
  methods: {
    clearForm(item) {
      this.$refs["" + item].resetFields();
    },
    tableCheckBoxChange(val) {
      this.selectList = val;
    },
    async checkDetail(row) {
      this.detailForm=row;
      this.detailPopStatu=true;
    },
    async queryModel() {
      this.$refs["queryForm"].validate(async (valid) => {
        if(valid){
          this.loading = true;
          let resBody = new tableIns();
          resBody.data.STARTDATE = this.queryForm.STARTDATE;
          resBody.data.ENDDATE = this.queryForm.ENDDATE;

          // resBody.data.currpage = this.currentPage;
          // resBody.data.pagerownum = this.pageSize;
          let response = await request(resBody);
          this.loading = false;
          if (response.SYS_HEAD.ReturnCode == "000000") {
            this.tableData = response.RSP_BODY?response.RSP_BODY:[];
          } else {
            this.$message({
                type: "error",
                message: "请求失败，错误码:" + response.SYS_HEAD.ReturnCode + "，错误信息：" + response.SYS_HEAD.ReturnMessage
              });
          }
        }
        else {
          this.$message({
            type: "warning",
            message: "请输入起止日期"
          });
          return false;
        }
      })
    },
    polling(ifQuery, ifLoop) {
      var vueIns = this;
      if (ifLoop) {
        this.queryTimeout = setTimeout(function() {
          var tagsArr = vueIns.$store.state.tagsView.cachedViews;
          var currentPageName = vueIns.$router.currentRoute.name;
          var thisPageName = vueIns.$options.name;
          if (tagsArr.indexOf(thisPageName) + 1) {
            //先判断标记
            if (vueIns.pollingPause) {
              vueIns.polling(false, true);
            } else if (currentPageName == thisPageName) {
              //在页签中且是当前页时发送
              ifQuery && vueIns.queryModelChart();
              vueIns.polling(true, true);
            } else if (currentPageName != thisPageName) {
              //在页签中有但不是当前页时 或暂停字段为true时 暂停发送请求
              ifQuery && vueIns.queryModelChart();
              vueIns.polling(false, true);
            } else {
              //未知情况下停止
              clearTimeout(vueIns.queryTimeout);
              vueIns.polling(false, false);
            }
          } else {
            //不在页签中时直接关闭
            clearTimeout(vueIns.queryTimeout); //其实不用这步
            vueIns.polling(false, false);
          }
        }, vueIns.queryTimeSpace);
      }
    },
    async queryModelChart() {
      // this.$refs["chartForm"].validate(async (valid) => {
        // if(valid){
          // this.loading = true;
          let resBody = new chartIns();
          resBody.data.WORKDATE = this.chartForm.WORKDATE;
          resBody.data.STARTTIME = this.chartForm.STARTTIME;
          resBody.data.ENDTIME = this.chartForm.ENDTIME;

          let response = await request(resBody);
          // this.loading = false;
          if (response.SYS_HEAD.ReturnCode == "000000") {
            if(response.RSP_BODY){
              var temp=response.RSP_BODY.RspStruct;
              var outputArr=temp.map(function(item){
                return{
                  '日期':item.MTDATE,
                  '时间':item.MTTIME,
                  '会议总数':item.SUCNUM,
                  '时长':item.AVGTIME,
                  '会议成功数':item.CONFNUM,
                  '成功率':item.SUCRATE
                }
              })
              this.chartData.rows=outputArr;
            }
            else{
              this.chartData=[];
            }
          } else {
            this.$message({
                type: "error",
                message: "请求失败，错误码:" + response.SYS_HEAD.ReturnCode + "，错误信息：" + response.SYS_HEAD.ReturnMessage
              });
          }
        // }
        // else {
        //   this.$message({
        //     type: "warning",
        //     message: "请输入起止日期"
        //   });
        //   return false;
        // }
      // })
    },
    async EditModel() {
      this.loading = true;
      let resBody = new editIns();
      resBody.data.OPERATION = this.currOperation+'';
      resBody.data.layoutid = this.queryForm.configId;
      resBody.data.layouname = this.queryForm.styleName;

      resBody.data.selfVideoStyle = this.addForm;
      resBody.data.remoteVideoStyle = this.addForm;
      resBody.data.remoteDeskStyle = this.addForm;
      resBody.data.remoteHelpStyle = this.addForm;
      
      let response = await request(resBody);
      this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        if(this.currOperation==1){
            this.$message({
            type: "success",
            message: "新增成功"
          });
        }
        else if(this.currOperation==2){
          this.$message({
            type: "success",
            message: "修改成功"
          });
        }
        else if(this.currOperation==3){
          this.$message({
            type: "success",
            message: "删除成功"
          });
        }
        else{}
      } 
      else if (response.SYS_HEAD.ReturnCode =="ARBFQ001") {
        this.tableData=[];
        this.tableTotal = 0;
      }
      else {
        this.$message({
          type: "error",
          message: "请求失败，错误码:" + response.SYS_HEAD.ReturnCode + "，错误信息：" + response.SYS_HEAD.ReturnMessage
        });
      }
    },
    delConfirm(){
      this.$confirm('此操作将删除xxx, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.EditModel();
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // });          
      });
    },
    handleSizeChange(val) { this.pageSize=val;
      this.queryModel();
    },
    handleCurrentChange() {
      this.queryModel();
    },
    //弹窗部分的方法
    validatorPhone(rule, value, callback){
      if (value != "") {
        let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的手机号"));
        }
      } else {
        callback();
      }
    }
  },
  // async created() {
  //   let resBody = new spinnerList();
  //   resBody.data.spinnerList = [{ spinnerName: "branch" }];
  //   let response = await request(resBody);

  //   if (response.SYS_HEAD.ReturnCode == "000000") {
  //     //在之后要塞入空选项
  //     this.brno = response.RSP_BODY.branchSpinner;
  //   } else {
  //     this.$message({
  //           type: "error",
  //           message: "请求失败，错误码:" + response.SYS_HEAD.ReturnCode + "，错误信息：" + response.SYS_HEAD.ReturnMessage
  //         });
  //   }
  // },
  mounted() {
    this.queryModel();
    this.queryModelChart();
    this.polling(true,true);
  },
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
</style>
