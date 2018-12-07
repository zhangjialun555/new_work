<template>
  <div class="type-info-manage" v-loading="loading"
    element-loading-text="加载中。。。">
    <!-- <el-card style="overflow:visible"> -->
      <el-card  style="overflow:visible">
        <!-- <el-form size='mini' label-position="top" :model="tradeSceneQuery" >
        <el-row :gutter="10">
          <el-col  :lg="4" :md="6">
            <el-form-item label="交易代码" size='mini' label-position="top">
              <el-input  size="mini"  placeholder="请输入交易代码" v-model="tradeSceneQuery.TRANCODE">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col  :lg="4" :md="6">
            <el-form-item label="交易场景ID" >
              <el-input  size="mini"  placeholder="请输入交易场景ID" v-model="tradeSceneQuery.SCENECODE">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col  :lg="2" :md="3" class="searchBtnMarginTop">
            <el-button type='primary' size='mini' icon='el-icon-search' @click="queryTradeScenceInfo">查询</el-button>
          </el-col>
          <el-col  :lg="2" :md="3" class="searchBtnMarginTop">
            <el-button type='warning' size='mini' icon='el-icon-refresh'
            @click="resetForm()">重置</el-button>
          </el-col>
        </el-row>
      </el-form> -->
      <el-row :gutter="10">
        <!-- <el-col :sm='5' :lg='5'>
          <el-input v-model="search" size="mini" suffix-icon="el-icon-search" placeholder="请输入查询信息检索"></el-input>
        </el-col> -->
        <el-button type="primary" size="mini"
        icon="el-icon-plus"
        @click="HandleAddTailBox()">新增</el-button>
    
        <el-button type="primary" size="mini" 
        @click="HandleEditTailBox()" icon="el-icon-edit" >编辑</el-button>
    
        <el-button type="danger" size="mini" 
        icon="el-icon-delete" 
        @click="handleDelTailBxo()">删除</el-button>
      </el-row>
      <el-table
        :data="tradeSceneInfo"
        class="tableMarginTop"
        header-row-class-name="tableHeaderClass"
        border>
        <el-table-column width="50">
          <template slot-scope="scope">
            <el-radio :label="scope.row.SCENECODE"
            @change.native="getParamID(scope, scope.row)"
            v-model="tradeSceneInfo.SCENECODE">{{null}}</el-radio>
          </template>
        </el-table-column>
        <el-table-column
            prop="SCENESEQ" label="交易场景序号" width="80">
        </el-table-column>
        <el-table-column
            prop="TRANCODE" label="交易代码" width="80">
        </el-table-column>
        <el-table-column
            prop="SCENECODE" label="交易场景ID" width="80">
        </el-table-column>
        <el-table-column
            prop="SCENECODENAME" label="交易场景名称" width="80">
        </el-table-column>
        <el-table-column
            prop="INMATLGROUPID" label="输入物料组ID" width="80">
        </el-table-column>
          <el-table-column
            prop="INMATLGROUPNAME" label="输入物料组名称" width="80">
        </el-table-column>
        <el-table-column
            prop="OUTMATLGROUPID" label="输出物料组ID" width="80">
        </el-table-column>
        <el-table-column
            prop="OUTMATLGROUPNAME" label="输出物料组名称" width="80">
        </el-table-column>
        <el-table-column
            prop="NECYINMATLGROUPID" label="必要输入物料组" width="80">
        </el-table-column>
        <el-table-column
            prop="MODORGNO" label="维护机构" width="80">
        </el-table-column>
          <el-table-column
            prop="MODUSER" label="维护用户" width="80">
        </el-table-column>
        <el-table-column
            prop="MODDATE" label="维护日期" width="80">
        </el-table-column>
        <el-table-column
            prop="MODTIME" label="维护时间" width="80">
        </el-table-column>
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
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        background
        layout="sizes, total, prev, pager, next, jumper"
        :total="ParamTableData.length">
      </el-pagination>
    <!-- </el-card> -->
    <!-- 弹框 -->
    <component ref="addPar" :is='dialogList.deleteTailBox' :rowData="rowVal" :option='dialogdelParameter'></component>

    <component ref="addPar" :is='dialogList.addTailBox' :rowData="rowVal" :option='dialogParameter'></component>
    <component :is='dialogList.queryParameterDetail' :paramObj="rowObj" :option='dialogQueryParameter'></component>
    <component :is='dialogList.EditTailBox' :rowData="rowVal" :option='dialogEditParameter'></component>
      </el-card>
        
  </div>
