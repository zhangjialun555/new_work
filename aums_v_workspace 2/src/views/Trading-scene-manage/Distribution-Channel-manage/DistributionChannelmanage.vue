<template>
  <div class="type-info-manage" v-loading="loading" 
    element-loading-text="加载中。。。">
    <!-- <el-card style="overflow:visible"> -->
      <el-card  style="overflow:visible">
        <el-form size='mini' label-position="top" :model="DistributionChannelQuery">
        <el-row :gutter="10">
          <el-col  :lg="4" :md="6">
            <el-form-item label="渠道" size='mini' label-position="top">
              <el-select v-model="DistributionChannelQuery.CHANNELCODE" placeholder="请选择渠道类型">
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
            <el-form-item label="交易代码" size='mini' label-position="top">
              <el-input  size="mini"  placeholder="请输入交易代码" v-model="DistributionChannelQuery.TRANCODE">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col  :lg="4" :md="6">
            <el-form-item label="交易场景ID" >
              <el-input  size="mini"  placeholder="请输入交易场景ID" v-model="DistributionChannelQuery.SCENECODE">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col  :lg="2" :md="3" class="searchBtnMarginTop">
            <el-button type='primary' size='mini' icon='el-icon-search' @click="queryChannelInfo">查询</el-button>
          </el-col>
          <el-col  :lg="2" :md="3" class="searchBtnMarginTop">
            <el-button type='warning' size='mini' icon='el-icon-refresh'
            @click="resetForm('devInfoMgrQueryForm')">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-row :gutter="10">    
        <el-button type="primary" size="mini" 
        @click="handleChannelDialog" icon="el-icon-edit" >发布交易</el-button>
        <el-button type="primary" size="mini" :disabled="deleteBtn" 
        @click="deleteInMatl" icon="el-icon-edit" >删除</el-button>
      </el-row>
      <el-table
        :data="DistributionChannelInfo"
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
            prop="CHANNEL" label="渠道" :formatter="channelTypeFormat" width="145">
        </el-table-column>
        <el-table-column
            prop="TRANCODE" label="交易代码" width="180">
        </el-table-column>
        <!-- <el-table-column
            prop="SCENECODE" label="交易场景ID" width="150">
        </el-table-column> -->
        <el-table-column
            prop="SCENECODENAME" label="交易场景名称" width="290">
        </el-table-column>
        <el-table-column
            prop="MODORGNO" label="维护机构" width="160">
        </el-table-column>
          <el-table-column
            prop="MODUSER" label="维护用户" width="160">
        </el-table-column>
        <el-table-column
            prop="MODDATE" label="维护日期" width="150">
        </el-table-column>
        <el-table-column
            prop="MODTIME" label="维护时间" width="150">
        </el-table-column>
      </el-table>

      <el-pagination
        style="text-align: right; margin-top:20px;"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        background
        layout="sizes, total, prev, pager, next, jumper"
        :total="TotalNum">
      </el-pagination>
    <!-- </el-card> -->
    <!-- 弹框 -->
    <component ref="addPar" :is='dialogList.addScene' :rowData="rowVal" :option='dialogParameter'></component>
    <component :is='dialogList.queryParameterDetail' :paramObj="rowObj" :option='dialogQueryParameter'></component>
    <component :is='dialogList.EditScene' :rowData="rowVal" :option='dialogEditParameter'></component>
    <component :is='dialogList.DistributionChannel' :rowData="rowVal" :option='DistributionChannelDialog'></component>
      </el-card>
        
  </div>
</template>

