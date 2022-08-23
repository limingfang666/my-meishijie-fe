<!--
 * @Author: limingfang666 1275012490@qq.com
 * @Date: 2022-06-24 11:43:59
 * @LastEditors: limingfang666 1275012490@qq.com
 * @LastEditTime: 2022-08-15 15:04:35
 * @FilePath: \meishijie-backe:\StudyFile\kaikeba\works\Vue\VuePracticalProject\my-meishijie-fe\src\views\detail\detail.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="menu-detail">
    <!-- 路由组件传参 -->
    <detail-header :menuInfo="menuInfo"></detail-header>
    <detail-content :menuInfo="menuInfo"></detail-content>
    <Comment :menuInfo="menuInfo"></Comment> 
  </div>
</template>
<script>
import DetailHeader from './detail-header'
import DetailContent from './detail-content'
import Comment from './comment'
import {getMenuInfo} from '@/service/api'
export default {
  components: {DetailHeader, DetailContent, Comment},
  data(){
    return {
      menuId:'',
      menuInfo:{},
    }
  },
  async created(){
    this.menuId = this.$route.query.menuId;
        // 获取菜单信息
    let menuData = await getMenuInfo({menuId:this.menuId});
    this.menuInfo = menuData.data.info;
  }
}
</script>
