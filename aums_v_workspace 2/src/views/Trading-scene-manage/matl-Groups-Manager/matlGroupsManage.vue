<template>
  <div class="type-info-manage" v-loading="loading"
    element-loading-text="加载中。。。">
    <!-- <el-card style="overflow:visible"> -->
      <el-card  style="overflow:visible;" >
        <el-row :gutter="10">
          <el-col :lg="4" :md="24">
            <el-card style="overflow:visible; height:688px">
              <!-- <div class="roleBlock"> -->
                <!-- <div class="headerRole">
                    交易代码
                </div> -->
               <div class="contentRole">
                <el-tree :data="tradeCodeArray" 
                :props="defaultProps"
                :default-expand-all="true"
                node-key="tradeId"
                @node-click="handleNodeClick">
                </el-tree>
              </div>     
          <!-- </div>   -->
            </el-card>
          </el-col>
          <el-col :lg="20" :md="24">
            <el-card  style="overflow:visible; height:688px">
              <el-form size='mini' label-position="top" :model="matlSummaryQuery" >
        <el-row :gutter="10">
          <el-col  :lg="4" :md="6">
            <el-form-item label="交易代码" size='mini' label-position="top">
              <el-input  size="mini" disabled placeholder="请输入交易代码" v-model="matlSummaryQuery.TRANCODE">
              </el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col  :lg="4" :md="6">
            <el-form-item label="物料组ID" >
              <el-input  size="mini" maxlength="10" placeholder="请输入物料组ID" v-model="matlSummaryQuery.MATLGROUPID">
              </el-input>
            </el-form-item>
          </el-col> -->
          <el-col  :lg="4" :md="6">
            <el-form-item label="物料组类型" size='mini' label-position="top">
                <el-select v-model="matlSummaryQuery.MATLGROUPROS" placeholder="请选择物料组性质">
                  <el-option
                    v-for="item in matlSelectType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
          </el-col>
          <el-col  :lg="4" :md="6">
            <el-form-item label="物料组名称" >
              <el-input  size="mini" maxlength="50" placeholder="请输入物料组名称" v-model="matlSummaryQuery.MATLGROUPNAME">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col  :lg="2" :md="3" class="searchBtnMarginTop">
            <el-button type='primary' size='mini' icon='el-icon-search' @click="clickQuery()">查询</el-button>
          </el-col>
          <el-col  :lg="2" :md="3" class="searchBtnMarginTop">
            <el-button type='warning' size='mini' icon='el-icon-refresh'
            @click="resetForm()">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-row :gutter="10">
        <!-- <el-col :sm='5' :lg='5'>
          <el-input v-model="search" size="mini" suffix-icon="el-icon-search" placeholder="请输入查询信息检索"></el-input>
        </el-col> -->
        <el-button type="primary" size="mini"
        icon="el-icon-plus" :disabled="matlSummaryQuery.TRANCODE === ''"
        @click="handleAddScene('add')">新增物料组</el-button>
        <el-button type="danger" size="mini" 
        icon="el-icon-delete" :disabled="deleteBtn"
        @click="deleteMatlGroup">删除物料组</el-button>
        <el-button type="primary" size="mini" :disabled="editBtn"
        @click="handleEditSence('edit')" icon="el-icon-edit" >编辑概要</el-button>
        <el-button type="primary" size="mini" :disabled="editBtn"
        icon="el-icon-plus"
        @click="handleChannelDialog()">添加物料</el-button>
        <el-button type="primary" size="mini" :disabled="editBtn"
        icon="el-icon-delete"
        @click="handleDeleteMatlDialog()">删除物料</el-button>
        <el-button type="primary" size="mini" :disabled="editBtn"
        icon="el-icon-edit-outline"
        @click="handleEditMatlDialog()">模式维护</el-button>
      </el-row>
      <el-table
        :data="MatlSummaryInfo"
        class="tableMarginTop"
        header-row-class-name="tableHeaderClass"
        border>
        <el-table-column width="60">
          <template slot-scope="scope">
            <el-radio :label="scope.row.MATLGROUPID"
            @change.native="getParamID(scope, scope.row)"
            v-model="matlGroupId">{{null}}</el-radio>
          </template>
        </el-table-column>
        <el-table-column
            prop="TRANCODE" label="交易代码" >
        </el-table-column>
        <el-table-column
            prop="MATLGROUPNAME" label="物料组名称" >
        </el-table-column>
        <el-table-column
            prop="MATLGROUPENNAME" label="英文简称" >
        </el-table-column>
        <el-table-column
            prop="MATLGROUPDSCP" label="物料组描述" >
        </el-table-column>
          <el-table-column
            prop="MATLGROUPROS" label="物料组性质" :formatter="matlGroupRosFormat" >
        </el-table-column>
          <!-- <el-table-column
              prop="MODORGNO" label="维护机构" width="120">
          </el-table-column>
            <el-table-column
              prop="MODUSER" label="维护用户" width="120">
          </el-table-column> -->
        <el-table-column 
       align="center"
        width="100" label="详细信息" >
          <template slot-scope="scope">
            <el-button type="text" size="mini"
            @click="handleQueryParameter(scope.$index, scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        style="text-align: right; margin-top:20px;"
        @current-change="handleCurrentChange"
        :current-page="currpage"
        background
        layout="sizes, total, prev, pager, next, jumper"
        :total="TotalNum">
      </el-pagination>
            </el-card>
          </el-col>
        </el-row>
        
      </el-card>
    <!-- </el-card> -->
    <!-- 弹框 -->
    <component ref="addPar" :is='dialogList.addMatlGroups' :rowData="rowVal1" :option='dialogParameter'></component>
    <component :is='dialogList.queryParameterDetail' :paramObj="rowObj" :option='dialogQueryParameter'></component>
    <component :is='dialogList.EditMatlGroup' :rowData="rowVal" :option='dialogEditParameter'></component>
    <component :is='dialogList.addMatl' :rowData="rowVal" :option='DistributionChannelDialog'></component>
    <component :is='dialogList.ModelManage' :rowData="rowVal" :option='dialogEditMatl'></component>
    <component :is='dialogList.deleteMatl' :rowData="rowVal" :option='dialogDeleteMatl'></component>
      
        
  </div>
