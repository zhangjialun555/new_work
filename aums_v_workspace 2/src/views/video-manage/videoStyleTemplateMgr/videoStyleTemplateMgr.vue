<template>
  <div class="video-style-manage" v-loading="loading" element-loading-text="加载中。。。">
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
                      <el-form-item label='样式编号' prop='LAYOUTID'>
                        <el-input v-model='queryForm.LAYOUTID' placeholder="请输入样式编号"></el-input>
                      </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="4">
                      <el-form-item label='样式名称' prop='LAYOUNAME'>
                        <el-input v-model='queryForm.LAYOUNAME' placeholder="请输入样式名称"></el-input>
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
            <el-table-column fixed prop='LAYOUTID' label='样式编号' ></el-table-column>
            <el-table-column prop='LAYOUNAME' label='样式名称'></el-table-column>
            <el-table-column label='操作' align="center" fixed="right" width="120">
              <template slot-scope="scope">
                <!-- <el-button size="mini" type="text" v-if="scope.row.STATUS==1" @click="meetingCtrl(scope.row)">操作</el-button> -->
                <el-button size="mini" type="text" @click="openPop('checkDetail',scope.row)">查看详情</el-button>
              </template>
            </el-table-column>
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
    <el-dialog :title="popTitle" :visible.sync="addPopStatu" :lock-scroll="false" width="800px" :close-on-click-modal="!!(currOperation==4)">
          <el-card>
            <el-form ref='addForm' :model='addForm'  size='mini' label-position="top" :rules="rules">
              <el-row :gutter="10">
                  <el-col :md="6" :lg="12">
                    <el-form-item label='样式模板ID'  prop='LAYOUTID'>
                            <el-input v-model='addForm.LAYOUTID' placeholder="请输入参数"  :disabled="currOperation==2||currOperation==4"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12">
                    <el-form-item label='样式模板名称'  prop='LAYOUNAME'>
                            <el-input v-model='addForm.LAYOUNAME' placeholder="请输入参数"  :disabled="currOperation==2||currOperation==4"></el-input>
                    </el-form-item>
                  </el-col>
              </el-row>
              <h4>自身视频窗口配置</h4>
              <div style="border-top: 1px solid #ebeef5;margin:15px 22px 12px;"></div>
              <el-row :gutter="10">
                  <el-col :md="6" :lg="12">
                    <el-form-item label='横坐标x'  prop='SELFVIDEOSTYLE.X'>
                            <el-input v-model='addForm.SELFVIDEOSTYLE.X' placeholder="请输入参数"  :disabled="currOperation==4"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12">
                    <el-form-item label='纵坐标y'  prop='SELFVIDEOSTYLE.Y'>
                            <el-input v-model='addForm.SELFVIDEOSTYLE.Y' placeholder="请输入参数"  :disabled="currOperation==4"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12">
                    <el-form-item label='宽度'  prop='SELFVIDEOSTYLE.WIDTH'>
                            <el-input v-model='addForm.SELFVIDEOSTYLE.WIDTH' placeholder="请输入参数"  :disabled="currOperation==4"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12">
                    <el-form-item label='高度'  prop='SELFVIDEOSTYLE.HEIGHT'>
                            <el-input v-model='addForm.SELFVIDEOSTYLE.HEIGHT' placeholder="请输入参数"  :disabled="currOperation==4"></el-input>
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
              <h4>远程视频窗口配置</h4>
              <div style="border-top: 1px solid #ebeef5;margin:15px 22px 12px;"></div>
              <el-row :gutter="10">
                  <el-col :md="6" :lg="12">
                    <el-form-item label='横坐标x'  prop='REMOTEVIDEOSTYLE.X'>
                            <el-input v-model='addForm.REMOTEVIDEOSTYLE.X' placeholder="请输入参数" :disabled="currOperation==4"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12">
                    <el-form-item label='纵坐标y'  prop='REMOTEVIDEOSTYLE.Y'>
                            <el-input v-model='addForm.REMOTEVIDEOSTYLE.Y' placeholder="请输入参数" :disabled="currOperation==4"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12">
                    <el-form-item label='宽度'  prop='REMOTEVIDEOSTYLE.WIDTH'>
                            <el-input v-model='addForm.REMOTEVIDEOSTYLE.WIDTH' placeholder="请输入参数" :disabled="currOperation==4"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12">
                    <el-form-item label='高度'  prop='REMOTEVIDEOSTYLE.HEIGHT'>
                            <el-input v-model='addForm.REMOTEVIDEOSTYLE.HEIGHT' placeholder="请输入参数" :disabled="currOperation==4"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12">
                    <el-form-item label='是否显示标题栏'  prop='REMOTEVIDEOSTYLE.SHOWTITLE'>
                            <el-select placeholder="请选择" v-model="addForm.REMOTEVIDEOSTYLE.SHOWTITLE" :disabled="currOperation==4">
                              <el-option
                                v-for="item in [{value:'true',label:'是'},{value:'false',label:'否'}]"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12">
                    <el-form-item label='是否显示logo区域'  prop='REMOTEVIDEOSTYLE.SHOWLOGO'>
                            <el-select placeholder="请选择" v-model="addForm.REMOTEVIDEOSTYLE.SHOWLOGO" :disabled="currOperation==4">
                              <el-option
                                v-for="item in [{value:'true',label:'是'},{value:'false',label:'否'}]"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12">
                    <el-form-item label='是否显示远程视频画面'  prop='REMOTEVIDEOSTYLE.SHOWVIDEO'>
                            <el-select placeholder="请选择" v-model="addForm.REMOTEVIDEOSTYLE.SHOWVIDEO" :disabled="currOperation==4">
                              <el-option
                                v-for="item in [{value:'true',label:'是'},{value:'false',label:'否'}]"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12">
                    <el-form-item label='是否显示视频属性'  prop='REMOTEVIDEOSTYLE.SHOWPRO'>
                            <el-select placeholder="请选择" v-model="addForm.REMOTEVIDEOSTYLE.SHOWPRO" :disabled="currOperation==4">
                              <el-option
                                v-for="item in [{value:'true',label:'是'},{value:'false',label:'否'}]"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12">
                    <el-form-item label='是否显示版权信息'  prop='REMOTEVIDEOSTYLE.SHOWCOPY'>
                            <el-select placeholder="请选择" v-model="addForm.REMOTEVIDEOSTYLE.SHOWCOPY" :disabled="currOperation==4">
                              <el-option
                                v-for="item in [{value:'true',label:'是'},{value:'false',label:'否'}]"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                    </el-form-item>
                  </el-col>
              </el-row>
              <h4>远程桌面窗口配置</h4>
              <div style="border-top: 1px solid #ebeef5;margin:15px 22px 12px;"></div>
              <el-row :gutter="10">
                  <el-col :md="6" :lg="12">
                    <el-form-item label='横坐标x'  prop='REMOTEDESKSTYLE.X'>
                            <el-input v-model='addForm.REMOTEDESKSTYLE.X' placeholder="请输入参数" :disabled="currOperation==4"  ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12">
                    <el-form-item label='纵坐标y'  prop='REMOTEDESKSTYLE.Y'>
                            <el-input v-model='addForm.REMOTEDESKSTYLE.Y' placeholder="请输入参数" :disabled="currOperation==4"  ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12">
                    <el-form-item label='宽度'  prop='REMOTEDESKSTYLE.WIDTH'>
                            <el-input v-model='addForm.REMOTEDESKSTYLE.WIDTH' placeholder="请输入参数" :disabled="currOperation==4"  ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12">
                    <el-form-item label='高度'  prop='REMOTEDESKSTYLE.HEIGHT'>
                            <el-input v-model='addForm.REMOTEDESKSTYLE.HEIGHT' placeholder="请输入参数" :disabled="currOperation==4"  ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12">
                    <el-form-item label='是否显示标题栏'  prop='REMOTEDESKSTYLE.SHOWTITLE'>
                            <el-select placeholder="请选择" v-model="addForm.REMOTEDESKSTYLE.SHOWTITLE" :disabled="currOperation==4">
                              <el-option
                                v-for="item in [{value:'true',label:'是'},{value:'false',label:'否'}]"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                    </el-form-item>
                  </el-col>
              </el-row>
              <h4>远程协助窗口配置</h4>
              <div style="border-top: 1px solid #ebeef5;margin:15px 22px 12px;"></div>
              <el-row :gutter="10">
                  <el-col :md="6" :lg="12">
                    <el-form-item label='横坐标x'  prop='REMOTEHELPSTYLE.X'>
                      <el-input v-model='addForm.REMOTEHELPSTYLE.X' placeholder="请输入参数" :disabled="currOperation==4"  ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12">
                    <el-form-item label='纵坐标y'  prop='REMOTEHELPSTYLE.Y'>
                      <el-input v-model='addForm.REMOTEHELPSTYLE.Y' placeholder="请输入参数" :disabled="currOperation==4"  ></el-input>
                    </el-form-item>
                  </el-col>
              </el-row>
            </el-form>
          </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="addPopStatu=false" size="mini">取 消</el-button>
        <el-button type="primary" @click="EditModel" size="mini" v-if="!(currOperation==4)">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import getGlobalParams from "@/utils/getGlobalParams";
