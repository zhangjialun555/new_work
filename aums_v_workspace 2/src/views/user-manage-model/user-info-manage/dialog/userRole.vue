<template>
  <div>
    <el-card :visible.sync="isShow">
      <div slot="header" class="clearfix">
        <span>C端角色</span>
      </div>
      <el-row>
          <div  class="userRoleContent">
            <el-row :gutter="20">
              <el-col :span="12">
                <!-- <div class="userRoleBox"> -->
                    <!-- <el-transfer
                    filterable
                    v-model="roleItems"
                    :props="{
                    key: 'roleId',
                    label: 'roleName'
                    }"
                    :data="roleListC"
                    :titles="['角色列表','用户角色']">
                    </el-transfer> -->
                    
                      <!--  -->
                    <el-table :data="roleListC" ref="roleListC" border class="tableMarginTop" height="288"
                      highlight-current-row
                      @selection-change="handleCurrentChangeC"
                      header-row-class-name="tableHeaderClass">
                        <el-table-column type="selection" width="40px"></el-table-column>
                        <el-table-column prop="roleName" 
                                        label="用户角色">
                        </el-table-column>
                    </el-table>
                <!-- </div> -->
              </el-col>
              <el-col :span="12">
                  <div class="role">
                    <div class="roleHeader">
                        角色权限列表
                    </div>
                    <div class="roleContent">
                      <el-scrollbar style="height:100%">
                        <ul>
                          <li v-for="item in permissionIdListC" :key="item.id">{{item}}</li>
                        </ul>
                      </el-scrollbar>
                    </div>
                  </div> 
              </el-col>
            </el-row>
             
                
          </div>
                              
      </el-row>
    </el-card>
     <el-card :visible.sync="isShow" style="margin-top:10px">
       <div slot="header" class="clearfix">
          <span>V端角色</span>
        </div>
         <div  class="userRoleContent">
           <el-row :gutter="20">
            <el-col :span="12">
                <el-table :data="roleListV" ref="roleListV" border class="tableMarginTop" height="288"
                    highlight-current-row
                     @selection-change="handleCurrentChangeV"
                      header-row-class-name="tableHeaderClass">
                      <el-table-column type="selection" width="40px"></el-table-column>
                      <el-table-column prop="roleName" 
                                      label="用户角色">
                      </el-table-column>
                  </el-table>
                <!-- <el-transfer
                filterable
                v-model="roleItems"
                :props="{
                key: 'roleId',
                label: 'roleName'
                }"
                :data="roleListV"
                :titles="['角色列表','用户角色']">
                    </el-transfer> -->
            </el-col>
            <el-col :span="12">
                <div class="role">
                  <div class="roleHeader">
                      角色权限列表
                  </div>
                  <div class="roleContent">
                    <el-scrollbar style="height:100%">
                      <ul>
                        <li v-for="item in permissionIdListV" :key="item.id">{{item}}</li>
                      </ul>
                    </el-scrollbar>
                  </div>
                </div>
            </el-col>
           </el-row>
        </div>  
    </el-card>
      <el-row style="margin:20px; text-align:center">
          <el-button  size="mini" @click="cancleRole">取消</el-button>
          <el-button type="primary" size="mini" @click="sureRole">确定</el-button>      
      </el-row>
  </div>
</template>
<script>
import devRunList from "@/message/spinnerDataQuery/spinner-data-query";
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
import userRoleAssocial from "@/message/userManage/user/user-role-associal";

