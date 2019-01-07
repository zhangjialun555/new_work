<template>
  <div v-loading="loading" element-loading-rext="拼命加载中。。。">
    <el-card style="margin-bottom:10px">
      <el-form :model="formInLine" label-position="top" size="mini" ref="formInLine">
        <el-row :gutter="10">
          <el-col :md="6" :lg="4">
            <el-form-item label="版本编号：" prop="versionCode">
              <el-select v-model="formInLine.versionCode" placeholder="请选择版本编号查询">
                <el-option
                  v-for="item in verBaseInfo"
                  :key="item.id"
                  :value="item.versionCode"
                  :label="item.versionCode"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :md="3" :lg="2">
            <el-form-item>
              <el-button
                type="primary"
                @click="queryInfoList"
                class="searchBtnMarginTop"
                icon="el-icon-search"
              >查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :md="3" :lg="2">
            <el-form-item>
              <el-button
                type="warning"
                @click="clearForm('formInLine')"
                class="searchBtnMarginTop"
                icon="el-icon-refresh"
              >重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <el-form>
        <el-button type="primary" @click="dialogFileUpload" size="mini" icon="el-icon-upload">上传</el-button>
        <el-button type="danger" @click="deleteVertionFile" size="mini" icon="el-icon-delete" :disabled="!(multipleSelection.length ===1)">删除</el-button>
      </el-form>
      <el-table
        :data="tableData"
        ref="tableData"
        class="tableMarginTop"
        header-row-class-name="tableHeaderClass"
        @selection-change="handleSelectionChange"
        border
      >
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column fixed prop="versionCode" label="版本编号" width="150"></el-table-column>
        <el-table-column prop="verOptionsTemplateName" label="所属模版分类" min-width="180"></el-table-column>
        <el-table-column prop="verCreateTime" label="上传时间" width="160"></el-table-column>
        <el-table-column prop="adDescription" label="版本描述" min-width="200"></el-table-column>
        <el-table-column align="center" fixed="right" label="操作" width="80">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="dialogVersionFileList(scope.$index,tableData)"
            >详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="text-align:right; margin-top:20px"
        @currnet-change="handleCurrentChange"
        @size-change="handSizeChange"
        :current-page.sync="currentPage"
        :page-sizes="[10,20,50,100]"
        :page-size="pageSize"
        background
        layout="sizes,total,prev,pager,next,jumper"
        :total="tableTotal"
      ></el-pagination>
    </el-card>
    <keep-alive :is="dialogList.versionDeailList" :option="dialogOptionsVersionDetail"></keep-alive>
  </div>
</template>
<script>
import request from "@/utils/request";
import versionDeailList from "./dialog/versionDetailList1";
import spinnerDataQuery from "@/message/spinnerDataQuery/spinner-data-query";
import getGlobalParams from "@/utils/getGlobalParams";
import versionQueryList from "@/message/version/versionFileUpload/query-version-list";
import versionDeleteFiles from "@/message/version/versionFileUpload/version-delete-file";

export default {
  data() {
    return {
      loading: false,
      pageSize: getGlobalParams.get("PageSize"),
      currentPage: 1,
      tableTotal: 0,
      formInLine: {
        versionCode: ""
      },
      verBaseInfo: [],
      tableData: [],
      multipleSelection: [],
      dialogList: {
        versionDeailList
        
      },

      dialogOptionsVersionDetail: {
        isShow: false,
        versionCode: "",
        adDescription: ""
      }
    };
  },
  created() {
    this.initSpinnerList();
    this.queryInfoList();
  },
  mounted() {},
  methods: {
    async initSpinnerList() {
      let resBody = new spinnerDataQuery();
      resBody.data.spinnerList = [{ spinnerName: "verBaseInfo" }];
      let response = await request(resBody);
      this.verBaseInfo = response.RSP_BODY.verBaseInfoSpinner || [];
      this.verBaseInfo.unshift({});
      // if(response.SYS_HEAD.ReturnCode=="000000"){
      //   this.verBaseInfo = response.RSP_BODY.verBaseInfoSpinner||[];
      //   this.verBaseInfo.unshift({});
      // }else{
      //   this.$message({
      //     type: "error",
      //     message:
      //       "请求失败，错误码：" +
      //       response.SYS_HEAD.ReturnCode +
      //       ",错误信息：" +
      //       response.SYS_HEAD.ReturnMessage
      //   });
      // }
    },
    async queryInfoList() {
      this.loading = true;
      let resBody = new versionQueryList();
      resBody.data.versionCode = this.formInLine.versionCode;
      resBody.QueryRowNum = this.pageSize;
      resBody.QueryPageNo = this.currentPage;
      console.log('QueryPageNo: ', QueryPageNo);
      let response = await request(resBody);
      this.loading = false;
      if (response.SYS_HEAD.ReturnCode === "000000") {
        this.tableData = response.RSP_BODY.verInfoList || [];
        this.tableTotal = Number(
          response.QUERY_INFO_HEAD.QueryAllDataCount || this.tableTotal
        );
      } else {
        this.$message({
          message: response.SYS_HEAD.ReturnMessage,
          type: "error"
        });
        this.loading = false;
      }
    },
    clearForm(item) {
      this.$refs["" + item].resetFields();
    },
    handleCurrentChange(val) {
      this.queryInfoList();
    },
    handSizeChange(val) {
      this.pageSize = val;
      this.queryInfoList();
    },

    dialogFileUpload() {},
    deleteVertionFile() {
      this.$confirm("此操作将永久删除该版本文件, 是否继续?", "系统提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false
      })
        .then(() => {
          this.versionDeleteFile();
        })
        .catch(() => {
          this.$message({
            message: "已取消删除",
            type: "info"
          });
        });
    },
    async versionDeleteFile() {
      let resBody = new versionDeleteFiles;
      resBody.data.versionCode = this.multipleSelection[0].versionCode;
      let response = await request(resBody);
      if (esponse.SYS_HEAD.ReturnCode === "000000"){
        this.queryInfoList();
        this.initSpinnerList();
        this.clearForm("formInline");
        this.$message({
          message:"删除成功",
          type:"success"
        })
      }else{
        this.$message({
           message: response.SYS_HEAD.ReturnMessage,
           type: "error"
        }); 
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    dialogVersionFileList(index, rows) {
      this.dialogOptionsVersionDetail.versionCode = rows[index].versionCode;
      this.dialogOptionsVersionDetail.adDescription = rows[index].adDescription;
      this.dialogOptionsVersionDetail.isShow = true;
    }
  }
};
</script>