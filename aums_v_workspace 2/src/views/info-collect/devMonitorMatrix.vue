<template>
  <div class="dev-monitor-matrix" v-loading="loading">
    <transition name="el-fade-in">
      <el-row v-show="!(dialogOptions.isShow||fileExploreOptions.isShow)">
        <!-- <transition name="el-fade-in"> -->
        <!-- <el-col :style="layoutLeft" style="transition:.3s;overflow:hidden;" >
        <el-row>
          <el-col :span="24" style="min-width:241px;">
            <el-card style="margin:0 0 10px 0;">
              <div slot="header">
                  <span>设备类型</span>
              </div>
              <ul class="devTypeUl">
                <li v-for="(item,index) in devType" :key="index"><span style="float:left">{{deviceTypeSpinner[item.devTypeNum].devType}}</span><span style="float:right;">{{item.deviceCount+" 台"}}</span><div style="clear:both;"></div></li>
              </ul>
            </el-card>
          </el-col>
          <el-col :span="24" style="min-width:241px;">
            <el-card style="margin:0 0 10px 0;">
              <div slot="header">
                  <span>设备运行状态</span>
              </div>
              <ul class="devStatuUl">
                <li v-for="(item,index) in devStatu" :key="index"   :style="'color:'+comDeviceRunStatuSpinner[item.devRunningStatus].devRunningStatusColor+';'"><span style="float:left">{{comDeviceRunStatuSpinner[item.devRunningStatus].devRunningStatusName}}</span><span style="float:right;">{{item.deviceCount+" 台"}}</span><div style="clear:both;"></div></li>
              </ul>
            </el-card>
          </el-col>
        </el-row>
      </el-col> -->
        <!-- </transition> -->
        <el-col :span="24" style="transition:.3s;">
          <el-row>
            <el-col :span="24">
              <el-card style="margin:0 0 0 10px;min-height:400px">
                <el-form ref='queryForm' :model='queryForm' size='mini' label-position="top">
                  <el-row :gutter="10">
                    <el-col :md="24" :lg="24" style="text-align:right;">
                      <el-popover placement="left-start" width="300" trigger="hover">
                        <ul class="devTypeUl">
                          <li v-for="(item,index) in devType" :key="index">
                            <span style="float:left">{{comDeviceType[item.devTypeNum].devType}}</span>
                            <span style="float:right;">{{item.deviceCount+" 台"}}</span>
                            <div style="clear:both;"></div>
                          </li>
                        </ul>
                        <el-button size="small" slot="reference" type="" :icon="'el-icon-view'"></el-button>
                      </el-popover>
                      <el-tooltip content="监控配置" placement="bottom-end">
                        <el-button size="small" type="" :icon="'el-icon-setting'" @click="openConfigPop" style="margin:0 0 0 10px;"></el-button>
                      </el-tooltip>
                      <el-tooltip content="全屏显示" placement="bottom-end">
                        <el-button size="small" type="" :icon="'el-icon-rank'" @click="showHugeScreen"></el-button>
                      </el-tooltip>
                      <el-tooltip :content="showMatrix?'列表模式':'矩阵模式'" placement="bottom-end">
                        <el-button size="small" type="" :icon="showMatrix?'el-icon-tickets':'el-icon-menu'" @click="devMatrixShowToggle"></el-button>
                      </el-tooltip>
                    </el-col>
                  </el-row>

                </el-form>
                <!-- <transition name="el-fade-in"> -->
                <matrix-panel :data="panelData" :dev-statu-data="devStatu" @clickAdd="matrixAdd" @clickDetail="matrixDetail" v-show="showMatrix"></matrix-panel>
                <!-- </transition> -->
                <!-- <transition name="el-fade-in"> -->
                <div v-show="!showMatrix" style="margin:10px 0 0">
                  <el-row>
                    <el-col :md="3" :lg="2">
                      <el-button type='primary' size='mini' @click="openPop('reboot')" :disabled="!(selectList.length==1)">系统重启</el-button>
                    </el-col>
                    <el-col :md="3" :lg="2">
                      <el-button type='primary' size='mini' @click="openPop('shut')" :disabled="!(selectList.length==1)">系统关机</el-button>
                    </el-col>
                    <el-col :md="3" :lg="2">
                      <el-button type='primary' size='mini' @click="openPop('restoreService')" :disabled="!(selectList.length>0)">服务恢复</el-button>
                    </el-col>
                    <el-col :md="3" :lg="2">
                      <el-button type='primary' size='mini' @click="openPop('pauseService')" :disabled="!(selectList.length>0)">服务暂停</el-button>
                    </el-col>
                    <el-col :md="3" :lg="2">
                      <el-dropdown trigger="click" @command="openPop">
                        <el-button size='mini' type="primary">更多操作
                          <i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item command='reset' :disabled="!(selectList.length==1)">强制复位</el-dropdown-item>
                          <el-dropdown-item command='parameterIssuance' :disabled="!(selectList.length==1)">参数下发</el-dropdown-item>
                          <el-dropdown-item command='remoteScreenShot' :disabled="!(selectList.length>0)">远程截屏</el-dropdown-item>
                          <el-dropdown-item command='logCatch' :disabled="!(selectList.length==1)">日志抓取</el-dropdown-item>
                          <el-dropdown-item command='viewProcess' :disabled="!(selectList.length==1)">查看进程</el-dropdown-item>
                          <el-dropdown-item command='netStatu' :disabled="!(selectList.length==1)">网络状态</el-dropdown-item>
                          <el-dropdown-item command='modelStatu' :disabled="!(selectList.length==1)">模块状态</el-dropdown-item>
                          <el-dropdown-item command='fileExplore' :disabled="!(selectList.length==1)">文件浏览</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </el-col>
                  </el-row>
                  <el-table ref="panelDataTable" :data='panelDataTable' header-row-class-name="tableHeaderClass" @selection-change="tableCheckBoxChange" class="tableMarginTop" border>
                    <el-table-column type='selection' width="40" fixed></el-table-column>
                    <!-- <el-table-column prop='devid' label='设备ID' fixed></el-table-column> -->
                    <el-table-column prop='devNum' label='设备编号'></el-table-column>
                    <!-- <el-table-column prop='branchId' label='机构ID'></el-table-column> -->
                    <el-table-column prop='devTypeNum' label='设备类型' :formatter="formatterDevType"></el-table-column>
                    <el-table-column prop='devState' label='设备状态' :formatter="formatterDevState"></el-table-column>
                    <el-table-column prop='devRunningStatus' label='设备运行状态' :formatter="formatterDevRunStatu"></el-table-column>
                    <el-table-column prop='devConnectStatus' label='设备通讯状态' :formatter="formatterConnStatu"></el-table-column>
                    <el-table-column prop='devModuleStatus' label='设备模块状态' :formatter="formatterModulStatu"></el-table-column>
                    <el-table-column prop='devCardBoxStatus' label='设备卡箱状态' :formatter="formatterCardboxStatu"></el-table-column>
                    <el-table-column prop='devCashBoxStatus' label='设备钞箱状态' :formatter="formatterCahsboxStatu"></el-table-column>
                    <el-table-column label='操作' align="center" fixed="right" width="80">
                      <template slot-scope="scope">
                        <el-button size="mini" type="text" @click="matrixDetail(scope.row,panelDataTable)">查看详情</el-button>
                      </template>
                    </el-table-column>

                    <!-- <el-table-column prop='devTypeId' label='设备编号' min-width='107px' fixed></el-table-column>
                                <el-table-column prop='devbrno' label='机构编号' min-width='107px'></el-table-column>
                                <el-table-column prop='devTypeSort' label='设备分类' min-width='107px'></el-table-column>
                                <el-table-column prop='devtype' label='设备类型' min-width='107px'></el-table-column>
                                <el-table-column prop='devName' label='设备名称' min-width='107px'></el-table-column>
                                <el-table-column prop='brandType' label='品牌型号' min-width='107px'></el-table-column>
                                <el-table-column prop='facturer' label='厂商' min-width='107px'></el-table-column>
                                <el-table-column prop='devTellerName' label='设备维护柜员名称' min-width='147px'></el-table-column>
                                <el-table-column prop='devTellerPhone' label='设备维护柜员手机号' min-width='147px'></el-table-column>
                                <el-table-column prop='devStartWorkTime' label='设备开始营业时间' min-width='147px'></el-table-column>
                                <el-table-column prop='devEndWorkTime' label='设备结束营业时间' min-width='147px'></el-table-column>
                                <el-table-column prop='devStartTime' label='设备开机时间' min-width='147px'></el-table-column>
                                <el-table-column prop='devEndTime' label='设备开机时间' min-width='147px'></el-table-column> -->
                  </el-table>
                  <div class="box" style="text-align:right;margin-top: 10px;">
                    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="sizes, total, prev, pager, next, jumper" :total="panelData.length">
                      <!-- total这里需要修改 -->
                    </el-pagination>
                  </div>
                </div>
                <!-- </transition> -->
              </el-card>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </transition>

    <!-- 其他页面 -->
    <keep-alive>
      <transition name="el-fade-in">
        <component :is='dialogList.devRunDetailInfo' :option='dialogOptions' :detail-info="devDetailInfo" :selected-obj="detailSelectedObj"></component>
      </transition>
    </keep-alive>
    <transition name="el-fade-in">
      <component :is='dialogList.fileExplore' :option='fileExploreOptions' :dev-obj="selectedObj[0]"></component>
    </transition>
    <!-- 配置页弹窗 -->
    <el-dialog title="监控配置" :visible.sync="configPopStatu" :lock-scroll=false width="600px">
      <el-card>
        <el-form ref='queryFormConfig' :model='queryFormConfig' size='mini' label-position="top">
          <el-row :gutter="10">
            <el-col :md="24">
              <h4>筛选配置</h4>
            </el-col>
            <el-col :md="7" :lg="12">
              <el-form-item label='机构编号' prop='branchId'>
                <select-tree ref="tree" v-model="queryFormConfig.branchId" :props='{id:"branchId",label: "branchName",children: "childBranch"}' :tree-data="branchSpinner"></select-tree>
              </el-form-item>
            </el-col>
            <el-col :md="7" :lg="12">
              <el-form-item label='设备类型' prop='devType'>
                <el-cascader v-model='queryFormConfig.devType' :props="{value: 'devTypeNum',label: 'devType'}" placeholder="---请选择---" :options='deviceTypeSpinner'></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :md="7" :lg="12">
              <el-form-item label='设备状态' prop='devStatu'>
                <el-cascader v-model='queryFormConfig.devStatu' :props="{value: 'devState',label: 'devStateName'}" placeholder="---请选择---" :options='deviceStatuSpinner'></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :md="7" :lg="12">
              <el-form-item label='设备运行状态' prop='devRunStatu'>
                <el-cascader v-model='queryFormConfig.devRunStatu' :props="{value: 'devRunningStatus',label: 'devRunningStatusName'}" placeholder="---请选择---" :options='deviceRunStatuSpinner'></el-cascader>
              </el-form-item>
            </el-col>
          </el-row>
          <div style="border-top: 1px solid #ebeef5;margin:15px 22px 12px;"></div>
          <el-row>
            <el-col :md="24">
              <h4>轮询配置</h4>
            </el-col>
            <el-col :md="7" :lg="12">
              <el-form ref='timeForm' :model='timeForm' size='mini' label-position="top">
                <el-form-item label='轮询间隔（秒）' prop='queryTimeSpaceConfig' :rules="[
                                { required: true, message: '间隔不可为空且必须为数字'},
                                { validator: this.timeSpaceVali},
                                { type: 'number', message: '请输入数字'}
                              ]">
                  <el-input type="number" v-model.number="timeForm.queryTimeSpaceConfig" placeholder="请输入轮询间隔"></el-input>
                  <span style="color:red;font-size:12px;">间隔过短会导致服务器压力过大，请谨慎配置</span>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="configPopStatu=false" size="mini">取 消</el-button>
        <el-button type="primary" @click="submitConfig('timeForm')" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 远程管理弹窗 -->
    <el-dialog title="权限验证" :visible.sync="confirmPopStatu" :lock-scroll=false width="450px">
      <el-card>
        <el-row>
          <!-- <el-col :md="24" :lg="{span:12,offset:6}"> -->
          <el-col>
            <el-form :model="confirmPopform" label-width="140px" size="mini">
              <el-form-item label="授权人用户名" prop='user'>
                <el-input v-model="confirmPopform.username" auto-complete="off" placeholder="请输入用户名"></el-input>
              </el-form-item>
              <el-form-item label="授权人密码" prop='password'>
                <el-input v-model="confirmPopform.password" auto-complete="off" type="password" placeholder="请输入密码"></el-input>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-card>

      <div slot="footer" class="dialog-footer">
        <el-button @click="confirmPopStatu = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="allPopSubmit" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog width="450px" :lock-scroll=false title="服务启停结果" :visible.sync="startPausePop">
      <el-table ref="" :data='startPauseTableData' header-row-class-name="tableHeaderClass" class="tableMarginTop" border>
        <el-table-column prop='devNum' label='设备编号' min-width="100px"></el-table-column>
        <el-table-column prop='returnMessage' label='执行结果' min-width="200px"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="startPausePop=false" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="强制复位" :visible.sync="resetPopStatu" :lock-scroll=false width="450px">
      <el-card>
        <el-row>
          <!-- <el-col :md="24" :lg="{span:12,offset:6}"> -->
          <el-col>
            <el-form :model="resetPopform" size="mini" label-width="100px">
              <el-form-item label="模块" prop='modelId'>
                <el-cascader v-model='resetPopform.modelId' placeholder="请选择复位模块" :options='resetPopOptions' :props="{value:'modelId',label:'modelLabel'}"></el-cascader>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetPopStatu = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="allPopSubmit" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="参数下发" @close="closeParameterPop" :visible.sync="parameterIssuancePopStatu" :lock-scroll=false width="500px">
      <el-card>
        <el-row>
          <el-col>
            <el-form :model="parameterIssuancePopform" ref="parameterIssuancePopform" label-width="180px" size="mini">
              <el-form-item label="单次取现金额（元）" prop='amount' v-show="false">
                <el-input v-model="parameterIssuancePopform.amount" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="无操作超时时间（秒）" prop='timeout' :rules="[
                { required: true, message: '此项必填且必须为数字'},
                { type: 'number', message: '必须为数字'}
              ]">
                <el-input type="number" v-model.number="parameterIssuancePopform.timeout" auto-complete="off"></el-input>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeParameterPop" size="mini">取 消</el-button>
        <el-button type="primary" @click="allPopSubmit" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="日志抓取" :visible.sync="logCatchPopStatu" :lock-scroll=false width="450px">
      <el-card>
        <el-row>
          <el-col>
            <el-form :model="logCatchPopform" label-width="100px" size="mini">
              <el-form-item label="选择抓取天数" prop='catchDays'>
                <el-cascader v-model='logCatchPopform.days' :options='logCatchPopOptions' :props="{value:'days',label:'daysLabel'}"></el-cascader>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="logCatchPopStatu = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="allPopSubmit" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="查看进程" :visible.sync="viewProcessPopStatu" :lock-scroll=false width="800px">
      <el-card style="max-height: 400px;overflow: scroll;">
        <el-table ref="viewProcessTableData" :data='viewProcessTableData' header-row-class-name="tableHeaderClass" class="tableMarginTop" border>
          <el-table-column prop='映像名称' label='映像名称' min-width="200px"></el-table-column>
          <el-table-column prop='PID' label='PID' min-width="80px"></el-table-column>
          <el-table-column prop='会话名' label='会话名' min-width="100px"></el-table-column>
          <el-table-column prop='会话' label='会话#' min-width="60px"></el-table-column>
          <el-table-column prop='内存使用' label='内存使用' min-width="160px"></el-table-column>
        </el-table>
        <!-- <div class="box">
              <el-pagination background
                  :current-page.sync="viewProcessCurrentPage"
                  :page-sizes="[10, 20, 50,100]"
                  :page-size="10"
                  layout="sizes, total, prev, pager, next, jumper"
                  :total="viewProcessTableDataTotal"> 
              </el-pagination>
           </div> -->
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="viewProcessPopStatu = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="allPopSubmit" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="模块状态" :visible.sync="modelStatuPopStatu" :lock-scroll=false width="580px">
      <el-card>
        <el-table ref="modelStatuTableData" :data='modelStatuTableData' header-row-class-name="tableHeaderClass" class="tableMarginTop" border>
          <el-table-column prop='modelLabel' label='设备模块'></el-table-column>
          <el-table-column prop='modelStatu' label='模块状态'></el-table-column>
        </el-table>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modelStatuPopStatu = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="allPopSubmit" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="远端截屏结果" :visible.sync="remoteScreenShotPopStatu" :lock-scroll=false width="450px" @close="dialogDetailClose">
      <!-- <el-card> -->
      <!-- 这里先有table -->
      <el-table ref="screenShotTable" :data='screenShotTableData' header-row-class-name="tableHeaderClass" class="tableMarginTop" border>
        <el-table-column prop='devNum' label='设备编号' min-width="200px"></el-table-column>
        <el-table-column prop='returnCode' label='截屏结果' min-width="100px" :formatter="function(row){return row.returnCode=='true'?'成功':'失败'}"></el-table-column>
        <el-table-column label='操作' min-width="80px">
          <template slot-scope="scope">
            <el-button size="mini" type="text" v-if="scope.row.returnCode=='true'" @click="showScreenShot(scope.row)">查看图片</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 嵌套dialog中有下面一坨 -->
      <el-dialog width="90%" title="查看截屏图片" :visible.sync="screenShotPicStatu" append-to-body>
        <div v-loading="loadingImg" style="text-align:center;">
          <h4 v-if="loadingImgError">截屏图片加载失败</h4>
          <img style="width:100%;min-height:200px;position:relative;" :src="dialogImageUrl" alt="" @load="loadingImg=false" @error="loadingImgFalse">
        </div>
      </el-dialog>
      <!-- </el-card> -->
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="remoteScreenShotPopStatu = false" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="网络状态" :visible.sync="netStatuPopStatu" :lock-scroll=false width="450px">
      <el-card>
        {{netStatuShowStr}}
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="netStatuPopStatu = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="allPopSubmit" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <transition name="el-fade-in">
      <div v-if="hugeScreenPopStatu" class="hugeScreenCtn" v-loading="loadingHuge">
        <el-row>
          <el-col :lg="24">
            <el-button type="primary" @click="hugeScreenPopStatu=false" size="mini">返 回</el-button>
          </el-col>
          <el-col :lg="24">
            <matrix-panel :data="panelData" :dev-statu-data="devStatu"></matrix-panel>
          </el-col>
        </el-row>
      </div>
    </transition>
  </div>
