<template>
  <div>
    <!-- 输入详细信息 -->
    <el-dialog title="物料详情"
    :lock-scroll=false @open="openCollback('In')"
    :visible.sync="isShow" width="800px">
      <el-card style="margin-bottom:10px">
        <el-form :model="matlInQuery" label-position="left" size="mini" label-width="80px">
          <el-row :gutter="10">
            <el-col :md="24" :lg="12">
              <el-form-item label="物料名称">
                <el-input v-model="matlInQuery.MATLNAME" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="24" :lg="12">
              <el-form-item label="物料ID">
                <el-input v-model="matlInQuery.MATLID" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :md="24" :lg="12">
              <el-form-item label="英文简称">
                <el-input v-model="matlInQuery.MATLENNAME" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="24" :lg="12">
              <el-form-item label="物料类型">
                <el-input v-model="matlInQuery.MATLTYPE" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :md="24" :lg="12">
              <el-form-item label="是否可复用">
                <el-input v-model="matlInQuery.ISMUX" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="24" :lg="12">
              <el-form-item label="币种">
                <el-input v-model="matlInQuery.CCY" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :md="24" :lg="12">
              <el-form-item label="凭证类型">
                <el-input v-model="matlInQuery.VOUTYPE" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="24" :lg="12">
              <el-form-item label="处理模式">
                <el-input v-model="matlInQuery.PROCESSMODE" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :md="24" :lg="12">
              <el-form-item label="是否影像化">
                <el-input v-model="matlInQuery.ISIMAGE" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="24" :lg="12">
              <el-form-item label="影像化要求">
                <el-input v-model="matlInQuery.IMAGEFLAG" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :md="24" :lg="12">
              <el-form-item label="维护机构">
                <el-input v-model="matlInQuery.MODORGNO" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="24" :lg="12">
              <el-form-item label="维护用户">
                <el-input v-model="matlInQuery.MODUSER" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :md="24" :lg="12">
              <el-form-item label="维护日期">
                <el-input v-model="matlInQuery.MODDATE" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="24" :lg="12">
              <el-form-item label="维护时间">
                <el-input v-model="matlInQuery.MODTIME" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="isShow = false">关 闭</el-button>
      </span>
    </el-dialog>

    <!-- 输出详细信息 -->
    <el-dialog title="物料详情"
    :lock-scroll=false @open="openCollback"
    :visible.sync="isShow1" width="800px">
      <el-card style="margin-bottom:10px">
        <el-form :model="matlOutQuery" label-position="left" size="mini" label-width="80px">
          <el-row :gutter="10">
            <el-col :md="24" :lg="12">
              <el-form-item label="物料名称">
                <el-input v-model="matlOutQuery.MATLNAME" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="24" :lg="12">
              <el-form-item label="物料ID">
                <el-input v-model="matlOutQuery.MATLID" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :md="24" :lg="12">
              <el-form-item label="英文简称">
                <el-input v-model="matlOutQuery.MATLENNAME" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="24" :lg="12">
              <el-form-item label="物料类型">
                <el-input v-model="matlOutQuery.MATLTYPE" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :md="24" :lg="12">
              <el-form-item label="币种">
                <el-input v-model="matlOutQuery.CCY" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :md="24" :lg="12">
              <el-form-item label="凭证类型">
                <el-input v-model="matlOutQuery.VOUTYPE" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="24" :lg="12">
              <el-form-item label="处理模式">
                <el-input v-model="matlOutQuery.PROCESSMODE"  disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :md="24" :lg="12">
              <el-form-item label="是否控号">
                <el-input v-model="matlOutQuery.ISCONTROLNO" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="24" :lg="12">
              <el-form-item label="控号方式">
                <el-input v-model="matlOutQuery.CONTROLMODE" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :md="24" :lg="12">
              <el-form-item label="维护机构">
                <el-input v-model="matlOutQuery.MODORGNO" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="24" :lg="12">
              <el-form-item label="维护用户">
                <el-input v-model="matlOutQuery.MODUSER" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :md="24" :lg="12">
              <el-form-item label="维护日期">
                <el-input v-model="matlOutQuery.MODDATE" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="24" :lg="12">
              <el-form-item label="维护时间">
                <el-input v-model="matlOutQuery.MODTIME" disabled></el-input>
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
import InMatlQuery from "@/message/matlManage/InMatlQuery";
import IsExist from "@/message/matlManage/IsExist";
import OutMatlQuery from "@/message/matlManage/OutMatlQuery";
import InMatlManage from "@/message/matlManage/InMatlManage";
import OutMatlManage from "@/message/matlManage/OutMatlManage";
import InMatlCollModel from "@/message/matlManage/InMatlCollModel";
import InMatCollModelQuery from "@/message/matlManage/InMatCollModelQuery";
import OutMatlDeliverModel from "@/message/matlManage/OutMatlDeliverModel";
import OutMatlDeliverModelQuery from "@/message/matlManage/OutMatlDeliverModelQuery";

