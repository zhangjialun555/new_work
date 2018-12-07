<template>
	<div>
    <el-dialog title="新增交易场景" @open="openCollback" @close="closeDialog"
    :lock-scroll=false
    :visible.sync="isShow" width="1000px">
      <el-steps  :active="active" 
            align-center  style="margin-bottom:10px"
            finish-status="success">
        <el-step title="必要输入物料组"></el-step>
        <el-step title="场景物料组"></el-step>
        <el-step title="输出物料组"></el-step>
        <el-step title="场景信息"></el-step>
        <el-step title="确认"></el-step>
      </el-steps>
    <!-- 必要物料组选择 -->
    <div v-if="active===0">
        <el-card style="margin-bottom:10px;">
                 <el-form ref='matlGroupQuery' :model='matlGroupQuery'  size='mini' label-position="top">
                  <el-row :gutter="10">
                  <el-col  :lg="6" :md="8">
                    <el-form-item label='物料组名称'  prop='devNum'>
                      <el-input v-model='matlGroupQuery.MATLGROUPNAME'  
                        placeholder="请输入物料组名称" maxlength="50" ></el-input>
                    </el-form-item>
                  </el-col>  
                  <el-col  :lg="3" :md="4" class="searchBtnMarginTop">
                    <el-button type='primary' size='mini' icon='el-icon-search' @click="clickQueryAccuracyNecessaryMatlGroup()">查询</el-button>
                  </el-col>
                  <el-col  :lg="3" :md="4" class="searchBtnMarginTop">
                    <el-button type='warning' size='mini' icon='el-icon-refresh'
                    @click="resetForm()">重置</el-button>
                  </el-col>
                  <el-col  :lg="3" :md="4" class="searchBtnMarginTop">
                    <el-button type='warning' size='mini' icon='el-icon-plus'
                    @click="addMatlGroup()">添加</el-button>
                  </el-col>
                  </el-row>
                  <el-table :data="necessaryMatlGroup" 
                  header-row-class-name="tableHeaderClass"
                    border>
                      <el-table-column width="60">
                        <template slot-scope="scope">
                          <el-radio :label="scope.row.MATLGROUPID" :disabled="clickAble.clickAble1"
                          @change.native="getParamID(scope.$index, scope.row)"
                          v-model="necessaryMatlGroupId">{{null}}</el-radio>
                        </template>
                      </el-table-column>
                      <!-- <el-table-column prop="MATLGROUPID" label="物料组ID"></el-table-column> -->
                      <el-table-column prop="MATLGROUPNAME" label="物料组名称"></el-table-column>
                      <el-table-column 
                      align="center"
                        width="160" label="详细信息" fixed="right">
                          <template slot-scope="scope">
                            <el-button type="text" size="mini"
                            @click="handleQueryParameter(scope.$index, scope.row)">查看</el-button>
                          </template>
                        </el-table-column>
                  </el-table>
                  <el-pagination
                    style="text-align: right; margin-top:20px;"
                    @current-change="handleCurrentChange1"
                    :current-page.sync="currpage1"
                    background
                    layout="sizes, total, prev, pager, next, jumper"
                    :total="TotalNum1">
                  </el-pagination>
                </el-form>
                </el-card>
                 <div slot="footer" class="dialog-footer" style="text-align:center;">
                  <!-- <el-button type="primary" size="mini" style="margin-top: 10px;" @click="step()">跳过</el-button> -->
                  <!-- <el-button type="primary" size="mini" style="margin-top: 10px;" @click="back()">上一步</el-button> -->
                  <el-button type="primary" size="mini" :disabled="nextStep.nextStep1" style="margin-top: 10px;" @click="next(0)">下一步</el-button>
                </div>
              </div>
              <!-- 附加输入 -->
    <div v-if="active===1">
        <el-card style="margin-bottom:10px;">
                 <el-form ref='matlGroupQuery' :model='matlGroupQuery'  size='mini' label-position="top">
                  <el-row :gutter="10">
                  <el-col  :lg="6" :md="8">
                    <el-form-item label='物料组名称'  prop='devNum'>
                      <el-input v-model='matlGroupQuery.MATLGROUPNAME'  
                        placeholder="请输入物料组名称"  maxlength="50"></el-input>
                    </el-form-item>
                  </el-col>  
                  <el-col  :lg="3" :md="4" class="searchBtnMarginTop">
                    <el-button type='primary' size='mini' icon='el-icon-search' @click="clickQueryAccuracyExtraMatlGroup()">查询</el-button>
                  </el-col>
                  <el-col  :lg="3" :md="4" class="searchBtnMarginTop">
                    <el-button type='warning' size='mini' icon='el-icon-refresh'
                    @click="resetForm()">重置</el-button>
                  </el-col>
                  <el-col  :lg="3" :md="4" class="searchBtnMarginTop">
                    <el-button type='warning' size='mini' icon='el-icon-plus'
                    @click="addMatlGroup('A')">添加</el-button>
                  </el-col>
                  </el-row>
                  <el-table :data="ExtraMatlGroup" 
                  header-row-class-name="tableHeaderClass"
                    border>
                      <el-table-column width="60">
                        <template slot-scope="scope">
                          <el-radio :label="scope.row.MATLGROUPID" :disabled="clickAble.clickAble2"
                          @change.native="getParamID(scope.$index, scope.row)"
                          v-model="extraMatlGroupId">{{null}}</el-radio>
                        </template>
                      </el-table-column>
                      <!-- <el-table-column prop="MATLGROUPID" label="物料组ID"></el-table-column> -->
                      <el-table-column prop="MATLGROUPNAME" label="物料组名称"></el-table-column>
                      <el-table-column 
                      align="center"
                        width="160" label="详细信息" fixed="right">
                          <template slot-scope="scope">
                            <el-button type="text" size="mini"
                            @click="handleQueryParameter(scope.$index, scope.row)">查看</el-button>
                          </template>
                        </el-table-column>
                  </el-table>
                  <el-pagination
                    style="text-align: right; margin-top:20px;"
                    @current-change="handleCurrentChange2"
                    :current-page.sync="currpage2"
                    background
                    layout="sizes, total, prev, pager, next, jumper"
                    :total="TotalNum2">
                  </el-pagination>
                </el-form>
                </el-card>
                 <div slot="footer" class="dialog-footer" style="text-align:center;">
                  <el-button type="primary" size="mini" style="margin-top: 10px;" @click="back(1)">上一步</el-button>
                  <el-button type="primary" size="mini" :disabled="nextStep.nextStep2" style="margin-top: 10px;" @click="next(1)">下一步</el-button>
                </div>
              </div>
              <!-- 输出物料组 -->
    <div v-if="active===2">
        <el-card style="margin-bottom:10px;">
                 <el-form ref='matlGroupQuery' :model='matlGroupQuery'  size='mini' label-position="top">
                  <el-row :gutter="10">
                  <el-col  :lg="6" :md="8">
                    <el-form-item label='物料组名称'  prop='devNum'>
                      <el-input v-model='matlGroupQuery.MATLGROUPNAME'  
                        placeholder="请输入物料组名称" maxlength="50" ></el-input>
                    </el-form-item>
                  </el-col>  
                  <el-col  :lg="3" :md="4" class="searchBtnMarginTop">
                    <el-button type='primary' size='mini' icon='el-icon-search' @click="clickQueryAccuracyOutMatlGroup()">查询</el-button>
                  </el-col>
                  <el-col  :lg="3" :md="4" class="searchBtnMarginTop">
                    <el-button type='warning' size='mini' icon='el-icon-refresh'
                    @click="resetForm()">重置</el-button>
                  </el-col>
                  <el-col  :lg="3" :md="4" class="searchBtnMarginTop">
                    <el-button type='warning' size='mini' icon='el-icon-plus'
                    @click="addMatlGroup('A')">添加</el-button>
                  </el-col>
                  </el-row>
                  <el-table :data="OutMatlGroup" 
                  header-row-class-name="tableHeaderClass"
                    border>
                      <el-table-column width="60">
                        <template slot-scope="scope">
                          <el-radio :label="scope.row.MATLGROUPID" :disabled="clickAble.clickAble3"
                          @change.native="getParamID(scope.$index, scope.row)"
                          v-model="outMatlGroupId">{{null}}</el-radio>
                        </template>
                      </el-table-column>
                      <!-- <el-table-column prop="MATLGROUPID" label="物料组ID"></el-table-column> -->
                      <el-table-column prop="MATLGROUPNAME" label="物料组名称"></el-table-column>
                      <el-table-column 
                      align="center"
                        width="160" label="详细信息" fixed="right">
                          <template slot-scope="scope">
                            <el-button type="text" size="mini"
                            @click="handleQueryParameter(scope.$index, scope.row)">查看</el-button>
                          </template>
                        </el-table-column>
                  </el-table>
                  <el-pagination
                    style="text-align: right; margin-top:20px;"
                    @current-change="handleCurrentChange3"
                    :current-page.sync="currpage3"
                    background
                    layout="sizes, total, prev, pager, next, jumper"
                    :total="TotalNum3">
                  </el-pagination>
                </el-form>
                </el-card>
                 <div slot="footer" class="dialog-footer" style="text-align:center;">
                  <el-button type="primary" size="mini" style="margin-top: 10px;" @click="back(2)">上一步</el-button>
                  <el-button type="primary" size="mini" style="margin-top: 10px;" :disabled="nextStep.nextStep3" @click="next(2)">下一步</el-button>
                </div>
              </div>
     <!-- 场景信息 -->
    <div v-if="active===3">
      <el-card style="margin-bottom:10px;">
        <el-form :model="tradeSceneInfo" ref="tradeSceneInfo" :rules="SceneRules"  size="mini" label-position="left" label-width="80px" >
          <el-row :gutter="10">
            <el-col :md="12" :lg="12">
               <el-form-item label="交易代码" prop="TRANCODE">
                <el-input v-model="tradeSceneInfo.TRANCODE"
                disabled
                placeholder="请输入交易代码"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="12">
              <el-form-item label="场景名称" prop="SCENECODENAME">
                <el-input v-model="tradeSceneInfo.SCENECODENAME"
                 :disabled="inputDisabled" maxlength="50"
                placeholder="请输入交易场景名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-row :gutter="10">
            <el-col :md="12" :lg="12">
              <el-form-item label="场景序号" prop="paramKey">
                <el-input v-model="tradeSceneInfo.SCENESEQ"
                :disabled="inputDisabled"
                placeholder="请输入场景序号"></el-input>
              </el-form-item>
            </el-col>
          </el-row> -->
        </el-form>
    	</el-card>  
        <div slot="footer" class="dialog-footer" style="text-align:center;">
          <el-button type="primary" size="mini" style="margin-top: 10px;" @click="back(3)">上一步</el-button>
          <el-button  type="primary" size="mini" style="margin-top: 10px;" 
          @click="next(3)">下一步</el-button>
        </div>
    </div>
    <!-- 确认物料组选择情况 -->
    <div v-if="active===4">
      <el-card style="margin-bottom:10px;">
        <span>请确认交易场景信息!</span><br><br>
        <el-form :model="tradeSceneInfo" ref="tradeSceneInfo"   size="mini" label-position="left" label-width="80px" >
          <el-row :gutter="10">
            <el-col :md="12" :lg="12">
               <el-form-item label="交易代码" >
                <el-input v-model="tradeSceneInfo.TRANCODE"
                 :disabled="inputDisabled"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="12">
              <el-form-item label="交易场景名称" prop="paramKey">
                <el-input v-model="tradeSceneInfo.SCENECODENAME"
                 :disabled="inputDisabled"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :md="12" :lg="12">
              <el-form-item label="维护机构" prop="paramKey">
                <el-input v-model="tradeSceneInfo.MODORGNO"
                :disabled="inputDisabled"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="12">
              <el-form-item label="维护用户" prop="paramKey">
                <el-input v-model="tradeSceneInfo.MODUSER"
                 :disabled="inputDisabled"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :md="12" :lg="12">
               <el-form-item label="必要输入物料组" >
                <el-input v-model="tradeSceneInfo.NECYINMATLGROUPID"
                 :disabled="inputDisabled"
                placeholder="无"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="12">
              <el-form-item label="附加输入物料组" prop="paramKey">
                <el-input v-model="tradeSceneInfo.INMATLGROUPID"
                 :disabled="inputDisabled"
                placeholder="无"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :md="12" :lg="12">
               <el-form-item label="输出物料组" >
                <el-input v-model="tradeSceneInfo.OUTMATLGROUPID"
                 :disabled="inputDisabled"
                placeholder="无"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
    	</el-card>  
        <div slot="footer" class="dialog-footer" style="text-align:center;">
          <el-button type="primary" size="mini" style="margin-top: 10px;" @click="back()">上一步</el-button>
          <el-button type="primary" size="mini" style="margin-top: 10px;" @click="cancel()">取 消</el-button>
          <el-button type="primary" size="mini" style="margin-top: 10px;"
          @click="tradeSceneAdd()">确 定</el-button>       
        </div>
    </div>
    </el-dialog>

    <!-- 弹窗 -->
  <component :is='dialogList.addMatlGroups' :rowData="rowVal" :option='dialogaddMatlGroups'></component>
  <component :is='dialogList.queryMatlGroupDetail' :paramObj="rowVal1" :option='dialogMatlGroupsDetail'></component>

	</div>
