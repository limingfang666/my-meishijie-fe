<!--
 * @Author: limingfang666 1275012490@qq.com
 * @Date: 2022-06-24 11:43:58
 * @LastEditors: limingfang666 1275012490@qq.com
 * @LastEditTime: 2022-07-28 16:56:57
 * @FilePath: \meishijie-backe:\StudyFile\kaikeba\works\Vue\VuePracticalProject\my-meishijie-fe\src\components\header.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-header style="height: auto;">
    <div class="header">
      <div class="header_c">
        <el-row type="flex" justify="start" align="middle">
          <el-col :span="6">
            <a href="" class="logo">
            </a>
          </el-col>
          <el-col :span="10" :offset="2"></el-col>
          <el-col v-show="isLogin" :span="6" :offset="3" class="avatar-box">
            <router-link :to="{path:'/space/works',query:{userId:userInfo.userId}}">
              <el-avatar style="vertical-align: middle;" shape="square" size="medium" :src="userInfo.avatar"></el-avatar>
            </router-link>
            <router-link :to="{path:'/space/works',query:{userId:userInfo.userId}}" class="user-name">{{userInfo.name}}</router-link>
            <router-link :to="{name:'create',query:{userId:userInfo.userId}}" class="collection">发布菜谱</router-link>
             <a href="javascript:void(0)" class="collection" @click="clickLoginOut()">退出</a>
          </el-col>
          <el-col v-show="!isLogin" :span="6" :offset="3" class="avatar-box">
            <router-link :to="{name:'login'}" class="user-name">登录</router-link>
            <router-link :to="{name:'register'}" class="collection">注册</router-link>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="nav-box">
      <div class="nav_c">
        <Menus></Menus>
      </div>
    </div>
  </el-header>
</template>
<script>
import Menus from '@/components/menus'
import {loginOut} from '@/service/api'
// header是引入App.vue的获取不到this.$store实例
// import Store from '@/store/'
export default {
  name: 'Header',
  components: {Menus},
  computed:{
    isLogin(){
      return this.$store.getters.isLogin;
    },
    userInfo(){
      // vuex数据页面刷新就没有了,所以可以存放在localStorage里或者在组件守卫中操作
      return this.$store.state.userInfo;
    }
  },
  methods:{
     async clickLoginOut(){
      // 退出并清空userInfo信息
      
      let data = await loginOut();
      // 没有权限 data.code===1  成功登出data.code===0
      if(data.code===0 || data.code===1){
        // 清空token，清空userInfo
        localStorage.removeItem("token");
        this.$store.commit("updateUserInfo",{});
        window.location.href="/";
      }
    }
  }
}
</script>
<style lang="stylus">
.header 
  height 129px
  background-color #c90000
   
  .logo 
    display: block;
    height: 129px;
    width: 184px;
    background url(https://s1.c.meishij.net/n/images/logo2.png) -15px 9px no-repeat;

.header_c, .nav_c
  width 990px
  margin 0 auto 
.nav-box 
  height 60px
  background-color #fff;
  box-shadow 10px 0px 10px rgba(0,0,0,0.3)


.user-name
  margin-left 5px
  color #fff

.collection 
  margin-left 5px  
  color #fff

</style>


