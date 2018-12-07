<template>
<div class="div" v-loading="loading" >
  <div class="head_blank" ></div>
    <el-carousel :interval="4000" indicator-position="outside" :height="carouselHeight" >
    <!-- 第一页 -->
    <el-carousel-item class="card">
      <div>
        <!-- <el-card shadow="always"  class="card" ref="card" id="card"> -->
        <div  class="tittle">
          <span>用户/设备状态</span><br><br>
        </div>
        <!-- 设备状态 -->
        <div  >
          <span>设备状态</span><br><br>
        </div>
        <el-table 
        :data="DeviceList"
        border>
        <el-table-column align="center"
            prop="deviceName" label="设备名" >
        </el-table-column>
        <el-table-column align="center"
            prop="deviceStatus" label="设备状态"  >
        </el-table-column>
        <el-table-column align="center"
            prop="deviceErrMessage"  label="设备异常信息" >
        </el-table-column>
      </el-table>
      <br>
        <!-- 用户状态 -->
        <div  >
          <span>用户状态</span><br><br>
        </div>
        <el-table 
        :data="TellerList"
        border>
        <el-table-column align="center"
            prop="TellerName" label="柜员名" >
        </el-table-column>
        <el-table-column align="center"
            prop="TellerStatus" label="柜员状态"  >
        </el-table-column>
        <el-table-column align="center"
            prop="TellerPost"  label="柜员岗位" >
        </el-table-column>
      </el-table>
      <!-- </el-card> -->
      </div>
    </el-carousel-item>
    <!-- 第二页 -->
    <el-carousel-item class="card">
      <div>
        <!-- <el-card shadow="always"  class="card" > -->
        <div  class="tittle">
          <span>库箱状态</span><br><br>
        </div>
        <!-- 凭证信息 -->
        <div  >
          <span>凭证信息</span><br><br>
        </div>
        <el-table 
        :data="VouList"
        border>
        <el-table-column align="center"
            prop="TellerName" label="用户/设备" >
        </el-table-column>
        <el-table-column align="center"
            prop="VouType" label="凭证类型"  >
        </el-table-column>
        <el-table-column align="center"
            prop="VouNum"  label="可用凭证张数" >
        </el-table-column>
      </el-table>
      <br>
        <!-- 现金信息 -->
        <div  >
          <span>现金信息</span><br><br>
        </div>
        <el-table 
        :data="CashList"
        border>
        <el-table-column align="center"
            prop="TellerName" label="用户/设备" >
        </el-table-column>
        <el-table-column align="center"
            prop="Ccy" label="币种"  >
        </el-table-column>
        <el-table-column align="center"
            prop="AvailAmt"  label="可用金额" >
        </el-table-column>
      </el-table>
      <!-- </el-card> -->
      </div>
    </el-carousel-item>
    <!-- 第三页 -->
    <el-carousel-item class="card">
      <div>
        <!-- <el-card shadow="always"  class="card" > -->
        <div  class="tittle">
          <span>交割能力</span><br><br>
        </div>
        <!-- 可收物料 -->
        <el-row :gutter="10">
          <el-col :md="12" :lg="12">
             <div  >
          <span>设备可收物料</span><br><br>
        </div>
        <el-table 
        :data="DevGetMatlList"
        border>
        <el-table-column align="center"
            prop="TellerName" label="设备名" >
        </el-table-column>
        <el-table-column align="center"
            prop="Card" :formatter="screenVoutypeFormat" label="卡"  >
        </el-table-column>
        <el-table-column align="center"
            prop="Cert" :formatter="screenVoutypeFormat"  label="身份证" >
        </el-table-column>
      </el-table>
          </el-col>
          <el-col :md="12" :lg="12">
             <div  >
          <span>设备可付物料</span><br><br>
        </div>
        <el-table 
        :data="DevPutMatlList"
        border>
        <el-table-column align="center"
            prop="TellerName" label="设备名" >
        </el-table-column>
        <el-table-column align="center"
            prop="Vou001" :formatter="screenVoutypeFormat" label="普卡"  >
        </el-table-column>
        <el-table-column align="center"
            prop="Vou002" :formatter="screenVoutypeFormat"  label="金卡" >
        </el-table-column>
        <el-table-column align="center"
            prop="Vou003" :formatter="screenVoutypeFormat" label="白金卡" >
        </el-table-column>
      </el-table>
          </el-col>
        </el-row>
       
      <el-row :gutter="10">
          <el-col :md="12" :lg="12">
             <div  >
          <span>柜台可收物料</span><br><br>
        </div>
        <el-table 
        :data="TlrGetMatlList"
        border>
        <el-table-column align="center"
            prop="TellerName" label="交割柜台" >
        </el-table-column>
        <el-table-column align="center"
            prop="Card" :formatter="screenVoutypeFormat" label="卡"  >
        </el-table-column>
        <el-table-column align="center"
            prop="Cert" :formatter="screenVoutypeFormat" label="身份证" >
        </el-table-column>
        <el-table-column align="center"
            prop="Vou008" :formatter="screenVoutypeFormat" label="存单" >
        </el-table-column>
        <el-table-column align="center"
            prop="Cash" :formatter="screenVoutypeFormat" label="现金" >
        </el-table-column>
      </el-table>
          </el-col>
          <el-col :md="12" :lg="12">
             <div  >
          <span>柜台可付物料</span><br><br>
        </div>
        <el-table 
        :data="TlrPutMatlList"
        border>
        <el-table-column align="center"
            prop="TellerName" label="交割柜台" >
        </el-table-column>
        <el-table-column align="center"
            prop="Vou001" :formatter="screenVoutypeFormat" label="普卡"  >
        </el-table-column>
        <el-table-column align="center"
            prop="Vou002" :formatter="screenVoutypeFormat" label="金卡" >
        </el-table-column>
        <el-table-column align="center"
            prop="Vou003" :formatter="screenVoutypeFormat" label="白金卡"  >
        </el-table-column>
        <el-table-column align="center"
            prop="Vou008" :formatter="screenVoutypeFormat" label="存单"  >
        </el-table-column>
        <el-table-column align="center"
            prop="Cash" :formatter="screenVoutypeFormat" label="现金"  >
        </el-table-column>
      </el-table>
          </el-col>
        </el-row>
      </div>
    </el-carousel-item>
    <!-- 第四页 -->
    <el-carousel-item class="card">
      <div>
        <!-- <el-card shadow="always"  class="card" > -->
        <div  class="tittle">
          <span>业务处理状态</span><br><br>
        </div>
        <!-- 实时信息 -->
        <div>
          <div class="info">
            <el-row :gutter="10">
              <el-col :md="8" :lg="8">
                已受理完成:&nbsp; &nbsp;    <span>{{FlowDoneNum}}</span>&nbsp; 笔
              </el-col>
              <el-col :md="8" :lg="8">
                受理中:&nbsp; &nbsp;    <span>{{FlowDoingNum}}</span>&nbsp; 笔
              </el-col>
              <el-col :md="8" :lg="8">
                受理总数:&nbsp;&nbsp;     <span>{{FlowAllNum}}</span>&nbsp; 笔
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :md="8" :lg="8">
                已交割完成:&nbsp; &nbsp;    <span>{{MatlDoneNum}}</span>&nbsp; 笔
              </el-col>
              <el-col :md="8" :lg="8">
                交割中:&nbsp;   &nbsp;  <span>{{MatlDoingNum}}</span>&nbsp; 笔
              </el-col>
              <el-col :md="8" :lg="8">
                交割总数:&nbsp;&nbsp;  <span>{{MatlAllNum}}</span>&nbsp; 笔
              </el-col>
            </el-row>
          </div>
          <br>
        </div>
        <el-row :gutter="10">
          <el-col :md="12" :lg="12">
            <!-- 受理业务 -->
        <div  >
          <span>受理业务</span><br><br>
        </div>
        <el-table 
        :data="FlowTaskList"
        border>
        <el-table-column align="center"
            prop="CustName" label="客户名" >
        </el-table-column>
        <el-table-column align="center"
            prop="FlowName" label="受理业务"  >
        </el-table-column>
        <el-table-column align="center"
            prop="FlowTeller"  label="受理柜员" >
        </el-table-column>
        <el-table-column align="center"
            prop="FlowStatus"  label="受理状态" >
        </el-table-column>
      </el-table>
       <!-- 交割任务 -->
          </el-col>
          <el-col :md="12" :lg="12">
            <div  >
          <span>交割任务</span><br><br>
        </div>
        <el-table 
        :data="MatlTaskList"
        border>
        <el-table-column align="center"
            prop="CustName" label="客户名" >
        </el-table-column>
        <el-table-column align="center"
            prop="FlowName" label="受理业务"  >
        </el-table-column>
        <el-table-column align="center"
            prop="FlowTeller"  label="受理柜台/设备" >
        </el-table-column>
        <el-table-column align="center"
            prop="FlowStatus"  label="受理状态" >
        </el-table-column>
      </el-table>
          </el-col>
        </el-row>
      <!-- </el-card> -->
      </div>
    </el-carousel-item>
  </el-carousel>
  
