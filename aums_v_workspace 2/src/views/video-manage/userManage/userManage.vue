<template>
  <div class="type-info-manage" v-loading="loading" element-loading-text="加载中。。。">
    <el-card>
      <el-form :model="queryForm" ref="queryForm" size="mini" label-position="top">
        <el-row :gutter="10">
          <el-col :lg="4" :md="6">
            <el-form-item label="用户编号" size="mini" label-position="top" prop="userNum">
              <el-input
                size="mini"
                maxlength="50"
                placeholder="请输入用户编号"
                v-model="queryForm.userNum"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg="4" :md="6">
            <el-form-item label="用户姓名" size="mini" label-position="top" prop="userNume">
              <el-input
                size="mini"
                maxlength="50"
                placeholder="请输入用户姓名"
                v-model="queryForm.userNume"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg="4" :md="6">
            <el-form-item label="用户状态" size="mini" label-position="top" prop="userStatus">
              <el-select v-model="queryForm.userStatus" placeholder="请选择用户状态">
                <el-option
                  v-for="item in userStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="4" :md="6">
            <el-form-item label="IP地址" size="mini" label-position="top" prop="userIp">
              <el-input size="mini" maxlength="20" placeholder="请输入IP地址" v-model="queryForm.userIp"></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg="4" :md="6">
            <el-form-item label="渠道标识" size="mini" label-position="top" prop="wayMark">
              <el-select v-model="queryForm.wayMark" placeholder="请选择渠道标识">
                <el-option
                  v-for="item in wayOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="4" :md="6">
            <el-form-item label="启用状态" size="mini" label-position="top" prop="startStatus">
              <el-select v-model="queryForm.startStatus" placeholder="请选择启用状态">
                <el-option
                  v-for="item in startOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="24" :md="24" class="searchBtnMarginTop">
            <el-button type="primary" size="mini" icon="el-icon-search" @click="queryUser">查询</el-button>
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-refresh"
              @click="clearForm('queryForm')"
            >重置</el-button>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-plus"
              v-if="btnPermission('Button_DevProgram_Add')"
              @click="creatUser"
            >新增</el-button>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              v-if="btnPermission('Button_DevProgram_Edit')"
              @click="modifyUser"
              :disabled="!(selectList.length==1)"
            >修改</el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              v-if="btnPermission('Button_DevProgram_Delete')"
              @click="deleteUserShow"
              :disabled="!(selectList.length==1)"
            >删除</el-button>
            <el-button
              type="success"
              size="mini"
              icon="el-icon-service"
              @click="openVideo"
             :disabled="!(selectList.length==2&&selectList[0].USERSTATUS=='1'&&selectList[1].USERSTATUS=='1')"
            >拉起视频</el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-warning"
              v-if="btnPermission('Button_DevProgram_Delete')"
              @click="kickoutUser"
              :disabled="!kickOutDisableCheck"
            >注销用户</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-row :gutter="10"></el-row>
      <el-table
        :data="tableData"
        class="tableMarginTop"
        header-row-class-name="tableHeaderClass"
        @selection-change="handleCurrentChange"
        border
      >
        <el-table-column fixed type="selection" width="40"></el-table-column>
        <el-table-column fixed prop="USERID" label="用户编号"></el-table-column>
        <el-table-column prop="USERNAME" label="用户姓名"></el-table-column>
        <el-table-column prop="USERPWD" label="用户密码"></el-table-column>
        <el-table-column prop="USERLEVEL" label="用户等级"></el-table-column>
        <el-table-column prop="USERSTATUS" label="用户状态"  :formatter="userStatusFormat"></el-table-column>
        <el-table-column prop="USERMAC" label="用户MAC地址" min-width="125px"></el-table-column>
        <el-table-column prop="USERIP" label="用户IP地址" min-width="125px"></el-table-column>
        <el-table-column prop="USERCHANNEL" label="用户渠道标识" :formatter="userWayFormat"></el-table-column>
        <el-table-column prop="USERFLAG" label="启用状态" :formatter="userStartFormat"></el-table-column>
        <el-table-column prop="APPLYTIME" label="申请时间"></el-table-column>
        <el-table-column prop="APPLYCHANNEL" label="申请渠道"></el-table-column>
        <el-table-column prop="LAYOUTID" label="窗口布局样式" :formatter=" layoutFormat"></el-table-column>
        <el-table-column prop="FORZIZHUVIDEOID" label="内网视频参数" :formatter="videoFormat"></el-table-column>
        <el-table-column prop="FORAPPVIDEOID" label="公网视频参数" :formatter="videoFormat"></el-table-column>
        <el-table-column prop="FOROTHERVIDEOID" label="其他视频参数" :formatter="videoFormat"></el-table-column>
        <el-table-column prop="REMARK1" label="备注" fixed="right"></el-table-column>
      </el-table>

      <el-pagination
        style="text-align: right; margin-top:20px;"
        @size-change="handleSizeChange"
        @current-change="handleInCurrentChange"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        :page-sizes="[10, 20, 50,100]"
        layout="sizes, total, prev, pager, next, jumper"
        background
        :total="tableTotal"
      ></el-pagination>
    </el-card>
    <!-- //弹框 -->
    <component
      :is="dialogList.addUser"
      :addData="addVal"
      :option="dialogListAddUser"
      @refreshTable="queryUser"
    ></component>
    <component :is="dialogList.modifyUser" :option="dialogListModifyUser" @refreshTable="queryUser"></component>
  </div>
