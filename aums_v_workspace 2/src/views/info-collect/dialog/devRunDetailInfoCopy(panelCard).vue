<template>
   <div  class="detailInfo" v-if="isShow" >
       <!-- <div id="returnBtnTop" :class="{searchBarFixed:searchBarFixed}">
         <el-button @click="isShow=false" style="margin:10px;" size="mini">返回</el-button>
       </div> -->
       <el-row  :gutter="10">
         <el-col :md="24" :lg="24">
           <!-- <el-card > -->
             <el-button @click="isShow=false" type="primary" size="mini">返回</el-button>
             <!-- <span style="float:right;line-height:28px;margin:0 10px;">当前设备编号：75843</span>
             <span style="float:right;line-height:28px;margin:0 10px;">当前设备型号：CUS-0342</span>
             <span style="float:right;line-height:28px;margin:0 10px;">当前设备种类：ATM</span> -->
           <!-- </el-card> -->
         </el-col>
         <el-col :md="24" :lg="12">
           <el-row>
              <el-col :span="24" class="marginTop10">
                <el-card >
                    <div slot="header" >
                      <span>设备基本信息</span>
                      <el-button style="float: right;padding: 1px 0px 1px 10px;" type="text">修改设备基本信息</el-button>
                      <el-button style="float: right;padding: 1px 14px 1px 0px;border-right: 1px solid #ccc;border-radius: 0;" type="text">查看设备预警记录</el-button>
                    </div>
                  <el-form  size="mini" :label-width="labelWidth">
                      <el-row>
                        <el-col :span="12">
                            <el-form-item label='设备编号'>
                              <span>{{detailInfo.devBasicInfo.devNum}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label='机构号'>
                              <span>{{detailInfo.devBasicInfo.branchNo}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label='设备分类' >
                              <span>{{detailInfo.devBasicInfo.devAssortmentName}}</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label='设备类型' >
                              <span>{{detailInfo.devBasicInfo.devType}}</span>
                            </el-form-item>
                        </el-col>    
                        <el-col :span="12">
                            <el-form-item label='设备型号' >
                              <span>{{detailInfo.devBasicInfo.devModel}}</span>
                            </el-form-item>
                        </el-col> 
                      <!-- </el-row> -->
                      <!-- <div style="border-top: 1px solid #ddd;margin:0 0 14px 0;"></div> -->
                      <!-- <el-row> -->
                        <el-col :span="12">
                            <el-form-item label='C端应用' >
                              <span>{{detailInfo.devBasicInfo.cProgramName}}</span>
                            </el-form-item>
                        </el-col> 
                      <!-- </el-row> -->
                      <!-- <div style="border-top: 1px solid #ddd;margin:0 0 14px 0;"></div> -->
                      <!-- <el-row> -->
                        <el-col :span="12">
                            <el-form-item label='虚拟柜员号' >
                              <span>{{detailInfo.devBasicInfo.virtualTellerNo}}</span>
                            </el-form-item>
                        </el-col> 
                        <el-col :span="12">
                            <el-form-item label='维护柜员号' >
                              <span>{{detailInfo.devBasicInfo.servicingTellerNo}}</span>
                            </el-form-item>
                        </el-col>                 
                      </el-row>
                      <el-row>
                        <el-col style="display:flex;flex-flow:row nowarp;justify-content:center;">
                          <el-button type="primary" size="mini">启用</el-button>
                          <el-button type="primary" size="mini">停用</el-button>
                          <el-button type="primary" size="mini">维护</el-button>
                        </el-col>
                      </el-row>
                  </el-form>
                </el-card>
              </el-col>
              <el-col :span="24" class="marginTop10">
                <el-card>
                    <div slot="header" >
                      <span>客户端应用信息</span>
                    </div>
                    <el-collapse  accordion  :value="0">
                      <el-collapse-item :title="item.cProgramName" :name="key" v-for="(item,key) in detailInfo.cProgramList" :key="key">
                        <el-form size="mini" :label-width="labelWidth">
                          <el-row>
                            <el-col :span="12">
                                <el-form-item label='应用名称' >
                                  <span>{{item.cProgramName}}</span>
                                </el-form-item>
                            </el-col>
                            <!-- <el-col :span="12">
                                <el-form-item label='应用版本(暂无)' >
                                  <span></span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label='应用状态(暂无)' >
                                  <span></span>
                                </el-form-item>
                            </el-col> -->
                            <el-col :span="12">
                                <el-form-item label='参数' >
                                  <el-button style="" type="text">查看参数详情</el-button>
                                </el-form-item>
                            </el-col>    
                            <el-col :span="12">
                                <el-form-item label='广告' >
                                  <el-button style="" type="text">查看广告详情</el-button>
                                </el-form-item>
                            </el-col> 
                            <el-col :span="12">
                                <el-form-item label='菜单' >
                                  <el-button style="" type="text">查看菜单详情</el-button>
                                </el-form-item>
                            </el-col> 
                          </el-row>
                          <el-row>
                            <el-col style="display:flex;flex-flow:row nowarp;justify-content:center;">
                              <el-button type="primary" size="mini">服务恢复</el-button>
                              <el-button type="primary" size="mini">服务暂停</el-button>
                              <el-dropdown trigger="click" @command="openPop" style="margin:0 0 0 10px;">
                                <el-button type="primary" size="mini">更多<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                                <el-dropdown-menu slot="dropdown">
                                  <el-dropdown-item command='' :disabled="true">参数下发</el-dropdown-item>
                                  <el-dropdown-item command='' :disabled="false">广告下发</el-dropdown-item>
                                  <el-dropdown-item command='' :disabled="false">资源下发</el-dropdown-item>
                                  <el-dropdown-item command='' :disabled="false">日志抓取</el-dropdown-item>
                                  <el-dropdown-item command='' :disabled="false">菜单管理</el-dropdown-item>
                                  <el-dropdown-item command='' :disabled="false">版本升级</el-dropdown-item>
                                  <el-dropdown-item command='' :disabled="false">查看交易明细</el-dropdown-item>
                                </el-dropdown-menu>
                              </el-dropdown>
                            </el-col>
                          </el-row>
                        </el-form>
                      </el-collapse-item>
                    </el-collapse>
                </el-card>
              </el-col>
              <el-col :span="24" class="marginTop10">
                <el-card>
                    <div slot="header" >
                      <span>设备卡箱信息</span>
                      <el-button style="float: right;padding: 1px 0px 1px 10px;" type="text">查看加卡记录</el-button>
                    </div>
                    <el-row>
                        <el-form size="mini" :label-width="labelWidth">
                          <el-col :span="12">
                              <el-form-item label='总共卡数' >
                                <span>{{detailInfo.devCardBoxInfo.allCardCount}}</span>
                              </el-form-item>
                          </el-col>
                          <!-- <el-col :span="12">
                              <el-form-item label='剩余卡数(暂无)' >
                                <span>xxxxxx</span>
                              </el-form-item>
                          </el-col>
                          <el-col :span="12">
                              <el-form-item label='上次加卡时间(暂无)' >
                                <span>xxxxxx</span>
                              </el-form-item>
                          </el-col>
                          <el-col :span="12">
                              <el-form-item label='吞卡数量(暂无)' >
                                <span>xxxxxx</span>
                              </el-form-item>
                          </el-col> -->
                        </el-form>
                    </el-row>
                    <el-row>
                      <el-collapse  accordion>
                        <el-collapse-item :title="'卡箱'+item.cardBoxNum" :name="key" v-for="(item,key) in detailInfo.devCardBoxInfo.devCardBoxInfoList" :key="key">
                          <el-row>
                            <el-form size="mini" :label-width="labelWidth">
                              <el-col :span="12">
                                  <el-form-item label='卡箱号' >
                                    <span>{{item.cardBoxNum}}</span>
                                  </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                  <el-form-item label='卡箱类型' >
                                    <span>{{item.cardBoxType}}</span>
                                  </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                  <el-form-item label='剩余卡数' >
                                    <span>{{item.cardCount}}</span>
                                  </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                  <el-form-item label='卡箱状态' >
                                    <span>{{item.cardBoxStatus}}</span>
                                  </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                  <el-form-item label='凭证种类代码' >
                                    <span>xxxxxx</span>
                                  </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                  <el-form-item label='成功发卡数量' >
                                    <span>xxxxxx</span>
                                  </el-form-item>
                              </el-col>
                            </el-form>
                          </el-row>
                          <div style="border-top: 1px solid #ddd;margin:0 0 14px 0;"></div>
                          <el-row>
                            <el-form size="mini" :label-width="labelWidth">
                              <!-- <el-col :span="12">
                                  <el-form-item label='上次上缴数量(暂无)' >
                                    <span></span>
                                  </el-form-item>
                              </el-col> -->
                              <el-col :span="12">
                                  <el-form-item label='上次加卡数量' >
                                    <span>{{item.lastAddCardCount}}</span>
                                  </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                  <el-form-item label='上次加卡柜员' >
                                    <span>{{item.lastAddCardTellerNo}}</span>
                                  </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                  <el-form-item label='上次加卡日期' >
                                    <span>{{item.lastAddCardDate}}</span>
                                  </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                  <el-form-item label='上次清机柜员' >
                                    <span>{{item.lastClearCardTellerNo}}</span>
                                  </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                  <el-form-item label='上次清机日期' >
                                    <span>{{item.lastClearCardDate}}</span>
                                  </el-form-item>
                              </el-col>
                            </el-form>
                          </el-row>
                        </el-collapse-item>
                      </el-collapse>
                    </el-row>
                </el-card>
              </el-col>
           </el-row>
         </el-col>
         <el-col :md="24" :lg="12">
          <el-row>
            <el-col  :span="24" class="marginTop10">
              <el-card>
                <div slot="header" >
                  <span>设备系统信息</span>
                </div>
                <el-row>
                  <el-form size="mini" :label-width="labelWidth">
                    <el-col :span="12">
                        <el-form-item label='操作系统' >
                          <span>{{detailInfo.devSystemInfo.operatingSystemName}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label='操作系统版本号' >
                          <span>{{detailInfo.devSystemInfo.operatingSystemVersion}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label='网络状态' >
                          <span>{{detailInfo.devSystemInfo.devConnectStatus}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label='IP地址' >
                          <span>{{detailInfo.devSystemInfo.devIp}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label='硬盘使用状态' >
                          <el-row>
                            <el-col :lg="18">
                              <el-progress :percentage="progressBar" :show-text="false"  style="margin: 11px 0;"></el-progress>
                            </el-col>
                            <el-col :lg="{span:5,offset:1}">
                              <span>{{(detailInfo.devSystemInfo.diskAllSpace-detailInfo.devSystemInfo.diskFreeSpace)||""}}KB/{{detailInfo.devSystemInfo.diskAllSpace}}KB</span>
                            </el-col>
                          </el-row>
                        </el-form-item>
                    </el-col>
                  </el-form>
                </el-row>
                <el-row>
                  <el-col style="display:flex;flex-flow:row nowarp;justify-content:center;">
                    <el-button type="primary" size="mini">系统重启</el-button>
                    <el-button type="primary" size="mini">系统关机</el-button>
                    <el-dropdown trigger="click" @command="openPop" style="margin:0 0 0 10px;">
                      <el-button type="primary" size="mini">更多<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                       <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command='' :disabled="true">远程截屏</el-dropdown-item>
                        <el-dropdown-item command='' :disabled="false">查看进程</el-dropdown-item>
                        <el-dropdown-item command='' :disabled="false">网络状态检测</el-dropdown-item>
                        <el-dropdown-item command='' :disabled="false">文件浏览</el-dropdown-item>
                       </el-dropdown-menu>
                     </el-dropdown>
                   </el-col>
                </el-row>
              </el-card>
            </el-col>
            <el-col :span="24" class="marginTop10">
              <el-card>
                  <div slot="header" >
                    <span>设备模块信息</span>
                    <el-button style="float: right;padding: 1px 0px 1px 10px;" type="text">强制复位</el-button>
                  </div>
                  <el-form size="mini">
                     <el-row>
                      <el-col :span="24" v-for="(item,key) in detailInfo.devModuleList" :key="key">
                        <el-form-item>
                          <el-col :span='5' ><span>{{item.devModule}}:</span></el-col>
                          <el-col :span='14' >
                            <span>{{item.devModuleStatus}}</span>
                          </el-col>
                          <el-col :span='5'>
                            <el-button type="text" size="mini" style="float:right;">启用禁用</el-button>
                          </el-col>
                        </el-form-item>
                      </el-col> 
                     </el-row>
                  </el-form>
              </el-card>
            </el-col>
            <el-col :span="24" class="marginTop10">
                <el-card>
                    <div slot="header" >
                      <span>设备钞箱信息</span>
                      <el-button style="float: right;padding: 1px 0px 1px 10px;" type="text">查看加卡记录</el-button>
                    </div>
                    <el-row>
                        <el-form size="mini" :label-width="labelWidth">
                          <el-col :span="12">
                              <el-form-item label='钞箱总金额' >
                                <span>{{detailInfo.devCashBoxInfo.cashBoxAllAmount}}</span>
                              </el-form-item>
                          </el-col>
                        </el-form>
                    </el-row>
                    <el-row>
                      <el-collapse  accordion>
                        <el-collapse-item :title="'钞箱'+item.cashBoxNum" :name="key" v-for="(item,key) in detailInfo.devCashBoxInfo.devCashBoxInfoList" :key="key">
                          <el-row>
                            <el-form size="mini" :label-width="labelWidth">
                              <el-col :span="12">
                                  <el-form-item label='钞箱号' >
                                    <span>{{item.cashBoxNum}}</span>
                                  </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                  <el-form-item label='钞箱类型' >
                                    <span>{{item.cashBoxType}}</span>
                                  </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                  <el-form-item label='钞箱状态' >
                                    <span>{{item.cashBoxStatus}}</span>
                                  </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                  <el-form-item label='现金面额' >
                                    <span>{{item.cashDenomination}}</span>
                                  </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                  <el-form-item label='现金数量' >
                                    <span>{{item.cashCount}}</span>
                                  </el-form-item>
                              </el-col>

                            </el-form>
                          </el-row>
                        </el-collapse-item>
                      </el-collapse>
                    </el-row>
                </el-card>
              </el-col>
          </el-row>
         </el-col>
       </el-row>

       <!-- <div class="returnBtn"><a  style="color:#409EFF" @click="isShow=false">返回</a> </div> -->
   </div>
</template>

<script>
export default { 
  data(){
    return{
       labelWidth:"120px",
       searchBarFixed:false,
       isEditClass:true,
       tableData5: [{
          id: '12987122',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }, {
          id: '12987123',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }, {
          id: '12987125',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }, {
          id: '12987126',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }]
    }
  },
  props:{option:Object,detailInfo:Object},
  methods:{
    openPop(type) {
      console.log(type);
    },
    handleScroll(){
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;      
        if(document.querySelector('#returnBtnTop')){
           var offsetTop = document.querySelector('#returnBtnTop').offsetTop  
            if(scrollTop>offsetTop){
                this.searchBarFixed = true
            }else{
              this.searchBarFixed = false
            }
        }
    }
  },
  computed:{
    isShow:{
        get:function(){
          return this.option.isShow;
        },
        set:function(newValue){
          this.option.isShow=newValue;
        }
    },
    progressBar(){
      if(this.detailInfo.devSystemInfo.diskFreeSpace){
        return (1-this.detailInfo.devSystemInfo.diskFreeSpace/this.detailInfo.devSystemInfo.diskAllSpace).toFixed(4)*100;
      }
      else{
        return 0
      }
    },      
  },
  mounted(){
    window.addEventListener('scroll',this.handleScroll);
  }
}
</script>

<style lang="scss" scoped>
    // .detailInfo{
    //   top:85px;
    //   background:#fff;
    // }
    .marginTop10{
      margin-top:10px; 
    }
    .returnBtn{
      width:50px;
      height:50px;
      background: #000;
      opacity: .5;
      position:fixed;
      right:45px;
      bottom:53px;
      border-radius: 3px;
      text-align: center;
      padding-top:15px;
    }
    .returnBtn:hover{
      opacity: .9;
    }
    #returnBtnTop{
      height:50px;
      background:#409EFF;
      width:100%;

    }
    .searchBarFixed{
      position: fixed;
      z-index: 1000;
      top:0;
      box-sizing: border-box;
    }
    .editClass{
      input.el-input__inner{
      border:none;
      background:rgba(0,0,0,0) !important;
      }  
   }
  
</style>
