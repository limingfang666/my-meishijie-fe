<!--
 * @Author: limingfang666 1275012490@qq.com
 * @Date: 2022-06-24 11:43:59
 * @LastEditors: limingfang666 1275012490@qq.com
 * @LastEditTime: 2022-08-12 16:44:49
 * @FilePath: \meishijie-backe:\StudyFile\kaikeba\works\Vue\VuePracticalProject\my-meishijie-fe\src\views\user-space\menu-list.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="menu-list">
    <div class="info-empty" v-if="info.length==0&&isWork">
			<div>
				<p>私房菜不要偷偷享用哦~~制作成菜谱与大家分享吧！</p>
          <router-link :to="{name:'create'}" class="collection">发布菜单</router-link>
			</div>
		</div>
    <div class="info-empty" v-if="info.length==0&&!isWork">
        <div>
				<p>还没有收藏任何的菜谱，去搜自己喜欢的菜谱，收藏起来吧。</p>
        <router-link :to="{name:'home'}">菜谱大全</router-link>
			</div>
    </div>
   <div v-if="info.length!=0">
    <el-row class="menu-card" type="flex" justify="start">
      <el-col style="flex:none;margin-left:22px" v-for="menu in info" :key="menu._id">
        <el-card :body-style="{ padding: '0px' }">
          <router-link :to="{name:'detail',query:{menuId:menu._id}}" :userInfo="menu.userInfo">
            <img :src="menu.product_pic_url" class="image" style="width: 232px;height: 232px;">
            <div style="padding: 14px;" class="menu-card-detail">
              <strong>{{menu.title}}</strong>
              <span>{{menu.comments_len}} 评论</span>
              <router-link :to="{path:'/space/works',query:{userId:menu.userId}}" tag="em">
              {{menu.name}}
              </router-link>
            </div>
          </router-link> 
        </el-card>
      </el-col>
    </el-row>
		</div>
  </div>
</template>
<script>
import MenuCard from '@/components/menu-card.vue'
export default {
  components: {MenuCard},
  props: {
    info: {}
  },
  data(){
    return {
      isWork: true
    }
  },
  // 根据路由改变设置isWork的值并改变布局
  watch:{
    $route(){
      this.changeTab();
    },
    immediate:true
  },
  created(){
    this.changeTab();
  },
  methods:{
    changeTab(){
      let currTab = this.$route.name;
      
      if(currTab === "works"){
        this.isWork = true;
      }else if(currTab === "collection"){
        this.isWork = false;
      }
    }
  }
}
</script>
<style lang="stylus">
.menu-card 
  flex-wrap wrap
  .el-col-24
    width auto
    margin-bottom 20px
    margin-left: 22px
    
  .menu-card-detail
    > *
      display block
    strong 
      height 24px
      line-height 24px
      font-size 14px
      font-weight bold
      color #333
    span 
      height 26px
      line-height 26px
      font-size 12px
      color #999
    em 
      height 23px
      line-height 23px
      font-size 12px
      color #ff3232
</style>