</template>

<script>
import getGlobalParams from "@/utils/getGlobalParams";
//通讯相关
// import requestTest from "@/utils/requestTest";
import requestTest from "@/utils/requestTest";
import userTableIns from "@/message/video-manage/userManage/userManageQuery";
import userTableDel from "@/message/video-manage/userManage/userManageDelete";
import immediateMeeting from "@/message/video-manage/immediateMeeting";

import configInsUsr from "@/message/video-manage/vedioParameterQuery";
import styleInsUsr from "@/message/video-manage/vedioStyleQuery";
import kickout from "@/message/video-manage/userManage/userManageKickout";

import { addUser, modifyUser } from "./dialog";

export default {
  name: "selfser-dev-form-manage",
  // components: { selectTree },
  data() {
    return {
      //页面公用
      loading: "",
      configDataHash: { CONFIGID: "", CONFIGNAME: "" },
      styleDataHash: { LAYOUNAME: "", LAYOUTID: "" },
      //
      userId: "",
      tableTotal: 0,
      selectList: [],
      pageSize: getGlobalParams.get("PageSize"),
      tableData: [],
      currentPage: 1,
      checkedModify: "",
      checkedDelete: "",
      queryForm: {
        userNum: "",
        userNume: "",
        userStatus: "",
        userIp: "",
        wayMark: "",
        startStatus: ""
      },
      // dialogList:{devRunDetailInfo},
      userStatusOptions: [
        { value: "0", label: "未登录" },
        { value: "1", label: "已登录" },
        { value: "2", label: "会议中" },
        { value: "3", label: "已分配" }
      ],
      wayOption: [
        { value: "0", label: "坐席" },
        { value: "1", label: "固定设备" },
        { value: "2", label: "移动设备" }
      ],
      startOption: [
        { value: "0", label: "未启用" },
        { value: "1", label: "启用" }
      ],
      //传递给子页面的数据
      addVal: null,
      deleteVal: null,

      dialogList: {
        addUser,
        modifyUser
      },
      dialogListAddUser: {
        isShow: false
      },
      dialogListModifyUser: {
        isShow: false,
        data: {}
      }
    };
  },
  created() {
    this.initData();
  },
  mounted() {
    this.queryUser();
  },
  methods: {
    userStatusFormat(row, column) {
      var temp = this.toolBox.objArray2Hash(this.userStatusOptions, "value");
      return temp[row[column.property]].label;
    },
    userWayFormat(row, column) {
      var temp = this.toolBox.objArray2Hash(this.wayOption, "value");
      return temp[row[column.property]].label;
    },
    userStartFormat(row, column) {
      var temp = this.toolBox.objArray2Hash(this.startOption, "value");
      return temp[row[column.property]].label;
    },

    layoutFormat(row, column) {
      return this.styleDataHash[row[column.property]]
        ? this.styleDataHash[row[column.property]].LAYOUNAME
        : "";
    },
    videoFormat(row, column) {
      return this.configDataHash[row[column.property]]
        ? this.configDataHash[row[column.property]].CONFIGNAME
        : "";
    },
    //请求视频以及样式下拉框
    async initData() {
      //请求参数配置下拉
      this.loading = true;
      let resBody = new configInsUsr();
      resBody.data.CONFIGID = "";
      resBody.data.CONFIGNAME = "";
      resBody.data.currpage = "1";
      resBody.data.pagerownum = "100";

      let response = await requestTest(resBody);
      this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        var temp1 = response.RSP_BODY.RspStruct;
        this.configDataHash = this.toolBox.objArray2Hash(temp1, "CONFIGID");
      } else if (response.SYS_HEAD.ReturnCode == "ARBFQ001") {
        this.configDataHash = {};
      } else {
        this.$message({
          type: "error",
          message:
            "请求失败，错误码:" +
            response.SYS_HEAD.ReturnCode +
            "，错误信息：" +
            response.SYS_HEAD.ReturnMessage
        });
      }
      //请求参数样式下拉
      this.loading = true;
      let resBody1 = new styleInsUsr();
      resBody1.data.LAYOUTID = "";
      resBody1.data.LAYOUNAME = "";

      resBody1.data.currpage = "1";
      resBody1.data.pagerownum = "100";

      let response1 = await requestTest(resBody1);
      this.loading = false;
      if (response1.SYS_HEAD.ReturnCode == "000000") {
        var temp1 = response1.RSP_BODY.RspStruct;
        this.styleDataHash = this.toolBox.objArray2Hash(temp1, "LAYOUTID");
      } else if (response1.SYS_HEAD.ReturnCode == "ARBFQ001") {
        this.styleDataHash = {};
      } else {
        this.$message({
          type: "error",
          message:
            "请求失败，错误码:" +
            response1.SYS_HEAD.ReturnCode +
            "，错误信息：" +
            response1.SYS_HEAD.ReturnMessage
        });
      }
    },

    /**
     * @desc 参数列表中获取参数ID
     */
    getUserID(scope, val) {
      this.userId = val.userId;
      this.rowVal = val;
      if (val) {
        this.checkedModify = false;
        this.checkedDelete = false;
      }
    },
    clearForm(item) {
      this.$refs["" + item].resetFields();
    },
    creatUser() {
      this.dialogListAddUser.isShow = true;
    },
    modifyUser() {
      this.dialogListModifyUser.isShow = true;
      this.dialogListModifyUser.data = this.selectList[0];
    },
    kickoutUser() {
      //踢人弹窗
      this.$confirm("此操作将注销此用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.kickoutFun();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    async kickoutFun() {
      //踢人
      this.loading = true;
      let resBody = new kickout();
      var arr = [];
      for(var i=0;i<this.selectList.length;i++){
          arr.push({USERID:this.selectList[i].USERID});
      }
      resBody.data.RspStruct = arr;
      let response = await requestTest(resBody);
      this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        this.$message({
          type: "success",
          message: "注销用户成功!"
        });
        this.queryUser();
      } else {
        this.$message({
          type: "info",
          message: response.SYS_HEAD.ReturnMessage
        });
      }
    },
    openVideo() {
      //拉起视频弹窗
      this.$confirm("此操作将拉起视频, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.openVideoFun();
        })
        .catch(() => {
          // this.$message({
          //   type: "info",
          //   message: "已取消删除"
          // });
        });
    },
    async openVideoFun() {
      //拉起视频
      debugger
      let resBody = new immediateMeeting();
      if (this.selectList[0].USERCHANNEL =="0" ) {
        resBody.data.AGENTUSERID = this.selectList[0].USERID;
        resBody.data.USERID = this.selectList[1].USERID;
      } 
      else{
        if(this.selectList[1].USERCHANNEL =="0"){
          resBody.data.AGENTUSERID = this.selectList[1].USERID;
          resBody.data.USERID = this.selectList[0].USERID;
        }
        else {
          this.$message({
            type: "info",
            message: "请选择至少一个坐席用户"
          });
          return false
        }
      }
      this.loading = true;
      let response = await requestTest(resBody);
      this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        this.$message({
          type: "success",
          message: "会议视频拉起成功!"
        });
      } else {
        this.$message({
          type: "info",
          message: response.SYS_HEAD.ReturnMessage
        });
      }
    },
    deleteUserShow() {
      //删除弹窗
      this.$confirm("此操作将永久删除该设备信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteUser();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    async deleteUser() {
      //删除
      this.loading = true;
      let resBody = new userTableDel();
      resBody.data.OPERATION = "3";
      resBody.data.USERNAME = this.selectList[0].USERNAME;
      let response = await requestTest(resBody);
      this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        this.$message({
          type: "success",
          message: "设备信息删除成功!"
        });
        this.queryUser();
      } else {
        this.$message({
          type: "info",
          message: response.SYS_HEAD.ReturnMessage
        });
      }
    },
    async queryUser() {
      //查询
      this.loading = true;
      let resBody = new userTableIns();
      resBody.data.USERID = this.queryForm.userNum;
      resBody.data.USERNAME = this.queryForm.userNume;
      resBody.data.USERIP = this.queryForm.userIp;
      resBody.data.USERSTATUS = this.queryForm.userStatus;
      resBody.data.USERCHANNEL = this.queryForm.wayMark;
      resBody.data.USERFLAG = this.queryForm.startStatus;
      resBody.data.currpage = this.currentPage + "";
      resBody.data.pagerownum = this.pageSize + "";

      let response = await requestTest(resBody);
      this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        this.tableData = response.RSP_BODY.RspStruct;
        this.tableTotal = response.RSP_BODY.RecordNum;
      } else if (response.SYS_HEAD.ReturnCode == "ARBFQ001") {
        this.tableData = [];
        this.tableTotal = 0;
      } else {
        this.$message({
          type: "error",
          message:
            "请求失败，错误码:" +
            response.SYS_HEAD.ReturnCode +
            "，错误信息：" +
            response.SYS_HEAD.ReturnMessage
        });
      }
    },
    handleSizeChange(val) { this.pageSize=val;
      this.queryUser();
    },
    handleInCurrentChange() {
      this.queryUser();
    },
    handleCurrentChange(val) {
      this.selectList = val;
    }
  },
  computed: {
    kickOutDisableCheck() {
      if (this.selectList.length == 0) {
        return false;
      } 
      else {
        for(var i=0;i<this.selectList.length;i++){
          if (this.selectList[i].USERSTATUS != 1) {
            return false;
          }
        }
      }
      return true;
    }
  }
};
</script>


<style lang="scss">
.type-info-bottom {
  margin-top: 10px;
}
.box {
  margin-top: 20px;
  text-align: right;
}
.headerClass {
  background: #f7f7f7 !important;
}
.el-card {
  overflow: visible;
}
</style>