</div>
</template>

<script>
import getGlobalParams from "@/utils/getGlobalParams";
import request from "@/utils/request";
import LargeScreenCash from "@/message/screen/LargeScreenCash";
import LargeScreenFlow from "@/message/screen/LargeScreenFlow";
import LargeScreenMatl from "@/message/screen/LargeScreenMatl";
import LargeScreenMult from "@/message/screen/LargeScreenMult";
import LargeScreenTeller from "@/message/screen/LargeScreenTeller";
import LargeScreenDevice from "@/message/screen/LargeScreenDevice";
import LargeScreenVou from "@/message/screen/LargeScreenVou";
import {
  ChartView,
  PanelGroup,
  ChartBar,
  ItemGroup,
  ChartMap,
  ChartRing,
  ChartHistogram,
  ChartTrade
} from "./components";
import { parseTime } from "@/utils";

//通讯相关
import InMatlQuery from "@/message/matlManage/InMatlQuery";

export default {
  name: "real-time-monitor",
  components: {
    ChartView,
    PanelGroup,
    ChartBar,
    ItemGroup,
    ChartMap,
    ChartRing,
    ChartHistogram,
    ChartTrade
  },
  data() {
    return {
      //分页标志：
      pageflag: 4,
      currpage: 1,
      pagerownum: 15,
      //枚举值：
      screenVoutype:getGlobalParams.get("screenVoutype"),
      screenheight:'',
      carouselHeight:'',
      DeviceList:[],//设备状态
      TellerList:[],//用户状态；
      VouList:[],//凭证信息；
      CashList:[],//现金信息;
      //业务受理状态;
      FlowTaskList:[],
      FlowDoneNum:'',//已受理
      FlowDoingNum:'',//受理中
      FlowAllNum:'',//受理总数
      roleInfo:[],
      //交割状态：
      MatlTaskList:[],//交割列表；
      MatlDoneNum:'',//已交割
      MatlDoingNum:'',//待交割
      MatlAllNum:'',//交割总数
      deviceState:[],//设备状态；
      DevPutMatlList:[],//设备可付物料列表；
      DevGetMatlList:[],//设备可收物料列表；
      TlrGetMatlList:[],//柜台可收物料列表；
      TlrPutMatlList:[],//柜台可付物料列表；

      matlInQuery:[],//存放测试数据
      loading:false,
      isHeight: true,
      date: "",
      time: "",
      totalTrade:{},//总交易笔数
      trandeTopTenList:[],//top10
      devRunningStatusList:[],//设备运行情况
      mapDevRunningStatusList:[],//地图
      devBrandQueryInfoList:[],//设备厂商
      tradeTypeQueryInfoList:[],//网点交易
    };
  },
  created() {
    this.$nextTick(() => {
      this.screenAdapt();
      this.queryScreenMult();
      this.queryDeviceList();
      this.queryTellerList();
      this.queryVouList();
      this.queryFlowList();
      this.queryCashList();
      this.queryMatlList();
      this.getTime();
    });
  },
  methods: {
    //枚举值转换：
    screenVoutypeFormat(row, column) {
      return this.screenVoutype[row[column.property]];
    },
    //屏幕自适应：
    screenAdapt(){
      this.screenheight = window.innerHeight;
      this.carouselHeight = this.screenheight *0.8 +"px";
      // this.$refs["card"].height = this.carouselHeight;
      // document.getElementById("card").height = this.carouselHeight;
      console.log("屏幕高度：",window.innerHeight);
      console.log("carouse高度：",this.carouselHeight);
      // console.log("card高度：",this.$refs["card"].height);
    },
    //查询设备信息；
    queryDeviceList() {
      this.loading = true
      let resBody = new LargeScreenDevice();
          request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.DeviceList=response.RSP_BODY.result;
          this.loading=false;
          // this.InTotalNum = parseInt(response.RSP_BODY.TotalNum) ;
          console.log("DeviceList");
          console.log(this.DeviceList);
        } else {
          this.$message({
          message:response.SYS_HEAD.ReturnMessage ,
          type: 'error  '
          });
          this.loading = false;
          console.log(response.RSP_BODY);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      })
    },
    //查询用户状态信息；
    queryTellerList() {
      this.loading = true
      let resBody = new LargeScreenTeller();
          resBody.data.Orgno = "10000";
          request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.TellerList=response.RSP_BODY.TellerList;
          this.loading=false;
          // this.InTotalNum = parseInt(response.RSP_BODY.TotalNum) ;
          console.log("TellerList");
          console.log(this.TellerList);
        } else {
          this.$message({
          message:response.SYS_HEAD.ReturnMessage ,
          type: 'error  '
          });
          this.loading = false;
          console.log(response.RSP_BODY);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      })
    },
    //凭证状态：
    queryVouList() {
      this.loading = true
      let resBody = new LargeScreenVou();
          resBody.data.Orgno = "10000";
          request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.VouList=response.RSP_BODY.VouList;
          this.loading=false;
          // this.InTotalNum = parseInt(response.RSP_BODY.TotalNum) ;
          console.log("VouList");
          console.log(this.VouList);
        } else {
          this.$message({
          message:response.SYS_HEAD.ReturnMessage ,
          type: 'error  '
          });
          this.loading = false;
          console.log(response.RSP_BODY);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      })
    },
    //现金信息查询;
    queryCashList() {
      this.loading = true
      let resBody = new LargeScreenCash();
          resBody.data.Orgno = "10000";
          request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.CashList=response.RSP_BODY.CashList;
          this.loading=false;
          // this.InTotalNum = parseInt(response.RSP_BODY.TotalNum) ;
          console.log("CashList");
          console.log(this.CashList);
        } else {
          this.$message({
          message:response.SYS_HEAD.ReturnMessage ,
          type: 'error  '
          });
          this.loading = false;
          console.log(response.RSP_BODY);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      })
    },
    //业务受理状态查询；
    queryFlowList() {
      this.loading = true
      let resBody = new LargeScreenFlow();
          resBody.data.Orgno = "10000";
          resBody.data.pageflag = this.pageflag;
          resBody.data.currpage = this.currpage;
          resBody.data.pagerownum = this.pagerownum;
          request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.FlowTaskList=response.RSP_BODY.FlowTaskList;
          this.FlowDoneNum=response.RSP_BODY.FlowDoneNum;
          this.FlowDoingNum=response.RSP_BODY.FlowDoingNum;
          this.FlowAllNum=response.RSP_BODY.FlowAllNum;
          this.loading=false;
          // this.InTotalNum = parseInt(response.RSP_BODY.TotalNum) ;
          console.log("FlowTaskList");
          console.log(this.FlowTaskList);
        } else {
          this.$message({
          message:response.SYS_HEAD.ReturnMessage ,
          type: 'error  '
          });
          this.loading = false;
          console.log(response.RSP_BODY);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      })
    },
    //交割任务状态；
    queryMatlList() {
      this.loading = true
      let resBody = new LargeScreenMatl();
          resBody.data.Orgno = "10000";
          resBody.data.pageflag = this.pageflag;
          resBody.data.currpage = this.currpage;
          resBody.data.pagerownum = this.pagerownum;
          request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.MatlTaskList=response.RSP_BODY.MatlTaskList;
          this.MatlDoneNum=response.RSP_BODY.MatlDoneNum;
          this.MatlDoingNum=response.RSP_BODY.MatlDoingNum;
          this.MatlAllNum=response.RSP_BODY.MatlAllNum;
          this.loading=false;
          // this.InTotalNum = parseInt(response.RSP_BODY.TotalNum) ;
          console.log("MatlTaskList");
          console.log(this.MatlTaskList);
        } else {
          this.$message({
          message:response.SYS_HEAD.ReturnMessage ,
          type: 'error  '
          });
          this.loading = false;
          console.log(response.RSP_BODY);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      })
    },
    //大屏交割信息
    queryScreenMult() {
      this.loading = true
      let resBody = new LargeScreenMult();
          resBody.data.Orgno = "10000";
          request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.DevPutMatlList=response.RSP_BODY.DevPutMatlList;
          this.DevGetMatlList=response.RSP_BODY.DevGetMatlList;
          this.TlrGetMatlList=response.RSP_BODY.TlrGetMatlList;
          this.TlrPutMatlList=response.RSP_BODY.TlrPutMatlList;
          this.loading=false;
          // this.InTotalNum = parseInt(response.RSP_BODY.TotalNum) ;
          console.log("ScreenMult");
          console.log(response.RSP_BODY);
        } else {
          this.$message({
          message:response.SYS_HEAD.ReturnMessage ,
          type: 'error  '
          });
          this.loading = false;
          console.log(response.RSP_BODY);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      })
    },
    getTime() {
      setTimeout(() => {
        let Timestamps = new Date();
        this.date = parseTime(Timestamps, "{y}年{m}月{d}日");
        this.time = parseTime(Timestamps, "{h}:{i}:{s}");
        this.getTime();
      }, 1000);
    },
    async getExcel() {
      let resBody = new selfserExcelIns();
      let response = await request(resBody);
      try {
        this.loading = false;
        if (response.SYS_HEAD.ReturnCode == "000000") {
          // this.downloadFile(response.RSP_BODY.fileName);
        } else {
          alert("请求失败，错误码:" + response.SYS_HEAD.ReturnCode);
        }
        return output;
      } catch (err) {
        // this.logger.log("fail", err);
      }
    }
  }
};
</script>
<style >
.div {
  text-align: center;  
  margin:0 auto;
  width: 80%
}
.head_blank{
  height: 50px;
  padding:20px 20px 20px 20px 
}
.tittle{
  text-align: center;  
  font-size: 35px;
}
.info{
  text-align: center; 
  padding: 10px;
  font-size: 22px;
}
.card {
  text-align: center;  
  font-family: "Times New Roman";
  font-weight:bold;
  font-size: 25px;
  padding: 10px;
  background-color: #99a9bf;
  height: inherit;
}
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }
  
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
</style>