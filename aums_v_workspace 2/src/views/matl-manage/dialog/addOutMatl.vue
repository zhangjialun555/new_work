<template>
	<div>
    <el-dialog :title="isEdit" @open="openCollback" @close="closeDialog"
    :lock-scroll=false
    :visible.sync="isShow" width="800px">
      <el-steps v-if="isEdit === '新增输出物料'" :active="active" 
            align-center  style="margin-bottom:10px"
            finish-status="success">
        <el-step title="物料信息"></el-step>
        <el-step title="交付模式"></el-step>
      </el-steps>
    <div v-if="active===0">
      <el-card style="margin-bottom:10px;">
        <el-form :model="addMatlInfo" ref="addMatlInfo"  :rules="tempRules" size="mini" label-position="left" label-width="80px" >
          <el-row :gutter="10">
            <el-col :md="12" :lg="12">
              <el-form-item label="物料类型" size='mini' prop="MATLTYPE">
                <el-select v-model="addMatlInfo.MATLTYPE" placeholder="请选择物料类型">
                  <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="12">
              <el-form-item label="物料名称" prop="MATLNAME">
                <el-input v-model="addMatlInfo.MATLNAME"
                @blur="matlIsexist" maxlength="50"
                placeholder="请输入物料名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :md="12" :lg="12">
              <el-form-item label="英文简称" prop="MATLENNAME">
                <el-input v-model="addMatlInfo.MATLENNAME" :disabled="isEdited"
                @blur="matlIsexist"  maxlength="20"
                placeholder="请输入物料英文简称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="12">
              <el-form-item label="凭证类型" size='mini' prop="VOUTYPE">
                <el-select v-model="addMatlInfo.VOUTYPE" placeholder="请选择凭证类型">
                  <el-option
                  v-for="item in options6"
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
              <el-form-item label="币种" prop="CCY">
                <el-select v-model="addMatlInfo.CCY" placeholder="请选择币种">
                  <el-option
                  v-for="item in options7"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="12">
              <el-form-item label="处理模式" size='mini' prop="PROCESSMODE">
                <el-select v-model="addMatlInfo.PROCESSMODE" placeholder="请选择处理模式">
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
          <el-row :gutter="10">
            <el-col :md="12" :lg="12">
              <el-form-item label="是否控号" prop="ISCONTROLNO" >
                <el-switch @change="checkIsControl"
                @blur="matlIsexist"
                  v-model="ISCONTROLNO">
                </el-switch>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="12">
              <el-form-item label="控号要求" prop="CONTROLMODE">
                <el-select v-model="addMatlInfo.CONTROLMODE" placeholder="请选择控号要求">
                  <el-option
                  v-for="item in options4"
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
        <div slot="footer" class="dialog-footer" style="text-align:center;">
          <el-button v-if="isEdit === '新增输出物料'" type="primary" size="mini" style="margin-top: 10px;"
          @click="next('addMatlInfo')">完成并绑定交付模式</el-button>
					<el-button type="primary" size="mini" style="margin-top: 10px;"
          v-else @click="EditMatl('addMatlInfo')">确 定</el-button>
        </div>
    </div>
    <div v-if="active===1">
        <el-card style="margin-bottom:10px;">
        	<el-form :model="DeliverConfModeInfo" ref="DeliverConfModeInfo" :rules="tempRules" size="mini" label-position="left" label-width="80px" >
          <!-- //添加判断区分输入输出 -->
          <el-row :gutter="10">
            <el-col :md="12" :lg="12">
              <el-form-item label="交付模式" prop="DELIVERMODE">
                <el-select v-model="DeliverConfModeInfo.DELIVERMODE" placeholder="请选择交付模式">
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
                    <el-form-item label="确认模式" prop="DELIVERCONFMODE">
                        <el-select v-model="DeliverConfModeInfo.DELIVERCONFMODE" placeholder="请选择交付确认模式">
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
              <el-row>
                <el-col :md="12" :lg="12">
              <el-form-item label="隔日交付模式" prop="DELIVERTYPE">
                <el-select v-model="DeliverConfModeInfo.DELIVERTYPE" placeholder="请选择隔日交付模式">
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
        <div slot="footer" class="dialog-footer" style="text-align:center;">
            <el-button type="primary" size="mini" style="margin-top: 10px;" @click="cancel">取 消</el-button>
            <el-button type="primary" size="mini" style="margin-top: 10px;"
            v-if="isEdit === '新增输出物料'" @click="addMatl('DeliverConfModeInfo')">确 定</el-button>
            <el-button type="primary" size="mini" style="margin-top: 10px;"
            v-else @click="submitEdit('DeliverConfModeInfo')">确 定</el-button>
        </div>
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
import voutypeSelect from "@/message/dataSelect/voutypeSelect";
import ccySelect from "@/message/dataSelect/ccySelect";
import getGuid from "@/utils/getGuid";
import Sortable from "sortablejs";
export default {
  props: {
    option: Object,
    rowData: Object
  },
  data() {
    //对参数名称进行逻辑判断（要求英文或数字）
    return {
      //维护机构和维护用户,登录时就已经确定
      MODORGNO:'',
      MODUSER:'',
      // 页面号
      active:0,
      newMatlId:'',
      ISCONTROLNO:'',//是否控号
      // 上传字段定义：
      //输入物料组创建时上送表单
      addMatlInfo:{
        OPERTYPE:'',//操作类型  增删改 传参时定义;1-新增  2-修改  3-删除
        MATLTYPE:'',//物料类型
        MATLNAME:'',//物料名称
        MATLENNAME:'',//物料英文简称
        VOUTYPE:'',//凭证类型
        PROCESSMODE:'',//处理模式
        ISCONTROLNO:'',//是否控号
        CONTROLMODE:'',//控号方式
        CCY:'',//币种
        MODORGNO:'',//维护机构
        MODUSER:''//维护用户
      },
      // 表单验证
      tempRules: {
        MATLTYPE: [{ required: true, message: "请选择物料类型", trigger: "change" }
        ],
        MATLNAME: [{ required: true, message: "请输入物料名称", trigger: "blur" }],
        MATLENNAME: [{ required: true, message: "请输入英文简称", trigger: "blur" }],
        PROCESSMODE: [{ required: true, message: "请选择处理模式", trigger: "change" }],
        DELIVERMODE: [{ required: true, message: "请选择交付模式", trigger: "change" }],
        DELIVERCONFMODE: [{ required: true, message: "请选择确认模式", trigger: "change" }],
        // DELIVERTYPE: [{ required: true, message: "请选择隔日交付模式", trigger: "change" }],
      },
      //交付确认模式
      DeliverConfModeInfo:{
        DELIVERMODE:'',//交付模式
        DELIVERCONFMODE:'',//确认模式
        DELIVERTYPE:'',//隔日交付模式
        MODORGNO:'',//维护机构
        MODUSER:''//维护用户
      },
      // 物料组性质下拉框选项；
      options: [{
          value: '001',
          label: '重空-借记卡'
        }, {
          value: '002',
          label: '重空-贷记卡'
        }, {
          value: '003',
          label: '重空-折'
        },
        {
          value: '004',
          label: '重空-存单'
        },
        {
          value: '005',
          label: '重空-支票'
        },
        {
          value: '006',
          label: '重空-本票'
        },
        {
          value: '007',
          label: '重空-汇票'
        }, 
        {
          value: '008',
          label: '重空-其他'
        },  {
          value: '101',
          label: '合法性材料-证件-身份证'
        }, {
          value: '102',
          label: '合法性材料-证件-非身份证'
        },
         {
          value: '103',
          label: '合法性材料-其他 '
        }, {
          value: '201',
          label: '非重空凭证'
        }, {
          value: '301',
          label: '现金-本币'
        },
        {
          value: '302',
          label: '现金-外币 '
        },
         {
          value: '303',
          label: '残币 '
        }, {
          value: '304',
          label: '假币'
        }, {
          value: '401',
          label: '监管要求'
        },
        ],
        isEdited:false,
        value: '',
      //支付模式：
      options1: [{
          value: '01',
          label: '网点人工交付'
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
        //处理模式
        options3: [{
          value: '01',
          label: '写入交付'
        }, {
          value: '02',
          label: '打印交付'
        }, {
          value: '03',
          label: '打印盖章交付'
        },
        {
          value: '04',
          label: '清点交付'
        }],
        //控号方式：
        options4: [{
          value: '01',
          label: '有序'
        }, {
          value: '02',
          label: '无序客户自选'
        },{
          value: '03',
          label: '无序系统自选'
        },],
        //隔日交付机构类型：
        options5: [{
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
        //凭证类型下拉框；
        options6:[],
        options7:[],
        // options6: [{
        //   value: '008',
        //   label: '储蓄存单'
        // }, {
        //   value: '001',
        //   label: '普卡'
        // },
        //  {
        //   value: '002',
        //   label: '金卡'
        // },{
        //   value: '003',
        //   label: '白金卡'
        // }],
        // //币种下拉框：
        // options7: [{
        //   value: '156',
        //   label: '人民币'
        // },],
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
    isEdit: function() {
      if (this.option.isEdit) {
        this.isEdited =true;
        return (this.option.isEdit = "编辑输出物料");
      } else {
        return (this.option.isEdit = "新增输出物料");
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
    //确定维护机构和维护用户的值：
    getOrgnoInfo(){
      this.MODORGNO = this.$store.getters.branchId;
      this.MODUSER = this.$store.getters.userId;
    } , 
    //查询凭证类型枚举值；
    queryVoutype(){
      let resBody = new voutypeSelect();
          resBody.data.MATLTYPE = "";
          resBody.data.VOUTYPE = "";
          resBody.data.VOUTYPENAME = "";
          request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          //将后台的枚举值存入
          this.voutypeArray = response.RSP_BODY.struct;
          console.log("voutypeArray");
          console.log(this.voutypeArray);
          this.voutypeSelection();
        } else {
          this.$message({
          message:response.SYS_HEAD.ReturnMessage ,
          type: 'error  '
          });
          this.loading = false;
          console.log(response.RSP_BODY);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      })
    },
    //获取下拉框
    voutypeSelection(){
      for(let i = 0;i<this.voutypeArray.length;i++){
        let val = {value:this.voutypeArray[i].VOUTYPE,label:this.voutypeArray[i].VOUTYPENAME};
        this.options6.push(val);
      }
      console.log("当前凭证类型下拉框属性；");
      console.log(this.options6);
    },
    ccySelection(){
      for(let i = 0;i<this.ccyArray.length;i++){
        let val = {value:this.ccyArray[i].DICTCODE,label:this.ccyArray[i].DICTNAME};
        this.options7.push(val);
      }
      console.log("当前币种下拉框属性；");
      console.log(this.options7);
    },
    //查询币种；
    queryCcy(val){
      let resBody = new ccySelect();
          resBody.data.DICTTYPE = "ccy";
          resBody.data.DICTCODE = "";
          resBody.data.DICTNAME = "";
          request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          //将后台的枚举值存入
          this.ccyArray = response.RSP_BODY.struct;
          console.log("ccyArray");
          console.log(this.ccyArray);
          this.ccySelection();
        } else {
          this.$message({
          message:response.SYS_HEAD.ReturnMessage ,
          type: 'error  '
          });
          this.loading = false;
          console.log(response.RSP_BODY);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      })
    },
    // 打开dialog回调
     openCollback() {
       this.queryVoutype();
      this.queryCcy();
      if (this.option.isEdit === "编辑输出物料") {
        // this.addMatlInfo=this.rowData;
        for(var key in this.rowData){//回显数据
        this.addMatlInfo[key] = this.rowData[key];
      }
        if(this.addMatlInfo.ISCONTROLNO==="1"){
          this.ISCONTROLNO=true;
        }else{
          this.ISCONTROLNO = false;
        }
      } else {
        
      }
    },
    //物料查重
    matlIsexist(){
      //预留查重功能
    },
    next(formName){
      //表单验证:
      this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.ISCONTROLNO === true && this.addMatlInfo.CONTROLMODE === ''){
              this.$message('请选择控号要求！');
            }else{
              if(((this.addMatlInfo.MATLTYPE === '301')||(this.addMatlInfo.MATLTYPE === '302')
              ||(this.addMatlInfo.MATLTYPE === '303')
              ||(this.addMatlInfo.MATLTYPE === '304'))
               && this.addMatlInfo.CCY === ''){
                this.$message('请输入币种！');
              }else{
      let iscontrolno = 0;
      if(this.ISCONTROLNO === true){
        iscontrolno = 1;
      }else{
        iscontrolno = 0;
      }
       let resBody = new OutMatlManage();
        resBody.data.OPERTYPE="1";
        resBody.data.MATLTYPE=this.addMatlInfo.MATLTYPE;
        resBody.data.MATLNAME=this.addMatlInfo.MATLNAME;
        resBody.data.MATLENNAME=this.addMatlInfo.MATLENNAME;
        resBody.data.VOUTYPE=this.addMatlInfo.VOUTYPE;
        resBody.data.PROCESSMODE=this.addMatlInfo.PROCESSMODE;
        resBody.data.ISCONTROLNO=iscontrolno;
        resBody.data.CONTROLMODE=this.addMatlInfo.CONTROLMODE;
        resBody.data.CCY=this.addMatlInfo.CCY;
        resBody.data.MODORGNO=this.MODORGNO;
        resBody.data.MODUSER=this.MODUSER;      
        request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.$message({
          message: '恭喜你，创建物料成功！请设定交付模式！',
          type: 'success'
          });
          console.log("添加物料信息为：",resBody.data.CCY);
          this.$parent.queryOutMatlInfoList();
          //获取到返回字段中的新物料ID
          this.newMatlId = response.RSP_BODY.MATLID;
          this.active++;
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
      
            }
          } else {
            this.$message('请输入合法数据');
            return false;
          }
        });

      
    },
    back(){
        this.active--;
    },
    cancel(){
      //取消创建物料，删除刚才创建的；
      let resBody = new OutMatlManage();
      resBody.data.OPERTYPE = 3;//删除操作
      resBody.data.MATLID = this.newMatlId;
      resBody.data.MODORGNO=this.MODORGNO;
      resBody.data.MODUSER=this.MODUSER;
      request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.option.isShow = false;
          this.$message('已取消创建物料！');
          this.$parent.queryOutMatlInfoList();
          this.$nextTick(() => {
          this.active=0
          this.$refs["CollAndAudtModeInfo"].clearValidate();
     })
        } else {
          this.$message({
          message:response.SYS_HEAD.ReturnMessage ,
          type: 'error  '
          });
          console.log("取消失败")
          console.log(response);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      }) 
    },
    //关闭弹窗时清空表单数据
    closeDialog() {
      this.isEdited = false;
      this.ISCONTROLNO = '';
      this.options6 = [];//清空凭证类型下拉框
      this.options7 = [];
      if (this.option.isEdit === "编辑输出物料") {
        //读取当前行数据
        this.addMatlInfo={};
        this.DeliverConfModeInfo={};
        this.$nextTick(() => {
        this.$refs["addMatlInfo"].clearValidate();
      });
      } else {
        if(this.active===0){
          this.addMatlInfo={};
          // this.DeliverConfModeInfo={};
          this.$nextTick(() => {
          this.active=0
          this.$refs["addMatlInfo"].clearValidate();
        });
        }else{
          // this.addMatlInfo={};
          this.DeliverConfModeInfo={};
          this.$nextTick(() => {
          this.active=0
          this.$refs["DeliverConfModeInfo"].clearValidate();
      });
        }
        
      }
    },
  checkIsControl(){
    this.addMatlInfo.CONTROLMODE = '';
  },
    //提交表单信息：
    addMatl(formName){
      this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.DeliverConfModeInfo.DELIVERMODE === '04' && this.DeliverConfModeInfo.DELIVERTYPE === ''){
              this.$message("请选择隔日交付机构！")
            }else{
              let resBody = new OutMatlDeliverModel();
            resBody.data.MATLID=this.newMatlId;
            resBody.data.OPERTYPE="1";
            resBody.data.DELIVERMODE=this.DeliverConfModeInfo.DELIVERMODE;
            resBody.data.DELIVERCFMODE=this.DeliverConfModeInfo.DELIVERCONFMODE;
            resBody.data.DELIVERTYPE=this.DeliverConfModeInfo.DELIVERTYPE;
            resBody.data.MODORGNO=this.MODORGNO;
            resBody.data.MODUSER=this.MODUSER;
            request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.active=0;
          this.option.isShow=false;
          this.addMatlInfo={};
          this.DeliverConfModeInfo={};
          this.$message({
              message: '成功创建物料并绑定交付模式！',
              type: 'success'
            });
            console.log(this.DeliverConfModeInfo.DELIVERTYPE);
            this.$parent.queryOutMatlInfoList();
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
            console.log('error AddMatl!!');
            this.addMatlInfo={};
            this.DeliverConfModeInfo={};
            return false;
        }
      });
    },
   //提交修改信息
   EditMatl(formName){
     this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.ISCONTROLNO === true && this.addMatlInfo.CONTROLMODE === ''){
              this.$message('请选择控号要求！');
            }else{
              if(((this.addMatlInfo.MATLTYPE === '301')||(this.addMatlInfo.MATLTYPE === '302')
              ||(this.addMatlInfo.MATLTYPE === '303')
              ||(this.addMatlInfo.MATLTYPE === '304'))
               && this.addMatlInfo.CCY === ''){
                this.$message('请输入币种！');
              }else{
                let iscontrolno = 0;
        if(this.ISCONTROLNO===true){
          iscontrolno=1;
        }else{
          iscontrolno=0;
        }
        let resBody = new OutMatlManage();
        resBody.data.OPERTYPE="2";
        resBody.data.MATLID=this.addMatlInfo.MATLID;
        resBody.data.MATLTYPE=this.addMatlInfo.MATLTYPE;
        resBody.data.MATLNAME=this.addMatlInfo.MATLNAME;
        resBody.data.MATLENNAME=this.addMatlInfo.MATLENNAME;
        resBody.data.VOUTYPE=this.addMatlInfo.VOUTYPE;
        resBody.data.PROCESSMODE=this.addMatlInfo.PROCESSMODE;
        resBody.data.ISCONTROLNO=iscontrolno;
        resBody.data.CONTROLMODE=this.addMatlInfo.CONTROLMODE;
        resBody.data.CCY=this.addMatlInfo.CCY;
        resBody.data.MODORGNO=this.MODORGNO;
        resBody.data.MODUSER=this.MODUSER;      
        request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.$message({
          message: '修改物料信息成功！',
          type: 'success'
          });
          this.$parent.queryOutMatlInfoList();
          this.active=0;
          this.option.isShow=false;
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
              }}
        
          } else {
            console.log('error addMatl!!');
            return false;
          }
        });
   },
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
