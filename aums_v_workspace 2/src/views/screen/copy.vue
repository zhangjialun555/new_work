<template>
  <div class="screen-container">
  <div class="tab-container">
    <div >
      <img class="logo" src="../../../static/logo/agreeLOGO.png" >
    </div>
    <div class="tittle">
      <span v-text="head_tittle"></span>
    </div>
    <div class="monitor_header_date">
          <span v-text="date"></span>
          <span v-text="time"></span>
        </div>
  </div>
  <!-- 走马灯部分 -->
  <div class="content">
    <el-carousel class="content_tittle" indicator-position="none" :interval="4000" :height="carouselHeight">
          <el-carousel-item v-for="item in 4" :key="item">
            <div >
              <div class="c_tittle">
                <span v-text="content_tittle"></span>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
        <el-carousel class="content_tittle2" indicator-position="outside" :interval="4000" :height="carouselHeight2">
          <el-carousel-item v-for="item in 4" :key="item" class="item">
            <div >
              <div class="c_tittle">
                <!-- <span v-text="content_tittle"></span> -->
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
  </div>
</div>
</template>

<script>
import getGlobalParams from "@/utils/getGlobalParams";
import request from "@/utils/request";
import LargeScreenCash from "@/message/screen/LargeScreenCash";
import LargeScreenFlow from "@/message/screen/LargeScreenFlow";
import LargeScreenMatl from "@/message/screen/LargeScreenMatl";
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
      date: "",
      time: "",
      head_tittle:"网点现场运营状态",
      content_tittle:'交割能力',
      screenheight:'',
      carouselHeight:'',
      carouselHeight2:'',
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
      // this.queryDeviceList();
      // this.queryTellerList();
      // this.queryVouList();
      // this.queryFlowList();
      // this.queryCashList();
      // this.queryMatlList();
      this.getTime();
    });
  },
  methods: {
    //屏幕自适应：
    screenAdapt(){
      this.screenheight = window.innerHeight;
      this.carouselHeight = this.screenheight *0.055 +"px";
      this.carouselHeight2 = this.screenheight *0.766 +"px";
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
<style rel="stylesheet/scss" lang="scss">
.screen-container {
    width:100%;
    height:100%;  
    background-size:100% 100%;  
    background: url("../../../static/logo/backGrand.png")no-repeat center;
    background-size:100% 99.9%; 
   .tab-container{
      height: 7%;
      width: 100%;
      background-size:100% 100%;  
      background: url("../../../static/logo/tab.png")no-repeat center;
      background-size:100% 99.9%; 
      // background: url("../../../static/logo/tab.png");
      .logo {
      position: absolute;
      top: 1vh;
      left: 1.9%;
      right: 87%;
      height: 3.8%;
      width: 11.1%;
      // margin: 14px 17px;
    }
    .monitor_header_date {
    color: #81c2ff;
    position: absolute;
    top: 3vh;
    right: 20px;
    p:nth-child(1) {
      font-size: 16px;
      margin: 10px auto;
    }
    p:nth-child(2) {
      font-size: 20px;
      letter-spacing: 5px;
      margin: 0;
    }
  }
    .tittle{
      position: absolute;
      top: 3vh;
      right: 38.4%;
      left: 38.4%;
      font-family: SourceHanSansCN-Medium;
      font-size: 40px;
      color: #FFFFFF;
      letter-spacing: 4px;
      text-align: center;
      line-height: 12px;
    }
    }
    .content{
      position: absolute;
      top: 11.6%;
      right: 10.6%;
      left: 10.6%;
      bottom: 4.8%;
      margin:0  auto;
      .content_tittle{
        height: 7%;
        width: 100%;
        background-size:100% 100%;  
        background: url("../../../static/logo/headBg.png")no-repeat center;
        background-size:100% 99.9%; 
        .c_tittle{
          position: absolute;
          top: 0.5%;
          right: 32.8%;
          left: 32.8%;
          font-family: SourceHanSansCN-Medium;
          font-size: 32px;
          color: #FFFFFF;
          letter-spacing: 0;
          text-align: center;
        }
      }
      .content_tittle2{
        padding: 0.8%;
        .item{
        height: 100%;
        width: 100%;
        background-size:100% 100%;  
        background: url("../../../static/logo/contentBg.png")no-repeat center;
        background-size:100% 99.9%; 
        }
        .c_tittle{
          position: absolute;
          top: 0.5%;
          right: 32.8%;
          left: 32.8%;
          font-family: SourceHanSansCN-Medium;
          font-size: 32px;
          color: #FFFFFF;
          letter-spacing: 0;
          text-align: center;
        }
      }
      .content_carousel{
        // height: 100%;
        width: 100%;
        .el-carousel__item h3 {
        color: #475669;
        font-size: 18px;
        opacity: 0.75;
        line-height: 300px;
        margin: 0;
  }
  
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
      }
      
    }
  }
  .tab{
    height: 7%;
    width: 100%;
  }
  /* 登陆页logo */
  .login-logo{
    position: absolute;
    top: 20px;
    left: 20px;
    
    .title {
      font-size: 20px;
      color: #eeeeee;
    }
    div{
      float: left;
      margin-right: 20px;
    }
  }
.el-button el-button--text{
  color: black !important
}
.bgrangd{
  height: 1280px;
  width: 1920px;
}
.el_button{
  color: white ;
  font-size: 20px;
  opacity: 1
}
</style>