<template>
  <div class="meeting-msg" v-loading="loading" element-loading-text="加载中。。。">
    <!-- 主页面 -->
    <div>
       <el-card>
         <el-form ref='queryForm' :model='queryForm' size='mini' label-position='top'>
              <el-row  :gutter="10">
                  <!-- <el-col :md="6" :lg="4">
                      <el-form-item label='机构编号' prop='branchId'>
                        <select-tree ref="tree" v-model="addForm.branchId" :props='{id:"branchId",label: "branchName",children: "childBranch"}' :tree-data="brno"></select-tree>
                      </el-form-item>
                  </el-col> -->
                  <el-col :md="6" :lg="4">
                      <el-form-item label='多媒体连接号' prop='MMID'>
                        <el-input v-model='queryForm.MMID' placeholder="请输入多媒体连接号"></el-input>
                      </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="4">
                      <el-form-item label='会议号' prop='CONFERID'>
                        <el-input v-model='queryForm.CONFERID' placeholder="请输入会议号"></el-input>
                      </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="4">
                      <el-form-item label='开始日期' prop='STARTDATE'>
                        <el-date-picker
                          v-model="queryForm.STARTDATE"
                          value-format="yyyyMMdd" 
                          type="date"
                          placeholder="选择日期">
                        </el-date-picker>
                      </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="4">
                      <el-form-item label='结束日期' prop='ENDDATE'>
                        <el-date-picker
                          v-model="queryForm.ENDDATE"
                          value-format="yyyyMMdd" 
                          type="date"
                          placeholder="选择日期">
                        </el-date-picker>
                      </el-form-item>
                  </el-col>
                  <el-col :md="3" :lg="2" class="searchBtnMarginTop">
                        <el-button type='primary' size='mini' icon='el-icon-search' @click="queryModel">查询</el-button>
                  </el-col>
                  <el-col  :md="3" :lg="2" class="searchBtnMarginTop">
                        <el-button type='warning' size='mini' icon='el-icon-refresh' @click="clearForm('queryForm')">重置</el-button>
                  </el-col>
                  <!-- <el-col  :md="3" :lg="2" class="searchBtnMarginTop">
                      <el-button type='primary' size='mini' class='b-button' icon="el-icon-download" @click="getExcel" v-if="btnPermission('Button_RunRateRep_Export')">导出</el-button>
                  </el-col> -->
              </el-row>
         </el-form>
      </el-card>
       <el-card style="margin:10px 0 0 0">
          <!-- <el-row >
              <el-col :md="12" :lg="12">
                <el-button type='primary' size='mini' @click="openPop('add')">新增</el-button>
                <el-button type='primary' size='mini' @click="openPop('edit')" :disabled="!(selectList.length==1)">修改</el-button>
                <el-button type='danger' size='mini' @click="openPop('del')" :disabled="!(selectList.length>=1)">删除</el-button>
              </el-col>
          </el-row> -->
          <el-table 
          ref="tableData" 
          :data='tableData'
          header-row-class-name="tableHeaderClass"
          @selection-change="tableCheckBoxChange"
          border
          style="margin:10px 0 0 0"
          >
            <el-table-column fixed prop='MMID' label='多媒体连接号' ></el-table-column>
            <el-table-column prop='WORKDATE' label='日期'></el-table-column>
            <el-table-column prop='CONFERID' label='会议号'></el-table-column>
            <el-table-column prop='CONFERNAME' label='会议名称'></el-table-column>
            <el-table-column prop='APPLYTIME' label='申请时间'></el-table-column>
            <el-table-column prop='STARTTIME' label='开始时间'></el-table-column>
            <el-table-column prop='ENDTIME' label='结束时间'></el-table-column>
            <el-table-column prop='STATUS' label='会议状态'></el-table-column>
            <el-table-column prop='CONFEPASSWORD' label='会议密码'></el-table-column>
            <el-table-column prop='CONFENUMBER' label='会议人数'></el-table-column>

            <el-table-column label='操作' align="center" fixed="right" width="80">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="checkDetail(scope.row,tableData)">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>
           <div class="box">
              <el-pagination background
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page.sync="currentPage"
                  :page-sizes="[10, 20, 50,100]"
                  :page-size="pageSize"
                  layout="sizes, total, prev, pager, next, jumper"
                  :total="tableTotal"> 
              </el-pagination>
         </div>
      </el-card>
    </div>
    <!-- 弹窗 -->
    <!-- 暂时没用的弹窗 -->
    <el-dialog :title="popTitle" :visible.sync="addPopStatu" :lock-scroll="false" width="800px" :close-on-click-modal="false">
          <el-card>
            <el-form ref='addForm' :model='addForm'  size='mini' label-position="top" :rules="rules">
              <h4>摄像头配置</h4>
              <div style="border-top: 1px solid #ebeef5;margin:15px 22px 12px;"></div>
              <el-row :gutter="10">
                  <el-col :md="6" :lg="12">
                    <el-form-item label='用户摄像头'  prop='showSelfVideoFlag'>
                            <el-select placeholder="请选择" v-model="addForm.showSelfVideoFlag">
                              <el-option
                                v-for="item in [{value:1,label:'是'},{value:0,label:'否'}]"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12">
                    <el-form-item label='摄像头宽'  prop='cameraWidth'>
                            <el-input v-model='addForm.cameraWidth' placeholder="请输入参数"  ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12">
                    <el-form-item label='摄像头高'  prop='cameraHeight'>
                            <el-input v-model='addForm.cameraHeight' placeholder="请输入参数"  ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12">
                    <el-form-item label='摄像头码率'  prop='cameraMalv'>
                            <el-input v-model='addForm.cameraMalv' placeholder="请输入参数"  ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12">
                    <el-form-item label='摄像头帧率'  prop='cameraZhenlv'>
                            <el-input v-model='addForm.cameraZhenlv' placeholder="请输入参数"  ></el-input>
                    </el-form-item>
                  </el-col>
                  <!-- <el-col :md="6" :lg="12">
                    <el-form-item label='机构编号' prop='branchId'>
                        <select-tree ref="tree" v-model="addForm.branchId" @select-check="selectChange" 
                        :props='{id:"branchId",label: "branchName",children: "childBranch"}' :tree-data="brno"></select-tree>
                    </el-form-item>
                  </el-col> -->
                  <!-- <el-col :md="6" :lg="4">
                          <el-form-item label='设备类型'  prop='devType'>
                              <el-cascader v-model='addForm.devType' :props=" {value: 'devTypeNum',label: 'devType'}" 
                              placeholder="---请选择---" :options='deviceTypeSpinner' filterable></el-cascader>
                          </el-form-item>
                  </el-col> -->
              </el-row>
              <h4>录制配置</h4>
              <div style="border-top: 1px solid #ebeef5;margin:15px 22px 12px;"></div>
              <el-row :gutter="10">
                  <el-col :md="6" :lg="12">
                    <el-form-item label='是否录制'  prop='saveDeskFlag'>
                            <el-select placeholder="请选择" v-model="addForm.saveDeskFlag">
                              <el-option
                                v-for="item in [{value:1,label:'是'},{value:0,label:'否'}]"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12" v-if="!!(addForm.saveDeskFlag==1)">
                    <el-form-item label='录制区域参数'  prop='saveDeskArea'>
                            <el-input v-model='addForm.saveDeskArea' placeholder="请输入参数" ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12" v-if="!!(addForm.saveDeskFlag==1)">
                    <el-form-item label='录制码率'  prop='saveDeskMalv'>
                            <el-input v-model='addForm.saveDeskMalv' placeholder="请输入参数" ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12" v-if="!!(addForm.saveDeskFlag==1)">
                    <el-form-item label='录制帧率'  prop='saveDeskZhenlv'>
                            <el-input v-model='addForm.saveDeskZhenlv' placeholder="请输入参数" ></el-input>
                    </el-form-item>
                  </el-col>
              </el-row>
            </el-form>
          </el-card>
          
          <!-- <el-card>
            <el-tabs :tab-position="'top'" style="height: 200px;">
              <el-tab-pane label="自身视频窗口配置">
                <el-form ref='addForm' :model='addForm'  size='mini' label-position="top" :rules="rules">
                  <el-row :gutter="10">
                      <el-col :md="6" :lg="12">
                        <el-form-item label='横坐标x'  prop='x'>
                                <el-input v-model='addForm.devNum' placeholder="请输入参数"  ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :md="6" :lg="12">
                        <el-form-item label='纵坐标y'  prop='y'>
                                <el-input v-model='addForm.devNum' placeholder="请输入参数"  ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :md="6" :lg="12">
                        <el-form-item label='宽度'  prop='width'>
                                <el-input v-model='addForm.devNum' placeholder="请输入参数"  ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :md="6" :lg="12">
                        <el-form-item label='高度'  prop='height'>
                                <el-input v-model='addForm.devNum' placeholder="请输入参数"  ></el-input>
                        </el-form-item>
                      </el-col>
                  </el-row>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="远程视频窗口配置">远程视频窗口配置</el-tab-pane>
              <el-tab-pane label="远程桌面窗口配置">远程桌面窗口配置</el-tab-pane>
              <el-tab-pane label="远程协助窗口配置">远程协助窗口配置</el-tab-pane>
            </el-tabs>
          </el-card> -->
      <div slot="footer" class="dialog-footer">
        <el-button  @click="configPopStatu=false" size="mini">取 消</el-button>
        <el-button type="primary" @click="EditModel" size="mini">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 详细信息弹窗 -->
    <el-dialog :title="'详细信息'" :visible.sync="detailPopStatu" :lock-scroll="false" width="800px">
          <el-card>
            <el-form ref='detailForm' :model='detailForm'  size='mini' label-position="top" :rules="rules">
              <h4>参会者1</h4>
              <div style="border-top: 1px solid #ebeef5;margin:15px 22px 12px;"></div>
              <el-row :gutter="10">
                  <el-col :md="6" :lg="12">
                    <el-form-item label='编号'  prop='CONFER1'>
                            <el-input v-model='detailForm.CONFER1' placeholder="" readonly></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12">
                    <el-form-item label='姓名'  prop='CONFER1NAME'>
                            <el-input v-model='detailForm.CONFER1NAME' placeholder="" readonly></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12">
                    <el-form-item label='状态'  prop='CONFER1STATUS'>
                            <el-select placeholder="请选择" v-model="detailForm.CONFER1STATUS" :disabled="true">
                              <el-option
                                v-for="item in [{value:'0',label:'未进入'},{value:'1',label:'进入'},{value:'2',label:'离开'}]"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12">
                    <el-form-item label='IP'  prop='CONFER1IP'>
                            <el-input v-model='detailForm.CONFER1IP' placeholder="" readonly></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12">
                    <el-form-item label='进入时间'  prop='CONFER1INTIME'>
                            <el-input v-model='detailForm.CONFER1INTIME' placeholder="" readonly></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12">
                    <el-form-item label='离开时间'  prop='CONFER1OUTTIME'>
                            <el-input v-model='detailForm.CONFER1OUTTIME' placeholder="" readonly></el-input>
                    </el-form-item>
                  </el-col>
              </el-row>
              <h4>参会者2</h4>
              <div style="border-top: 1px solid #ebeef5;margin:15px 22px 12px;"></div>
              <el-row :gutter="10">
                  <el-col :md="6" :lg="12">
                    <el-form-item label='编号'  prop='CONFER2'>
                            <el-input v-model='detailForm.CONFER2' placeholder="" readonly></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12">
                    <el-form-item label='姓名'  prop='CONFER2NAME'>
                            <el-input v-model='detailForm.CONFER2NAME' placeholder="" readonly></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12">
                    <el-form-item label='状态'  prop='CONFER2STATUS'>
                            <el-select placeholder="请选择" v-model="detailForm.CONFER2STATUS" :disabled="true">
                              <el-option
                                v-for="item in [{value:'0',label:'未进入'},{value:'1',label:'进入'},{value:'2',label:'离开'}]"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12">
                    <el-form-item label='IP'  prop='CONFER2IP'>
                            <el-input v-model='detailForm.CONFER2IP' placeholder=""  readonly></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12">
                    <el-form-item label='进入时间'  prop='CONFER2INTIME'>
                            <el-input v-model='detailForm.CONFER2INTIME' placeholder=""  readonly></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12">
                    <el-form-item label='离开时间'  prop='CONFER2OUTTIME'>
                            <el-input v-model='detailForm.CONFER2OUTTIME' placeholder=""  readonly></el-input>
                    </el-form-item>
                  </el-col>
              </el-row>
              <h4>参会者3</h4>
              <div style="border-top: 1px solid #ebeef5;margin:15px 22px 12px;"></div>
              <el-row :gutter="10">
                  <el-col :md="6" :lg="12">
                    <el-form-item label='编号'  prop='CONFER3'>
                            <el-input v-model='detailForm.CONFER3' placeholder="" readonly></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12">
                    <el-form-item label='姓名'  prop='CONFER3NAME'>
                            <el-input v-model='detailForm.CONFER3NAME' placeholder="" readonly></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12">
                    <el-form-item label='状态'  prop='CONFER3STATUS'>
                            <el-select placeholder="请选择" v-model="detailForm.CONFER3STATUS" :disabled="true">
                              <el-option
                                v-for="item in [{value:'0',label:'未进入'},{value:'1',label:'进入'},{value:'2',label:'离开'}]"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12">
                    <el-form-item label='IP'  prop='CONFER3IP'>
                            <el-input v-model='detailForm.CONFER3IP' placeholder=""  readonly></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12">
                    <el-form-item label='进入时间'  prop='CONFER3INTIME'>
                            <el-input v-model='detailForm.CONFER3INTIME' placeholder=""  readonly></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12">
                    <el-form-item label='离开时间'  prop='CONFER3OUTTIME'>
                            <el-input v-model='detailForm.CONFER3OUTTIME' placeholder=""  readonly></el-input>
                    </el-form-item>
                  </el-col>
              </el-row>
              <h4>其他信息</h4>
              <div style="border-top: 1px solid #ebeef5;margin:15px 22px 12px;"></div>
              <el-row :gutter="10">
                  <el-col :md="6" :lg="12">
                    <el-form-item label='音视频分离'  prop='FLFLAG'>
                            <el-select placeholder="请选择" v-model="detailForm.FLFLAG" :disabled="true">
                              <el-option
                                v-for="item in [{value:'0',label:'不分离'},{value:'1',label:'分离'}]"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                            </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12">
                    <el-form-item label='视频文件名'  prop='VIDEOFILENAME'>
                            <el-input v-model='detailForm.VIDEOFILENAME' placeholder="" readonly></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12">
                    <el-form-item label='视频创建ID'  prop='VIDEOUSERID'>
                            <el-input v-model='detailForm.VIDEOUSERID' placeholder="" readonly></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12">
                    <el-form-item label='处理代码'  prop='DEALCODE'>
                            <el-input v-model='detailForm.DEALCODE' placeholder="" readonly></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12">
                    <el-form-item label='处理信息'  prop='DEALMSG'>
                            <el-input v-model='detailForm.DEALMSG' placeholder="" readonly></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12">
                    <el-form-item label='最后活跃时间'  prop='LASTACTIVETIME'>
                            <el-input v-model='detailForm.LASTACTIVETIME' placeholder="" readonly></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="6" :lg="12">
                    <el-form-item label='会话类型'  prop='CONFERTYPE'>
                            <el-select placeholder="请选择" v-model="detailForm.CONFERTYPE" :disabled="true">
                              <el-option
                                v-for="item in [{value:'appchat',label:'文字'},{value:'video',label:'视频'}]"
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
          
          <!-- <el-card>
            <el-tabs :tab-position="'top'" style="height: 200px;">
              <el-tab-pane label="自身视频窗口配置">
                <el-form ref='addForm' :model='addForm'  size='mini' label-position="top" :rules="rules">
                  <el-row :gutter="10">
                      <el-col :md="6" :lg="12">
                        <el-form-item label='横坐标x'  prop='x'>
                                <el-input v-model='addForm.devNum' placeholder="请输入参数"  ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :md="6" :lg="12">
                        <el-form-item label='纵坐标y'  prop='y'>
                                <el-input v-model='addForm.devNum' placeholder="请输入参数"  ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :md="6" :lg="12">
                        <el-form-item label='宽度'  prop='width'>
                                <el-input v-model='addForm.devNum' placeholder="请输入参数"  ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :md="6" :lg="12">
                        <el-form-item label='高度'  prop='height'>
                                <el-input v-model='addForm.devNum' placeholder="请输入参数"  ></el-input>
                        </el-form-item>
                      </el-col>
                  </el-row>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="远程视频窗口配置">远程视频窗口配置</el-tab-pane>
              <el-tab-pane label="远程桌面窗口配置">远程桌面窗口配置</el-tab-pane>
              <el-tab-pane label="远程协助窗口配置">远程协助窗口配置</el-tab-pane>
            </el-tabs>
          </el-card> -->
      <div slot="footer" class="dialog-footer">
        <!-- <el-button  @click="configPopStatu=false" size="mini">取 消</el-button> -->
        <el-button type="primary" @click="EditModel" size="mini">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import getGlobalParams from "@/utils/getGlobalParams";
