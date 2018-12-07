<template>
    <div>
        <el-dialog :visible.sync="isShow" title="用户交割能力"  width="600px"  :close-on-click-modal="false"
         @open="openRole" 
         @close="closeRole"
          v-loading="loading"
    element-loading-text="加载中。。。">
      <div>
        <el-card style="overflow:visible">   
         <el-form ref="userInfo" :model="userInfo"  
            size="mini"  label-width="80px" label-position="left">
            <el-row class="rowStyle">
              <el-col :span="12">
                <el-form-item label="用户姓名" prop="roleName">
                  <el-input v-model="userInfo.UserName" disabled></el-input>
                  </el-form-item>
                </el-col>
            </el-row>
        </el-form> 
      <el-table
        :data="userAbilityInfo"
        class="tableMarginTop"
        header-row-class-name="tableHeaderClass"
        border>
        <el-table-column width="60">
          <template slot-scope="scope">
            <el-radio :label="scope.row.ABILITYID"
            @change.native="getInMatlID(scope.$index, scope.row)"
            v-model="userAbilityInfo.ABILITYID">{{null}}</el-radio>
          </template>
        </el-table-column>  
        <el-table-column
            prop="ORGNO" label="网点号" >
        </el-table-column>
        <el-table-column
            prop="ABILITYNAME" label="能力名称" >
        </el-table-column>
      </el-table> 
        </el-card>
          <el-row style="margin:20px 0;text-align:center">
            <el-button style="margin-left:10px" type="primary" icon='el-icon-plus' size="mini" @click="isShowAdd =true">新增</el-button>
      <el-button style="margin-left:10px" type="danger" icon='el-icon-delete' size="mini" :disabled="isDisabledDel" @click="deleteAbility()">删除</el-button>
          </el-row>   
            </div>
        </el-dialog>
    <!-- 添加交割能力弹窗 -->
      <el-dialog :visible.sync="isShowAdd" title="新增交割能力"
       width="600px"
      v-loading="loading"
      @open="openAddAbility()"
       element-loading-text="加载中。。。">
      <el-steps finish-status="success" :active='active' align-center>
        <el-step title='选择交割能力'></el-step>   
      </el-steps>
        <el-card >
              <el-table :data="AbilityCheckArray" 
                  header-row-class-name="tableHeaderClass"
                    border>
                      <el-table-column width="50">
                        <template slot-scope="scope">
                          <el-radio :label="scope.row.ABILITYID"
                          @change.native="getParamID(scope, scope.row)"
                          v-model="AbilityCheckArray.ABILITYID">{{null}}</el-radio>
                        </template>
                      </el-table-column>
                      <el-table-column prop="ORGNO" label="机构号" ></el-table-column>
                      <el-table-column prop="ABILITYNAME" label="能力名称"  ></el-table-column>
                      <el-table-column prop="ISITOMNT" label="是否全能" :formatter="ISITOMNTFormat" ></el-table-column>
                  </el-table>
          </el-card>
          <el-row style="margin:20px 0;">
                <el-col :span="2" :offset="10">
                <el-button type="primary" size="mini" :disabled="nextAble" @click="addAbility()">确定</el-button>                          
                </el-col>
          </el-row>
    </el-dialog>
    </div>
</template>

