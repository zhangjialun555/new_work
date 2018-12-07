<template>
  <div>
    <el-dialog :visible.sync="isShow" title="新增角色"
      @open="openAddRole" 
      @close='closeAddRole'
       width="600px"
      v-loading="loading"
    element-loading-text="加载中。。。">
      <el-steps finish-status="success" :active='active' align-center>
        <el-step title='交割能力创建'></el-step>
        <el-step title='选择可交割物料'></el-step>   
        <el-step title='明细维护'></el-step> 
      </el-steps>
      <div  v-if="active==0">
        <el-card style="overflow:visible">
          <el-form ref="roleManage" :model="roleManage"  :rules="rulesRole"
            size="mini" label-width="120px" label-position="left">
            <!-- <el-row class="rowStyle" >
                <el-col :span="16">
                    <el-form-item label="机构号" prop="ORGNO">
                     <el-input v-model="roleManage.ORGNO" placeholder="请输入机构号"></el-input>
                     </el-form-item>
                  </el-col>
              </el-row> -->
              <el-row class="rowStyle" >
                <el-col :span="16">
                  <el-form-item label="能力名称" prop="ABILITYNAME">
                  <el-input v-model="roleManage.ABILITYNAME" placeholder="请输入能力名称"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="rowStyle" :gutter="100">            
               <el-col :span="12" >
                    <el-form-item prop="ISITOMNT" label=" 是否全能">
                                    <el-switch v-model="roleManage.ISITOMNT"></el-switch>
                                </el-form-item>
                      <!-- <el-checkbox v-model="roleListAdd.childBranchUseFlag">子机构是否可见</el-checkbox> -->
                  </el-col>    
              </el-row>
          </el-form> 
        </el-card>
        <el-row style="margin:20px 0;">
          <el-col :offset="10" :span="2">
            <el-button v-if="roleManage.ISITOMNT===true" type="primary" size="mini" @click="addRoleEnd">完成</el-button>
            <el-button v-else type="primary" size="mini" @click="addRole">完成并设定明细</el-button>
          </el-col>
        </el-row>   
      </div>
      <div   v-if="active==1">
        <el-card >
          <el-form ref="roleManageDetail" :model="roleManageDetail"  :rules="rulesRole"
            size="mini" label-width="80px" label-position="center">
              <el-row class="rowStyle" >
                <el-col :span="12">
                  <el-form-item label="物料性质" prop="MATLPROS">
                  <el-select 
                  v-model="roleManageDetail.MATLPROS" 
                  placeholder="请选择物料性质">
                  <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                  </el-option>
                </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="物料类型" prop="DELIVERYMATLTYPE">
                    <el-select 
                    v-model="roleManageDetail.DELIVERYMATLTYPE"
                    @change="queryMatl()"
                    placeholder="请选择可交割物料类型">
                  <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                  </el-option>
                </el-select>
                     </el-form-item>
                  </el-col>
              </el-row>
              <!-- <el-row class="rowStyle" >
                <el-col :span="16">
                  <el-form-item label="可交割物料ID" prop="DELIVERYMATLID">
                  <el-input v-model="roleManageDetail.DELIVERYMATLID" placeholder="请输入可交割物料ID"></el-input>
                  </el-form-item>
                </el-col>
              </el-row> -->
              <el-table :data="MatlCheckArray" 
                  header-row-class-name="tableHeaderClass"
                    border>
                      <el-table-column width="50">
                        <template slot-scope="scope">
                          <el-radio :label="scope.row.MATLID"
                          @change.native="getParamID(scope, scope.row)"
                          v-model="MatlCheckArray.MATLID">{{null}}</el-radio>
                        </template>
                      </el-table-column>
                      <el-table-column prop="MATLNAME" label="物料名称"  width="150"></el-table-column>
                      <el-table-column prop="MATLTYPE" label="物料类型"  width="150"></el-table-column>
                      <!-- <el-table-column  label="性质维护" width="318">
                        <template slot-scope="scope">
                          <el-checkbox-group 
                          v-model="form.type"
                          @change="checkboxData()">
                            <el-checkbox label="可收" name="type"></el-checkbox>
                            <el-checkbox label="可审" name="type"></el-checkbox>
                            <el-checkbox label="可付" name="type"></el-checkbox>
                          </el-checkbox-group>
                        </template>
                      </el-table-column> -->
                      <el-table-column 
                      align="center"
                        width="160" label="详细信息" fixed="right">
                          <template slot-scope="scope">
                            <el-button type="text" size="mini"
                            @click="handleQueryParameter(scope.$index, scope.row)">查看</el-button>
                          </template>
                        </el-table-column>
                  </el-table>
          </el-form>
          </el-card>
          <el-row style="margin:20px 0;">
                <el-col :span="2" :offset="10">
                <el-button type="primary" size="mini" :disabled="nextAble" @click="next()">下一步</el-button>                          
                </el-col>
          </el-row>
      </div>
      <!-- 第三步 -->
      <div   v-if="active==2">
        <el-card >
          <el-form ref="roleManageDetail" :model="roleManageDetail"  :rules="rulesRole"
            size="mini" label-width="120px" label-position="left">
              <el-row class="rowStyle" :gutter="100">            
               <el-col :span="12" >
                  <el-form-item prop="ISGATHER" label=" 是否可收">
                      <el-switch v-model="roleManageDetail.ISGATHER"></el-switch>
                  </el-form-item>
              </el-col> 
              <el-col :span="12" >
                  <el-form-item prop="ISAUDIT" label=" 是否可审">
                      <el-switch v-model="roleManageDetail.ISAUDIT"></el-switch>
                  </el-form-item>
              </el-col>       
              </el-row>
              <el-row>
                <el-col :span="12" >
                  <el-form-item prop="ISCONTROL" label=" 是否可付">
                      <el-switch v-model="roleManageDetail.ISCONTROL"></el-switch>
                  </el-form-item>
              </el-col>    
              </el-row>
          </el-form>
          </el-card>
          <el-row style="margin:20px 0;">
                <el-col :span="2" :offset="10">
                <el-button type="primary" size="mini" @click="addAgain()">继续添加</el-button>                         
                </el-col>
                <el-col :span="2" :offset="10">
                <el-button type="primary" size="mini" @click="roleDetail()">确定</el-button>                          
                </el-col>
          </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ElTreeRow from "@/components/tree";
