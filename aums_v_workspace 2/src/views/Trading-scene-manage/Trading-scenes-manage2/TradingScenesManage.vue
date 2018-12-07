<template>
  <div class="type-info-manage" v-loading="loading"
    element-loading-text="加载中。。。">
    <!-- <el-card style="overflow:visible"> -->
      <el-card  style="overflow:visible">
        <el-row :gutter="10">
          <el-col :lg="4" :md="24">
            <el-card style="overflow:visible; height:688px">
              
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
          
            </el-card>
          </el-col>
          <el-col :lg="20" :md="24">
            <el-card style="overflow:visible; height:688px">
              <el-form size='mini' label-position="top" :model="tradeSceneQuery" >
        <el-row :gutter="10">
          <el-col  :lg="4" :md="6">
            <el-form-item label="交易代码" size='mini' label-position="top">
              <el-input  size="mini" maxlength="50" placeholder="请输入交易代码" disabled v-model="tradeSceneQuery.TRANCODE">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col  :lg="4" :md="6">
            <el-form-item label="交易场景名称" >
              <el-input  size="mini" maxlength="50"  placeholder="请输入交易场景名称" v-model="tradeSceneQuery.SCENECODENAME">
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
        icon="el-icon-plus" :disabled="tradeSceneQuery.TRANCODE===''"
        @click="handleAddScene('add')">新增</el-button>
    
        <el-button type="primary" size="mini" :disabled="editBtn"
        @click="handleEditSence('edit')" icon="el-icon-edit" >编辑</el-button>
    
        <el-button type="danger" size="mini" 
        icon="el-icon-delete" :disabled="deleteBtn"
        @click="deleteScene()">删除</el-button>

        <el-button type="primary" size="mini" :disabled="editBtn"
        icon="el-icon-upload2"
        @click="handleChannelDialog()">发布渠道</el-button>
      </el-row>
      <el-table
        :data="tradeSceneInfo"
        class="tableMarginTop"
        header-row-class-name="tableHeaderClass"
        border>
        <el-table-column width="60">
          <template slot-scope="scope">
            <el-radio :label="scope.row.SCENECODE"
            @change.native="getParamID(scope, scope.row)"
            v-model="SCENECODE">{{null}}</el-radio>
          </template>
        </el-table-column>
        <el-table-column
            prop="SCENESEQ" label="序号" >
        </el-table-column>
        <el-table-column
            prop="TRANCODE" label="交易代码" >
        </el-table-column>
        <!-- <el-table-column
            prop="SCENECODE" label="交易场景ID" width="150">
        </el-table-column> -->
        <el-table-column
            prop="SCENECODENAME" label="交易场景" >
        </el-table-column>
        <el-table-column
            prop="NECYINMATLGROUPNAME" label="必要输入物料组" >
        </el-table-column>
          <el-table-column
            prop="INMATLGROUPNAME" label="场景物料组">
        </el-table-column>
        <!-- <el-table-column
            prop="OUTMATLGROUPID" label="输出物料组ID" width="150">
        </el-table-column> -->
        <el-table-column
            prop="OUTMATLGROUPNAME" label="输出物料组" >
        </el-table-column>
        <el-table-column 
       align="center"
         label="升降序操作" >
          <template slot-scope="scope">
            <el-button  icon="el-icon-upload2" size="mini"
             @click="handleUp(scope.$index, scope.row)"></el-button>
            <el-button  icon="el-icon-download" size="mini"
            @click="handleDown(scope.$index, scope.row)"></el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column
            prop="NECYINMATLGROUPID" label="必要输入物料组ID" width="150">
        </el-table-column> -->
        <!-- <el-table-column
            prop="MODORGNO" label="维护机构" width="120">
        </el-table-column>
          <el-table-column
            prop="MODUSER" label="维护用户" width="120">
        </el-table-column>
        <el-table-column
            prop="MODDATE" label="维护日期" width="120">
        </el-table-column>
        <el-table-column
            prop="MODTIME" label="维护时间" width="120">
        </el-table-column> -->
        <!-- <el-table-column 
       align="center"
        width="160" label="详细信息" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="mini"
            @click="handleQueryParameter(scope.$index, scope.row)">查看</el-button>
          </template>
        </el-table-column> -->
      </el-table>

      <el-pagination
        style="text-align: right; margin-top:20px;"
        @current-change="handleCurrentChange"
        :current-page.sync="currpage"
        background
        layout="sizes, total, prev, pager, next, jumper"
        :total="TotalNum">
      </el-pagination>
            </el-card>
            
          </el-col>
        </el-row>
        
    </el-card>
    <!-- 弹框 -->
    <component ref="addPar" :is='dialogList.addScene' :rowData="rowVal1" :option='dialogParameter'></component>
    <component :is='dialogList.EditScene' :rowData="rowVal" :option='dialogEditParameter'></component>
    <component :is='dialogList.DistributionChannel' :rowData="rowVal" :option='DistributionChannelDialog'></component>
     
        
  </div>
