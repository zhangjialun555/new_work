<template>
  <div class="detailInfo">
    <el-row v-if="isShow&&!fileExploreOptions.isShow" v-loading="loading">
      <el-col :md="24" :lg="24">
        <el-button @click="isShow=false" type="primary" size="mini">返回</el-button>
      </el-col>
      <el-col :md="{span:24}" :lg="{span:20,offset:2}">
        <el-tabs tab-position="left" style="">
          <el-tab-pane label="设备基本信息">
            <el-card>
              <div slot="header">
                <span>设备基本信息</span>
                <!-- 下面功能暂时没有 暂时不显示 -->
                <!-- <el-button style="float: right;padding: 1px 0px 1px 10px;" type="text" @click="xxx" :disabled="true">修改设备基本信息</el-button>
                      <el-button style="float: right;padding: 1px 14px 1px 0px;border-right: 1px solid #ccc;border-radius: 0;" type="text" @click="xxx" :disabled="true">查看设备预警记录</el-button> -->
              </div>
              <el-form size="mini" :label-width="labelWidth">
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
                    <el-form-item label='设备分类'>
                      <span>{{detailInfo.devBasicInfo.devAssortmentName}}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label='设备类型'>
                      <span>{{detailInfo.devBasicInfo.devType}}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label='设备型号'>
                      <span>{{detailInfo.devBasicInfo.devModel}}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label='C端应用'>
                      <span>{{detailInfo.devBasicInfo.cProgramName}}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label='虚拟柜员号'>
                      <span>{{detailInfo.devBasicInfo.virtualTellerNo}}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label='维护柜员号'>
                      <span>{{detailInfo.devBasicInfo.servicingTellerNo}}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
                <!-- 下面功能暂时没有 暂时不显示 -->
                <!-- <el-row>
                        <el-col style="display:flex;flex-flow:row nowarp;justify-content:center;">
                          <el-button type="primary" size="mini" @click="openPop('xxx')" :disabled="true">启用</el-button>
                          <el-button type="primary" size="mini" @click="openPop('xxx')" :disabled="true">停用</el-button>
                          <el-button type="primary" size="mini" @click="openPop('xxx')" :disabled="true">维护</el-button>
                        </el-col>
                      </el-row> -->
              </el-form>
            </el-card>
          </el-tab-pane>
          <el-tab-pane label="设备系统信息">
            <el-card>
              <div slot="header">
                <span>设备系统信息</span>
              </div>
              <el-row>
                <el-form size="mini" :label-width="labelWidth">
                  <el-col :span="12">
                    <el-form-item label='操作系统'>
                      <span>{{detailInfo.devSystemInfo.operatingSystemName}}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label='操作系统版本号'>
                      <span>{{detailInfo.devSystemInfo.operatingSystemVersion}}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label='网络状态'>
                      <span>{{detailInfo.devSystemInfo.devConnectStatus}}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label='IP地址'>
                      <span>{{detailInfo.devSystemInfo.devIp}}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label='硬盘使用状态'>
                      <el-row>
                        <el-col :lg="18">
                          <el-progress :percentage="progressBar" :show-text="false" style="margin: 11px 0;"></el-progress>
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
                <!-- 这里栅格布局不满足要求 使用flex布局 -->
                <el-col style="display:flex;flex-flow:row nowarp;justify-content:center;">
                  <el-button type="primary" size="mini" @click="openPop('reboot')">系统重启</el-button>
                  <el-button type="primary" size="mini" @click="openPop('shut')">系统关机</el-button>
                  <el-dropdown trigger="click" @command="openPop" style="margin:0 0 0 10px;">
                    <el-button type="primary" size="mini">更多
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command='remoteScreenShot' :disabled="false">远程截屏</el-dropdown-item>
                      <el-dropdown-item command='viewProcess' :disabled="false">查看进程</el-dropdown-item>
                      <el-dropdown-item command='netStatu' :disabled="false">网络状态</el-dropdown-item>
                      <el-dropdown-item command='fileExplore' :disabled="false">文件浏览</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-col>
              </el-row>
            </el-card>
          </el-tab-pane>
          <el-tab-pane label="C端程序信息">
            <el-card>
              <div slot="header">
                <span>C端程序信息</span>
              </div>
              <el-collapse accordion :value="0">
                <el-collapse-item :title="item.cProgramName" :name="key" v-for="(item,key) in detailInfo.cProgramList" :key="key">
                  <el-form size="mini" :label-width="labelWidth">
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label='应用名称'>
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
                      <!-- 以下功能暂无后台接口 暂时禁用 （不使用原来的页面跳转并查询的方式    使用新接口）-->
                      <el-col :span="12">
                        <el-form-item label='参数'>
                          <el-button style="" type="text" @click="xxx" :disabled="true">查看参数详情</el-button>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label='广告'>
                          <el-button style="" type="text" @click="xxx" :disabled="true">查看广告详情</el-button>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label='菜单'>
                          <el-button style="" type="text" @click="xxx" :disabled="true">查看菜单详情</el-button>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label='版本'>
                          <el-button style="" type="text" @click="xxx" :disabled="true">查看版本详情</el-button>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label='交易明细'>
                          <el-button style="" type="text" @click="xxx" :disabled="true">查看交易明细</el-button>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col style="display:flex;flex-flow:row nowarp;justify-content:center;">
                        <el-button type="primary" size="mini" @click="openPop('restoreService')">服务恢复</el-button>
                        <el-button type="primary" size="mini" @click="openPop('pauseService')">服务暂停</el-button>
                        <el-dropdown trigger="click" @command="openPop" style="margin:0 0 0 10px;">
                          <el-button type="primary" size="mini">更多
                            <i class="el-icon-arrow-down el-icon--right"></i>
                          </el-button>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command='parameterIssuance' :disabled="false">参数下发</el-dropdown-item>
                            <el-dropdown-item command='logCatch' :disabled="false">日志抓取</el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                      </el-col>
                    </el-row>
                  </el-form>
                </el-collapse-item>
              </el-collapse>
            </el-card>
          </el-tab-pane>
          <el-tab-pane label="设备模块信息">
            <el-card>
              <div slot="header">
                <span>设备模块信息</span>
                <el-button style="float: right;padding: 1px 0px 1px 10px;" type="text" @click="openPop('reset')" :disabled="true" v-show="false">强制复位</el-button>
              </div>
              <el-form size="mini">
                <el-row>
                  <el-col :span="24" v-for="(item,key) in detailInfo.devModuleList" :key="key">
                    <el-form-item>
                      <el-col :lg='{span:5,offset:2}' style="text-align:right;">
                        <span>{{item.devModule}}： </span>
                      </el-col>
                      <el-col :lg='8'>
                        <span>{{item.devModuleStatus||"状态未知"}}</span>
                      </el-col>
                      <el-col :lg='5'>
                        <el-button type="text" size="mini" style="float:right;" @click="forceReset(item.devModuleNum)">强制复位</el-button>
                      </el-col>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-card>
          </el-tab-pane>
          <el-tab-pane label="设备卡箱信息">
            <el-card>
              <div slot="header">
                <span>设备卡箱信息--总共卡数:{{detailInfo.devCardBoxInfo.allCardCount}}</span>
                <el-button style="float: right;padding: 1px 0px 1px 10px;" type="text" :disabled="true">查看加卡记录</el-button>
              </div>
              <!-- <el-row>
                        <el-form size="mini" :label-width="labelWidth">
                          <el-col :span="12">
                              <el-form-item label='总共卡数' >
                                <span>{{detailInfo.devCardBoxInfo.allCardCount}}</span>
                              </el-form-item>
                          </el-col>
                        </el-form>
                    </el-row> -->
              <el-row>
                <el-collapse accordion>
                  <el-collapse-item :title="'卡箱'+item.cardBoxNum" :name="key" v-for="(item,key) in detailInfo.devCardBoxInfo.devCardBoxInfoList" :key="key">
                    <el-row>
                      <el-form size="mini" :label-width="labelWidth">
                        <el-col :span="12">
                          <el-form-item label='卡箱号'>
                            <span>{{item.cardBoxNum}}</span>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label='卡箱类型'>
                            <span>{{item.cardBoxType}}</span>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label='剩余卡数'>
                            <span>{{item.cardCount}}</span>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label='卡箱状态'>
                            <span>{{item.cardBoxStatus}}</span>
                          </el-form-item>
                        </el-col>
                        <!-- 下面暂时没有返回 暂时不显示 -->
                        <!-- <el-col :span="12">
                                  <el-form-item label='凭证种类代码' >
                                    <span>xxxxxx</span>
                                  </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                  <el-form-item label='成功发卡数量' >
                                    <span>xxxxxx</span>
                                  </el-form-item>
                              </el-col> -->
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
                          <el-form-item label='上次加卡数量'>
                            <span>{{item.lastAddCardCount}}</span>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label='上次加卡柜员'>
                            <span>{{item.lastAddCardTellerNo}}</span>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label='上次加卡日期'>
                            <span>{{item.lastAddCardDate}}</span>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label='上次清机柜员'>
                            <span>{{item.lastClearCardTellerNo}}</span>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label='上次清机日期'>
                            <span>{{item.lastClearCardDate}}</span>
                          </el-form-item>
                        </el-col>
                      </el-form>
                    </el-row>
                  </el-collapse-item>
                </el-collapse>
              </el-row>
            </el-card>
          </el-tab-pane>
          <el-tab-pane label="设备钞箱信息">
            <el-card>
              <div slot="header">
                <span>设备钞箱信息--钞箱总金额:{{cashBoxAmount}}</span>
              </div>
              <!-- <el-row>
                        <el-form size="mini" :label-width="labelWidth">
                          <el-col :span="12">
                              <el-form-item label='钞箱总金额' >
                                <span>{{detailInfo.devCashBoxInfo.cashBoxAllAmount}}</span>
                              </el-form-item>
                          </el-col>
                        </el-form>
                    </el-row> -->
              <el-row>
                <el-collapse accordion>
                  <el-collapse-item :title="'钞箱'+item.cashBoxNum" :name="key" v-for="(item,key) in detailInfo.devCashBoxInfo.devCashBoxInfoList" :key="key">
                    <el-form size="mini" :label-width="labelWidth">
                      <el-row>
                        <el-col :span="12">
                          <el-form-item label='钞箱号'>
                            <span>{{item.cashBoxNum}}</span>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label='钞箱类型'>
                            <span>{{item.cashBoxType}}</span>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label='钞箱状态'>
                            <span>{{item.cashBoxStatus}}</span>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <!-- <div style="border-top: 1px solid #ddd;margin:0 0 14px 0;"></div> -->
                      <el-row>
                        <el-col :span="12">
                          <el-form-item label='现金面额'>
                            <span>{{currencyFormat(item.cashDenomination)}}元</span>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label='现金数量'>
                            <span>{{item.cashCount}}张</span>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-form>
                  </el-collapse-item>
                </el-collapse>
              </el-row>
            </el-card>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>

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
    <!-- <div class="returnBtn"><a  style="color:#409EFF" @click="isShow=false">返回</a> </div> -->

    <transition name="el-fade-in">
      <component :is='fileExplore' :option='fileExploreOptions' :dev-obj="selectedObj[0]"></component>
    </transition>
  </div>
