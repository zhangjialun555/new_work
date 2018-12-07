<template>
  <div>
    <el-dialog title="交易详情"
    :lock-scroll=false @open="openCollback"
    :visible.sync="isShow" width="800px">
      <el-card style="margin-bottom:10px">
        <el-form :model="tradeSceneInfo" label-position="left" size="mini" label-width="80px">
           <el-row :gutter="10">
            <el-col :md="24" :lg="12">
              <el-form-item label="交易代码">
                <el-input v-model="tradeSceneInfo.TRANCODE" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="24" :lg="12">
              <el-form-item label="交易场景ID">
                <el-input v-model="tradeSceneInfo.SCENECODE" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :md="24" :lg="12">
              <el-form-item label="交易场景名称">
                <el-input v-model="tradeSceneInfo.SCENECODENAME" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="24" :lg="12">
              <el-form-item label="必要输入物料组ID">
                <el-input v-model="tradeSceneInfo.NECYINMATLGROUPID" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
         
          <el-row :gutter="10">
            <el-col :md="24" :lg="12">
              <el-form-item label="输入物料组名称">
                <el-input v-model="tradeSceneInfo.INMATLGROUPNAME" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="24" :lg="12">
              <el-form-item label="输入物料组ID">
                <el-input v-model="tradeSceneInfo.INMATLGROUPID" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :md="24" :lg="12">
              <el-form-item label="输出物料组名称">
                <el-input v-model="tradeSceneInfo.OUTMATLGROUPNAME" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="24" :lg="12">
              <el-form-item label="输出物料组ID">
                <el-input v-model="tradeSceneInfo.OUTMATLGROUPID" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :md="24" :lg="12">
              <el-form-item label="维护机构">
                <el-input v-model="tradeSceneInfo.MODORGNO" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="24" :lg="12">
              <el-form-item label="维护用户">
                <el-input v-model="tradeSceneInfo.MODUSER" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :md="24" :lg="12">
              <el-form-item label="维护日期">
                <el-input v-model="tradeSceneInfo.MODDATE" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="24" :lg="12">
              <el-form-item label="维护时间">
                <el-input v-model="tradeSceneInfo.MODTIME" disabled></el-input>
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
      tradeSceneInfo:[],
      currentPage: 1,
      loading: false,
    };
  },
  created(){
    
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
    //获取当前行信息：
    getInfo(){
      this.tradeSceneInfo = this.paramObj;
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    // 打开dialog回调
    openCollback() {
      console.log("获取到数据：");
      console.log(this.paramObj);
      this.getInfo();
    },
  }
};
</script>

<style scope>

</style>