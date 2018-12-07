<template>
  <div>
    <el-dialog title="物料组详情"
    :lock-scroll=false @open="openCollback"
    :visible.sync="isShow" width="800px">
      <el-card style="margin-bottom:10px">
        <el-form :model="formInline" label-position="left" size="mini" label-width="80px">
           <el-row :gutter="10">
            <el-col :md="24" :lg="12">
              <el-form-item label="交易代码">
                <el-input v-model="formInline.paramDesc" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="24" :lg="12">
              <el-form-item label="物料组性质">
                <el-select v-model="formInline.devDForm" disabled>
                    <el-option
                    v-for="item in devFormSpinner"
                    :key="item.devForm"
                    :value="item.devForm"
                    :label="item.devFormName"
                    ></el-option>
                  </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :md="24" :lg="12">
              <el-form-item label="物料组名称">
                <el-input v-model="formInline.paramKey" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="24" :lg="12">
              <el-form-item label="物料组ID">
                <el-input v-model="formInline.paramDesc" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
         
          <el-row :gutter="10">
            <el-col :md="24" :lg="12">
              <el-form-item label="是否可复用">
                <el-input v-model="formInline.paramKey" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="24" :lg="12">
              <el-form-item label="币种">
                <el-input v-model="formInline.paramKey" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :md="24" :lg="12">
              <el-form-item label="凭证类型">
                <el-input v-model="formInline.paramKey" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="24" :lg="12">
              <el-form-item label="处理模式">
                <el-input v-model="formInline.paramDesc" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :md="24" :lg="12">
              <el-form-item label="是否影像化">
                <el-input v-model="formInline.paramKey" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="24" :lg="12">
              <el-form-item label="影像化要求">
                <el-input v-model="formInline.paramDesc" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :md="24" :lg="12">
              <el-form-item label="维护机构">
                <el-input v-model="formInline.paramKey" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="24" :lg="12">
              <el-form-item label="维护用户">
                <el-input v-model="formInline.paramDesc" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :md="24" :lg="12">
              <el-form-item label="维护日期">
                <el-input v-model="formInline.paramKey" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="24" :lg="12">
              <el-form-item label="维护时间">
                <el-input v-model="formInline.paramDesc" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="isShow = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
import paramDetailinfoQuery from '@/message/parameterManage/param-detailinfo-query'
import spinnerDataQuery from '@/message/spinnerDataQuery/spinner-data-query';

export default {
  props: {
    option: Object,
    paramObj: Object
  },
  data() {
    return {
      formInline: {
        devDForm: null,
        cDevProgram: null
      },
      devFormSpinner: [],
      cProgramList: [],
      // paramForm: {
      //   paramKey: "",
      //   paramDesc: "",
      //   paramID: ""
      // },
      currentPage: 1,
      loading: false,
      devTableData: []
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
    paramForm: function() {
      return this.paramObj
    }
  },
  methods: {
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },

    // 初始化下拉框
    initSpinnerList() {
      let resBody = new spinnerDataQuery();
      resBody.data.spinnerList = [
        { spinnerName: "devForm" },
        { spinnerName: "cProgram" }
      ];
      request(resBody)
        .then(response => {
          this.cProgramList = response.RSP_BODY.cProgramSpinner;
          this.devFormSpinner = response.RSP_BODY.devFormSpinner
          console.log(this.cProgramList)
        })
        .catch(error => {
          console.error("查询错误", error);
        });
    },

    // 打开dialog回调
    openCollback() {
      this.initSpinnerList()
      this.paramQueryDetailinfo()
      this.formInline.paramKey = this.paramForm.paramKey
      this.formInline.paramDesc = this.paramForm.paramDesc
      this.formInline.paramValue = this.paramForm.paramValue
    },
    // 获取devinfo
    paramQueryDetailinfo() {
      let resBody = new paramDetailinfoQuery()
      resBody.data.paramID = this.paramObj.paramID
      resBody.QueryPageNo = this.currentPage
      resBody.QueryRowNum = getGlobalParams.get("PageSize")
      request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          console.log(response)
          this.devTableData = response.RSP_BODY.paramDevInfoList || []
          this.formInline.devDForm = response.RSP_BODY.releaseBaseInfo[0].devForm || ""
          this.formInline.cDevProgram = response.RSP_BODY.paramAppInfoList || []
        } else {
          console.log(response);
        }
      })
      .catch(error=>{
        console.log("error", error);
      })
    }
    
  }
};
</script>

<style scope>

</style>