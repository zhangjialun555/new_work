<template>
	<div>
    <el-dialog title="删除物料" @open="openCollback" @close="closeDialog"
    :lock-scroll=false
    :visible.sync="isShow" width="1000px">
      <el-steps  :active="active" 
            align-center  style="margin-bottom:10px"
            finish-status="success">
        <el-step title="选择物料"></el-step>
      </el-steps>
      <!-- 场景信息 -->
      <div v-if="active===1">
        <el-card style="margin-bottom:10px;">
                <!-- 输入组表格 -->
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
                      <el-table-column prop="VOUNUM" label="凭证数量" v-if="matlGroupPros === '02'"></el-table-column>
                  </el-table>
                </el-card>
                <div slot="footer" class="dialog-footer" style="text-align:center;">
                    <el-button type="primary" size="mini" style="margin-top: 10px;" :disabled="isDeleteAble" @click="deleteMatl()">删除</el-button>
                </div>
              </div> 
    </el-dialog>
	</div>
</template>

<script>
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
import TradeMatlGroupInfoQuery from "@/message/Tradingscenemanage/matlGroupsManager/TradeMatlGroupInfoQuery";
import InMatlGroupManage from "@/message/Tradingscenemanage/matlGroupsManager/InMatlGroupManage";
import OutMatlGroupManage from "@/message/Tradingscenemanage/matlGroupsManager/OutMatlGroupManage";
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
      //物料组标识符：
      matlGroupPros:'',
      isDeleteAble:true,
      // 页面号
      active:1,
      //页面
      currentName:'first',
      matlType:getGlobalParams.get("matlType"),
      //定义维护结构：
      //物料查询表单：
      matlQuery:{
        MATLTYPE:'',//物料类型
        MATLID:'',//物料ID
        MATLNAME:'',//物料名称
        MATLENNAME:'',//英文简称
      },
      matlManageInfo:{
         //物料维护
        MATLTYPE:'', //物料类型
        MATLID:'',//物料ID
        VOUNUM:'',//凭证数量
        MODORGNO:'',//维护机构
        MODUSER:'',//维护用户
      },
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
      matlModelInfo:[],
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
    matlTypeFormat(row, column) {
      return this.matlType[row[column.property]];
    },
      //确定维护机构和维护用户的值：
    getOrgnoInfo(){
      this.MODORGNO = this.$store.getters.branchId;
      this.MODUSER = this.$store.getters.userId;
    } , 
    openCollback(){
      this.queryAllMatl();
      this.matlGroupPros = this.rowData.MATLGROUPROS;
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
          if(this.matlQueryReasult.length === 0){
            this.isDeleteAble = true;
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
    },
    //执行删除操作：
    deleteMatl(){
        this.$confirm('此操作将删除物料组该物料,同时与该物料绑定的收审/交付的模式将删除,是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        //对物料组类型进行判断，选择不同的接口进行操作；
        if(this.rowData.MATLGROUPROS==="02"){
            let resBody = new OutMatlGroupManage();
            resBody.data.OPERTYPE = "3";
            resBody.data.MATLGROUPID = this.rowData.MATLGROUPID;
            resBody.data.MATLID = this.matlManageInfo.MATLID;
            resBody.data.TRANCODE = this.rowData.TRANCODE;
            resBody.data.MODORGNO = this.MODORGNO;
            resBody.data.MODUSER = this.MODUSER;
            request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.$message({
          message: '删除完成！',
          type: 'success'
          });
        //   this.queryAllMatl();
          this.option.isShow = false;
        } else {
          console.log(response.RSP_BODY);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      });
        }else{
            let resBody = new InMatlGroupManage();
            resBody.data.OPERTYPE = "3";
            resBody.data.MATLGROUPID = this.rowData.MATLGROUPID;
            resBody.data.MATLID = this.matlManageInfo.MATLID;
            resBody.data.TRANCODE = this.rowData.TRANCODE;
            resBody.data.SERLNUM = this.matlManageInfo.SERLNUM;
            resBody.data.MODORGNO = this.MODORGNO;
            resBody.data.MODUSER = this.MODUSER;
            request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.$message({
          message: '删除完成！',
          type: 'success'
          });
        //this.queryAllMatl();
          this.option.isShow = false;
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
      }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    closeDialog() {
      this.active=1;
      this.isDeleteAble = true;
      // this.$nextTick(() => {
      //   this.$refs["tempRules"].clearValidate();
      // });
    },
    getInMatlID(scope, val) {
      //获取当前行参数；
      this.matlManageInfo=val;
      console.log("当前物料信息:")
      console.log(this.matlManageInfo);
      this.isDeleteAble = false;
    },
    handleSelectionModel(val){
    //   this.matlModelInfo=val;
      console.log(val);
    },
  nextStep(){
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
