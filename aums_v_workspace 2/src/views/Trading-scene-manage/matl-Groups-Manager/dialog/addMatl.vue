<template>
	<div>
    <el-dialog title="新增物料" @open="openCollback" @close="closeDialog"
    :lock-scroll=false
    :visible.sync="isShow" width="800px">
      <el-steps  :active="active" 
            align-center  style="margin-bottom:10px"
            finish-status="success">
        <el-step v-if="matlGroupInfo.MATLGROUPROS" title="选择物料"></el-step>
        <el-step v-if="matlGroupInfo.MATLGROUPROS === '02'" title="附加信息"></el-step>
        <el-step v-if="matlGroupInfo.MATLGROUPROS" title="绑定模式"></el-step>
        <!-- <el-step title="确认信息"></el-step> -->
      </el-steps>
      <!-- 选择物料 -->
      <div v-if="active===1">
        <el-card style="margin-bottom:10px;">
                 <el-form ref='matlQuery' :model='matlQuery'  size='mini' label-position="top">
                  <el-row :gutter="10">
                  <el-col  :lg="6" :md="6">
                    <el-form-item label='物料类型'  >
                      <el-select v-model="matlQuery.MATLTYPE" placeholder="请选择物料类型"  >
                <el-option 
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
                    </el-form-item>
                  </el-col>  
                  <el-col  :lg="6" :md="6">
                    <el-form-item label='物料名称'  >
                      <el-input v-model='matlQuery.MATLNAME'  maxlength="50"
                      placeholder="请输入物料名称"  ></el-input>
                    </el-form-item>
                  </el-col> 
                  <el-col  :lg="6" :md="6">
                    <el-form-item label='物料英文简称' >
                      <el-input v-model='matlQuery.MATLENNAME'  maxlength="20"
                      placeholder="请输入物料英文简称"  ></el-input>
                    </el-form-item>
                  </el-col> 
                  <el-col  :lg="3" :md="4" class="searchBtnMarginTop">
                    <el-button type='primary' size='mini' icon='el-icon-search' @click="queryMatl()">查询</el-button>
                  </el-col>
                  <el-col  :lg="3" :md="4" class="searchBtnMarginTop">
                    <el-button type='warning' size='mini' icon='el-icon-refresh'
                    @click="resetForm()">重置</el-button>
                  </el-col>
                  </el-row>
                  <!-- 物料组表格 -->
                  <el-table :data="matlQueryReasult" 
                  header-row-class-name="tableHeaderClass"
                    border>
                      <el-table-column width="60" fixed="left">
                        <template slot-scope="scope" >
                          <el-radio :label="scope.row.MATLID"
                          @change.native="getInMatlID(scope.$index, scope.row)"
                          v-model="MATLID">{{null}}</el-radio>
                        </template>
                        </el-table-column>
                      <el-table-column prop="MATLTYPE" :formatter="matlTypeFormat" label="物料类型"></el-table-column>
                      <!-- <el-table-column prop="MATLID" label="物料ID"></el-table-column> -->
                      <el-table-column prop="MATLNAME" label="物料名称"></el-table-column>
                      <!-- <el-table-column prop="MODORGNO" label="维护机构"></el-table-column>
                      <el-table-column prop="MODUSER" label="维护用户"></el-table-column> -->
                  </el-table>
                <el-pagination
                  style="text-align: right; margin-top:20px;"
                  @current-change="handleCurrentChange"
                  :current-page="currpage"
                  background
                  layout="sizes, total, prev, pager, next, jumper"
                  :total="TotalNum">
                </el-pagination>
                </el-form>
                </el-card>
                <div slot="footer" class="dialog-footer" style="text-align:center;">
                  <el-button type="primary" size="mini" style="margin-top: 10px;" v-if="matlGroupInfo.MATLGROUPROS === '02'"  :disabled="isNext" @click="next()">添加附加信息</el-button>
                  <el-button type="primary" size="mini" style="margin-top: 10px;" v-else  :disabled="isNext" @click="nextToEnd()">确定</el-button>
                </div>
              </div> 
    <!-- 添加凭证数量和序号 -->
      <div v-if="active===2">
        <el-card style="margin-bottom:10px;">
          <el-form  label-position="left" label-width="80px" size='mini' :rules="MatlGroupRules" ref='addInfo' :model='addInfo'>
            <el-row :gutter="10"> 
            <el-col  :lg="12" :md="12">
                    <el-form-item label='凭证数量'  prop='VOUNUM'>
                      <el-input v-model='addInfo.VOUNUM'  
                      placeholder="请输入凭证数量"  ></el-input>
                    </el-form-item>
                  </el-col> 
                  <!-- <el-col  :lg="12" :md="12">
                    <el-form-item label='物料序号'  prop='devNum'>
                      <el-input v-model='addInfo.SERLNUM'  
                      placeholder="请输入物料序号"  ></el-input>
                    </el-form-item>
                  </el-col>  -->
                </el-row>
          </el-form>
        </el-card>
        <div slot="footer" class="dialog-footer" style="text-align:center;">
                  <el-button type="primary" size="mini" style="margin-top: 10px;" @click="nextStep('addInfo')">添加物料并绑定模式</el-button>
                </div>
      </div>
    <!-- 绑定收审模式 -->
    <div v-if="active===3">
        <el-card style="margin-bottom:10px;">
                  <!-- 输入组表格 -->
                  <el-table :data="CollModelInfo" 
                  v-if="tableType=='In'"
                  header-row-class-name="tableHeaderClass"
                  @selection-change="handleSelectionModel"
                    border>
                      <el-table-column
                        type="selection"
                        width="55">
                      </el-table-column>
                      <!-- <el-table-column prop="VOUNUM" label="凭证数量"></el-table-column>
                      <el-table-column fixed prop="MODORGNO" label="维护机构"></el-table-column>
                      <el-table-column prop="MODUSER" label="维护用户"></el-table-column>    -->
                      <el-table-column prop="COLLMODE" :formatter="collModeFormat" label="收取模式"></el-table-column>
                      <el-table-column prop="COLLANDAUDTMODE" :formatter="collAndAudtModeFormat" label="审核模式"></el-table-column>
                      <!-- <el-table-column prop="MODTIME" label="维护时间"></el-table-column>
                      <el-table-column prop="MODDATE" label="维护日期"></el-table-column> -->
                      </el-table>
                  <!-- 输出组表格 -->
                  <el-table :data="DeliverModelInfo" 
                  v-if="tableType=='Out'"
                  header-row-class-name="tableHeaderClass"
                  @selection-change="handleSelectionModel"
                    border>
                      <el-table-column
                        type="selection"
                        width="55">
                      </el-table-column>
                      <!-- <el-table-column prop="VOUNUM" label="凭证数量"></el-table-column>
                      <el-table-column fixed prop="MODORGNO" label="维护机构"></el-table-column>
                      <el-table-column prop="MODUSER" label="维护用户"></el-table-column>    -->
                      <el-table-column prop="DELIVERTYPE" :formatter="deliverModeFormat" label="隔日交付机构"></el-table-column>
                      <el-table-column prop="DELIVERMODE" :formatter="deliverConfModeFormat" label="交付模式"></el-table-column>
                      <el-table-column prop="DELIVERCFMODE" :formatter="deliverTypeFormat" label="交付确认模式"></el-table-column>
                      <!-- <el-table-column prop="MODTIME" label="维护时间"></el-table-column>
                      <el-table-column prop="MODDATE" label="维护日期"></el-table-column> -->
                  </el-table>
                </el-card>
                 <div slot="footer" class="dialog-footer" style="text-align:center;">
                  <!-- <el-button type="primary" size="mini" style="margin-top: 10px;" @click="again()">继续添加</el-button> -->
                  <el-button type="primary" size="mini" style="margin-top: 10px;"  @click="finish()">完成</el-button>
                </div>
              </div>
    </el-dialog>
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
import InMatlGroupManage from "@/message/Tradingscenemanage/matlGroupsManager/InMatlGroupManage";
import InMatlGroupModel from "@/message/Tradingscenemanage/matlGroupsManager/InMatlGroupModel";
import InMatlGroupModelQuery from "@/message/Tradingscenemanage/matlGroupsManager/InMatlGroupModelQuery";
import matlGroupInfoManage from "@/message/Tradingscenemanage/matlGroupsManager/matlGroupInfoManage";
import matlGroupInfoQuery from "@/message/Tradingscenemanage/matlGroupsManager/matlGroupInfoQuery";
import OutMatlGroupManage from "@/message/Tradingscenemanage/matlGroupsManager/OutMatlGroupManage";
import OutMatlGroupModel from "@/message/Tradingscenemanage/matlGroupsManager/OutMatlGroupModel";
import OutMatlGroupModelQuery from "@/message/Tradingscenemanage/matlGroupsManager/OutMatlGroupModelQuery";
import TradeMatlGroupInfoQuery from "@/message/Tradingscenemanage/matlGroupsManager/TradeMatlGroupInfoQuery";

