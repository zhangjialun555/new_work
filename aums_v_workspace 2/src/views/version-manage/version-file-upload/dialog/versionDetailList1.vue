<template>
  <div>
    <el-dialog
      title="versionDetail"
      :close-on-click-modal="false"
      :visible.sync="detailIsShow"
      width="900px"
      @open="getVersionDetailList"
    >
      <code>
        <div>
          versionCode:
          <span v-text="versionCode"></span>
        </div>
        <div>
          vesionDescription:
          <span v-text="adDescription"></span>
        </div>
      </code>
      <el-table :data="gridData" border header-row-class-name="tableHeaderClass">
        <el-table-column prop="fileName" label="????" width="120"></el-table-column>
        <el-table-column prop="filePath" label="????" min-width="200"></el-table-column>
        <el-table-column prop="fileType" label="????" width="80"></el-table-column>
        <el-table-column prop="fileSize" label="????" width="80"></el-table-column>
        <el-table-column prop="createTime" label="????" width="160"></el-table-column>
      </el-table>
      <el-pagination
        style="text-align:right; margin-top:20px"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        background
        :page-sizes="[10,20,30,50,100]"
        layout="sizes,total,prev,pager,next,jumper"
        :total="gridData.length"
      ></el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" style="width:100%" type="primary" @click="detailIsShow=false">close</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
import versionDetailList from "@/message/version/versionFileUpload/version-detail-list";
export default {
  props: {
    option: Object
  },
  data() {
    return {
      gridData: [],
      currentPage: 1
    };
  },
  computed: {
    detailIsShow: {
      get: function() {
        return this.option.isShow;
      },
      set: function(newVlaue) {
        this.option.isShow = newVlaue;
      }
    },
    versionCode: function() {
      return this.option.versionCode;
    },
    adDescription: function() {
      return this.option.adDescription;
    }
  },
  methods: {
    async getVersionDetailList() {
      let resBody = new versionDetailList();
      resBody.data.versionCode = this.versionCode;
      resBody.QueryRowNum = getGlobalParams.get("PageSize");
      resBody.QueryPageNo = this.currentPage;
      let response = await request(resBody);
      if (response.SYS_HEAD.ReturnCode === "000000") {
        this.gridData = response.RSP_BODY.verDetailInfoList || [];
      } else {
        this.$message({
          type: "warning",
          message:
            "?????????" +
            response.SYS_HEAD.ReturnCode +
            ",?????" +
            response.SYS_HEAD.ReturnMessage
        });
      }
    },
    handleCurrentChange(val) {
      this.getVersionDetailList();
      debugger
    }
  }
};
</script>
<style lang="scss" scoped>
code {
  background: #eef1f6;
  padding: 15px 16px;
  margin: 0 0 10px 0;
  display: block;
  line-height: 36px;
  font-size: 15px;
  font-family: "Source Sans Pro", "Helvetica Neue", Arial, sans-serif;
}
</style>