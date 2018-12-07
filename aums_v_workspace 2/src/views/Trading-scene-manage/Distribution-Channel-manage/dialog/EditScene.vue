<template>
	<div>
    <el-dialog title="编辑交易场景" @open="openCollback" @close="closeDialog"
    :lock-scroll=false
    :visible.sync="isShow" width="800px">
      <el-steps  :active="active" 
            align-center  style="margin-bottom:10px"
            finish-status="success">
        <el-step title="场景信息"></el-step>
        <el-step title="物料组"></el-step>
        <el-step title="确认"></el-step>
      </el-steps>
      <!-- 场景信息 -->
    <div v-if="active===0">
      <el-card style="margin-bottom:10px;">
        <el-form :model="temp" ref="tempRules" :rules="tempRules"  size="mini" label-position="left" label-width="80px" >
        
          <el-row :gutter="10">
            <el-col :md="12" :lg="12">
               <el-form-item label="交易代码" >
                <el-input v-model="temp.paramKey"
                @blur="paramkeyIsexist" :disabled="inputDisabled"
                placeholder="请输入交易代码"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="12">
              <el-form-item label="交易场景名称" prop="paramKey">
                <el-input v-model="temp.paramKey"
                @blur="paramkeyIsexist" :disabled="inputDisabled"
                placeholder="请输入交易场景名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :md="12" :lg="12">
              <el-form-item label="维护机构" prop="paramKey">
                <el-input v-model="temp.paramKey"
                @blur="paramkeyIsexist" :disabled="inputDisabled"
                placeholder="请输入维护机构"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="12">
              <el-form-item label="维护用户" prop="paramKey">
                <el-input v-model="temp.paramKey"
                @blur="paramkeyIsexist" :disabled="inputDisabled"
                placeholder="请输入维护用户"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
    	</el-card>  
        <div slot="footer" class="dialog-footer" style="text-align:center;">
          <el-button  type="primary" size="mini" style="margin-top: 10px;"
          @click="next()">下一步</el-button>
        </div>
    </div>
    <!-- 物料组选择 -->
    <div v-if="active===1">
        <el-card style="margin-bottom:10px;">
        	<el-form :model="temp" ref="tempRules" :rules="tempRules"  size="mini" label-position="left" label-width="80px" >
          <!-- //添加判断区分输入输出 -->
          <!-- <el-row :gutter="10">
            <el-col :md="12" :lg="12" >
              <el-form-item label="物料组类型" prop="paramKey">
                <el-select v-model="value2" placeholder="请选择物料组类型">
                  <el-option
                  v-for="item in options2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
                </el-col>
                </el-row> -->
            <!-- 标签页选择 -->
            <el-tabs v-model="currentName" >
              <el-tab-pane label="必要输入" name="first">
                 <el-form ref='matlGroupQuery' :model='matlGroupQuery'  size='mini' label-position="top">
                  <el-row :gutter="10">
                  <el-col  :lg="6" :md="8">
                    <el-form-item label='物料组名称'  prop='devNum'>
                      <el-input v-model='matlGroupQuery.MATLGROUPNAME'  
                        placeholder="请输入物料组名称"  ></el-input>
                    </el-form-item>
                  </el-col>  
                  <el-col  :lg="6" :md="8">
                    <el-form-item label='物料组ID'  prop='devNum'>
                      <el-input v-model='matlGroupQuery.MATLGROUPID'  
                      placeholder="请输入物料组ID"  ></el-input>
                    </el-form-item>
                  </el-col>  
                  <el-col  :lg="4" :md="6" class="searchBtnMarginTop">
                    <el-button type='primary' size='mini' icon='el-icon-search' @click="matlQuery('A')">查询</el-button>
                  </el-col>
                  <el-col  :lg="4" :md="6" class="searchBtnMarginTop">
                    <el-button type='warning' size='mini' icon='el-icon-refresh'
                    @click="resetForm('A')">重置</el-button>
                  </el-col>
                  <el-col  :lg="4" :md="6" class="searchBtnMarginTop">
                    <el-button type='warning' size='mini' icon='el-icon-plus'
                    @click="addMatlGroup('A')">添加</el-button>
                  </el-col>
                  </el-row>
                  <el-table :data="outResult" 
                  header-row-class-name="tableHeaderClass"
                    border>
                      <el-table-column type="selection" width="55"></el-table-column>
                      <el-table-column prop="MATLTYPE" label="物料组名称"></el-table-column>
                      <el-table-column prop="MATLID" label="物料组ID"></el-table-column>
                      <el-table-column 
                      align="center"
                        width="160" label="详细信息" fixed="right">
                          <template slot-scope="scope">
                            <el-button type="text" size="mini"
                            @click="handleQueryParameter(scope.$index, scope.row)">查看</el-button>
                          </template>
                        </el-table-column>
                        <el-table-column 
                      align="center"
                        width="160" label="详细信息" fixed="right">
                          <template slot-scope="scope">
                            <el-button type="text" size="mini"
                            @click="handleQueryParameter(scope.$index, scope.row)">修改</el-button>
                          </template>
                        </el-table-column>
                  </el-table>
                </el-form>
              </el-tab-pane>
              <!-- 附加输入 -->
              <el-tab-pane label="附加输入" name="second">
                <el-form ref='matlGroupQuery' :model='matlGroupQuery'  size='mini' label-position="top">
                  <el-row :gutter="10">
                  <el-col  :lg="6" :md="8">
                    <el-form-item label='物料组名称'  prop='devNum'>
                      <el-input v-model='matlGroupQuery.MATLGROUPNAME'  
                        placeholder="请输入物料组名称"  ></el-input>
                    </el-form-item>
                  </el-col>  
                  <el-col  :lg="6" :md="8">
                    <el-form-item label='物料组ID'  prop='devNum'>
                      <el-input v-model='matlGroupQuery.MATLGROUPID'  
                      placeholder="请输入物料组ID"  ></el-input>
                    </el-form-item>
                  </el-col>  
                  <el-col  :lg="4" :md="6" class="searchBtnMarginTop">
                    <el-button type='primary' size='mini' icon='el-icon-search' @click="matlQuery('A')">查询</el-button>
                  </el-col>
                  <el-col  :lg="4" :md="6" class="searchBtnMarginTop">
                    <el-button type='warning' size='mini' icon='el-icon-refresh'
                    @click="resetForm('A')">重置</el-button>
                  </el-col>
                  <el-col  :lg="4" :md="6" class="searchBtnMarginTop">
                    <el-button type='warning' size='mini' icon='el-icon-plus'
                    @click="addMatlGroup('A')">添加</el-button>
                  </el-col>
                  </el-row>
                  <el-table :data="outResult" 
                  header-row-class-name="tableHeaderClass"
                    border>
                      <el-table-column type="selection" width="55"></el-table-column>
                      <el-table-column prop="MATLTYPE" label="物料组名称"></el-table-column>
                      <el-table-column prop="MATLID" label="物料组ID"></el-table-column>
                      <el-table-column 
                      align="center"
                        width="160" label="详细信息" fixed="right">
                          <template slot-scope="scope">
                            <el-button type="text" size="mini"
                            @click="handleQueryParameter(scope.$index, scope.row)">查看</el-button>
                          </template>
                        </el-table-column>
                        <el-table-column 
                      align="center"
                        width="160" label="详细信息" fixed="right">
                          <template slot-scope="scope">
                            <el-button type="text" size="mini"
                            @click="handleQueryParameter(scope.$index, scope.row)">修改</el-button>
                          </template>
                        </el-table-column>
                  </el-table>
                </el-form>
              </el-tab-pane>
              <!-- 输出物料组 -->
              <el-tab-pane label="输出" name="third">
                <el-form ref='matlGroupQuery' :model='matlGroupQuery'  size='mini' label-position="top">
                  <el-row :gutter="10">
                  <el-col  :lg="6" :md="8">
                    <el-form-item label='物料组名称'  prop='devNum'>
                      <el-input v-model='matlGroupQuery.MATLGROUPNAME'  
                        placeholder="请输入物料组名称"  ></el-input>
                    </el-form-item>
                  </el-col>  
                  <el-col  :lg="6" :md="8">
                    <el-form-item label='物料组ID'  prop='devNum'>
                      <el-input v-model='matlGroupQuery.MATLGROUPID'  
                      placeholder="请输入物料组ID"  ></el-input>
                    </el-form-item>
                  </el-col>  
                  <el-col  :lg="4" :md="6" class="searchBtnMarginTop">
                    <el-button type='primary' size='mini' icon='el-icon-search' @click="matlQuery('A')">查询</el-button>
                  </el-col>
                  <el-col  :lg="4" :md="6" class="searchBtnMarginTop">
                    <el-button type='warning' size='mini' icon='el-icon-refresh'
                    @click="resetForm('A')">重置</el-button>
                  </el-col>
                  <el-col  :lg="4" :md="6" class="searchBtnMarginTop">
                    <el-button type='warning' size='mini' icon='el-icon-plus'
                    @click="addMatlGroup('A')">添加</el-button>
                  </el-col>
                  </el-row>
                  <el-table :data="outResult" 
                  header-row-class-name="tableHeaderClass"
                    border>
                      <el-table-column type="selection" width="55"></el-table-column>
                      <el-table-column prop="MATLTYPE" label="物料组名称"></el-table-column>
                      <el-table-column prop="MATLID" label="物料组ID"></el-table-column>
                      <el-table-column 
                      align="center"
                        width="160" label="详细信息" fixed="right">
                          <template slot-scope="scope">
                            <el-button type="text" size="mini"
                            @click="handleQueryParameter(scope.$index, scope.row)">查看</el-button>
                          </template>
                        </el-table-column>
                        <el-table-column 
                      align="center"
                        width="160" label="详细信息" fixed="right">
                          <template slot-scope="scope">
                            <el-button type="text" size="mini"
                            @click="handleQueryParameter(scope.$index, scope.row)">修改</el-button>
                          </template>
                        </el-table-column>
                  </el-table>
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </el-form>
        </el-card>
        <div slot="footer" class="dialog-footer" style="text-align:center;">
            <el-button type="primary" size="mini" style="margin-top: 10px;" @click="back()">上一步</el-button>
            <el-button type="primary" size="mini" style="margin-top: 10px;" @click="next()">下一步</el-button>
            <el-button type="primary" size="mini" style="margin-top: 10px;" @click="isShow = false;active--">取 消</el-button>
        </div>
    </div>
    <!-- 确认物料组选择情况 -->
    <div v-if="active===2">
      <el-card style="margin-bottom:10px;">
        <span>以下是您选择的物料组，请确认!</span><br><br>
        <el-table :data="outResult" 
          header-row-class-name="tableHeaderClass"
          border>
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="MATLTYPE" label="物料组名称"></el-table-column>
          <el-table-column prop="MATLID" label="物料组ID"></el-table-column> 
        </el-table>
    	</el-card>  
        <div slot="footer" class="dialog-footer" style="text-align:center;">
          <el-button type="primary" size="mini" style="margin-top: 10px;" @click="back()">上一步</el-button>
          <el-button type="primary" size="mini" style="margin-top: 10px;" @click="isShow = false;active--">取 消</el-button>
          <el-button type="primary" size="mini" style="margin-top: 10px;"
          @click="tradeSceneAdd()">确 定</el-button>       
        </div>
    </div>
    </el-dialog>
	</div>
