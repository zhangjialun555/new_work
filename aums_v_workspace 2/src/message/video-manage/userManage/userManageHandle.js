// 视频管理-平台用户管理-ADD-MODIFY
export default class requestContent {
  constructor() {
    // 上送报文字段定义
    this.data = {
      OPERATION: '',
      USERNAME: '',
      USERPWD: '',
      USERLEVEL: '',
      USERIP: '',
      USERMAC: '',
      USERCHANNEL: '',
      USERFLAG: '',
      LAYOUTID: '',
      FORZIZHUVIDEOID: '',
      FORAPPVIDEOID: '',
      FOROTHERVIDEOID: '',
      REMARK1: ''
    }
    // 交易码，每次新建此文件，修改此处为对应的交易码即可
    this.TransServiceCode = 'arb.arcs.cms023.01';
  }
}
