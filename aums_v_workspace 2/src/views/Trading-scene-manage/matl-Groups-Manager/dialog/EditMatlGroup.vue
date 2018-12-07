<template>
	<div>
    <el-dialog title="编辑物料组概要信息" @open="openCollback" @close="closeDialog"
    :lock-scroll=false
    :visible.sync="isShow" width="1000px">
      <!-- 场景信息 -->
      <el-card style="margin-bottom:10px;">
        <el-form :model="MatlGroupsManageInfo" ref="MatlGroupsManageInfo" :rules="MatlGroupRules"   size="mini" label-position="left" label-width="80px" >
          <el-row :gutter="10">
            <el-col :md="12" :lg="12">
               <el-form-item label="交易代码" prop="TRANCODE" label-width="100px">
                <el-input v-model="MatlGroupsManageInfo.TRANCODE"
                 disabled
                placeholder="请输入交易代码"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="12">
              <el-form-item label="物料组名称" prop="MATLGROUPNAME" label-width="100px">
                <el-input v-model="MatlGroupsManageInfo.MATLGROUPNAME"
                 :disabled="inputDisabled" maxlength="50"
                placeholder="请输入物料组名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-col :md="12" :lg="12" >
               <el-form-item label="英文简称" label-width="100px" prop="MATLGROUPENNAME">
                <el-input v-model="MatlGroupsManageInfo.MATLGROUPENNAME" 
                 :disabled="inputDisabled" maxlength="50"
                placeholder="请输入交易代码"></el-input>
              </el-form-item>
            </el-col>
          <el-row :gutter="10">
            <el-col :md="12" :lg="12">
               <el-form-item label="物料组性质" prop="MATLGROUPROS" label-width="100px">
                <!-- <el-input v-model="MatlGroupsManageInfo.MATLGROUPROS"
                 :disabled="inputDisabled"
                placeholder="请选择物料组性质"></el-input> -->
                <el-select v-model="MatlGroupsManageInfo.MATLGROUPROS" placeholder="请选择物料组性质">
                  <el-option
                    v-for="item in matlSelectType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :md="12" :lg="12">
              <el-form-item label="物料组描述" prop="MATLGROUPDSCP" label-width="100px">
                <el-input v-model="MatlGroupsManageInfo.MATLGROUPDSCP"
                 :disabled="inputDisabled" maxlength="200"
                placeholder="请输入物料组描述"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
    	</el-card>  
        <div slot="footer" class="dialog-footer" style="text-align:center;">
          <el-button  type="primary" size="mini" style="margin-top: 10px;"
          @click="EditMatlSummaryInfo('MatlGroupsManageInfo')">确认修改</el-button>
        </div>
    </el-dialog>
	</div>
</template>

<script>
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
import matlGroupInfoManage from "@/message/Tradingscenemanage/matlGroupsManager/matlGroupInfoManage";
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
      // 页面号
      active:0,
      //页面
      currentName:'first',
      //定义维护结构：
      MatlGroupsManageInfo:{
        //概要维护
        OPERTYPE:'',//操作类型
        TRANCODE:'',//交易代码
        MATLGROUPID:'',//物料组ID
        MATLGROUPENNAME:'',//英文名称
        MATLGROUPNAME:'',//物料组名称
        MATLGROUPDSCP:'',//物料组描述
        MATLGROUPROS:'',//物料组性质
        MODORGNO:'',//维护机构
        MODUSER:'',//维护用户 
      },
      matlSelectType:[
        {
          value: '03',
          label: '必要输入物料组'
        },
        {
          value: '01',
          label: '场景物料组'
        },
        {
          value: '02',
          label: '输出物料组'
        },
      ],

      moveClass: false,
      inputDisabled: false,
      // dataRules: {},
      MatlGroupRules: {
        TRANCODE: [{ required: true, message: "请输入交易代码", trigger: "blur" }
        ],
        MATLGROUPNAME: [{ required: true, message: "请输入物料组名称", trigger: "blur" }],
        MATLGROUPENNAME: [{ required: true, message: "请输入物料组英文简称", trigger: "blur" }],
        MATLGROUPDSCP: [{ required: true, message: "请输入物料组描述", trigger: "blur" }],
        VOUNUM: [{ required: true, message: "请输入凭证数量", trigger: "blur" }],
        MATLGROUPROS: [{ required: true, message: "请选择物料组类型", trigger: "change" }],
      },
      // tempRules: {
      //   data: [
      //     { required: true, message: "请输入您要设定的值", trigger: "blur" }
      //   ],
      //   paramKey: [{ validator: checkparamKey, trigger: "blur" }],
      //   paramDesc: [{ validator: checkparamDesc, trigger: "blur" }]
      // },
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
     //确定维护机构和维护用户的值：
    getOrgnoInfo(){
      this.MODORGNO = this.$store.getters.branchId;
      this.MODUSER = this.$store.getters.userId;
    } , 
    EditMatlSummaryInfo(formName){
       this.$refs[formName].validate((valid) => {
          if (valid) {
            //此处执行修改操作
      let resBody = new  matlGroupInfoManage();
        resBody.data.OPERTYPE = "2";
        resBody.data.MATLGROUPID = this.rowData.MATLGROUPID;
        resBody.data.TRANCODE = this.MatlGroupsManageInfo.TRANCODE;
        resBody.data.MATLGROUPNAME = this.MatlGroupsManageInfo.MATLGROUPNAME;
        resBody.data.MATLGROUPENNAME = this.MatlGroupsManageInfo.MATLGROUPENNAME;
        resBody.data.MATLGROUPDSCP = this.MatlGroupsManageInfo.MATLGROUPDSCP;
        resBody.data.MATLGROUPROS = this.MatlGroupsManageInfo.MATLGROUPROS;
        resBody.data.MODORGNO=this.MODORGNO;
        resBody.data.MODUSER=this.MODUSER; 
        request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
        //得到返回码中的物料组ID进行后续操作
        this.matlGroupId = response.RSP_BODY.MATLGROUPID;
        this.$message({
          message: '修改成功！',
          type: 'success'
        });
        this.$parent.queryMatlSummaryInfo();
        this.option.isShow=false;//关闭弹窗
        } else {
           this.$message({
          message:response.SYS_HEAD.ReturnMessage ,
          type: 'error  '
          });
          console.log(response);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    openCollback(){
      console.log("rowdata:",this.rowData)
      // this.MatlGroupsManageInfo=this.rowData;
      for(var key in this.rowData){//回显数据
        this.MatlGroupsManageInfo[key] = this.rowData[key];
      }
    },
    closeDialog() {
      this.active=0;
      this.$nextTick(() => {
        this.$refs["MatlGroupsManageInfo"].clearValidate();
      });
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
