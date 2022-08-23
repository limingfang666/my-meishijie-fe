<!--
 * @Author: limingfang666 1275012490@qq.com
 * @Date: 2022-06-24 11:43:58
 * @LastEditors: limingfang666 1275012490@qq.com
 * @LastEditTime: 2022-08-22 14:46:22
 * @FilePath: \meishijie-backe:\StudyFile\kaikeba\works\Vue\VuePracticalProject\my-meishijie-fe\src\components\menus.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-menu :default-active="activerouter" class="el-menu-demo" mode="horizontal" :unique-opened='true'>
    <el-menu-item index="1">
      <router-link class="nav-link" :to="{name:'home'}">首页</router-link>
    </el-menu-item>
    <el-menu-item index="2">
      <router-link class="nav-link" :to="{name:'recipe'}">菜谱大全</router-link>
    </el-menu-item>
  </el-menu>
</template>
<script>
export default {
  name: 'menus',
  data(){
    return {
      activerouter :'1'
    }
  },
  watch:{
    $route:{
      handler(){
        // 监听，如果路由地址变化，则改变nav-link
        // Vue 在修改数据后，视图不会立刻更新，而是等同一事件循环中的所有数据变化完成之后，再统一进行视图更新
        // this.$nextTick()使用场景：created 和 mounted 阶段，如果需要操作渲染后的视图，要使用 nextTick 方法；v-show切换到输入框后，自动聚焦；点击获取某个元素的style样式时
          this.$nextTick(()=>{
            if(this.$route.name==='recipe'){
              this.activerouter = '2';
            }else{
              this.activerouter = '1';
            }
          })
      },
      immediate:true
    }
  },
}
</script>
<style lang="stylus">
  .nav-link {
    display inline-block
  }
</style>


