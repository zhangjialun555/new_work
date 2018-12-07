<template>
  <div   v-loading="loading">
    <el-card>
    <el-row :gutter="10">
      <el-col :lg="8" :md="24">
        <el-card style="overflow:visible; height:688px">
          <!-- <div class="roleBlock"> -->
                <!-- <div class="headerRole">
                    机构信息
                </div> -->
               <div class="contentRole">
                <!-- <el-radio-group v-model="roleManage.ABILITYID" size="mini">
                  <el-radio :label="item.ABILITYID"  @change="roleChange(item)" border v-for="item in  roleInfoCheckArray" :key="item.id">{{item.ABILITYNAME}}</el-radio> 
                </el-radio-group> -->
                <el-tree :data="branchInfo" 
                :props="defaultProps"
                :default-expand-all="true"
                node-key="branchid"
                @node-click="handleNodeClick">
                </el-tree>
              </div>     
          <!-- </div>   -->
        </el-card>
      </el-col>
      <el-col :lg="16" :md="24">
          <!-- <el-card > -->
        <el-card style="overflow:visible; height:688px">
            <el-col :span="24">
              <div class="roleBlock">
                <div class="headerRole">
                    用户列表
                </div>
              <div class="roleBox">
                <!-- <el-button style="margin-left:10px" type="primary" icon='el-icon-search' size="mini" :disabled="isDisabledAdd" @click="dialogOptionsAdd.isShow=true;">新增</el-button>
                <el-button style="margin-left:10px" type="danger" icon='el-icon-search' size="mini" :disabled="isDisabledDel" @click="deleteRole">删除</el-button>
                <el-button style="margin-left:10px" type="primary" icon='el-icon-search' size="mini" :disabled="isDisabledDel" @click="dialogOptionsEdit.isShow=true">修改</el-button> -->
                <el-button style="margin-left:10px" type="primary" icon='el-icon-search' size="mini" :disabled="isDisabledDel" @click="openRoleDetail">交割能力维护</el-button>
      <el-table
        :data="tableDataPage"
        class="tableMarginTop"
        header-row-class-name="tableHeaderClass"
        border>
        <el-table-column width="60">
          <template slot-scope="scope">
            <el-radio :label="scope.row.UserID"
            @change.native="getInMatlID(scope.$index, scope.row)"
            v-model="UserID">{{null}}</el-radio>
          </template>
        </el-table-column>  
        <el-table-column
            prop="UserName" label="用户姓名" >
        </el-table-column>
        <el-table-column
            prop="tellerNo" label="用户编号" >
        </el-table-column>
        <el-table-column 
       align="center"
         label="交割能力" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="mini"
            @click="handleQueryParameter(scope.$index, scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align:right;margin-top:20px;"
           v-show="this.tableData">
        <el-pagination  :current-page="currentPage" background
                        :page-size="pageSize"
                        layout="sizes, total, prev, pager, next, jumper"
                       :total="tableData.length"
                       @current-change="changePage">
        </el-pagination>
      </div>
                </div>
                
                 <!-- <el-button type="primary" size="mini"  @click="dialogOptionsAdd.isShow=true;dialogOptionsAdd.active=0;" >新建</el-button>
              <el-button type="danger"  :disabled="isDisabledDel" size='mini' @click="delRole">删除</el-button>
               <el-button type="primary" :disabled="isDisabledDel" size="mini"  @click="dialogOptionsAdd.isShow=true;dialogOptionsAdd.active=0;" >修改</el-button>               -->
              </div> 
            </el-col>
        </el-card>
          <!-- </el-card> -->
      </el-col>
    </el-row>
  </el-card>
      <!-- 弹窗 -->
    <keep-alive>
      <component :is='dialogList.updateUserDetail' :option='dialogOptionsUpdateDetail' :rowData="rowVal"  ></component>
    </keep-alive>
    <keep-alive>
      <component :is='dialogList.updateRole' :option='dialogOptionsUpdate' :rowData="rowVal" ></component>
    </keep-alive>
    <component :is='dialogList.createRole' :option='dialogOptionsAdd' :rowData="rowValAdd" ></component>  
    <component :is='dialogList.editRole' :option='dialogOptionsEdit' :rowData="rowVal" ></component>          
  </div>