</template>

<script>
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
import tradeCodeQuery from "@/message/Tradingscenemanage/TrandeScence/tradeCodeQuery";
import InMatlGroupManage from "@/message/Tradingscenemanage/matlGroupsManager/InMatlGroupManage";
import InMatlGroupModel from "@/message/Tradingscenemanage/matlGroupsManager/InMatlGroupModel";
import InMatlGroupModelQuery from "@/message/Tradingscenemanage/matlGroupsManager/InMatlGroupModelQuery";
import matlGroupInfoManage from "@/message/Tradingscenemanage/matlGroupsManager/matlGroupInfoManage";
import matlGroupInfoQuery from "@/message/Tradingscenemanage/matlGroupsManager/matlGroupInfoQuery";
import OutMatlGroupManage from "@/message/Tradingscenemanage/matlGroupsManager/OutMatlGroupManage";
import OutMatlGroupModel from "@/message/Tradingscenemanage/matlGroupsManager/OutMatlGroupModel";
import OutMatlGroupModelQuery from "@/message/Tradingscenemanage/matlGroupsManager/OutMatlGroupModelQuery";
import TradeMatlGroupInfoQuery from "@/message/Tradingscenemanage/matlGroupsManager/TradeMatlGroupInfoQuery";
import {
  addMatlGroups,
  queryParameterDetail,
  EditMatlGroup,
  addMatl,
  ModelManage,
  deleteMatl
} from "./dialog";

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
      TotalNum:0,
      isDisabledAdd:true,
      matlGroupId:'',
      tradeCodeArray:[],
      tradeInfo:[],//存放树状图取到的值
      //物料组性质下拉框选项；
      //物料组概要查询表单：
      matlSummaryQuery:{
        TRANCODE:'',//交易代码
        MATLGROUPID:'',//物料组ID
        MATLGROUPNAME:'',//物料组名称
        MATLGROUPROS:'',//物料组性质，此处对物料组性质进行判断，编辑模块展示对应名称（输入-->审核模式；输出-->交付模式）
      },
      defaultProps: {
        children: "child",
        label: "TRADENAME",
        tradeId: "TRADEID"
      },
      options: [{
          value: '选项1',
          label: '001-重空-卡'
        }, {
          value: '选项2',
          label: '002-重空-折'
        }, {
          value: '选项3',
          label: '003-重空-票据类'
        },
        {
          value: '选项4',
          label: '004-重空-其他'
        }, {
          value: '选项5',
          label: '101-合法性材料-证件-身份证'
        }, {
          value: '选项6',
          label: '102-合法性材料-证件-非身份证'
        },
         {
          value: '选项7',
          label: '103-合法性材料-其他 '
        }, {
          value: '选项8',
          label: '201-非重空凭证'
        }, {
          value: '选项9',
          label: '301-现金-本币'
        },
        {
          value: '选项10',
          label: '302-现金外币 '
        },
         {
          value: '选项11',
          label: '303-残币 '
        }, {
          value: '选项12',
          label: '304-假币'
        }, {
          value: '选项13',
          label: '401-监管要求'
        },
        ],
        value: '',
      
      //定义维护结构：
      // MatlSummaryInfo:{
      //   OPERTYPE:'',//操作类型
      //   TRANCODE:'',//交易代码
      //   SCENESEQ:'',//交易场景序号
      //   SCENECODE:'',//交易场景ID
      //   SCENECODENAME:'',//交易场景名称
      //   INMATLGROUPID:'',//附加输入组ID
      //   INMATLGROUPNAME:'',//附加输入名称
      //   OUTMATLGROUPID:'',//输出物料组ID
      //   OUTMATLGROUPNAME:'',//输出名称
      //   NECYINMATLGROUPID:'',//必要输入物料组ID
      //   MODORGNO:'',//维护机构
      //   MODUSER:'',//维护用户  
      //   MODDATE:'',//维护日期
      //   MODTIME:'',//维护时间
      // },
      MatlSummaryInfo:[],
      matlSummaryReasult:[],//存放当前行物料组概要信息 
      matlGroupRos:getGlobalParams.get("matlGroupRos"),
      //模拟数据，后期传入查询值：
      //物料组类型选项：
      matlSelectType:[
        {
          value: '03',
          label: '必要输入物料组'
        },
        {
          value: '01',
          label: '场景物料组'
        },
        {
          value: '02',
          label: '输出物料组'
        },
      ],
      search: "",
      rowObj: null,
      cProgramSpinner: [],
      devFormSpinner: [],
      currentPage: 1,
      loading: false,
      deleteBtn: true,
      editBtn: true,
      bindBtn: true,
      setBtn:true,
      dialogList: {
        addMatlGroups,
        queryParameterDetail,
        EditMatlGroup,
        addMatl,
        ModelManage,
        deleteMatl
      },
      dialogParameter: {
        isShow: false,
        isEdit: false
      },
      dialogEditParameter:{
        isShow: false,
      },
      dialogEditMatl:{
        isShow:false,
      },
      dialogDeleteMatl:{
        isShow:false,
      },  
      DistributionChannelDialog: {
        isShow: false,
      },
      dialogQueryParameter: {
        isShow: false
      },
      dialogBindingModel: {
        isShow: false,
        isShow1: false,
      },
      dialogUntieDevice: {
        isShow: false
      },
      rowVal: null,
      rowVal1:null,
      ParamTableData: []
    };
  },
  computed:{
    // 表格前端模糊查询
    tables: function(){
      var search=this.search;
      if(search){
        return  this.ParamTableData.filter(function(dataNews){
          return Object.keys(dataNews).some(function(key){
            return String(dataNews[key]).toLowerCase().indexOf(search) > -1
          })
        })
      }
      return this.ParamTableData
    }
  },
  created() {
    this.getOrgnoInfo();//获取当前操作的维护机构和维护用户
    this.queryTradeCode();
    // this.queryMatlSummaryInfoList();//默认模糊查询
  },
  methods: {    
    //确定维护机构和维护用户的值：
    getOrgnoInfo(){
      this.MODORGNO = this.$store.getters.branchId;
      this.MODUSER = this.$store.getters.userId;
    } , 
    matlGroupRosFormat(row, column) {
      return this.matlGroupRos[row[column.property]];
    },
    //重置：
    resetForm(){
      //重置表单内容;
      this.matlSummaryQuery={};
      this.currpage = 1;
      this.queryMatlSummaryInfoList();//更新查询结果表单；
    },
    //查询交易代码界面：
    queryTradeCode(){
      let resBody = new tradeCodeQuery();
      request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.tradeCodeArray = response.RSP_BODY.struct;
          console.log("查询到的交易代码值:");
          console.log(response.RSP_BODY.struct);
        } else {
          console.log(response);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      })
    },
    //模糊查询：
    //查询物料组概要信息信息:
    queryMatlSummaryInfoList(){
      // this.loading=true;
      console.log("刷新列表")
      let resBody = new matlGroupInfoQuery();
      resBody.data.TRANCODE="";
      resBody.data.MATLGROUPID="";
      resBody.data.MATLGROUPNAME="";
      resBody.data.MATLGROUPROS="";
      resBody.data.pageflag = this.pageflag;
      resBody.data.currpage = this.currpage;
      resBody.data.pagerownum  = this.pagerownum;
       request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.MatlSummaryInfo=response.RSP_BODY.struct ;
          this.TotalNum = parseInt(response.RSP_BODY.TotalNum);
          console.log("当前列表信息：")
          console.log(response);
          this.loading=false;
        } else {
          console.log(response);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      })
    },
    //点击节点触发：
    handleNodeClick(data) {
      this.tradeInfo = data;
      // this.branchNodeInfo = data;
      // this.isDisabledAdd = false;
      console.log("当前点击交易代码信息为：");  
      console.log(this.tradeInfo);
      this.rowVal1 = data;
      this.matlSummaryQuery.TRANCODE = this.tradeInfo.TRADECODE;
      this.clickNodeQuery();
      },
    //查询物料组概要信息信息:
    clickNodeQuery(){
      this.currpage = 1;
      this.queryMatlSummaryInfo();
    },
    queryMatlSummaryInfo(){
      // this.loading=true;
      let resBody = new matlGroupInfoQuery();
      resBody.data.TRANCODE=this.matlSummaryQuery.TRANCODE;
      resBody.data.MATLGROUPID=this.matlSummaryQuery.MATLGROUPID;
      resBody.data.MATLGROUPNAME=this.matlSummaryQuery.MATLGROUPNAME;
      resBody.data.MATLGROUPROS=this.matlSummaryQuery.MATLGROUPROS;
      resBody.data.pageflag = this.pageflag;
      resBody.data.currpage = this.currpage;
      resBody.data.pagerownum  = this.pagerownum;
       request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.MatlSummaryInfo=response.RSP_BODY.struct ;
          this.TotalNum = parseInt(response.RSP_BODY.TotalNum);
          console.log("当前列表信息：")
          console.log(response);
          this.loading=false;
        } else {
          this.$message({
          message:response.SYS_HEAD.ReturnMessage ,
          type: 'error  '
          });
          this.MatlSummaryInfo = [];
          console.log(response);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      })
    },
    //发布渠道
    addMatl(){
      //此处打开发布渠道弹窗
    },
    clickQuery(){
      this.currpage = 1;
      this.queryMatlSummaryInfo();
    },
    handleCurrentChange(val) {
      this.currpage=val
      console.log(`当前页: ${val}`);
      this.queryMatlSummaryInfo();
    },
    handleEditMatlDialog(){
      this.dialogEditMatl.isShow=true;
    },
    handleDeleteMatlDialog(){
      this.dialogDeleteMatl.isShow=true;
    },
    // 表格选中获取当前行参数
    getParamID(scope, val) {
      this.rowVal = val;
      this.matlGroupId = val.MATLGROUPID;
      console.log("当前行数据：");
      console.log(this.rowVal);
      if(val) {   
        this.deleteBtn = false
        this.editBtn = false
        this.bindBtn = false
        this.setBtn = false
      }
    },
    // 删除参数
    deleteMatlGroup() {
      this.$confirm('此操作将永久删除该物料组,同时包含该物料组的相关数据集（包括交易场景）将被删除，是否继续?', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        lockScroll: false
      }).then(() => {
        let resBody = new matlGroupInfoManage();
        resBody.data.OPERTYPE = "3";
        resBody.data.MATLGROUPID = this.matlGroupId; 
        request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          // 删除后选中框置灰
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        this.queryMatlSummaryInfo();
        this.deleteBtn = true
        this.editBtn = true
        this.bindBtn = true
        this.setBtn = true
        } else {
          this.$message({
          message:response.SYS_HEAD.ReturnMessage ,
          type: 'error  '
          });
          console.log(response);
        }
      })
      .catch(error=>{
         this.$message({
          message:response.SYS_HEAD.ReturnMessage ,
          type: 'error  '
          });
        console.log("error", error);
      })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 新增交易 弹框
    handleAddScene(val) {
      this.dialogParameter.isShow = true;
      if (val === "add") {
        this.dialogParameter.isEdit = false;
      } else {
        this.dialogParameter.isEdit = true;
      }
    },
    //编辑交易 弹窗
    handleEditSence(val) {
      this.dialogEditParameter.isShow = true;
    },
    // 渠道弹窗
    handleChannelDialog(val){
      this.DistributionChannelDialog.isShow = true;
    },
    //查询物料组详细信息：
    queryDetailInfo(){
      let resBody = new TradeMatlGroupInfoQuery();
      resBody.data.TRANCODE = this.matlSummaryReasult.TRANCODE;
      resBody.data.MATLGROUPROS = this.matlSummaryReasult.MATLGROUPROS;
      resBody.data.MATLGROUPID = this.matlSummaryReasult.MATLGROUPID;
      resBody.data.MATLGROUPNAME = this.matlSummaryReasult.MATLGROUPNAME;
      resBody.data.pageflag = this.pageflag;
      resBody.data.currpage = this.currpage;
      resBody.data.pagerownum = this.pagerownum;
      request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.rowObj = response.RSP_BODY.struct[0];
          // this.matlQueryReasult=response.RSP_BODY.struct[0].MATLDATA;
          // this.MatlGroupInfo.MATLGROUPID = response.RSP_BODY.struct[0].MATLGROUPID;
          // this.MatlGroupInfo.MATLGROUPNAME = response.RSP_BODY.struct[0].MATLGROUPNAME;
          console.log("成功读取物料组物料信息：");
          console.log(this.rowObj);
        } else {
          console.log(response.RSP_BODY);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      });
    },
    // 查看当前行参数详情信息
    handleQueryParameter(index, row) {
      this.rowObj = row;
      this.dialogQueryParameter.isShow = true;
    },
  }
};
</script>

