// 网点用户交割能力维护
export default class requestContent {
  constructor() {
    // 上送报文字段定义
    this.data = {
      OPERTYPE: '', // 1-新增 2-删除
      ORGNO: '',
      USERNO: '',
      ABILITYID: '',
      MODORGNO: '',
      MODUSER: ''
    }
    // 交易码，每次新建此文件，修改此处为对应的交易码即可
    this.TransServiceCode = 'MS_NTWUSERDLVMNT';
  }
}
