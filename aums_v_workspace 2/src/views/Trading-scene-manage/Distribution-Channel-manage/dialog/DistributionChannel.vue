<template>
	<div>
    <el-dialog title="新增交易场景" @open="openCollback" @close="closeDialog"
    :lock-scroll=false
    :visible.sync="isShow" width="1000px">
      <el-steps  :active="active" 
            align-center  style="margin-bottom:10px"
            finish-status="success">
        <el-step title="选择场景"></el-step>
        <el-step title="选择渠道"></el-step>
      </el-steps>
      <!-- 选择交易场景 -->
    <div v-if="active===0">
        <el-card style="margin-bottom:10px;">
                 <el-form ref='tradeScenceQuery' :model='tradeScenceQuery'  size='mini' label-position="top">
                  <el-row :gutter="10">
                  <el-col  :lg="6" :md="8">
                    <el-form-item label='交易代码'  prop='devNum'>
                      <el-input v-model='tradeScenceQuery.TRANCODE'  
                        placeholder="请输入交易代码"  ></el-input>
                    </el-form-item>
                  </el-col>  
                  <el-col  :lg="6" :md="8">
                    <el-form-item label='场景ID'  prop='devNum'>
                      <el-input v-model='tradeScenceQuery.SCENECODE'  
                      placeholder="请输入交易场景ID"  ></el-input>
                    </el-form-item>
                  </el-col>  
                  <el-col  :lg="2" :md="3" class="searchBtnMarginTop">
                    <el-button type='primary' size='mini' icon='el-icon-search' @click="QueryTradeScence()">查询</el-button>
                  </el-col>
                  <el-col  :lg="2" :md="3" class="searchBtnMarginTop">
                    <el-button type='warning' size='mini' icon='el-icon-refresh'
                    @click="resetForm()">重置</el-button>
                  </el-col>
                  <!-- <el-col  :lg="2" :md="3" class="searchBtnMarginTop">
                    <el-button type='warning' size='mini' icon='el-icon-plus'
                    @click="addMatlGroup()">添加</el-button>
                  </el-col> -->
                  </el-row>
                  <el-table :data="tradeSceneReasult" 
                  header-row-class-name="tableHeaderClass"
                    border>
                      <el-table-column width="50">
                        <template slot-scope="scope">
                          <el-radio :label="scope.row.SCENECODE"
                          @change.native="getParamID(scope.$index, scope.row)"
                          v-model="tradeSceneReasult.SCENECODE">{{null}}</el-radio>
                        </template>
                      </el-table-column>
                      <!-- <el-table-column prop="SCENECODE" label="交易场景ID"></el-table-column> -->
                      <el-table-column prop="SCENECODENAME" label="交易场景名称"></el-table-column>
                      <el-table-column prop="NECYINMATLGROUPNAME" label="必要输入物料组"></el-table-column>
                      <el-table-column prop="INMATLGROUPNAME" label="附加输入物料组"></el-table-column>
                      <el-table-column prop="OUTMATLGROUPNAME" label="输出物料组"></el-table-column>
                      <!-- <el-table-column 
                      align="center"
                        width="160" label="详细信息" fixed="right">
                          <template slot-scope="scope">
                            <el-button type="text" size="mini"
                            @click="handleQueryParameter(scope.$index, scope.row)">查看</el-button>
                          </template>
                        </el-table-column> -->
                  </el-table>
                </el-form>
                </el-card>
                 <div slot="footer" class="dialog-footer" style="text-align:center;">
                  <el-button type="primary" size="mini" :disabled="nextStep" style="margin-top: 10px;" @click="next()">下一步</el-button>
                </div>
              </div>
      <!-- 选择渠道信息 -->
    <div v-if="active===1">
      <el-card style="margin-bottom:10px;">
        <el-form :model="DistributionChannelInfo" ref="DistributionChannelInfo"   size="mini" label-position="left" label-width="80px" >
          <el-row :gutter="10">
            <el-col :md="12" :lg="12">
               <el-form-item label="交易渠道" >
                <el-select v-model="DistributionChannelInfo.CHANNELCODE" placeholder="请选择渠道类型">
                  <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
    	</el-card>  
        <div slot="footer" class="dialog-footer" style="text-align:center;">
          <el-button  type="primary" size="mini" style="margin-top: 10px;" 
          @click="DistributeChannel()">确定</el-button>
        </div>
    </div>
    <!-- 必要物料组选择 -->

    </el-dialog>

    <!-- 弹窗 -->
	</div>
