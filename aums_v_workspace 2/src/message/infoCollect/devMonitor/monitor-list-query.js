export default class requestContent {
  constructor() {
    this.data = {
      branchIdList: '',
      devTypeNum: '',
      devRunningStatus: '',
      devState: ''
    }
    this.TransServiceCode = 'aums.v125_device_monitor_list_query';
    this.QueryRowNum = '';
    this.QueryPageNo = '';
  }
}
