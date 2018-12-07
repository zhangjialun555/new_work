<template>
        <div class="table_c">
            <div class="table_all">
                <el-card shadow="hover" class="tebale_card">
                    <el-table 
                    :data="tableData" 
                    style="width: 100%;"  cell-class-name="rowC"
                    header-cell-class-name="rowH" 
                    row-class-name = "rowR"
                    :row-style="getRowClass" 
                    :header-row-style="getRowClass" 
                    :header-cell-style="getRowClass">
                        <el-table-column prop="date" label="日期" width="180">
                        </el-table-column>
                        <el-table-column prop="name" label="姓名" width="180">
                        </el-table-column>
                        <el-table-column prop="address" label="地址">
                        </el-table-column>
                        <el-table-column  prop="image" label="图片" min-width="20%" > 
                            <template slot-scope="scope">
                                <img :src="scope.row.image" width="20" height="20"/>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </div>
        </div>
    </template>

    <script>
    export default {
        name: "TableC",
        data() {
            return {
                tableData: [
                    {
                        date: "测试",
                        name: "测试",
                        address: "测试",
                        image: '../../../static/logo/ok.png',
                    },
                    {
                        date: "测试",
                        name: "测试",
                        address: "测试",
                        image: '../../../static/logo/ok.png',
                    },
                    {
                        date: "测试",
                        name: "测试",
                        address: "测试",
                        image: '../../../static/logo/ok.png',
                    },
                    {
                        date: "测试",
                        name: "测试",
                        address: "测试",
                        image: '../../../static/logo/ok.png',
                    }
                ]
            };
        },
        methods: {
            getRowClass({ row, column, rowIndex, columnIndex }) {
                return "background:#3f5c6d2c;color:#000;";
            },
        }
    };
    </script>

    <style  >
    .table_c {
        width: 100%;
        height: 500px;
        background: url("../../../static/logo/backGrand.png") center
        center no-repeat;
        background-size: 100% auto;
        padding: 10px;
    }
    .tebale_card {
        background-color: #3f5c6d2c;
       border: 0px;
    }
    .el-table,
    .el-table__expanded-cell {
        background-color: #3f5c6d2c;
        border: 0px;
    }
    .el-table--border{
        border: 0px;
    }
    .rowC{
      border: 0px !important;
    }
    .rowH{
      border: 0px !important;
    }
    .rowR{
      border: 0px !important;
    }
    .el-table__body-wrapper{
        border: 0px !important;
        padding: 0px;
        margin: 0px
    }
    .cell{}

    </style>