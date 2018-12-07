// 视频管理-平台用户管理-QUERY
export default class requestContent {
  constructor() {
    // 上送报文字段定义
    this.data = {
      pageflag: '4',
      currpage: '',
      pagerownum: '',
      USERID: '',
      USERNAME: '',
      USERSTATUS: '',
      USERIP: '',
      USERCHANNEL: '',
      USERFLAG: ''
    }
    // 交易码，每次新建此文件，修改此处为对应的交易码即可
    this.TransServiceCode = 'arb.arcs.cms022.01';
  }
}
