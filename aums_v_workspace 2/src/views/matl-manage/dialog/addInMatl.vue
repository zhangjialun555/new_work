<template>
	<div>
    <el-dialog :title="isEdit" @open="openCollback" @close="closeDialog"
    :lock-scroll=false
    :visible.sync="isShow" width="800px">
      <el-steps v-if="isEdit === '新增输入物料'" :active="active" 
            align-center  style="margin-bottom:10px"
            finish-status="success">
        <el-step title="物料信息"></el-step>
        <el-step title="收核模式"></el-step>
      </el-steps>
    <div v-if="active===0">
      <el-card style="margin-bottom:10px;">
        <el-form :model="addMatlInfo" ref="addMatlInfo" :rules="InMatlRules" size="mini" label-position="left" label-width="80px" >
          <el-row :gutter="10">
            <el-col :md="12" :lg="12">
              <!-- <el-form-item label="物料类型" size='mini' prop="MATLTYPE">
                <el-select v-model="addMatlInfo.MATLTYPE" placeholder="请选择物料类型">
                  <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item> -->

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
                <el-input v-model="addMatlInfo.MATLENNAME" :disabled="isEdited" maxlength="20"
                placeholder="请输入物料英文简称" ></el-input>
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
            <el-col :md="6" :lg="6">
              <el-form-item label="可复用" prop="ISMUX">
                <el-switch
                  v-model="ISMUX">
                </el-switch>
              </el-form-item>
            </el-col>
            <el-col :md="6" :lg="6">
              <el-form-item label="影像化" prop="ISIMAGE" >
                <el-switch @change="checkImageFlag"
                  v-model="ISIMAGE">
                </el-switch>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="12">
              <el-form-item label="影像要求" prop="IMAGEFLAG">
                <el-select v-model="addMatlInfo.IMAGEFLAG"  placeholder="请选择影像化要求">
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
        <div slot="footer" class="dialog-footer" style="text-align:center;">
          <el-button v-if="isEdit === '新增输入物料'" type="primary" size="mini" style="margin-top: 10px;"
          @click="next('addMatlInfo')">完成并设定收审模式</el-button>
					<el-button type="primary" size="mini" style="margin-top: 10px;"
          v-else @click="EditMatl('addMatlInfo')">确 定</el-button>
        </div>
    </div>
    <div v-if="active===1">
        <el-card style="margin-bottom:10px;">
        	<el-form :model="CollAndAudtModeInfo" ref="CollAndAudtModeInfo" :rules="InModelRules"  size="mini" label-position="left" label-width="80px" >
          <el-row :gutter="10">
            <el-col :md="12" :lg="12">
              <el-form-item label="收取模式" prop="COLLMODE">
                <el-select v-model="CollAndAudtModeInfo.COLLMODE" placeholder="请选择收取模式">
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
                        <el-select v-model="CollAndAudtModeInfo.COLLANDAUDTMODE" placeholder="请选择收取审核模式">
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
            <!-- <el-button type="primary" size="mini" style="margin-top: 10px;" @click="back()">上一步</el-button> -->
            <el-button type="primary" size="mini" style="margin-top: 10px;" @click="cancel">取 消</el-button>
            <el-button type="primary" size="mini" style="margin-top: 10px;"
            v-if="isEdit === '新增输入物料'" @click="AddMatl('CollAndAudtModeInfo')">确 定</el-button>
            <el-button type="primary" size="mini" style="margin-top: 10px;"
            v-else @click="submitEdit('CollAndAudtModeInfo')">确 定</el-button>
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
    // 自定义校验规则
    // var checkImageFlag = (rule, value, callback) => {
    //   if(this.addMatlInfo.ISIMAGE = true){
    //     if(this.addMatlInfo.IMAGEFLAG === ''){
    //       callback(new Error('请选择影像化要求!'));
    //     }else {
    //           callback();
    //         }
    //       }else {
    //           callback();
    //         }
    //   };
    return {
      //维护机构和维护用户,登录时就已经确定
      MODORGNO:'',
      MODUSER:'',
      // 页面号
      active:0,
      newMatlId:'',
      voutypeArray:[],//存放获取到的枚举值数组
      ccyArray:[],//存放币种枚举值
      ISIMAGE:'',//是否影像化
      ISMUX:'',//是否可复用
      // 上传字段定义：
      //输入物料组创建时上送表单
      addMatlInfo:{
        OPERTYPE:'',//操作类型  增删改 传参时定义;值域：1-新增  2-修改  3-删除
        MATLTYPE:'',//物料类型
        MATLNAME:'',//物料名称
        MATLENNAME:'',//物料英文简称
        VOUTYPE:'',//凭证类型
        PROCESSMODE:'',//处理模式
        ISIMAGE:'',//是否影像化
        IMAGEFLAG:'',//影像化要求
        CCY:'',//币种
        ISMUX:'',//是否可复用
        MODORGNO:'',//维护机构
        MODUSER:''//维护用户
      },
      // 表单验证后续可能会用到：
      InMatlRules: {
        MATLTYPE: [{ required: true, message: "请选择物料类型", trigger: "change" }
        ],
        MATLNAME: [{ required: true, message: "请输入物料名称", trigger: "blur" }],
        MATLENNAME: [{ required: true, message: "请输入英文简称", trigger: "blur" }],
        PROCESSMODE: [{ required: true, message: "请选择处理模式", trigger: "change" }],
        // ISIMAGE: [{ required: true, message: "请输入是否影像化", trigger: "blur" }],
        // IMAGEFLAG: [{ validator: checkImageFlag,trigger: "blur" }],
        // ISMUX: [{ required: true, message: "请输入是否可复用", trigger: "change" }],
      },
      InModelRules:{
        COLLMODE: [{ required: true, message: "请选择收取模式", trigger: "change" }],
        COLLANDAUDTMODE: [{ required: true, message: "请选择审核模式", trigger: "change" }],
      },
      //收审模式
      CollAndAudtModeInfo:{
        COLLMODE:'',//收取模式
        COLLANDAUDTMODE:'',//审核模式
        MODORGNO:'',//维护机构
        MODUSER:'',//维护用户
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
      //处理模式下拉框选项；
      options2: [{
          value: '01',
          label: '读取并返还'
        }, {
          value: '02',
          label: '核验并销毁'
        },
         {
          value: '03',
          label: '核验并收取'
        },{
          value: '04',
          label: '核验并返还'
        },{
          value: '05',
          label: '确认客户意愿'
        },],
        //影像化要求
        options3: [{
          value: '01',
          label: '正面'
        }, {
          value: '02',
          label: '反面'
        },
         {
          value: '03',
          label: '正面/反面'
        }],
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
        //凭证类型下拉框；
        options6:[],
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
        //币种下拉框：
        // options7: [{
        //   value: '156',
        //   label: '人民币'
        // },],
        options7:[],
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
        this.isEdited = true;
        return (this.option.isEdit = "编辑输入物料");
      } else {
        return (this.option.isEdit = "新增输入物料");
      }
    },
    // 获取当前行参数信息 
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
      if (this.option.isEdit === "编辑输入物料") {
        // this.addMatlInfo=this.rowData;
        for(var key in this.rowData){//回显数据
        this.addMatlInfo[key] = this.rowData[key];
      }
        console.log("this.addMatlInfo", this.addMatlInfo)
        //对渠道的参数进行逻辑判断，决定开关按钮的状态;
        if(this.addMatlInfo.ISIMAGE==="1"){
          this.ISIMAGE=true;
        }else{
          this.ISIMAGE=false;
        };
        if(this.addMatlInfo.ISMUX==="1"){
          this.ISMUX=true;
        }else{
          this.ISMUX=false;
        }
      } else {
        
      }
    },
    //物料查重
    matlIsexist(){
      //首先执行查重操作；后进行逻辑分支

    },
    checkImageFlag(){
      this.addMatlInfo.IMAGEFLAG = '';
    },
    //下一步
    next(formName){
      this.$refs[formName].validate((valid) => {
            if (valid) {
            if(this.ISIMAGE === true && this.addMatlInfo.IMAGEFLAG ===''){
              this.$message('请选择影像化要求！');
            }else{
              if(((this.addMatlInfo.MATLTYPE === '301')||(this.addMatlInfo.MATLTYPE === '302')
              ||(this.addMatlInfo.MATLTYPE === '303')
              ||(this.addMatlInfo.MATLTYPE === '304'))
               && this.addMatlInfo.CCY === ''){
                this.$message('请输入币种！');
              }else{
//处理数据返回后台要求格式
      let isMux = 0;
      if(this.ISMUX === true){
        isMux = 1;
      }else{
        isMux = 0;
      };
      let isimage = 0;
      if(this.ISIMAGE === true){
        isimage = 1;
      }else{
        isimage = 0;
      }
      let resBody = new InMatlManage();
        resBody.data.OPERTYPE="1";
        resBody.data.MATLTYPE=this.addMatlInfo.MATLTYPE;
        resBody.data.MATLNAME=this.addMatlInfo.MATLNAME;
        resBody.data.MATLENNAME=this.addMatlInfo.MATLENNAME;
        resBody.data.VOUTYPE=this.addMatlInfo.VOUTYPE;
        resBody.data.PROCESSMODE=this.addMatlInfo.PROCESSMODE;
        resBody.data.ISIMAGE=isimage;
        resBody.data.IMAGEFLAG=this.addMatlInfo.IMAGEFLAG;
        resBody.data.CCY=this.addMatlInfo.CCY;
        resBody.data.ISMUX=isMux;
        resBody.data.MODORGNO=this.MODORGNO;
        resBody.data.MODUSER=this.MODUSER;      
        request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.$message({
          message: '恭喜你，创建物料成功！请设定收审模式！',
          type: 'success'
          });
          this.$parent.queryInMatlInfoList();
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
    // back(){
    //     this.active--;
    // },
    cancel(){
      //取消创建物料，删除刚才创建的；
      let resBody = new InMatlManage();
      resBody.data.OPERTYPE = '3';//删除操作
      resBody.data.MATLID = this.newMatlId;
      resBody.data.MODORGNO=this.MODORGNO;
      resBody.data.MODUSER=this.MODUSER;
      request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.option.isShow = false;
          this.$message('已取消创建物料！');
          this.$parent.queryInMatlInfoList();
          this.$nextTick(() => {
          this.active=0
          this.$refs["CollAndAudtModeInfo"].clearValidate();
     })
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
    //关闭弹窗时清空表单数据
    closeDialog() {
      this.isEdited = false;
      this.ISIMAGE = '';
      this.ISMUX = '';
      this.options6 = [];//清空凭证类型下拉框
      this.options7 = [];
      if (this.option.isEdit === "编辑输入物料") {
        //读取当前行数据
        this.addMatlInfo={};
        this.CollAndAudtModeInfo={};
        this.$nextTick(() => {
        this.$refs["addMatlInfo"].clearValidate();
      });
      } else {
        if(this.active===0){
          this.addMatlInfo={};
          // this.CollAndAudtModeInfo={};
          this.$nextTick(() => {
          this.active=0
          this.$refs["addMatlInfo"].clearValidate();
      });
        }else{
          // this.addMatlInfo={};
          this.CollAndAudtModeInfo={};
          this.$nextTick(() => {
          this.active=0
          this.$refs["CollAndAudtModeInfo"].clearValidate();
        });
        }
   
      }
    },
    //提交表单信息：
    AddMatl(formName){
      this.$refs[formName].validate((valid) => {
          if (valid) {
            let resBody = new InMatlCollModel();
            resBody.data.MATLID=this.newMatlId;
            resBody.data.OPERTYPE="1";
            resBody.data.COLLMODE=this.CollAndAudtModeInfo.COLLMODE;
            resBody.data.COLLANDAUDTMODE=this.CollAndAudtModeInfo.COLLANDAUDTMODE;
            resBody.data.MODORGNO=this.MODORGNO;
            resBody.data.MODUSER=this.MODUSER;
            request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.active=0;
          this.option.isShow=false;
          this.addMatlInfo={};
          this.CollAndAudtModeInfo={};
          this.$message({
              message: '成功创建物料并绑定收审模式！',
              type: 'success'
            });
          this.$parent.queryInMatlInfoList();
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
            console.log('error AddMatl!!');
            // this.addMatlInfo={};
            // this.CollAndAudtModeInfo={};
            return false;
        }
      });
    },
   //提交修改信息
   EditMatl(formName){
     this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.ISIMAGE === true && this.addMatlInfo.IMAGEFLAG ===''){
              this.$message('请选择影像化要求！');
            }else{
              if(((this.addMatlInfo.MATLTYPE === '301')||(this.addMatlInfo.MATLTYPE === '302')
              ||(this.addMatlInfo.MATLTYPE === '303')
              ||(this.addMatlInfo.MATLTYPE === '304'))
               && this.addMatlInfo.CCY === ''){
                this.$message('请输入币种！');
              }else{
                //处理数据返回后台要求格式
      let isMux = 0;
      if(this.ISMUX === true){
        isMux = 1;
      }else{
        isMux = 0;
      };
      let isimage = 0;
      if(this.ISIMAGE === true){
        isimage = 1;
      }else{
        isimage = 0;
      }
        let resBody = new InMatlManage();
        resBody.data.OPERTYPE="2";
        resBody.data.MATLID=this.addMatlInfo.MATLID;
        resBody.data.MATLTYPE=this.addMatlInfo.MATLTYPE;
        resBody.data.MATLNAME=this.addMatlInfo.MATLNAME;
        resBody.data.MATLENNAME=this.addMatlInfo.MATLENNAME;
        resBody.data.VOUTYPE=this.addMatlInfo.VOUTYPE;
        resBody.data.PROCESSMODE=this.addMatlInfo.PROCESSMODE;
        resBody.data.ISIMAGE=isimage;
        resBody.data.IMAGEFLAG=this.addMatlInfo.IMAGEFLAG;
        resBody.data.CCY=this.addMatlInfo.CCY;
        resBody.data.ISMUX=isMux;
        resBody.data.MODORGNO=this.MODORGNO;
        resBody.data.MODUSER=this.MODUSER;      
        request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.$message({
          message: '修改物料信息成功！',
          type: 'success'
          });
          this.$parent.queryInMatlInfoList();
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
            console.log('error AddMatl!!');
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
