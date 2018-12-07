<template>
	<div>
    <el-dialog title="新增尾箱" @open="openCollback" @close="closeDialog"
    :lock-scroll=false
    :visible.sync="isShow" width="1000px">
      <el-card style="margin-bottom:10px;">
        <el-form :model="tailBox" ref="tailBox"   size="mini" label-position="left" label-width="80px" >
          <el-row :gutter="10">
            <el-col :md="12" :lg="12">
               <el-form-item label="网点号" >
                <el-input v-model="tailBox.ORGNO"
                 :disabled="inputDisabled"
                placeholder="请输入网点号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="12">
              <el-form-item label="尾箱号" prop="paramKey">
                <el-input v-model="tailBox.TAILBOX"
                 :disabled="inputDisabled"
                placeholder="请输入尾箱号"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :md="12" :lg="12">
              <el-form-item label="尾箱类型" prop="paramKey">
                <el-input v-model="tailBox.TAILBOXTYPE"
                :disabled="inputDisabled"
                placeholder="请选择尾箱类型"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="12">
              <el-form-item label="用户号" prop="paramKey">
                <el-input v-model="tailBox.USERNO"
                 :disabled="inputDisabled"
                placeholder="请输入用户号"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
    	</el-card>  
        <div slot="footer" class="dialog-footer" style="text-align:center;">
          <el-button  type="primary" size="mini" style="margin-top: 10px;"
          @click="addTailBox()">确定</el-button>
        </div>
    </el-dialog>
	</div>
</template>

<script>
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
import TrunkManage from "@/message/trunkmanage/TrunkManage";
export default {
  props: {
    option: Object,
    rowData: Object
  },
  data() {
    return {
      //尾箱信息
      tailBox:{
        OPERTYPE:'',//操作类型
        ORGNO:'',//网点类型
        TAILBOX:'',//尾箱号
        TAILBOXTYPE:'',//尾箱类型
        USERNO:'',//用户号
      },
      inputDisabled: false,
      // dataRules: {},
      tempRules: {
        data: [
          { required: true, message: "请输入您要设定的值", trigger: "blur" }
        ],
       
      }
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
    tableDataRow: function() {
      return this.rowData;
    }
  },
  created() {},
  methods: {
    addTailBox(){
      let resBody = new TrunkManage();
      this.tailBox.OPERTYPE="1";
      resBody.data = this.tailBox;
      request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.$message({
          message: '添加成功！',
          type: 'success'
        });
        this.option.isShow = false;
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

    },
    //关闭弹窗时清空temp数据
    closeDialog() {
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
