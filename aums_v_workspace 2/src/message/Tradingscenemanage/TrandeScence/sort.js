// 交易场景排序：
export default class requestContent {
  constructor() {
    // 上送报文字段定义
    this.data = {
      OPERTYPE: '',
      TRANCODE: '',
      DOTYPE: '',
      SCENECODE: '',
      SCENESEQ: '',
      MATLID: '',
      SERLNUM: '',
      MATLGROUPID: ''
    }
    // 交易码，每次新建此文件，修改此处为对应的交易码即可
    this.TransServiceCode = 'MS_SORT';
  }
}