</template>

<script>
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
import TradeMatlGroupInfoQuery from "@/message/Tradingscenemanage/matlGroupsManager/TradeMatlGroupInfoQuery";
import queryMatlGroupDetail from "./queryMatlGroupDetail";
import addMatlGroups from "./addMatlGroups";
import trandeQuery from "@/message/Tradingscenemanage/TrandeScence/trandeQuery";
import trandeManage from "@/message/Tradingscenemanage/TrandeScence/trandeManage";
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
      currpage1: 1,
      currpage2: 1,
      currpage3: 1,
      pagerownum: 10,
      TotalNum1:0,
      TotalNum2:0,
      TotalNum3:0,
      // 页面号
      active:0,
      //页面
      currentName:'first',
      //物料组查询表单：
      matlGroupQuery:{
        MATLGROUPROS:'',//物料组性质
        MATLGROUPID:'',//物料组ID
        MATLGROUPNAME:'',//物料组名称
        MATLID:'',//物料ID
      },
      //按钮置灰：
      nextStep:{
        nextStep1:true,
        nextStep2:true,
        nextStep3:true
      },
      //是否可选
      clickAble:{
        clickAble1:true,
        clickAble2:true,
        clickAble3:true,
      },
      //三种物料组查询结果存储：
      necessaryMatlGroup:[],
      ExtraMatlGroup:[],
      OutMatlGroup:[],
      necessaryMatlGroupId:'',
      extraMatlGroupId:'',
      outMatlGroupId:'',
      //物料组信息表单
      matlGroupInfo:{
        MATLGROUPID:'',
        MATLGROUPNAME:'',
      },
      //存放传递给子组件的参数：包括：1.交易代码；2.物料组性质标识符：
      rowVal:{
        TRANCODE:'',
        MATLGROUPROS:'',
      } ,
      rowVal1:{},
      //定义维护结构：
      tradeSceneInfo:{
        OPERTYPE:'1',//操作类型
        TRANCODE:'',//交易代码
        SCENESEQ:'',//交易场景序号
        SCENECODE:'',//交易场景ID
        SCENECODENAME:'',//交易场景名称 
        INMATLGROUPID:'',//附加输入组ID
        OUTMATLGROUPID:'',//输出物料组ID
        NECYINMATLGROUPID:'',//必要输入物料组ID
        MODORGNO:'',//维护机构
        MODUSER:'',//维护用户  
      },
      // InfoShowForm:[],
      // 上传字段定义：
			multiple:'',
      movie:'',
      // 物料组性质下拉框选项；
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
      //凭证类型下拉框选项；
      options2: [{
          value: '选项1',
          label: '必要输入'
        }, {
          value: '选项2',
          label: '附加输入'
        }, {
          value: '选项3',
          label: '输出'
        }],
      paramValue: [], // 表格中的数据
      moveClass: false,
      inputDisabled: false,
      dialogList:{
        addMatlGroups,
        queryMatlGroupDetail
      },
      dialogaddMatlGroups:{
        isShow:false
      },
      dialogMatlGroupsDetail:{
        isShow1:false,
        type:'In'
      },
      SceneRules: {
        TRANCODE: [{ required: true, message: "请输入交易代码", trigger: "blur" }
        ],
        SCENECODENAME: [{ required: true, message: "请输入交易场景名称", trigger: "blur" }],
      },
      // },
      titleVal: "",
      sortable: null,
      oldList: [],
      newList: []
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
    step:{
      get: function() {
        return this.option.step;
      },
      set: function(newVal) {
        this.option.step = newVal;
      }
    },
    NecMatlGroupId: function() {
      return this.option.NecMatlGroupId;
    },
    InMatlGroupId: function() {
      return this.option.InMatlGroupId;
    },
    OutMatlGroupId: function() {
      return this.option.OutMatlGroupId;
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
    //确定维护机构和维护用户的值：
    getOrgnoInfo(){
      this.MODORGNO = this.$store.getters.branchId;
      this.MODUSER = this.$store.getters.userId;
    } , 
    clickQueryAccuracyNecessaryMatlGroup(){
      this.currpage1 = 1;
      this.queryAccuracyNecessaryMatlGroup();
    },
    clickQueryAccuracyExtraMatlGroup(){
      this.currpage1 = 1;
      this.queryAccuracyExtraMatlGroup();
    },
    clickQueryAccuracyOutMatlGroup(){
      this.currpage1 = 1;
      this.queryAccuracyOutMatlGroup();
    },
    //根据输入的“交易代码”查询每页物料组选项；==========>>>>模糊查询；
    //必要输入物料组；
    queryNecessaryMatlGroup(){
      console.log("queryNecessaryMatlGroup")
      let resBody = new TradeMatlGroupInfoQuery();
      resBody.data.TRANCODE = this.tradeSceneInfo.TRANCODE;
      resBody.data.MATLGROUPROS = "03";
      resBody.data.pageflag = this.pageflag;
      resBody.data.currpage = this.currpage1;
      resBody.data.pagerownum = this.pagerownum;
      request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.necessaryMatlGroup=response.RSP_BODY.struct ;
          this.TotalNum1 = parseInt(response.RSP_BODY.TotalNum);
          this.loading=false;
        } else {
          this.$message({
          message:response.SYS_HEAD.ReturnMessage ,
          type: 'error  '
          });
          this.necessaryMatlGroup = [];
          console.log(response);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      })
    },
    //附加输入物料组；
    queryExtraMatlGroup(){
      let resBody = new TradeMatlGroupInfoQuery();
      resBody.data.TRANCODE = this.tradeSceneInfo.TRANCODE;
      resBody.data.MATLGROUPROS = "01";
      resBody.data.pageflag = this.pageflag;
      resBody.data.currpage = this.currpage2;
      resBody.data.pagerownum = this.pagerownum;
      request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.ExtraMatlGroup=response.RSP_BODY.struct ;
          this.TotalNum2 = parseInt(response.RSP_BODY.TotalNum);
          this.loading=false;
        } else {
          this.$message({
          message:response.SYS_HEAD.ReturnMessage ,
          type: 'error  '
          });
          this.ExtraMatlGroup = [];
          console.log(response);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      })
    },
    //输出物料组；
    queryOutMatlGroup(){
      let resBody = new TradeMatlGroupInfoQuery();
      resBody.data.TRANCODE = this.tradeSceneInfo.TRANCODE;
      resBody.data.MATLGROUPROS = "02";
      resBody.data.pageflag = this.pageflag;
      resBody.data.currpage = this.currpage3;
      resBody.data.pagerownum = this.pagerownum;
      request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.OutMatlGroup=response.RSP_BODY.struct ;
          this.TotalNum3 = parseInt(response.RSP_BODY.TotalNum);
          this.loading=false;
        } else {
          this.$message({
          message:response.SYS_HEAD.ReturnMessage ,
          type: 'error  '
          });
          this.OutMatlGroup = [];
          console.log(response);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      })
    },
    // ================== 根据输入表单查询物料组详细信息 ================================
    //已经确定交易代码，和物料组性质参数，根据表单输入的值精准查询对应的物料组；
    //必要输入物料组；
    queryAccuracyNecessaryMatlGroup(){
      let resBody = new TradeMatlGroupInfoQuery();
      resBody.data.TRANCODE = this.tradeSceneInfo.TRANCODE;
      resBody.data.MATLGROUPROS = "03";
      resBody.data.MATLGROUPID = this.matlGroupQuery.MATLGROUPID;
      resBody.data.MATLGROUPNAME = this.matlGroupQuery.MATLGROUPNAME;
      resBody.data.MATLID = this.matlGroupQuery.MATLID;
      resBody.data.pageflag = this.pageflag;
      resBody.data.currpage = this.currpage1;
      resBody.data.pagerownum = this.pagerownum;
      request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.necessaryMatlGroup=response.RSP_BODY.struct ;
          this.TotalNum1 = parseInt(response.RSP_BODY.TotalNum);
          this.loading=false;
        } else {
          this.$message({
          message:response.SYS_HEAD.ReturnMessage ,
          type: 'error  '
          });
          this.necessaryMatlGroup = [];
          console.log(response);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      })
    },
    //附加输入物料组；
    queryAccuracyExtraMatlGroup(){
      let resBody = new TradeMatlGroupInfoQuery();
      resBody.data.TRANCODE = this.tradeSceneInfo.TRANCODE;
      resBody.data.MATLGROUPROS = "01";
      resBody.data.MATLGROUPID = this.matlGroupQuery.MATLGROUPID;
      resBody.data.MATLGROUPNAME = this.matlGroupQuery.MATLGROUPNAME;
      resBody.data.MATLID = this.matlGroupQuery.MATLID;
      resBody.data.pageflag = this.pageflag;
      resBody.data.currpage = this.currpage2;
      resBody.data.pagerownum = this.pagerownum;
      request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.ExtraMatlGroup=response.RSP_BODY.struct ;
          this.TotalNum2 = parseInt(response.RSP_BODY.TotalNum);
          this.loading=false;
        } else {
          this.$message({
          message:response.SYS_HEAD.ReturnMessage ,
          type: 'error  '
          });
          this.ExtraMatlGroup = [];
          console.log(response);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      })
    },
    //输出物料组；
    queryAccuracyOutMatlGroup(){
      let resBody = new TradeMatlGroupInfoQuery();
      resBody.data.TRANCODE = this.tradeSceneInfo.TRANCODE;
      resBody.data.MATLGROUPROS = "02";
      resBody.data.MATLGROUPID = this.matlGroupQuery.MATLGROUPID;
      resBody.data.MATLGROUPNAME = this.matlGroupQuery.MATLGROUPNAME;
      resBody.data.MATLID = this.matlGroupQuery.MATLID;
      resBody.data.pageflag = this.pageflag;
      resBody.data.currpage = this.currpage3;
      resBody.data.pagerownum = this.pagerownum;
      request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.OutMatlGroup=response.RSP_BODY.struct ;
          this.TotalNum3 = parseInt(response.RSP_BODY.TotalNum);
          this.loading=false;
        } else {
          this.$message({
          message:response.SYS_HEAD.ReturnMessage ,
          type: 'error  '
          });
          this.OutMatlGroup = [];
          console.log(response);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      })
    },
    //清空表单
    resetForm(){
      //表单内容置零
      this.matlGroupQuery={};
    },
    // 查看当前行物料组详情信息
    handleQueryParameter(index, row) {
      //打开详细信息弹窗
      this.rowVal1 = row;
      this.dialogMatlGroupsDetail.isShow1 = true;
      if(this.active === 3){
        this.dialogMatlGroupsDetail.type = 'Out';
      }else{
        this.dialogMatlGroupsDetail.type = 'In';
      }
      console.log("当前行获取到的信息：")
      console.log(this.rowVal1);
      
    },
    //添加新物料组
    addMatlGroup(){
      this.dialogaddMatlGroups.isShow=true;
    },
    //添加交易信息
    tradeSceneAdd(){
      let resBody = new trandeManage();
      resBody.data.OPERTYPE = "1";
      resBody.data.TRANCODE = this.tradeSceneInfo.TRANCODE;
      // resBody.data.SCENESEQ = this.tradeSceneInfo.SCENESEQ;
      resBody.data.SCENECODENAME = this.tradeSceneInfo.SCENECODENAME;
      resBody.data.NECYINMATLGROUPID = this.tradeSceneInfo.NECYINMATLGROUPID;
      resBody.data.INMATLGROUPID = this.tradeSceneInfo.INMATLGROUPID;
      resBody.data.OUTMATLGROUPID = this.tradeSceneInfo.OUTMATLGROUPID;
      resBody.data.MODORGNO = this.MODORGNO;
      resBody.data.MODUSER = this.MODUSER;
      request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.$message({
          message: '创建成功！',
          type: 'success'
        });
        this.$parent.queryTradeScenceInfo();
          this.tradeSceneInfo.SCENECODE=response.RSP_BODY.SCENECODE;
          // console.log("获取到的返回体：");
          // console.log(response.RSP_BODY);
          // console.log("创建成功，生成的交易场景ID为：");
          // console.log(this.tradeSceneInfo.SCENECODE);
          this.option.isShow = false;
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
    openCollback(){
      console.log("当前获取到的参数:");
      console.log(this.rowData);
      console.log(this.option);
      this.tradeSceneInfo.TRANCODE = this.rowData.TRADECODE;
      this.tradeSceneInfo.SCENECODENAME = '';
      this.queryNecessaryMatlGroup();
      this.queryExtraMatlGroup();
      this.queryOutMatlGroup();
      if(this.option.step === 0){
        this.active = 1 
        this.necessaryMatlGroupId = this.option.NecMatlGroupId;
        this.tradeSceneInfo.NECYINMATLGROUPID = this.option.NecMatlGroupId;
        this.nextStep.nextStep1 = false;
        this.clickAble.clickAble2 = false;
        this.clickAble.clickAble3 = false;
      }else if(this.option.step === 1){
        this.active = 2
        this.clickAble.clickAble3 = false;
        this.necessaryMatlGroupId = this.option.NecMatlGroupId;
        this.tradeSceneInfo.NECYINMATLGROUPID = this.option.NecMatlGroupId;
        this.nextStep.nextStep1 = false;
        this.extraMatlGroupId = this.option.InMatlGroupId;
        this.tradeSceneInfo.INMATLGROUPID = this.option.InMatlGroupId;
        this.nextStep.nextStep2 = false;
      }else if(this.option.step === 2){
        this.active = 3
        this.necessaryMatlGroupId = this.option.NecMatlGroupId;
        this.tradeSceneInfo.NECYINMATLGROUPID = this.option.NecMatlGroupId;
        this.nextStep.nextStep1 = false;
        this.extraMatlGroupId = this.option.InMatlGroupId;
        this.tradeSceneInfo.INMATLGROUPID = this.option.InMatlGroupId;
        this.nextStep.nextStep2 = false;
        this.outMatlGroupId = this.option.OutMatlGroupId;
        this.tradeSceneInfo.OUTMATLGROUPID = this.option.OutMatlGroupId;
        this.nextStep.nextStep3 = false;
      }else{
        this.rowVal.TRANCODE = this.tradeSceneInfo.TRANCODE;
        this.rowVal.MATLGROUPROS = "03";
        this.active = 0;
        this.clickAble.clickAble1 = false;
        this.clickAble.clickAble2 = false;
        this.clickAble.clickAble3 = false;
      }
    },
    cancel(){
      this.option.isShow = false;
      this.active = 0;
      this.tradeSceneInfo = {};
       this.inputDisabled=false;

    },
    step(){
       this.$confirm('此操作将跳过添加必要输入物料组, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.queryExtraMatlGroup();
          this.active++;
          this.rowVal.TRANCODE = this.tradeSceneInfo.TRANCODE;
          this.rowVal.MATLGROUPROS = "01";
          this.$message({
            type: 'success',
            message: '已跳过必要输入物料组维护!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消!'
          });          
        });
    },
    handleCurrentChange1(val) {
      this.currpage1=val
      console.log(`当前页: ${val}`);
      this.queryNecessaryMatlGroup();
    },
    handleCurrentChange2(val) {
      this.currpage2=val
      console.log(`当前页: ${val}`);
      this.queryExtraMatlGroup();
    },
    handleCurrentChange3(val) {
      this.currpage3=val
      console.log(`当前页: ${val}`);
      this.queryOutMatlGroup();
    },
    //根据不同的页面，进入时执行查询操作，直接初始化选择列表；
    next(val){
      if(val===0){
        this.queryExtraMatlGroup();
        this.active++;
        this.rowVal.TRANCODE = this.tradeSceneInfo.TRANCODE;
        this.rowVal.MATLGROUPROS = "01";
        this.matlGroupQuery = {}
      }
        if(val===1){
        this.queryOutMatlGroup();
        this.rowVal.TRANCODE = this.tradeSceneInfo.TRANCODE;
        this.rowVal.MATLGROUPROS = "02";
        this.active++;
        this.matlGroupQuery = {}
        }
        if(val===2){
          this.active++;
          console.log("this.tradeSceneInfo");
          console.log(this.tradeSceneInfo);
          //给展示界面的维护机构和维护用户赋值；
          this.tradeSceneInfo.MODORGNO = this.MODORGNO;
          this.tradeSceneInfo.MODUSER = this.MODUSER;
          // this.rowVal.TRANCODE = this.tradeSceneInfo.TRANCODE;
          // this.rowVal.MATLGROUPROS = "02";
        }
        if(val === 3 ){
          this.$refs['tradeSceneInfo'].validate((valid) => {
          if (valid) {
            this.active++;
            this.inputDisabled=true;
            // this.rowVal.TRANCODE = this.tradeSceneInfo.TRANCODE;
            // this.rowVal.MATLGROUPROS = "03";
          } else {
            console.log('error submit!!');
            return false;
          }
        });
        }
    },
    back(val){
      if(val === 1){
        this.rowVal.TRANCODE = this.tradeSceneInfo.TRANCODE;
        this.rowVal.MATLGROUPROS = "03";
      }else if(val === 2 ){
        this.rowVal.TRANCODE = this.tradeSceneInfo.TRANCODE;
        this.rowVal.MATLGROUPROS = "01";
      }else if(val === 3){
        this.rowVal.TRANCODE = this.tradeSceneInfo.TRANCODE;
        this.rowVal.MATLGROUPROS = "02";
      }else{
        
      }
        this.active--;
        if(this.active===0){
          this.inputDisabled=false;
        }
    },
    // 表格选中获取参数ID
    getParamID(scope, val) {
      //根据界面选择获取不同的参数；
      if(this.active===0){
        console.log("当前获取到的必要输入组ID：")
        console.log(val);
        this.nextStep.nextStep1 = false;
        this.tradeSceneInfo.NECYINMATLGROUPID = val.MATLGROUPID;
      };
      if(this.active===1){
        console.log("当前获取到的附加输入物料组ID：")
        console.log(val);
        this.nextStep.nextStep2 = false;
        this.tradeSceneInfo.INMATLGROUPID = val.MATLGROUPID;
      }
      if(this.active===2){
        console.log("当前获取到的输出物料组ID：")
        console.log(val);
        this.nextStep.nextStep3 = false;
        this.tradeSceneInfo.OUTMATLGROUPID = val.MATLGROUPID;
      }
      
      // if(val) {   //////////////////////////////////暂时还有问题
      //   this.BtnGroup1.deleteBtn = false
      //   this.BtnGroup1.editBtn = false
      //   this.BtnGroup1.bindBtn = false
      //   this.BtnGroup1.setBtn = false
    },
    closeDialog() {
      this.active=0;
      this.inputDisabled=false;
      this.option.NecMatlGroupId = '';
      this.option.InMatlGroupId = '';
      this.option.OutMatlGroupId = '';
      this.necessaryMatlGroupId = '';
      this.extraMatlGroupId = '';
      this.outMatlGroupId = '';
      this.clickAble.clickAble1 = true;
      this.clickAble.clickAble2 = true;
      this.clickAble.clickAble3 = true;
      this.$parent.queryTradeGroupInfo();
      // this.$nextTick(() => {
      //   this.$refs["tradeSceneInfo"].clearValidate();
      // });
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
