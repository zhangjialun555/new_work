<template>
  <div>
    <el-dialog :visible.sync="isShow" title="新增角色"
      @close='closeRole'
      @open="openCreate" width="600px"
      v-loading="loading"
    element-loading-text="加载中。。。">
      <el-steps finish-status="success" :active='active' align-center>
        <el-step title='角色信息'></el-step>
        <el-step title='角色权限维护'></el-step>            
      </el-steps>
      <div  v-if="active==0">
        <el-card style="overflow:visible">
          <el-form ref="roleListAdd" :model="roleListAdd"  :rules="rulesRole"
            size="mini" label-width="120px" label-position="left">
              <el-row class="rowStyle" >
                <el-col :span="24">
                  <el-form-item label="角色名称:" prop="roleName">
                  <el-input v-model="roleListAdd.roleName" placeholder="请输入角色名称"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="rowStyle" :gutter="100">
              
                  <el-col :span="12">
                    <el-form-item label="适用机构:" prop="branchId">
                     <select-tree :checked-ids="roleListAdd.branchId" v-model="roleListAdd.branchId"  @selectCheck="getIds" style="width:170px;"
                      :props='{id:"branchId",label: "branchName",children: "childBranch"}' :tree-data="brnoList" :node-key="'branchId'" ></select-tree>
                     </el-form-item>
                  </el-col>
                                         
             
               <el-col :span="12" >
                    <el-form-item prop="childBranchUseFlag" label="可否管理子机构:">
                                    <el-switch v-model="roleListAdd.childBranchUseFlag"></el-switch>
                                </el-form-item>
                      <!-- <el-checkbox v-model="roleListAdd.childBranchUseFlag">子机构是否可见</el-checkbox> -->
                  </el-col>    
              </el-row>
              <el-row class="rowStyle">
                  <el-form-item label="所属渠道:" prop="aumsSystem">
                  <el-radio-group v-model="option.aumsSystem" disabled>
                      <el-radio  label="001">自助C端</el-radio>
                      <el-radio   label="002">自助V端</el-radio>
                  </el-radio-group>
                  </el-form-item>
              </el-row>
              <el-row class="rowStyle">
                  <el-form-item label="备注:" prop="remark">
                  <el-input type="textarea" :rows="1" v-model="roleListAdd.remark"></el-input>
                  </el-form-item>
              </el-row>
          </el-form> 
        </el-card>
        <el-row style="margin:20px 0;">
          <el-col :offset="10" :span="2">
            <el-button type="primary" size="mini" @click="addRole">完成并关联权限</el-button>
          </el-col>
        </el-row>   
      </div>
      <div   v-if="active==1">
        <el-card class="createRoleRelative">
          <el-tree-row
              :data="roleList"
              show-checkbox
              node-key="perssionId"
              ref="tree"
              highlight-current
              :props="defaultProps">
              </el-tree-row>
          </el-card>
          <el-row style="margin:20px 0;">
                <el-col :span="2" :offset="10">
                <el-button type="primary" size="mini" @click="roleRelative">关联权限</el-button>                          
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
import devRunList from "@/message/spinnerDataQuery/spinner-data-query";
import roleCreate from "@/message/userManage/role/role-create";
import roleRelative from "@/message/userManage/role/role-relative";
export default {
  components: { ElTreeRow, selectTree },
  props: { option: Object },
  data() {
    return {
      loading:false,
      roleId: "",
      brnoList: [],
      checkedIds: [],
      roleListAdd: {
        roleName: "",
        branchId: [],
        childBranchUseFlag: false,
        aumsSystem: "",
        remark: ""
      },
      roleList: [],
      defaultProps: {
        children: "perssionChild",
        label: "perssionName"
      },
      isChildren: false,
      isOrganization: 0,
      branchNo: [],
      rulesRole: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { max: 50, message: "角色名称少于50个字符", trigger: "blur" }
        ],
        branchId: [{ required: true, message: "请选择机构号", trigger: "change" }]
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
    }
  },
  created() {},
  methods: {
    closeRole() {
      this.roleListAdd = {
        roleName: "",
        branchId: [],
        childBranchUseFlag: false,
        aumsSystem: "",
        remark: ""
      };
      this.$emit("refreshTable");
      if (this.$refs["roleListAdd"]!=undefined) {
        this.$refs["roleListAdd"].clearValidate()//清楚表单验证
      }
    },
    getIds: function(arr) {
      this.roleListAdd.branchId = arr;
    },
    openCreate() {
      let resBody = new devRunList();
      resBody.data.spinnerList = [
        { spinnerName: "permission" },
        { spinnerName: "branch" }
      ];
      request(resBody)
        .then(response => {
          this.roleList = response.RSP_BODY.perssionTreeSpinner;
          // this.roleList.filter(function(val){
          //   console.log(val)
          //   console.log(this.option)
            
          //   // return val.roleSystem==this.option.aumsSystem
          // })
          this.brnoList = response.RSP_BODY.branchSpinner;
        })
        .catch(error => {
          console.error("查询错误", error);
        });
    },
    addRole() {
      this.$refs["roleListAdd"].validate(valid => {
        if (valid) {
          this.active = 1;
          this.loading=true;
          let resBody = new roleCreate();
          resBody.data.roleName = this.roleListAdd.roleName;
          resBody.data.branchId = this.roleListAdd.branchId[0];
          resBody.data.childBranchUseFlag = this.roleListAdd.childBranchUseFlag;
          resBody.data.aumsSystem = this.option.aumsSystem;
          resBody.data.remark = this.roleListAdd.remark;
          request(resBody)
            .then(response => {
              if (response.SYS_HEAD.ReturnCode === "000000") {
                this.loading=false;                
                this.roleId = response.REQ_BODY.roleId;
                this.$message({
                  type: "success",
                  message: "角色创建成功!请为角色关联权限。"
                });
                this.$emit("refreshTable");
              }else{
                this.loading=false;                                
              }
            })
            .catch(error => {
                this.loading=false;                              
              console.log(error);
            });
        } else {
          this.$message({
            type: "warning",
            message: "请输入合法的数据！"
          });
          return false;
        }
      });
    },
    roleRelative() {
      let resBody = new roleRelative();
      resBody.data.permissionIdList = this.$refs.tree.getCheckedKeys();
      resBody.data.roleId = this.roleId;
      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.$message({
              type: "success",
              message: "角色关联成功!"
            });
            this.isShow = false;
            // this.$emit("refreshTable");
          }
        })
        .catch(error => {
          this.$message({
            type: "info",
            message: error
          });
        });
    }
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