<script>
import selectTree from "@/components/selectTree2/";
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
import userAbilityManage from "@/message/deliverAbility/userAbilityManage";
import userAbilityQuery from "@/message/deliverAbility/userAbilityQuery";
import InMatlQuery from "@/message/matlManage/InMatlQuery";
import OutMatlQuery from "@/message/matlManage/OutMatlQuery";
import deliverAbilityQuery from "@/message/deliverAbility/deliverAbilityQuery";
import deliverAbilityManage from "@/message/deliverAbility/deliverAbilityManage";
import deliverAbilityDetailQuery from "@/message/deliverAbility/deliverAbilityDetailQuery";
import deliverAbilityDetailManage from "@/message/deliverAbility/deliverAbilityDetailManage";
export default {
    components: { selectTree },
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
      ISITOMNT:getGlobalParams.get("ISITOMNT"),
      active:0,
      isShowAdd:false,
      isShowEdit:false,
      nextAble:true,
      AbilityCheckArray:[],//存放当前用户，当前机构下可选能力
      userAbilityInfo:[],//存放用户能力信息
      deliverAbility:[],//存放当前能力信息
      isDisabledDel:true,
      userInfo:{},
      //网点用户交割能力维护：
      userAbilityManageInfo:[],//存放当前选择的交割能力信息
      //明细清单
      roleManageDetail:{
        MATLPROS:'01',//物料性质
        DELIVERYMATLTYPE:'',//可交割物料类型
        DELIVERYMATLID:'',//可交割物料ID
        VOUTYPE:'',//凭证类型
        CCY:'',//币种
        ISGATHER:'',//是否可收
        ISAUDIT:'',//是否可审
        ISCONTROL:''//是否可付
      },
      //编辑：
      roleManageDetailEdit:{
        ISGATHER:'',//是否可收
        ISAUDIT:'',//是否可审
        ISCONTROL:''//是否可付
      },
      MatlCheckArray:[],//存放查到的物料信息
      options:[
        {
          value:'01',
          label:'输入物料'
        },
        {
          value:'02',
          label:'输出物料'
        }
      ],
      options1: [{
          value: '001',
          label: '重空-卡'
        }, {
          value: '002',
          label: '重空-折'
        }, {
          value: '003',
          label: '重空-票据类'
        },
        {
          value: '004',
          label: '重空-其他'
        }, {
          value:  '101',
          label: '合法性材料-证件-身份证'
        }, {
          value: '102',
          label: '合法性材料-证件-非身份证'
        },
         {
          value: '103',
          label: '合法性材料-其他'
        }, {
          value: '201',
          label: '非重空凭证'
        }, {
          value: '301',
          label: '现金-本币'
        },
        {
          value: '302',
          label: '现金外币'
        },
         {
          value: '303',
          label: '残币 '
        }, {
          value: '304',
          label: '假币'
        }, {
          value: '401',
          label: '监管要求'
        },
        ],
      deliverInfo:[],
      loading:false,
      roleListUpdate: {},
      roleList: ["1001"],
      roleState: [
        { label: "失效", value: "0" },
        { label: "正常", value: "1" },
        { label: "锁定", value: "2" }
      ],
      brnoList: [],
    };
  },
  computed: {
    isShow: {
      get() {
        return this.option.isShow;
      },
      set(val) {
        this.option.isShow = val;
      }
    },
    tableDataRow: function() {
      return this.rowData;
    }
  },
  created() {
    this.getOrgnoInfo();//获取当前操作的维护机构和维护用户
  },
  methods: {
    ISITOMNTFormat(row, column) {
      return this.ISITOMNT[row[column.property]];
    },
    //确定维护机构和维护用户的值：
    getOrgnoInfo(){
      this.MODORGNO = this.$store.getters.branchId;
      this.MODUSER = this.$store.getters.userId;
    } ,
    //查询当前用户可交割能力； 
    queryUserAbility(){
      this.userAbilityInfo = [];
      let resBody = new userAbilityQuery();
      resBody.data.ORGNO = this.rowData.BranchNo;
      resBody.data.USERNO = this.rowData.tellerNo;
      resBody.data.pageflag = this.pageflag;
      resBody.data.currpage = this.currpage;
      resBody.data.pagerownum = this.pagerownum;
      console.log("提交的信息为：");
      console.log(resBody)
      request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.userAbilityInfo = response.RSP_BODY.struct;
          console.log("当前用户交割能力列表：");
          console.log(this.userAbilityInfo); 
        } else {
          console.log(response);
          this.userAbilityInfo = [];
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      })
    },
    //查询当前机构用户可选交割能力;
    queryUsedAbility(){
      this.AbilityCheckArray = [];
      let resBody = new deliverAbilityQuery();
      resBody.data.ORGNO = this.rowData.BranchNo;
      resBody.data.pageflag = this.pageflag;
      resBody.data.currpage = this.currpage;
      resBody.data.pagerownum = this.pagerownum;
      request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.AbilityCheckArray = response.RSP_BODY.struct;
          console.log("当前用户可添加交割能力列表：");
          console.log(this.AbilityCheckArray); 
        } else {
          console.log(response);
          this.userAbilityInfo = [];
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      })
    },
    getParamID(scope, val){
      this.userAbilityManageInfo = val;
      this.nextAble = false;
      console.log("当前选择交割能力信息：");
      console.log(this.userAbilityManageInfo);
    },
    addAbility(){
      let resBody = new userAbilityManage();
      resBody.data.OPERTYPE = "1";
      resBody.data.ORGNO = this.userAbilityManageInfo.ORGNO;
      resBody.data.USERNO = this.rowData.tellerNo;
      resBody.data.ABILITYID = this.userAbilityManageInfo.ABILITYID;
      resBody.data.MODORGNO=this.MODORGNO;
      resBody.data.MODUSER=this.MODUSER;
      request(resBody)
        .then(response=>{
          if(response.SYS_HEAD.ReturnCode === "000000") {
            this.$message({
                      type: "success",
                      message: "添加成功！"
                    });
              this.isShowAdd = false;
              this.queryUserAbility();
          } else {
             this.$message({
              message:response.SYS_HEAD.ReturnMessage ,
              type: 'error  '
              });
            console.log(response);
          }
        })
        .catch(error=>{
          console.log("error", error);
        })
    },
    // 表格选中获取参数ID
    getInMatlID(scope, val) {
      //传递参数给子页面
      this.deliverAbility = val;
      console.log("当前选择的交割能力为：");
      console.log(this.deliverAbility);
      if(val) {  
        this.isDisabledDel =false;
      }
    },
    next(){
      this.active = 1;
    },
    //删除交割能力：
    deleteAbility(){
      this.$confirm('此操作将永久删除该交割能力,是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let resBody = new userAbilityManage();
          resBody.data.OPERTYPE = "2";
          resBody.data.ORGNO = this.deliverAbility.ORGNO;
          resBody.data.USERNO = this.deliverAbility.USERNO;
          resBody.data.ABILITYID = this.deliverAbility.ABILITYID;
          resBody.data.MODORGNO=this.MODORGNO;
          resBody.data.MODUSER=this.MODUSER;
          request(resBody)
            .then(response=>{
              if(response.SYS_HEAD.ReturnCode === "000000") {
                this.$message({
                          type: "success",
                          message: "删除成功！"
                        });
                  this.isShowAdd = false;
                  this.queryUserAbility();
              } else {
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
    openRole(){
      console.log("得到的参数：");
      console.log(this.rowData);
      this.userInfo = this.rowData;
      this.queryUserAbility();
    },
    closeRole(){
      
    },
    openAddAbility(){
      this.queryUsedAbility();
    }
   }
};
</script>

<style lang="scss"  scoped>
.rowStyle {
  margin-bottom: 10px;
}
</style>
