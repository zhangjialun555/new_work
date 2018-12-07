// 输入物料信息维护
export default class requestContent {
  constructor() {
    // 上送报文字段定义
    this.data = {
      OPERTYPE: '', // 1新增，2删除
      MATLID: '',
      COLLMODE: '',
      COLLANDAUDTMODE: '',
      MODORGNO: '',
      MODUSER: ''
    }
    // 交易码，每次新建此文件，修改此处为对应的交易码即可
    this.TransServiceCode = 'MS_INMATLRCMGT';
  }
}
