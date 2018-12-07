<template>
	<div>
    <el-dialog title="新增物料组" @open="openCollback" @close="closeDialog"
    :lock-scroll=false
    :visible.sync="isShow" width="1000px">
      <el-steps v-if="MatlGroupsManageInfo.MATLGROUPROS === '02'" :active="active" 
            align-center  style="margin-bottom:10px"
            finish-status="success">
        <el-step title="概要信息"></el-step>
        <el-step title="选择物料"></el-step>
        <el-step title="额外信息"></el-step>
        <el-step title="绑定模式"></el-step>
      </el-steps>
      <el-steps v-else :active="active" 
            align-center  style="margin-bottom:10px"
            finish-status="success">
        <el-step title="概要信息"></el-step>
        <el-step title="选择物料"></el-step>
        <el-step title="绑定模式"></el-step>
      </el-steps>
      <!-- 概要信息 -->
    <div v-if="active===0">
      <el-card style="margin-bottom:10px;">
        <el-form :model="MatlGroupsManageInfo" ref="MatlGroupsManageInfo"  :rules="MatlGroupRules"  size="mini" label-position="left" label-width="80px" >
          <el-row :gutter="10">
            <el-col :md="12" :lg="12" >
               <el-form-item label="交易代码" label-width="100px" prop="TRANCODE">
                <el-input v-model="MatlGroupsManageInfo.TRANCODE"
                 disabled
                placeholder="请输入交易代码"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="12">
              <el-form-item label="物料组名称" prop="MATLGROUPNAME" label-width="100px">
                <el-input v-model="MatlGroupsManageInfo.MATLGROUPNAME"
                 :disabled="inputDisabled"
                placeholder="请输入物料组名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :md="12" :lg="12" >
               <el-form-item label="英文简称" label-width="100px" prop="MATLGROUPENNAME">
                <el-input v-model="MatlGroupsManageInfo.MATLGROUPENNAME"
                 :disabled="inputDisabled"
                placeholder="请输入交易代码"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="12">
               <el-form-item label="物料组性质" label-width="100px" prop="MATLGROUPROS">
                <el-select v-model="MatlGroupsManageInfo.MATLGROUPROS" disabled placeholder="请选择物料组性质">
                  <el-option
                    v-for="item in matlSelectType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :md="12" :lg="12">
              <el-form-item label="物料组描述" prop="MATLGROUPDSCP" label-width="100px">
                <el-input v-model="MatlGroupsManageInfo.MATLGROUPDSCP"
                 :disabled="inputDisabled"
                placeholder="请输入物料组描述"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
    	</el-card>  
        <div slot="footer" class="dialog-footer" style="text-align:center;">
          <el-button  type="primary" size="mini" style="margin-top: 10px;"
          @click="next('MatlGroupsManageInfo')">完成并添加物料</el-button>
          <el-button v-if="MatlGroupsManageInfo.MATLGROUPROS=== '02'"  type="primary" size="mini" style="margin-top: 10px;"
          @click="end('MatlGroupsManageInfo')">完成</el-button>
        </div>
    </div>
    <div v-if="active===1">
        <el-card style="margin-bottom:10px;">
                 <el-form ref='matlQuery' :model='matlQuery'  size='mini' label-position="top">
                  <el-row :gutter="10">
                  <el-col  :lg="6" :md="6">
                    <el-form-item label='物料类型'  prop='devNum'>
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
                    <el-form-item label='物料名称'  prop='devNum'>
                      <el-input v-model='matlQuery.MATLNAME'  
                      placeholder="请输入物料名称"  ></el-input>
                    </el-form-item>
                  </el-col> 
                  <el-col  :lg="6" :md="6">
                    <el-form-item label='物料英文简称'  prop='devNum'>
                      <el-input v-model='matlQuery.MATLENNAME'  
                      placeholder="请输入物料英文简称"  ></el-input>
                    </el-form-item>
                  </el-col> 
                  <el-col  :lg="2" :md="3" class="searchBtnMarginTop">
                    <el-button type='primary' size='mini' icon='el-icon-search' @click="queryMatl()">查询</el-button>
                  </el-col>
                  <el-col  :lg="2" :md="3" class="searchBtnMarginTop">
                    <el-button type='warning' size='mini' icon='el-icon-refresh'
                    @click="resetForm('A')">重置</el-button>
                  </el-col>
                  </el-row>
                  <el-table :data="matlQueryReasult" 
                  header-row-class-name="tableHeaderClass"
                    border>
                      <el-table-column width="50" fixed="left">
                        <template slot-scope="scope" >
                          <el-radio :label="scope.row.MATLID"
                          @change.native="getInMatlID(scope.$index, scope.row)"
                          v-model="matlQueryReasult.MATLID">{{null}}</el-radio>
                        </template>
                        </el-table-column>
                      <el-table-column prop="MATLTYPE" :formatter="matlTypeFormat" label="物料类型"></el-table-column>
                      <el-table-column prop="MATLNAME" label="物料名称"></el-table-column>
                      <el-table-column prop="MATLENNAME" label="英文简称"></el-table-column>
                      <el-table-column prop="CCY" label="币种"></el-table-column>
                      <!-- <el-table-column prop="VOUNUM" label="凭证类型"></el-table-column>
                      <el-table-column prop="MODORGNO" label="维护机构"></el-table-column>
                      <el-table-column prop="MODUSER" label="维护用户"></el-table-column> -->
                  </el-table>
                </el-form>
                </el-card>
                 <div slot="footer" class="dialog-footer" style="text-align:center;">
                  <el-button v-if="MatlGroupsManageInfo.MATLGROUPROS === '02'" type="primary" size="mini" style="margin-top: 10px;" :disabled="isNexted" @click="nextTip()">下一步</el-button>
                  <el-button type="primary" size="mini" style="margin-top: 10px;" :disabled="isNexted" @click="nextTip2()">下一步</el-button>
                </div>
              </div>
    <!-- 凭证类型和序号 -->
    <div v-if="active===2">
        <el-card style="margin-bottom:10px;">
          <el-form  label-position="left" label-width="80px" size='mini' ref='addInfo' :rules="MatlGroupRules" :model='addInfo'>
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
                  <el-button type="primary" size="mini" style="margin-top: 10px;" @click="addMatl('addInfo')">添加物料并绑定模式</el-button>
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
                      <!-- <el-table-column prop="VOUNUM" label="凭证数量"></el-table-column> -->
                      <!-- <el-table-column fixed prop="MODORGNO" label="维护机构"></el-table-column>
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
                      <el-table-column prop="DELIVERMODE" :formatter="deliverModeFormat" label="交付模式"></el-table-column>
                      <el-table-column prop="DELIVERCFMODE" :formatter="deliverConfModeFormat" label="交付确认模式"></el-table-column>
                      <el-table-column prop="DELIVERTYPE" :formatter="deliverTypeFormat" label="隔日交付机构"></el-table-column>
                      <!-- <el-table-column prop="MODTIME" label="维护时间"></el-table-column>
                      <el-table-column prop="MODDATE" label="维护日期"></el-table-column> -->
                  </el-table>
                </el-card>
                 <div slot="footer" class="dialog-footer" style="text-align:center;">
                  <!-- <el-button type="primary" size="mini" style="margin-top: 10px;" @click="again()">继续添加</el-button> -->
                  <el-button type="primary" size="mini" style="margin-top: 10px;" @click="finish()">完成</el-button>
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
import InMatCollModelQuery from "@/message/matlManage/InMatCollModelQuery";
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

