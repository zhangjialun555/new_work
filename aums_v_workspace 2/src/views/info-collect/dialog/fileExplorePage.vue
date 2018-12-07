<template>
   <div class='branch-manage' @click="closePop" v-if="isShow" v-loading="loading">
     <!-- <div id="returnBtnTop" :class="{searchBarFixed:searchBarFixed}">
         <el-button @click="isShow=false" style="margin:10px;" size="mini">返回</el-button>
     </div> -->
      <el-card>
          <div slot="header">
            <el-button @click="isShow=false" type="primary" style="margin:0 10px 0 0;" size="mini">返回</el-button><span>机具文件浏览 (当前机具IP: {{devObj.devIp}})</span>
         </div>
         <!-- <div slot="header"  class="clearfix">

         </div> -->
         <el-row>
            <el-col :span="6" >
                <el-card >
                  <!-- <div  style="height:380px;overflow:auto"> -->
                  <div  style="height:570px;overflow:auto">
                    <el-tree
                        ref="fileTree"                        
                        :props="defaultProps"
                        node-key="id"
                        render-after-expand

                        class="filter-tree"
                        :filter-node-method="filterNode"
                        
                        @node-click="handleNodeClick"
                        :expand-on-click-node=false
                        :highlight-current=false

                        lazy
                        :load="loadFileNode"
                            >
                    </el-tree>
                  </div>
                  <!-- <div  style="height:180px">
                    <hr>
                    <h5>常用目录</h5>
                    <ul class="commonUse">
                      <li>C://pc6</li>
                      <li>D://tomcat-7.0.6/lib</li>
                      <li>C://mglive/main/bin</li>
                    </ul>
                  </div> -->
                    
                </el-card >
            </el-col>
            <el-col :span="18">
              <el-card style = "margin-left: 1%;width: 99%;height:100%"  >
                <el-row>
                  <el-col :span="18" style="min-height:33px">
                    <el-breadcrumb separator-class="el-icon-arrow-right"  style="line-height: 32px;">
                          <el-breadcrumb-item v-for="(item,index) in breadData" :key="index" @click.native="handleNodeClick(item.instance)">{{item.name}}</el-breadcrumb-item>
                      </el-breadcrumb>
                  </el-col>
                  <!-- 暂时取消功能 -->
                  <!-- <el-col :span="4" >
                      <el-button type='primary' icon='el-icon-edit-outline' class='b-button' size="small" :span="4"
                                                        @click='addToCommon' disabled>添加到常用路径</el-button>
                  </el-col> -->
                  <el-col :span="6" >
                      <el-button type='primary' icon='el-icon-upload2' class='b-button' size="small" :span="4"
                                                        @click='showUploadPop = true' style="margin: 0 0 0 10px;" :disabled="!currentPath">上传文件到当前路径</el-button>
                  </el-col>
                </el-row>
                <ul class="fileDetail" style="height:503px" @scroll="closePop">
                  <li class="fileDetailTitle"><span>文件名</span><span>修改日期</span><span>文件类型</span><span>大小</span></li>
                  <li class="fileDetailItem" v-for="(item,index) in fileDetail" :key="index" @dblclick="handleNodeClick(item)" @mousedown="itemRightClick(index,item,$event)" tabindex='-1'><span><i class="fa" :class="itemIcon(item.type)" style="margin:0 5px 0 0"></i>{{item.label}}</span><span>{{formatTime(item.lastModifi)}}</span><span>{{item.type}}</span><span class="text-right">{{formatFileSize2(item.size)}}</span></li>
                </ul>
                <div class="filePop" style="background:#fff;border:1px solid #000;position:absolute;width:100px" v-if="showPop" :style="{left: popLeft,top:popTop}">
                  <ul>
                    <li @click="downloadFile">下载</li>
                    <li @click="deleteHandle">删除</li>
                    <li @click="showRenamePop = true">重命名</li>
                  </ul>
                </div>
              </el-card >
            </el-col>
        </el-row>

      </el-card>
    <el-dialog
      title="上传文件"
      :visible.sync="showUploadPop"
      width="450px"
      :lock-scroll=false>
      <el-card>
      <!-- <el-input type="file" id="fileInp" ref="refFile"></el-input> -->
      <!-- <form action="" id="uploadForm"> -->
        <input type="file"  id="fileInp" ref="refFile">
      <!-- </form> -->
      <!-- <el-upload
        class="upload-demo"
        ref="upload"
        action="https://jsonplaceholder.typicode.com/posts/"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :file-list="fileList"
        :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload> -->
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showUploadPop = false">取 消</el-button>
        <el-button type="primary" @click="uploadFile">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="重命名"
      :visible.sync="showRenamePop"
      width="450px"
      :lock-scroll=false
      >
      <el-card>
        <el-input type="text" v-model="filePathNew"></el-input>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showRenamePop = false">取 消</el-button>
        <el-button type="primary" @click="renameFile">确 定</el-button>
      </span>
    </el-dialog>
   </div>