import spinnerDataQuery from "@/message/spinnerDataQuery/spinner-data-query";
export default {
  props: {
    option: Object,
    rowData: Object
  },
  data() {
    return {
      //维护机构和维护用户,登录时就已经确定
      MODORGNO:'',
      MODUSER:'',
      //分页标志：
      pageflag: 4,
      currpage: 1,
      pagerownum: 10,
      // 页面号
      active:1,
      TotalNum:0,
      isNext:true,
      isFinish:true,
      MATLID:'',
      //定义维护结构：
      //物料查询表单：
      matlQuery:{
        MATLTYPE:'',//物料类型
        MATLID:'',//物料ID
        MATLNAME:'',//物料名称
        MATLENNAME:'',//英文简称
      },
      //附加信息：序号和凭证数量；
      addInfo:{
        SERLNUM:'',//序号
        VOUNUM:'1',//凭证数量
      },  
      MatlGroupRules: {
        VOUNUM: [{ required: true, message: "请输入凭证数量", trigger: "blur" }],
      },
      matlType:getGlobalParams.get("matlType"),
      collMode:getGlobalParams.get("collMode"),
      collAndAudtMode:getGlobalParams.get("collAndAudtMode"),
      deliverMode:getGlobalParams.get("deliverMode"),
      deliverConfMode:getGlobalParams.get("deliverConfMode"),
      deliverType:getGlobalParams.get("deliverType"),
      //物料类型：
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
      matlManageInfo:[],//存放当前选择的物料信息
      matlModelInfo:[],//存放当前选择的模式信息；
      //取模式中所需数据，后Push到数组；
      matlEachModel:{
        COLLANDAUDTMODE: '',
        COLLMODE:'',
        MATLID:'',
        MODORGNO:'',
        MODUSER:''
      },
      matlGroupInfo:{
        MATLGROUPROS:'',
      },//存放父页面选择的物料组信息
      tableType:'In',
      matlQueryReasult:[],
      MatlGroupsManageInfo:{
        //概要维护
        OPERTYPE:'',//操作类型
        TRANCODE:'',//交易代码
        MATLGROUPID:'',//物料组ID
        MATLGROUPNAME:'',//物料组名称
        MATLGROUPDSCP:'',//物料组描述
        MATLGROUPROS:'',//物料组性质
        MODORGNO:'',//维护机构
        MODUSER:'',//维护用户 
      },
      CollModelInfo:[],
      DeliverModelInfo:[],
      matlSelectType:[
        {
          value: '03',
          label: '必要输入物料组'
        },
        {
          value: '01',
          label: '附加输入物料组'
        },
        {
          value: '02',
          label: '输出物料组'
        },
      ],

      moveClass: false,
      inputDisabled: false,
      // dataRules: {},
    };
  },
  computed: {
    isShow: {
      get: function() {
        return this.option.isShow;
      },
      set: function(newVal) {
        this.option.isShow = newVal;
      }
    },
    // isEdit: function() {
    //   if (this.option.isEdit) {
    //     return (this.option.isEdit = "编辑交易场景");
    //   } else {
    //     return (this.option.isEdit = "新增交易场景");
    //   }
    // },
    tableDataRow: function() {
      return this.rowData;
    }
  },
  created() {
    this.getOrgnoInfo();//获取当前操作的维护机构和维护用户
  },
  methods: {
    handleCurrentChange(val) {
      this.currpage=val
      console.log(`当前页: ${val}`);
      this.queryMatlList();
    },
    collModeFormat(row, column) {
      return this.collMode[row[column.property]];
    },
    collAndAudtModeFormat(row, column) {
      return this.collAndAudtMode[row[column.property]];
    },
    deliverModeFormat(row, column) {
      return this.deliverMode[row[column.property]];
    },
    deliverConfModeFormat(row, column) {
      return this.deliverConfMode[row[column.property]];
    },
    deliverTypeFormat(row, column) {
      return this.deliverType[row[column.property]];
    },
    //确定维护机构和维护用户的值：
    getOrgnoInfo(){
      this.MODORGNO = this.$store.getters.branchId;
      this.MODUSER = this.$store.getters.userId;
    } , 
    matlTypeFormat(row, column) {
      return this.matlType[row[column.property]];
    },
    openCollback(){
      this.matlGroupInfo.MATLGROUPROS=this.rowData.MATLGROUPROS;
      //打开弹窗执行查询操作；
      this.queryMatlList();
    },
    closeDialog() {
      this.active=1;
      this.currpage = 1;
      this.MATLID = '';
      this.addInfo.VOUNUM = '1';
      this.matlGroupInfo.MATLGROUPROS = '';
      this.matlQuery = {};
      this.matlQueryReasult = [];
      this.matlManageInfo = [];
      // this.$nextTick(() => {
      //   this.$refs["tempRules"].clearValidate();
      // });
    },
    //打开弹窗模糊查询可选物料；
    queryMatlList(){
      //首选对所选物料组进行逻辑判断调用不同的接口：输入物料组查询输入物料；输出物料组查询输出物料；
      if(this.matlGroupInfo.MATLGROUPROS==="02"){
        this.tableType="Out";
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
          this.matlQueryReasult=response.RSP_BODY.struct;
          this.TotalNum = parseInt(response.RSP_BODY.TotalNum);
          this.loading=false;
          console.log("成功读取输出数据");
          console.log(response.RSP_BODY);
        } else {
          console.log(response.RSP_BODY);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      });
      }else{
        this.tableType="In";
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
          this.matlQueryReasult=response.RSP_BODY.struct;
          this.TotalNum = parseInt(response.RSP_BODY.TotalNum);
          this.loading=false;
          console.log("成功读取输入数据");
          console.log(response.RSP_BODY);
        } else {
          console.log(response.RSP_BODY);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      })
      }
    },
    //精确查找物料信息：
    queryMatl(){
      //首选对所选物料组进行逻辑判断调用不同的接口：输入物料组查询输入物料；输出物料组查询输出物料；
      if(this.matlGroupInfo.MATLGROUPROS==="02"){
        this.tableType="Out";
        let resBody = new OutMatlQuery();
          resBody.data.MATLTYPE = this.matlQuery.MATLTYPE;
          resBody.data.MATLID = this.matlQuery.MATLID;
          resBody.data.MATLNAME = this.matlQuery.MATLNAME;
          resBody.data.MATLENNAME = this.matlQuery.MATLENNAME;
          resBody.data.pageflag = this.pageflag;
          resBody.data.currpage = this.currpage;
          resBody.data.pagerownum = this.pagerownum;
          request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.matlQueryReasult=response.RSP_BODY.struct;
          this.TotalNum = parseInt(response.RSP_BODY.TotalNum);
          this.loading=false;
          console.log("成功读取输出数据");
          console.log(response.RSP_BODY);
        } else {
          console.log(response.RSP_BODY);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      });
      }else{
        this.tableType="In";
        let resBody = new InMatlQuery();
          resBody.data.MATLTYPE = this.matlQuery.MATLTYPE;
          resBody.data.MATLID = this.matlQuery.MATLID;
          resBody.data.MATLNAME = this.matlQuery.MATLNAME;
          resBody.data.MATLENNAME = this.matlQuery.MATLENNAME;
          resBody.data.pageflag = this.pageflag;
          resBody.data.currpage = this.currpage;
          resBody.data.pagerownum = this.pagerownum;
          request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.matlQueryReasult=response.RSP_BODY.struct;
          this.TotalNum = parseInt(response.RSP_BODY.TotalNum);
          this.loading=false;
          console.log("成功读取输入数据");
          console.log(response.RSP_BODY);
        } else {
          console.log(response.RSP_BODY);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      })
      }
    },
    //清空查询表单：
    resetForm(){
      this.matlQuery={};
      this.queryMatlList();//清空后刷新列表
    },
    //获取所选物料信息；
    getInMatlID(scope, val) {
      this.isNext = false;
      this.matlManageInfo = val;
      this.MATLID = val.MATLID;
      console.log("当前物料信息:")
      console.log(this.matlManageInfo);
    },
    next(){
      this.active++;
    },
    handleSelectionModel(val){
      this.matlModelInfo = val;
      // if(this.matlModelInfo.length !== 0){
      //   this.isFinish = false;
      // }else{
      //   this.isFinish = true;
      // }
      console.log("当前选定的收核模式:");
      console.log(this.matlModelInfo);
    },
    changeMatlModelInfo(){
      for(let i = 0;i<this.matlModelInfo.length;i++){
        delete this.matlModelInfo[i].MODDATE;
        delete this.matlModelInfo[i].MODTIME;
        this.matlModelInfo[i].MODORGNO = this.MODORGNO;
        this.matlModelInfo[i].MODUSER = this.MODUSER;
      }
      console.log("变更后的收核模式:");
      console.log(this.matlModelInfo);
    },
  nextToEnd(){
      let resBody = new InMatlGroupManage();
      resBody.data.OPERTYPE = "1";//新增
      resBody.data.MATLGROUPID = this.rowData.MATLGROUPID;
      resBody.data.TRANCODE = this.rowData.TRANCODE;
      resBody.data.MODORGNO = this.MODORGNO;
      resBody.data.MODUSER = this.MODUSER;
      resBody.data.MATLID = this.matlManageInfo.MATLID;
      delete resBody.data.SERLNUM;
      request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.$message({
          message: '添加物料成功！请绑定交付模式！',
          type: 'success'
          });
          this.queryMatlModel();
          this.active = 3;
        } else {
           this.$message({
          message:response.SYS_HEAD.ReturnMessage ,
          type: 'error  '
          });
          console.log(response.RSP_BODY);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      });
  },
  nextStep(formName){
     this.$refs[formName].validate((valid) => {
          if (valid) {
            //此处执行添加物料；并进行提示绑定对应的模式；
    //同样需要进行判断，向不同的物料组添加物料；
      let resBody = new OutMatlGroupManage();
      resBody.data.OPERTYPE = "1";//新增
      resBody.data.MATLGROUPID = this.rowData.MATLGROUPID;
      resBody.data.TRANCODE = this.rowData.TRANCODE;
      resBody.data.MODORGNO = this.MODORGNO;
      resBody.data.MODUSER = this.MODUSER;
      resBody.data.MATLID = this.matlManageInfo.MATLID;
      resBody.data.VOUNUM = this.addInfo.VOUNUM;
      // resBody.data.MATLGRPINPUTLIST.SERLNUM = this.addInfo.SERLNUM;
      request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.$message({
          message: '添加物料成功！请绑定收审模式！',
          type: 'success'
          });
          this.active++;
          this.queryMatlModel();
        } else {
           this.$message({
          message:response.SYS_HEAD.ReturnMessage ,
          type: 'error  '
          });
          console.log(response.RSP_BODY);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    //进入模式页面时查询：
    queryMatlModel(){
      if(this.matlGroupInfo.MATLGROUPROS==="02"){
        let resBody = new OutMatlDeliverModelQuery();
        resBody.data.MATLID = this.matlManageInfo.MATLID;
        resBody.data.pageflag = this.pageflag;
        resBody.data.currpage = this.currpage;
        resBody.data.pagerownum = this.pagerownum;
        request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.DeliverModelInfo = response.RSP_BODY.struct;
        } else {
          console.log(response.RSP_BODY);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      });
      }else{
        let resBody = new InMatCollModelQuery();
        resBody.data.MATLID = this.matlManageInfo.MATLID;
        resBody.data.pageflag = this.pageflag;
        resBody.data.currpage = this.currpage;
        resBody.data.pagerownum = this.pagerownum;
        request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.CollModelInfo = response.RSP_BODY.struct;
        } else {
          console.log(response.RSP_BODY);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      });

      }
    },
    finish(){
      //绑定收核模式完成；
      if(this.matlGroupInfo.MATLGROUPROS==="02"){
        let resBody = new OutMatlGroupModel();
        resBody.data.OPERTYPE = "1";
        resBody.data.TRANCODE = this.rowData.TRANCODE;
        resBody.data.MATLGROUPID = this.rowData.MATLGROUPID;
        resBody.data.MATLID = this.matlManageInfo.MATLID;
        resBody.data.MODORGNO = this.MODORGNO;
        resBody.data.MODUSER = this.MODUSER;
        this.changeMatlModelInfo();
        resBody.data.MATLGRPOUTPUTCFLIST = this.matlModelInfo;
        request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.$message({
          message: '已成功添加物料并绑定交付模式！',
          type: 'success'
          });
          this.option.isShow =false;
        } else {
           this.$message({
          message:response.SYS_HEAD.ReturnMessage ,
          type: 'error  '
          });
          console.log(response.RSP_BODY);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      });
      }else{
        let resBody = new InMatlGroupModel();
        resBody.data.OPERTYPE = "1";
        resBody.data.TRANCODE = this.rowData.TRANCODE;
        resBody.data.MATLGROUPID = this.rowData.MATLGROUPID;
        resBody.data.MATLID = this.matlManageInfo.MATLID;
        resBody.data.MODORGNO = this.MODORGNO;
        resBody.data.MODUSER = this.MODUSER;
        this.changeMatlModelInfo();
        resBody.data.MATLGRPINPUTRCLIST = this.matlModelInfo;
        request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.$message({
          message: '已成功添加物料并绑定收核模式！',
          type: 'success'
          });
          this.option.isShow =false;
        } else {
           this.$message({
          message:response.SYS_HEAD.ReturnMessage ,
          type: 'error  '
          });
          console.log(response.RSP_BODY);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      });
      };

      this.option.isShow=false;
      console.log("此处添加物料")
    },
  }
};
</script>

<style>
.sortable-ghost {
  opacity: 0.8;
  color: #fff !important;
  background: #42b983 !important;
}
</style>

<style scoped>
.icon-star {
  margin-right: 2px;
}
.drag-handler {
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.mouseDrag {
  cursor: move;
}
.slotFooter {
  text-align: right;
}
</style>
