<template>
    <el-dialog title="修改用户" @open="openAddUsr" @close="closeDialog"
    :lock-scroll=false
    :visible.sync="option.isShow" width="800px">
        <el-card style="margin-top='10px'" v-loading="loading">
          <el-form  ref='addUsers' :model='addUsers' label-width="150px" :rules="rules" inline=""  size='mini' label-position='left'>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="用户姓名:" prop="USERNAME">
                  <el-input :disabled="true" v-model="addUsers.USERNAME" placeholder="请输入用户姓名" ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="渠道标识:" prop="USERCHANNEL">
                  <el-select v-model="addUsers.USERCHANNEL" placeholder="请选择用户渠道标识">
                    <el-option
                      v-for="item in wayOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
               <!-- <el-col :span="12">
                <el-form-item label="用户密码:" prop="USERPWD">
                  <el-input v-model="addUsers.USERPWD" placeholder="请输入用户密码" ></el-input>
                </el-form-item>
              </el-col> -->
            </el-row>
            <el-row :gutter="8">
              <el-col :span="12">
                <el-form-item label="用户等级:" prop="USERLEVEL">
                  <el-input v-model="addUsers.USERLEVEL" placeholder="请输入用户等级" ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="启用状态:" prop="USERFLAG">
                  <el-select v-model="addUsers.USERFLAG" placeholder="请选择用户启用状态">
                    <el-option
                      v-for="item in startOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>              
            </el-row>
             <el-row :gutter="8">
               <el-col :span="12">
                <el-form-item label="用户MAC地址:" prop="USERMAC">
                  <el-input v-model="addUsers.USERMAC" placeholder="请输入用户MAC" ></el-input>
                </el-form-item>
              </el-col>
               <el-col :span="12">
                <el-form-item label="用户IP地址:" prop="USERIP">
                  <el-input v-model="addUsers.USERIP" placeholder="请输入用户IP" ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
             <el-row :gutter="8">
              <el-col :span="12">
                <el-form-item label="窗口布局样式:" prop="LAYOUTID">
                  <el-select v-model="addUsers.LAYOUTID" placeholder="请输入窗口布局样式ID">
                    <el-option
                      v-for="item in styleData"
                      :key="item.LAYOUTID"
                      :label="item.LAYOUTID+'-'+item.LAYOUNAME"
                      :value="item.LAYOUTID">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="内网视频参数配置:" prop="FORZIZHUVIDEOID">
                  <el-select v-model="addUsers.FORZIZHUVIDEOID" placeholder="请输入内网视频参数配置ID">
                    <el-option
                      v-for="item in configData"
                      :key="item.CONFIGID"
                      :label="item.CONFIGID+'-'+item.CONFIGNAME"
                      :value="item.CONFIGID">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="!(addUsers.USERCHANNEL==1||addUsers.USERCHANNEL==2)">
                <el-form-item label="公网视频参数配置:" prop="FORAPPVIDEOID">
                  <el-select v-model="addUsers.FORAPPVIDEOID" placeholder="请输入公网视频参数配置ID">
                    <el-option
                      v-for="item in configData"
                      :key="item.CONFIGID"
                      :label="item.CONFIGID+'-'+item.CONFIGNAME"
                      :value="item.CONFIGID">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="!(addUsers.USERCHANNEL==1||addUsers.USERCHANNEL==2)">
                <el-form-item label="其他视频参数配置:" prop="FOROTHERVIDEOID">
                  <el-select v-model="addUsers.FOROTHERVIDEOID" placeholder="请输入其他视频参数配置ID">
                    <el-option
                      v-for="item in configData"
                      :key="item.CONFIGID"
                      :label="item.CONFIGID+'-'+item.CONFIGNAME"
                      :value="item.CONFIGID">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="备注:" prop="REMARK1">
                  <el-input v-model="addUsers.REMARK1" placeholder="请输入备注" ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
        <el-row style="margin:20px 0;text-align:right">
          <el-button size="mini" @click="option.isShow=false">取消</el-button>                        
          <el-button type="primary" size="mini" @click="userModAdd">确认</el-button>
        </el-row>
    </el-dialog>
</template>

<script>
// import request from "@/utils/request";
import request from "@/utils/requestTest";
import getGlobalParams from "@/utils/getGlobalParams";
import userAddTableIns from "@/message/video-manage/userManage/userManageHandle";

import configIns from "@/message/video-manage/vedioParameterQuery";
import styleIns from "@/message/video-manage/vedioStyleQuery";