<script>
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
import {
  addScene, 
  queryParameterDetail,
  EditScene,
  DistributionChannel
} from "./dialog";
import channelManage from "@/message/Tradingscenemanage/TrandeScence/channelManage";
import channelQuery from "@/message/Tradingscenemanage/TrandeScence/channelQuery";

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
      // 渠道查询
      DistributionChannelQuery:{
        CHANNELCODE:'C001',//渠道
        TRANCODE:'',//交易代码
        SCENECODE:''//交易场景ID
      },
      SCENECODE:'',//存放选中按钮
      channelType:getGlobalParams.get("channelType"),
      DistributionChannelInfo:[],
      options: [{
          value: 'C001',
          label: '远程柜台'
        }, {
          value: 'C002',
          label: '自助渠道'
        }, {
          value: 'C003',
          label: '自主渠道'
        }, {
          value: 'C004',
          label: '上门服务'
        }
          ],
      // 查询结果信息
      // DistributionChannelInfo:{
      //   CHANNELCODE:'',//渠道
      //   TRANCODE:'',//交易代码
      //   SCENECODE:'',//交易场景ID
      //   MODORGNO:'',//维护机构
      //   MODUSER:'' ,// 维护用户
      //   MODDATE:'' ,//维护日期
      //   MODTIME:'',//维护时间
      // },
      //物料组性质下拉框选项；
      //模拟数据：
      testInfo:[
        {
        CHANNELCODE:'远程柜台',//渠道
        TRANCODE:'A1212',//交易代码
        SCENECODE:'0000001',//交易场景ID
        SCENECODENAME:'跨境转账',
        MODORGNO:'西安银行',//维护机构
        MODUSER:'李四' ,// 维护用户
        MODDATE:'2018/08/25' ,//维护日期
        MODTIME:'08:00',//维护时间
      },
      {
        CHANNELCODE:'上门服务',//渠道
        TRANCODE:'A00003',//交易代码
        SCENECODE:'0000002',//交易场景ID
        SCENECODENAME:'退卡',
        MODORGNO:'北京银行',//维护机构
        MODUSER:'张三' ,// 维护用户
        MODDATE:'2018/07/26' ,//维护日期
        MODTIME:'12:00',//维护时间
      },
      ],
      rowObj: null,
      currentPage: 1,
      loading: false,
      deleteBtn: true,
      editBtn: true,
      addBtn:true,
      dialogList: {
        addScene,
        queryParameterDetail,
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
  },
  created() {
    this.getOrgnoInfo();//获取当前操作的维护机构和维护用户
    this.getChannelInfo();
  },
  methods: { 
    //确定维护机构和维护用户的值：
    getOrgnoInfo(){
      this.MODORGNO = this.$store.getters.branchId;
      this.MODUSER = this.$store.getters.userId;
    } , 
    channelTypeFormat(row, column) {
      return this.channelType[row[column.property]];
    },
    //取查询数据；
    getChannelInfo(){
      this.DistributionChannelInfo = [];
      let resBody = new channelQuery();
      resBody.data.CHANNEL = "C001";//默认查询远程柜台
      resBody.data.pageflag = this.pageflag;
      resBody.data.currpage = this.currpage;
      resBody.data.pagerownum = this.pagerownum;
      request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.DistributionChannelInfo=response.RSP_BODY.struct;
          this.TotalNum = parseInt(response.RSP_BODY.TotalNum);
          // this.loading=false;
        } else {
          console.log(response);
          this.DistributionChannelInfo = [];
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      })
    },  
    //提交查询表单
    queryChannelInfo(){
      this.DistributionChannelInfo = [];
      let resBody = new channelQuery();
      resBody.data.CHANNEL = this.DistributionChannelQuery.CHANNELCODE;
      resBody.data.TRANCODE = this.DistributionChannelQuery.TRANCODE;
      resBody.data.SCENECODE = this.DistributionChannelQuery.SCENECODE;
      resBody.data.pageflag = this.pageflag;
      resBody.data.currpage = this.currpage;
      resBody.data.pagerownum = this.pagerownum;
      request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.DistributionChannelInfo=response.RSP_BODY.struct;
          // this.loading=false;
        } else {
          console.log(response);
          this.DistributionChannelInfo = [];
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
      this.DistributionChannelQuery={};
      this.currpage = 1;
      this.getChannelInfo();
    },
    //删除；
    delete(){
      console.log("删除");
    },
    //发布渠道
    DistributionChannel(){
      //此处打开发布渠道弹窗
    },
    handleCurrentChange(val) {
      this.currpage=val
      console.log(`当前页: ${val}`);
      this.getChannelInfo();
    },
    // 表格选中获取参数ID
    getParamID(scope, val) {
      this.rowVal = val;
      this.SCENECODE = val.SCENECODE;
      console.log("当前行数据：");
      console.log(this.rowVal);
      if(val) {   //////////////////////////////////暂时还有问题
        this.deleteBtn = false
        this.editBtn = false
        this.addBtn = false
      }
    },
    // 新增交易 弹框
    handleParameter(val) {
      this.dialogParameter.isShow = true;
      if (val === "add") {
        this.dialogParameter.isEdit = false;
      } else {
        this.dialogParameter.isEdit = true;
      }
    },
    //编辑交易 弹窗
    handleEditParameter(val) {
      this.dialogEditParameter.isShow = true;
    },
    // 渠道弹窗
    handleChannelDialog(val){
      this.DistributionChannelDialog.isShow = true;
    },
    // 删除
    deleteInMatl() {
      this.$confirm('此操作将永久删除该渠道下对应交易场景信息,是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
      let resBody = new channelManage();
      //删除操作接口后续需要更改;
      resBody.data.OPERTYPE = "2";//删除操作
      resBody.data.CHANNEL=this.rowVal.CHANNEL;
      resBody.data.TRANCODE=this.rowVal.TRANCODE;
      resBody.data.SCENECODE=this.rowVal.SCENECODE;
      resBody.data.MODORGNO = this.MODORGNO;
      resBody.data.MODUSER =this.MODUSER;
      request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.$message({
              type: 'success',
              message: '删除成功!'
     })
        } else {
          console.log("取消失败")
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
    // 查看当前行参数详情信息
    handleQueryParameter(index, row) {
      this.rowObj = row;
      this.dialogQueryParameter.isShow = true;
    },

    // 收核模式维护弹框
    handleBindingModel() {
      this.dialogBindingModel.isShow = true;
    },
    handleBindingModel1() {
      this.dialogBindingModel.isShow1 = true;
    },
    // 设定解除
    handleUntieDevice() {
      this.dialogUntieDevice.isShow = true;
    }


  }
};
</script>

<style scope lang="scss">
.type-info-manage {
  text-align: left;
}
</style>