<template>
  <div class="type-info-manage" v-loading="loading"
    element-loading-text="加载中。。。">
    <el-card>
  
        <el-form size='mini' label-position="top">
        <el-row :gutter="10">
         <el-col  :lg="4" :md="6">
            <el-form-item label="用户编号" size='mini' label-position="top" >
              <el-input  size="mini" maxlength="50" placeholder="请输入用户编号" v-model="InmatlInfoQuery.MATLNAME">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col  :lg="4" :md="6">
            <el-form-item label="用户姓名" size='mini' label-position="top" >
              <el-input  size="mini" maxlength="50" placeholder="请输入用户姓名" v-model="InmatlInfoQuery.MATLNAME">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col  :lg="4" :md="6">
            <el-form-item label="用户状态" size='mini' label-position="top" >
              <el-select v-model="InmatlInfoQuery.MATLTYPE" placeholder="请选择"  >
                <el-option 
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col  :lg="4" :md="6">
            <el-form-item label="IP地址" size='mini' label-position="top" >
              <el-input  size="mini" maxlength="20"  placeholder="请输入IP地址" v-model="InmatlInfoQuery.MATLENNAME">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col  :lg="4" :md="6">
            <el-form-item label="渠道标识" size='mini' label-position="top" >
              <el-select v-model="InmatlInfoQuery.MATLTYPE" placeholder="请选择"  >
                <el-option 
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col  :lg="4" :md="6">
            <el-form-item label="启用状态" size='mini' label-position="top" >
              <el-select v-model="InmatlInfoQuery.MATLTYPE" placeholder="请选择"  >
                <el-option 
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col  :lg="2" :md="3" class="searchBtnMarginTop">
            <el-button type='primary' size='mini' icon='el-icon-search' @click="clickInQuery">查询</el-button>
          </el-col>
          <el-col  :lg="2" :md="3" class="searchBtnMarginTop">
            <el-button type='warning' size='mini' icon='el-icon-refresh'
            @click="resetForm">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-row :gutter="10">
        <!-- <el-col :sm='5' :lg='5'>
          <el-input v-model="search" size="mini" suffix-icon="el-icon-search" placeholder="请输入查询信息检索"></el-input>
        </el-col> -->
        <el-button type="primary" size="mini"
        icon="el-icon-plus"
        @click="handleParameter('add')">新增</el-button>
    
        <el-button type="primary" size="mini" :disabled="BtnGroup1.editBtn"
        @click="handleParameter('edit')" icon="el-icon-edit" >编辑</el-button>
    
        <el-button type="danger" size="mini" 
        icon="el-icon-delete" :disabled="BtnGroup1.deleteBtn"
        @click="deleteInMatl">删除</el-button>

        <el-button type="primary" size="mini" :disabled="BtnGroup1.bindBtn" icon="el-icon-edit-outline"
        @click="handleBindingModel">收审模式维护</el-button>

      </el-row>
      <el-table
        :data="matlInQuery"
        class="tableMarginTop"
        header-row-class-name="tableHeaderClass"
        border>
        <el-table-column width="60">
          <template slot-scope="scope">
            <el-radio :label="scope.row.MATLID"
            @change.native="getInMatlID(scope.$index, scope.row)"
            v-model="matlId">{{null}}</el-radio>
          </template>
        </el-table-column>  
        <el-table-column
            prop="MATLNAME" label="用户编号1" >
        </el-table-column>
        <el-table-column
            prop="MATLENNAME" label="用户姓名" >
        </el-table-column>
        <el-table-column
            prop="MATLENNAME" label="用户密码" >
        </el-table-column>
        <el-table-column
            prop="MATLENNAME" label="用户等级" >
        </el-table-column>
        <el-table-column
            prop="MATLENNAME" label="用户状态" >
        </el-table-column>
        <el-table-column
            prop="MATLENNAME" label="用户MAC地址" >
        </el-table-column>
        <el-table-column
            prop="MATLENNAME" label="用户IP地址" >
        </el-table-column>
        <el-table-column
            prop="MATLENNAME" label="用户渠道标识" >
        </el-table-column>
       

        <!-- <el-table-column
            prop="MATLTYPE" :formatter="matlTypeFormat" label="用户密码" width="200" >
        </el-table-column>
        <el-table-column
            prop="PROCESSMODE" label="处理模式" :formatter="processModeFormat"  >
        </el-table-column>
          <el-table-column
            prop="ISIMAGE" label="是否影像化" :formatter="isImageFormat" >
        </el-table-column>
        <el-table-column
            prop="IMAGEFLAG" label="影像化要求" :formatter="imageFlagFormat" >
        </el-table-column>
        <el-table-column
            prop="VOUTYPE" label="凭证类型" :formatter="voutypeFormat" >
        </el-table-column>
        <el-table-column
            prop="CCY" label="币种"  :formatter="ccyFormat" >
        </el-table-column>
        <el-table-column
            prop="ISMUX" label="是否复用" :formatter="isMuxFormat" >
        </el-table-column>
        <el-table-column 
       align="center"
        width="100" label="详细信息" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="mini"
            @click="handleQueryParameter(scope.$index, scope.row)">查看</el-button>
          </template>
        </el-table-column> -->
      </el-table>

      <el-pagination
        style="text-align: right; margin-top:20px;"
        @current-change="handleInCurrentChange"
        :current-page="currpage"
        background
        layout="sizes, total, prev, pager, next, jumper"
        :total="InTotalNum">
      </el-pagination>
  </el-card>
  
    <!-- </el-card> -->
    <!-- 弹框 -->
    <component  :is='dialogList.addInMatl' :rowData="rowValIn" :option='dialogInMatl' @refreshTable="queryInMatlInfoList"></component>
    <component :is='dialogList.queryMatlDetail' :paramObj="rowObj" :option='dialogQueryMatl' ></component>
    <component :is='dialogList.modeManage' :rowData="rowVal" :option='dialogBindingModel' ></component>
    <component :is='dialogList.addOutMatl' :rowData="rowValOut" :option='dialogOutMatl' @refreshTable="queryOutMatlInfoList"></component>

  </div>
