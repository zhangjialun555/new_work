<template>
  <div>
    <el-dialog :visible.sync="isShow" title="权限关联" @open="openRelative" width="600px">
      <el-card class="coll_h">
        <el-tree
          :data="roleList"
          :props="defaultProps"
          show-checkbox
          ref="tree"
          node-key="perssionId"
          :default-checked-keys='optionRelative.selectItem'
          highlight-current
          >
        </el-tree>
        <!-- </el-tree>
            <el-tree-row
                :data="option.roleList"
              show-checkbox
              default-expand-all
              node-key="perssionId"
              ref="tree"
              :default-checked-keys='option.selectItem'
              highlight-current
              :props="defaultProps"
              >
              </el-tree-row>  -->
      </el-card>
      <el-row>
        <div style="margin:20px 0;text-align:center">
          <el-button  size="mini" @click="isShow=false">取消</el-button>                  
          <el-button type="primary" size="mini" style="margin-top:10px;" @click="sureRoleRelative">确定</el-button>
        </div>
      </el-row> 
    </el-dialog>
  </div>
</template>
<script>
import ElTreeRow from "@/components/tree";
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
import roleRelative from "@/message/userManage/role/role-relative";
import devRunList from '@/message/spinnerDataQuery/spinner-data-query'

export default {
  components: { ElTreeRow },
  props: { optionRelative: Object },
  data() {
    return {
      roleList:[],
      defaultProps: {
        id: "perssionId",
        children: "perssionChild",
        label: "perssionName"
      }
    };
  },
  computed: {
    isShow: {
      get() {
        return this.optionRelative.isShow;
      },
      set(value) {
        this.optionRelative.isShow = value;
      }
    }
  },
  methods: {
    openRelative() {
       //权限初始化
    let resBody=new devRunList()
    resBody.data.spinnerList=[{ spinnerName: "permission" }];
    request(resBody)
    .then(response=>{
      this.roleList=[];
      let temp=response.RSP_BODY.perssionTreeSpinner;
      for (let i = 0; i < temp.length; i++) {
        if (temp[i].AUMSChannel==this.optionRelative.currentRowList.roleSystem) {
          this.roleList.push(temp[i])
        }
        
      }
      console.log(this.roleList)
        // this.roleList =response.RSP_BODY.perssionTreeSpinner;
    })
    .catch(error=>{
         console.error("查询错误", error);
    })
      this.$nextTick(() => {//如果想要真正地在DOM加载完成后拿到数据，就需要调用VUE的全局api
        this.$refs.tree.setCheckedKeys(this.optionRelative.selectItem);
      });
    },
    sureRoleRelative() {
      let resBody = new roleRelative();
      resBody.data.permissionIdList = this.$refs.tree.getCheckedKeys();
      resBody.data.roleId = this.optionRelative.currentRowList.roleId;
      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.isShow = false;
            this.$message({
              type: "success",
              message: "角色关联成功!"
            });
           this.$emit("refreshTable");
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

<style lang="scss" scoped>
.coll_h {
  height: 400px;
  overflow-y: auto;
}
.coll_h::-webkit-scrollbar {
  //overflow 出现滚动条，将滚动条隐藏；
  display: none;
}
</style>
