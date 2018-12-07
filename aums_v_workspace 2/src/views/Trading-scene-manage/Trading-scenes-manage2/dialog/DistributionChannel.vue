<template>
	<div>
    <el-dialog title="渠道发布" @open="openCollback" @close="closeDialog"
    :lock-scroll=false
    :visible.sync="isShow" width="800px">
    <div >
      <el-card style="margin-bottom:10px;">
        <el-form :model="DistributionChannelInfo" ref="DistributionChannelInfo"  size="mini" label-position="left" label-width="80px" >
          <el-row :gutter="10">
            <el-col :md="12" :lg="12">
              <el-form-item label="交易代码" >
                <el-input v-model="DistributionChannelInfo.TRANCODE" 
                disabled
                placeholder="请输入交易代码"></el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12" :lg="12">
              <el-form-item label="场景ID" >
                <el-input v-model="DistributionChannelInfo.SCENECODE"
                disabled
                placeholder="请输入交易场景ID"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :md="24" :lg="24">
              <el-form-item label="渠道类型" size='mini'>
                <!-- <el-select v-model="DistributionChannelInfo.CHANNELCODE" placeholder="请选择渠道类型">
                  <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                  </el-option>
                </el-select> -->
                <el-checkbox-group v-model="ChannelCheckList" >
                <el-checkbox label="C001">自助柜台</el-checkbox>
                <el-checkbox label="C002">PAD渠道</el-checkbox>
                <el-checkbox label="C003">移动渠道</el-checkbox>
                <el-checkbox label="C005">手机渠道</el-checkbox>
                <el-checkbox label="C006">模拟渠道</el-checkbox>
                <!-- <el-checkbox label="04">上门服务</el-checkbox> -->
              </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
    	</el-card>  
        <div slot="footer" class="dialog-footer" style="text-align:center;">
          <el-button  type="primary" size="mini" style="margin-top: 10px;"
          @click="isShow=false">取消</el-button>
					<el-button type="primary" size="mini" style="margin-top: 10px;"
          @click="DistributeChannel">确 定</el-button>
        </div>
    </div>
    </el-dialog>
	</div>
</template>

<script>
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
import channelManage from "@/message/Tradingscenemanage/TrandeScence/channelManage";
import channelManage2 from "@/message/Tradingscenemanage/TrandeScence/channelManage2";
import channelQuery from "@/message/Tradingscenemanage/TrandeScence/channelQuery";
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
      // 页面号
      active:0,
      // 渠道查询表单：
      DistributionChannelQuery:{
        CHANNELCODE:'',//渠道
        TRANCODE:'',//交易代码
        SCENECODE:''//交易场景ID
      },
      selectChannel:[],//存放已经选择的数组；
      // 渠道维护上送表单：
      DistributionChannelInfo:{
        CHANNELCODE:'',//渠道
        TRANCODE:'',//交易代码
        SCENECODE:'',//交易场景ID
        MODORGNO:'',//维护机构
        MODUSER:'' // 维护用户
      },
      ChannelCheckList:[],//渠道选择数组
      ChannelList:[],//渠道选择上送数组
      // 渠道类型下拉框选项；
      options: [{
          value: 'C001',
          label: '远程柜台'
        }, {
          value: 'C002',
          label: '自助渠道'
        }, {
          value: 'C003',
          label: '自主渠道'
        }, {
          value: 'C004',
          label: '上门服务'
        }
          ],
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
    // 打开dialog回调
    openCollback() {
      this.DistributionChannelInfo.TRANCODE= this.rowData.TRANCODE;
      this.DistributionChannelInfo.SCENECODE=this.rowData.SCENECODE;
      this.channelInfoQuery();
    },
    next(){
        this.active++;
    },
    back(){
        this.active--;
    },
    //关闭弹窗时清空temp数据
    closeDialog() {
      this.ChannelCheckList = [];//清空上次信息；
      this.option.isShow=false;
    },
    //首先对多选框数组进行处理；变更为键值对的形式
    handleSelectChange(val){
      this.ChannelList = [];//首先清空当前数组
      console.log("选中的值：");
      console.log(this.ChannelCheckList);//取到数组；
      //遍历数组填充值，后传入list;
      for(let i = 0;i<this.ChannelCheckList.length;i++){
        this.ChannelList.push({CHANNEL:this.ChannelCheckList[i]});
      }
      console.log("变更后的数组：");
      console.log(this.ChannelList);
    },
    //进入页面首先查询已有的渠道信息；
    channelInfoQuery(){
      let resBody = new channelQuery();
      resBody.data.SCENECODE = this.DistributionChannelInfo.SCENECODE;
      resBody.data.pageflag = this.pageflag;
      resBody.data.currpage = this.currpage;
      resBody.data.pagerownum = this.pagerownum;
      request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          console.log("当前场景查询到的：");
          console.log(response.RSP_BODY.struct);
          for(let i = 0;i<response.RSP_BODY.struct.length;i++){
            this.ChannelCheckList.push(response.RSP_BODY.struct[i].CHANNEL);
          }
          console.log("已有的渠道为：");
          console.log(this.ChannelCheckList);
          // this.loading=false;
        } else {
          console.log(response);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
      })
    },
    //发布渠道
    DistributeChannel(){
      this.handleSelectChange();
      let resBody = new channelManage2();
      resBody.data.CHLTRANLIST = this.ChannelList;
      resBody.data.TRANCODE = this.DistributionChannelInfo.TRANCODE;
      resBody.data.SCENECODE = this.DistributionChannelInfo.SCENECODE;
      resBody.data.MODUSER = this.MODUSER;
      resBody.data.MODORGNO = this.MODORGNO;
      request(resBody)
      .then(response=>{
        if(response.SYS_HEAD.ReturnCode === "000000") {
          this.$message({
          message: '发布成功！',
          type: 'success'
        });
          this.option.isShow=false;
        } else {
          console.log(response.RSP_BODY);
        }
      })
      .catch(error=>{
        this.loading = false
        console.log("error", error);
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
