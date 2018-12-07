<template>
  <div>
    <el-card :visble.sync="isShow">
      <el-form size="mini">
          <el-form-item>
            <el-row>
              <el-col :lg="3" :md="4">
                    <el-checkbox-group v-model="selectV">
                      <el-checkbox :label="aums002.systemId">{{aums002.systemName}}</el-checkbox>
                    </el-checkbox-group>
              </el-col>
              <el-col :span="20">
                  <el-checkbox label="自助C端"  name="type"></el-checkbox>
                  <el-row>
                      柜式:
                      <el-table :data="CCabinet" ref="CCabinet"  height="125"
                        style="margin: 10px 0 10px 10px;border:1px solid #ebeef5;border-radius:3px;"
                        @selection-change="handleCurrentChangeCabinet">
                          <el-table-column type="selection"></el-table-column>
                          <el-table-column prop="devAssortmentName"  
                                          label="设备分类">
                          </el-table-column>
                          <el-table-column prop="devModel" 
                                          label="设备型号">
                          </el-table-column>
                          <el-table-column label="C端版本">
                                <template slot-scope="scope">
                              <span  v-for="item in scope.row.programList" :key="item.id">{{item.programName}}</span>
                              </template>
                          </el-table-column>
                      </el-table>
                  </el-row>
                  <el-row>
                      PAD：
                      <el-table :data="CPad"  ref="CPad" v-model="selectC" height="125"
                      style="margin: 10px 0 10px 10px;border:1px solid #ebeef5;border-radius:3px;"
                      @selection-change="handleCurrentChangeCPad"> 
                          <el-table-column type="selection"></el-table-column>
                          <el-table-column prop="devAssortmentName" 
                                          label="PAD分类">
                          </el-table-column>
                          <el-table-column prop="devModel" 
                                          label="PAD型号">
                          </el-table-column>
                          <el-table-column label="应用">
                                <template slot-scope="scope">
                              <span  v-for="item in scope.row.programList" :key="item.id">{{item.programName}}</span>
                              </template>                                                
                          </el-table-column>
                      </el-table>
                  </el-row>
              </el-col>
            </el-row>
          </el-form-item>
      </el-form>         
    </el-card>   
    <el-row style="margin:20px;text-align:center">
          <el-button  size="mini" @click="cancleSystem">取消</el-button>
          <el-button type="primary" size="mini" @click="sureSystem">确定</el-button>
            
    </el-row>  
  </div>
</template>

<script>
import devRunList from "@/message/spinnerDataQuery/spinner-data-query";
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
import userSystem from '@/message/userManage/user/user-system'
export default {
  props: { option: Object },
  data() {
    return {
      newUserDate: {
        channelType: []
      },
      aums001: [],
      CCabinet: [
        // {devAssortmentName:"123",systemId:"1002001"},
        // {devAssortmentName:"124",systemId:"1002002"},
        // {devAssortmentName:"125",systemId:"1002003"},
        // {devAssortmentName:"126",systemId:"1002004"},
      ],
      CPad: [],
      aums002: [],
      selectC: [],
      selectV:[],
      selectedDataCabinet:[],
      selectedDataCPad:[],
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
    sureSystem() {
      this.selectC.length=0;
      this.selectData(this.selectedDataCabinet,"1")
      this.selectData(this.selectedDataCPad,"2")
      if(this.selectV.length>0){
        for(let i=0;i<this.selectV.length;i++){
           if(this.aums002.systemId==this.selectV[i]){
            this.selectC.push(this.selectV[i])
            break
            }
        }
      }

      if(this.selectedDataCabinet.length>0){
        this.selectedDataCabinet.forEach(element => {
           this.selectC.push(element)
         });
      }       
      if(this.selectedDataCPad.length>0){
        this.selectedDataCPad.forEach(element => {
         this.selectC.push(element)
      });     
      }
     
      let set=new Set(this.selectC)
      this.selectC=Array.from(set)
      let resBody = new userSystem();
      resBody.data.userId = this.option.userId
      resBody.data.systemIdList = this.selectC
        request(resBody)
          .then(response => {
            if (response.SYS_HEAD.ReturnCode === "000000") {
              this.$message({
                type: "success",
                message: "用户关联系统成功!"
              });
              this.isShow=false
              this.$emit("systemClose");
              this.$emit("systemEmit");
            }
          })
          .catch(error => {
            this.$message({
              type: "info",
              message: error
            });
          });

    },
    cancleSystem() {
      this.option.isShow = false;
      this.$emit("systemClose");
    },
    selectData(val,title){
      if(val.length>0){
        if(title=="1"){
          this.selectedDataCabinet=[]
        }
        else{
            this.selectedDataCPad=[]
        }
        val.forEach(element => {
          if(title=="1"){
            if(element.systemId){
              this.selectedDataCabinet.push(element.systemId)
            }
            else{
              this.selectedDataCabinet.push(element)
            }
          }else{
             if(element.systemId){
                this.selectedDataCPad.push(element.systemId)
             }
             else{
                this.selectedDataCPad.push(element)               
             }
          }
        });
       let set=new Set(this.selectedDataCabinet)
       this.selectedDataCabinet=Array.from(set)
       let set1=new Set(this.selectedDataCPad)
       this.selectedDataCPad=Array.from(set1)
      }

    },
    handleCurrentChangeCabinet(val) {
      this.selectedDataCabinet=val
    },
    handleCurrentChangeCPad(val){
      this.selectedDataCPad=val      
    }
  },
  beforeUpdate(){
    
  },
  created() {
     if(this.option.system){
       this.selectC = this.option.system;
       this.selectV = Object.assign([],this.option.system);
       this.selectedDataCPad= this.option.system;
       this.selectedDataCabinet= this.option.system;       
    }
    //系统列表初始化
   
    let resBody = new devRunList();
    resBody.data.spinnerList = [{ spinnerName: "system" }];
    request(resBody)
      .then(response => {
        let systemList = response.RSP_BODY.systemListSpinner;
        this.aums001 = systemList.aums001;
        this.aums002 = systemList.aums002[0];    
        for (let i = 0; i < this.aums001.length; i++) {//默认选中当前行
          if (this.aums001[i].devForm == "1") {
            this.CCabinet.push(this.aums001[i]);
            let index=this.selectC.indexOf(this.aums001[i].systemId)
            if(index>-1){
              this.$refs.CCabinet.toggleRowSelection(this.aums001[i])//默认选中当前行
            }
          } else {
            this.CPad.push(this.aums001[i]);
            let index=this.selectC.indexOf(this.aums001[i].systemId)
            if(index>-1){
              this.$refs.CPad.toggleRowSelection(this.aums001[i])//默认选中当前行
            }
          }
        }
      })
      .catch(error => {
        console.error("查询错误", error);
      });
     
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