</template>

<script>
import request from "@/utils/request";
import spinnerList from "@/message/spinnerDataQuery/spinner-data-query";
import monitorListIns from "@/message/infoCollect/devMonitor/monitor-list-query";
import devDetailIns from "@/message/infoCollect/devMonitor/dev-detail";
import authorazitionIns from "@/message/infoCollect/devMonitor/dev-authorazition";
import getGlobalParams from "@/utils/getGlobalParams";
//远程管理功能实体类
import logCatchIns from "@/message/infoCollect/devMonitor/dev-control-logCatch";
import checkProgressIns from "@/message/infoCollect/devMonitor/dev-control-checkProcess";
import rebootIns from "@/message/infoCollect/devMonitor/dev-control-reboot";
import checkNetStatuIns from "@/message/infoCollect/devMonitor/dev-control-checkNetStatu";
import screenShotIns from "@/message/infoCollect/devMonitor/dev-control-screenshot";
import shutdevIns from "@/message/infoCollect/devMonitor/dev-control-shutDown";
import srvRestoreIns from "@/message/infoCollect/devMonitor/dev-control-forceReset";
import paramsDropIns from "@/message/infoCollect/devMonitor/dev-control-parameDrop";
import srvStartPauseIns from "@/message/infoCollect/devMonitor/dev-control-srvStartPause";
import getModulesIns from "@/message/infoCollect/devMonitor/dev-control-getModules";
import modulesIns from "@/message/infoCollect/devMonitor/dev-control-checkModulStatu";

