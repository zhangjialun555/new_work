<template>
	<div>
    <el-dialog title="已有模式" @open="openCollback" @close="closeDialog"
    :lock-scroll=false
    :visible.sync="isShow" width="1000px">
      <el-steps  :active="active" 
            align-center  style="margin-bottom:10px"
            finish-status="success">
        <el-step title="选择物料"></el-step>
        <el-step title="模式维护"></el-step>
        <!-- <el-step title="确认信息"></el-step> -->
      </el-steps>
      <!-- 物料信息 -->
      <div v-if="active===1">
        <el-card style="margin-bottom:10px;">
                  <el-table :data="matlQueryReasult" 
                  header-row-class-name="tableHeaderClass"
                    border> 
                      <el-table-column width="60" fixed="left">
                        <template slot-scope="scope" >
                          <el-radio :label="scope.row.MATLID"
                          @change.native="getInMatlID(scope.$index, scope.row)"
                          v-model="matlQueryReasult.MATLID">{{null}}</el-radio>
                        </template>
                        </el-table-column>
                      <el-table-column prop="MATLTYPE" :formatter="matlTypeFormat"  label="物料类型"></el-table-column>
                      <el-table-column prop="MATLNAME" label="物料名称"></el-table-column>
                  </el-table>
                </el-card>
                <div slot="footer" class="dialog-footer" style="text-align:center;">
                  <el-button type="primary" size="mini" style="margin-top: 10px;" :disabled="isNext" @click="nextStep()">下一步</el-button>
                </div>
              </div> 
    <!-- 绑定收审模式 -->
    <div v-if="active===2">
        <el-card style="margin-bottom:10px;">
                  <!-- 输入组表格 -->
                  <el-table :data="CollModelInfo" key="In"
                  v-if="tableType=='In'"
                  header-row-class-name="tableHeaderClass"
                    border>
                    <el-table-column width="60" fixed="left">
                        <template slot-scope="scope" >
                          <el-radio :label="scope.row.COLLMODE"
                          @change.native="getModel(scope.$index, scope.row)"
                          v-model="CollModelInfo.COLLMODE">{{null}}</el-radio>
                        </template>
                        </el-table-column>
                      <!-- <el-table-column  prop="MODORGNO" label="维护机构"></el-table-column>
                      <el-table-column prop="MODUSER" label="维护用户"></el-table-column>    -->
                      <el-table-column prop="COLLMODE" :formatter="collModeFormat" label="收取模式"></el-table-column>
                      <el-table-column prop="COLLANDAUDTMODE" :formatter="collAndAudtModeFormat" label="审核模式"></el-table-column>
                      <!-- <el-table-column prop="MODTIME" label="维护时间"></el-table-column>
                      <el-table-column prop="MODDATE" label="维护日期"></el-table-column> -->
                      </el-table>
                  <!-- 输出组表格 -->
                  <el-table :data="DeliverModelInfo" key="Out"
                  v-if="tableType=='Out'"
                  header-row-class-name="tableHeaderClass"
                    border>
                      <el-table-column width="60" fixed="left">
                        <template slot-scope="scope" >
                          <el-radio :label="scope.row.DELIVERMODE"
                          @change.native="getModel(scope.$index, scope.row)"
                          v-model="DeliverModelInfo.DELIVERMODE">{{null}}</el-radio>
                        </template>
                        </el-table-column>
                      <!-- <el-table-column  prop="MODORGNO" label="维护机构"></el-table-column>
                      <el-table-column prop="MODUSER" label="维护用户"></el-table-column>    -->
                      <el-table-column prop="DELIVERMODE" :formatter="deliverModeFormat" label="交付模式"></el-table-column>
                      <el-table-column prop="DELIVERCFMODE" :formatter="deliverConfModeFormat" label="交付确认模式"></el-table-column>
                      <el-table-column prop="DELIVERTYPE" :formatter="deliverTypeFormat" label="隔日交付机构"></el-table-column>
                      <!-- <el-table-column prop="MODTIME" label="维护时间"></el-table-column>
                      <el-table-column prop="MODDATE" label="维护日期"></el-table-column> -->
                  </el-table>
                </el-card>
                 <div slot="footer" class="dialog-footer" style="text-align:center;">
                  <el-button type="primary" size="mini" style="margin-top: 10px;" @click="delModel()">删除</el-button>
                  <el-button type="primary" size="mini" style="margin-top: 10px;" @click="addModelDialog()">添加</el-button>
                </div>
              </div>
    </el-dialog>
    <!-- 添加模式弹窗 -->
    <el-dialog title="添加模式"  @close="closeModelDialog"
    :lock-scroll=false
    :visible.sync="isShow2" width="1000px">
      <!-- 场景信息 -->
      <span>注意:添加新的维护模式将会覆盖掉原有模式，请谨慎操作!</span><br><br>
      <el-card style="margin-bottom:10px;">
                  <!-- 输入组表格 -->
                  <el-table :data="AllCollModelInfo" key="InModel"
                  v-if="tableType2=='InModel'"
                  header-row-class-name="tableHeaderClass"
                  @selection-change="handleSelectionModel"
                    border>
                      <el-table-column
                        type="selection"
                        width="60">
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
                  <el-table :data="AllDeliverModelInfo" key="OutModel"
                  v-if="tableType2=='OutModel'"
                  header-row-class-name="tableHeaderClass"
                  @selection-change="handleSelectionModel"
                    border>
                      <el-table-column
                        type="selection"
                        width="60">
                      </el-table-column>
                      <!-- <el-table-column fixed prop="MODORGNO" label="维护机构"></el-table-column>
                      <el-table-column prop="MODUSER" label="维护用户"></el-table-column>    -->
                      <el-table-column prop="DELIVERMODE" :formatter="deliverModeFormat" label="交付模式"></el-table-column>
                      <el-table-column prop="DELIVERCFMODE" :formatter="deliverConfModeFormat" label="交付确认模式"></el-table-column>
                      <el-table-column prop="DELIVERTYPE"  :formatter="deliverTypeFormat"  label="隔日交付机构"></el-table-column>
                      <!-- <el-table-column prop="MODTIME" label="维护时间"></el-table-column>
                      <el-table-column prop="MODDATE" label="维护日期"></el-table-column> -->
                  </el-table>
                </el-card>
                 <div slot="footer" class="dialog-footer" style="text-align:center;">
                  <el-button type="primary" size="mini" style="margin-top: 10px;" @click="addModel()">添加</el-button>
                </div>
    </el-dialog>
	</div>
