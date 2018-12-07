<template>
  <div class="video-parameter-manage" v-loading="loading" element-loading-text="加载中。。。">
    <!-- 主页面 -->
    <div>
       <el-card>
         <el-form ref='queryForm' :model='queryForm' size='mini' label-position='top'>
              <el-row  :gutter="10">
                  <!-- <el-col :md="6" :lg="4">
                      <el-form-item label='机构编号' prop='branchId'>
                        <select-tree ref="tree" v-model="addForm.branchId" :props='{id:"branchId",label: "branchName",children: "childBranch"}' :tree-data="brno"></select-tree>
                      </el-form-item>
                  </el-col> -->
                  <el-col :md="6" :lg="4">
                      <el-form-item label='配置编号' prop='CONFIGID'>
                        <el-input v-model='queryForm.CONFIGID' placeholder="请输入配置编号"></el-input>
                      </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="4">
                      <el-form-item label='配置名称' prop='CONFIGNAME'>
                        <el-input v-model='queryForm.CONFIGNAME' placeholder="请输入配置名称"></el-input>
                      </el-form-item>
                  </el-col>
                  <el-col :md="3" :lg="2" class="searchBtnMarginTop">
                        <el-button type='primary' size='mini' icon='el-icon-search' @click="queryModel">查询</el-button>
                  </el-col>
                  <el-col  :md="3" :lg="2" class="searchBtnMarginTop">
                        <el-button type='warning' size='mini' icon='el-icon-refresh' @click="clearForm('queryForm')">重置</el-button>
                  </el-col>
                  <!-- <el-col  :md="3" :lg="2" class="searchBtnMarginTop">
                      <el-button type='primary' size='mini' class='b-button' icon="el-icon-download" @click="getExcel" v-if="btnPermission('Button_RunRateRep_Export')">导出</el-button>
                  </el-col> -->
              </el-row>
         </el-form>
      </el-card>
       <el-card style="margin:10px 0 0 0">
          <el-row >
              <el-col :md="12" :lg="12">
                <el-button type='primary' size='mini' @click="openPop('add')">新增</el-button>
                <el-button type='primary' size='mini' @click="openPop('edit')" :disabled="!(selectList.length==1)">修改</el-button>
                <el-button type='danger' size='mini' @click="openPop('del')" :disabled="!(selectList.length==1)">删除</el-button>
              </el-col>
          </el-row>
          <!-- <el-row >
              <el-col :md="3" :lg="2" >
                  <el-button type='primary' size='mini' class='b-button' @click="getExcel">导出报表</el-button>
              </el-col>
          </el-row> -->

          <el-table 
          ref="tableData" 
          :data='tableData'
          header-row-class-name="tableHeaderClass"
          @selection-change="tableCheckBoxChange"
          border
          style="margin:10px 0 0 0"
          >
            <el-table-column fixed type='selection' width="40"></el-table-column>
            <el-table-column fixed prop='CONFIGID' label='配置编号' ></el-table-column>
            <el-table-column prop='CONFIGNAME' label='配置名称' min-width="200"></el-table-column>
            <el-table-column prop='SHOWSELFVIDEOFLAG' label='用户摄像头' :formatter="function(row,column){return row[column.property]=='true'?'开启':'关闭'}"></el-table-column>
            <el-table-column prop='CAMERAWIDTH' label='摄像头宽'></el-table-column>
            <el-table-column prop='CAMERAHEIGHT' label='摄像头高'></el-table-column>
            <el-table-column prop='CAMERAMALV' label='摄像头码率'></el-table-column>
            <el-table-column prop='CAMERAZHENLV' label='摄像头帧率'></el-table-column>
            <el-table-column prop='SAVEDESKFLAG' label='录制用户操作桌面' :formatter="function(row,column){return row[column.property]=='true'?'开启':'关闭'}"></el-table-column>
            <el-table-column label='录制参数'>
              <el-table-column prop='SAVEDESKAREA.X' label='X'></el-table-column>
              <el-table-column prop='SAVEDESKAREA.Y' label='Y'></el-table-column>
              <el-table-column prop='SAVEDESKAREA.WIDTH' label='宽'></el-table-column>
              <el-table-column prop='SAVEDESKAREA.HEIGHT' label='高'></el-table-column>
            </el-table-column>
            <el-table-column prop='SAVEDESKMALV' label='录制码率'></el-table-column>
            <el-table-column prop='SAVEDESKZHENLV' label='录制帧率'></el-table-column>
          </el-table>
           <div class="box">
              <el-pagination background
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page.sync="currentPage"
                  :page-sizes="[10, 20, 50,100]"
                  :page-size="pageSize"
                  layout="sizes, total, prev, pager, next, jumper"
                  :total="tableTotal"> 
              </el-pagination>
         </div>
      </el-card>
    </div>
    <!-- 弹窗 -->
    <!-- 这里关闭点击模态框关闭弹窗事件 -->
    <el-dialog :title="popTitle" :visible.sync="addPopStatu" :lock-scroll="false" width="800px" :close-on-click-modal="false">
          <el-card>
            <el-form ref='addForm' :model='addForm'  size='mini' label-position="top" :rules="rules">
              <el-row :gutter="10">
                  <el-col :md="6" :lg="12">
                    <el-form-item label='配置模板ID'  prop='CONFIGID'>
                            <el-input v-model='addForm.CONFIGID' placeholder="请输入参数"  :disabled="currOperation==2"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12">
                    <el-form-item label='配置模板名称'  prop='CONFIGNAME'>
                            <el-input v-model='addForm.CONFIGNAME' placeholder="请输入参数"  :disabled="currOperation==2"></el-input>
                    </el-form-item>
                  </el-col>
              </el-row>
              <h4>摄像头配置</h4>
              <div style="border-top: 1px solid #ebeef5;margin:15px 22px 12px;"></div>
              <el-row :gutter="10">
                  <el-col :md="6" :lg="12">
                    <el-form-item label='用户摄像头'  prop='SHOWSELFVIDEOFLAG'>
                            <el-select placeholder="请选择" v-model="addForm.SHOWSELFVIDEOFLAG">
                              <el-option
                                v-for="item in [{value:'true',label:'开启'},{value:'false',label:'关闭'}]"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12">
                    <el-form-item label='摄像头宽'  prop='CAMERAWIDTH'>
                            <el-input v-model='addForm.CAMERAWIDTH' placeholder="请输入参数"  ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12">
                    <el-form-item label='摄像头高'  prop='CAMERAHEIGHT'>
                            <el-input v-model='addForm.CAMERAHEIGHT' placeholder="请输入参数"  ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12">
                    <el-form-item label='摄像头码率'  prop='CAMERAMALV'>
                            <el-input v-model='addForm.CAMERAMALV' placeholder="请输入参数"  ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12">
                    <el-form-item label='摄像头帧率'  prop='CAMERAZHENLV'>
                            <el-input v-model='addForm.CAMERAZHENLV' placeholder="请输入参数"  ></el-input>
                    </el-form-item>
                  </el-col>
                  <!-- <el-col :md="6" :lg="12">
                    <el-form-item label='机构编号' prop='branchId'>
                        <select-tree ref="tree" v-model="addForm.branchId" @select-check="selectChange" 
                        :props='{id:"branchId",label: "branchName",children: "childBranch"}' :tree-data="brno"></select-tree>
                    </el-form-item>
                  </el-col> -->
                  <!-- <el-col :md="6" :lg="4">
                          <el-form-item label='设备类型'  prop='devType'>
                              <el-cascader v-model='addForm.devType' :props=" {value: 'devTypeNum',label: 'devType'}" 
                              placeholder="---请选择---" :options='deviceTypeSpinner' filterable></el-cascader>
                          </el-form-item>
                  </el-col> -->
              </el-row>
              <h4>录制配置</h4>
              <div style="border-top: 1px solid #ebeef5;margin:15px 22px 12px;"></div>
              <el-row :gutter="10">
                  <el-col :md="6" :lg="12">
                    <el-form-item label='是否录制'  prop='SAVEDESKFLAG'>
                            <el-select placeholder="请选择" v-model="addForm.SAVEDESKFLAG">
                              <el-option
                                v-for="item in [{value:'true',label:'开启'},{value:'false',label:'关闭'}]"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12" v-if="!!(addForm.SAVEDESKFLAG=='true')">
                    <el-form-item label='录制码率'  prop='SAVEDESKMALV'>
                            <el-input v-model='addForm.SAVEDESKMALV' placeholder="请输入参数" ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12" v-if="!!(addForm.SAVEDESKFLAG=='true')">
                    <el-form-item label='录制帧率'  prop='SAVEDESKZHENLV'>
                            <el-input v-model='addForm.SAVEDESKZHENLV' placeholder="请输入参数" ></el-input>
                    </el-form-item>
                  </el-col>
              </el-row>
              <h4 v-if="!!(addForm.SAVEDESKFLAG==1)">录制区域参数</h4>
              <div style="border-top: 1px solid #ebeef5;margin:15px 22px 12px;" v-if="!!(addForm.SAVEDESKFLAG=='true')"></div>
              <el-row :gutter="10" v-if="!!(addForm.SAVEDESKFLAG=='true')">
                  <el-col :md="6" :lg="12">
                    <el-form-item label='X'  prop='SAVEDESKAREA.X'>
                            <el-input v-model='addForm.SAVEDESKAREA.X' placeholder="请输入参数" ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12">
                    <el-form-item label='Y'  prop='SAVEDESKAREA.Y'>
                            <el-input v-model='addForm.SAVEDESKAREA.Y' placeholder="请输入参数" ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12">
                    <el-form-item label='宽'  prop='SAVEDESKAREA.WIDTH'>
                            <el-input v-model='addForm.SAVEDESKAREA.WIDTH' placeholder="请输入参数" ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12">
                    <el-form-item label='高'  prop='SAVEDESKAREA.HEIGHT'>
                            <el-input v-model='addForm.SAVEDESKAREA.HEIGHT' placeholder="请输入参数" ></el-input>
                    </el-form-item>
                  </el-col>
              </el-row>
            </el-form>
          </el-card>
          
          <!-- <el-card>
            <el-tabs :tab-position="'top'" style="height: 200px;">
              <el-tab-pane label="自身视频窗口配置">
                <el-form ref='addForm' :model='addForm'  size='mini' label-position="top" :rules="rules">
                  <el-row :gutter="10">
                      <el-col :md="6" :lg="12">
                        <el-form-item label='横坐标x'  prop='x'>
                                <el-input v-model='addForm.devNum' placeholder="请输入参数"  ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :md="6" :lg="12">
                        <el-form-item label='纵坐标y'  prop='y'>
                                <el-input v-model='addForm.devNum' placeholder="请输入参数"  ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :md="6" :lg="12">
                        <el-form-item label='宽度'  prop='width'>
                                <el-input v-model='addForm.devNum' placeholder="请输入参数"  ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :md="6" :lg="12">
                        <el-form-item label='高度'  prop='height'>
                                <el-input v-model='addForm.devNum' placeholder="请输入参数"  ></el-input>
                        </el-form-item>
                      </el-col>
                  </el-row>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="远程视频窗口配置">远程视频窗口配置</el-tab-pane>
              <el-tab-pane label="远程桌面窗口配置">远程桌面窗口配置</el-tab-pane>
              <el-tab-pane label="远程协助窗口配置">远程协助窗口配置</el-tab-pane>
            </el-tabs>
          </el-card> -->
      <div slot="footer" class="dialog-footer">
        <el-button  @click="addPopStatu=false" size="mini">取 消</el-button>
        <el-button type="primary" @click="EditModel" size="mini">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import getGlobalParams from "@/utils/getGlobalParams";