// import selectTree from "@/components/selectTree2/";
//通讯相关
import request from "@/utils/requestTest";
import tableIns from "@/message/video-manage/vedioStyleQuery";
import editIns from "@/message/video-manage/vedioStyleEdit";
// import spinnerList from "@/message/spinnerDataQuery/spinner-data-query";

export default {
  name: "video-style-manage",
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
        LAYOUTID: "",
        LAYOUNAME: ""
      },
      rules: {//校验对象
        // userID: [
        //   { required: true, message: "请输入用户编号", trigger: "blur" }
        // ],
        LAYOUTID: [
          { required: true, message: "请输入编号", trigger: "blur" },
          { max: 2, message: "编号小于2个字符", trigger: "blur" }
        ],
        LAYOUNAME: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { max: 30, message: "名称小于30个字符", trigger: "blur" }
        ],
        'REMOTEVIDEOSTYLE.X': [
          { required: true, message: "请输入值", trigger: "blur" }
        ],
        'REMOTEVIDEOSTYLE.Y': [
          { required: true, message: "请输入值", trigger: "blur" }
        ],
        'REMOTEVIDEOSTYLE.WIDTH': [
          { required: true, message: "请输入值", trigger: "blur" }
        ],
        'REMOTEVIDEOSTYLE.HEIGHT': [
          { required: true, message: "请输入值", trigger: "blur" }
        ],
        'REMOTEVIDEOSTYLE.SHOWTITLE': [
          { required: true, message: "请输入值", trigger: "blur" }
        ],
        'REMOTEVIDEOSTYLE.SHOWLOGO': [
          { required: true, message: "请输入值", trigger: "blur" }
        ],
        'REMOTEVIDEOSTYLE.SHOWVIDEO': [
          { required: true, message: "请输入值", trigger: "blur" }
        ],
        'REMOTEVIDEOSTYLE.SHOWPRO': [
          { required: true, message: "请输入值", trigger: "blur" }
        ],
        'REMOTEVIDEOSTYLE.SHOWCOPY': [
          { required: true, message: "请输入值", trigger: "blur" }
        ],
        // remark: [{ max:10, message: "请输入少于120位字符", trigger: "blur" }],
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
      currOperation:1,//当前操作 1新增 2编辑 3删除 （4查看 自己添加的）
      popTitle:"新增视频样式模板",
      addForm:{
        LAYOUNAME:"",
        LAYOUTID:"",
        SELFVIDEOSTYLE:{
          X:'',
          Y:'',
          WIDTH:'',
          HEIGHT:''
        },
        REMOTEVIDEOSTYLE:{
          X:'',
          Y:'',
          WIDTH:'',
          HEIGHT:'',
          SHOWTITLE:'',
          SHOWLOGO:'',
          SHOWVIDEO:'',
          SHOWPRO:'',
          SHOWCOPY:''
        },
        REMOTEDESKSTYLE:{
          X:'',
          Y:'',
          WIDTH:'',
          HEIGHT:'',
          SHOWTITLE:'',
        },
        REMOTEHELPSTYLE:{
          X:'',
          Y:''
        }
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
    openPop(type,row) {
      this.PopType = type;
      if (this.PopType == "add") {//新增
        this.popTitle="新增视频样式模板"
        this.currOperation = 1;
        this.initPop();
        this.addPopStatu = true;
      } else if (this.PopType == "edit") {//编辑
        this.popTitle="修改视频样式模板"
        this.currOperation = 2;
        this.initPop();

        this.addForm.LAYOUTID=this.selectList[0].LAYOUTID;
        this.addForm.LAYOUNAME=this.selectList[0].LAYOUNAME;

        // console.log(this.selectList[0]);
        this.addForm.REMOTEDESKSTYLE=this.selectList[0].REMOTEDESKSTYLE?JSON.parse(this.selectList[0].REMOTEDESKSTYLE):this.selectList[0].REMOTEDESKSTYLE;
        this.addForm.REMOTEHELPSTYLE=this.selectList[0].REMOTEHELPSTYLE?JSON.parse(this.selectList[0].REMOTEHELPSTYLE):this.selectList[0].REMOTEHELPSTYLE;
        this.addForm.REMOTEVIDEOSTYLE=this.selectList[0].REMOTEVIDEOSTYLE?JSON.parse(this.selectList[0].REMOTEVIDEOSTYLE):this.selectList[0].REMOTEVIDEOSTYLE;
        this.addForm.SELFVIDEOSTYLE=this.selectList[0].SELFVIDEOSTYLE?JSON.parse(this.selectList[0].SELFVIDEOSTYLE):this.selectList[0].SELFVIDEOSTYLE;

        // this.addForm.REMOTEDESKSTYLE=typeof(this.selectList[0].REMOTEDESKSTYLE)=="Object"?this.selectList[0].REMOTEDESKSTYLE:JSON.parse(this.selectList[0].REMOTEDESKSTYLE);
        // this.addForm.REMOTEHELPSTYLE=typeof(this.selectList[0].REMOTEHELPSTYLE)=="Object"?this.selectList[0].REMOTEHELPSTYLE:JSON.parse(this.selectList[0].REMOTEHELPSTYLE);
        // this.addForm.REMOTEVIDEOSTYLE=typeof(this.selectList[0].REMOTEVIDEOSTYLE)=="Object"?this.selectList[0].REMOTEVIDEOSTYLE:JSON.parse(this.selectList[0].REMOTEVIDEOSTYLE);
        // this.addForm.SELFVIDEOSTYLE=typeof(this.selectList[0].SELFVIDEOSTYLE)=="Object"?this.selectList[0].SELFVIDEOSTYLE:JSON.parse(this.selectList[0].SELFVIDEOSTYLE);
        this.addPopStatu = true;
      } else if (this.PopType == "del") {//删除
        this.currOperation = 3;
        this.delConfirm();
      } else if (this.PopType == "checkDetail") {//查看详情
        this.popTitle="查看视频样式"
        this.initPop();
        this.currOperation = 4;

        this.addForm.LAYOUTID=row.LAYOUTID;
        this.addForm.LAYOUNAME=row.LAYOUNAME;

        this.addForm.REMOTEDESKSTYLE=row.REMOTEDESKSTYLE?JSON.parse(row.REMOTEDESKSTYLE):row.REMOTEDESKSTYLE;
        this.addForm.REMOTEHELPSTYLE=row.REMOTEHELPSTYLE?JSON.parse(row.REMOTEHELPSTYLE):row.REMOTEHELPSTYLE;
        this.addForm.REMOTEVIDEOSTYLE=row.REMOTEVIDEOSTYLE?JSON.parse(row.REMOTEVIDEOSTYLE):row.REMOTEVIDEOSTYLE;
        this.addForm.SELFVIDEOSTYLE=row.SELFVIDEOSTYLE?JSON.parse(row.SELFVIDEOSTYLE):row.SELFVIDEOSTYLE;

        this.addPopStatu = true;
      } else {
        console.log("openPop 出错啦");
      }
    },
    initPop(){
      this.addForm={
        SELFVIDEOSTYLE:{
          X:'',
          Y:'',
          WIDTH:'',
          HEIGHT:''
        },
        REMOTEVIDEOSTYLE:{
          X:'',
          Y:'',
          WIDTH:'',
          HEIGHT:'',
          SHOWTITLE:'true',
          SHOWLOGO:'true',
          SHOWVIDEO:'true',
          SHOWPRO:'true',
          SHOWCOPY:'true'
        },
        REMOTEDESKSTYLE:{
          X:'',
          Y:'',
          WIDTH:'',
          HEIGHT:'',
          SHOWTITLE:'true',
        },
        REMOTEHELPSTYLE:{
          X:'',
          Y:''
        }
      }
    },
    async queryModel() {
      this.loading = true;
      let resBody = new tableIns();
      resBody.data.LAYOUTID = this.queryForm.LAYOUTID;
      resBody.data.LAYOUNAME = this.queryForm.LAYOUNAME;
      
      resBody.data.currpage = this.currentPage+"";
      resBody.data.pagerownum = this.pageSize+"";
      // resBody.data.endTime = this.queryForm.eTime;
      // resBody.QueryPageNo = this.currentPage;
      // resBody.QueryRowNum = this.pageSize;
      let response = await request(resBody);
      this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        this.tableData = response.RSP_BODY.RspStruct
        this.tableTotal = response.RSP_BODY.RecordNum||response.QUERY_INFO_HEAD.QueryAllDataCount;
      } else {
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
          resBody.data.LAYOUTID = this.currOperation==3?this.selectList[0].LAYOUTID:this.addForm.LAYOUTID;
          resBody.data.LAYOUNAME = this.addForm.LAYOUNAME;
          resBody.data.SELFVIDEOSTYLE = this.addForm.SELFVIDEOSTYLE;
          resBody.data.REMOTEVIDEOSTYLE = this.addForm.REMOTEVIDEOSTYLE;
          resBody.data.REMOTEDESKSTYLE = this.addForm.REMOTEDESKSTYLE;
          resBody.data.REMOTEHELPSTYLE = this.addForm.REMOTEHELPSTYLE;
          
          
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
      this.$confirm('此操作将删除'+this.selectList[0].LAYOUTID+'模板, 是否继续?', '提示', {
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
