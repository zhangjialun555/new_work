<template>
    <el-dialog title="新增用户" @open="openAddUsr" @close="closeDialog"
    :lock-scroll=false
    :visible.sync="option.isShow" width="800px">
        <el-card style="margin-top='10px'" v-loading="loading">
          <el-form  ref='addUsers' :model='addUsers' label-width="150px" :rules="rules" inline=""  size='mini' label-position='left'>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="用户姓名:" prop="userName">
                  <el-input v-model="addUsers.userName" placeholder="请输入用户姓名" ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="渠道标识:" prop="userWay">
                  <el-select v-model="addUsers.userWay" placeholder="请选择用户渠道标识">
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
                <el-form-item label="用户密码:" prop="userPassword">
                  <el-input v-model="addUsers.userPassword" placeholder="请输入用户密码" ></el-input>
                </el-form-item>
              </el-col> -->
            </el-row>
            <el-row :gutter="8">
               <el-col :span="12">
                <el-form-item label="用户等级:" prop="userGrade">
                  <el-input v-model="addUsers.userGrade" placeholder="请输入用户等级" ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="启用状态:" prop="userStart">
                  <el-select v-model="addUsers.userStart" placeholder="请选择用户启用状态">
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
                <el-form-item label="用户MAC地址:" prop="userMAC">
                  <el-input v-model="addUsers.userMAC" placeholder="请输入用户MAC" ></el-input>
                </el-form-item>
              </el-col>
               <el-col :span="12">
                <el-form-item label="用户IP地址:" prop="userIP">
                  <el-input v-model="addUsers.userIP" placeholder="请输入用户IP" ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
             <el-row :gutter="8">              
              <el-col :span="12">
                <el-form-item label="窗口布局样式:" prop="windowLayoutStyle">
                  <el-select v-model="addUsers.windowLayoutStyle" placeholder="请输入窗口布局样式ID">
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
                <el-form-item label="内网视频参数配置:" prop="inVideoConfigure">
                  <el-select v-model="addUsers.inVideoConfigure" placeholder="请输入内网视频参数配置ID">
                    <el-option
                      v-for="item in configData"
                      :key="item.CONFIGID"
                      :label="item.CONFIGID+'-'+item.CONFIGNAME"
                      :value="item.CONFIGID">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
             <el-row :gutter="8">
               <el-col :span="12" v-if="!(addUsers.userWay==1||addUsers.userWay==2)">
                <el-form-item label="公网视频参数配置:" prop="outVideoConfigure">
                  <el-select v-model="addUsers.outVideoConfigure" placeholder="请输入公网视频参数配置ID">
                    <el-option
                      v-for="item in configData"
                      :key="item.CONFIGID"
                      :label="item.CONFIGID+'-'+item.CONFIGNAME"
                      :value="item.CONFIGID">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="!(addUsers.userWay==1||addUsers.userWay==2)">
                <el-form-item label="其他视频参数配置:" prop="otherVideoConfigure">
                  <el-select v-model="addUsers.otherVideoConfigure" placeholder="请输入其他视频参数配置ID">
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
                <el-form-item label="备注:" prop="remark">
                  <el-input v-model="addUsers.remark" placeholder="请输入备注" ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
        <el-row style="margin:20px 0;text-align:right">
          <el-button size="mini" @click="option.isShow=false">取消</el-button>
          <el-button type="primary" size="mini" @click="userAdd">确认</el-button>
        </el-row>
    </el-dialog>
</template>

<script>
// import request from "@/utils/request";
import request from "@/utils/requestTest";
import getGlobalParams from "@/utils/getGlobalParams";
import toolBox from "@/utils/toolBox";
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
    let validatorName = (rule,value,callback) => {
      if (value != ""){
        let reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
        if (reg.test(value)){
          callback(new Error("请输入非中文正确用户名"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      loading:false,
      configData:[],
      styleData:[],
      addUsers:{
        OPERATION:"",
        userName:"",
        // userPassword:"",
        userGrade:"",
        userIP:"",
        userMAC:"",
        userWay:"",
        userStart:"",
        windowLayoutStyle:"",
        inVideoConfigure:"",
        outVideoConfigure:"",
        otherVideoConfigure:"",
        remark:"",
      },
      rules:{
         userName: [
          { required: true, message: "请输入用户英文姓名",  trigger: "blur" },
          { max: 20, message: "用户等级长度少于20个字符", trigger: "blur" },
          { validator:validatorName,  trigger: "blur" }
        ],
          userGrade: [
          { required: false, message: "请输入用户等级", trigger: "blur" },
          { max: 5, message: "用户等级长度少于5个字符", trigger: "blur" }
        ],
        userIP: [
          { required: false, message: "请输入用户IP", trigger: "blur" },
          { max: 20, message: "用户IP长度少于20个字符", trigger: "blur" }
        ],
        userMAC: [
          { required: false, message: "请输入用户MAC地址", trigger: "blur" },
          { max: 30, message: "用户MAC地址长度少于30个字符", trigger: "blur" }
        ],
        userWay:[
          { required: true, message: "请选择用户渠道标识", trigger: "change" }
        ],
        windowLayoutStyle: [
          { required: false, message: "请输入窗口布局样式ID", trigger: "blur" },
          { max: 2, message: "用户姓名长度少于2个字符", trigger: "blur" }
        ],
        inVideoConfigure: [
          { required: false, message: "请输入用户ID", trigger: "blur" },
          { max: 2, message: "内网渠道视频参数id长度少于2个字符", trigger: "blur" }
        ],
        outVideoConfigure: [
          { required: false, message: "请输入用户ID", trigger: "blur" },
          { max: 2, message: "外网渠道视频参数id长度少于2个字符", trigger: "blur" }
        ],
        otherVideoConfigure: [
          { required: false, message: "请输入用户ID", trigger: "blur" },
          { max: 2, message: "其他渠道视频参数id长度少于2个字符", trigger: "blur" }
        ],
         remark: [
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
    userAdd() {
        this.$refs["addUsers"].validate(async (valid)=> {
          if (valid){
            this.loading = false;
            let resBody =new userAddTableIns;
            resBody.data.OPERATION = "1";
            resBody.data.USERNAME = this.addUsers.userName;
            // resBody.data.USERPWD = this.addUsers.userPassword;
            resBody.data.USERLEVEL = this.addUsers.userGrade;
            resBody.data.USERIP = this.addUsers.userIP;
            resBody.data.USERMAC = this.addUsers.userMAC;
            resBody.data.USERCHANNEL = this.addUsers.userWay;
            resBody.data.USERFLAG = this.addUsers.userStart;
            resBody.data.LAYOUTID = this.addUsers.windowLayoutStyle;
            resBody.data.FORZIZHUVIDEOID = this.addUsers.inVideoConfigure;
            resBody.data.FORAPPVIDEOID = this.addUsers.outVideoConfigure;
            resBody.data.FOROTHERVIDEOID = this.addUsers.otherVideoConfigure;
            resBody.data.REMARK1 = this.addUsers.remark;
            let response = await request(resBody);
            this.loading = false;
            if (response.SYS_HEAD.ReturnCode == "000000") {
              this.$message({
                  type: "success",
                  message: "新增用户信息成功!"
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
      
    },
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
        this.styleData = [];
      }
      else {
        this.$message({
            type: "error",
            message: "请求失败，错误码:" + response1.SYS_HEAD.ReturnCode + "，错误信息：" + response1.SYS_HEAD.ReturnMessage
          });
      }
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
