<template>
  <div class="hello">
    <el-table :data="tableData" stripe>
      <el-table-column prop="newsid" label="编号" width="140"></el-table-column>
      <el-table-column prop="title" label="标题" width="500"></el-table-column>
      <el-table-column prop="from" label="来源" width="140"></el-table-column>
      <el-table-column label="发表时间" width="300">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{
            scope.row.time | dateFilter
          }}</span>
        </template>
      </el-table-column>
      
      <el-table-column
        label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
          <el-button type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
    background
    :page-size="pageSize"
    :page-count="pageCount"
    :current-page="currentPage"
    layout="sizes,prev,pager,next"
    :total="total"
    @current-change="changePage"
    @size-change="handleSizeChange"
    :page-sizes="[5, 10, 20]">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      tableData: [],
      pageSize: 10, //每页显示个数
      pageCount: 10, //总页数
      total: 100, //总条目数
      currentPage: 1, //当前页
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.getList();
    },
    getList() {
      this.axios
        .get(
          "news/getPageNews?current=" +
            this.currentPage +
            "&size=" +
            this.pageSize
        )
        .then((response) => {
          this.tableData = response.data.records;
          this.pageCount = response.data.pages;
          this.total = response.data.total;
        });
    },
    changePage(currentPage) {
      this.currentPage = currentPage;
      this.getList();
    },
    handleClick(row){
      console.log(row);
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
