<template>
  <div>
    <el-dialog title="物料组详情"
    :lock-scroll=false @open="openCollback"
    :visible.sync="isShow1" width="800px">
      <el-card style="margin-bottom:10px">
        <el-form :model="MatlGroupInfo" label-position="left" size="mini" label-width="100px">
           <el-row :gutter="10">
            <el-col :md="24" :lg="12">
              <el-form-item label="物料组名称">
                <el-input v-model="MatlGroupInfo.MATLGROUPNAME" disabled></el-input>
              </el-form-item>
            </el-col>
            <!-- <el-col :md="24" :lg="12">
              <el-form-item label="物料组ID">
                <el-input v-model="MatlGroupInfo.MATLGROUPID" disabled></el-input>
              </el-form-item>
            </el-col> -->
          </el-row>
        <!-- 表格展示物料信息 -->
        <span>物料信息：</span><br><br>
          <el-table :data="matlQueryReasult" 
                  header-row-class-name="tableHeaderClass"
                    border>
                      <el-table-column prop="MATLTYPE" :formatter="matlTypeFormat" label="物料类型"></el-table-column>
                      <el-table-column prop="MATLNAME" label="物料名称"></el-table-column>
                      <el-table-column v-if="this.option.type === 'Out'" prop="VOUNUM" label="凭证数量"></el-table-column>
                      <!-- <el-table-column prop="MODORGNO" label="维护机构"></el-table-column>
                      <el-table-column prop="MODUSER" label="维护用户"></el-table-column> -->
                  </el-table>
        </el-form>
      </el-card>
      <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="isShow1 = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
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
    paramObj: Object
  },
  data() {
    return {
      //分页标志：
      pageflag: 4,
      currpage: 1,
      pagerownum: 10,
      matlType:getGlobalParams.get("matlType"),
      MatlGroupInfo:{
          MATLGROUPID:'',//物料组ID
          MATLGROUPNAME:'',//物料组名称
          MATLTYPE:'',//物料类型
          MATLID:'',//物料ID
          MODORGNO:'',//维护机构
          MODUSER:'',//维护用户,
          MATLNAME:'',//物料名称
          MATLENNAME:'',//英文简称
          SERLNUM:'',//序号  
          VOUTYPE:'',//凭证类型
          VOUNUM:'',//凭证数量
          CCY:'',//币种
          MODDATE:'',//维护日期；
          MODTIME:'',//维护时间
      },
      matlQueryReasult:[],//存放物料组物料信息
      MatlGroupId:'',//执行查询操作时标记符
      currentPage: 1,
      loading: false,
    };
  },
  created(){
    
  },
  computed: {
    isShow1: {
      get: function() {
        return this.option.isShow1;
      },
      set: function(newVal) {
        this.option.isShow1 = newVal;
      }
    },
    type: {
      get: function() {
        return this.option.type;
      },
      set: function(newVal) {
        this.option.isShow1 = newVal;
      }
    },
    paramForm: function() {
      return this.paramObj
    }
  },
  methods: {
    matlTypeFormat(row, column) {
      return this.matlType[row[column.property]];
    },
    //从父组件取参数：
    getMatlGrouopDetailInfo(){
      this.matlQueryReasult=this.paramObj.MATLDATA;
      this.MatlGroupInfo.MATLGROUPID = this.paramObj.MATLGROUPID;
      this.MatlGroupInfo.MATLGROUPNAME = this.paramObj.MATLGROUPNAME;
      // this.MatlGroupInfo.MATLGROUPROS = this.paramObj.MATLGROUPROS;
      this.MatlGroupInfo.MATLGROUPDSCP = this.paramObj.MATLGROUPDSCP;
    },  
    //查询物料组详细信息：
    queryDetailInfo(){
      let resBody = new TradeMatlGroupInfoQuery();
      resBody.data.TRANCODE = this.paramObj.TRANCODE;
      resBody.data.MATLGROUPROS = this.paramObj.MATLGROUPROS;
      resBody.data.MATLGROUPID = this.paramObj.MATLGROUPID;
      resBody.data.MATLGROUPNAME = this.paramObj.MATLGROUPNAME;
      resBody.data.pageflag = this.pageflag;
      resBody.data.currpage = this.currpage;
      resBody.data.pagerownum = this.pagerownum;
      request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.matlQueryReasult=response.RSP_BODY.struct[0].MATLDATA;
          this.MatlGroupInfo.MATLGROUPID = response.RSP_BODY.struct[0].MATLGROUPID;
          this.MatlGroupInfo.MATLGROUPNAME = response.RSP_BODY.struct[0].MATLGROUPNAME;
          this.MatlGroupInfo.MATLGROUPROS = this.paramObj.MATLGROUPROS;
          this.MatlGroupInfo.MATLGROUPDSCP = this.paramObj.MATLGROUPDSCP;
          this.loading=false;
          console.log("成功读取物料组物料信息：");
          console.log(response.RSP_BODY.struct[0].MATLDATA);
        } else {
          console.log(response.RSP_BODY);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      });
    },
    //获取当前行信息：
    getInfo(){
      this.MatlGroupInfo = this.paramObj;
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    // 打开dialog回调
    openCollback() {
      console.log("paramObj")
     console.log(this.paramObj);
     console.log("this.type:");
     console.log(this.option.type)
     this.getMatlGrouopDetailInfo();
    },
  }
};
</script>

<style scope>

</style>