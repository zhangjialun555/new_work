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
          <!-- <span v-text="day"></span> -->
          <span v-text="time"></span>
        </div>
  </div>
  <!-- 走马灯部分 -->
  <div class="content">
        <el-carousel class="content_tittle2" indicator-position="outside" :interval="10000" :height="carouselHeight2">
          <!-- 交割能力 -->
           <el-carousel-item   class="item">
            <div class="content_tittle">
              <div class="c_tittle">
                <span v-text="content_tittle"></span>
              </div>
            </div>
            <div class="content_bottom">
              <img class="content_bg" src="../../../static/logo/contentBg.png" >
              <!-- 存放表格数据 -->
              <div class="content_table">
                 <!-- 可收物料 -->
                  <el-card shadow="hover" class="table_card">
                    <el-row :gutter="10">
          <el-col :md="12" :lg="12">
             <div  class="table_tittle">
          <span>▍设备可收物料</span><br><br>
        </div>
        <el-table 
        :data="newDevGetMatlList" cell-class-name="rowC" header-cell-class-name="rowH"
         style="width: 100%;" :row-style="getRowClass" :header-row-style="getRowClass" :header-cell-style="getRowClass">
        <el-table-column align="center"
            prop="TellerName" label="设备名" >
        </el-table-column>
        <el-table-column align="center"
            prop="Card"  label="卡" min-width="20%"  width="200px">
            <template slot-scope="scope" >
              <img :src="scope.row.Card" width="20" height="20"/>
            </template>
        </el-table-column>
        <el-table-column align="center"
            prop="Cert"  label="身份证" >
            <template slot-scope="scope" >
              <img :src="scope.row.Cert" width="20" height="20"/>
            </template>
        </el-table-column>
      </el-table>
          </el-col>
          <el-col :md="12" :lg="12">
             <div class="table_tittle" >
          <span>▍设备可付物料</span><br><br>
        </div>
        <el-table 
        :data="newDevPutMatlList" cell-class-name="rowC" header-cell-class-name="rowH"
         style="width: 100%;" :row-style="getRowClass" :header-row-style="getRowClass" :header-cell-style="getRowClass">
        <el-table-column align="center"
            prop="TellerName" label="设备名" width="220px">
        </el-table-column>
        <el-table-column align="center"
            prop="Vou001"  label="普卡"  >
            <template slot-scope="scope" >
              <img :src="scope.row.Vou001" width="20" height="20"/>
            </template>
        </el-table-column>
        <el-table-column align="center"
            prop="Vou002"  label="金卡" >
            <template slot-scope="scope" >
              <img :src="scope.row.Vou002" width="20" height="20"/>
            </template>
        </el-table-column>
        <el-table-column align="center"
            prop="Vou003"  label="白金卡" >
            <template slot-scope="scope" >
              <img :src="scope.row.Vou003" width="20" height="20"/>
            </template>
        </el-table-column>
      </el-table>
          </el-col>
        </el-row>
       <br>
      <el-row :gutter="10">
          <el-col :md="12" :lg="12">
             <div  class="table_tittle">
          <span>▍交割柜可收物料</span><br><br>
        </div>
        <el-table 
        :data="newTlrGetMatlList" cell-class-name="rowC" header-cell-class-name="rowH"
         style="width: 100%;" :row-style="getRowClass" :header-row-style="getRowClass" :header-cell-style="getRowClass">
        <el-table-column align="center"
            prop="TellerName" label="交割柜台" width="150px">
        </el-table-column>
        <el-table-column align="center"
            prop="Card"  label="卡"  >
            <template slot-scope="scope" >
              <img :src="scope.row.Card" width="20" height="20"/>
            </template>
        </el-table-column>
        <el-table-column align="center"
            prop="Cert"  label="身份证" >
            <template slot-scope="scope" >
              <img :src="scope.row.Cert" width="20" height="20"/>
            </template>
        </el-table-column>
        <el-table-column align="center"
            prop="Vou008"  label="存单" >
            <template slot-scope="scope" >
              <img :src="scope.row.Vou008" width="20" height="20"/>
            </template>
        </el-table-column>
        <el-table-column align="center"
            prop="Cash"  label="现金" >
            <template slot-scope="scope" >
              <img :src="scope.row.Cash" width="20" height="20"/>
            </template>
        </el-table-column>
      </el-table>
          </el-col>
          <el-col :md="12" :lg="12">
             <div class="table_tittle" >
          <span>▍交割柜可付物料</span><br><br>
        </div>
        <el-table 
        :data="newTlrPutMatlList" cell-class-name="rowC" header-cell-class-name="rowH"
         style="width: 100%;" :row-style="getRowClass" :header-row-style="getRowClass" :header-cell-style="getRowClass">
        <el-table-column align="center"
            prop="TellerName" label="交割柜台" width="150px">
        </el-table-column>
        <el-table-column align="center"
            prop="Vou001"  label="普卡"  >
            <template slot-scope="scope" >
              <img :src="scope.row.Vou001" width="20" height="20"/>
            </template>
        </el-table-column>
        <el-table-column align="center"
            prop="Vou002"  label="金卡" >
            <template slot-scope="scope" >
              <img :src="scope.row.Vou002" width="20" height="20"/>
            </template>
        </el-table-column>
        <el-table-column align="center"
            prop="Vou003"  label="白金卡"  >
            <template slot-scope="scope" >
              <img :src="scope.row.Vou003" width="20" height="20"/>
            </template>
        </el-table-column>
        <el-table-column align="center"
            prop="Vou008"  label="存单" >
            <template slot-scope="scope" >
              <img :src="scope.row.Vou008" width="20" height="20"/>
            </template>
        </el-table-column>
        <el-table-column align="center"
            prop="Cash"  label="现金"  >
            <template slot-scope="scope" >
              <img :src="scope.row.Cash" width="20" height="20"/>
            </template>
        </el-table-column>
      </el-table>
          </el-col>
        </el-row>
                  </el-card>
              </div>
            </div>
          </el-carousel-item>
          <!-- 设备状态 -->
          <el-carousel-item  class="item">
            <div class="content_tittle">
              <div class="c_tittle">
                <span v-text="content_tittle1"></span>
              </div>
            </div>
            <div class="content_bottom">
              <img class="content_bg" src="../../../static/logo/contentBg.png" >
              <!-- 存放表格数据 -->
              <div class="content_table">
                 <!-- 可收物料 -->
                  <el-card shadow="hover" class="table_card">
                    <el-row :gutter="10">
          <el-col :md="24" :lg="24">
            <div  class="table_tittle">
              <span class="tittle_span">▍设备状态</span>
              <div class="image_map">
                 <img src="../../../static/logo/device/ok.png" width="20" height="20" />
                 <span>：正常</span>&nbsp;
                 <img src="../../../static/logo/device/part.png" width="20" height="20"/>
                 <span>：部分服务</span>&nbsp;
                 <img src="../../../static/logo/device/error.png" width="20" height="20"/>
                 <span>：异常</span>&nbsp;
                 <img src="../../../static/logo/device/stop.png" width="20" height="20"/>
                 <span>：暂停</span>&nbsp;
                 <img src="../../../static/logo/device/outLine.png" width="20" height="20"/>
                 <span>：离线</span>&nbsp;<br><br>
              </div>
            </div>
        <el-table 
        :data="newDeviceList" cell-class-name="rowC" header-cell-class-name="rowH"
         style="width: 100%;" :row-style="getRowClass" :header-row-style="getRowClass" :header-cell-style="getRowClass">
        <el-table-column align="center"
            prop="deviceName" label="设备" >
        </el-table-column>
        <el-table-column align="center"
            prop="deviceStatus"  label="设备状态" >
            <template slot-scope="scope" >
              <img :src="scope.row.deviceStatus" width="20" height="20"/>
            </template>
        </el-table-column>
        <!-- <el-table-column align="center"
            prop="deviceErrMessage"  label="异常提示" >
        </el-table-column> -->
        <!-- 测试 -->
        <el-table-column align="left" 
            prop="deviceErrMessage"  label="异常信息" >
            <template slot-scope="scope" >
              <marquee scrollamount="5"><span>{{scope.row.deviceErrMessage}}</span></marquee>
            </template>
        </el-table-column>
      </el-table>
          </el-col>
          
        </el-row>
       <br>
      <el-row :gutter="10">
          <el-col :md="24" :lg="24">
             <div  class="table_tittle">
          <span class="tittle_span">▍交割柜状态</span>
          <div class="image_map">
                 <img src="../../../static/logo/device/ok.png" width="20" height="20"/>
                 <span>：正常</span>&nbsp;
                 <img src="../../../static/logo/device/part.png" width="20" height="20"/>
                 <span>：部分服务</span>&nbsp;
                 <img src="../../../static/logo/device/error.png" width="20" height="20"/>
                 <span>：异常</span>&nbsp;
                 <img src="../../../static/logo/device/stop.png" width="20" height="20"/>
                 <span>：暂停</span>&nbsp;
                 <img src="../../../static/logo/device/outLine.png" width="20" height="20"/>
                 <span>：离线</span>&nbsp;<br><br>
              </div>
        </div>
        <el-table 
        :data="newTellerList" cell-class-name="rowC" header-cell-class-name="rowH"
         style="width: 100%;" :row-style="getRowClass" :header-row-style="getRowClass" :header-cell-style="getRowClass">
        <el-table-column align="center"
            prop="TellerName" label="柜员名" >
        </el-table-column>
        <el-table-column align="center"
            prop="TellerStatus"  label="柜员状态" >
            <template slot-scope="scope" >
              <img :src="scope.row.TellerStatus" width="20" height="20"/>
            </template>
        </el-table-column>
        <el-table-column align="center"
            prop="TellerPost"  label="柜员岗位" :formatter="TellerPostFormat" >
        </el-table-column>
      </el-table>
          </el-col>
        </el-row>
        </el-card>
              </div>
            </div>
          </el-carousel-item>
          <!-- 库箱状态 -->
          <el-carousel-item  class="item">
            <div class="content_tittle">
              <div class="c_tittle">
                <span v-text="content_tittle2"></span>
              </div>
            </div>
            <div class="content_bottom">
              <img class="content_bg" src="../../../static/logo/contentBg.png" >
              <!-- 存放表格数据 -->
              <div class="content_table">
                 <!-- 可收物料 -->
                  <el-card shadow="hover" class="table_card">
                    <el-row :gutter="10">
          <el-col :md="24" :lg="24">
             <div  class="table_tittle">
          <span>▍凭证信息</span><br><br>
        </div>
        <el-table 
        :data="VouList" cell-class-name="rowC" header-cell-class-name="rowH"
         style="width: 100%;" :row-style="getRowClass" :header-row-style="getRowClass" :header-cell-style="getRowClass">
        <el-table-column align="center"
            prop="TellerName" label="交割柜/设备">
        </el-table-column>
        <el-table-column align="center"
            prop="VouType"  label="凭证类型"  :formatter="voutypeFormat" >
        </el-table-column>
        <el-table-column align="center"
            prop="VouNum"  label="可用凭证张数" >
        </el-table-column>
      </el-table>
          </el-col>
        </el-row>
       <br>
      <el-row :gutter="10">
          <el-col :md="24" :lg="24">
             <div  class="table_tittle">
          <span>▍现金信息</span><br><br>
        </div>
        <el-table 
        :data="CashList" cell-class-name="rowC" header-cell-class-name="rowH"
         style="width: 100%;" :row-style="getRowClass" :header-row-style="getRowClass" :header-cell-style="getRowClass">
        <el-table-column align="center"
            prop="TellerName" label="交割柜/设备" >
        </el-table-column>
        <el-table-column align="center"
            prop="Ccy"  label="币种" :formatter="ccyFormat" >
        </el-table-column>
        <el-table-column align="center"
            prop="AvailAmt"  label="可用现金" >
        </el-table-column>
      </el-table>
          </el-col>
        </el-row>
        </el-card>
              </div>
            </div>
          </el-carousel-item>
          <!-- 业务处理状态 -->
          <el-carousel-item  class="item">
            <div class="content_tittle">
              <div class="c_tittle">
                <span v-text="content_tittle3"></span>
              </div>
            </div>
            <div class="content_bottom">
              <img class="content_bg" src="../../../static/logo/contentBg.png" >
              <!-- 存放表格数据 -->
              <div class="content_table">
                 <!-- 可收物料 -->
                  <el-card shadow="hover" class="table_card">
                    <el-row :gutter="10">
                      <el-col :md="4" :lg="4">
                         <div class="head_data">
                        <span>{{FlowDoneNum}}</span>
                      </div>
                      </el-col>
                      <el-col :md="4" :lg="4">
                         <div class="head_data">
                        <span>{{FlowDoingNum}}</span>
                      </div>
                      </el-col>
                      <el-col :md="4" :lg="4">
                         <div class="head_data">
                        <span>{{FlowAllNum}}</span>
                      </div>
                      </el-col>
                      <el-col :md="4" :lg="4">
                         <div class="head_data">
                        <span>{{MatlDoneNum}}</span>
                      </div>
                      </el-col>
                      <el-col :md="4" :lg="4">
                         <div class="head_data">
                        <span>{{MatlDoingNum}}</span>
                      </div>
                      </el-col>
                      <el-col :md="4" :lg="4">
                         <div class="head_data">
                        <span>{{MatlAllNum}}</span>
                      </div>
                      </el-col>
                    </el-row>
                    <br>
                    <el-row :gutter="10">
                      <el-col :md="4" :lg="4">
                         <div class="head_data_value">
                        <span>已受理完成(笔)</span><br><br>
                      </div>
                      </el-col>
                      <el-col :md="4" :lg="4">
                         <div class="head_data_value">
                        <span>受理中(笔)</span><br><br>
                      </div>
                      </el-col>
                      <el-col :md="4" :lg="4">
                         <div class="head_data_value">
                        <span>受理总数(笔)</span><br><br>
                      </div>
                      </el-col>
                      <el-col :md="4" :lg="4">
                         <div class="head_data_value">
                        <span>已交割(笔)</span><br><br>
                      </div>
                      </el-col>
                      <el-col :md="4" :lg="4">
                         <div class="head_data_value">
                        <span>待交割(笔)</span><br><br>
                      </div>
                      </el-col>
                      <el-col :md="4" :lg="4">
                         <div class="head_data_value">
                        <span>交割总数(笔)</span><br><br>
                      </div>
                      </el-col>
                    </el-row>
                  <el-row :gutter="10">
          <el-col :md="12" :lg="12">
             <div  class="table_tittle">
          <span class="tittle_span">▍受理业务</span>
          <div class="image_map">
                 <img src="../../../static/logo/business/doing.png" width="20" height="20"/>
                 <span>：处理中</span>&nbsp;
                 <img src="../../../static/logo/business/done.png" width="20" height="20"/>
                 <span>：已完成</span>&nbsp;
                 <img src="../../../static/logo/business/off.png" width="20" height="20"/>
                 <span>：未完成</span>&nbsp;
                 <img src="../../../static/logo/business/end.png" width="20" height="20"/>
                 <span>：终止</span>&nbsp;<br><br>
              </div>
        </div>
        <el-table 
        :data="newFlowTaskList" cell-class-name="rowC" header-cell-class-name="rowH"
         style="width: 100%;" :row-style="getRowClass" :header-row-style="getRowClass" :header-cell-style="getRowClass">
        <el-table-column align="center"
            prop="CustName" label="客户" width="170px">
        </el-table-column>
        <el-table-column align="center"
            prop="FlowName"  label="受理业务"  width="150px">
        </el-table-column>
        <el-table-column align="center"
            prop="FlowTeller"  label="受理柜台/设备" width="220px">
        </el-table-column>
        <el-table-column align="center"
            prop="FlowStatus"  label="受理状态">
            <template slot-scope="scope" >
              <img :src="scope.row.FlowStatus" width="20" height="20"/>
            </template>
        </el-table-column>
      </el-table>
          </el-col>
          <el-col :md="12" :lg="12">
             <div  class="table_tittle">
          <span class="tittle_span">▍交割任务</span>
          <div class="image_map">
                 <img src="../../../static/logo/deliver/doing.png" width="20" height="20"/>
                 <span>：处理中</span>&nbsp;
                 <img src="../../../static/logo/deliver/done.png" width="20" height="20"/>
                 <span>：已完成</span>&nbsp;
                 <img src="../../../static/logo/deliver/off.png" width="20" height="20"/>
                 <span>：未完成</span>&nbsp;<br><br>
              </div>
        </div>
        <el-table 
        :data="newMatlTaskList" cell-class-name="rowC" header-cell-class-name="rowH"
         style="width: 100%;" :row-style="getRowClass" :header-row-style="getRowClass" :header-cell-style="getRowClass">
        <el-table-column align="center"
            prop="CustName" label="客户"  width="170px">
        </el-table-column>
        <el-table-column align="center"
            prop="FlowName"  label="交割业务"  width="150px">
        </el-table-column>
        <el-table-column align="center"
            prop="FlowTeller"  label="交割柜台/设备" width="220px">
        </el-table-column>
        <el-table-column align="center"
            prop="FlowStatus"  label="交割状态" >
            <template slot-scope="scope" >
              <img :src="scope.row.FlowStatus" width="20" height="20"/>
            </template>
        </el-table-column>
      </el-table>
          </el-col>
        </el-row>
       <br>
        </el-card>
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
import LargeScreenMult from "@/message/screen/LargeScreenMult";
import LargeScreenVou from "@/message/screen/LargeScreenVou";
import ok from "../../../static/logo/ok.png";
import no from "../../../static/logo/no.png";
import none from "../../../static/logo/none.png";
import device_ok from "../../../static/logo/device/ok.png";
import device_error from "../../../static/logo/device/error.png";
import device_part from "../../../static/logo/device/part.png";
import device_stop from "../../../static/logo/device/stop.png";
import device_outLine from "../../../static/logo/device/outLine.png";
import business_doing from "../../../static/logo/business/doing.png";
import business_done from "../../../static/logo/business/done.png";
import business_end from "../../../static/logo/business/end.png";
import business_off from "../../../static/logo/business/off.png";
import deliver_doing from "../../../static/logo/deliver/doing.png";
import deliver_done from "../../../static/logo/deliver/done.png";
import deliver_off from "../../../static/logo/deliver/off.png";
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
import voutypeSelect from "@/message/dataSelect/voutypeSelect";
import ccySelect from "@/message/dataSelect/ccySelect";

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
      ok,
      no,
      none,
      device_ok,
      device_error,
      device_part,
      device_stop,
      device_outLine,
      business_doing,
      business_done,
      business_end,
      business_off,
      deliver_doing,
      deliver_done,
      deliver_off,
      //枚举值：
      TellerStatus:getGlobalParams.get("TellerStatus"),
      TellerPost:getGlobalParams.get("TellerPost"),
      FlowStatus:getGlobalParams.get("FlowStatus"),
      FlowStatus2:getGlobalParams.get("FlowStatus2"),
      //分页标志：
      pageflag: 4,
      currpage: 1,
      pagerownum: 15,
      ccyArray:[],
      voutypeArray:[],
      ccyType:{},//存放币种枚举值
      voutype:{},//
      date: "",
      day:"",
      time: "",
      head_tittle:"网点现场运营状态",
      content_tittle:'交割能力',
      content_tittle1:'交割柜/设备状态',
      content_tittle2:'库箱状态',
      content_tittle3:'业务处理状态',
      screenheight:'',
      carouselHeight:'',
      carouselHeight2:'',
      DeviceList:[],//设备状态
      TellerList:[],//用户状态；
      newDeviceList:[],//设备状态
      newTellerList:[],//用户状态；
      VouList:[],//凭证信息；
      CashList:[],//现金信息;
      //业务受理状态;
      FlowTaskList:[],
      newFlowTaskList:[],
      FlowDoneNum:'',//已受理
      FlowDoingNum:'',//受理中
      FlowAllNum:'',//受理总数
      roleInfo:[],
      //交割状态：
      MatlTaskList:[],//交割列表；
      newMatlTaskList:[],//交割列表；
      MatlDoneNum:'',//已交割
      MatlDoingNum:'',//待交割
      MatlAllNum:'',//交割总数
      deviceState:[],//设备状态；
      DevPutMatlList:[],//设备可付物料列表；
      newDevPutMatlList:[],//处理后的设备可付物料列表；
      DevGetMatlList:[],//设备可收物料列表；
      newDevGetMatlList:[],//处理后的设备可收物料列表；
      TlrGetMatlList:[],//柜台可收物料列表；
      newTlrGetMatlList:[],//处理后的柜台可收物料列表；
      TlrPutMatlList:[],//柜台可付物料列表；
      newTlrPutMatlList:[],//处理后的柜台可付物料列表；
      matlInQuery:[],//存放测试数据
      loading:false,
      isHeight: true,
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
      //获取币种、凭证类型
      this.queryCcy();
      this.queryVoutype();
      this.screenAdapt();
      this.getTime();
      //第一遍调用接口，之后通过getData()递归调用
      this.queryDeviceList();
      this.queryTellerList();
      // this.queryVouList();
      this.queryFlowList();
      // this.queryCashList();
      this.queryMatlList();
      this.queryScreenMult();
      this.getData();
    });
  },
  methods: {
    getRowClass({ row, column, rowIndex, columnIndex }) {
                return "background:#3f5c6d2c;color:#000;";
            },
    //枚举值转换：
    ccyFormat(row, column) {
      return this.ccyType[row[column.property]];
    },
    voutypeFormat(row, column) {
      return this.voutype[row[column.property]];
    },
    TellerStatusFormat(row, column) {
      return this.TellerStatus[row[column.property]];
    },
    TellerPostFormat(row, column) {
      return this.TellerPost[row[column.property]];
    },
    FlowStatusFormat(row, column) {
      return this.FlowStatus[row[column.property]];
    },
    FlowStatus2Format(row, column) {
      return this.FlowStatus2[row[column.property]];
    },
    //定义方法，获取数组参数，自动补长使两数组长度相同；
    //图片
    fetchLenght(val1,val2){
      console.log("数组1:",val1,"长度：",val1.length);
      console.log("数组2:",val2,"长度：",val2.length);
      let len = val1.length>val2.length?val1.length:val2.length;//获取最长数组长度;
      console.log("最长数组长度：",len);
      if(val1.length>val2.length){
        for(let i = val2.length;i<len;i++){
          //目前写死，根据已知后台字段进行push；
          val2.push({TellerName:'',Vou001:'0',Vou002:'0',Vou003:'0'});
          console.log(i)
        }
      }else{
        for(let i = val1.length;i<len;i++){
          //目前写死，根据已知后台字段进行push；
          val1.push({TellerName:'',Cert:'0',Card:'0'});
          console.log(i)
        }
      }
      console.log("变更后")
      console.log("数组1:",val1,"长度：",val1.length);
      console.log("数组2:",val2,"长度：",val2.length);
    },
    fetchLenght1(val1,val2){
      console.log("数组1:",val1,"长度：",val1.length);
      console.log("数组2:",val2,"长度：",val2.length);
      let len = val1.length>val2.length?val1.length:val2.length;//获取最长数组长度;
      console.log("最长数组长度：",len);
      if(val1.length>val2.length){
        for(let i = val2.length;i<len;i++){
          //目前写死，根据已知后台字段进行push；
          val2.push({TellerName:'',Vou001:'0',Vou002:'0',Vou003:'0',Vou008:'',Cash:''});
          console.log(i)
        }
      }else{
        for(let i = val1.length;i<len;i++){
          //目前写死，根据已知后台字段进行push；
          val1.push({TellerName:'',Cert:'0',Card:'0',Cash:'0',Vou008:''});
          console.log(i)
        }
      }
      console.log("变更后")
      console.log("数组1:",val1,"长度：",val1.length);
      console.log("数组2:",val2,"长度：",val2.length);
    },
    //非图片页：
    fetchLenght2(val1,val2){
      console.log("数组1:",val1,"长度：",val1.length);
      console.log("数组2:",val2,"长度：",val2.length);
      let len = val1.length>val2.length?val1.length:val2.length;//获取最长数组长度;
      console.log("最长数组长度：",len);
      if(val1.length>val2.length){
        for(let i = val2.length;i<len;i++){
          //目前写死，根据已知后台字段进行push；
          val2.push('');
          console.log(i)
        }
      }else{
        for(let i = val1.length;i<len;i++){
          //目前写死，根据已知后台字段进行push；
          val1.push('');
          console.log(i)
        }
      }
      console.log("变更后")
      console.log("数组1:",val1,"长度：",val1.length);
      console.log("数组2:",val2,"长度：",val2.length);
    },
    //查询凭证类型枚举值；
    queryVoutype(){
      console.log("queryVoutype")
      let resBody = new voutypeSelect();
          resBody.data.MATLTYPE = "";
          resBody.data.VOUTYPE = "";
          resBody.data.VOUTYPENAME = "";
          request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          //将后台的枚举值存入
          this.voutypeArray = response.RSP_BODY.struct;
          console.log("voutypeArray");
          console.log(this.voutypeArray);
          this.voutypeSelection(this.queryVouList);
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
    //获取下拉框
    voutypeSelection(collback1){
      for(let i = 0;i<this.voutypeArray.length;i++){
        this.voutype[this.voutypeArray[i].VOUTYPE] = this.voutypeArray[i].VOUTYPENAME;
      }
      collback1();
      console.log("当前凭证类型下拉框属性；");
      console.log(this.voutype);
    },
    ccySelection(collback1){
      for(let i = 0;i<this.ccyArray.length;i++){
        this.ccyType[this.ccyArray[i].DICTCODE] =this.ccyArray[i].DICTNAME;
      }
      collback1();
      console.log("当前币种枚举值");
      console.log(this.ccyType);
    },
    //查询币种；
    queryCcy(val){
      console.log("queryCcy")
      let resBody = new ccySelect();
          resBody.data.DICTTYPE = "ccy";
          resBody.data.DICTCODE = "";
          resBody.data.DICTNAME = "";
          request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          //将后台的枚举值存入
          this.ccyArray = response.RSP_BODY.struct;
          console.log("ccyArray");
          console.log(this.ccyArray);
          this.ccySelection(this.queryCashList);
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

    //屏幕自适应：
    screenAdapt(){
      this.screenheight = window.innerHeight;
      this.carouselHeight = this.screenheight *0.055 +"px";
      this.carouselHeight2 = this.screenheight *0.834 +"px";
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
          this.newDeviceList = this.changeToImage_device(this.DeviceList);
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
          this.newTellerList = this.changeToImage_teller(this.TellerList);
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
          resBody.data.pagerownum = '14';
          request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.FlowTaskList=response.RSP_BODY.FlowTaskList;
          this.newFlowTaskList = this.changeToImage_business(this.FlowTaskList);
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
          resBody.data.pagerownum = '14';
          request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.MatlTaskList=response.RSP_BODY.MatlTaskList;
          this.newMatlTaskList = this.changeToImage_deliver(this.MatlTaskList);
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
          this.fetchLenght(this.DevGetMatlList,this.DevPutMatlList);
          this.fetchLenght1(this.TlrGetMatlList,this.TlrPutMatlList);
          //对获取到的数据进行处理
          this.newDevGetMatlList =  this.changeToImage(this.DevGetMatlList);
          this.newDevPutMatlList =  this.changeToImage(this.DevPutMatlList);
          this.newTlrGetMatlList =  this.changeToImage(this.TlrGetMatlList);
          this.newTlrPutMatlList =  this.changeToImage(this.TlrPutMatlList);
          // console.log("newDevGetMatlList",this.newDevGetMatlList);
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
    //对数组处理，将"0""1"转化为image地址；
    changeToImage(val){
      console.log("得到的数组为：",val);
      for(let i = 0;i<val.length;i++){
        for(var j in val[i]) {
            console.log(j,":",val[i][j]);
            //逻辑判断，如果值为1,则将图片地址传递
            if(val[i][j]==='1'){
              val[i][j] = ok;
            }else if(val[i][j]==='0'){
              val[i][j] = none;
            }
        }
      }
      return val;
    },
    changeToImage_device(val){
      console.log("得到的数组为：",val);
      for(let i = 0;i<val.length;i++){
        for(var j in val[i]) {
            console.log(j,":",val[i][j]);
            //逻辑判断，如果值为1,则将图片地址传递
            if(val[i][j]==='正常服务'){
              val[i][j] = device_ok;
            }else if(val[i][j]==='部分服务'){
              val[i][j] = device_part;
            }else if(val[i][j]==='异常'){
              val[i][j] = device_error;
            }else if(val[i][j]==='离线'){
              val[i][j] = device_outLine;
            }else if(val[i][j]==='暂停'){
              val[i][j] = device_stop;
            }
        }
      }
      return val;
    },
    changeToImage_teller(val){
      console.log("得到的数组为：",val);
      for(let i = 0;i<val.length;i++){
        for(var j in val[i]) {
            console.log(j,":",val[i][j]);
            //逻辑判断，如果值为1,则将图片地址传递
            if(val[i][j]==='00'){
              val[i][j] = device_outLine;
            }else if(val[i][j]==='01'){
              val[i][j] = device_ok;
            }else if(val[i][j]==='02'){
              val[i][j] = device_stop;
            }
        }
      }
      return val;
    },
    changeToImage_business(val){
      console.log("得到的数组为：",val);
      for(let i = 0;i<val.length;i++){
        for(var j in val[i]) {
            console.log(j,":",val[i][j]);
            //逻辑判断，如果值为1,则将图片地址传递
            if(val[i][j]==='0'){
              val[i][j] = business_done;
            }else if(val[i][j]==='1'){
              val[i][j] = business_off;
            }else if(val[i][j]==='2'){
              val[i][j] = business_doing;
            }else if(val[i][j]==='3'){
              val[i][j] = business_end;
            }
        }
      }
      return val;
    },
    changeToImage_deliver(val){
      console.log("得到的数组为：",val);
      for(let i = 0;i<val.length;i++){
        for(var j in val[i]) {
            console.log(j,":",val[i][j]);
            //逻辑判断，如果值为1,则将图片地址传递
            if(val[i][j]==='0'){
              val[i][j] = deliver_done;
            }else if(val[i][j]==='1'){
              val[i][j] = deliver_off;
            }else if(val[i][j]==='2'){
              val[i][j] = deliver_doing;
            }
        }
      }
      return val;
    },
    getTime() {
      setTimeout(() => {
        let Timestamps = new Date();
        this.date = parseTime(Timestamps, "{y}年{m}月{d}日");
        this.day = parseTime(Timestamps, "星期{a}");
        this.time = parseTime(Timestamps, "{h}:{i}:{s}");
        this.getTime();
      }, 1000);
    },
    getData(){
      setTimeout(() =>{
        this.queryDeviceList();
        this.queryTellerList();
        this.queryVouList();
        this.queryFlowList();
        this.queryCashList();
        this.queryMatlList();
        this.queryScreenMult();
        this.getData();//递归
      },40000)
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
    top: 1vh;
    right: 20px;
    span:nth-child(1){
      opacity: 0.5;
      font-family: SourceHanSansCN-Normal;
      font-size: 14px;
      color: #FFFFFF;
      letter-spacing: 0;
      text-align: center;
      margin: 10px auto;
    }
    // span:nth-child(2){
    //   opacity: 0.5;
    //   font-family: SourceHanSansCN-Normal;
    //   font-size: 14px;
    //   color: #FFFFFF;
    //   letter-spacing: 0;
    //   text-align: center;
    //   margin: 10px auto;
    // }
    span:nth-child(2){
      opacity: 0.75;
      font-family: SourceHanSansCN-Normal;
      font-size: 40px;
      color: #FFFFFF;
      letter-spacing: 0;
      text-align: right;
      margin: 10px auto;
    }
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
      top: 1%;
      right: 38.4%;
      left: 38.4%;
      font-family: SourceHanSansCN-Medium;
      font-size: 40px;
      color: #FFFFFF;
      letter-spacing: 4px;
      text-align: center;
      // line-height: 12px;
      
    }
    }
    .content{
      position: absolute;
      top: 8%;
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
          top: 10%;
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
        padding: 0.5%;
        .item{
        height: 100%;
        width: 100%;
        // background-color: #FFFFFF
        // background-size:100% 100%;  
        // background: url("../../../static/logo/contentBg.png")no-repeat center;
        // background-size:100% 99.9%; 
        }
        .content_bottom{
          position: absolute;
          top: 10%;
          bottom: 0%;
          width:100%;
          .content_bg{
            width: 100%;
            height: 100%;
        }
        .content_table{
          position: absolute;
          top: 3%;
          right: 4.8%;
          left: 4.8%;
          bottom: 6.3%;
          .table_card {
        background-color: #3f5c6d2c;
       border: 0px;
       .head_data{
          width: 100%;
          height: 30%;
          font-family: SourceHanSansCN-Regular;
          font-size: 48px;
          color: #FFFFFF;
          letter-spacing: 0;
          text-align: center;
       }
       .head_data_value{
         width: 100%;
          height: 30%;
          font-family: SourceHanSansCN-Regular;
          font-size: 20px;
          color: #FFFFFF;
          letter-spacing: 0;
          text-align: center;
       }
    }
    .table_tittle{
      width: 100%;
      height: 5%;
      // height: ;
      font-family: SourceHanSansCN-Normal;
      font-size: 26px;
      color: #00FDFB;
      letter-spacing: 0;
      .tittle_span{
        float:left;
        width: 20%;
        height: 100%;
      }
      .image_map{
        float:left;
        width:calc(100% - 20%);
        height: 100%;
        font-family: SourceHanSansCN-Normal;
        font-size: 20px;
        color: #00FDFB;
        letter-spacing: 0;
        img{
          vertical-align: middle;
        }
      }
    }
    .el-table,
    .el-table  .el-table__body  .delstatu:hover>td{ 
        background: #3f5c6d2c!important; 
    }
    .el-table__expanded-cell {
        background-color: #3f5c6d2c;
    }
    .rowC{
      border: 0px !important;
      font-family: SourceHanSansCN-Normal;
      font-size: 22px;
    }
    .rowH{
      border: 0px !important;
      font-family: SourceHanSansCN-Normal;
      font-size: 22px;
    }
    .cell{
      color: #eeeeee
    }
          // background-color: #eeeeee;
          // .block1{
          //   position: absolute;
          //   top: 0%;
          //   right: 51.6%;
          //   left: 0%;
          //   bottom:50%;
          //   background-color:gainsboro;
          //   .block_tittle{
          //     position: absolute;
          //     top: 0%;
          //     right: 71.3%;
          //     left: 0%;
          //     bottom:95%;
          //     background-color:palegreen;
          //   }
          //   .block_table{
          //     position: absolute;
          //     top: 5%;
          //     right: 0%;
          //     left: 0%;
          //     bottom:95%;
          //   }
          // }
          // .block2{
          //   position: absolute;
          //   top: 0%;
          //   left: 51.6%;
          //   right: 0%;
          //   bottom:50%;
          //   background-color:orchid;
          // }
          // .block3{
          //   position: absolute;
          //   top: 50%;
          //   right: 51.6%;
          //   left: 0%;
          //   bottom:0%;
          //   background-color:gold;
          // }
          // .block4{
          //   position: absolute;
          //   top: 50%;
          //   left: 51.6%;
          //   right: 0%;
          //   bottom:0%;
          //   background-color:peru;
          // }
        }
        }
        
        .c_tittle{
          position: absolute;
          top: 1.5%;
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