// import selectTree from "@/components/selectTree2/";
//通讯相关
import request from "@/utils/requestTest";
import tableIns from "@/message/video-manage/vedioParameterQuery";
import editIns from "@/message/video-manage/vedioParameterEdit";
// import spinnerList from "@/message/spinnerDataQuery/spinner-data-query";

export default {
  name: "video-parameter-manage",
  // components: { selectTree },
  data() {
    return {
      loading: false,
      selectList: [],
      // brno: [],
      tableData: [],
      currentPage: 1,
      pageSize: getGlobalParams.get("PageSize"),
      tableTotal: 0,
      queryForm: {
        CONFIGID: "",
        CONFIGNAME: ""
      },
      rules: {//校验对象
        CONFIGID: [
          { required: true, message: "请输入编号", trigger: "blur" },
          { max: 2, message: "编号小于2个字符", trigger: "blur" }
        ],
        CONFIGNAME: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { max: 30, message: "名称小于30个字符", trigger: "blur" }
        ],
        SHOWSELFVIDEOFLAG: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { max: 5, message: "需要小于5个字符", trigger: "blur" }
        ],
        CAMERAWIDTH: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { max: 6, message: "需要小于6个字符", trigger: "blur" }
        ],
        CAMERAHEIGHT: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { max: 6, message: "需要小于6个字符", trigger: "blur" }
        ],
        CAMERAMALV: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { max: 10, message: "需要小于10个字符", trigger: "blur" }
        ],
        CAMERAZHENLV: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { max: 4, message: "需要小于4个字符", trigger: "blur" }
        ],
        SAVEDESKFLAG: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { max: 5, message: "需要小于5个字符", trigger: "blur" }
        ],
        // // userID: [
        // //   { required: true, message: "请输入用户编号", trigger: "blur" }
        // // ],
        // branchId: [
        //   { required: true, message: "请选择机构号", trigger: "change" }
        // ],
        // userName: [
        //   { required: true, message: "请输入用户名称", trigger: "blur" },
        //   { max: 200, message: "用户名称长度少于200个字符", trigger: "blur" }
        // ],
        // // remark: [{ max:10, message: "请输入少于120位字符", trigger: "blur" }],
        // telephone: [
        //   { message: "手机号长度少于20个字符", max: 20, trigger: "blur" },
        //   { require: false, validator: validatorPhone, trigger: "blur" }
        // ],
        // emailAddress: [
        //   { max: 20, message: "邮箱长度少于20个字符", trigger: "blur" },
        //   { require: false, validator: validatorEmail, trigger: "blur" }
        // ],
        // jobNumber: [
        //   { required: true, message: "请输入工号", trigger: "blur" },
        //   {
        //     max: 20,
        //     message: "请输入正确工号，长度少于20个字符",
        //     trigger: "blur"
        //   }
        // ],
        // tellerNo: [
        //   { required: true, message: "请输入柜员号", trigger: "blur" },
        //   {
        //     max: 20,
        //     message: "请输入正确柜员号，长度少于20个字符",
        //     trigger: "blur"
        //   }
        // ]
      },
      //弹窗配置
      currOperation:1,//当前操作
      popTitle:"新增音视频配置模板",
      addForm:{
        CONFIGID:"",
        CONFIGNAME:"",
        SHOWSELFVIDEOFLAG:"",
        CAMERAWIDTH:"",
        CAMERAHEIGHT:"",
        CAMERAMALV:"",
        CAMERAZHENLV:"",
        SAVEDESKFLAG:"",
        SAVEDESKAREA:{
          X:"",
          Y:"",
          WIDTH:"",
          HEIGHT:""
        },
        SAVEDESKMALV:"",
        SAVEDESKZHENLV:""
      },
      addPopStatu:false
    }
  },
  methods: {
    clearForm(item) {
      this.$refs["" + item].resetFields();
    },
    tableCheckBoxChange(val) {
      this.selectList = val;
    },
    openPop(type) {
      this.PopType = type;
      if (this.PopType == "add") {//新增
        this.popTitle="新增音视频配置模板"
        this.currOperation = 1;
        this.initPop();
        this.addPopStatu = true;
      } else if (this.PopType == "edit") {//编辑
        this.popTitle="修改音视频配置模板"
        this.currOperation = 2;
        this.addForm.CONFIGID=this.selectList[0].CONFIGID;
        this.addForm.CONFIGNAME=this.selectList[0].CONFIGNAME;

        this.addForm.SHOWSELFVIDEOFLAG=this.selectList[0].SHOWSELFVIDEOFLAG;
        this.addForm.CAMERAWIDTH=this.selectList[0].CAMERAWIDTH;
        this.addForm.CAMERAHEIGHT=this.selectList[0].CAMERAHEIGHT;
        this.addForm.CAMERAMALV=this.selectList[0].CAMERAMALV;
        this.addForm.CAMERAZHENLV=this.selectList[0].CAMERAZHENLV;
        this.addForm.SAVEDESKFLAG=this.selectList[0].SAVEDESKFLAG;
        // this.addForm.SAVEDESKAREA=this.selectList[0].SAVEDESKAREA;
        this.addForm.SAVEDESKAREA=this.selectList[0].SAVEDESKAREA;
        this.addForm.SAVEDESKMALV=this.selectList[0].SAVEDESKMALV;
        this.addForm.SAVEDESKZHENLV=this.selectList[0].SAVEDESKZHENLV;
        

        this.addPopStatu = true;
      } else if (this.PopType == "del") {//删除
        this.currOperation = 3;
        this.delConfirm();
      } else {
        console.log("openPop 出错啦");
      }
    },
    initPop(){
      this.addForm={
        CONFIGID:"",
        CONFIGNAME:"",
        SHOWSELFVIDEOFLAG:"true",
        CAMERAWIDTH:"",
        CAMERAHEIGHT:"",
        CAMERAMALV:"",
        CAMERAZHENLV:"",
        SAVEDESKFLAG:"false",
        SAVEDESKAREA:{
          X:"",
          Y:"",
          WIDTH:"",
          HEIGHT:""
        },//这是个json
        SAVEDESKMALV:"",
        SAVEDESKZHENLV:""
      }
    },
    async queryModel() {
      this.loading = true;
      let resBody = new tableIns();
      resBody.data.CONFIGID = this.queryForm.CONFIGID;
      resBody.data.CONFIGNAME = this.queryForm.CONFIGNAME;
      
      resBody.data.currpage = this.currentPage+"";
      resBody.data.pagerownum = this.pageSize+"";
      // resBody.data.endTime = this.queryForm.eTime;
      // resBody.QueryPageNo = this.currentPage;
      // resBody.QueryRowNum = this.pageSize;
      let response = await request(resBody);
      this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        this.tableData = response.RSP_BODY.RspStruct;
        for(var i=0;i<this.tableData.length;i++){
          var temp = JSON.parse(this.tableData[i].SAVEDESKAREA);
          this.tableData[i].SAVEDESKAREA=temp;
        }
        this.tableTotal = response.RSP_BODY.RecordNum||response.QUERY_INFO_HEAD.QueryAllDataCount;
      } 
      else if (response.SYS_HEAD.ReturnCode =="ARBFQ001") {
        this.tableData=[];
        this.tableTotal = 0;
      }
      else {
        this.$message({
            type: "error",
            message: "请求失败，错误码:" + response.SYS_HEAD.ReturnCode + "，错误信息：" + response.SYS_HEAD.ReturnMessage
          });
      }
    },
    async EditModel() {
      this.$refs["addForm"].validate(async (valid) => {
        if(valid){
          this.loading = true;
          let resBody = new editIns();
          resBody.data.OPERATION = this.currOperation+'';//1新增 2修改 3删除
          resBody.data.CONFIGID = this.currOperation==3?this.selectList[0].CONFIGID:this.addForm.CONFIGID;
          resBody.data.CONFIGNAME = this.addForm.CONFIGNAME;

          resBody.data.SHOWSELFVIDEOFLAG = this.addForm.SHOWSELFVIDEOFLAG;
          resBody.data.CAMERAWIDTH = this.addForm.CAMERAWIDTH;
          resBody.data.CAMERAHEIGHT = this.addForm.CAMERAHEIGHT;
          resBody.data.CAMERAMALV = this.addForm.CAMERAMALV;
          resBody.data.CAMERAZHENLV = this.addForm.CAMERAZHENLV;
          resBody.data.SAVEDESKFLAG = this.addForm.SAVEDESKFLAG;
          resBody.data.SAVEDESKAREA = this.addForm.SAVEDESKAREA;
          resBody.data.SAVEDESKMALV = this.addForm.SAVEDESKMALV;
          resBody.data.SAVEDESKZHENLV = this.addForm.SAVEDESKZHENLV;

          let response = await request(resBody);
          this.loading = false;
          if (response.SYS_HEAD.ReturnCode == "000000") {
            if(this.currOperation==1){
                this.$message({
                type: "success",
                message: "新增成功"
              });
            }
            else if(this.currOperation==2){
              this.$message({
                type: "success",
                message: "修改成功"
              });
            }
            else if(this.currOperation==3){
              this.$message({
                type: "success",
                message: "删除成功"
              });
            }
            else{
              console.log("currOperation有误");
            }
            this.queryModel();
            this.addPopStatu=false;
          } else {
            this.$message({
              type: "error",
              message: "请求失败，错误码:" + response.SYS_HEAD.ReturnCode + "，错误信息：" + response.SYS_HEAD.ReturnMessage
            });
          }
        }
        else {
          this.$message({
            type: "warning",
            message: "请输入合法的数据！"
          });
          return false;
        }
      })
    },
    delConfirm(){
      this.$confirm('此操作将删除'+this.selectList[0].CONFIGID+'模板, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.EditModel();
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // });          
      });
    },
    handleSizeChange(val) { this.pageSize=val;
      this.queryModel();
    },
    handleCurrentChange() {
      this.queryModel();
    },
    //弹窗部分的方法
    validatorPhone(rule, value, callback){
      if (value != "") {
        let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的手机号"));
        }
      } else {
        callback();
      }
    }
  },
  // async created() {
  //   let resBody = new spinnerList();
  //   resBody.data.spinnerList = [{ spinnerName: "branch" }];
  //   let response = await request(resBody);

  //   if (response.SYS_HEAD.ReturnCode == "000000") {
  //     //在之后要塞入空选项
  //     this.brno = response.RSP_BODY.branchSpinner;
  //   } else {
  //     this.$message({
  //           type: "error",
  //           message: "请求失败，错误码:" + response.SYS_HEAD.ReturnCode + "，错误信息：" + response.SYS_HEAD.ReturnMessage
  //         });
  //   }
  // },
  mounted() {
    // console.log(this.devNumberTableData);
    this.queryModel();
  },
};
</script>


<style lang="scss">
.box {
  margin-top: 20px;
  text-align: right;
}
.el-card {
  overflow: inherit;
}
</style>