</template>

<script>
//通讯相关
import request from "@/utils/request";
import fileQueryIns from "@/message/deviceRunManage/file-query";
import fileUploadIns from "@/message/deviceRunManage/file-upload";
import fileDownloadIns from "@/message/deviceRunManage/file-download";
import fileDeleteIns from "@/message/deviceRunManage/file-delete";
import fileRenameIns from "@/message/deviceRunManage/file-rename";
//其他
import getGlobalParams from "@/utils/getGlobalParams";
import Vue from "vue";
// import toolBox from "@/utils/toolBox";
//禁用右键菜单
document.oncontextmenu = function() {
  return false;
};
export default {
  data() {
    return {
      // clientIp: window.sessionStorage.currentIp, //当前机具ip
      // searchBarFixed: false,
      // fileData: [],
      loading:false,
      fileDetail: [], //显示右侧文件列表
      breadData: [], //面包导航数组
      currentPath: "",
      // tempBreadData:[],
      defaultProps: {
        children: "child",
        label: "label",
        branchid: "id",
        isLeaf: "leaf"
      }, //树递归所用
      showPop: false, //显示右键弹窗
      showUploadPop: false, //显示上传弹窗
      showRenamePop: false, //显示重命名弹窗
      popLeft: "3px", //右键弹窗位置
      popTop: "3px", //右键弹窗位置
      commonPath: [{ name: "日志目录", path: "" }], //常用目录
      selectedItem: {}, //右键选中项目,
      filePathNew: "" //修改文件名用
      // buttonDisabled:true//暂时启用禁用功能
    };
  },
  components: {},
  beforeMount: function() {
    // this.getParams();
  },
  mounted: function() {
    // window.addEventListener("scroll", this.handleScroll);
    // console.log(Vue);
  },
  methods: {
    //过滤方法
    filterNode(value, data) {
      if (!value) return true;
      return data.type == "file";
    },
    //打开文件方法
    async handleNodeClick(node) {
      this.closePop();
      if (node.type != "") {
        return;
      } else {
        let data = await this.queryFile(node.id, "0"); //输出格式化后数组
        try {
          this.fileDetail = data;
          this.currentPath = node.id;
          // console.log(node.id);
          this.newGetPath(node);
          // this.getRealPath(this.fileData, data.id, this);
          // this.breadData = this.tempBreadData;
        } catch (err) {}
      }
    },
    // handleScroll() {
    //   var scrollTop =
    //     window.pageYOffset ||
    //     document.documentElement.scrollTop ||
    //     document.body.scrollTop;
    //   if (document.querySelector("#returnBtnTop")) {
    //     var offsetTop = document.querySelector("#returnBtnTop").offsetTop;
    //     if (scrollTop > offsetTop) {
    //       this.searchBarFixed = true;
    //     } else {
    //       this.searchBarFixed = false;
    //     }
    //   }
    // },
    //获取文件路径放到tempBreadData中reverse
    // getpath(jsontree, branchno, root) {
    //   if (
    //     typeof jsontree == "object" &&
    //     jsontree.constructor == Object.prototype.constructor
    //   ) {
    //     var arrey = [];
    //     arrey.push(jsontree);
    //   } else arrey = jsontree;
    //   for (var i = 0; i < arrey.length; i++) {
    //     var jn = arrey[i];
    //     if (jn.id == branchno) {
    //       root.tempBreadData.push({ name: jn.label, instance: jn });
    //       if (jn.id == root.fileData[0].id) {
    //         return;
    //       } else {
    //         root.getpath(root.fileData, jn.fatherId, root);
    //       }
    //     }
    //     if (jn.child && jn.child.length > 0) {
    //       root.getpath(jn.child, branchno, root);
    //     }
    //   }
    // },
    //清空过程数组并且反转
    // getRealPath(jsontree, branchno, root){
    //   this.tempBreadData = [];
    //   this.getpath(jsontree, branchno, root);
    //   this.tempBreadData.reverse();
    //   // console.log(this.tempBreadData,this.breadData);
    // },
    //新方法获取路径
    newGetPath(clickNode) {
      let pathArr = String(clickNode.id).split("//");
      this.breadData = [];
      let idStr = "";
      for (var i = 0; i < pathArr.length; i++) {
        if (i == 0) {
          idStr += pathArr[i];
        } else {
          idStr += "//" + pathArr[i];
        }
        this.breadData.push({
          name: pathArr[i],
          instance: { type: "", id: idStr }
        });
      }
    },
    //懒加载尝试
    async loadFileNode(node, resolve) {
      // this.getRealPath(this.fileData,node.id,this);
      // console.log(this.breadData);//用于面包导航展示
      // console.log(this.tempBreadData);//用于处理过程 包括展开文件夹 路径应当应用于列表的加载
      // console.log(node.level);
      if (node.level === 0) {
        let data = await this.queryFile("", "0");
        // console.log(data);
        resolve(data);
      } else {
        let data = await this.queryFile(node.key, "0");
        resolve(data);
      }
      // if (node.level > 1) return resolve([]);

      // setTimeout(() => {
      //   const data = [
      //     {
      //       name: "leaf",
      //       leaf: true
      //     },
      //     {
      //       name: "zone"
      //     }
      //   ];

      //   resolve(data);
      // }, 500);
    },
    //通讯请求文件方法（和树组件懒加载一同食用）
    async queryFile(baseDirectory, recursion) {
      this.loading = true;
      let resBody = new fileQueryIns();
      resBody.data.clientIp = this.devObj.devIp||"";
      resBody.data.baseDirectory = baseDirectory;
      resBody.data.recursion = recursion;
      let response = await request(resBody);
      try {
        this.loading = false;
        let output = [];
        if (response.SYS_HEAD.ReturnCode == "000000") {
          let tempItem = JSON.parse(response.RSP_BODY.content);
          for (var k in tempItem) {
            output.push({
              id:
                tempItem[k].absolutePath ||
                String(tempItem[k].relativePath).replace("//", ""),
              fatherId: baseDirectory,
              label: tempItem[k].fileName,
              size: tempItem[k].size || "",
              lastModifi: tempItem[k].lastModified,
              leaf: !tempItem[k].isDirectory,
              type: tempItem[k].extension || ""
            });
          }
        } else {
          this.isShow=false;
          this.$message({
            type: "error",
            message: "请求失败，错误码:" + response.SYS_HEAD.ReturnCode + "，错误信息：" + response.SYS_HEAD.ReturnMessage
          });
        }
        return output;
      } catch (err) {
        this.isShow=false;
        // this.logger.log("fail", err);
      }
    },
    //当前路径添加到常用
    addToCommon() {},
    //渲染列表图标
    itemIcon(type) {
      switch (type) {
        case "":
          return "fa-folder-o";
        case "doc":
          return "fa-file";
        case "img":
          return "fa-photo";
        default:
          return "fa-file";
      }
    },
    //右键功能
    itemRightClick(index, item, e) {
      if (e.button == 2) {
        e.preventDefault();
        e.target.parentNode.focus();
        this.openPop(window.event.pageX, window.event.pageY);
        this.selectedItem = item;
        this.filePathNew = item.label;
      }
    },
    //打开右键弹窗
    openPop(pageX, pageY) {
      this.showPop = true;
      this.popLeft = pageX - 198 + "px";
      this.popTop = pageY - 192 + "px";
    },
    //关闭右键弹窗
    closePop() {
      this.showPop = false;
    },
    //更新树节点并更新右侧列表方法
    async updateTreeAfterOpreat() {
      let updateNodeKey = this.currentPath;
      let data = await this.queryFile(updateNodeKey, "0");
      this.$refs.fileTree.updateKeyChildren(updateNodeKey, data);
      this.fileDetail = data;
    },
    //下载文件
    async downloadFile() {
      // console.log(this.selectedItem);
      //实例化对象 进行通讯
      this.loading = true;
      let resBody = new fileDownloadIns();
      resBody.data.clientIp = this.devObj.devIp;
      resBody.data.filePath = this.selectedItem.id;
      let response = await request(resBody);
      try {
        this.loading = false;
        if (response.SYS_HEAD.ReturnCode == "000000") {
          // window.location.href=response.RSP_BODY.fileUrl;//下载还有问题
          this.downloadFile(response.RSP_BODY.fileUrl);
        } else {
          athis.$message({
            type: "error",
            message: "请求失败，错误码:" + response.SYS_HEAD.ReturnCode + "，错误信息：" + response.SYS_HEAD.ReturnMessage
          });
        }
      } catch (err) {
        // this.logger.log("fail", err);
      }
    },
    deleteHandle() {
      this.$confirm("您确定是否要删除选中项，删除后将不能恢复", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.queryDelete();
      }).catch(function(){return});
    },
    //删除文件
    async queryDelete() {
      //实例化对象 进行通讯
      this.loading = true;
      let resBody = new fileDeleteIns();
      resBody.data.clientIp = this.devObj.devIp;
      resBody.data.filePath = this.selectedItem.id;
        let response = await request(resBody);
        try {
          this.loading = false;
          if (response.SYS_HEAD.ReturnCode == "000000") {
            //请求成功 重新请求分支
            await this.updateTreeAfterOpreat();
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          } else {
            this.$message({
              type: "error",
              message: "请求失败，错误码:" + response.SYS_HEAD.ReturnCode + "，错误信息：" + response.SYS_HEAD.ReturnMessage
            });
          }
        } catch (err) {
          // this.logger.log("fail", err);
        }
    },
    //重命名文件
    async renameFile() {
      //实例化对象 进行通讯
      this.loading = true;
      let resBody = new fileRenameIns();
      resBody.data.clientIp = this.devObj.devIp;
      resBody.data.filePath = this.selectedItem.id;
      var pathArr = this.selectedItem.id.split("//");
      pathArr.splice(pathArr.length - 1, 1);
      resBody.data.filePathNew = pathArr.concat(this.filePathNew).join("//");
      let response = await request(resBody);
      try {
        this.loading = false;
        if (response.SYS_HEAD.ReturnCode == "000000") {
          //请求成功 重新请求分支
          this.showRenamePop = false;
          await this.updateTreeAfterOpreat();
          this.$message({
            type: "success",
            message: "重命名成功!"
          });
        } else {
          this.$message({
            type: "error",
            message: "请求失败，错误码:" + response.SYS_HEAD.ReturnCode + "，错误信息：" + response.SYS_HEAD.ReturnMessage
          });
        }
      } catch (err) {
        // this.logger.log("fail", err);
      }
    },
    //上传文件
    async uploadFile() {
      if(this.currentPath==""){
        this.$message({
          type: "info",
          message: "请打开一个当前路径!"
        });
        return
      }
      //上传文件
      //成功关闭弹窗清空文件
      //未成功提示并且不关闭弹窗
      this.loading = true;
      var thatVueIns = this;
      let resBody = new fileUploadIns();
      resBody.data.clientIp = this.devObj.devIp;
      var fileData = document.getElementById("fileInp").files[0];
      resBody.data.filePath = this.currentPath + "//" + fileData.name;
      var reader = new FileReader();
      reader.readAsDataURL(fileData);
      reader.onloadend = async function() {
        var fileBase64 = reader.result.split(",")[1]; // 读出 base64
        resBody.data.fileContent = fileBase64;
        let response = await request(resBody);
        try {
          this.loading = false;
          if (response.SYS_HEAD.ReturnCode == "000000") {
            thatVueIns.showUploadPop = false; //这里的this指向reader所以使用VueIns来传递this
            await thatVueIns.updateTreeAfterOpreat();
            this.$message({
              type: "success",
              message: "上传成功!"
            });
          } else {
            this.$message({
              type: "error",
              message: "请求失败，错误码:" + response.SYS_HEAD.ReturnCode + "，错误信息：" + response.SYS_HEAD.ReturnMessage
            });
          }
        } catch (err) {
          // this.logger.log("fail", err);
          console.log(err);
        }
      };
    },

    //可能全局化方法
    //格式化时间12312849124->2018/03/03 18:31:10
    formatTime(timeNum) {
      if (timeNum == "" || undefined) {
        return;
      }
      let time = new Date(timeNum);
      let Y = time.getFullYear();
      let M = Number(time.getMonth()) + 1;
      let D = time.getDate();
      let h = String(time.getHours());
      let m = String(time.getMinutes());
      let s = String(time.getSeconds());
      h.length < 2 ? "0" + h : h;
      m.length < 2 ? "0" + m : m;
      s.length < 2 ? "0" + s : s;
      return "" + Y + "/" + M + "/" + D + " " + h + ":" + m + ":" + s;
    },
    //文件大小
    // formatFileSize(sizeB){
    //   let k=Number(sizeB)/1024;
    //   if(k<=1){
    //     return Number(sizeB)+"B"
    //   }
    //   else {
    //     let m=Math.ceil(k)/1024;
    //     if(m<=1){
    //       return k+"KB"
    //     }
    //     else {
    //       let g=Math.ceil(m)/1024;
    //       if(g<=1){
    //         return m+"MB"
    //       }
    //       else {
    //         return g+"GB"
    //       }
    //     }
    //   }
    // },
    //文件大小格式化2
    formatFileSize2(sizeB) {
      if (sizeB == "" || undefined) {
        return;
      }
      let k = Number(sizeB) / 1024;
      return String(Math.floor(k)).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "KB";
    },
    //进入页面时获取数据
    // getParams() {
      // let routerParams = this.$route.params.dataObj.ip;
      // let routerParams = window.sessionStorage.currentIp;
      // this.clientIp = routerParams;
    // }
  },
  props: { option: Object , devObj:""},
  computed: {
    isShow: {
      get: function() {
        //过滤掉非文件夹的文件 不做过滤了 有问题
        // this.$refs.fileTree.filter("file");
        return this.option.isShow;
      },
      set: function(newValue) {
        this.option.isShow = newValue;
      }
    }
  },
  watch: {
    // clientIp(val,old){
    //   console.log(val+"xxx");
    //   console.log(old+"xx");
    // }
  //   '$route': 'getParams',
  //   deep:true
  }
};
</script>