</template>

<script>
//工具
import toolBox from "@/utils/toolBox";
import md5 from "js-md5";
//页面
import fileExplorePage from "./fileExplorePage";
//通讯
import request from "@/utils/request";
import getGlobalParams from "@/utils/getGlobalParams";
//远程管理功能实体类
import authorazitionIns from "@/message/infoCollect/devMonitor/dev-authorazition";
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

export default {
  data() {
    return {
      //主页面数据
      labelWidth: "140px",
      fileExplore: fileExplorePage, //引入的模拟文件页面
      fileExploreOptions: { isShow: false }, //传入页面的option控制显隐
      loading: false, //整个页面的loading
      //页面中所有弹窗的数据
      startPauseTableData: [],
      startPausePop: false,
      screenShotPicStatu: false,
      screenShotTableData: [],
      confirmPopStatu: false,
      resetPopStatu: false,
      parameterIssuancePopStatu: false,
      logCatchPopStatu: false,
      viewProcessPopStatu: false,
      modelStatuPopStatu: false,
      remoteScreenShotPopStatu: false,
      netStatuPopStatu: false,
      confirmPopform: {
        username: "",
        password: ""
      },
      resetPopform: {
        modelId: []
      },
      resetPopOptions: [],
      parameterIssuancePopform: {
        amount: "",
        timeout: ""
      },
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
      viewProcessTableData: [],
      viewProcessCurrentPage: 1,
      viewProcessTableDataTotal: 0,
      modelStatuTableData: [],
      netStatuShowStr: "",
      PopType: "",
      loadingImg: false, //弹窗中的图片loading
      loadingImgError: false,
      dialogImageUrl: ""
    };
  },
  props: { option: Object, detailInfo: Object, selectedObj: Array },
  methods: {
    //格式化方法
    currencyFormat(num) {
      return toolBox.currencyFormat(num, 2, ".", ",");
    },
    //以下为机具管理功能的弹窗控制
    openPop(type) {
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
        this.$refs["parameterIssuancePopform"].validate(valid => {
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
    loadingImgFalse() {
      this.loadingImg = false;
      this.loadingImgError = true;
    },
    dialogDetailClose() {
      this.dialogImageUrl = "";
    },
    showScreenShot(row) {
      //打开子弹窗显示图片
      this.screenShotPicStatu = true;
      //将返回的地址加载至图片
      this.loadingImg = true;
      this.loadingImgError = false;
      this.dialogImageUrl = row.fileUrl;
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
      let response = await request(resBody);
      this.loading = false;
      this.confirmPopform = {
        username: "",
        password: ""
      };
      this.confirmPopStatu = false;
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
    //以下为控制机具的功能
    async reboot() {
      //系统重启
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
      //系统关闭
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
      //服务重置（C端服务）//复选
      this.loading = true;
      let resBody = new srvStartPauseIns();
      // var temp=[];
      // this.selectedObj.map(function(x){temp.push(x.devNum)});
      resBody.data.devNumList = [this.selectedObj[0].devNum];
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
      //服务暂停//复选
      this.loading = true;
      let resBody = new srvStartPauseIns();
      resBody.data.devNumList = [this.selectedObj[0].devNum];
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
    async forceReset(devModuleNum) {
      //模块强制复位
      this.resetPopStatu = false;
      this.loading = true;
      let resBody = new srvRestoreIns();
      resBody.data.clientIp = this.selectedObj[0].devIp;
      // resBody.data.spname = this.resetPopform.modelId.join(",");//服务名称
      resBody.data.devModuleNum = devModuleNum; //服务名称
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
      //参数下发
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
      //截屏//复选
      this.loading = true;
      let resBody = new screenShotIns();
      resBody.data.devNumList = [this.selectedObj[0].devNum];
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
    async logCatch() {
      //日志抓取
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
      //查看进程
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
      //查看网络状态
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
      //查看模块状态
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
        for (var k in data) {
          output.push({
            modelId: data[k].split(",")[1],
            modelLabel: data[k].split(",")[0]
          });
        }
        this.resetPopOptions = output;
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
    },
    xxx() {}
  },
  computed: {
    isShow: {
      get: function() {
        return this.option.isShow;
      },
      set: function(newValue) {
        this.option.isShow = newValue;
      }
    },
    progressBar() {
      if (this.detailInfo.devSystemInfo.diskFreeSpace) {
        return (
          (
            1 -
            this.detailInfo.devSystemInfo.diskFreeSpace /
              this.detailInfo.devSystemInfo.diskAllSpace
          ).toFixed(4) * 100
        );
      } else {
        return 0;
      }
    },
    cashBoxAmount() {
      return toolBox.currencyFormat(
        this.detailInfo.devCashBoxInfo.cashBoxAllAmount,
        2,
        ".",
        ","
      );
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
// .detailInfo{
//   top:85px;
//   background:#fff;
// }
.marginTop10 {
  margin-top: 10px;
}
.returnBtn {
  width: 50px;
  height: 50px;
  background: #000;
  opacity: 0.5;
  position: fixed;
  right: 45px;
  bottom: 53px;
  border-radius: 3px;
  text-align: center;
  padding-top: 15px;
}
.returnBtn:hover {
  opacity: 0.9;
}
#returnBtnTop {
  height: 50px;
  background: #409eff;
  width: 100%;
}
.editClass {
  input.el-input__inner {
    border: none;
    background: rgba(0, 0, 0, 0) !important;
  }
}
// 这里deep后面不能加空格 会影响父元素样式
.el-tabs /deep/.el-tabs__item {
  height: 60px;
  line-height: 60px;
}
.el-tabs /deep/.el-form-item {
  margin-bottom: 30px;
}
</style>
