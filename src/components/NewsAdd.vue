<template>
  <div class="hello">
    <h2>添加新闻</h2>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
      <el-form-item label="新闻标题" prop="title">
        <el-input v-model="ruleForm.title"></el-input>
      </el-form-item>
      <el-form-item label="新闻分类" prop="kindid">
        <el-select v-model="ruleForm.kindid" placeholder="请选择新闻分类">
          <el-option
            v-for="item in options"
            :key="item.kindId"
            :label="item.content"
            :value="item.kindId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="新闻来源" prop="source">
        <el-input v-model="ruleForm.source"></el-input>
      </el-form-item>
      <el-form-item label="新闻编辑" prop="editor">
        <el-input v-model="ruleForm.editor"></el-input>
      </el-form-item>
      <el-form-item label="新闻类型" prop="type">
        <el-select v-model="ruleForm.type" placeholder="请选择新闻类型">
        <el-option label="普通新闻" value="1"></el-option>
        <el-option label="图片新闻" value="2"></el-option>
        <el-option label="视频新闻" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="新闻内容">
        <el-input type="textarea" v-model="ruleForm.content" :rows="10"></el-input>
      </el-form-item>
      <el-upload
        ref="upload"
        action="http://localhost:8080/news2022/news/add"
        :limit="1"
        :file-list="fileList"
        list-type="picture-card"
        :data="ruleForm"
        name="file"
        :auto-upload="false"
        :on-success="handleSucess">
        <i slot="default" class="el-icon-plus"></i>
        <div slot="file" slot-scope="{file}">
          <img
            class="el-upload-list__item-thumbnail"
            :src="file.url" alt="">
            <span class="el-upload-list__item-actions">
              <span
                class="el-upload-list__item-preview"
                @click="handlePictureCardPreview(file)">
                <i class="el-icon-zoom-in"></i>
              </span>
              <span
                v-if="!disabled"
                class="el-upload-list__item-delete"
                @click="handleDownload(file)">
                <i class="el-icon-download"></i>
              </span>
              <span
                v-if="!disabled"
                class="el-upload-list__item-delete"
                @click="handleRemove(file)">
                <i class="el-icon-delete"></i>
              </span>
              </span>
        </div>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
         <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog> 
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即添加</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
export default {
  name: "NewsAdd",
  data() {
    return {
      fileList:[],
      dialogImageUrl:'',
      dialogVisible:false,
      disabled: false,
      options: [],
      ruleForm: {
        tilte: "",
        kindId: 1,
        content: "",
        type:"1",
        source:"",
        editor:""
      },
      rules: {
        title: [
          { require: true, message: "请输入新闻标题", trigger: "blur" },
          { min: 3, max: 20, message: "长度在3到20个字符", trigger: "blur" },
        ],
        kindid:[
          {required:true,message:'请选择新闻分类',trigger:'change'}
        ],
        content: [
          { require: true, message: "请输入新闻内容", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.axios.get("kind/list").then((response) => {
      this.options = response.data;
    });
  },
  methods: {
    handleSucess(){
      this.$message({
        message:'成功提交新闻',
        type:'success'
      });
      this.$router.push("/");
    },
    handleRemove(file){
      console.log(file);
    },
    handlePictureCardPreview(file){
      this.dialogImageUrl=file.url;
      this.dialogVisible=true;
    },
    handleDownload(file){
      console.log(file);
    },
    submitForm(formName) {
      var that=this.$refs.upload;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          that.submit();
        } else {
          console.log("error submit!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