export default {
  props: { 
    option: Object,
    paramObj: Object
  },
  data() {
    return {
      // 取到全局变量枚举值
      matlType:getGlobalParams.get("matlType"),
      processMode:getGlobalParams.get("processMode"),
      isImage:getGlobalParams.get("isImage"),
      imageFlag:getGlobalParams.get("imageFlag"),
      isMux:getGlobalParams.get("isMux"),
      isControlNo:getGlobalParams.get("isControlNo"),
      controlMode:getGlobalParams.get("controlMode"),
      // 物料详细信息列表
      matlInQuery:{
        MATLTYPE:'',//物料类型
        MATLID:'',//物料 ID
        MATLNAME:'',// 物料名称
        MATLENNAME:'', //物料英文
        VOUTYPE:'', //凭证类型
        PROCESSMODE:'', //处理类型
        ISIMAGE:'', //影像化
        IMAGEFLAG:'', //影像化要求
        CCY:'', //币种
        ISMUX:'', //可复用
        MODORGNO:'', //维护机构
        MODUSER:'', // 维护用户
        MODDATE:'', //维护日期
        MODTIME:'', //维护时间
      },
      //输出物料信息查询表单：
      matlOutQuery:{
        MATLTYPE:'',//物料类型
        MATLID:'',//物料 ID
        MATLNAME:'',// 物料名称
        MATLENNAME:'', //英文
        VOUTYPE:'', //凭证类型
        PROCESSMODE:'', //处理类型
        CCY:'', //币种
        ISCONTROLNO:'', //是否控号
        CONTROLMODE:'', //控号方式
        MODORGNO:'', //维护机构
        MODUSER:'', // 维护用户
        MODDATE:'', //维护日期
        MODTIME:'', //维护时间
      },
      
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
    isShow1: {
      get: function() {
        return this.option.isShow1;
      },
      set: function(newVal) {
        this.option.isShow1 = newVal;
      }
    },
    paramForm: function() {
      return this.paramObj
    }
  },
  created() {
     
  },
  methods: {
    // 打开dialog回调
    openCollback(type) {
      if(type === "In"){
        this.paramInQueryDetailinfo();
      }else{
        this.paramOutQueryDetailinfo();
      }
    },
    //格式化函数===>将代码值转化为对应枚举值：val取得值;array枚举值数组；
    getCodeToString(val,Object){
     for(var key in Object){
       if( val === key){
         console.log("当前键值:",key);
         val = Object[key];//将值转化为对应的枚举值
       }
     }
     console.log("转化后的值：");
     console.log(val);
     return val;
    },
    // 获取详细输入参数
    paramInQueryDetailinfo() {
     //获取当前行参数内容,此处不需要在进行查询，直接从当前行参数取汁即可
    this.matlInQuery=this.paramObj;
    this.matlInQuery.MATLTYPE = this.getCodeToString(this.matlInQuery.MATLTYPE,this.matlType);
    this.matlInQuery.PROCESSMODE = this.getCodeToString(this.matlInQuery.PROCESSMODE,this.processMode);
    this.matlInQuery.ISIMAGE = this.getCodeToString(this.matlInQuery.ISIMAGE,this.isImage);
    this.matlInQuery.ISMUX = this.getCodeToString(this.matlInQuery.ISMUX,this.isMux);
    this.matlInQuery.IMAGEFLAG = this.getCodeToString(this.matlInQuery.IMAGEFLAG,this.imageFlag);
  },
    // 获取详细输出参数
      paramOutQueryDetailinfo() {
      this.matlOutQuery=this.paramObj;
      this.matlOutQuery.MATLTYPE = this.getCodeToString(this.matlOutQuery.MATLTYPE,this.matlType);
      this.matlOutQuery.PROCESSMODE = this.getCodeToString(this.matlOutQuery.PROCESSMODE,this.processMode);
      this.matlOutQuery.ISCONTROLNO = this.getCodeToString(this.matlOutQuery.ISCONTROLNO,this.isControlNo);
      this.matlOutQuery.CONTROLMODE = this.getCodeToString(this.matlOutQuery.CONTROLMODE,this.controlMode);
    }
  }
}

</script>

<style scope>

</style>