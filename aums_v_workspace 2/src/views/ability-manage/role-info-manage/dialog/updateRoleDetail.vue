<template>
    <div>
        <el-dialog :visible.sync="isShow" title="交割物料明细"  width="800px"  :close-on-click-modal="false"
         @open="openRole" 
         @close="closeRole"
          v-loading="loading"
    element-loading-text="加载中。。。">
      <div>
        <el-card style="overflow:visible">   
         <el-form ref="deliverAbilityInfo" :model="deliverAbilityInfo"  
            size="mini"  label-width="80px" label-position="left">
            <el-row class="rowStyle">
              <el-col :span="12">
                <el-form-item label="交割能力" prop="roleName">
                  <el-input v-model="deliverAbilityInfo.ABILITYNAME" disabled></el-input>
                  </el-form-item>
                </el-col>
            </el-row>
        </el-form> 
        <!-- 标签区分输入输出物料 -->
        <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
          <el-tab-pane label="输入物料" name="InMatl">
            <el-table
        :data="deliverInfo"
        class="tableMarginTop"
        header-row-class-name="tableHeaderClass"
        border>
        <el-table-column width="60">
          <template slot-scope="scope">
            <el-radio :label="scope.row.DELIVERYMATLID"
            @change.native="getInMatlID(scope.$index, scope.row)"
            v-model="deliverInfo.DELIVERYMATLID">{{null}}</el-radio>
          </template>
        </el-table-column>  
        <el-table-column
            prop="MATLPROS" label="物料类型" :formatter="matlRosFormat" >
        </el-table-column>
        <el-table-column
            prop="DELIVERYMATLNAME" label="物料名称" >
        </el-table-column>
        <el-table-column
            prop="DELIVERYMATLENNAME" label="物料简称" >
        </el-table-column>
        <el-table-column
            prop="ISGATHER" label="是否可收" :formatter="ISGATHERFormat" >
        </el-table-column>
        <el-table-column
            prop="ISAUDIT" label="是否可审" :formatter="ISAUDITFormat" >
        </el-table-column>
        <!-- <el-table-column
            prop="ISCONTROL" label="是否可付" :formatter="ISCONTROLFormat" width="90" >
        </el-table-column> -->
      </el-table> 
      <el-pagination
        style="text-align: right; margin-top:20px;"
        @current-change="handleInCurrentChange"
        :current-page="currpage"
        background
        layout="sizes, total, prev, pager, next, jumper"
        :total="TotalNum">
      </el-pagination>
          </el-tab-pane>
          <el-tab-pane label="输出物料" name="OutMatl">
            <el-table
        :data="deliverInfo"
        class="tableMarginTop"
        header-row-class-name="tableHeaderClass"
        border>
        <el-table-column width="60">
          <template slot-scope="scope">
            <el-radio :label="scope.row.DELIVERYMATLID"
            @change.native="getInMatlID(scope.$index, scope.row)"
            v-model="deliverInfo.DELIVERYMATLID">{{null}}</el-radio>
          </template>
        </el-table-column>  
        <el-table-column
            prop="MATLPROS" label="物料类型" :formatter="matlRosFormat" >
        </el-table-column>
        <el-table-column
            prop="DELIVERYMATLNAME" label="物料名称" >
        </el-table-column>
        <el-table-column
            prop="DELIVERYMATLENNAME" label="物料简称">
        </el-table-column>
        <!-- <el-table-column
            prop="ISGATHER" label="是否可收" :formatter="ISGATHERFormat" width="90">
        </el-table-column>
        <el-table-column
            prop="ISAUDIT" label="是否可审" :formatter="ISAUDITFormat" width="90">
        </el-table-column> -->
        <el-table-column
            prop="ISCONTROL" label="是否可付" :formatter="ISCONTROLFormat">
        </el-table-column>
      </el-table> 
      <el-pagination
        style="text-align: right; margin-top:20px;"
        @current-change="handleInCurrentChange"
        :current-page="currpage"
        background
        layout="sizes, total, prev, pager, next, jumper"
        :total="TotalNum">
      </el-pagination>
          </el-tab-pane>
        </el-tabs>
      
        </el-card>
          <el-row style="margin:20px 0;text-align:center">
            <el-button style="margin-left:10px" type="primary" icon='el-icon-plus' size="mini" @click="isShowAdd =true">新增</el-button>
      <el-button style="margin-left:10px" type="danger" icon='el-icon-delete' size="mini" :disabled="isDisabledDel" @click="deliverDeliverMatl()">删除</el-button>
      <el-button style="margin-left:10px" type="primary" icon='el-icon-edit' size="mini" :disabled="isDisabledDel" @click="isShowEdit=true">修改</el-button> 
            <!-- <el-button  size="mini" @click="isShow=false">取消</el-button> -->
            <!-- <el-button type="primary" size="mini" @click="updateRole">确认</el-button> -->
          </el-row>   
            </div>
        </el-dialog>
    <!-- 添加物料弹窗 -->
      <el-dialog :visible.sync="isShowAdd" title="新增可交割物料"
      @open="openRoleAdd" 
      @close="closeRoleAdd"
       width="600px"
      v-loading="loading"
    element-loading-text="加载中。。。">
      <el-steps finish-status="success" :active='active' align-center>
        <el-step title='选择可交割物料'></el-step>   
        <el-step title='明细维护'></el-step> 
      </el-steps>
      <div   v-if="active==0">
        <el-card >
          <!-- <span>提示:请选择物料类型和物料性质!</span><br><br> -->
          <el-form ref="roleManageDetail" :model="roleManageDetail" 
            size="mini" label-width="80px" label-position="center">
              <el-row class="rowStyle" >
                <el-col :span="12">
                  <el-form-item label="物料性质" prop="MATLPROS">
                  <el-select 
                  v-model="roleManageDetail.MATLPROS" 
                  disabled
                  placeholder="请选择物料性质">
                  <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                  </el-option>
                </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="物料类型" prop="DELIVERYMATLTYPE">
                    <el-select 
                    v-model="roleManageDetail.DELIVERYMATLTYPE"
                    @change="queryMatl()"
                    placeholder="请选择可交割物料类型">
                  <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                  </el-option>
                </el-select>
                     </el-form-item>
                  </el-col>
              </el-row>
              <!-- <el-row class="rowStyle" >
                <el-col :span="16">
                  <el-form-item label="可交割物料ID" prop="DELIVERYMATLID">
                  <el-input v-model="roleManageDetail.DELIVERYMATLID" placeholder="请输入可交割物料ID"></el-input>
                  </el-form-item>
                </el-col>
              </el-row> -->
              <el-table :data="MatlCheckArray" 
                  header-row-class-name="tableHeaderClass"
                    border>
                      <el-table-column width="50">
                        <template slot-scope="scope">
                          <el-radio :label="scope.row.MATLID"
                          @change.native="getParamID(scope, scope.row)"
                          v-model="MatlCheckArray.MATLID">{{null}}</el-radio>
                        </template>
                      </el-table-column>
                      <el-table-column prop="MATLNAME" label="物料名称"  width="150"></el-table-column>
                      <el-table-column prop="MATLTYPE" label="物料类型" :formatter="matlTypeFormat" width="150"></el-table-column>
                      <!-- <el-table-column  label="性质维护" width="318">
                        <template slot-scope="scope">
                          <el-checkbox-group 
                          v-model="form.type"
                          @change="checkboxData()">
                            <el-checkbox label="可收" name="type"></el-checkbox>
                            <el-checkbox label="可审" name="type"></el-checkbox>
                            <el-checkbox label="可付" name="type"></el-checkbox>
                          </el-checkbox-group>
                        </template>
                      </el-table-column> -->
                      <el-table-column 
                      align="center"
                        width="160" label="详细信息" fixed="right">
                          <template slot-scope="scope">
                            <el-button type="text" size="mini"
                            @click="handleQueryParameter(scope.$index, scope.row)">查看</el-button>
                          </template>
                        </el-table-column>
                  </el-table>
          </el-form>
          </el-card>
          <el-row style="margin:20px 0;">
                <el-col :span="2" :offset="10">
                <el-button type="primary" size="mini" :disabled="nextAble" @click="next()">下一步</el-button>                          
                </el-col>
          </el-row>
      </div>
      <!-- 第二步 -->
      <div   v-if="active==1">
        <el-card >
          <el-form ref="roleManageDetail" :model="roleManageDetail" 
            size="mini" label-width="120px" label-position="left">
              <el-row class="rowStyle" :gutter="100" v-if="roleManageDetail.MATLPROS === '01'">            
               <el-col :span="12" >
                  <el-form-item prop="ISGATHER" label=" 是否可收" >
                      <el-switch v-model="roleManageDetail.ISGATHER"></el-switch>
                  </el-form-item>
              </el-col> 
              <el-col :span="12" >
                  <el-form-item prop="ISAUDIT" label=" 是否可审">
                      <el-switch v-model="roleManageDetail.ISAUDIT"></el-switch>
                  </el-form-item>
              </el-col>       
              </el-row>
              <el-row v-else>
                <el-col :span="12" >
                  <el-form-item prop="ISCONTROL" label=" 是否可付">
                      <el-switch v-model="roleManageDetail.ISCONTROL"></el-switch>
                  </el-form-item>
              </el-col>    
              </el-row>
          </el-form>
          </el-card>
          <el-row style="margin:20px 0;">
                <el-col :span="2" :offset="10">
                <el-button type="primary" size="mini" @click="addAgain()">继续添加</el-button>                         
                </el-col>
                <el-col :span="2" :offset="2">
                <el-button type="primary" size="mini" @click="roleDetail()">确定</el-button>                          
                </el-col>
          </el-row>
      </div>
    </el-dialog>
    <!-- 编辑弹窗 -->
    <el-dialog :visible.sync="isShowEdit" title="编辑 可交割物料"
       width="600px"
      v-loading="loading"
      @open="openEdit" 
    element-loading-text="加载中。。。">
      <el-steps finish-status="success" :active='active' align-center>
        <el-step title='明细维护'></el-step> 
      </el-steps>
        <el-card >
          <el-form ref="roleManageDetailEdit" :model="roleManageDetailEdit" 
            size="mini" label-width="120px" label-position="left">
              <el-row class="rowStyle" :gutter="100" v-if="editType === 'In'">            
               <el-col :span="12" >
                  <el-form-item prop="ISGATHER" label=" 是否可收">
                      <el-switch v-model="roleManageDetailEdit.ISGATHER"></el-switch>
                  </el-form-item>
              </el-col> 
              <el-col :span="12" >
                  <el-form-item prop="ISAUDIT" label=" 是否可审">
                      <el-switch v-model="roleManageDetailEdit.ISAUDIT"></el-switch>
                  </el-form-item>
              </el-col>       
              </el-row>
              <el-row v-else>
                <el-col :span="12" >
                  <el-form-item prop="ISCONTROL" label=" 是否可付">
                      <el-switch v-model="roleManageDetailEdit.ISCONTROL"></el-switch>
                  </el-form-item>
              </el-col>    
              </el-row>
          </el-form>
          </el-card>
          <el-row style="margin:20px 0;">
                <el-col :span="2" :offset="10">
                <el-button type="primary" size="mini" @click="edit()">确定</el-button>                          
                </el-col>
          </el-row>
    </el-dialog>
    <component :is='dialogList.queryMatlDetail' :option='dialogqueryMatlDetail' :paramObj="rowVal" ></component>          

    </div>
