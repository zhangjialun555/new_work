<template>
  <div class="meetingStatisticsAnalysis" v-loading="loading" element-loading-text="加载中。。。">
    <el-card>
      <keep-alive>
        <el-tabs type="border-card" style="min-height:564px">
          <el-tab-pane label="今日统计" :lazy="true">
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
                <p>{{tableData.SUNNUM}}</p>
              </el-col>
              <el-col :lg="6" :sm="12">
                <h3>平均成功率</h3>
                <p>{{tableData.SUCRATE+"%"}}</p>
              </el-col>
            </el-row>
            <el-row style="text-align:center">
              <el-col :lg="24" :sm="24">
                <ve-histogram :data="chartData" :settings="chartSettings" :extend="chartExtend">
                      <div class="data-empty">😂😂😂😂😂😂😂😂😂😂😂</div>
                </ve-histogram>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="历史查询" :lazy="true">
            <el-form ref="queryForm" :model="queryForm" size="mini" label-position="top" :rules="rules">
              <el-row  :gutter="10">
                    <!-- 这里两个条件必输 -->
                      <el-col :md="6" :lg="4">
                          <el-form-item label='选择日期' size="mini" prop='WORKDATE'>
                            <el-date-picker
                              v-model="queryForm.STARTDATE"
                              value-format="yyyyMMdd" 
                              type="date"
                              placeholder="选择日期">
                            </el-date-picker>
                          </el-form-item>
                      </el-col>
                      <el-col :md="6" :lg="4">
                          <el-form-item label='开始时间' size="mini" prop='STARTTIME'>
                            <el-date-picker
                              v-model="queryForm.STARTTIME"
                              value-format="hhmmss" 
                              type="time"
                              placeholder="选择时间">
                            </el-date-picker>
                          </el-form-item>
                      </el-col>
                      <el-col :md="6" :lg="4">
                          <el-form-item label='结束时间' size="mini" prop='ENDTIME'>
                            <el-date-picker
                              v-model="queryForm.ENDTIME"
                              value-format="hhmmss" 
                              type="time"
                              placeholder="选择时间">
                            </el-date-picker>
                          </el-form-item>
                      </el-col>
                      <el-col :md="3" :lg="2" class="searchBtnMarginTop">
                            <el-button type='primary' size='mini' icon='el-icon-search' @click="queryModelChart2">查询</el-button>
                      </el-col>
                      <el-col  :md="3" :lg="2" class="searchBtnMarginTop">
                            <el-button type='warning' size='mini' icon='el-icon-refresh' @click="clearForm('queryForm')">重置</el-button>
                      </el-col>
                  </el-row>
            </el-form>
            <el-row style="text-align:center">
              <el-col :lg="24" :sm="24">
                <ve-histogram :data="chartData2" :settings="chartSettings" :extend="chartExtend"></ve-histogram>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </keep-alive>
    </el-card>
  </div>