export default {
  name: "add-user-pop",
  props: {
    option: Object,
    // rowData: Object
  },
  data() {
    return {
      loading:false,
      configData:[],
      styleData:[],
      addUsers:{
        OPERATION:"",
        USERNAME:"",
        // USERPWD:"",
        USERLEVEL:"",
        USERIP:"",
        USERMAC:"",
        USERCHANNEL:"",
        USERFLAG:"",
        LAYOUTID:"",
        FORZIZHUVIDEOID:"",
        FORAPPVIDEOID:"",
        FOROTHERVIDEOID:"",
        REMARK1:""
      },
      rules:{
        //  USERNAME: [
        //   { required: true, message: "请输入用户姓名", trigger: "blur" },
        //   { max: 20, message: "用户姓名长度少于20个字符", trigger: "blur" },
        //   {validator:validatorName, trigger: "blur"}
        // ],
        //   USERPWD: [
        //   { required: true, message: "请输入用户密码", trigger: "blur" },
        //   { max: 16, message: "用户密码长度少于16个字符", trigger: "blur" }
        // ],
          USERLEVEL: [
          { required: false, message: "请输入用户等级", trigger: "blur" },
          { max: 5, message: "用户等级长度少于5个字符", trigger: "blur" }
        ],
        USERIP: [
          { required: false, message: "请输入用户IP", trigger: "blur" },
          { max: 20, message: "用户IP长度少于20个字符", trigger: "blur" }
        ],
        USERMAC: [
          { required: false, message: "请输入用户MAC地址", trigger: "blur" },
          { max: 30, message: "用户MAC地址长度少于30个字符", trigger: "blur" }
        ],
         USERCHANNEL:[
          { required: true, message: "请选择用户渠道标识", trigger: "change" }
        ],
        LAYOUTID: [
          { required: false, message: "请输入窗口布局样式ID", trigger: "blur" },
          { max: 2, message: "用户姓名长度少于2个字符", trigger: "blur" }
        ],
        FORZIZHUVIDEOID: [
          { required: false, message: "请输入用户ID", trigger: "blur" },
          { max: 2, message: "内网渠道视频参数id长度少于2个字符", trigger: "blur" }
        ],
        FORAPPVIDEOID: [
          { required: false, message: "请输入用户ID", trigger: "blur" },
          { max: 2, message: "外网渠道视频参数id长度少于2个字符", trigger: "blur" }
        ],
        FOROTHERVIDEOID: [
          { required: false, message: "请输入用户ID", trigger: "blur" },
          { max: 2, message: "其他渠道视频参数id长度少于2个字符", trigger: "blur" }
        ],
        REMARK1: [
          { required: false, message: "请输入备注", trigger: "blur" },
          { max: 10, message: "备注长度少于10个字符", trigger: "blur" }
        ]
      },
      wayOption: [{
        value:"0",
        label:'坐席'
        },{
        value:"1",
        label:'固定设备'
        },{
        value:"2",
        label:'移动设备'
        }
      ],
      startOption:[
        {
        value:"0",
        label:'未启用'
        },
        {
        value:"1",
        label:'启用'
        }
      ],
    };
  },
  methods: {
    async initPop(){
      //请求参数配置下拉
      this.loading = true;
      let resBody = new configIns();
      resBody.data.CONFIGID = "";
      resBody.data.CONFIGNAME = "";
      
      resBody.data.currpage = "1";
      resBody.data.pagerownum = "100";

      let response = await request(resBody);
      this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        this.configData = response.RSP_BODY.RspStruct;
      } 
      else if (response.SYS_HEAD.ReturnCode =="ARBFQ001") {
        this.configData = [];
      }
      else {
        this.$message({
            type: "error",
            message: "请求失败，错误码:" + response.SYS_HEAD.ReturnCode + "，错误信息：" + response.SYS_HEAD.ReturnMessage
          });
      }
      //请求参数样式下拉
      this.loading = true;
      let resBody1 = new styleIns();
      resBody1.data.LAYOUTID = "";
      resBody1.data.LAYOUNAME = "";
      
      resBody1.data.currpage = "1";
      resBody1.data.pagerownum = "100";

      let response1 = await request(resBody1);
      this.loading = false;
      if (response1.SYS_HEAD.ReturnCode == "000000") {
        this.styleData = response1.RSP_BODY.RspStruct;
      } 
      else if (response1.SYS_HEAD.ReturnCode =="ARBFQ001") {
        this.configData = [];
      }
      else {
        this.$message({
            type: "error",
            message: "请求失败，错误码:" + response1.SYS_HEAD.ReturnCode + "，错误信息：" + response1.SYS_HEAD.ReturnMessage
          });
      }
    },
    userModAdd() {
        this.$refs["addUsers"].validate(async (valid)=>{
          if (valid){
            this.loading = false;
            let resBody =new userAddTableIns;
            resBody.data.OPERATION = "2";
            resBody.data.USERNAME = this.addUsers.USERNAME;
            // resBody.data.USERPWD = this.addUsers.USERPWD;
            resBody.data.USERLEVEL = this.addUsers.USERLEVEL;
            resBody.data.USERIP = this.addUsers.USERIP;
            resBody.data.USERMAC = this.addUsers.USERMAC;
            resBody.data.USERCHANNEL = this.addUsers.USERCHANNEL;
            resBody.data.USERFLAG = this.addUsers.USERFLAG;
            resBody.data.LAYOUTID = this.addUsers.LAYOUTID;
            resBody.data.FORZIZHUVIDEOID = this.addUsers.FORZIZHUVIDEOID;
            resBody.data.FORAPPVIDEOID = this.addUsers.FORAPPVIDEOID;
            resBody.data.FOROTHERVIDEOID = this.addUsers.FOROTHERVIDEOID;
            resBody.data.REMARK1 = this.addUsers.REMARK1;
            let response = await request(resBody);
            this.loading = false;
           if (response.SYS_HEAD.ReturnCode == "000000") {
              this.$message({
                  type: "success",
                  message: "修改用户信息成功!"
              });
              this.option.isShow = false;
              this.$emit("queryUser");
            }else{
              this.$message({
                type:"error",
                message: "请求失败，错误码:" + response.SYS_HEAD.ReturnCode + "，错误信息：" + response.SYS_HEAD.ReturnMessage
              })
            }
          }else{
            this.$message({
            type: "warning",
            message: "请输入合法的数据！"
            });
            return false;
          }
        });
    },
    openAddUsr(){
       this.addUsers=JSON.parse(JSON.stringify(this.option.data));//通过PROP里面取到的（主页）数据传递给子页面data就好了
    },
    closeDialog(){
      if (this.$refs["addUsers"] != undefined) {
              this.$refs["addUsers"].resetFields();
              this.$refs["addUsers"].clearValidate();
            }
      this.$emit("refreshTable");
    },
  },
  mounted(){
    this.initPop();
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