</template>

<script>
import selectTree from "@/components/selectTree2/";
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
import InMatlQuery from "@/message/matlManage/InMatlQuery";
import OutMatlQuery from "@/message/matlManage/OutMatlQuery";
import deliverAbilityQuery from "@/message/deliverAbility/deliverAbilityQuery";
import deliverAbilityManage from "@/message/deliverAbility/deliverAbilityManage";
import deliverAbilityDetailQuery from "@/message/deliverAbility/deliverAbilityDetailQuery";
import deliverAbilityDetailManage from "@/message/deliverAbility/deliverAbilityDetailManage";
import queryMatlDetail from "@/views/ability-manage/role-info-manage/dialog/queryMatlDetail";
export default {
    components: { selectTree },
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
      TotalNum:0,
      active:0,
      activeName:'InMatl',
      MATLPROS:'',
      rowVal:null,
      isShowAdd:false,
      isShowEdit:false,
      nextAble:true,
      editType:'',//存放编辑类型
      dialogList: 
      { 
      queryMatlDetail
      },
      dialogqueryMatlDetail:{isShow:false},
      DeliverMatl:[],//存放当前选择可交割物料
      isDisabledDel:true,
      deliverAbilityInfo:{},
      ISGATHER:getGlobalParams.get("ISGATHER"),
      ISAUDIT:getGlobalParams.get("ISAUDIT"),
      ISCONTROL:getGlobalParams.get("ISCONTROL"),
      matlType:getGlobalParams.get("matlType"),
      MATLROS:getGlobalParams.get("MATLROS"),
      //明细清单
      roleManageDetail:{
        MATLPROS:'01',//物料性质
        DELIVERYMATLTYPE:'',//可交割物料类型
        DELIVERYMATLID:'',//可交割物料ID
        VOUTYPE:'',//凭证类型
        CCY:'',//币种
        ISGATHER:'',//是否可收
        ISAUDIT:'',//是否可审
        ISCONTROL:''//是否可付
      },
      //编辑：
      roleManageDetailEdit:{
        ISGATHER:'',//是否可收
        ISAUDIT:'',//是否可审
        ISCONTROL:''//是否可付
      },
      MatlCheckArray:[],//存放查到的物料信息
      options:[
        {
          value:'01',
          label:'输入物料'
        },
        {
          value:'02',
          label:'输出物料'
        }
      ],// 物料组性质下拉框选项；
      options1: [{
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
      deliverInfo:[],
      loading:false,
      roleListUpdate: {},
      roleList: ["1001"],
      roleState: [
        { label: "失效", value: "0" },
        { label: "正常", value: "1" },
        { label: "锁定", value: "2" }
      ],
      brnoList: [],
    };
  },
  computed: {
    isShow: {
      get() {
        return this.option.isShow;
      },
      set(val) {
        this.option.isShow = val;
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
    ISGATHERFormat(row, column) {
      return this.ISGATHER[row[column.property]];
    },
    ISAUDITFormat(row, column) {
      return this.ISAUDIT[row[column.property]];
    },
    ISCONTROLFormat(row, column) {
      return this.ISCONTROL[row[column.property]];
    },
    matlTypeFormat(row, column) {
      return this.matlType[row[column.property]];
    },
    
    matlRosFormat(row, column) {
      return this.MATLROS[row[column.property]];
    },
    //确定维护机构和维护用户的值：
    getOrgnoInfo(){
      this.MODORGNO = this.$store.getters.branchId;
      this.MODUSER = this.$store.getters.userId;
    } , 
    //查询当前能力的可交割物料信息；
    queryDeliverMatl(){
      this.deliverInfo = [];
      this.TotalNum = 0;
      let resBody = new deliverAbilityDetailQuery();
      resBody.data.MATLPROS = this.MATLPROS;
      resBody.data.ABILITYID = this.rowData.ABILITYID;
      resBody.data.pageflag = this.pageflag;
      resBody.data.currpage = this.currpage;
      resBody.data.pagerownum = this.pagerownum;
      request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.deliverInfo = response.RSP_BODY.struct;
          this.TotalNum = parseInt(response.RSP_BODY.TotalNum) ;
          this.isDisabledDel = true;
          console.log("查询输入的内容为：");
          console.log(this.deliverInfo); 
        } else {
          console.log(response);
          this.deliverInfo = [];
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      })
    },
    handleClick(tab, event){
      this.isDisabledDel = true;
      this.currpage = 1;//点击标签后自动还原当前页码为1
      if(tab.name === "OutMatl"){
        this.MATLPROS = '02';
      }else{
        this.MATLPROS = '01'
      }
      this.queryDeliverMatl();
    },
    //前端分页
    handleInCurrentChange(val) {
      this.currpage=val
      console.log(`当前页: ${val}`);
      console.log(this.currpage);   
      this.queryDeliverMatl();
    },
    //改变下拉框选项自动查询，进行选择表格更新
    queryMatl(){
      this.MatlCheckArray = [];//清空之前的数据
      if(this.roleManageDetail.MATLPROS ==="02"){
        let resBody = new OutMatlQuery();
        resBody.data.MATLTYPE=this.roleManageDetail.DELIVERYMATLTYPE;
        resBody.data.pageflag = this.pageflag;
        resBody.data.currpage = this.currpage;
        resBody.data.pagerownum = this.pagerownum;
        request(resBody)
        .then(response=>{
          if(response.SYS_HEAD.ReturnCode === "000000") {
            this.loading = false;
            console.log("查询输出物料的内容为：");
            console.log(response.RSP_BODY); 
            this.MatlCheckArray = response.RSP_BODY.struct;
          } else {
            console.log(response);
          }
        })
        .catch(error=>{
          this.loading = false
          console.log("error", error);
        })
      }else{
        let resBody = new InMatlQuery();
        resBody.data.MATLTYPE=this.roleManageDetail.DELIVERYMATLTYPE;
        resBody.data.pageflag = this.pageflag;
        resBody.data.currpage = this.currpage;
        resBody.data.pagerownum = this.pagerownum;
        request(resBody)
        .then(response=>{
          if(response.SYS_HEAD.ReturnCode === "000000") {
            this.loading = false;
            console.log("查询输入物料的内容为：");
            console.log(response.RSP_BODY); 
            this.MatlCheckArray = response.RSP_BODY.struct;
          } else {
            console.log(response);
          }
        })
        .catch(error=>{
          this.loading = false
          console.log("error", error);
        })
        }
    },
    //打开编辑弹窗
    openEdit(){
      this.roleManageDetailEdit.ISAUDIT = this.DeliverMatl.ISAUDIT==="1" ? true:false;
      this.roleManageDetailEdit.ISGATHER = this.DeliverMatl.ISGATHER==="1" ? true:false;
      this.roleManageDetailEdit.ISCONTROL = this.DeliverMatl.ISCONTROL==="1" ? true:false;
      console.log("获取到的权限信息为：");
      console.log(this.roleManageDetailEdit);
    },
    getParamID(scope, val){
      console.log("当前选择物料信息：");
      console.log(val);
      this.roleManageDetail.DELIVERYMATLID = val.MATLID;
      this.roleManageDetail.CCY = val.CCY;
      this.roleManageDetail.VOUTYPE = val.VOUTYPE;
      this.nextAble =false;
    },
    // 查看当前行参数详情信息
    handleQueryParameter(index, row) {
      this.rowVal = row;
      console.log("当前行参数详情：")
      console.log(row);
      this.dialogqueryMatlDetail.isShow = true;
        
        // this.dialogQueryMatl.isShow = true;
    },
    // 表格选中获取参数ID
    getInMatlID(scope, val) {
      //传递参数给子页面
      if(val.MATLPROS === '01'){
        this.editType = 'In';
      }else{
        this.editType = 'Out';
      }
      this.DeliverMatl = val;
      console.log("当前选择的可交割物料为：");
      console.log(this.DeliverMatl);
      if(val) {  
        this.isDisabledDel =false;
      }
    },
    next(){
      this.active = 1;
    },
    //可交割物料维护
    deliverMatlManage(){

    },
    //删除交割物料：
    deliverDeliverMatl(){
      this.$confirm('此操作将永久删除该可交割物料,同时包含该物料的相关数据集（包括：可交割能力、网点用户交割能力）都将删除,是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let resBody = new deliverAbilityDetailManage();
          resBody.data.MATLID=this.matlId;
          resBody.data.OPERTYPE="3";
          resBody.data.ABILITYID = this.DeliverMatl.ABILITYID;
          resBody.data.MATLPROS = this.DeliverMatl.MATLPROS;
          resBody.data.DELIVERYMATLTYPE = this.DeliverMatl.DELIVERYMATLTYPE;
          resBody.data.DELIVERYMATLID = this.DeliverMatl.DELIVERYMATLID;
          resBody.data.MODORGNO=this.MODORGNO;
          resBody.data.MODUSER=this.MODUSER;
          request(resBody)
          .then(response=>{
            if(response.SYS_HEAD.ReturnCode === "000000") {
              this.$message({
              type: 'success',
              message: '删除成功!'
          });
          this.queryDeliverMatl();
            } else {
              console.log(response);
            }
          })
          .catch(error=>{
            this.loading = false
            console.log("error", error);
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    //编辑三个模式：
    edit(){
      //对三个布尔值做处理；
      if(this.roleManageDetailEdit.ISGATHER===true){
            this.roleManageDetailEdit.ISGATHER ="1"
          }else{
            this.roleManageDetailEdit.ISGATHER = "0"
          };
      if(this.roleManageDetailEdit.ISAUDIT===true){
            this.roleManageDetailEdit.ISAUDIT ="1"
          }else{
            this.roleManageDetailEdit.ISAUDIT = "0"
          }
      if(this.roleManageDetailEdit.ISCONTROL===true){
            this.roleManageDetailEdit.ISCONTROL ="1"
          }else{
            this.roleManageDetailEdit.ISCONTROL = "0"
          }
      let resBody = new deliverAbilityDetailManage();
      resBody.data.OPERTYPE = "2";
      resBody.data.ABILITYID = this.DeliverMatl.ABILITYID;
      resBody.data.MATLPROS = this.DeliverMatl.MATLPROS;
      resBody.data.DELIVERYMATLTYPE = this.DeliverMatl.DELIVERYMATLTYPE;
      resBody.data.DELIVERYMATLID = this.DeliverMatl.DELIVERYMATLID;
      resBody.data.ISGATHER = this.roleManageDetailEdit.ISGATHER;
      resBody.data.ISAUDIT = this.roleManageDetailEdit.ISAUDIT;
      resBody.data.ISCONTROL = this.roleManageDetailEdit.ISCONTROL;
      resBody.data.MODUSER = this.MODUSER;
      resBody.data.MODORGNO = this.MODORGNO;
       request(resBody)
          .then(response=>{
            if(response.SYS_HEAD.ReturnCode === "000000") {
              this.$message({
                      type: "success",
                      message: "成功修改可交割物料权限!"
                    });
              this.isShowEdit =false;
              this.queryDeliverMatl();
            } else {
              console.log(response.RSP_BODY);
            }
          })
          .catch(error=>{
            this.loading = false
            console.log("error", error);
          });
    },
    roleDetail() {
      //对三个布尔值做处理；
      if(this.roleManageDetail.ISGATHER===true){
            this.roleManageDetail.ISGATHER ="1"
          }else{
            this.roleManageDetail.ISGATHER = "0"
          };
      if(this.roleManageDetail.ISAUDIT===true){
            this.roleManageDetail.ISAUDIT ="1"
          }else{
            this.roleManageDetail.ISAUDIT = "0"
          }
      if(this.roleManageDetail.ISCONTROL===true){
            this.roleManageDetail.ISCONTROL ="1"
          }else{
            this.roleManageDetail.ISCONTROL = "0"
          }
      let resBody = new deliverAbilityDetailManage();
      resBody.data.OPERTYPE = "1";
      resBody.data.ABILITYID = this.deliverAbilityInfo.ABILITYID;
      resBody.data.MATLPROS = this.roleManageDetail.MATLPROS;
      resBody.data.DELIVERYMATLTYPE = this.roleManageDetail.DELIVERYMATLTYPE;
      resBody.data.DELIVERYMATLID = this.roleManageDetail.DELIVERYMATLID;
      resBody.data.CCY = this.roleManageDetail.CCY;
      resBody.data.VOUTYPE = this.roleManageDetail.VOUTYPE;
      resBody.data.ISGATHER = this.roleManageDetail.ISGATHER;
      resBody.data.ISAUDIT = this.roleManageDetail.ISAUDIT;
      resBody.data.ISCONTROL = this.roleManageDetail.ISCONTROL;
      resBody.data.MODUSER = this.MODUSER;
      resBody.data.MODORGNO = this.MODORGNO;
       request(resBody)
          .then(response=>{
            if(response.SYS_HEAD.ReturnCode === "000000") {
              this.$message({
                      type: "success",
                      message: "成功添加可交割物料!"
                    });
              this.isShowAdd =false;
              this.queryDeliverMatl();
            } else {
              console.log(response.RSP_BODY);
            }
          })
          .catch(error=>{
            this.loading = false
            console.log("error", error);
          });
    },
  addAgain(){
    //对三个布尔值做处理；
      if(this.roleManageDetail.ISGATHER===true){
            this.roleManageDetail.ISGATHER ="1"
          }else{
            this.roleManageDetail.ISGATHER = "0"
          };
      if(this.roleManageDetail.ISAUDIT===true){
            this.roleManageDetail.ISAUDIT ="1"
          }else{
            this.roleManageDetail.ISAUDIT = "0"
          }
      if(this.roleManageDetail.ISCONTROL===true){
            this.roleManageDetail.ISCONTROL ="1"
          }else{
            this.roleManageDetail.ISCONTROL = "0"
          }
      let resBody = new deliverAbilityDetailManage();
      resBody.data.OPERTYPE = "1";
      resBody.data.ABILITYID = this.deliverAbilityInfo.ABILITYID;
      resBody.data.MATLPROS = this.roleManageDetail.MATLPROS;
      resBody.data.DELIVERYMATLTYPE = this.roleManageDetail.DELIVERYMATLTYPE;
      resBody.data.DELIVERYMATLID = this.roleManageDetail.DELIVERYMATLID;
      resBody.data.CCY = this.roleManageDetail.CCY;
      resBody.data.VOUTYPE = this.roleManageDetail.VOUTYPE;
      resBody.data.ISGATHER = this.roleManageDetail.ISGATHER;
      resBody.data.ISAUDIT = this.roleManageDetail.ISAUDIT;
      resBody.data.ISCONTROL = this.roleManageDetail.ISCONTROL;
      resBody.data.MODUSER = this.MODUSER;
      resBody.data.MODORGNO = this.MODORGNO;
       request(resBody)
          .then(response=>{
            if(response.SYS_HEAD.ReturnCode === "000000") {
              this.$message({
                      type: "success",
                      message: "成功添加可交割物料!"
                    });
              this.queryDeliverMatl();
              this.roleManageDetail.DELIVERYMATLTYPE = '';//清空上一次的值；
              this.MatlCheckArray=[];//清空物料选择列表
              // this.roleManageDetail.MATLPROS='01';
              this.active = 0;
            } else {
              console.log(response.RSP_BODY);
            }
          })
          .catch(error=>{
            this.loading = false
            console.log("error", error);
          });
  },
    openRole(){
      console.log("得到的参数：");
      console.log(this.rowData);
      this.deliverAbilityInfo = this.rowData;
      this.MATLPROS = '01';
      this.queryDeliverMatl();
    },
    closeRole(){
      this.isDisabledDel = true;
      this.activeName = 'InMatl';
      this.currpage = 1;
    },
    closeRoleAdd(){
      this.isDisabledDel = true;
      this.roleManageDetail.DELIVERYMATLTYPE = '';
      this.MatlCheckArray = [];
      this.active = 0;
    },
    openRoleAdd(){
      if(this.activeName === 'InMatl'){
        this.roleManageDetail.MATLPROS = '01';
      }else{
        this.roleManageDetail.MATLPROS = '02';
      }
    }
   }
};
</script>

<style lang="scss"  scoped>
.rowStyle {
  margin-bottom: 10px;
}
</style>