</template>
<script>
import getGlobalParams from "@/utils/getGlobalParams";
import request from "@/utils/requestTest";
import tableIns from "@/message/video-manage/meetingSum";
import chartIns from "@/message/video-manage/meetingSumInterval";
import editIns from "@/message/video-manage/vedioParameterEdit";
  export default {
    name:"meetingStatisticsAnalysis",
    data () {
      return {
        loading:false,
        pollingPause:false,
        queryTimeout:{},
        queryTimeSpace:200000,
        tableData:{
          CONFNUM:"",
          AVGTIME:"",
          SUNNUM:"",
          SUCRATE:""
        },
        chartData: {
          columns: ['时间', '会议总数', '会议成功数', '成功率'],
          rows: [
            { '时间': '08：00', '会议总数': 1393, '会议成功数': 445, '成功率': 0.32 },
            { '时间': '09：00', '会议总数': 3530, '会议成功数': 917, '成功率': 0.26 },
            { '时间': '10：00', '会议总数': 2923, '会议成功数': 2221, '成功率': 0.76 },
            { '时间': '11：00', '会议总数': 1723, '会议成功数': 848, '成功率': 0.49 },
            { '时间': '12：00', '会议总数': 3792, '会议成功数': 1213, '成功率': 0.323 },
            { '时间': '13：00', '会议总数': 4593, '会议成功数': 3582, '成功率': 0.78 }
          ]
        },
        chartData2: {
          columns: ['时间', '会议总数', '会议成功数', '成功率'],
          rows: [
            { '时间': '1/1', '会议总数': 1393, '会议成功数': 445, '成功率': 0.32 },
            { '时间': '1/2', '会议总数': 3530, '会议成功数': 917, '成功率': 0.26 },
            { '时间': '1/3', '会议总数': 2923, '会议成功数': 2221, '成功率': 0.76 },
            { '时间': '1/4', '会议总数': 1723, '会议成功数': 848, '成功率': 0.49 },
            { '时间': '1/5', '会议总数': 3792, '会议成功数': 1213, '成功率': 0.323 },
            { '时间': '1/6', '会议总数': 4593, '会议成功数': 3582, '成功率': 0.78 }
          ]
        },
        chartSettings:{
          showLine:['成功率'],
          axisSite:{right:['成功率']},
          yAxisType:['normal','percent'],
          yAxisName:['数值','比率']
        },
        chartExtend:{
          series:{
            barGap:"-100%"
          }
        },
        //历史查询相关
        queryForm:{
          STARTDATE:this.toolBox.getNowDate(0),
          ENDDATE:this.toolBox.getNowDate(0),
          STARTTIME:"000000",
          ENDTIME:"235959",
        },
        rules: {//校验对象
          STARTDATE:[
            { required: true, message: "请输入日期", trigger: "blur" },
          ],
          ENDDATE:[
            { required: true, message: "请输入日期", trigger: "blur" },
          ]
        },
      }
    },
    methods:{
      clearForm(item) {
        this.$refs["" + item].resetFields();
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
              ifQuery && vueIns.queryModelChart() && vueIns.queryModelNow();
              vueIns.polling(true, true);
            } else if (currentPageName != thisPageName) {
              //在页签中有但不是当前页时 或暂停字段为true时 暂停发送请求
              ifQuery && vueIns.queryModelChart() && vueIns.queryModelNow();
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
      // polling(ifQuery,ifLoop){
      //   var vueIns = this;
      //   if(ifLoop){
      //     this.queryTimeout = setTimeout(function(){
      //       var tagsArr = vueIns.$store.state.tagsView.cachedViews;
      //       var currentPageName = vueIns.$router.currentRoute.name;
      //       var thisPageName = vueIns.$options.name;
      //       if (tagsArr.indexOf(thisPageName)+1) {
      //         if (vueIns.pollingPause) {
      //           vueIns.polling(false,true);
      //         }else if (currentPageName == thisPageName){
      //           ifQuery && vueIns.querymModelChart() && vueIns.queryModelNow();
      //           vueIns.polling(true,true);
      //         } else if (currentPageName != thisPageName) {
      //           ifQuery && vueIns.querymModelChart() && vueIns.queryModelNow();
      //           vueIns.polling(false,true);
      //         }else {
      //           clearTimeout(vueIns.queryTimeout);
      //           vueIns.polling(false,false);
      //         }
      //       }else {
      //           clearTimeout(vueIns.queryTimeout);
      //           vueIns.polling(false,false);
      //       }
      //     },vueIns.queryTimeSpace());
      //   }
      // },
      async queryModelNow () {
        this.loading =true;
        let resBody = new tableIns;
        resBody.data.STARTDATE=this.toolBox.getNowDate(0);
        resBody.data.ENDDATE=this.toolBox.getNowDate(0);
        let response =await request(resBody);
        this.loading=false;
        if (response.SYS_HEAD.ReturnCode == "000000") {
          this.tableData=response.RSY_BODY?response.RSY_BODY:[];
        }else{
          this.$message({
            type:'error',
            message: "请求失败，错误码:" + response.SYS_HEAD.ReturnCode + "，错误信息：" + response.SYS_HEAD.ReturnMessage
          })
        }
      },
      async querymModelChart () {
        this.loading = true;
        let resBody = new chartIns;
        resBody.data.WORKDATE = this.toolBox.getNowDate(0);
        resBody.data.STARTDATE = "000000";
        resBody.data.ENDDATE = "235959";
        let response = await request(resBody);
        this.loading = true;
        if (response.SYS_HEAD.ReturnCode == "000000") {
          if (response.RSP_BODY) {
            var temp = response.RSP_BODY.RspStruct;
            var outputArr = temp.map(function(item){
              return {
                '日期':item.MTDATE,
                '时间':item.MTTIME,
                '会议总数':item.SUCNUM,
                '时长':item.AVGTIME,
                '会议成功率':item.CONFNUM,
                '成功率':item.SUCRATE,
              }
            })
            this.chartData.rows = outputArr;
          } else {
            this.chartData=[];
          }
        }else {
          this.$message ({
            type:'error',
            message: "请求失败，错误码:" + response.SYS_HEAD.ReturnCode + "，错误信息：" + response.SYS_HEAD.ReturnMessage
          })
        }
      },
      async queryModelChart2(){
        let resBody = new chartIns();
            resBody.data.WORKDATE = this.queryForm.STARTDATE;
            resBody.data.STARTTIME = this.queryForm.STARTTIME;
            resBody.data.ENDTIME = this.queryForm.ENDTIME;

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
            this.chartData2.rows=outputArr;
          }
          else{
            this.chartData2=[];
          }
        } else {
          this.$message({
              type: "error",
              message: "请求失败，错误码:" + response.SYS_HEAD.ReturnCode + "，错误信息：" + response.SYS_HEAD.ReturnMessage
            });
        }
      },
    },
    mounted(){
      this.queryModelNow ();
      this.querymModelChart ();
      this.polling ();
    }
  }
</script>
<style>
.el-card {
  overflow: inherit;
}
</style>