</template>

<script>
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
import InMatlQuery from "@/message/matlManage/InMatlQuery";
import OutMatlQuery from "@/message/matlManage/OutMatlQuery";
import InMatlManage from "@/message/matlManage/InMatlManage";
import OutMatlManage from "@/message/matlManage/OutMatlManage";
import InMatlCollModel from "@/message/matlManage/InMatlCollModel";
import InMatCollModelQuery from "@/message/matlManage/InMatCollModelQuery";
import OutMatlDeliverModel from "@/message/matlManage/OutMatlDeliverModel";
import OutMatlDeliverModelQuery from "@/message/matlManage/OutMatlDeliverModelQuery";
import voutypeSelect from "@/message/dataSelect/voutypeSelect";
import ccySelect from "@/message/dataSelect/ccySelect";
import {
  addInMatl,
  queryMatlDetail,
  modeManage,
  addOutMatl
} from "./dialog";
import spinnerDataQuery from '@/message/spinnerDataQuery/spinner-data-query';
import paramBaseinfoQuery from '@/message/parameterManage/param-baseinfo-query';
import paramDelete from '@/message/parameterManage/param-delete';
import toolBox from "@/utils/toolBox";

export default {
  data() {
    return {
      //维护机构和维护用户,登录时就已经确定
      MODORGNO:'',
      MODUSER:'',
      //分页标志：
      pageflag: 4,
      currpage: 1,
      pagerownum: 10,
      //前端条目数：
      InTotalNum:0,
      OutTotalNum:0,
      //查询表单：
      InmatlInfoQuery:{
        MATLTYPE:'',//物料类型
        MATLID:'',//物料 ID
        MATLNAME:'',// 物料名称
        MATLENNAME:'', //物料英文
      },
      OutmatlInfoQuery:{
        MATLTYPE:'',//物料类型
        MATLID:'',//物料 ID
        MATLNAME:'',// 物料名称
        MATLENNAME:'', //物料英文
      },
      matlId:'',
      matlInQuery:[],
      matlOutQuery:[],
      //物料类型枚举值：
      matlType:getGlobalParams.get("matlType"),
      processMode:getGlobalParams.get("processMode"),
      isImage:getGlobalParams.get("isImage"),
      isMux:getGlobalParams.get("isMux"),
      isControlNo:getGlobalParams.get("isControlNo"),
      controlMode:getGlobalParams.get("controlMode"),
      imageFlag:getGlobalParams.get("imageFlag"),
      CCY:getGlobalParams.get("CCY"),
      VOUTYPE:getGlobalParams.get("VOUTYPE"),
      ccyType:{},//存放币种枚举值
      voutype:{},//
      //输入物料信息查询表单：
      tabsPage:"In",//区分页面标志,默认输入页面
      // 物料组性质下拉框选项；
      options: [{
          value: '001',
          label: '重空-借记卡'
        }, {
          value: '002',
          label: '重空-贷记卡'
        }, {
          value: '003',
          label: '重空-折'
        },
        {
          value: '004',
          label: '重空-存单'
        },
        {
          value: '005',
          label: '重空-支票'
        },
        {
          value: '006',
          label: '重空-本票'
        },
        {
          value: '007',
          label: '重空-汇票'
        }, 
        {
          value: '008',
          label: '重空-其他'
        },  {
          value: '101',
          label: '合法性材料-证件-身份证'
        }, {
          value: '102',
          label: '合法性材料-证件-非身份证'
        },
         {
          value: '103',
          label: '合法性材料-其他 '
        }, {
          value: '201',
          label: '非重空凭证'
        }, {
          value: '301',
          label: '现金-本币'
        },
        {
          value: '302',
          label: '现金-外币 '
        },
         {
          value: '303',
          label: '残币 '
        }, {
          value: '304',
          label: '假币'
        }, {
          value: '401',
          label: '监管要求'
        },
        ],
        value: '',
      // search: "",
      //传递给子组件的数据内容；
      rowValOut:null,//输出编辑页面
      rowValIn: null,//输入编辑页面
      rowVal:null,//模式管理页面
      rowObj: null,//详细信息页面
      loading: false,
      //按钮可选标识符
      BtnGroup1:{
        deleteBtn: true,
        editBtn: true,
        bindBtn: true,
      },
      BtnGroup2:{
        deleteBtn: true,
        editBtn: true,
        bindBtn: true,
      },
      dialogList: {
        addInMatl,
        queryMatlDetail,
        modeManage,
        addOutMatl
      },
      dialogInMatl: {
        isShow: false,
        isEdit: false
      },
      dialogOutMatl: {
        isShow: false,
        isEdit: false
      },
      dialogQueryMatl: {
        isShow: false,
        isShow1: false
      },
      dialogBindingModel: {
        isShow: false,
        isShow1: false,
      },
      ccyArray:[],
      voutypeArray:[],
      //前端分页存储
      ParamTableData: []
    };
  },
  computed:{
    // 表格前端模糊查询
    // tables: function(){
    //   var search=this.search;
    //   if(search){
    //     return  this.ParamTableData.filter(function(dataNews){
    //       return Object.keys(dataNews).some(function(key){
    //         return String(dataNews[key]).toLowerCase().indexOf(search) > -1
    //       })
    //     })
    //   }
    //   return this.ParamTableData
    // }
  },
  created() {
    this.queryCcy();
    this.queryVoutype();
    // this.init(this.queryInMatlInfoList,this.queryOutMatlInfoList);
    this.getOrgnoInfo();//获取当前操作的维护机构和维护用户
    // console.log("this voutype:",this.VOUTYPE)
    console.log("机构和用户：");
    console.log(this.$store.getters.userId);
    console.log(this.$store.getters.branchId);
  },
  methods: {  
    //确定维护机构和维护用户的值：
    getOrgnoInfo(){
      this.MODORGNO = this.$store.getters.branchId;
      this.MODUSER = this.$store.getters.userId;
    } , 
    //查询
    ccyFormat(row, column) {
      return this.ccyType[row[column.property]];
    },
    voutypeFormat(row, column) {
      return this.voutype[row[column.property]];
    },
    matlTypeFormat(row, column) {
      return this.matlType[row[column.property]];
    },
    isImageFormat(row, column) {
      return this.isImage[row[column.property]];
    },
    isMuxFormat(row, column) {
      return this.isMux[row[column.property]];
    },
    isControlNoFormat(row, column) {
      return this.isControlNo[row[column.property]];
    },
    controlModeFormat(row, column) {
      return this.controlMode[row[column.property]];
    },
    processModeFormat(row, column) {
      return this.processMode[row[column.property]];
    },
    imageFlagFormat(row, column) {
      return this.imageFlag[row[column.property]];
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
          this.voutypeSelection(this.queryInMatlInfoList,this.queryOutMatlInfoList);
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
    voutypeSelection(collback1,collback2){
      for(let i = 0;i<this.voutypeArray.length;i++){
        this.voutype[this.voutypeArray[i].VOUTYPE] = this.voutypeArray[i].VOUTYPENAME;
      }
      collback1();
      collback2();
      console.log("当前凭证类型下拉框属性；");
      console.log(this.voutype);
    },
    ccySelection(){
      for(let i = 0;i<this.ccyArray.length;i++){
        this.ccyType[this.ccyArray[i].DICTCODE] =this.ccyArray[i].DICTNAME;
      }
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
          this.ccySelection();
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
    //点击查询按钮首先清空当前页码：
    clickInQuery(){
      this.currpage = 1;
      this.queryInMatlInfo();
    },
    clickOutQuery(){
      this.currpage = 1;
      this.queryOutMatlInfo();
    },
    queryInMatlInfo(){
      //此处执行查询任务；
      this.loading=true;
      let resBody = new InMatlQuery();
      resBody.data.MATLID=this.InmatlInfoQuery.MATLID;
      resBody.data.MATLTYPE=this.InmatlInfoQuery.MATLTYPE;
      resBody.data.MATLNAME=this.InmatlInfoQuery.MATLNAME;
      resBody.data.MATLENNAME=this.InmatlInfoQuery.MATLENNAME;
      resBody.data.pageflag = this.pageflag;
      resBody.data.currpage = this.currpage;
      resBody.data.pagerownum = this.pagerownum;
      request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.loading = false;
          console.log("查询输入的内容为：");
          console.log(response.RSP_BODY); 
          this.matlInQuery = response.RSP_BODY.struct;
          this.InTotalNum = parseInt(response.RSP_BODY.TotalNum) ;
          console.log("response.RSP_BODY.TotalNum");
          console.log(response.RSP_BODY.TotalNum)
        } else {
          this.$message({
          message:response.SYS_HEAD.ReturnMessage ,
          type: 'error  '
          });
          this.matlInQuery = [];
          this.loading = false;
          console.log(response);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      })
    },
    queryOutMatlInfo(){
      //此处执行查询任务；
      this.loading=true;
      let resBody = new OutMatlQuery();
      resBody.data.MATLID=this.OutmatlInfoQuery.MATLID;
      resBody.data.MATLTYPE=this.OutmatlInfoQuery.MATLTYPE;
      resBody.data.MATLNAME=this.OutmatlInfoQuery.MATLNAME;
      resBody.data.MATLENNAME=this.OutmatlInfoQuery.MATLENNAME; 
      resBody.data.pageflag = this.pageflag;
      resBody.data.currpage = this.currpage;
      resBody.data.pagerownum = this.pagerownum;
      request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.loading = false;
          console.log("查询输出的内容为：");
          console.log(response.RSP_BODY); 
          this.matlOutQuery = response.RSP_BODY.struct;
          this.OutTotalNum = parseInt(response.RSP_BODY.TotalNum);
        } else {
          this.$message({
          message:response.SYS_HEAD.ReturnMessage ,
          type: 'error  '
          });
          this.matlOutQuery = [];
          this.loading = false;
          console.log(response);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      })
    },
    handleClick(){
      this.resetForm();
    },
    //清空查询表单；
    resetForm(){
      if(this.tabsPage === "In"){
        this.InmatlInfoQuery={};
        this.currpage = 1;
        this.queryInMatlInfoList();
      }else{
        this.OutmatlInfoQuery={};
        this.currpage = 1;
        this.queryOutMatlInfoList();
      }
    },
    //前端分页
    handleInCurrentChange(val) {
      this.currpage=val
      console.log(`当前页: ${val}`);
      this.queryInMatlInfoList();
    },
    //前端分页
    handleOutCurrentChange(val) {
      this.currpage=val
      console.log(`当前页: ${val}`);
      this.queryOutMatlInfoList();
    },
    // 表格选中获取参数ID
    getInMatlID(scope, val) {
      this.matlId = val.MATLID
      //传递参数给子页面
      this.rowValIn = val;
      this.rowVal = val;
      console.log(val);
      if(val) {  
        this.BtnGroup1.deleteBtn = false
        this.BtnGroup1.editBtn = false
        this.BtnGroup1.bindBtn = false
      }
    },
    getOutMatlID(scope, val) {
      this.matlId = val.MATLID
      //传递参数给子页面
      this.rowValOut = val;
      this.rowVal = val;
      console.log(val);
      if(val) {  
        this.BtnGroup2.deleteBtn = false
        this.BtnGroup2.editBtn = false
        this.BtnGroup2.bindBtn = false
      }
    },
    // 查询参数基础信息
    queryInMatlInfoList() {
      this.matlId = ''//清空当前选择
      this.BtnGroup1.deleteBtn = true
      this.BtnGroup1.editBtn = true
      this.BtnGroup1.bindBtn = true
      console.log("queryInMatlInfoList");
      this.loading = true
      let resBody = new InMatlQuery();
          resBody.data.MATLTYPE = "";
          resBody.data.MATLID = "";
          resBody.data.MATLNAME = "";
          resBody.data.MATLENNAME = "";
          resBody.data.pageflag = this.pageflag;
          resBody.data.currpage = this.currpage;
          resBody.data.pagerownum = this.pagerownum;
          request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.matlInQuery=response.RSP_BODY.struct;
          this.loading=false;
          this.InTotalNum = parseInt(response.RSP_BODY.TotalNum) ;
          console.log("response.RSP_BODY.TotalNum");
          console.log(response.RSP_BODY.TotalNum);
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
    // 查询参数基础信息
    queryOutMatlInfoList() {
      this.BtnGroup2.deleteBtn = true
      this.BtnGroup2.editBtn = true
      this.BtnGroup2.bindBtn = true
      this.matlId = ''//清空当前选择
      console.log("queryOutMatlInfoList");
      // this.loading = true
      // this.loading = true
      let resBody = new OutMatlQuery();
          resBody.data.MATLTYPE = "";
          resBody.data.MATLID = "";
          resBody.data.MATLNAME = "";
          resBody.data.MATLENNAME = "";
          resBody.data.pageflag = this.pageflag;
          resBody.data.currpage = this.currpage;
          resBody.data.pagerownum = this.pagerownum;
          request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.matlOutQuery=response.RSP_BODY.struct;
          this.loading=false;
          this.OutTotalNum = parseInt(response.RSP_BODY.TotalNum) ;
          console.log("response.RSP_BODY.TotalNum");
          console.log(response.RSP_BODY.TotalNum)
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
    // 删除输入物料
    deleteInMatl() {
      this.$confirm('此操作将永久删除该物料,同时包含该物料的相关数据集（包括：物料组、收核/交付模式、交易场景）都将删除,是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
      let resBody = new InMatlManage();
      //删除操作接口后续需要更改;
      resBody.data.OPERTYPE = "3";//删除操作
      resBody.data.MATLID=this.matlId;
      resBody.data.MODORGNO=this.MODORGNO;
      resBody.data.MODUSER=this.MODUSER;
      request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.$message({
              type: 'success',
              message: '删除成功!'
     })
     this.queryInMatlInfoList();
        } else {
          this.$message({
          message:response.SYS_HEAD.ReturnMessage ,
          type: 'error  '
          });
          console.log(response);
        }
      })
      .catch(error=>{
        console.log("error", error);
      }) 
      }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    // 删除输出物料
    deleteOutMatl() {
      this.$confirm('此操作将永久删除该物料,同时包含该物料的相关数据集（包括：物料组、收核/交付模式、交易场景）都将删除,是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let resBody = new OutMatlManage();
          resBody.data.MATLID=this.matlId;
          resBody.data.OPERTYPE="3";
          resBody.data.MATLTYPE=this.rowValOut.MATLTYPE;
          resBody.data.MATLNAME=this.rowValOut.MATLNAME;
          resBody.data.MATLENNAME=this.rowValOut.MATLENNAME;
          resBody.data.VOUTYPE=this.rowValOut.VOUTYPE;
          resBody.data.PROCESSMODE=this.rowValOut.PROCESSMODE;
          resBody.data.ISCONTROLNO=this.rowValOut.ISCONTROLNO;
          resBody.data.CONTROLMODE=this.rowValOut.CONTROLMODE;
          resBody.data.CCY=this.rowValOut.CCY;
          resBody.data.MODORGNO=this.MODORGNO;
          resBody.data.MODUSER=this.MODUSER;
          request(resBody)
          .then(response=>{
            if(response.SYS_HEAD.ReturnCode === "000000") {
              this.$message({
              type: 'success',
              message: '删除成功!'
          });
          this.queryOutMatlInfoList();
            } else {
              this.$message({
          message:response.SYS_HEAD.ReturnMessage ,
          type: 'error  '
          });
              console.log(response);
            }
          })
          .catch(error=>{
            this.loading = false
            console.log("error", error);
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    // 输入物料  新增 编辑 参数弹框
    handleParameter(val) {
      this.dialogInMatl.isShow = true;
      if (val === "add") {
        this.dialogInMatl.isEdit = false;
      } else {
        this.dialogInMatl.isEdit = true;
      }
    },
    // 输出物料  新增 编辑 参数弹框
    handleOurParameter(val){
      this.dialogOutMatl.isShow = true;
      if (val === "add") {
        this.dialogOutMatl.isEdit = false;
      } else {
        this.dialogOutMatl.isEdit = true;
      }
    },
    // 查看当前行参数详情信息
    handleQueryParameter(index, row) {
      if(this.tabsPage==="In"){
        this.rowObj = row;
        this.dialogQueryMatl.isShow = true;
      }else{
        this.rowObj = row;
        this.dialogQueryMatl.isShow1 = true;
      }
    },

    // 收核模式维护弹框
    handleBindingModel() {
      this.dialogBindingModel.isShow = true;
    },
    handleBindingModel1() {
      this.dialogBindingModel.isShow1 = true;
    },
  }
};
</script>

<style scope lang="scss">
.type-info-manage {
  text-align: left;
}
</style>