</template>

<script>
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
import {
  addScene,
  EditScene,
  DistributionChannel
} from "./dialog";
import spinnerDataQuery from '@/message/spinnerDataQuery/spinner-data-query';
import paramBaseinfoQuery from '@/message/parameterManage/param-baseinfo-query';
import paramDelete from '@/message/parameterManage/param-delete';
import toolBox from "@/utils/toolBox";
import trandeQuery from "@/message/Tradingscenemanage/TrandeScence/trandeQuery";
import sort from "@/message/Tradingscenemanage/TrandeScence/sort";
import tradeCodeQuery from "@/message/Tradingscenemanage/TrandeScence/tradeCodeQuery";
import trandeManage from "@/message/Tradingscenemanage/TrandeScence/trandeManage";
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
      tradeCodeArray:[],
      tradeInfo:[],//存放树状图取到的值
      //物料组性质下拉框选项；
      //交易查询表单：
      tradeSceneQuery:{
        TRANCODE:'',//交易代码
        SCENECODE:'',//交易场景ID
        SCENECODENAME:''//交易场景名称
      },
      SCENECODE:'',
      //存放当前行的交易场景信息；
      tradeSceneRowInfo:[],
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
        
      defaultProps: {
        children: "child",
        label: "TRADENAME",
        tradeId: "TRADEID"
      },
      
      //定义维护结构：
      // tradeSceneInfo:{
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
      tradeSceneInfo:[],
      search: "",
      rowObj: null,
      rowVal1:null,
      cProgramSpinner: [],
      devFormSpinner: [],
      currentPage: 1,
      loading: false,
      deleteBtn: true,
      editBtn: true,
      bindBtn: true,
      setBtn:true,
      dialogList: {
        addScene,
        EditScene,
        DistributionChannel
      },
      dialogParameter: {
        isShow: false,
        isEdit: false
      },
      dialogEditParameter:{
        isShow: false,
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
    // this.queryTradeScenceInfo();
    this.queryTradeCode();
  },
  methods: {    
    //确定维护机构和维护用户的值：
    getOrgnoInfo(){
      this.MODORGNO = this.$store.getters.branchId;
      this.MODUSER = this.$store.getters.userId;
    } , 
    //点击节点触发：
    handleNodeClick(data) {
      this.tradeInfo = data;
      // this.branchNodeInfo = data;
      // this.isDisabledAdd = false;
      console.log("当前点击交易代码信息为：");  
      console.log(this.tradeInfo);
      this.rowVal1 = data;
      this.tradeSceneQuery.TRANCODE = this.tradeInfo.TRADECODE;
      this.clickNodeQuery();
      //查询当前机构下用户列表信息
      // this.checkUserList();
      },
    clickNodeQuery(){
      this.currpage = 1;
      this.queryTradeScenceInfo();
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
    //重置：
    resetForm(){
      //重置表单内容;
      this.currpage = 1;
      this.queryTradeScenceInfo();
    },
    //模糊查询交易信息:
    queryTradeScenceInfo(){
      this.loading = true;
      let resBody = new trandeQuery();
      resBody.data.TRANCODE = this.tradeInfo.TRADECODE;
      resBody.data.pageflag = this.pageflag;
      resBody.data.currpage = this.currpage;
      resBody.data.pagerownum = this.pagerownum;
      request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.tradeSceneInfo = response.RSP_BODY.struct;
          this.TotalNum = parseInt(response.RSP_BODY.TotalNum);
          this.loading = false;
        } else {
          this.$message({
          message:response.SYS_HEAD.ReturnMessage ,
          type: 'error  '
          });
          this.loading = false;
          console.log(response);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      })
    },
    clickQuery(){
      this.currpage = 1;
      this.queryTradeInfo();
    },
    //调用接口查询交易信息：
    queryTradeInfo(){
      // this.loading = true;
      let resBody = new trandeQuery();
      resBody.data.TRANCODE = this.tradeInfo.TRADECODE;
      resBody.data.SCENECODE = this.tradeSceneQuery.SCENECODE;
      resBody.data.SCENECODENAME = this.tradeSceneQuery.SCENECODENAME;
      resBody.data.pageflag = this.pageflag;
      resBody.data.currpage = this.currpage;
      resBody.data.pagerownum = this.pagerownum;
      request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.loading = false;
          this.tradeSceneInfo = response.RSP_BODY.struct;
          this.TotalNum = parseInt(response.RSP_BODY.TotalNum);
          console.log("查寻到的信息：");
          console.log(this.tradeSceneInfo)
        } else {
          this.loading = false;
          this.$message({
          message:response.SYS_HEAD.ReturnMessage ,
          type: 'error  '
          });
          this.tradeSceneInfo = []
          console.log(response);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      })
    },
    //发布渠道
    DistributionChannel(){
      //此处打开发布渠道弹窗
    },
    handleCurrentChange(val) {
      this.currpage=val
      console.log(`当前页: ${val}`);
      this.queryTradeScenceInfo();
    },
    // 表格选中获取当前行参数
    getParamID(scope, val) {
      this.rowVal = val;
      this.tradeSceneRowInfo = val;
      this.SCENECODE = val.SCENECODE;
      console.log("当前行数据：");
      console.log(this.rowVal);
      if(val) {   
        this.deleteBtn = false
        this.editBtn = false
        this.bindBtn = false
        this.setBtn = false
      }
    },
    //升降机排序;
    handleUp(index, row){
      console.log("当前行数据:");
      console.log(row);
      let resBody = new sort();
      resBody.data.OPERTYPE = 'up';
      resBody.data.DOTYPE = '1';
      resBody.data.TRANCODE = row.TRANCODE;
      resBody.data.SCENECODE = row.SCENECODE;
      resBody.data.SCENESEQ = row.SCENESEQ;
      request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.$message({
          type: 'success',
          message: '升序成功！'
        });
        this.queryTradeScenceInfo();
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
    },
    handleDown(index, row){
      console.log("当前行数据:");
      console.log(row)
      let resBody = new sort();
      resBody.data.OPERTYPE = 'down';
      resBody.data.DOTYPE = '1';
      resBody.data.TRANCODE = row.TRANCODE;
      resBody.data.SCENECODE = row.SCENECODE;
      resBody.data.SCENESEQ = row.SCENESEQ;
      request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.$message({
          type: 'success',
          message: '降序成功！'
        });
        this.queryTradeScenceInfo();
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
    },
    // 删除参数
    deleteScene() {
      this.$confirm('此操作将永久删除该条数据, 是否继续?', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        lockScroll: false
      }).then(() => {
        //执行删除操作：
        let resBody = new trandeManage();
        resBody.data.OPERTYPE = "3";
        resBody.data.TRANCODE = this.tradeSceneRowInfo.TRANCODE;
        resBody.data.SCENECODE = this.tradeSceneRowInfo.SCENECODE;
        resBody.data.SCENESEQ = this.tradeSceneRowInfo.SCENESEQ;
        resBody.data.MODORGNO = this.MODORGNO;
        resBody.data.MODUSER = this.MODUSER;
        request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.$message({
          type: 'success',
          message: '删除成功！'
        });
        this.queryTradeScenceInfo();
        // 删除后选中框置灰
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
  height: 575px;
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