</template>
<script>
import ElTreeRow from "@/components/tree";
import request from "@/utils/request";
import deliverAbilityQuery from "@/message/deliverAbility/deliverAbilityQuery";
import deliverAbilityManage from "@/message/deliverAbility/deliverAbilityManage";
import deliverAbilityDetailQuery from "@/message/deliverAbility/deliverAbilityDetailQuery";
import deliverAbilityDetailManage from "@/message/deliverAbility/deliverAbilityDetailManage";
import userAbilityManage from "@/message/deliverAbility/userAbilityManage";
import branchQuery from "@/message/deliverAbility/branchQuery";
import inquireUser from "@/message/deliverAbility/inquireUser";
import userAbilityQuery from "@/message/deliverAbility/userAbilityQuery";
import getGlobalParams from "@/utils/getGlobalParams";
import updateUserDetail from "./dialog/updateUserDetail";
import createRole from "./dialog/createRole";
import editRole from "./dialog/editRole";
import updateRole from "./dialog/updateRole";
import delRole from "@/message/userManage/role/del-role";
import devRunList from "@/message/spinnerDataQuery/spinner-data-query";
export default {
  components: { ElTreeRow },
  name: "user-info-manage",
  data() {
    return {
      //维护机构和维护用户,登录时就已经确定
      MODORGNO:'',
      MODUSER:'',
      //分页标志：
      pageflag: 4,
      currpage: 1,
      pagerownum: 10,
      currentPage:1,
      pageSize:10,
      //能力查询：
      roleQuery:{
        ORGNO:'',
        ABILITYID:'',
      },
      //能力概要维护：
      roleManage:{
        OPERTYPE:'',//操作类型
        ORGNO:'',//机构号
        USERNO:'',//用户号
        ABILITYID:'',//能力ID
        ABILITYNAME:'',//能力名称
        ISITOMNT:'',//是否全能
      },
      //明细清单
      roleManageDetail:{
        OPERTYPE:'',//操作类型
        ABILITYID:'',//能力ID
        MATLPROS:'',//物料性质
        DELIVERYMATLTYPE:'',//可交割物料类型
        DELIVERYMATLID:'',//可交割物料ID
        VOUTYPE:'',//凭证类型
        CCY:'',//币种
        ISGATHER:'',//是否可收
        ISAUDIT:'',//是否可审
        ISCONTROL:''//是否可付
      },
      defaultProps: {
        children: "child",
        label: "branchname",
        branchid: "branchid"
      },
      //数据枚举值；
      matlType:{
    "001":"重空-卡",
    "002":"重空-折",
    "003":"重空-票据类",
    "004":"重空-其他",
    "101":"合法性材料-证件-身份证",
    "102":"合法性材料-证件-非身份证",
    "103":"合法性材料-其他",
    "201":"非重空凭证",
    "301":"现金-本币",
    "302":"现金外币",
    "303":"残币",
    "304":"假币",
    "401":"监管要求"
  },
  matlPros:{
    "01":"输入物料",
    "02":"输出物料"
  },
  rowVal:null,//传递给子组件的数据
  rowValAdd:null,//传递给creatRole
  branchInfo:[],//存放机构组织数据
  branchNodeInfo:[],//存放当前选择的机构信息
  UserID:'',
  tableData:[],//存放用户列表信息
      roleId:'',//当前能力ID
      //模拟数据：\
      branchNode:[],//存放当前节点ID
      deliverMatl:[],//获取当前可交割物料的信息
      deliverMatlType:'',
      deliverMatlPros:'',
      roleInfoCheckArray: [],//数组存放可操作性按钮条目
      roleMatlCheckArray:[],//存放明细查询到的可操作物料按钮条目；
      roleSummaryInfo: [],//存放交割能力概要信息
      roleDetailInfo:[],//明细存放
      loading: false,
      dialogList: 
      { 
      updateUserDetail, 
      createRole, 
      editRole,
      updateRole 
      },
      dialogOptionsAdd: { isShow: false, active: 0},
      dialogOptionsEdit:{ isShow: false, active: 0},
      dialogOptionsUpdate: { isShow: false, currentRowList: [] },
      dialogOptionsUpdateDetail: { isShow: false, currentRowList: [] },
      isDisabledDel: true,
      isDisabledAdd:true
    };
  },
  mounted() {},
  computed: {
    tableDataPage(){
      return this.tableData.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize)
    }
  },
  created() {
    this.getOrgnoInfo();//获取当前操作的维护机构和维护用户
    this.queryBranch();
  },

  methods: {
    changePage(val){
      this.currentPage=val
    },
    //查询机构组织结构：
    queryBranch() {
      this.loading = true;
      let resBody = new branchQuery();
      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.loading = false;
            this.branchInfo = response.RSP_BODY.branchInfo;
            console.log("当前查询到的组织数据：");
            console.log(this.branchInfo);
          } else {
            this.loading = false;
          }
        })
        .catch(error => {
          // error handler
          console.error("查询错误", error);
          this.loading = false;
        });
    },
    //点击节点触发：
    handleNodeClick(data) {
      this.isDisabledDel = true;
      this.rowValAdd = data;
      this.branchNodeInfo = data;
      // this.isDisabledAdd = false;
      this.UserID = '';
      console.log("当前点击机构信息为：")  
      console.log(this.branchNodeInfo);
      //查询当前机构下用户列表信息
      this.clickNodeQuery();
      },
    clickNodeQuery(){
      this.currentPage = 1;
      this.checkUserList();
    },
      //过滤
    fillterValue(val){
      console.log(this.roleDetailInfo.DELIVERYMATLTYPE)
      for(var index in this.matlType){
        if(index===this.roleDetailInfo.DELIVERYMATLTYPE){
          this.deliverMatlType = this.matlType[index];
          console.log(this.deliverMatlType)
        }else{
          console.log("无匹配值")
        }
      }
    },
    fillterRosValue(val){
      console.log(this.roleDetailInfo.MATLPROS)
      for(var index in this.matlPros){
        if(index===this.roleDetailInfo.MATLPROS){
          this.deliverMatlPros = this.matlPros[index];
          console.log(this.deliverMatlPros)
        }else{
          console.log("无匹配值")
        }
      }
    },
    //确定维护机构和维护用户的值：
    getOrgnoInfo(){
      this.MODORGNO = this.$store.getters.branchId;
      this.MODUSER = this.$store.getters.userId;
    } , 
    //交割能力查询，进入页面时模糊查询
    // initQueryAbility() {
    //   //查询列表
    //   this.roleSummaryInfo = [];
    //   this.isDisabledDel = true;
    //   this.roleInfoCheckArray = Object.assign([]);
    //   let resBody = new deliverAbilityQuery();
    //   resBody.data.ORGNO = this.branchNodeInfo.branchno;
    //   resBody.data.pageflag = this.pageflag;
    //   resBody.data.currpage = this.currpage;
    //   resBody.data.pagerownum = this.pagerownum;
    //   request(resBody)
    //   .then(response=>{
    //     if(response.SYS_HEAD.ReturnCode === "000000") {
    //       this.loading=false;
    //       //查询概要信息存入按钮数组
    //       this.roleSummaryInfo = response.RSP_BODY.struct;
    //         console.log("获取到的交割能力信息：");
    //         console.log(this.roleSummaryInfo);
    //     } else {
    //       console.log(response);
    //     }
    //   })
    //   .catch(error=>{
    //     this.loading = false
    //     console.log("error", error);
    //   })
    // },
    // //根据表单进行精确查询：
    // queryAbility(){
    //   //查询列表
    //   this.isDisabledDel = true;
    //   this.roleInfoCheckArray = Object.assign([]);
    //   // this.loading = true;
    //   // 此处模拟数据，后期通信传入数据
    //   let resBody = new deliverAbilityQuery();
    //   resBody.data.ORGNO = this.roleQuery.ORGNO;
    //   resBody.data.ABILITYID = this.roleQuery.ABILITYID;
    //   resBody.data.pageflag = this.pageflag;
    //   resBody.data.currpage = this.currpage;
    //   resBody.data.pagerownum = this.pagerownum;
    //   request(resBody)
    //   .then(response=>{
    //     if(response.SYS_HEAD.ReturnCode === "000000") {
    //       this.loading=false;
    //       //查询概要信息存入按钮数组
    //       let list = Object.assign([],response.RSP_BODY.struct);
    //       console.log(list);
    //       for (let i = 0; i < list.length; i++) {
    //             this.roleInfoCheckArray.push(list[i]);
    //           }
    //         console.log("可选择项数组：");
    //         console.log(this.roleInfoCheckArray);
    //     } else {
    //       console.log(response);
    //     }
    //   })
    //   .catch(error=>{
    //     this.loading = false
    //     console.log("error", error);
    //   })
    // },
    //查询用户列表信息 ：
    checkUserList() {
      //查询
      this.tableData = [];
      // this.checkedUser = false;
      // this.isDisabledDel = false;
      this.branchNode = [];
      this.branchNode.push(this.branchNodeInfo.branchid);
      this.loading = true;
      let resBody = new inquireUser();
      resBody.data.branchIdList =this.branchNode;
      resBody.QueryPageNo = this.currentPage;
      resBody.QueryRowNum = this.pageSize;
      request(resBody)
        .then(response => {
         if (response.SYS_HEAD.ReturnCode === "000000") {
          //  console.log(response.RSP_BODY.UserList,"response.RSP_BODY.UserList")
            this.loading = false;
            // this.tableData = response.RSP_BODY.UserList;
            response.RSP_BODY.UserList.forEach(element => {
              if (element.UserID != "admin") {
                this.tableData.push(element);
              }
            });
            console.log("获取到的用户列表信息：")
            console.log(this.tableData)
          }
          // let list=response.RSP_BODY.roleInfoList
          // for(let i=0;i<list.length;i++){
          //    list[i].UserState=="0"? list[i].UserState="失效":(list[i].UserState=="1"?list[i].UserState="正常":list[i].UserState="锁定")
          // }
          // this.tableData =list;
        })
        .catch(error => {
            this.loading = false;          
          // this.logger.log("fail", error);
        });
    },
    //清空表单
    resetForm(){
      this.roleQuery = {};
      // this.initQueryAbility();
    },
    // 表格选中获取参数ID
    getInMatlID(scope, val) {
      //传递参数给子页面
      this.rowVal = val;
      this.UserID = val.UserID;
      console.log("当前选中交割物料信息：")
      console.log(val);
      if(val) {  
        this.isDisabledDel =false;
      }
    },
    // 查看当前行参数详情信息
    handleQueryParameter(index, row) {
     this.rowVal = row;
     this.dialogOptionsUpdateDetail.isShow = true;
    },
    openRoleSummary(){
      this.dialogOptionsUpdate.isShow=true;
    },
    openRoleDetail() {
      this.dialogOptionsUpdateDetail.isShow = true;
    },
    
    // delRole() {
    //   //删除角色：通过能力ID调用接口
    //   // resBody.data.roleId = this.roleManage.ABILITYID; 
    //       if (this.roleId) {
    //           this.$confirm('此操作将永久删除该交割能力相关信息, 是否继续?', '提示', {
    //           confirmButtonText: '确定',
    //           cancelButtonText: '取消',
    //           type: 'warning'
    //         }).then(() => {
    //           console.log("删除的能力ID：");
    //           console.log(this.roleId);
    //           this.$message({
    //             type: 'success',
    //             message: '删除成功!'
    //           });
    //         }).catch(() => {
    //           this.$message({
    //             type: 'info',
    //             message: '已取消删除'
    //           });          
    //         });
    //         //再次查询刷新
    //         this.initQueryAbility();
    //       }
    // }
  }
};
</script>


