<template>
  <div>
    <!-- 收审模式标签 -->
    <el-dialog title="收审模式维护" @open="openCollback" @close="closeDialog('In')"
    :lock-scroll=false
    :visible.sync="isShow" width="800px">
      <el-card>
        <el-form :model="matlInfo" ref="matlInfo"  label-position="left" size="mini" label-width="80px">
          <el-row :gutter="10">
            <el-col :md="12" :lg="12">
              <el-form-item label="物料名称" >
                <el-input :disabled="true" 
                v-model="matlInfo.matlName"
                ></el-input>
                </el-form-item>
            </el-col>
            <el-col :md="12" :lg="12">
              <el-form-item label="物料ID" >
                <el-input :disabled="true" 
                v-model="matlInfo.matlId"
                ></el-input>
                </el-form-item>
            </el-col>
          </el-row>
          </el-form>
           <el-table :data="CollAndAudtModeInfoList" 
          header-row-class-name="tableHeaderClass"
          border>
            <el-table-column width="50" fixed="left">
            <template slot-scope="scope" >
              <el-radio :label="scope.row.MODTIME"
              @change.native="getInMatlID(scope.$index, scope.row)"
              v-model="collModeInfo">{{null}}</el-radio>
            </template>
            </el-table-column>
            <!-- <el-table-column type="selection" width="55"></el-table-column> -->
            <el-table-column prop="COLLMODE" :formatter="collModeFormat" label="收取模式"></el-table-column>
            <el-table-column prop="COLLANDAUDTMODE" :formatter="collAndAudtModeFormat" label="收取审核模式"></el-table-column>
            <!-- <el-table-column fixed prop="MODORGNO" label="维护机构"></el-table-column>
            <el-table-column prop="MODUSER" label="维护用户"></el-table-column>
            <el-table-column prop="MODDATE" label="维护日期"></el-table-column>
            <el-table-column prop="MODTIME" label="维护时间"></el-table-column> -->
          </el-table>

        <el-pagination
          style="text-align: right; margin-top:20px;"
          @current-change="handleInCurrentChange"
          :current-page.sync="currpage"
          background
          layout="sizes, total, prev, pager, next, jumper"
          :total="InTotalNum">
        </el-pagination>
      </el-card>
        


      <!-- </el-card> -->
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="DeleteCollMode" :disabled="isUse">删除</el-button>
        <el-button size="mini" type="primary" @click="isShow2 = true">添 加</el-button>
        <el-button size="mini" type="primary" @click="isShow = false">取 消</el-button>
        
      </div>

    </el-dialog>

    <!-- 交付模式标签 -->
    <el-dialog title="交付模式维护" @open="openCollback" @close="closeDialog('Out')"
    :lock-scroll=false
    :visible.sync="isShow1" width="800px">
      <el-card>
        <el-form :model="matlInfo" ref="matlInfo"  label-position="left" size="mini" label-width="80px">
          <el-row :gutter="10">
            <el-col :md="12" :lg="12">
              <el-form-item label="物料名称" >
                <el-input :disabled="true" 
                v-model="matlInfo.matlName"
                ></el-input>
                </el-form-item>
            </el-col>
            <el-col :md="12" :lg="12">
              <el-form-item label="物料ID" >
                <el-input :disabled="true" 
                v-model="matlInfo.matlId"
                ></el-input>
                </el-form-item>
            </el-col>
          </el-row>
          </el-form>
           <el-table :data="DeliverConfModeInfoList" 
          header-row-class-name="tableHeaderClass"
          @selection-change="handleSelectionChange"
          border>
            <el-table-column width="50" fixed="left">
            <template slot-scope="scope" >
              <el-radio :label="scope.row.MODTIME"
              @change.native="getOutMatlID(scope.$index, scope.row)"
              v-model="deliverModeInfo">{{null}}</el-radio>
            </template>
            </el-table-column>
            <!-- <el-table-column type="selection" width="50"></el-table-column> -->
            <el-table-column prop="DELIVERMODE" :formatter="deliverModeFormat" label="交付模式"></el-table-column>
            <el-table-column prop="DELIVERCFMODE" :formatter="deliverConfModeFormat" label="交付确认模式"></el-table-column>
            <el-table-column prop="DELIVERTYPE" :formatter="deliverTypeFormat" label="隔日交付机构"></el-table-column>
            <!-- <el-table-column fixed prop="MODORGNO" label="维护机构"></el-table-column>
            <el-table-column prop="MODUSER" label="维护用户"></el-table-column>
            <el-table-column prop="MODDATE" label="维护日期"></el-table-column>
            <el-table-column prop="MODTIME" label="维护时间"></el-table-column> -->
          </el-table>

        <el-pagination
          style="text-align: right; margin-top:20px;"
          @current-change="handleOutCurrentChange"
          :current-page.sync="currpage"
          background
          layout="sizes, total, prev, pager, next, jumper"
          :total="OutTotalNum">
        </el-pagination>
      </el-card>
        


      <!-- </el-card> -->
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="DeleteDeliverMode" :disabled="isUse">删除</el-button>
        <el-button size="mini" type="primary" @click="isShow3 = true">添 加</el-button>
        <el-button size="mini" type="primary" @click="isShow1 = false">取 消</el-button>
      </div>

    </el-dialog>


    <!-- 第二层标签页 -->
    <!-- 收审模式 -->
    <el-dialog title="添加收审模式"  @close="closeSecondDialog('addIn')"
    :lock-scroll=false
    :visible.sync="isShow2" width="800px">
      <el-card>
        <el-form :model="AddCollAndAudtModeInfo" :rules="tempRules" ref="AddCollAndAudtModeInfo" label-position="left" size="mini" label-width="80px">
            <el-row :gutter="10">
              <el-col :md="12" :lg="12">
                <el-form-item label="收取模式" prop="COLLMODE">
                  <el-select v-model="AddCollAndAudtModeInfo.COLLMODE" placeholder="请选择收取模式">
                    <el-option
                    v-for="item in options4"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="12" :lg="12">
                <el-form-item label="审核模式" prop="COLLANDAUDTMODE">
                  <el-select v-model="AddCollAndAudtModeInfo.COLLANDAUDTMODE" placeholder="请选择审核模式">
                    <el-option
                    v-for="item in options5"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
      </el-card>
      <!-- </el-card> -->
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="AddCollMode('AddCollAndAudtModeInfo')">确 定</el-button>
      </div>

    </el-dialog>
    <!-- 交付模式 -->
    <el-dialog title="添加交付模式"  @close="closeSecondDialog('addOut')"
    :lock-scroll=false
    :visible.sync="isShow3" width="800px">
      <el-card>
        <el-form :model="AddDeliverConfModeInfo" :rules="tempRules" ref="AddDeliverConfModeInfo"  label-position="left" size="mini" label-width="80px">
            <el-row :gutter="10">
              <el-col :md="12" :lg="12">
                <el-form-item label="交付模式" prop="DELIVERMODE">
                  <el-select v-model="AddDeliverConfModeInfo.DELIVERMODE" placeholder="请选择交付模式">
                    <el-option
                    v-for="item in options1"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="12" :lg="12">
                <el-form-item label="确认模式" prop="DELIVERCFMODE" ref="AddDeliverConfModeInfo">
                  <el-select v-model="AddDeliverConfModeInfo.DELIVERCFMODE" placeholder="请选择交付确认模式">
                    <el-option
                    v-for="item in options2"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :md="12" :lg="12">
                <el-form-item label="隔日交付机构" prop="DELIVERTYPE">
                  <el-select v-model="AddDeliverConfModeInfo.DELIVERTYPE" placeholder="请选择隔日交付机构">
                    <el-option
                    v-for="item in options3"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
      </el-card>
      <!-- </el-card> -->
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="AddDeliverMode('AddDeliverConfModeInfo')">确 定</el-button>
      </div>

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
    rowData: Object
  },
  data() {
    return {
      //维护机构和维护用户,登录时就已经确定
      MODORGNO:'',
      MODUSER:'',
      //分页标志：
      pageflag: 4,
      currpage: 1,
      pagerownum: 10,
      InTotalNum:0,
      OutTotalNum:0,
      //用于展示，可去除
      matlInfo:{
        matlId:'',//当前物料ID
        matlName:'',//当前物料名称
      },
      //枚举值
      collMode:getGlobalParams.get("collMode"),
      collAndAudtMode:getGlobalParams.get("collAndAudtMode"),
      deliverMode:getGlobalParams.get("deliverMode"),
      deliverConfMode:getGlobalParams.get("deliverConfMode"),
      deliverType:getGlobalParams.get("deliverType"),
      //删除模式上送表单
      //收审模式
      CollAndAudtModeInfo:[],
      // CollAndAudtModeInfo:{
      //   OPERTYPE:'',//操作类型   1-新增  2-删除
      //   MATLID:'',//物料ID
      //   COLLMODE:'',//收取模式
      //   COLLANDAUDTMODE:'',//审核模式
      //   MODORGNO:'',//维护机构
      //   MODUSER:''//维护用户
      // },
      //交付确认模式
      DeliverConfModeInfo:[],
      // DeliverConfModeInfo:{
      //   OPERTYPE:'',//操作类型   1-新增  2-删除
      //   MATLID:'',//物料ID
      //   DELIVERMODE:'',//交付模式
      //   DELIVERTYPE:'',//隔日交付模式
      //   DELIVERCFMODE:'',//确认模式
      //   MODORGNO:'',//维护机构
      //   MODUSER:''//维护用户
      // },
      //添加模式上送表单
      //收审模式
      AddCollAndAudtModeInfo:{
        OPERTYPE:'',//操作类型   1-新增  2-删除
        MATLID:'',//物料ID
        COLLMODE:'',//收取模式
        COLLANDAUDTMODE:'',//审核模式
        MODORGNO:'',//维护机构
        MODUSER:''//维护用户
      },
      //交付确认模式
      AddDeliverConfModeInfo:{
        OPERTYPE:'',//操作类型   1-新增  2-删除
        MATLID:'',//物料ID
        DELIVERMODE:'',//交付模式
        DELIVERTYPE:'',//隔日交付模式
        DELIVERCFMODE:'',//确认模式
        MODORGNO:'',//维护机构
        MODUSER:''//维护用户
      },
      //获取到的查询内容表单
      //收审模式
      CollAndAudtModeInfoList:[],
      collModeInfo:'',//存放当前模式ID
      deliverModeInfo:'',
      // CollAndAudtModeInfoList:{
      //   COLLMODE:'',//收取模式
      //   COLLANDAUDTMODE:'',//审核模式
      //   MODORGNO:'',//维护机构
      //   MODUSER:'',//维护用户
      //   MODTIME:'',//维护时间
      //   MODDATE:'',//维护日期
      // },
      //交付确认模式
      DeliverConfModeInfoList:[], 
     
      // 验证表单
      tempRules: {
        DELIVERMODE: [{ required: true, message: "请输入交付模式", trigger: "blur" }],
        // DELIVERTYPE: [{ required: true, message: "请输入隔日交付模式", trigger: "blur" }],
        DELIVERCFMODE: [{ required: true, message: "请输入确认模式", trigger: "blur" }],
        COLLMODE: [{ required: true, message: "请选择收取模式", trigger: "change" }],
        COLLANDAUDTMODE: [{ required: true, message: "请选择审核模式", trigger: "change" }],
      },
      // 支付模式：
      options1: [{
          value: '01',
          label: '人工交付'
        }, {
          value: '02',
          label: '电子化'
        }, {
          value: '03',
          label: '机具交付'
        },{
          value: '04',
          label: '隔日邮寄'
        }, {
          value: '05',
          label: '隔日存储柜'
        }, {
          value: '06',
          label: '隔日自取'
        },],
        //支付确认模式
      options2: [{
          value: '01',
          label: '自主确认'
        }, {
          value: '02',
          label: '自动确认'
        }, {
          value: '03',
          label: '人工确认'
        }],
      //隔日交付机构类型：
        options3: [{
          value: '01',
          label: '有现场机构优先序'
        }, {
          value: '02',
          label: '后期集中制作机构优先'
        },{
          value: '03',
          label: '只能现场机构后期制作'
        },{
          value: '04',
          label: '只能后期集中制作'
        },],
      //收取模式：
        options4: [{
          value: '01',
          label: '人工柜台收取'
        }, {
          value: '02',
          label: '机具收取'
        },
         {
          value: '03',
          label: '收取电子文档'
        },{
          value: '04',
          label: '动交割岗收取'
        }],
        //审核模式
        //收取模式：
        options5: [{
          value: '01',
          label: '人工柜台审核'
        }, {
          value: '02',
          label: '机具审核'
        },
         {
          value: '03',
          label: '电子审核'
        },{
          value: '04',
          label: '动交割岗审核'
        }],
      isShow2:false,
      isShow3:false,
      isUse:true,
      currpage: 1,
      devTableData: [],
      MatlType: "2" // 物料类型区分
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
    tableDataRow: function() {
      return this.rowData;
    }
  },
  created() {
    this.getOrgnoInfo();//获取当前操作的维护机构和维护用户
  },
  methods: {
    //枚举值转换：
    collModeFormat(row, column) {
      return this.collMode[row[column.property]];
    },
    collAndAudtModeFormat(row, column) {
      return this.collAndAudtMode[row[column.property]];
    },
    deliverModeFormat(row, column) {
      return this.deliverMode[row[column.property]];
    },
    deliverConfModeFormat(row, column) {
      return this.deliverConfMode[row[column.property]];
    },
    deliverTypeFormat(row, column) {
      return this.deliverType[row[column.property]];
    },
    //确定维护机构和维护用户的值：
    getOrgnoInfo(){
      this.MODORGNO = this.$store.getters.branchId;
      this.MODUSER = this.$store.getters.userId;
    } , 
    openCollback(){
      if(this.option.isShow){
        this.QueryCollModeInfo();
        console.log("输入物料审核维护的rowData：");
        console.log(this.rowData)
      };
      if(this.option.isShow1){
        this.QueryDeliverModeInfo();
        console.log("输出物料交付维护的rowData：");
        console.log(this.rowData)
      }
    },
    //选中触发删除事件：
    getInMatlID(scope, val) {
      //获取当前参数
      this.CollAndAudtModeInfo = val;
      console.log("当前行信息：");
      console.log(this.CollAndAudtModeInfo);
      if(val) {   
        this.isUse = false;
      }
    },
    getOutMatlID(scope, val) {
      //获取当前行参数
      this.DeliverConfModeInfo = val;
      console.log("当前行信息：");
      console.log(this.DeliverConfModeInfo);
      if(val) {   
        this.isUse = false;
      }
    },
    // 删除操作：
    DeleteCollMode(){
      let resBody = new InMatlCollModel();
      resBody.data.OPERTYPE = "2";
      resBody.data.MATLID = this.rowData.MATLID;
      resBody.data.COLLMODE=this.CollAndAudtModeInfo.COLLMODE;
      resBody.data.COLLANDAUDTMODE = this.CollAndAudtModeInfo.COLLANDAUDTMODE;
      resBody.data.MODORGNO = this.MODORGNO;
      resBody.data.MODUSER = this.MODUSER;
      request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.$message({
          message: '删除成功！',
          type: 'success'
          });
          this.collModeInfo = '';
          this.CollAndAudtModeInfoList = [];
          this.QueryCollModeInfo();
          // this.isShow=false;
        } else {
          console.log(response);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      })
    },
    DeleteDeliverMode(){
      let resBody = new OutMatlDeliverModel();
      resBody.data.OPERTYPE = "2";
      resBody.data.MATLID = this.rowData.MATLID;
      resBody.data.DELIVERMODE = this.DeliverConfModeInfo.DELIVERMODE;
      resBody.data.DELIVERCFMODE = this.DeliverConfModeInfo.DELIVERCFMODE;
      resBody.data.MODORGNO = this.MODORGNO;
      resBody.data.MODUSER = this.MODUSER;
      request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.$message({
          message: '删除成功！',
          type: 'success'
          });
          this.deliverModeInfo = '';
          this.DeliverConfModeInfoList = [];
          this.QueryDeliverModeInfo();
          // this.isShow1=false;
        } else {
          this.$message({
          message:response.SYS_HEAD.ReturnMessage ,
          type: 'error  '
          });
          console.log(response);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      })
    },
    //选择列表中审核模式后触发：
    handleSelectionChange(){
      this.isUse = false;
    },
    //清空对话框验证结果数据
    closeDialog(MatlType) {
      if (this.MatlType === "In") {
        this.isShow=false;
      } else{
        this.isShow1=false;
      }
    },
    //关闭第二层弹窗触发事件
    closeSecondDialog(type){
      if (type === "addIn") {
        this.isShow2 = false;
        this.AddCollAndAudtModeInfo={};
      //   this.$nextTick(() => {
      //     this.$refs["CollAndAudtModeInfo"].clearValidate();
      // });
      } else{
        this.isShow3 = false;
        this.AddDeliverConfModeInfo={};
      //   this.$nextTick(() => {
      //     this.$refs["DeliverConfModeInfo"].clearValidate();
      // });
      }
    },
    //取参数后查询收审模式相关信息；
    QueryCollModeInfo(){
      this.CollAndAudtModeInfoList = [];
      this.InTotalNum = 0;
      if(this.rowData){
          //此处用模拟数据；应用时通过ID调用接口获取参数
          this.matlInfo.matlId = this.rowData.MATLID;
          this.matlInfo.matlName = this.rowData.MATLNAME;
          //使用模拟数据
          // this.CollAndAudtModeInfoList= this.testCollInfo;
          let resBody = new InMatCollModelQuery();
          resBody.data.MATLID = this.matlInfo.matlId;
          resBody.data.pageflag = this.pageflag;
          resBody.data.currpage = this.currpage;
          resBody.data.pagerownum = this.pagerownum;
          request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          console.log("收审模式查询成功！")
          this.CollAndAudtModeInfoList=response.RSP_BODY.struct;
          this.InTotalNum = parseInt(response.RSP_BODY.TotalNum) ;
          console.log(this.CollAndAudtModeInfoList);
        } else {
          console.log(response);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      })
      }else{
        console.log("获取审核信息失败");
      }
    },
    //取参数后查询收审模式相关信息；
    QueryDeliverModeInfo(){
      this.DeliverConfModeInfoList = []
      this.OutTotalNum = 0;
      if(this.rowData){
          //此处用模拟数据；应用时通过ID调用接口获取参数
          this.matlInfo.matlId = this.rowData.MATLID;
          this.matlInfo.matlName = this.rowData.MATLNAME;
          //使用模拟数据
          // this.CollAndAudtModeInfoList= this.testCollInfo;
          let resBody = new OutMatlDeliverModelQuery();
          resBody.data.MATLID = this.matlInfo.matlId;
          resBody.data.pageflag = this.pageflag;
          resBody.data.currpage = this.currpage;
          resBody.data.pagerownum = this.pagerownum;
          request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          console.log("交付模式查询成功！")
          this.OutTotalNum = parseInt(response.RSP_BODY.TotalNum) ;
          this.DeliverConfModeInfoList=response.RSP_BODY.struct;
        } else {
          console.log(response);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      })
      }else{
        console.log("获取审核信息失败");
      }
    },
    //添加收审模式
    AddCollMode(formName){
      this.$refs[formName].validate((valid) => {
          if (valid) {
            this.AddCollAndAudtModeInfo.OPERTYPE = "1";
      this.AddCollAndAudtModeInfo.MATLID = this.rowData.MATLID;
      this.AddCollAndAudtModeInfo.MODORGNO = this.MODORGNO;
      this.AddCollAndAudtModeInfo.MODUSER = this.MODUSER;
      console.log("添加的审核模式参数为：");
      console.log(this.AddCollAndAudtModeInfo);
      let resBody = new InMatlCollModel();
      resBody.data=this.AddCollAndAudtModeInfo;
      request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.$message({
          message: '添加成功！',
          type: 'success'
          });
          this.QueryCollModeInfo();
          this.isShow2 = false;
        } else {
          this.$message({
          message:response.SYS_HEAD.ReturnMessage ,
          type: 'error  '
          });
          console.log(response);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    //添加交付模式
      AddDeliverMode(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.AddDeliverConfModeInfo.DELIVERMODE === '04' && this.AddDeliverConfModeInfo.DELIVERTYPE === ''){
              this.$message('请选择隔日交付机构！');
            }else{
              this.AddDeliverConfModeInfo.OPERTYPE = "1";
      this.AddDeliverConfModeInfo.MATLID = this.rowData.MATLID;
      this.AddDeliverConfModeInfo.MODORGNO = this.MODORGNO;
      this.AddDeliverConfModeInfo.MODUSER = this.MODUSER;
      let resBody = new OutMatlDeliverModel();
      resBody.data=this.AddDeliverConfModeInfo;
      request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.$message({
          message: '添加成功！',
          type: 'success'
          });
          this.QueryDeliverModeInfo();
          this.isShow3 = false;
        } else {
          this.$message({
          message:response.SYS_HEAD.ReturnMessage ,
          type: 'error  '
          });
          console.log(response);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      })
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      
      
    },
    handleInCurrentChange(val) {
      this.currpage = val;
      console.log(`当前页: ${val}`);
      this.QueryCollModeInfo();
    },
    handleOutCurrentChange(){
      this.currpage = val;
      console.log(`当前页: ${val}`);
      this.QueryDeliverModeInfo();
    }
  }
};
</script>

<style scope>
</style>