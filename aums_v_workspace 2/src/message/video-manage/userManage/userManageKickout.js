// 视频管理-平台用户管理-注销用户
export default class requestContent {
  constructor() {
    // 上送报文字段定义
    this.data = {
      RspStruct: ''
    }
    // 交易码，每次新建此文件，修改此处为对应的交易码即可
    this.TransServiceCode = 'arb.arcs.cms033.01';
  }
}