import selectTree from "@/components/selectTree2/";
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
import InMatlQuery from "@/message/matlManage/InMatlQuery";
import OutMatlQuery from "@/message/matlManage/OutMatlQuery";
import deliverAbilityQuery from "@/message/deliverAbility/deliverAbilityQuery";
import deliverAbilityManage from "@/message/deliverAbility/deliverAbilityManage";
import deliverAbilityDetailQuery from "@/message/deliverAbility/deliverAbilityDetailQuery";
import deliverAbilityDetailManage from "@/message/deliverAbility/deliverAbilityDetailManage";
import userAbilityManage from "@/message/deliverAbility/userAbilityManage";
import userAbilityQuery from "@/message/deliverAbility/userAbilityQuery";
import roleCreate from "@/message/userManage/role/role-create";
import roleRelative from "@/message/userManage/role/role-relative";
export default {
  components: { ElTreeRow, selectTree },
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
      //角色维护：
      roleManage:{
        OPERTYPE:'',//操作类型
        ORGNO:'',//机构号
        ABILITYID:'',//能力ID
        ABILITYNAME:'',//能力名称
        ISITOMNT:'',//是否全能
      },
      nextAble:true,
      MatlCheckArray:[],//存放查到的物料信息
      form:{
        type:[],
      },
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
      loading:false,
      rulesRole: {
        ABILITYNAME: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { max: 50, message: "角色名称少于50个字符", trigger: "blur" }
        ],
        ORGNO: [{ required: true, message: "请输入机构号", trigger: "blur" }],
        ISITOMNT:[{required: true, message: "请输入机构号", trigger: "blur" }],
      }
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
    active: {
      get() {
        return this.option.active;
      },
      set(val) {
        this.option.active = val;
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
    //确定维护机构和维护用户的值：
    getOrgnoInfo(){
      this.MODORGNO = this.$store.getters.branchId;
      this.MODUSER = this.$store.getters.userId;
    } , 
    openAddRole(){
      console.log("当前机构参数：");
      console.log(this.rowData);
    },
    // 查看当前行参数详情信息
    handleQueryParameter(index, row) {
        // this.rowObj = row;
        // this.dialogQueryMatl.isShow = true;
    },
    checkboxData(){
      console.log("当前选择内容：");
      console.log(this.form.type);
    },
    closeAddRole() {
     this.active=0;
    },
    //改变下拉框选项自动查询，进行选择表格更新
    queryMatl(){
      if(this.roleManageDetail.MATLPROS ==="02"){
        let resBody = new OutMatlQuery();
        resBody.data.MATLTYPE=this.roleManageDetail.DELIVERYMATLTYPE;
        resBody.data.pageflag = this.pageflag;
        resBody.data.currpage = this.currpage;
        resBody.data.pagerownum = this.pagerownum;
        request(resBody)
        .then(response=>{
          if(response.SYS_HEAD.ReturnCode === "000000") {
            this.loading = false;
            console.log("查询输出物料的内容为：");
            console.log(response.RSP_BODY); 
            this.MatlCheckArray = response.RSP_BODY.struct;
          } else {
            console.log(response);
          }
        })
        .catch(error=>{
          this.loading = false
          console.log("error", error);
        })
      }else{
        let resBody = new InMatlQuery();
        resBody.data.MATLTYPE=this.roleManageDetail.DELIVERYMATLTYPE;
        resBody.data.pageflag = this.pageflag;
        resBody.data.currpage = this.currpage;
        resBody.data.pagerownum = this.pagerownum;
        request(resBody)
        .then(response=>{
          if(response.SYS_HEAD.ReturnCode === "000000") {
            this.loading = false;
            console.log("查询输入物料的内容为：");
            console.log(response.RSP_BODY); 
            this.MatlCheckArray = response.RSP_BODY.struct;
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
    getParamID(scope, val){
      console.log("当前选择物料信息：");
      console.log(val);
      this.roleManageDetail.DELIVERYMATLID = val.MATLID;
      this.nextAble =false;
    },
    addRole() {
      this.active = 1;
      this.$refs["roleManage"].validate(valid => {
        if (valid) {
          if(this.roleManage.ISITOMNT===true){
            this.roleManage.ISITOMNT ="1"
          }else{
            this.roleManage.ISITOMNT = "0"
          }
          let resBody = new deliverAbilityManage();
          resBody.data.OPERTYPE = "1";
          resBody.data.ORGNO = this.rowData.branchno;
          resBody.data.ABILITYNAME = this.roleManage.ABILITYNAME;
          resBody.data.ISITOMNT = this.roleManage.ISITOMNT;
          resBody.data.MODUSER = this.MODUSER;
          resBody.data.MODORGNO = this.MODORGNO;
          request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.$message({
                  type: "success",
                  message: "交割能力创建成功!请为设定能力明细。"
                });
              this.active = 1;
              this.roleManage.ABILITYID = response.RSP_BODY.ABILITYID;
              console.log("返回的能力ID为：");
              console.log(this.roleManage.ABILITYID);
        } else {
          console.log(response.RSP_BODY);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      });
      }else {
          this.$message({
            type: "warning",
            message: "请输入合法的数据！"
          });
          return false;
        }
      });
    },
    //转换函数：
    changeBoolToNum(val){
      if(val = true){
        val = "1";
      }else{
        val = "0";
      }
    },
    //全能的话直接结束：
    addRoleEnd(){
      this.$refs["roleManage"].validate(valid => {
        if (valid) {
          if(this.roleManage.ISITOMNT===true){
            this.roleManage.ISITOMNT ="1"
          }else{
            this.roleManage.ISITOMNT = "0"
          }
          let resBody = new deliverAbilityManage();
          resBody.data.OPERTYPE = "1";
          resBody.data.ORGNO = this.rowData.branchno;
          resBody.data.ABILITYNAME = this.roleManage.ABILITYNAME;
          resBody.data.ISITOMNT = this.roleManage.ISITOMNT;
          resBody.data.MODUSER = this.MODUSER;
          resBody.data.MODORGNO = this.MODORGNO;
          request(resBody)
          .then(response=>{
            if(response.SYS_HEAD.ReturnCode === "000000") {
              this.$message({
                      type: "success",
                      message: "交割能力创建成功!"
                    });
              this.option.isShow =false;
            } else {
              console.log(response.RSP_BODY);
            }
          })
          .catch(error=>{
            this.loading = false
            console.log("error", error);
          });
          }else {
              this.$message({
                type: "warning",
                message: "请输入合法的数据！"
              });
              return false;
            }
          });
    },
    next(){
      this.active = 2;
    },
    roleDetail() {
      //对三个布尔值做处理；
      if(this.roleManageDetail.ISGATHER===true){
            this.roleManageDetail.ISGATHER ="1"
          }else{
            this.roleManageDetail.ISGATHER = "0"
          };
      if(this.roleManageDetail.ISAUDIT===true){
            this.roleManageDetail.ISAUDIT ="1"
          }else{
            this.roleManageDetail.ISAUDIT = "0"
          }
      if(this.roleManageDetail.ISCONTROL===true){
            this.roleManageDetail.ISCONTROL ="1"
          }else{
            this.roleManageDetail.ISCONTROL = "0"
          }
      let resBody = new deliverAbilityDetailManage();
      resBody.data.OPERTYPE = "1";
      resBody.data.ABILITYID = this.roleManage.ABILITYID;
      resBody.data.MATLPROS = this.roleManageDetail.MATLPROS;
      resBody.data.DELIVERYMATLTYPE = this.roleManageDetail.DELIVERYMATLTYPE;
      resBody.data.DELIVERYMATLID = this.roleManageDetail.DELIVERYMATLID;
      resBody.data.ISGATHER = this.roleManageDetail.ISGATHER;
      resBody.data.ISAUDIT = this.roleManageDetail.ISAUDIT;
      resBody.data.ISCONTROL = this.roleManageDetail.ISCONTROL;
      resBody.data.MODUSER = this.MODUSER;
      resBody.data.MODORGNO = this.MODORGNO;
       request(resBody)
          .then(response=>{
            if(response.SYS_HEAD.ReturnCode === "000000") {
              this.$message({
                      type: "success",
                      message: "交割能力明细创建成功!"
                    });
              this.option.isShow =false;
            } else {
              console.log(response.RSP_BODY);
            }
          })
          .catch(error=>{
            this.loading = false
            console.log("error", error);
          });
    },
  addAgain(){
    //对三个布尔值做处理；
      if(this.roleManageDetail.ISGATHER===true){
            this.roleManageDetail.ISGATHER ="1"
          }else{
            this.roleManageDetail.ISGATHER = "0"
          };
      if(this.roleManageDetail.ISAUDIT===true){
            this.roleManageDetail.ISAUDIT ="1"
          }else{
            this.roleManageDetail.ISAUDIT = "0"
          }
      if(this.roleManageDetail.ISCONTROL===true){
            this.roleManageDetail.ISCONTROL ="1"
          }else{
            this.roleManageDetail.ISCONTROL = "0"
          }
      let resBody = new deliverAbilityDetailManage();
      resBody.data.OPERTYPE = "1";
      resBody.data.ABILITYID = this.roleManage.ABILITYID;
      resBody.data.MATLPROS = this.roleManageDetail.MATLPROS;
      resBody.data.DELIVERYMATLTYPE = this.roleManageDetail.DELIVERYMATLTYPE;
      resBody.data.DELIVERYMATLID = this.roleManageDetail.DELIVERYMATLID;
      resBody.data.ISGATHER = this.roleManageDetail.ISGATHER;
      resBody.data.ISAUDIT = this.roleManageDetail.ISAUDIT;
      resBody.data.ISCONTROL = this.roleManageDetail.ISCONTROL;
      resBody.data.MODUSER = this.MODUSER;
      resBody.data.MODORGNO = this.MODORGNO;
       request(resBody)
          .then(response=>{
            if(response.SYS_HEAD.ReturnCode === "000000") {
              this.$message({
                      type: "success",
                      message: "交割能力明细创建成功!"
                    });
              this.roleManageDetail={};//清空上一次的值；
              this.MatlCheckArray=[];//清空物料选择列表
              this.roleManageDetail.MATLPROS='01';
              this.active = 1;
            } else {
              console.log(response.RSP_BODY);
            }
          })
          .catch(error=>{
            this.loading = false
            console.log("error", error);
          });
  },
  }
};
</script>

<style lang="scss"  scoped>
.rowStyle {
  margin-bottom: 10px;
}
.el-radio-group {
  padding: 0;
}
.createRoleRelative {
  height: 500px;
  overflow-y: auto;
}
.createRoleRelative::-webkit-scrollbar {
  //overflow 出现滚动条，将滚动条隐藏；
  display: none;
}
</style>
