<template>
  <div class="hello">  
    <div style="text-align:right">
      <download-excel
            class = "export-excel-wrapper"
            :data = "tableData"
            :fields = "json_fields"
            name = "userlist.xls">
            <!-- 上面可以自定义自己的样式，还可以引用其他组件button -->
            <el-button type="primary" size="large">导出EXCEL</el-button>
      </download-excel>
    </div>
    <el-table :data="tableData" stripe>
      <el-table-column prop="uid" label="编号" width="100">
      </el-table-column>
      <el-table-column prop="username" label="用户名" width="150">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="200">
      </el-table-column>
      <el-table-column
        label="注册时间"
        width="300">
        <template slot-scope="scope">          
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.regTime|dateFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="用户类型"
        width="150">
        <template slot-scope="scope">          
          
          <span style="margin-left: 10px" v-if="scope.row.type==2">管理员用户</span>
          <span style="margin-left: 10px" v-else>普通用户</span>
        </template>
      </el-table-column>
      <el-table-column
        label="头像"
        width="150">
        <template slot-scope="scope">          
          <el-avatar :size="25" :src="picIp+scope.row.image"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
          <el-button type="text" size="small" v-if="scope.row.type==1" @click="handle(scope.row)">禁用</el-button>
          <el-button type="text" size="small" v-if="scope.row.type==0" @click="handle(scope.row)">解禁</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      :page-size="pageSize"
      :page-count="pageCount"
      :current-page="currentPage"      
      layout="sizes,prev, pager, next"
      :total="total"
      @current-change="changePage"
      @size-change="handleSizeChange"
      :page-sizes="[5,10,20]">
    </el-pagination>
  </div>
</template>
<script>
// import {formatDate} from '../assets/js/formatDate'
import docxtemplater from 'docxtemplater'
import PizZip from 'pizzip'
import JSZipUtils from 'jszip-utils'
import {saveAs} from 'file-saver'
import ImageModule from 'docxtemplater-image-module-free'
export default {
  name: 'UserList',
  data () {
    return {
      tableData:[],
      json_fields: {
        "用户编号": "uid",    //常规字段
        "用户名": "username",    //常规字段
        "邮箱": "email", //支持嵌套属性
        "注册时间": "regTime", //支持嵌套属性
        "用户类型": {
          field: "type",
                    //自定义回调函数
          callback: type => {
            if(type==1){
              return "普通用户"
            }else if(type==2){
              return "管理员用户"
            }else{
              return "封禁用户";
            }            
          }
        }
      },
      pageSize:10,//每页显示条目个数
      pageCount:10,//总页数
      total:100,//总条目数
      currentPage:1,//当前页数
      picIp: "http://localhost:8080/pic/"
    }
  },
  computed:{
    formatDate() {
      return formatDate;
    },
  },
  created(){
    this.getList();
  },
  methods:{
    handleSizeChange(val) {
      this.pageSize=val;
      this.getList();
    },
    getList(){
      this.axios.get("user/page?current="+this.currentPage+"&size="+this.pageSize).then(response=>{
        this.tableData=response.data.records;
        this.pageCount=response.data.pages;
        this.total=response.data.total;
      })
    },
    handleClick(row) {
      console.log(row);
      if(row.type==1){
        row.type="普通用户"
      }else if(row.type==2){
        row.type="管理员用户"
      }else{
        row.type="封禁用户"
      }
      row.userImage=this.picIp+row.image;
        let that = this;
        // 读取并获得模板文件的二进制内容
        JSZipUtils.getBinaryContent("../../static/user.docx", function(error, content) {
          // model.docx是模板。我们在导出的时候，会根据此模板来导出对应的数据
          // 抛出异常
          if (error) {
            throw error;
          }
          var opts = {}
          opts.centered = false;
          opts.getImage = function (tagValue, tagName) {
            return new Promise(function (resolve, reject) {
              JSZipUtils.getBinaryContent(tagValue, function (error, content) {
                if (error) {
                  return reject(error);
                }
                return resolve(content);
              });
            });
          }
          opts.getSize = function (img, tagValue, tagName) {
              return [50, 50];//图片大小 
          }
          var imageModule = new ImageModule(opts);
          // 创建一个PizZip实例，内容为模板的内容
          var zip = new PizZip(content);
              var doc = new docxtemplater()
                .loadZip(zip)
                .attachModule(imageModule)
                .compile();
              doc.resolveData(row).then(function () {
                doc.render();
                var out = doc.getZip().generate({
                  type: "blob",
                  mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                });
                //输出文档
                saveAs(out, "userInfo.docx");
              })
        });
    },
    handle(row) {  
      //console.log(row);
      if(row.type==0){
            row.type=1;
          } else{
            row.type=0;
          }
      this.axios.get("user/disable?uid="+row.uid+"&type="+row.type).then(res=>{
           
      })
    },
    changePage(currentPage){
      this.currentPage=currentPage;
      this.getList();
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