import md5 from "js-md5";
import toolBox from "@/utils/toolBox";
import matrixPanel from "@/components/matrixPanel";
import lineCharts from "v-charts/lib/line";
import selectTree from "@/components/selectTree2/";
import devRunDetailInfo from "./dialog/devRunDetailInfo";
import fileExplore from "./dialog/fileExplorePage";

export default {
  name: "dev-monitor-matrix",
  data() {
    return {
      //轮询设置
      queryTimeout: {},
      queryTimeSpace: 120000, //2分钟
      //页面公用
      loading: false,
      //输入场
      devBrandInfoSpinner: [],
      deviceTypeSpinner: [],
      branchSpinner: [],

      deviceStatuSpinner: [],
      comDeviceStatuSpinner: [],
      deviceRunStatuSpinner: [],
      comDeviceRunStatuSpinner: [],
      comDeviceType: [],
      comConnStatu: [],
      comModulStatu: [],
      comCardboxStatu: [],
      comCahsboxStatu: [],

      queryForm: {
        branchId: [],
        devType: [],
        devStatu: [],
        devRunStatu: []
      },
      queryFormConfig: {},
      timeForm: {
        queryTimeSpaceConfig: 0
      },
      //右侧matrix和列表
      showMatrix: true,
      panelData: [
        // {
        //   devid: "1",
        //   devNum: "8947513",
        //   branchId: "111",
        //   devTypeNum: "2",
        //   devRunningStatus: "1",
        //   devConnectStatus: "1",
        //   devModuleStatus: "1",
        //   devCardBoxStatus: "1",
        //   devCashBoxStatus: "1"
        // }
      ],
      panelDataTable: [],
      selectList: [],
      // panelData: [
      //   {
      //     devTypeId: "1",//devid
      //                   //devNum
      //     devbrno: "010001",//branchId
      //     devTypeSort: "自助机",
      //     devtype: "1",//devTypeNum
      //     devName: "STM设备-001",
      //     brandType: "vkb-4320",
      //     facturer: "永新",
      //     devTellerName: "张静",
      //     devTellerPhone: "1314***6360",
      //     devStartWorkTime: "9:00",
      //     devEndWorkTime: "18:00",
      //     devStartTime: "8:30",
      //     devEndTime: "18:30",
      //     statu: "0",//devRunningStatus
      //                 //devConnectStatus
      //                 //devModuleStatus
      //                 //devCardBoxStatus
      //                 //devCashBoxStatus
      //     statuName: "正常"
      //   }
      // ],
      total: 0,
      pageSize: getGlobalParams.get("PageSize"),
      currentPage: 1,
      //左侧设备类型
      devType: [],
      //左侧设备状态
      devStatu: [],
      chartSettings: {},
      //弹窗相关
      detailSelectedObj: [],
      startPauseTableData: [],
      startPausePop: false,
      screenShotPicStatu: false,
      screenShotTableData: [],
      netStatuShowStr: "",
      loadingImg: false,
      loadingImgError: false,
      dialogImageUrl: "",
      hugeScreenPopStatu: false,
      configPopStatu: false,
      devDetailInfo: {},
      viewProcessTableDataTotal: 0,
      dialogList: {
        devRunDetailInfo: devRunDetailInfo,
        fileExplore: fileExplore
      },
      dialogOptions: { isShow: false },
      fileExploreOptions: { isShow: false },
      selectedObj: [],
      PopType: "",
      confirmPopStatu: false,
      confirmPopform: {
        username: "",
        password: ""
      },
      resetPopStatu: false,
      resetPopOptions: [],
      resetPopform: {
        modelId: []
      },
      parameterIssuancePopStatu: false,
      parameterIssuancePopform: {
        amount: "",
        timeout: ""
      },
      remoteScreenShotPopStatu: false,
      logCatchPopStatu: false,
      logCatchPopOptions: [
        { days: 1, daysLabel: "1天" },
        { days: 2, daysLabel: "2天" },
        { days: 3, daysLabel: "3天" },
        { days: 4, daysLabel: "4天" },
        { days: 5, daysLabel: "5天" },
        { days: 6, daysLabel: "6天" }
      ],
      logCatchPopform: {
        days: [1]
      },
      viewProcessPopStatu: false,
      viewProcessTableData: [],
      viewProcessCurrentPage: 1,

      netStatuPopStatu: false,
      modelStatuPopStatu: false,
      modelStatuTableData: []
    };
  },
  methods: {
    loadingImgFalse() {
      this.loadingImg = false;
      this.loadingImgError = true;
    },
    dialogDetailClose() {
      this.dialogImageUrl = "";
    },
    //配置项确认
    submitConfig(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.configQuery();
        } else {
          this.$message({
            type: "warning",
            message: "请按条件输入"
          });
          return false;
        }
      });
    },
    //输入轮询时间验证
    timeSpaceVali(rule, value, callback) {
      if (this.timeForm.queryTimeSpaceConfig * 1 > 1200000) {
        callback("间隔时间不得大于20分钟");
      } else if (this.timeForm.queryTimeSpaceConfig * 1 < 0) {
        callback("间隔时间不得为负");
      } else {
        callback();
      }
    },
    //打开巨幕显示
    showHugeScreen() {
      this.hugeScreenPopStatu = true;
    },
    //打开设备监控配置方法
    openConfigPop() {
      this.queryFormConfig = JSON.parse(JSON.stringify(this.queryForm));
      // console.log(this.queryFormConfig);
      this.timeForm.queryTimeSpaceConfig = Number(
        (this.queryTimeSpace / 1000).toFixed(2)
      );
      this.configPopStatu = true;
    },
    //确认配置
    async configQuery() {
      //确定后进行一次查询
      this.configPopStatu = false;
      this.queryForm = JSON.parse(JSON.stringify(this.queryFormConfig));
      this.queryTimeSpace = this.timeForm.queryTimeSpaceConfig * 1000;
      this.loading = true;
      await this.queryModel();
      this.loading = false;
    },
    //切换矩阵与列表模式功能
    devMatrixShowToggle() {
      //更新状态并且要刷新selectlist数组来开启轮询
      this.showMatrix = !this.showMatrix;
      this.$refs.panelDataTable.clearSelection();
      this.selectList = [];
    },
    //表格格式化
    formatterDevType(row, column) {
      return this.comDeviceType[row[column.property]].devType;
    },
    formatterDevState(row, column) {
      return this.comDeviceStatuSpinner[row[column.property]].devStateName;
    },
    formatterDevRunStatu(row, column) {
      return this.comDeviceRunStatuSpinner[row[column.property]]
        .devRunningStatusName;
    },
    formatterConnStatu(row, column) {
      var tempValue = row[column.property];

      return tempValue == "x"
        ? "未知"
        : this.comConnStatu[tempValue].devConnectStatusName;
    },
    formatterModulStatu(row, column) {
      var tempValue = row[column.property];

      return tempValue == "x"
        ? "未知"
        : this.comModulStatu[tempValue].devModuleStatusName;
    },
    formatterCardboxStatu(row, column) {
      var tempValue = row[column.property];

      return tempValue == "x"
        ? "未知"
        : this.comCardboxStatu[tempValue].devCardBoxStatusName;
    },
    formatterCahsboxStatu(row, column) {
      var tempValue = row[column.property];

      return tempValue == "x"
        ? "未知"
        : this.comCahsboxStatu[tempValue].devCashBoxStatusName;
    },
    //下面这个是轮询外壳以便递归来规避网络缓慢带来的阻塞风险
    //在请求外层使用页签和当前显示页面名称和此页面名称来做判断
    polling(ifQuery, ifLoop) {
      var vueIns = this;
      if (ifLoop) {
        this.queryTimeout = setTimeout(function() {
          var tagsArr = vueIns.$store.state.tagsView.cachedViews;
          var currentPageName = vueIns.$router.currentRoute.name;
          var thisPageName = vueIns.$options.name;
          if (tagsArr.indexOf(thisPageName) + 1) {
            //先判断标记
            if (vueIns.pollingPause) {
              vueIns.polling(false, true);
            } else if (currentPageName == thisPageName) {
              //在页签中且是当前页时发送
              ifQuery && vueIns.queryModel();
              vueIns.polling(true, true);
            } else if (currentPageName != thisPageName) {
              //在页签中有但不是当前页时 或暂停字段为true时 暂停发送请求
              ifQuery && vueIns.queryModel();
              vueIns.polling(false, true);
            } else {
              //未知情况下停止
              clearTimeout(vueIns.queryTimeout);
              vueIns.polling(false, false);
            }
          } else {
            //不在页签中时直接关闭
            clearTimeout(vueIns.queryTimeout); //其实不用这步
            vueIns.polling(false, false);
          }
        }, vueIns.queryTimeSpace);
      }
    },
    //发送请求
    async queryModel() {
      //轮询没有loading
      // this.loading = true;
      let resBody = new monitorListIns();

      resBody.data.branchIdList = this.queryForm.branchId; //机构ID列表
      resBody.data.devTypeNum = this.queryForm.devType.join(","); //设备类型编号
      resBody.data.devRunningStatus = this.queryForm.devRunStatu.join(","); //设备运行状态
      resBody.data.devState = this.queryForm.devStatu.join(","); //设备状态

      resBody.QueryPageNo = this.currentPage;
      resBody.QueryRowNum = this.pageSize;

      let response = await request(resBody);
      // this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        this.devType = response.RSP_BODY.devTypeStatisticsObject; //设备分类统计
        this.devStatu = response.RSP_BODY.devRunningStatusStatisticsObject; //设备运行状态统计
        this.panelData = response.RSP_BODY.devMonitorInfoList; //设备监控列表（矩阵）
        this.panelDataTable = response.RSP_BODY.devMonitorInfoList; //设备监控列表

        // this.changeAndShowPage();
      } else {
        this.$message({
          type: "error",
          message:
            "请求失败，错误码:" +
            response.SYS_HEAD.ReturnCode +
            "，错误信息：" +
            response.SYS_HEAD.ReturnMessage
        });
      }
    },
    //前端分页中的切换页面
    // changeAndShowPage(){
    //   var currentItem = (this.currentPage - 1) * this.pageSize + 1;
    //     var tempArr = [];
    //     for (var i = currentItem - 1;i < currentItem - 1 + this.pageSize;i++) {
    //       if(this.panelData[i]){
    //         tempArr.push(this.panelData[i]);
    //       }
    //       else{
    //         break;
    //       }
    //     }
    //     // console.log(tempArr);
    //     this.panelDataTable = tempArr;
    // },
    tableCheckBoxChange(val) {
      this.selectList = val;
    },
    matrixAdd() {
      this.panelData.push({
        devTypeId: "1",
        devbrno: "010001",
        devTypeSort: "自助机",
        devtype: "1",
        devName: "STM设备-001",
        brandType: "vkb-4320",
        facturer: "永新",
        devTellerName: "张静",
        devTellerPhone: "1314***6360",
        devStartWorkTime: "9:00",
        devEndWorkTime: "18:00",
        devStartTime: "8:30",
        devEndTime: "18:30",
        statu: "0",
        statuName: "正常"
      });
    },
    //弹窗相关功能
    //所有弹窗的确认功能
    openPop(type) {
      this.selectedObj = this.selectList;
      this.PopType = type;
      if (
        this.PopType == "reboot" ||
        this.PopType == "shut" ||
        this.PopType == "restoreService" ||
        this.PopType == "pauseService"
      ) {
        this.confirmPopStatu = true;
      } else if (this.PopType == "reset") {
        this.getModules();
      } else if (this.PopType == "parameterIssuance") {
        this.parameterIssuancePopStatu = true;
      } else if (this.PopType == "remoteScreenShot") {
        this.screenShot();
      } else if (this.PopType == "logCatch") {
        this.logCatchPopStatu = true;
      } else if (this.PopType == "viewProcess") {
        this.checkProgress();
      } else if (this.PopType == "netStatu") {
        this.netStatu();
      } else if (this.PopType == "modelStatu") {
        this.modulStatu();
      } else if (this.PopType == "fileExplore") {
        // let ip = "192.168.193.158";
        // 将ip存放在sessionstorage中以便下次进入时保持一致
        //在这个页面当时为单独页面的时候用router控制
        // this.$router.push({
        //   path: "/hide/fileExplore",
        //   name: "fileExplore",
        //   params: {
        //     // name: 'fileExplore',
        //     // dataObj: {'ip':ip}
        //   }
        //   /*query: {
        //             name: 'name',
        //             dataObj: this.msg
        //         }*/
        // });
        // 直接用sessionstorage传不就好了
        // console.log(ip);
        // window.sessionStorage.currentIp = ip;
        this.fileExploreOptions.isShow = true;
      }
    },
    allPopSubmit() {
      if (this.PopType == "reboot") {
        var devNum = this.selectedObj[0].devNum;
        this.checkUser("确定重启机具" + devNum + "吗？", this.reboot);
      } else if (this.PopType == "shut") {
        var devNum = this.selectedObj[0].devNum;
        this.checkUser("关闭" + devNum + "吗？", this.devShut);
      } else if (this.PopType == "restoreService") {
        //复选
        var devNum = this.selectedObj[0].devNum;
        this.checkUser("确定重置" + devNum + "的服务吗？", this.srvRestore);
      } else if (this.PopType == "pauseService") {
        //复选
        var devNum = this.selectedObj[0].devNum;
        this.checkUser("确定暂停" + devNum + "的服务吗？", this.srvPause);
      } else if (this.PopType == "reset") {
        this.forceReset();
      } else if (this.PopType == "parameterIssuance") {
        //下发参数这里需要校验
        this.$refs['parameterIssuancePopform'].validate(valid => {
          if (valid) {
            this.paramsDrop();
          } else {
            return false;
          }
        });
      } else if (this.PopType == "remoteScreenShot") {
        //复选
        // this.screenShot();
      } else if (this.PopType == "logCatch") {
        this.logCatchPopStatu = false;
        this.logCatch();
      } else if (this.PopType == "viewProcess") {
        //已显示内容 直接关闭窗口
        this.viewProcessPopStatu = false;
      } else if (this.PopType == "netStatu") {
        //已显示内容 直接关闭窗口
        this.netStatuPopStatu = false;
      } else if (this.PopType == "modelStatu") {
        //已显示内容 直接关闭窗口
        this.modelStatuPopStatu = false;
      }
    },
    matrixDetail(row, table) {
      // console.log(row);
      // var id=row.devId;
      this.checkDevDetail(row);
    },
    handleSizeChange(val) { this.pageSize=val;
      this.queryModel();
    },
    handleCurrentChange() {
      this.queryModel();
      // this.changeAndShowPage();
    },
    closeParameterPop(){
      this.parameterIssuancePopStatu = false;
      this.$refs["parameterIssuancePopform"].clearValidate();
      this.$refs["parameterIssuancePopform"].resetFields();
    },
    //授权方法
    async checkUser(showStr, callback) {
      this.loading = true;
      let resBody = new authorazitionIns();
      resBody.data.checkUserID = sessionStorage.userId;
      resBody.data.authUserName = this.confirmPopform.username.trim();
      resBody.data.userPwd = md5(this.confirmPopform.password).toUpperCase();
      this.confirmPopStatu = false;
      let response = await request(resBody);
      this.loading = false;
      this.confirmPopform = {
        username: "",
        password: ""
      };
      if (response.SYS_HEAD.ReturnCode == "000000") {
        this.$message({
          type: "success",
          message: "验证成功"
        });
        this.$confirm(showStr, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            //执行callback
            if (callback) {
              callback();
            }
          })
          .catch(() => {
            //取消
            this.$message({
              type: "info",
              message: "已取消"
            });
          });
      } else {
        //通讯失败
        this.$message({
          type: "error",
          message:
            "请求失败，错误码:" +
            response.SYS_HEAD.ReturnCode +
            "，错误信息：" +
            response.SYS_HEAD.ReturnMessage
        });
      }
    },
    //查看详情功能
    async checkDevDetail(row) {
      this.detailSelectedObj = [row];
      this.loading = true;
      let resBody = new devDetailIns();
      resBody.data.devId = row.devId;
      let response = await request(resBody);
      this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        // if (true) {
        this.devDetailInfo = response.RSP_BODY;
        this.dialogOptions.isShow = true;
        // console.log(this.devDetailInfo);
      } else {
        this.$message({
          type: "error",
          message:
            "请求失败，错误码:" +
            response.SYS_HEAD.ReturnCode +
            "，错误信息：" +
            response.SYS_HEAD.ReturnMessage
        });
      }
    },
    //以下为控制机具的功能
    async reboot() {
      //已有服务
      this.loading = true;
      let resBody = new rebootIns();
      resBody.data.clientIp = this.selectedObj[0].devIp;
      resBody.data.delaySecond = 10;
      // resBody.QueryPageNo = this.viewProcessCurrentPage;
      // resBody.QueryRowNum = this.pageSize;
      let response = await request(resBody);

      this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        this.$message({
          type: "success",
          message: "重启成功"
        });
      } else {
        this.$message({
          type: "error",
          message:
            "请求失败，错误码:" +
            response.SYS_HEAD.ReturnCode +
            "，错误信息：" +
            response.SYS_HEAD.ReturnMessage
        });
      }
    },
    async devShut() {
      //已有服务
      this.loading = true;
      let resBody = new shutdevIns();
      resBody.data.clientIp = this.selectedObj[0].devIp;
      resBody.data.delaySecond = 10;
      // resBody.QueryPageNo = this.viewProcessCurrentPage;
      // resBody.QueryRowNum = this.pageSize;
      let response = await request(resBody);

      this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        this.$message({
          type: "success",
          message: "关机成功"
        });
      } else {
        this.$message({
          type: "error",
          message:
            "请求失败，错误码:" +
            response.SYS_HEAD.ReturnCode +
            "，错误信息：" +
            response.SYS_HEAD.ReturnMessage
        });
      }
    },
    async srvRestore() {
      //已有服务//复选
      this.loading = true;
      let resBody = new srvStartPauseIns();
      var temp = [];
      this.selectedObj.map(function(x) {
        temp.push(x.devNum);
      });
      resBody.data.devNumList = temp;
      resBody.data.devOperate = "Start"; //操作种类 开始/暂停
      // resBody.QueryPageNo = this.viewProcessCurrentPage;
      // resBody.QueryRowNum = this.pageSize;
      let response = await request(resBody);

      this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        this.startPauseTableData = response.RSP_BODY.operateResult;
        this.startPausePop = true;
        // this.$message({
        //   type: "success",
        //   message: "服务恢复成功"
        // });
      } else {
        this.$message({
          type: "error",
          message:
            "请求失败，错误码:" +
            response.SYS_HEAD.ReturnCode +
            "，错误信息：" +
            response.SYS_HEAD.ReturnMessage
        });
      }
    },
    async srvPause() {
      //已有服务//复选
      this.loading = true;
      let resBody = new srvStartPauseIns();
      var temp = [];
      this.selectedObj.map(function(x) {
        temp.push(x.devNum);
      });
      resBody.data.devNumList = temp;
      resBody.data.devOperate = "Pause"; //操作种类 开始/暂停
      // resBody.QueryPageNo = this.viewProcessCurrentPage;
      // resBody.QueryRowNum = this.pageSize;
      let response = await request(resBody);

      this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        this.startPauseTableData = response.RSP_BODY.operateResult;
        this.startPausePop = true;
        // this.$message({
        //   type: "success",
        //   message: "服务暂停成功"
        // });
      } else {
        this.$message({
          type: "error",
          message:
            "请求失败，错误码:" +
            response.SYS_HEAD.ReturnCode +
            "，错误信息：" +
            response.SYS_HEAD.ReturnMessage
        });
      }
    },
    async forceReset() {
      //已有服务
      this.resetPopStatu = false;
      this.loading = true;
      let resBody = new srvRestoreIns();
      resBody.data.clientIp = this.selectedObj[0].devIp;
      resBody.data.devModuleNum = this.resetPopform.modelId.join(","); //服务名称
      // resBody.QueryPageNo = this.viewProcessCurrentPage;
      // resBody.QueryRowNum = this.pageSize;
      let response = await request(resBody);

      this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        this.$message({
          type: "success",
          message: "强制复位成功"
        });
        this.resetPopStatu = false;
      } else {
        this.$message({
          type: "error",
          message:
            "请求失败，错误码:" +
            response.SYS_HEAD.ReturnCode +
            "，错误信息：" +
            response.SYS_HEAD.ReturnMessage
        });
      }
    },
    async paramsDrop() {
      //已有服务
      this.parameterIssuancePopStatu = false;
      this.loading = true;
      let resBody = new paramsDropIns();
      resBody.data.clientIp = this.selectedObj[0].devIp;
      resBody.data.singleLimit = this.parameterIssuancePopform.amount; //单次取现金额
      resBody.data.tradeOuttime = this.parameterIssuancePopform.timeout; //无操作超时时间
      // resBody.QueryPageNo = this.viewProcessCurrentPage;
      // resBody.QueryRowNum = this.pageSize;
      let response = await request(resBody);

      this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        this.$message({
          type: "success",
          message: "参数下发成功"
        });
      } else {
        this.$message({
          type: "error",
          message:
            "请求失败，错误码:" +
            response.SYS_HEAD.ReturnCode +
            "，错误信息：" +
            response.SYS_HEAD.ReturnMessage
        });
      }
    },
    async screenShot() {
      //已有服务//复选
      this.loading = true;
      let resBody = new screenShotIns();
      // console.log(this.selectedObj.map);
      var temp = [];
      for (var k in this.selectedObj) {
        temp.push(this.selectedObj[k].devNum);
      }
      resBody.data.devNumList = temp;
      // resBody.QueryPageNo = this.viewProcessCurrentPage;
      // resBody.QueryRowNum = this.pageSize;
      let response = await request(resBody);
      this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        this.$message({
          type: "success",
          message: "截屏成功"
        });
        this.screenShotTableData = response.RSP_BODY.fileUrlList;
        this.remoteScreenShotPopStatu = true;
      } else {
        this.$message({
          type: "error",
          message:
            "请求失败，错误码:" +
            response.SYS_HEAD.ReturnCode +
            "，错误信息：" +
            response.SYS_HEAD.ReturnMessage
        });
      }
    },
    showScreenShot(row) {
      //打开子弹窗显示图片
      this.screenShotPicStatu = true;
      //将返回的地址加载至图片
      this.loadingImg = true;
      this.loadingImgError = false;
      this.dialogImageUrl = row.fileUrl;
    },
    async logCatch() {
      //已有服务
      this.loading = true;
      let resBody = new logCatchIns();
      resBody.data.clientIp = this.selectedObj[0].devIp;
      resBody.data.day = this.logCatchPopform.days.join(",");

      let response = await request(resBody);

      this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        // console.log(response);
        // this.viewProcessTableData = response.RSP_BODY.content;
        // this.viewProcessTableDataTotal = response.RSP_BODY.total * 1||response.QUERY_INFO_HEAD.QueryAllDataCount;
        // this.viewProcessPopStatu = true;
        this.downloadFile(response.RSP_BODY.fileUrl);
      } else {
        this.$message({
          type: "error",
          message:
            "请求失败，错误码:" +
            response.SYS_HEAD.ReturnCode +
            "，错误信息：" +
            response.SYS_HEAD.ReturnMessage
        });
      }
    },
    async checkProgress() {
      //已有服务
      this.loading = true;
      let resBody = new checkProgressIns();
      resBody.data.clientIp = this.selectedObj[0].devIp;
      resBody.QueryPageNo = this.viewProcessCurrentPage;
      resBody.QueryRowNum = this.pageSize;
      let response = await request(resBody);

      this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        this.viewProcessTableData = response.RSP_BODY.content;
        this.viewProcessTableDataTotal =
          response.RSP_BODY.total * 1 ||
          response.QUERY_INFO_HEAD.QueryAllDataCount;
        this.viewProcessPopStatu = true;
      } else {
        this.$message({
          type: "error",
          message:
            "请求失败，错误码:" +
            response.SYS_HEAD.ReturnCode +
            "，错误信息：" +
            response.SYS_HEAD.ReturnMessage
        });
      }
    },
    async netStatu() {
      //已有服务
      this.loading = true;
      let resBody = new checkNetStatuIns();
      resBody.data.clientIp = this.selectedObj[0].devIp;
      // resBody.QueryPageNo = this.viewProcessCurrentPage;
      // resBody.QueryRowNum = this.pageSize;
      let response = await request(resBody);
      this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        // 打开弹窗
        this.netStatuShowStr = response.RSP_BODY.content;
        this.netStatuPopStatu = true;
      } else {
        this.$message({
          type: "error",
          message:
            "请求失败，错误码:" +
            response.SYS_HEAD.ReturnCode +
            "，错误信息：" +
            response.SYS_HEAD.ReturnMessage
        });
      }
    },
    async modulStatu() {
      //已有服务
      this.loading = true;
      let resBody = new modulesIns();
      // console.log(this.selectedObj);
      resBody.data.clientIp = this.selectedObj[0].devIp;
      resBody.data.devNum = this.selectedObj[0].devNum;
      let response = await request(resBody);
      this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        // 打开弹窗
        var output = [];
        var data = response.RSP_BODY.content.split("#");
        for (var i = 1; i < data.length; i++) {
          output.push({
            modelLabel: data[i].split(",")[0],
            modelStatu: data[i].split(",")[1]
          });
        }
        this.modelStatuTableData = output;
        this.modelStatuPopStatu = true;
      } else {
        this.$message({
          type: "error",
          message:
            "请求失败，错误码:" +
            response.SYS_HEAD.ReturnCode +
            "，错误信息：" +
            response.SYS_HEAD.ReturnMessage
        });
      }
    },
    async getModules() {
      //已有服务查看设备模块状态的下拉列表
      this.loading = true;
      let resBody = new getModulesIns();
      resBody.data.devNum = this.selectedObj[0].devNum;
      let response = await request(resBody);
      this.loading = false;
      this.resetPopOptions = [];
      if (response.SYS_HEAD.ReturnCode == "000000") {
        // 打开弹窗
        var data = response.RSP_BODY.resultSet;
        var output = [];
        // data.map(function(val){output.push({"modelId":val.split(",")[1],"modelLabel":val.split(",")[0]})})
        for (var k in data) {
          output.push({ modelId: k, modelLabel: data[k] });
        }
        this.resetPopOptions = output;
        this.resetPopform.modelId = [1];
        this.resetPopStatu = true;
      } else {
        this.$message({
          type: "error",
          message:
            "请求失败，错误码:" +
            response.SYS_HEAD.ReturnCode +
            "，错误信息：" +
            response.SYS_HEAD.ReturnMessage
        });
      }
    }
  },
  async beforeCreate() {
    //请求下拉列表数据
    let resBody = new spinnerList();
    resBody.data.spinnerList = [
      { spinnerName: "branch" },
      { spinnerName: "devType" },
      { spinnerName: "devBrand" },
      { spinnerName: "devStatus" }
    ];
    let response = await request(resBody);
    if (response.SYS_HEAD.ReturnCode == "000000") {
      //在之后要塞入空选项
      this.branchSpinner = response.RSP_BODY.branchSpinner; //机构信息
      this.deviceTypeSpinner = response.RSP_BODY.deviceTypeSpinner||[]; //设备类型
      this.comDeviceType = toolBox.objArray2Hash(
        this.deviceTypeSpinner,
        "devTypeNum"
      ); //
      this.deviceTypeSpinner.unshift({});
      this.deviceStatuSpinner =
        response.RSP_BODY.devRunningStatusSpinner.devStateList||[]; //设备状态
      this.comDeviceStatuSpinner = toolBox.objArray2Hash(
        this.deviceStatuSpinner,
        "devState"
      );
      this.deviceStatuSpinner.unshift({});
      this.deviceRunStatuSpinner =
        response.RSP_BODY.devRunningStatusSpinner.devRunningStatusList||[]; //设备运行状态
      this.comDeviceRunStatuSpinner = toolBox.objArray2Hash(
        this.deviceRunStatuSpinner,
        "devRunningStatus"
      );
      this.deviceRunStatuSpinner.unshift({});

      this.comConnStatu = toolBox.objArray2Hash(
        response.RSP_BODY.devRunningStatusSpinner.devConnectStatusList,
        "devConnectStatus"
      ); //通讯状态
      this.comModulStatu = toolBox.objArray2Hash(
        response.RSP_BODY.devRunningStatusSpinner.devModuleStatusList,
        "devModuleStatus"
      ); //模块状态
      this.comCardboxStatu = toolBox.objArray2Hash(
        response.RSP_BODY.devRunningStatusSpinner.devCardBoxStatusList,
        "devCardBoxStatus"
      ); //卡箱状态
      this.comCahsboxStatu = toolBox.objArray2Hash(
        response.RSP_BODY.devRunningStatusSpinner.devCashBoxStatusList,
        "devCashBoxStatus"
      ); //钞箱状态
      // console.log(this.comDeviceType);
      // console.log(this.comDeviceStatuSpinner);
      // console.log(this.comDeviceRunStatuSpinner);
      // console.log(this.comConnStatu);
      // console.log(this.comModulStatu);
      // console.log(this.comCardboxStatu);
      // console.log(this.comCahsboxStatu);
    } else {
      this.$message({
        type: "error",
        message:
          "请求失败，错误码:" +
          response.SYS_HEAD.ReturnCode +
          "，错误信息：" +
          response.SYS_HEAD.ReturnMessage
      });
    }
    //先请求一下
    this.loading = true;
    await this.queryModel(); //表格
    this.loading = false;
    //然后再开启轮询
    this.polling(true, true);
  },
  //因为有router-view外有keepalive的原因(需要缓存) 无法导致页面销毁所以无法进入此钩子
  // beforeDestory(){
  //   console.log("进入了钩子");
  //   clearTimeout(this.queryTimeout);
  // },
  components: {
    matrixPanel: matrixPanel,
    lineCharts: lineCharts,
    selectTree: selectTree
  },
  computed: {
    layoutLeft() {
      return this.showMatrix ? "width:20.83333%;" : "width:0%;"; //使用span:0的时候默认display 所以不能用
      // return this.showMatrix ? 5 : 0;
    },
    layoutRight() {
      return this.showMatrix ? 19 : 24;
    },
    pollingPause() {
      return this.selectList.length > 0;
    },
    queryTimeSpaceShow() {
      //显示秒数更改轮询配置    弹窗时暂停轮询
      return this.queryTimeSpace;
    }
  },
  beforeMount() {}
};
</script>

<style lang="scss" scope>
.devStatuUl {
  list-style: none;
  color: #555;
  padding: 0;
}
.devStatuUl > li {
  overflow: hidden;
  white-space: nowrap;
  /* height: 24px; */
  padding: 3px 9px;
  border-radius: 3px;
  margin: 2px 0;
}
.devTypeUl {
  list-style: none;
  color: #555;
  padding: 0;
}
.devTypeUl > li {
  overflow: hidden;
  white-space: nowrap;
  /* height: 24px; */
  padding: 3px 7px;
  border-radius: 3px;
  margin: 2px 0;
  background: #fafafa;
  transition: 0.3s;
}
/* .devTypeUl > li:hover {
  color: #fff;
  background: #555;
} */
.el-card {
  overflow: inherit;
}

.hugeScreenCtn {
  padding: 21px 56px;
  overflow: auto;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 30000;
  background: #e9e9e9;
}
</style>