<style scope lang="scss">
.type-info-manage {
  text-align: left;
}.headerRole {
  padding: 10px 10px;
  background: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
}
.roleBox {
  height: 555px;
  overflow-y: auto;
  padding: 10px;
}
.roleBox::-webkit-scrollbar {
  display: none;
}
.userBlock {
  margin-top: 10px;
  border: 1px solid #eee;
  box-sizing: border-box;
  height: 210px;
  box-sizing: border-box;
}
.contentRole {
  width: 95%;
  height: 582px;
  border: 1px solid #eee;
  border-radius: 3px;
  margin: 10px 0;
  overflow-y: auto;
}
.contentRole::-webkit-scrollbar {
  display: none;
}
.el-radio-group {
  padding: 10px;
}
.el-radio:first-child {
  margin-left: 10px;
}
.el-radio {
  display: inline-block;
  margin: 5px;
  width: 130px;
}
.roleBlock {
  border: 1px solid #eee;
  margin-right: 10px;
  border-radius: 3px;
  height: 638px;
  /* overflow: auto; */
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.el-card {
  margin-bottom: 10px;
  width: 100%;
}
.el-form-item {
  margin-left: 30px;
}
.el-form-item1 {
  margin-left: 10px;
}
.box2-button1 {
  width: 130px;
}
.block {
  width: 30%;
  text-align: center;
}
.dialog-text {
  display: inline-block;
  width: 100%;
  text-align: center;
  color: red;
  font-size: 18px;
}
.el-dialog__body {
  padding: 20px;
}
</style>