</template>

<script>
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
import getGuid from "@/utils/getGuid";
import Sortable from "sortablejs";

import spinnerDataQuery from "@/message/spinnerDataQuery/spinner-data-query";
import paramAdd from "@/message/parameterManage/param-add";
import paramEdit from "@/message/parameterManage/param-edit";
import paramkeyIsexist from "@/message/parameterManage/paramkey-isexist";
export default {
  props: {
    option: Object,
    rowData: Object
  },
  data() {
    //对参数名称进行逻辑判断（要求英文或数字）
    var checkparamKey = (rule, value, callback) => {
      var re = /^[0-9a-zA-Z]*$/g;
      if (!value) {
        callback(new Error("请输入参数名称"));
      } else {
        if (!re.test(value)) {
          callback(new Error("请输入数字值或英文"));
        } else {
          callback();
        }
      }
    };
    var checkparamDesc = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入参数描述"));
      } else {
        callback();
      }
    };
    return {
      // 页面号
      active:0,
      //页面
      currentName:'first',
      //物料组查询表单：
      matlGroupQuery:{
        MATLGROUPROS:'',//物料组性质
        MATLGROUPID:'',//物料组ID
        MATLGROUPNAME:'',//物料组名称
        MATLID:'',//物料ID
      },
      //物料组信息表单
      matlGroupInfo:{
        MATLGROUPID:'',
        MATLGROUPNAME:'',
      },
      //定义维护结构：
      tradeSceneInfo:{
        OPERTYPE:'',//操作类型
        TRANCODE:'',//交易代码
        SCENESEQ:'',//交易场景序号
        SCENECODE:'',//交易场景ID
        SCENECODENAME:'',//交易场景名称
        INMATLGROUPID:'',//附加输入组ID
        OUTMATLGROUPID:'',//输出物料组ID
        NECYINMATLGROUPID:'',//必要输入物料组ID
        MODORGNO:'',//维护机构
        MODUSER:'',//维护用户  
      },
      // 上传字段定义：
			multiple:'',
      movie:'',
      //物料信息模拟：
			outResult:[
				{
					MATLTYPE:"现金输入物料组",
					MATLID:'0001',
					VOUNUM:'15'
				},
				{
					MATLTYPE:"注销卡物料组 ",
					MATLID:'0002',
					VOUNUM:'16'
				},
				{
					MATLTYPE:"跨行转账物料组",
					MATLID:'0003',
					VOUNUM:'5'
				}
			],
      // 物料组性质下拉框选项；
      options: [{
          value: '选项1',
          label: '001-重空-卡'
        }, {
          value: '选项2',
          label: '002-重空-折'
        }, {
          value: '选项3',
          label: '003-重空-票据类'
        },
        {
          value: '选项4',
          label: '004-重空-其他'
        }, {
          value: '选项5',
          label: '101-合法性材料-证件-身份证'
        }, {
          value: '选项6',
          label: '102-合法性材料-证件-非身份证'
        },
         {
          value: '选项7',
          label: '103-合法性材料-其他 '
        }, {
          value: '选项8',
          label: '201-非重空凭证'
        }, {
          value: '选项9',
          label: '301-现金-本币'
        },
        {
          value: '选项10',
          label: '302-现金外币 '
        },
         {
          value: '选项11',
          label: '303-残币 '
        }, {
          value: '选项12',
          label: '304-假币'
        }, {
          value: '选项13',
          label: '401-监管要求'
        },
        ],
        value: '',
      //凭证类型下拉框选项；
      options2: [{
          value: '选项1',
          label: '必要输入'
        }, {
          value: '选项2',
          label: '附加输入'
        }, {
          value: '选项3',
          label: '输出'
        }],
      value2: '',
      paramExist:'',//参数是否存在标志
      cProgramSpinner: [],
      devFormSpinner: [],

      paramValue: [], // 表格中的数据
      paramData: null, // 需要传输到后台的参数字符串，用下划线拼接的字符串“_”
      dialogStatus: "",
      innerVisible: false,
      moveClass: false,
      inputDisabled: false,
      temp: {
        data: "",
        id: "",
        paramKey: "",
        paramDesc: ""
      },
      // dataRules: {},
      tempRules: {
        data: [
          { required: true, message: "请输入您要设定的值", trigger: "blur" }
        ],
        paramKey: [{ validator: checkparamKey, trigger: "blur" }],
        paramDesc: [{ validator: checkparamDesc, trigger: "blur" }]
      },
      titleVal: "",
      sortable: null,
      oldList: [],
      newList: []
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
    // isEdit: function() {
    //   if (this.option.isEdit) {
    //     return (this.option.isEdit = "编辑交易场景");
    //   } else {
    //     return (this.option.isEdit = "新增交易场景");
    //   }
    // },
    tableDataRow: function() {
      return this.rowData;
    }
  },
  created() {},
  methods: {
    matlQuery () {
      //此处查询物料组函数
    },
    //清空表单
    resetForm(){
      //表单内容置零
    },
    // 查看当前行参数详情信息
    handleQueryParameter(index, row) {
      //打开详细信息弹窗
    },
    //添加新物料组
    addMatlGroup(){

    },
    //添加交易信息
    tradeSceneAdd(){
      this.option.isShow = false
    },
    // 打开dialog回调
    openCollback() {
      this.initSpinnerList();
      if (this.option.isEdit === "编辑参数") {
        this.inputDisabled = true;
        this.temp.paramKey = this.tableDataRow.paramKey;
        this.temp.paramDesc = this.tableDataRow.paramDesc;
        let paramAll = this.tableDataRow.paramValue.split("|_|");
        // console.log(this.tableDataRow)
        this.paramValue = [];
        paramAll.map(item => {
          this.paramValue.push({ data: item, id: getGuid() });
        });
        // console.log(this.paramValue)
      } else {
        this.inputDisabled = false;
        this.temp.paramKey = "";
        this.temp.paramDesc = "";
        this.paramValue = [];
      }
    },
    next(){
        this.active++;
    },
    back(){
        this.active--;
    },
    //关闭弹窗时清空temp数据
    closeDialog() {
      this.active=0;
      this.temp = {}; //清空数据
      this.$nextTick(() => {
        this.$refs["tempRules"].clearValidate();
      });
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
          this.cProgramSpinner = response.RSP_BODY.cProgramSpinner;
          this.devFormSpinner = response.RSP_BODY.devFormSpinner;
        })
        .catch(error => {
          console.error("查询错误", error);
        });
    },

    // 获取参数值的数据
    getParamData() {
      let paramArr = [];
      this.paramValue.map(function(item) {
        paramArr.push(item.data);
      });
      this.paramData = paramArr.join("|_|");
    },
    // 添加参数信息
    paramAdd(formName) {
      //判断参数值是否存在
      if(!this.paramExist){
              this.$refs[formName].validate(valid => {
        // 判断data是否为空
        if (this.temp.data === "") {
          console.log("data is null.");
          this.$message({
            message: "参数值不能为空",
            type: "warning"
          });
        } else {
          var re = /^[0-9a-zA-Z]*$/g;
          if (!re.test(this.temp.paramKey)) {
            this.$message({
              message: "参数名称必须为英文字母或数字",
              type: "warning"
            });
          } else {
            if (valid) {
              //校验完成后判断paramkey/paramDesc是否为空
              if (this.temp.paramKey === "" || this.temp.paramDesc === "") {
                console.log("param is null.");
                this.$message({
                  message: "参数名称或参数描述不能为空",
                  type: "warning"
                });
              } else {
                this.getParamData();
                let resBody = new paramAdd();
                resBody.data.paramKey = this.temp.paramKey;
                resBody.data.paramDesc = this.temp.paramDesc;
                resBody.data.paramValue = this.paramData;
                // console.log(this.temp.paramKey);
                // console.log(this.temp.paramDesc);
                // console.log(this.paramData);
                request(resBody)
                  .then(response => {
                    if (response.SYS_HEAD.ReturnCode === "000000") {
                      this.$parent.queryInfoList();
                      this.isShow = false;
                      this.$message({
                        type: "success",
                        message: "新增参数成功!"
                      });
                    } else {
                      console.log(response);
                    }
                  })
                  .catch(error => {
                    console.log("error", error);
                  });
              }
            } else {
              console.log("error submit!!");
              return false;
            }
          }
        }
      });
      }else{
         this.$message({
            message: "该参数名称已存在",
            type: "warning"
        });
      }
    },
    // 编辑参数信息
    paramEdit() {
      if (this.temp.paramDesc !== "" && this.paramValue.length !== 0) {
        this.getParamData();
        let resBody = new paramEdit();
        resBody.data.paramKey = this.temp.paramKey;
        resBody.data.paramDesc = this.temp.paramDesc;
        resBody.data.paramValue = this.paramData;
        request(resBody)
          .then(response => {
            if (response.SYS_HEAD.ReturnCode === "000000") {
              console.log(response);
              this.$parent.queryInfoList();
              this.isShow = false;
              this.$message({
                        type: "success",
                        message: "修改参数成功!"
                      });
            } else {
              console.log(response);
            }
          })
          .catch(error => {
            console.log("error", error);
          });
        console.log("error submit!!");
        return false;
      } else {
        console.log("data is null.");
        this.$message({
          message: "参数值或参数描述不能为空",
          type: "warning"
        });
      }
    },

    // 校验参数可以是否存在
    paramkeyIsexist() {
      let resBody = new paramkeyIsexist();
      resBody.data.paramKey = this.temp.paramKey;
      request(resBody)
        .then(response => {
          if (response.SYS_HEAD.ReturnCode === "000000") {
            this.paramExist = false;      //添加标志
            // console.log(response,"if");   //正常
          } else {
            this.paramExist = true;      //添加标志
            // console.log(response,"else");     //出现重名参数
            this.$message({
            message: "该参数名称已存在",
            type: "warning"
        });
          }
        })
        .catch(error => {
          console.log("error", error);
        });
    },

    resetTemp() {
      this.temp = {
        data: "",
        id: undefined,
        paramKey: this.temp.paramKey,
        paramDesc: this.temp.paramDesc
      };
    },

    // 点击新增参数值dialog显示
    handleCreate() {
      console.log(this.paramValue);
      this.resetTemp();
      this.dialogStatus = "create";
      this.titleVal = "新增参数值";
      this.innerVisible = true;
      this.$nextTick(() => {
        this.$refs["tempRules"].clearValidate();
      });
    },

    // 修改保存按钮
    updateData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          for (const v of this.paramValue) {
            if (v.id == this.temp.id) {
              const index = this.paramValue.indexOf(v);
              this.paramValue.splice(index, 1, this.temp); //删除当前下标的一个元素
              this.innerVisible = false;
              this.$notify({
                title: "成功",
                message: "更新成功",
                type: "success",
                offset: 60,
                duration: 2000
              });
            }
          }
        }
      });
    },
    // 参数值添加
    createData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.temp.id = getGuid(); //生成全局统一的标识符
          this.paramValue.unshift(this.temp); //向数组开头添加元素
          this.innerVisible = false;
          this.$notify({
            // title: "成功",
            message: "参数值添加成功！",
            type: "success",
            offset: 60,
            duration: 2000
          });
        }
      });
    },
    // 参数值修改
    handleUpdata(row) {
      // console.log(this.temp.paramKey);
      //临时暂存paramKey/paramDesc的值；
      var paramKey1 = this.temp.paramKey;
      var paramDesc1 = this.temp.paramDesc;
      this.temp = Object.assign({}, row);
      //浅拷贝后覆盖原值需重新传参
      this.temp.paramKey = paramKey1;
      this.temp.paramDesc = paramDesc1;
      this.dialogStatus = "update";
      this.titleVal = "编辑";
      this.innerVisible = true;
      this.$nextTick(() => {
        this.$refs["tempRules"].clearValidate();
      });
    },
    // 参数值的删除
    dialogDelete(row) {
      const index = this.paramValue.indexOf(row);
      this.paramValue.splice(index, 1);
      this.temp.data = "";
      this.$notify({
        title: "成功",
        message: "删除成功",
        type: "success",
        offset: 60,
        duration: 2000
      });
    },

    upMove(col) {
      for (let i = 0; i < this.paramValue.length; i++) {
        if (this.paramValue[i].id == col.id) {
          let index = this.paramValue.indexOf(this.paramValue[i]); //获取当前对象在该数组的索引
          if (index == 0) {
            return;
          }
          let tempOption = this.paramValue[index - 1]; //存储前一个
          this.$set(this.paramValue, index - 1, this.paramValue[index]);
          this.$set(this.paramValue, index, tempOption);
        }
      }
    },

    // 获取参数值的数据
    getList() {
      this.moveClass = true;
      this.oldList = this.paramValue.map(v => v.id);
      this.newList = this.oldList.slice();
      this.$nextTick(() => {
        this.setSort();
      });
    },
    // sortable
    setSort() {
      const el = document.querySelectorAll(
        ".dragTable .el-table__body-wrapper > table > tbody"
      )[0];
      let self = this;
      this.sortable = Sortable.create(el, {
        ghostClass: "sortable-ghost", // Class name for the drop placeholder,
        setData: function(dataTransfer) {
          dataTransfer.setData("Text", "");
          // to avoid Firefox bug
          // Detail see : https://github.com/RubaXa/Sortable/issues/1012
        },
        onEnd: evt => {
          let clonedItems = self.paramValue.filter(function(item) {
            return item;
          });
          const targetRow = clonedItems.splice(evt.oldIndex, 1)[0];
          clonedItems.splice(evt.newIndex, 0, targetRow);
          self.paramValue = [];
          self.$nextTick(() => {
            self.paramValue = clonedItems;
          });

          // for show the changes, you can delete in you code
          // const tempIndex = this.newList.splice(evt.oldIndex, 1)[0];
          // this.newList.splice(evt.newIndex, 0, tempIndex);
          // console.log(self.paramValue)
        }
      });
    }
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