</template>

<script>
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
import TradeMatlGroupInfoQuery from "@/message/Tradingscenemanage/matlGroupsManager/TradeMatlGroupInfoQuery";
import trandeQuery from "@/message/Tradingscenemanage/TrandeScence/trandeQuery";
import trandeManage from "@/message/Tradingscenemanage/TrandeScence/trandeManage";
import channelManage from "@/message/Tradingscenemanage/TrandeScence/channelManage";
import channelQuery from "@/message/Tradingscenemanage/TrandeScence/channelQuery";
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
      active:0,
      //页面
      currentName:'first',
      //交易场景查询表单：
      tradeScenceQuery:{
        TRANCODE:'',
        SCENECODE:'',
      },
      // 渠道类型下拉框选项；
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
      // 渠道维护上送表单：
      DistributionChannelInfo:{
        CHANNELCODE:'',//渠道
        TRANCODE:'',//交易代码
        SCENECODE:'',//交易场景ID
        MODORGNO:'',//维护机构
        MODUSER:'' // 维护用户
      },
      //存放查询到的场景信息：
      tradeSceneReasult:[],
      //物料组查询表单：
      matlGroupQuery:{
        MATLGROUPROS:'',//物料组性质
        MATLGROUPID:'',//物料组ID
        MATLGROUPNAME:'',//物料组名称
        MATLID:'',//物料ID
      },
      //按钮置灰：
      nextStep:true,
      //三种物料组查询结果存储：
      necessaryMatlGroup:[],
      ExtraMatlGroup:[],
      OutMatlGroup:[],
      rowVal:{},
      inputDisabled: false,
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
    //清空表单
    resetForm(){
      //表单内容置零
      this.matlGroupQuery={};
    },
    // // 查看当前行物料组详情信息
    // handleQueryParameter(index, row) {
    //   //打开详细信息弹窗
    //   this.rowVal = row;
    //   this.dialogMatlGroupsDetail.isShow1 = true;
    //   console.log("当前行获取到的信息：")
    //   console.log(this.rowVal);
      
    // },
    next(){
      this.active++;
    },
    //发布渠道
    DistributeChannel(){
      let resBody = new channelManage();
      resBody.data.OPERTYPE = "1"
      resBody.data.CHANNEL = this.DistributionChannelInfo.CHANNELCODE;
      resBody.data.TRANCODE = this.rowVal.TRANCODE;
      resBody.data.SCENECODE = this.rowVal.SCENECODE;
      resBody.data.MODUSER = this.MODUSER;
      resBody.data.MODORGNO = this.MODORGNO;
      request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.$message({
          message: '发布成功！',
          type: 'success'
        });
          this.option.isShow=false;
        } else {
          console.log(response.RSP_BODY);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      });
    },
    //模糊查询所有交易场景
    InitQueryTradeScence(){
      let resBody = new trandeQuery();
      resBody.data.pageflag = this.pageflag;
      resBody.data.currpage = this.currpage;
      resBody.data.pagerownum = this.pagerownum;
      request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.tradeSceneReasult = response.RSP_BODY.struct;
          this.loading = false;
        } else {
          console.log(response);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      })
    },
    //精确查找；
   QueryTradeScence(){
      let resBody = new trandeQuery();
      resBody.data.TRANCODE = this.tradeScenceQuery.TRANCODE;
      resBody.data.SCENECODE = this.tradeScenceQuery.SCENECODE;
      resBody.data.pageflag = this.pageflag;
      resBody.data.currpage = this.currpage;
      resBody.data.pagerownum = this.pagerownum;
      request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.tradeSceneReasult = response.RSP_BODY.struct;
          this.loading = false;
        } else {
          console.log(response);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      })
    },
    openCollback(){
      this.InitQueryTradeScence();
    },
    back(){
        this.active--;
        if(this.active===0){
          this.inputDisabled=false;
        }
    },
    // 表格选中获取参数ID
    getParamID(scope, val) {
      this.rowVal = val;
      this.nextStep = false;
      console.log("当前行参数:");
      console.log(this.rowVal);
    },
    closeDialog() {
      this.active=0;
       this.inputDisabled=false;
      // this.$nextTick(() => {
      //   this.$refs["tempRules"].clearValidate();
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
