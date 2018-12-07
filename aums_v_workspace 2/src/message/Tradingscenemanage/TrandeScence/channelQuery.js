// 渠道交易场景查询：
export default class requestContent {
  constructor() {
    // 上送报文字段定义
    this.data = {
      CHANNEL: '',
      TRANCODE: '',
      SCENECODE: '',
      SCENECODENAME: '',
      pageflag: '',
      currpage: '',
      pagerownum: ''
    }
    // 交易码，每次新建此文件，修改此处为对应的交易码即可
    this.TransServiceCode = 'MS_CHANTRANQUERY';
  }
}
