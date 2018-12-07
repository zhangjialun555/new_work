<template>
  <div>
    <!-- 视频播放弹窗 -->
  <el-dialog title="" @open="OpenVideoDialog"  @close="closeVideoDialog" 
    :lock-scroll=false
    :visible.sync="isShow" class="video_Dialog">
    <br>
      <el-card class="vedio_card">
        <div>
          <video controls autoplay 
          :src="VedioUrl" 
          type="video/mp4"  
          id="media" 
          class="media" 
          ref="media">
          </video>
        </div>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
export default {
  props: {
    option: Object,
    paramObj: Object
  },
  data() {
    return {
      //分页标志：
      pageflag: 4,
      currpage: 1,
      pagerownum: 10,
      VedioUrl:'',
      matlType:getGlobalParams.get("matlType"),
      matlGroupRos:getGlobalParams.get("matlGroupRos"),
      MatlGroupInfo:{
          MATLGROUPID:'',//物料组ID
          MATLGROUPNAME:'',//物料组名称
          MATLTYPE:'',//物料类型
          MATLID:'',//物料ID
          MODORGNO:'',//维护机构
          MODUSER:'',//维护用户,
          MATLNAME:'',//物料名称
          MATLENNAME:'',//英文简称
          SERLNUM:'',//序号  
          VOUTYPE:'',//凭证类型
          VOUNUM:'',//凭证数量
          CCY:'',//币种
          MODDATE:'',//维护日期；
          MODTIME:'',//维护时间
      },
      matlQueryReasult:[],//存放物料组物料信息
      MatlGroupId:'',//执行查询操作时标记符
      currentPage: 1,
      loading: false,
    };
  },
  created(){
    
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
    paramForm: function() {
      return this.paramObj
    }
  },
  methods: {
      OpenVideoDialog(){
        //获取到视频标签改变视频源参数
        this.$nextTick(() => {
          this.$refs["media"].src = this.paramObj.url;
    });
    },
    closeVideoDialog(){
      //离开窗口暂停视频，后清除数据；
      var video = document.getElementById('media');
      video.pause();
      this.VedioUrl = '';
      this.isShow = false;
    },
    //获取当前行信息：
    getInfo(){
      this.MatlGroupInfo = this.paramObj;
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    // 打开dialog回调
    openCollback() {
      console.log("paramObj")
     console.log(this.paramObj);
     this.queryDetailInfo();
    },
  }
};
</script>

<style scope>
.video_Dialog{
  /* margin: 15px; */
}
.vedio_card{
  margin-bottom:10px
}
.media{
  /* margin: 15px; */
  width:100%
}
</style>