<style lang="scss" scoped>
.fl {
  float: left;
}
.text-right {
  text-align: right;
}
.cardStyle {
  margin: 5px 0;
}
.listEdit {
  text-align: right;
  & a {
    margin: 5px;
  }
}
.demo-table-expand .el-form-item {
  margin-bottom: 0;
}
.fileDetail {
  list-style: none;
  padding: 0;
  position: relative;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  overflow: auto;
}
.fileDetailTitle {
  height: 30px;
  line-height: 30px;
  margin: 0 0 12px 0px;
}
.fileDetailTitle > span {
  border-right: 1px solid #e0e0e0;
}
.fileDetailItem {
  cursor: default;
  height: 25px;
  line-height: 25px;
}
.fileDetailItem:hover {
  background: rgb(216, 229, 248);
}
.fileDetailItem:focus {
  background: #08f;
  outline: none;
}
.fileDetail > li > span {
  display: inline-block;
  padding: 0 10px;
}
.fileDetail > li > span:nth-child(1) {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 50%;
}
.fileDetail > li > span:nth-child(2) {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 22%;
}
.fileDetail > li > span:nth-child(3) {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 11%;
}
.fileDetail > li > span:nth-child(4) {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 17%;
}
.commonUse {
  list-style: none;
  padding: 0;
}
.commonUse > li {
  cursor: pointer;
}
.commonUse > li:hover {
  background: rgb(216, 229, 248);
}

.filePop > ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.filePop > ul > li {
  line-height: 25px;
  height: 25px;
  text-align: center;
  cursor: pointer;
}
.filePop > ul > li:hover {
  background: rgb(216, 229, 248);
}
// .searchBarFixed {
//   position: fixed;
//   z-index: 1000;
//   top: 0;
//   box-sizing: border-box;
// }
</style>