</template>

<script>
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
import {
  addTailBox,
  queryParameterDetail,
  EditTailBox,
  deleteTailBox
} from "./dialog";
import spinnerDataQuery from '@/message/spinnerDataQuery/spinner-data-query';
import paramBaseinfoQuery from '@/message/parameterManage/param-baseinfo-query';
import paramDelete from '@/message/parameterManage/param-delete';
import toolBox from "@/utils/toolBox";

export default {
  data() {
    return {
      //物料组性质下拉框选项；
      //交易查询表单：
      tradeSceneQuery:{
        TRANCODE:'',//交易代码
        SCENECODE:'',//交易场景ID
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
      //模拟数据，后期传入查询值：
      testInfo:[
        {
          OPERTYPE:'',//操作类型
          TRANCODE:'A0001',//交易代码
          SCENESEQ:'1',//交易场景序号
          SCENECODE:'0001',//交易场景ID
          SCENECODENAME:'转账',//交易场景名称
          INMATLGROUPID:'A21321',//附加输入组ID
          INMATLGROUPNAME:'现金源',//附加输入名称
          OUTMATLGROUPNAME:'现金',//输出名称
          OUTMATLGROUPID:'A012123',//输出物料组ID
          NECYINMATLGROUPID:'A12314',//必要输入物料组ID
          MODORGNO:'西安银行',//维护机构
          MODUSER:'李四',//维护用户  
          MODDATE:'2018/08/27',//维护日期
          MODTIME:'18:00',//维护时间
        },
        {
          OPERTYPE:'',//操作类型
          TRANCODE:'B0001',//交易代码
          SCENESEQ:'2',//交易场景序号
          SCENECODE:'0002',//交易场景ID
          SCENECODENAME:'电子银行',//交易场景名称
          INMATLGROUPID:'A00001',//附加输入组ID
          INMATLGROUPNAME:'虚拟资产',//附加输入名称
          OUTMATLGROUPNAME:'比特币',//输出名称
          OUTMATLGROUPID:'A00003',//输出物料组ID
          NECYINMATLGROUPID:'A00005',//必要输入物料组ID
          MODORGNO:'北京银行',//维护机构
          MODUSER:'张三',//维护用户  
          MODDATE:'2018/08/17',//维护日期
          MODTIME:'8:00',//维护时间
        }
      ],
      search: "",
      rowObj: null,
      currentPage: 1,
      loading: false,
      deleteBtn: true,
      editBtn: true,
      bindBtn: true,
      setBtn:true,
      dialogList: {
        addTailBox,
        queryParameterDetail,
        EditTailBox,
        deleteTailBox
      },
      dialogParameter: {
        isShow: false,
        isEdit: false
      },
      dialogdelParameter:{
        isShow: false,
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
    this.queryTradeScenceInfo();
  },
  methods: {    
    //重置：
    resetForm(){
      //重置表单内容;
      this.tradeSceneQuery={};
    },
    //查询交易信息:
    queryTradeScenceInfo(){
      console.log("查询条件：");
      console.log(this.tradeSceneQuery);
      this.tradeSceneInfo = this.testInfo;
      console.log("查询结果：");
      console.log(this.tradeSceneInfo);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      // this.queryInfoList()
    },
    // 表格选中获取当前行参数
    getParamID(scope, val) {
      this.rowVal = val
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
    deleteScene() {
      this.$confirm('此操作将永久删除该条数据, 是否继续?', '系统提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        lockScroll: false
      }).then(() => {
        this.rowVal.OPERTYPE='3';
        console.log("删除信息为：");
        console.log(this.rowVal);
        // 删除后选中框置灰
        this.deleteBtn = true
        this.editBtn = true
        this.bindBtn = true
        this.setBtn = true
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 新增交易 弹框
    HandleAddTailBox(val) {
      this.dialogParameter.isShow = true;
      if (val === "add") {
        this.dialogParameter.isEdit = false;
      } else {
        this.dialogParameter.isEdit = true;
      }
    },
    handleDelTailBxo(){
      this.dialogdelParameter.isShow = true;
    },
    //编辑交易 弹窗
    HandleEditTailBox(val) {
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
}
</style>