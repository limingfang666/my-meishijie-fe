<!--
 * @Author: limingfang666 1275012490@qq.com
 * @Date: 2022-06-24 11:43:59
 * @LastEditors: limingfang666 1275012490@qq.com
 * @LastEditTime: 2022-08-22 15:22:03
 * @FilePath: \meishijie-backe:\StudyFile\kaikeba\works\Vue\VuePracticalProject\my-meishijie-fe\src\views\user-login\register.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="login-section">
    <el-form 
      :model="registerForm" :rules="rules" ref="registerForm" 
      label-position="top" label-width="100px" class="demo-ruleForm"
    >
      <el-form-item label="用户名" prop="name">
        <el-input type="text" v-model="registerForm.name" v-focus></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="registerForm.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitRegisterForm('registerForm')">提交</el-button>
        <el-button @click="resetForm('registerForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {register} from '@/service/api';
export default {
  data() {
    return {
      registerForm:{
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
  methods: {
    submitRegisterForm(registerForm){
      this.$refs[registerForm].validate(async (valid)=>{
        if(valid){
          // 用户名重复检验

          let data = await register({name:this.registerForm.name,password:this.registerForm.password});
          if(data.code===0){
            this.registerForm.name='';
            this.registerForm.password='';
            this.$message({
              message: '恭喜你，注册成功！请登录',
              type: 'success'
            });
          }
          if(data.code===1){
            this.$refs[registerForm].$message.error(data.mes);
            return;
          }
        }
        
      });
    },
    resetForm(registerForm) {
      this.$refs[registerForm].resetFields();
    }
  }
}
</script>

<style lang="stylus">
.login-section
  padding 0px 20px
</style>