</template>

<script>
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
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
      //页面
      isShow2:false,
      currentName:'first',
      isNext:true,
      //枚举值
      collMode:getGlobalParams.get("collMode"),
      collAndAudtMode:getGlobalParams.get("collAndAudtMode"),
      deliverMode:getGlobalParams.get("deliverMode"),
      deliverConfMode:getGlobalParams.get("deliverConfMode"),
      deliverType:getGlobalParams.get("deliverType"),
      matlType:getGlobalParams.get("matlType"),
      //定义维护结构：
      //物料查询表单：
      matlQuery:{
        MATLTYPE:'',//物料类型
        MATLID:'',//物料ID
        MATLNAME:'',//物料名称
        MATLENNAME:'',//英文简称
      },
      //存放查询到该物料的所有模式信息
      AllDeliverModelInfo:[],
      AllCollModelInfo:[],
      matlManageInfo:{
         //物料维护
        MATLTYPE:'', //物料类型
        MATLID:'',//物料ID
        VOUNUM:'',//凭证数量
        MODORGNO:'',//维护机构
        MODUSER:'',//维护用户
      },
      tableType:'In',
      tableType2:'InModel',
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
      matlModelInfo:[],//存放当前选中模式信息；
      CollModelInfo:[],
      addMatlModel:[],
      DeliverModelInfo:[],
      //输入模拟信息;
			InMatlResult:[
				{
					MATLTYPE:"现金输入",
					MATLID:'0001',
          VOUNUM:'15',
          MODORGNO:'西安银行',
          MODUSER:'李佳诚',
				},
				{
					MATLTYPE:"现金输入",
					MATLID:'0002',
          VOUNUM:'10',
          MODORGNO:'北京银行',
          MODUSER:'佳诚',
        },
        {
					MATLTYPE:"信用卡卡",
					MATLID:'0003',
          VOUNUM:'2',
          MODORGNO:'浦发银行',
          MODUSER:'李四',
				},
      ],
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
    //枚举值转换：
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
    openCollback(){
      this.queryAllMatl();
      // this.matlQuery=this.rowData;
      // this.matlQueryReasult=this.InMatlResult;
      // this.CollModelInfo=this.testCollInfo;
      // this.DeliverModelInfo = this.testDeliverInfo;
    },
    //查询当前物料组所有物料信息：
    queryAllMatl(){
        let resBody = new TradeMatlGroupInfoQuery();
        resBody.data.TRANCODE = this.rowData.TRANCODE;
        resBody.data.MATLGROUPROS = this.rowData.MATLGROUPROS;
        resBody.data.MATLGROUPID = this.rowData.MATLGROUPID;
        resBody.data.MATLGROUPNAME = this.rowData.MATLGROUPNAME;
        resBody.data.pageflag = this.pageflag;
        resBody.data.currpage = this.currpage;
        resBody.data.pagerownum = this.pagerownum;
        request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.matlQueryReasult=response.RSP_BODY.struct[0].MATLDATA;
          this.loading=false;
          console.log("成功读取物料组物料信息：");
          console.log(response.RSP_BODY.struct[0].MATLDATA);
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
    //获取当前选择的物料相关信息；
    getInMatlID(scope, val) {
      this.matlManageInfo = val;
      this.isNext = false;
      console.log("当前物料信息:")
      console.log(this.matlManageInfo);
    },
    //获取选定物料的模式信息；
    getModel(scope, val){
      this.matlModelInfo = val;
      console.log("当前模式信息:")
      console.log(this.matlModelInfo);
    },
    //查询选定物料的模式；
    queryModel(){
      // 根据选定物料组类型决定调用的接口
      if(this.rowData.MATLGROUPROS==="02"){
        this.tableType ="Out";
        let resBody = new OutMatlGroupModelQuery();
        resBody.data.TRANCODE = this.rowData.TRANCODE;
        resBody.data.MATLGROUPID = this.rowData.MATLGROUPID;
        resBody.data.MATLID = this.matlManageInfo.MATLID;
        resBody.data.DELIVERMODE = "";
        resBody.data.DELIVERCFMODE = "";
        resBody.data.pageflag = this.pageflag;
        resBody.data.currpage = this.currpage;
        resBody.data.pagerownum = this.pagerownum;
        request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.DeliverModelInfo=response.RSP_BODY.struct;
          console.log("成功读取交付模式信息：");
          console.log(this.DeliverModelInfo);
        } else {
          console.log(response.RSP_BODY);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      });
      }else{
        this.tableType ="In";
        let resBody = new InMatlGroupModelQuery();
        resBody.data.TRANCODE = this.rowData.TRANCODE;
        resBody.data.MATLGROUPID = this.rowData.MATLGROUPID;
        resBody.data.MATLID = this.matlManageInfo.MATLID;
        resBody.data.COLLMODE = "";
        resBody.data.COLLANDAUDTMODE = "";
        resBody.data.pageflag = this.pageflag;
        resBody.data.currpage = this.currpage;
        resBody.data.pagerownum = this.pagerownum;
        request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.CollModelInfo=response.RSP_BODY.struct;
          console.log("成功读取收核模式信息：");
          console.log(this.CollModelInfo);
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
    closeDialog() {
      this.active=1;
      // this.$nextTick(() => {
      //   this.$refs["tempRules"].clearValidate();
      // });
    },
    //查询物料可绑定所有模式：
    queryAllModel(){
      if(this.rowData.MATLGROUPROS==="02"){
        this.tableType2="OutModel"
          let resBody = new OutMatlDeliverModelQuery();
          resBody.data.MATLID = this.matlManageInfo.MATLID;
          resBody.data.pageflag = this.pageflag;
          resBody.data.currpage = this.currpage;
          resBody.data.pagerownum = this.pagerownum;
          request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          console.log("交付模式查询成功！")
          this.AllDeliverModelInfo =response.RSP_BODY.struct;
        } else {
          console.log(response);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      })
      }else{
        this.tableType2="InModel"
          let resBody = new InMatCollModelQuery();
          resBody.data.MATLID = this.matlManageInfo.MATLID;
          resBody.data.pageflag = this.pageflag;
          resBody.data.currpage = this.currpage;
          resBody.data.pagerownum = this.pagerownum;
          request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          console.log("收审模式查询成功！")
          this.AllCollModelInfo=response.RSP_BODY.struct;
        } else {
          console.log(response);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      })
      }
    },
    //添加物料模式弹窗；
    addModelDialog(){
      this.isShow2 = true;//打开弹窗
      this.queryAllModel();
    },
    changeMatlModelInfo(){
      for(let i = 0;i<this.addMatlModel.length;i++){
        delete this.addMatlModel[i].MODDATE;
        delete this.addMatlModel[i].MODTIME;
        this.addMatlModel[i].MODORGNO = this.MODORGNO;
        this.addMatlModel[i].MODUSER = this.MODUSER;
      }
      console.log("变更后的收核模式:");
      console.log(this.addMatlModel);
    },
    matlTypeFormat(row, column) {
      return this.matlType[row[column.property]];
    },
    //添加物料：根据物料组类型调用不同接口，添加完成后关闭弹窗
    addModel(){
      if(this.rowData.MATLGROUPROS==="02"){
        let resBody = new OutMatlGroupModel();
        resBody.data.OPERTYPE = "1";
        resBody.data.TRANCODE = this.rowData.TRANCODE;
        resBody.data.MATLGROUPID = this.rowData.MATLGROUPID;
        resBody.data.MATLID = this.matlManageInfo.MATLID;
        resBody.data.MODORGNO = this.MODORGNO;
        resBody.data.MODUSER = this.MODUSER;
        this.changeMatlModelInfo();
        resBody.data.MATLGRPOUTPUTCFLIST = this.addMatlModel;
        request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.$message({
          message: '已成功添加交付模式！',
          type: 'success'
          });
          this.isShow2=false;
          this.queryModel();
          
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
        resBody.data.MATLGRPINPUTRCLIST = this.addMatlModel;
        request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.$message({
          message: '已成功添加收核模式模式！',
          type: 'success'
          });
          this.isShow2=false;
          this.queryModel();
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
      }
    },
    //删除选定的模式；
    delModel(){
      if(this.rowData.MATLGROUPROS==="02"){
        let resBody = new OutMatlGroupModel();
        resBody.data.OPERTYPE = "2";
        resBody.data.TRANCODE = this.rowData.TRANCODE;
        resBody.data.MATLGROUPID = this.rowData.MATLGROUPID;
        resBody.data.MATLID = this.matlManageInfo.MATLID;
        resBody.data.MODORGNO = this.MODORGNO;
        resBody.data.MODUSER = this.MODUSER;
        resBody.data.DELIVERMODE = this.matlModelInfo.DELIVERMODE;
        resBody.data.DELIVERCFMODE = this.matlModelInfo.DELIVERCFMODE;
        request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.$message({
          message: '已成功删除交付模式！',
          type: 'success'
          });
          this.isShow2=false;
          this.queryModel();
          
        } else {
          console.log(response.RSP_BODY);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      });
      }else{
        let resBody = new InMatlGroupModel();
        resBody.data.OPERTYPE = "2";
        resBody.data.TRANCODE = this.rowData.TRANCODE;
        resBody.data.MATLGROUPID = this.rowData.MATLGROUPID;
        resBody.data.MATLID = this.matlManageInfo.MATLID;
        resBody.data.MODORGNO = this.MODORGNO;
        resBody.data.MODUSER = this.MODUSER;
        resBody.data.COLLMODE = this.matlModelInfo.COLLMODE;
        resBody.data.COLLANDAUDTMODE = this.matlModelInfo.COLLANDAUDTMODE;
        request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.$message({
          message: '已成功删除收核模式！',
          type: 'success'
          });
          this.isShow2=false;
          this.queryModel();
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
    handleSelectionModel(val){
      this.addMatlModel=val;
      console.log("当前选择的模式信息为：")
      console.log(val);
    },
    closeModelDialog(){
      this.active=2;
      this.isShow2=false;
    },
  nextStep(){
      this.queryModel();
      this.active++;
    },
    finish(){
      //添加
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
