<template>
  <div v-loading="loading"
    element-loading-text="加载中。。。">
    <el-card>
        <tree-table  :data="data" ref="systemTable" 
        :expandAll="isExpandAll" 
        :columns="columns" border
        :toggleRow="toggleRow"
        :clearRow="option.clearRow"
         @returnData="returnData" height="400" >
        </tree-table>
    </el-card> 
    <el-row style="margin:20px;text-align:center">
          <el-button  size="mini" @click="cancleSystem">取消</el-button>
          <el-button type="primary" size="mini" @click="sureSystem">确定</el-button>    
    </el-row>  
  </div>
</template>

<script>
import treeTable from '@/components/TreeTable'
import devRunList from "@/message/spinnerDataQuery/spinner-data-query";
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
import userSystem from '@/message/userManage/user/user-system'
export default {
  components: { treeTable },
  props: { option: Object },
  data() {
    return {
      loading:false,
      toggleRow:undefined,
      isExpandAll:true,//展开表格
      columns:[
         {
          text: '系统类型',
          value: 'systemName',
          width: 100,
        },
          {
          text: '设备分类',
          value: 'devAssortmentName',
          width: 120
        },
        {
          text: '设备型号',
          value: 'devModel',
          width: 120          
        },
        {
          text: '应用',
          value: 'programList'
        },
      ],
      data:[],
      newUserDate: {
        channelType: []
      },
      aums001: [],
      CCabinet: [
      ],
      CPad: [],
      aums002: [],
      selectC: [],
      selectV:[],
      selectedDataCabinet:[],
      selectedDataCPad:[],
      systemList:[],
    };
  },
  computed: {
    isShow: {
      get() {
        return this.option.isShow;
      },
      set(value) {
        this.option.isShow = value;
      }
    }
  },
  methods: {
    returnData(selection, val) {
       this.selectC=selection
    },
    sureSystem() {
      let selectC=[]
      this.selectC.forEach(element => {
        selectC.push(element.systemId)
      });
      let resBody = new userSystem();
      this.loading=true;
      console.log(this.option,"option")
      resBody.data.userId = this.option.userId
      resBody.data.systemIdList = selectC
        request(resBody)
          .then(response => {
            if (response.SYS_HEAD.ReturnCode === "000000") {
              this.$message({
                type: "success",
                message: "用户关联系统成功!"
              });
              this.loading=false;              
              this.isShow=false
              this.$emit("systemClose");
              this.$emit("systemEmit");
            }else{
              this.loading=false;   
              this.$message({
              type: "info",
              message: "用户关联系统失败!"
            });                         
            }
          })
          .catch(error => {
            this.loading=false;                          
           
          });

    },
    cancleSystem() {
      this.option.isShow = false;
      this.$emit("systemClose");
    },
    initSystemList(){    //系统列表初始化
      let resBody = new devRunList();
      resBody.data.spinnerList = [{ spinnerName: "system" }];
      request(resBody)
        .then(response => {
          if(response.SYS_HEAD.ReturnCode=="000000"){
            let systemList = response.RSP_BODY.systemListSpinner;
            this.systemList=systemList
            this.aums001 = this.systemList .aums001;
            this.aums002 = this.systemList .aums002[0];   
            this.data=[]
            this.data.push(this.aums002)
            let aums001C= {
              systemName: "自助C端",
              systemId:"aums001CId",
              isUser:true,
              children:[
                {
                  systemName: "柜式",
                  devForm:"1",
                  isUser:true,                  
                  children:[
                  ]
                },
                {
                  systemName: "PAD",
                  devForm:"2",
                  isUser:true,                  
                  children:[
                  ]
                },
              ]
            }
            this.data.push(aums001C)
            for (let i = 0; i < this.aums001.length; i++) {
              let programList=[]
                this.aums001[i].programList.forEach(element => {
                  programList.push(element.programName)
                });
                this.aums001[i].programList=programList.join(",")
              if (this.aums001[i].devForm == "1") {
                this.CCabinet.push(this.aums001[i]);
                let index=this.selectC.indexOf(this.aums001[i].systemId)
                if(index>-1){
                  // this.$refs.CCabinet.toggleRowSelection(this.aums001[i])//默认选中当前行
                }
              } else if (this.aums001[i].devForm == "2") {            
                this.CPad.push(this.aums001[i]);
                let index=this.selectC.indexOf(this.aums001[i].systemId)
                if(index>-1){
                  // this.$refs.CPad.toggleRowSelection(this.aums001[i])//默认选中当前行
                }
              }
            }
            let toggleRow=Object.assign([])
            this.data.forEach(element => {//将数据拆成表格需要的格式
              if(element.systemId){
                if (this.option.hasOwnProperty("system") && this.option.system.indexOf(element.systemId)>-1) {
                  toggleRow.push(element)
                }    
              }
              if (element.systemId==="aums001CId") {
                element.children.forEach(element1 => {
                  if(element1.devForm=="1"){
                    element1.children=this.CCabinet
                  }else if(element1.devForm=="2"){
                    element1.children=this.CPad                  
                  }
                  element1.children.forEach(elementCCabinet => {
                    if (this.option.hasOwnProperty("system") && this.option.system.indexOf(elementCCabinet.systemId)>-1) {
                      toggleRow.push(elementCCabinet)
                    } 
                  });
                });
              }
            });
            setTimeout(() => {
                 this.toggleRow=toggleRow
            }, 0);
          }
        })
        .catch(error => {
          console.error("查询错误", error);
        });
    }
   },
  watch: {
    option: {
      handler: function (val, oldVal) {
            let toggleRow=Object.assign([])
            this.data.forEach(element => {//将数据拆成表格需要的格式
              if(element.systemId){
                if (this.option.hasOwnProperty("system") && this.option.system.indexOf(element.systemId)>-1) {
                  toggleRow.push(element)
                }    
              }
              if (element.systemId==="aums001CId") {
                element.children.forEach(element1 => {
                  element1.children.forEach(elementCCabinet => {
                    if (this.option.hasOwnProperty("system") && this.option.system.indexOf(elementCCabinet.systemId)>-1) {
                      toggleRow.push(elementCCabinet)
                    } 
                  });
                });
              }
            });
            setTimeout(() => {
                 this.toggleRow=toggleRow
            }, 0);
      },
        deep: true
    }
  },
  created() {
     if(this.option.system){
       this.selectC = this.option.system;
       this.selectV = Object.assign([],this.option.system);
       this.selectedDataCPad= this.option.system;
       this.selectedDataCabinet= this.option.system;       
    }
    //系统列表初始化
    this.initSystemList()
  }
};
</script>

<style  scoped lang="scss">
.CCbox {
  border: 1px solid #eee;
  padding: 5px;
}
.ccRow {
  width: 100%;
  border-bottom: 1px solid #eee;
}
.CCItem {
  display: inline-block;
  width: 30%;
  padding: 5px;
  text-align: center;
}
</style>