<style lang="scss"  scoped>
.headerRole {
  padding: 10px 10px;
  background: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
}
.roleBox {
  height: 555px;
  overflow-y: auto;
  padding: 10px;
}
.roleBox::-webkit-scrollbar {
  display: none;
}
.userBlock {
  margin-top: 10px;
  border: 1px solid #eee;
  box-sizing: border-box;
  height: 210px;
  box-sizing: border-box;
}
.contentRole {
  width: 95%;
  height: 598px;
  border: 1px solid #eee;
  border-radius: 3px;
  margin: 10px 0;
  overflow-y: auto;
}
.contentRole::-webkit-scrollbar {
  display: none;
}
.el-radio-group {
  padding: 10px;
}
.el-radio:first-child {
  margin-left: 10px;
}
.el-radio {
  display: inline-block;
  margin: 5px;
  width: 130px;
}
.roleBlock {
  border: 1px solid #eee;
  margin-right: 10px;
  border-radius: 3px;
  height: 610px;
  /* overflow: auto; */
}
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.el-card {
  margin-bottom: 10px;
  width: 100%;
}
.el-form-item {
  margin-left: 30px;
}
.el-form-item1 {
  margin-left: 10px;
}
.box2-button1 {
  width: 130px;
}
.block {
  width: 30%;
  text-align: center;
}
.dialog-text {
  display: inline-block;
  width: 100%;
  text-align: center;
  color: red;
  font-size: 18px;
}
.el-dialog__body {
  padding: 20px;
}
</style>