// import selectTree from "@/components/selectTree2/";
//通讯相关
import request from "@/utils/requestTest";
import tableIns from "@/message/video-manage/meetingQuery";
import editIns from "@/message/video-manage/vedioParameterEdit";
// import spinnerList from "@/message/spinnerDataQuery/spinner-data-query";

export default {
  name: "meeting-msg",
  // components: { selectTree },
  data() {
    return {
      loading: false,
      selectList: [],
      // brno: [],
      tableData: [
        {
        },
        {
        },
        {
        }
      ],
      currentPage: 1,
      pageSize: getGlobalParams.get("PageSize"),
      tableTotal: 0,
      queryForm: {
        MMID:"",
        CONFERID:"",
        STATUS:"",
        STARTDATE:"",
        ENDDATE:"",
      },
      rules: {//校验对象
        // // userID: [
        // //   { required: true, message: "请输入用户编号", trigger: "blur" }
        // // ],
        // branchId: [
        //   { required: true, message: "请选择机构号", trigger: "change" }
        // ],
        // userName: [
        //   { required: true, message: "请输入用户名称", trigger: "blur" },
        //   { max: 200, message: "用户名称长度少于200个字符", trigger: "blur" }
        // ],
        // // remark: [{ max:10, message: "请输入少于120位字符", trigger: "blur" }],
        // telephone: [
        //   { message: "手机号长度少于20个字符", max: 20, trigger: "blur" },
        //   { require: false, validator: validatorPhone, trigger: "blur" }
        // ],
        // emailAddress: [
        //   { max: 20, message: "邮箱长度少于20个字符", trigger: "blur" },
        //   { require: false, validator: validatorEmail, trigger: "blur" }
        // ],
        // jobNumber: [
        //   { required: true, message: "请输入工号", trigger: "blur" },
        //   {
        //     max: 20,
        //     message: "请输入正确工号，长度少于20个字符",
        //     trigger: "blur"
        //   }
        // ],
        // tellerNo: [
        //   { required: true, message: "请输入柜员号", trigger: "blur" },
        //   {
        //     max: 20,
        //     message: "请输入正确柜员号，长度少于20个字符",
        //     trigger: "blur"
        //   }
        // ]
      },
      //弹窗配置
      currOperation:1,//当前操作
      popTitle:"新增音视频配置模板",
      addForm:{
        showSelfVideoFlag:"",
        cameraWidth:"",
        cameraHeight:"",
        cameraMalv:"",
        cameraZhenlv:"",
        saveDeskFlag:"",
        saveDeskArea:"",//这是个json
        saveDeskMalv:"",
        saveDeskZhenlv:""
      },
      detailForm:{
        CONFER1:"",
        CONFER1NAME:"",
        CONFER1STATUS:"",
        CONFER1IP:"",
        CONFER1INTIME:"",
        CONFER1OUTTIME:"",
        CONFER2:"",
        CONFER2NAME:"",
        CONFER2STATUS:"",
        CONFER2IP:"",
        CONFER2INTIME:"",
        CONFER2OUTTIME:"",
        CONFER3:"",
        CONFER3NAME:"",
        CONFER3STATUS:"",
        CONFER3IP:"",
        CONFER3INTIME:"",
        CONFER3OUTTIME:"",

        FLFLAG:"",
        VIDEOFILENAME:"",
        VIDEOUSERID:"",
        DEALCODE:"",
        DEALMSG:"",
        LASTACTIVETIME:"",
        CONFERTYPE:"",
      },
      addPopStatu:false,
      detailPopStatu:false
    }
  },
  methods: {
    clearForm(item) {
      this.$refs["" + item].resetFields();
    },
    tableCheckBoxChange(val) {
      this.selectList = val;
    },
    openPop(type) {
      this.PopType = type;
      if (this.PopType == "add") {//新增
        this.popTitle="新增音视频配置模板"
        this.currOperation = 1;
        this.initPop();
        this.addPopStatu = true;
      } else if (this.PopType == "edit") {//编辑
        this.popTitle="修改音视频配置模板"
        this.currOperation = 2;
        this.addPopStatu = true;
      } else if (this.PopType == "del") {//删除
        this.currOperation = 3;
        this.delConfirm();
      } else {
        console.log("openPop 出错啦");
      }
    },
    async checkDetail(row) {
      this.detailForm=row;
      this.detailPopStatu=true;
    },
    //这个方法应该被轮询
    async queryModel() {
      this.loading = true;
      let resBody = new tableIns();
      resBody.data.MMID = this.queryForm.MMID;
      resBody.data.CONFERID = this.queryForm.CONFERID;
      resBody.data.STATUS = "1";//这里只查询正在进行的会议
      resBody.data.STARTDATE = this.queryForm.STARTDATE;
      resBody.data.ENDDATE = this.queryForm.ENDDATE;
      
      resBody.data.currpage = this.queryForm.currentPage;
      resBody.data.pagerownum = this.queryForm.pageSize;
      // resBody.data.endTime = this.queryForm.eTime;
      // resBody.QueryPageNo = this.currentPage;
      // resBody.QueryRowNum = this.pageSize;
      let response = await request(resBody);
      this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        this.tableData = response.RSP_BODY.resultSet;
        this.tableTotal = response.RSP_BODY.TotalNum||response.QUERY_INFO_HEAD.QueryAllDataCount;
      } else {
        this.$message({
            type: "error",
            message: "请求失败，错误码:" + response.SYS_HEAD.ReturnCode + "，错误信息：" + response.SYS_HEAD.ReturnMessage
          });
      }
    },
    async EditModel() {
      this.loading = true;
      let resBody = new editIns();
      resBody.data.OPERATION = this.currOperation+'';//1新增 2修改 3删除
      resBody.data.layoutid = this.queryForm.configId;////需要修改！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
      resBody.data.layouname = this.queryForm.styleName;////需要修改！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！

      resBody.data.selfVideoStyle = this.addForm;
      resBody.data.remoteVideoStyle = this.addForm;
      resBody.data.remoteDeskStyle = this.addForm;
      resBody.data.remoteHelpStyle = this.addForm;
      
      let response = await request(resBody);
      this.loading = false;
      if (response.SYS_HEAD.ReturnCode == "000000") {
        if(this.currOperation==1){
            this.$message({
            type: "success",
            message: "新增成功"
          });
        }
        else if(this.currOperation==2){
          this.$message({
            type: "success",
            message: "修改成功"
          });
        }
        else if(this.currOperation==3){
          this.$message({
            type: "success",
            message: "删除成功"
          });
        }
        else{}
      } else {
        this.$message({
          type: "error",
          message: "请求失败，错误码:" + response.SYS_HEAD.ReturnCode + "，错误信息：" + response.SYS_HEAD.ReturnMessage
        });
      }
    },
    delConfirm(){
      this.$confirm('此操作将删除xxx, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.EditModel();
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // });          
      });
    },
    handleSizeChange(val) { this.pageSize=val;
      this.queryModel();
    },
    handleCurrentChange() {
      this.queryModel();
    },
    //弹窗部分的方法
    validatorPhone(rule, value, callback){
      if (value != "") {
        let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的手机号"));
        }
      } else {
        callback();
      }
    },
    initPop(){
      this.addForm={
        selfVideoStyle:{
          x:'',
          y:'',
          width:'',
          height:''
        },
        remoteVideoStyle:{
          x:'',
          y:'',
          width:'',
          height:'',
          showTitle:1,
          showLogo:1,
          showVideo:1,
          showPro:1,
          showCopy:1
        },
        remoteDeskStyle:{
          x:'',
          y:'',
          width:'',
          height:'',
          showTitle:1,
        },
        remoteHelpStyle:{
          x:'',
          y:''
        }
      }
    },
  },
  // async created() {
  //   let resBody = new spinnerList();
  //   resBody.data.spinnerList = [{ spinnerName: "branch" }];
  //   let response = await request(resBody);

  //   if (response.SYS_HEAD.ReturnCode == "000000") {
  //     //在之后要塞入空选项
  //     this.brno = response.RSP_BODY.branchSpinner;
  //   } else {
  //     this.$message({
  //           type: "error",
  //           message: "请求失败，错误码:" + response.SYS_HEAD.ReturnCode + "，错误信息：" + response.SYS_HEAD.ReturnMessage
  //         });
  //   }
  // },
  // mounted() {
  //   // console.log(this.devNumberTableData);
  //   this.queryModel();
  // },
};
</script>


<style lang="scss">
.box {
  margin-top: 20px;
  text-align: right;
}
.el-card {
  overflow: inherit;
}
</style>