export default {
  props: { option: Object },
  data() {
    return {
      permissionIdListC: [],
      permissionIdListV: [],
      roleList: [],
      roleListV: [],
      roleListC: [],
      roleItemsC: [],
      roleItemsV: [],
      roleItems: []
    };
  },
  methods: {
    roleChange() {
      this.permissionIdListC = Object.assign([]);
      this.permissionIdListV = Object.assign([]);
      this.roleListC.forEach(element => {
        if (this.roleItems) {
          if (this.roleItems.indexOf(element.roleId) > -1) {
            this.$refs.roleListC.toggleRowSelection(element)
            element.permissionIdList.forEach(element1 => {
              this.permissionIdListC.push(element1);
            });
          }
        }
      });
      this.roleListV.forEach(element => {
        if (this.roleItems) {
          if (this.roleItems.indexOf(element.roleId) > -1) {
            this.$refs.roleListV.toggleRowSelection(element)            
            element.permissionIdList.forEach(element1 => {
              this.permissionIdListV.push(element1);
            });
          }
        }
      });
    },
    cancleRole() {
      this.option.isShow = false;
      this.$emit("systemClose");
    },
    handleCurrentChangeV(selection,val){
      this.permissionIdListV=[]
      this.roleItemsV=[]
      selection.forEach(element => {
        this.roleItemsV.push(element.roleId)
        if(element.hasOwnProperty("permissionIdList")){
          this.permissionIdListV=this.permissionIdListV.concat(element.permissionIdList)
        }
      });
    } ,   
    handleCurrentChangeC(selection,val){
      this.permissionIdListC=[]
      this.roleItemsC=[]      
      selection.forEach(element => {
        this.roleItemsC.push(element.roleId)        
        if(element.hasOwnProperty("permissionIdList")){
          this.permissionIdListC=this.permissionIdListC.concat(element.permissionIdList)
        }
      });
    } , 
    sureRole() {
      this.roleItems=this.roleItemsC.concat(this.roleItemsV)
      let resBody = new userRoleAssocial();
      (resBody.data.userId = this.option.userId),
      (resBody.data.roleIdList = this.roleItems),
        request(resBody)
          .then(response => {
            if (response.SYS_HEAD.ReturnCode === "000000") {
              this.isShow = false;
              this.$emit("systemClose");
              this.$message({
                type: "success",
                message: "用户关联角色成功!"
              });
            }
          })
          .catch(error => {
            this.$message({
              type: "info",
              message: error
            });
          });
    }
  },
  watch: {
    option: {
      handler: function (val, oldVal) {
       this.option.hasOwnProperty("roleIdList")
      ? (this.roleItems = this.option.roleIdList)
      : "";
      this.roleChange();
        },
        deep: true
    }
  },
  created() {
    this.option.hasOwnProperty("roleIdList")
      ? (this.roleItems = this.option.roleIdList)
      : "";
    //角色列表初始化
    let resBody = new devRunList();
    resBody.data.spinnerList = [{ spinnerName: "role" }];
    request(resBody)
      .then(response => {
        let roleList = response.RSP_BODY.roleListSpinner;
        for (let i = 0; i < roleList.length; i++) {
          if (roleList[i].aumsSystem === "001") {
            this.roleListC.push(roleList[i]);
          } else if (roleList[i].aumsSystem === "002") {
            this.roleListV.push(roleList[i]);
          }
        }
        this.roleChange();
      })
      .catch(error => {
        console.error("查询错误", error);
      });
  },
  computed: {
    isShow: {
      get() {
        return this.option.isShow;
      },
      set(value) {
        this.option.isShow = value;
      }
    }
    // roleItems: {
    //   get() {
    //     if(this.option.hasOwnProperty("roleIdList")){
    //       return this.option.roleIdList;
    //     }
    //     else{
    //       return [];
    //     }
    //   },
    //   set(value) {
    //     this.option.roleIdList = value;
    //   }
    // }
  }
};
</script>

<style scoped lang="scss"  scoped>
.userRoleContent {
  width: 100%;
  height: 300px;
  .userRoleBox {
    width: 592px;
    float: left;
  }
  .role {
    margin-top:20px;
    display: inline-block;
    height: 288px;
    width: 100%;
    border: 1px solid #ebeef5;
    .roleHeader {
      height: 50px;
      line-height: 40px;
      background: #f7f7f7;
      padding-left: 10px;
      box-sizing: border-box;
      border-bottom: 1px solid #ebeef5;
    }
    .roleContent {
      height: 236px;
      overflow: auto;
    }
    .roleContent::-webkit-scrollbar {
      display: none;
    }
  }
}
.header {
  padding: 10px;
  font-size: 20px;
}
.el-transfer-panel__body {
  height: 200px;
}

.el-dialog__body {
  padding-top: 10px;
}
li {
  list-style: none;
}
</style>
