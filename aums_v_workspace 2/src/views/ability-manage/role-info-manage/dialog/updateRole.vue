<template>
    <div>
        <el-dialog :visible.sync="isShow" title="修改能力概要"  width="650px"  :close-on-click-modal="false"
         @open="openRole" 
         @close="closeRole"
          v-loading="loading"
    element-loading-text="加载中。。。">
            <div>
                 <el-card style="overflow:visible">
                    <el-form ref="roleListUpdate" :model="currentRowList"  :rules="rulesRole"
                    size="mini"  label-width="120px" label-position="left">
                        <el-row class="rowStyle">
                            <el-col :span="24">
                            <el-form-item label="能力名称:" prop="roleName">
                            <el-input v-model="currentRowList.ABILITYNAME" maxlength="50" placeholder="请输入能力名称"></el-input>
                            </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row class="rowStyle">
                            <el-col :span="24">
                            <el-form-item label="机构号:" prop="roleName">
                            <el-input v-model="currentRowList.ORGNO" placeholder="请输入机构号"></el-input>
                            </el-form-item>
                            </el-col>
                        </el-row>
                          <el-row class="rowStyle">
                            <el-col :span="24">
                            <el-form-item label="是否全能:" prop="roleName">
                            <!-- <el-input v-model="currentRowList.ISITOMNT" ></el-input> -->
                            <el-switch v-model="currentRowList.ISITOMNT"></el-switch>
                            </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form> 
                </el-card>
                <el-row style="margin:20px 0;text-align:right">
                        <el-button  size="mini" @click="isShow=false">取消</el-button>
                        <el-button type="primary" size="mini" @click="updateRole">确认</el-button>
                </el-row>   
            </div>
        </el-dialog>
    </div>
</template>

<script>
import selectTree from "@/components/selectTree2/";
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
import roleUpdate from "@/message/userManage/role/role-update";
import devRunList from '@/message/spinnerDataQuery/spinner-data-query';

export default {
    components: { selectTree },
  props: { option: Object },
  data() {
    return {
      loading:false,
      roleListUpdate: {},
      roleList: ["1001"],
      roleState: [
        { label: "失效", value: "0" },
        { label: "正常", value: "1" },
        { label: "锁定", value: "2" }
      ],
      brnoList: [],
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
    currentRowList: {
      get: function() {
       this.roleListUpdate = Object.assign({},this.option.currentRowList);
      //  for(var key in this.roleListUpdate){
      //    if (key=="branchId") {
      //      this.roleListUpdate[key]=[this.roleListUpdate[key]]
      //      break;
      //    }
      //  }
       return this.roleListUpdate
      }
    }
  },
  created() {},
  methods: {
    getIds: function(arr) {
      this.currentRowList.branchId = arr;
    },
    closeRole(){
      this.$refs.roleListUpdate.clearValidate();
    },
    openRole(){
       let resBody = new devRunList();
      resBody.data.spinnerList = [{ spinnerName: "branch" }];
      request(resBody)
        .then(response => {
          this.brnoList = response.RSP_BODY.branchSpinner;
        })
        .catch(error => {
          console.error("错误信息", error);
        });
    },
    updateRole() {
       this.$refs["roleListUpdate"].validate(valid => {
        if (valid) {
          this.loading=true;
          let resBody = new roleUpdate();
          resBody.data.roleId = this.currentRowList.roleId;
          resBody.data.roleName = this.currentRowList.roleName;
          resBody.data.branchId = typeof(this.currentRowList.branchId)=="string"?this.currentRowList.branchId:this.currentRowList.branchId[0];
          resBody.data.childBranchUseFlag = this.currentRowList.childuseable;
          resBody.data.roleState = this.currentRowList.roleState;
          resBody.data.remark = this.currentRowList.remark;
          request(resBody)
            .then(response => {
              if (response.SYS_HEAD.ReturnCode === "000000") {
                this.loading=false;                
                this.$message({
                  type: "success",
                  message: "角色修改成功!"
                });
                this.option.isShow = false;
                this.$emit("refreshTable");
              }else{
                this.loading=false;                                
              }
            })
            .catch(error => {
                this.loading=false;                              
              this.$message({
                type: "info",
                message: error
              });
            });
          }else {
          this.$message({
            type: "warning",
            message: "请输入合法的数据！"
          });
          return false;
        }
      })
    }
  }
};
</script>

<style lang="scss"  scoped>
.rowStyle {
  margin-bottom: 10px;
}
</style>