import getGuid from "@/utils/getGuid";
import Sortable from "sortablejs";

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
      active:0,
      isSelectable:true,
      //页面
      isNexted:true,
      currentName:'first',
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
        VOUNUM:'',//凭证数量
      },  
      matlGroupId:'',//新建物料组时ID
      //物料组信息表单
      matlGroupInfo:{
        MATLGROUPID:'',
        MATLGROUPNAME:'',
      },
      matlType:getGlobalParams.get("matlType"),
      collMode:getGlobalParams.get("collMode"),
      collAndAudtMode:getGlobalParams.get("collAndAudtMode"),
      deliverMode:getGlobalParams.get("deliverMode"),
      deliverConfMode:getGlobalParams.get("deliverConfMode"),
      deliverType:getGlobalParams.get("deliverType"),
      CollModelInfo:[],
      DeliverModelInfo:[],
      //收审模式模拟：
      testCollInfo:[
        {
            MODORGNO: '一分行',
            MODUSER: '王小虎',
            COLLMODE: '网点人工柜台收取',
            COLLANDAUDTMODE: '机具审核',
            VOUNUM:'10',
            MODTIME:'16:30',
            MODDATE:'2018/08/25',
          }, {
            MODORGNO: '二分行',
            MODUSER: '王小龙',
            COLLMODE: '收取电子文档',
            COLLANDAUDTMODE: '电子审核',
            MODTIME:'18:30',
            VOUNUM:'15',
            MODDATE:'2018/09/26',
          }
      ],
      //交付模式模拟：
      testDeliverInfo:[
        {
            MODORGNO: '一分行',
            MODUSER: '王小虎',
            DELIVERMODE: '网点人工柜台收取',
            DELIVERCFMODE: '机具审核',
            DELIVERTYPE:'西安银行',
            VOUNUM:'10',
            MODTIME:'16:30',
            MODDATE:'2018/08/25',
          }, {
            MODORGNO: '二分行',
            MODUSER: '王小龙',
            DELIVERMODE: '收取电子文档',
            DELIVERCFMODE: '电子审核',
            DELIVERTYPE:'北京银行',
            MODTIME:'18:30',
            VOUNUM:'15',
            MODDATE:'2018/09/26',
          }
      ],
      //定义维护结构：
      MatlGroupsManageInfo:{
        //概要维护
        OPERTYPE:'',//操作类型
        TRANCODE:'',//交易代码
        MATLGROUPID:'',//物料组ID
        MATLGROUPNAME:'',//物料组名称
        MATLGROUPENNAME:'',//物料英文名称
        MATLGROUPDSCP:'',//物料组描述
        MATLGROUPROS:'',//物料组性质
        MODORGNO:'',//维护机构
        MODUSER:'',//维护用户 
      },
      matlManageInfoList:[],//存放循环信息
      matlManageModelInfoList:[],//存放每一个物料的收审模式；
      matlManageInfo:{
        //物料维护
        OPERTYPE:'',//操作类型
        TRANCODE:'',//交易代码
        MATLGROUPID:'',//物料组ID
        SERLNUM:'',//序号
        MATLTYPE:'', //物料类型
        MATLID:'',//物料ID
        VOUNUM:'',//凭证类型
        MODORGNO:'',//维护机构
        MODUSER:'',//维护用户
        matlModelInfo:[],//收审模式可绑定多个
        
      },
      //收审模式
      collModel:{
        OPERTYPE: '',
        TRANCODE: '',
        MATLGROUPID: '',
        MATLGROUPNAME: '',
        MATLGROUPDSCP: '',
        MATLGROUPROS: '',
        MODORGNO: '',
        MODUSER: ''
      },
      //交付模式：
      deliverModel:{
        OPERTYPE: '',
        TRANCODE: '',
        MATLGROUPID: '',
        MATLID: '',
        DELIVERMODE: '',
        DELIVERCFMODE: '',
        DELIVERTYPE: '',
        MODORGNO: '',
        MODUSER: ''
      },
      matlGroupInfoTable:[],//存放展示信息
      //物料模式维护：存放模式信息
      matlModelInfo:[],
      isShowCollModel:false,
      //表格区分标志：
      tableType:'',//In  输入；Out 输出
      // InfoShowForm:[],
      // 上传字段定义：
			multiple:'',
      movie:'',
      //物料信息模拟之后传入数据作为值：
      matlQueryReasult:[],
      multipleSelection:[],//选择项集合
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
      // dataRules: {},
      MatlGroupRules: {
        TRANCODE: [{ required: true, message: "请输入交易代码", trigger: "blur" }
        ],
        MATLGROUPNAME: [{ required: true, message: "请输入物料组名称", trigger: "blur" }],
        MATLGROUPENNAME: [{ required: true, message: "请输入物料组英文简称", trigger: "blur" }],
        MATLGROUPDSCP: [{ required: true, message: "请输入物料组描述", trigger: "blur" }],
        VOUNUM: [{ required: true, message: "请输入凭证数量", trigger: "blur" }],
        MATLGROUPROS: [{ required: true, message: "请选择物料组类型", trigger: "change" }],
      },
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
    matlTypeFormat(row, column) {
      return this.matlType[row[column.property]];
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
    next(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let resBody = new  matlGroupInfoManage();
        resBody.data.OPERTYPE = "1";
        resBody.data.TRANCODE = this.MatlGroupsManageInfo.TRANCODE;
        resBody.data.MATLGROUPNAME = this.MatlGroupsManageInfo.MATLGROUPNAME;
        resBody.data.MATLGROUPDSCP = this.MatlGroupsManageInfo.MATLGROUPDSCP;
        resBody.data.MATLGROUPROS = this.MatlGroupsManageInfo.MATLGROUPROS;
        resBody.data.MATLGROUPENNAME = this.MatlGroupsManageInfo.MATLGROUPENNAME;
        resBody.data.MODORGNO=this.MODORGNO;
        resBody.data.MODUSER=this.MODUSER; 
        request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
        //得到返回码中的物料组ID进行后续操作
        this.matlGroupId = response.RSP_BODY.MATLGROUPID;
        this.$message({
          message: '成功添加物料组概要信息，请进行物料添加操作！',
          type: 'success'
        });
        this.queryMatlList();//可以提前进行模糊查询
        this.active++;
        //先对添加类型进行判断，后续选择物料部分需要区分
        if(this.MatlGroupsManageInfo.MATLGROUPROS==="02"){
          //表格为输出组表格
          this.tableType="Out";
        }else{
          //表格为输入表格
          this.tableType="In";
        }
        } else {
          this.$message({
          message:response.SYS_HEAD.ReturnMessage ,
          type: 'error  '
          });
          console.log(response.SYS_HEAD.ReturnMessage);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    
    end(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let resBody = new  matlGroupInfoManage();
        resBody.data.OPERTYPE = "1";
        resBody.data.TRANCODE = this.MatlGroupsManageInfo.TRANCODE;
        resBody.data.MATLGROUPNAME = this.MatlGroupsManageInfo.MATLGROUPNAME;
        resBody.data.MATLGROUPDSCP = this.MatlGroupsManageInfo.MATLGROUPDSCP;
        resBody.data.MATLGROUPROS = this.MatlGroupsManageInfo.MATLGROUPROS;
        resBody.data.MATLGROUPENNAME = this.MatlGroupsManageInfo.MATLGROUPENNAME;
        resBody.data.MODORGNO=this.MODORGNO;
        resBody.data.MODUSER=this.MODUSER; 
        request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
        //得到返回码中的物料组ID进行后续操作
        this.matlGroupId = response.RSP_BODY.MATLGROUPID;
        this.$message({
          message: '成功添加物料组概要信息！',
          type: 'success'
        });
        this.$parent.queryOutMatlGroup();
        //先对添加类型进行判断，后续选择物料部分需要区分
        if(this.MatlGroupsManageInfo.MATLGROUPROS==="02"){
          //表格为输出组表格
          this.tableType="Out";
        }else{
          //表格为输入表格
          this.tableType="In";
        }
        } else {
          this.$message({
          message:response.SYS_HEAD.ReturnMessage ,
          type: 'error  '
          });
          console.log(response.SYS_HEAD.ReturnMessage);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      this.option.isShow=false;
    },
    queryMatlList(){
      //首选对所选物料组进行逻辑判断调用不同的接口：输入物料组查询输入物料；输出物料组查询输出物料；
      if(this.MatlGroupsManageInfo.MATLGROUPROS==="02"){
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
          this.loading=false;
          console.log("成功读取输出数据");
          console.log(response.RSP_BODY);
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
          this.loading=false;
          console.log("成功读取输入数据");
          console.log(response.RSP_BODY);
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
      })
      }
    },
    //精确查找物料信息：
    queryMatl(){
      //首选对所选物料组进行逻辑判断调用不同的接口：输入物料组查询输入物料；输出物料组查询输出物料；
      if(this.MatlGroupsManageInfo.MATLGROUPROS==="02"){
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
          this.loading=false;
          console.log("成功读取输出数据");
          console.log(response.RSP_BODY);
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
          this.loading=false;
          console.log("成功读取输入数据");
          console.log(response.RSP_BODY);
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
      })
      }
    },
    //清空表单
    resetForm(){
      //表单内容置零
      this.matlQuery={};
    },
    getInMatlID(scope, val) {
      //获取当前行参数；
      this.isNexted= false;
      this.matlManageInfo.MATLTYPE=val.MATLTYPE;
      this.matlManageInfo.MATLID=val.MATLID;
      this.matlManageInfo.VOUNUM=val.VOUNUM;
      this.matlManageInfo.MODORGNO=val.MODORGNO;
      this.matlManageInfo.MODUSER=val.MODUSER;
      console.log("当前物料信息:")
      console.log(this.matlManageInfo);
    },
    nextTip(){
      this.active++;
    },
    //如果是输入类型物料组则直接跳过额外信息步骤
    nextTip2(){
      let resBody = new InMatlGroupManage();
      delete resBody.data.SERLNUM;
      resBody.data.OPERTYPE = "1";//新增
      resBody.data.MATLGROUPID = this.matlGroupId;
      resBody.data.TRANCODE = this.MatlGroupsManageInfo.TRANCODE;
      resBody.data.MATLID = this.matlManageInfo.MATLID;
      // resBody.data.VOUNUM = this.addInfo.VOUNUM;
      resBody.data.MODORGNO = this.MODORGNO;
      resBody.data.MODUSER = this.MODUSER;
      request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.$message({
          message: '添加物料成功！请绑定收核模式！',
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
    //添加物料
    addMatl(formName){
       this.$refs[formName].validate((valid) => {
          if (valid) {
            //此处执行添加物料；并进行提示绑定对应的模式；
    //同样需要进行判断，向不同的物料组添加物料；
             if(this.MatlGroupsManageInfo.MATLGROUPROS==="02"){
      let resBody = new OutMatlGroupManage();
      resBody.data.OPERTYPE = "1";//新增
      resBody.data.MATLGROUPID = this.matlGroupId;
      resBody.data.TRANCODE = this.MatlGroupsManageInfo.TRANCODE;
      resBody.data.MATLID = this.matlManageInfo.MATLID;
      resBody.data.VOUNUM = this.addInfo.VOUNUM;
      resBody.data.MODORGNO = this.MODORGNO;
      resBody.data.MODUSER = this.MODUSER;
      request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.$message({
          message: '添加物料成功！请绑定交付模式！',
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
    }else{
      let resBody = new InMatlGroupManage();
      delete resBody.data.SERLNUM;
      resBody.data.OPERTYPE = "1";//新增
      resBody.data.MATLGROUPID = this.matlGroupId;
      resBody.data.TRANCODE = this.MatlGroupsManageInfo.TRANCODE;
      resBody.data.MATLID = this.matlManageInfo.MATLID;
      resBody.data.VOUNUM = this.addInfo.VOUNUM;
      resBody.data.MODORGNO = this.MODORGNO;
      resBody.data.MODUSER = this.MODUSER;
      request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.$message({
          message: '添加物料成功！请绑定收核模式！',
          type: 'success'
          });
          this.queryMatlModel();
          this.active++;
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
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    //进入模式页面时查询：
    queryMatlModel(){
      if(this.MatlGroupsManageInfo.MATLGROUPROS==="02"){
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
    finish(){
      //绑定收核模式完成；
      if(this.MatlGroupsManageInfo.MATLGROUPROS==="02"){
        let resBody = new OutMatlGroupModel();
        resBody.data.OPERTYPE = "1";
        resBody.data.TRANCODE = this.MatlGroupsManageInfo.TRANCODE;
        resBody.data.MATLGROUPID = this.matlGroupId;
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
          this.$parent.queryOutMatlGroup();
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
        resBody.data.TRANCODE = this.MatlGroupsManageInfo.TRANCODE;
        resBody.data.MATLGROUPID = this.matlGroupId;
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
          if(this.MatlGroupsManageInfo.MATLGROUPROS === '03'){
          this.$parent.queryNecessaryMatlGroup();
        }else if(this.MatlGroupsManageInfo.MATLGROUPROS === '01'){
          this.$parent.queryExtraMatlGroup();
        }
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
    // again(){
    //     this.active=1;
    //     this.matlGroupInfoTable.push(this.matlManageInfo);
    //     //清空当前表单
    //     this.matlManageInfo={};
    // },
    //提交绑定的收审模式
    // bindModel(){
    //   this.matlManageInfoList.push(this.matlManageInfo);
    //   this.matlManageInfo={};
    //   // console.log("成功添加当前信息");
    //   console.log("添加一个元素后当前长度：");
    //     console.log(this.matlManageInfoList.length);
    //   this.isShowCollModel=false;
    // },
    //获取到所选物料收审模式
    // handleSelectionChange(val) {
    //   this.matlManageInfo.matlModelInfo=val;
    //   },
    //模式绑定：
    handleSelectionModel(val){
      this.matlModelInfo = val;
      console.log("当前选定的收核模式:");
      console.log(this.matlModelInfo);
    },
    // 查看当前行参数详情信息
    handleQueryMatl(index, row) {
      //打开详细表单查看物料详细信息
      
      this.isShowCollModel=true;
    },
    //添加新物料组
    addMatlGroup(){

    },
    //初始化函数，根据父组件传递的参数赋值给：1.交易代码；2.物料组类型；
    initMatlGroupInfo(){
      this.MatlGroupsManageInfo.TRANCODE = this.rowData.TRANCODE;
      this.MatlGroupsManageInfo.MATLGROUPROS = this.rowData.MATLGROUPROS;
    },
    openCollback(){
      console.log("当前获取数据：",this.rowData)
      this.MatlGroupsManageInfo = {};//清空
      // this.matlManageInfo={};
      // this.matlGroupInfoTable=[];
      // console.log(this.rowData)
      // this.MatlGroupsManageInfo.TRANCODE = this.rowData.TRADECODE;
       this.initMatlGroupInfo();
      this.matlManageInfo={};
      this.matlGroupInfoTable=[];
    },
    step(){
       this.$confirm('此操作将跳过添加必要输入物料组, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.active++;
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
    closeDialog() {
      this.active=0;
      // this.MatlGroupsManageInfo = {};//清空
      this.$nextTick(() => {
        this.$refs["MatlGroupsManageInfo"].clearValidate();
      });
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
