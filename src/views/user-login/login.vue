<template>
  <div class="login-section">
  <!-- 表单校验 -->
    <el-form
     :model="loginForm" :rules="rules" ref="loginForm"
      label-position="top"
      label-width="100px" class="demo-ruleForm"
    >
      <el-form-item label="用户名" prop="name">
      <!-- 使用自定义指令v-focus -->
        <el-input type="text" v-model="loginForm.name" v-focus></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="loginForm.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitLoginForm('loginForm')">提交</el-button>
        <el-button  @click="resetForm('loginForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {login} from '@/service/api';

export default {
  data() {
    return {
      loginForm:{
        name:'',
        password:''
      },
      rules:{
        name: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
        password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
      }
    };
  },
  // 自定义指令
  directives: {
    focus: {
      // 指令的定义
      inserted: function (el) {
        el.childNodes[1].focus();
      }
    }
  },
  mounted(){
    document.onkeyup= e =>{
        if (e.keyCode === 13) {
            this.submitLoginForm();
         }
      }
  },
  methods: {
     submitLoginForm(){
      // 进行表单校验
      // 注意使用enter按下调用时，this.$refs[loginForm]会找不到loginForm，必须使用this.$refs.loginForm
      this.$refs.loginForm.validate(async (valid)=>{
        if(valid){
          // 同步方式发起后端校验
          const data = await login({name:this.loginForm.name,password:this.loginForm.password});
          
          if(data.code===1){
            this.$refs[loginForm].$message.error(data.mes);
            return;
          }else{
            // 登录成功后记录token,保存user信息到vuex(路由中实现),并跳转到home页面
            localStorage.setItem("token",data.data.token);
            window.location.href = '/';
          }
        }
      });
    },
    resetForm(loginForm) {
      this.$refs[loginForm].resetFields();
    }
  }
}
</script>

<style lang="stylus">
.login-section
  padding 0px 20px
</style>
