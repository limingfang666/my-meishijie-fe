<template>
  <div class="space" ref="space">
    <h2>欢迎来到我的美食空间</h2>
    <div class="user-info">
      <div class="user-avatar">
        <img :src="userInfo.avatar" alt="">
      </div>
      <div class="user-main">
        <h1>{{userInfo.name}}</h1>
        <span class="info">
        {{userInfo.createdAt | formatTime(10)}}
          <em>加入美食杰</em>
          <span v-if="isOwner">
          |
          <router-link :to="{name:'edit',query:{userId:userInfo.userId}}" >编辑个人资料</router-link>
          </span>
        </span>
        <div class="tools" v-if="!isOwner" >
				  <a href="javascript:;" @click="toggleFollow()" :class="isFollowing?'no-follow-at':'follow-at'">
            <span v-if="!isFollowing">+关注</span>
            <span v-if="isFollowing">取消关注</span>
          </a>
        </div>
      </div>

      <ul class="user-more-info">
        <li>
          <div>
            <span>关注</span>
            <strong>{{userInfo.following_len}}</strong>
          </div>
        </li>
        <li>
          <div>
            <span>粉丝</span>
            <strong>{{userInfo.follows_len}}</strong>
          </div>
        </li>
        <li>
          <div>
            <span>收藏</span>
            <strong>{{userInfo.collections_len}}</strong>
          </div>
        </li>
        <li>
          <div>
            <span>发布菜谱</span>
            <strong>{{userInfo.work_menus_len}}</strong>
          </div>
        </li>
      </ul>
    </div>

    <!-- v-model="activeName" -->
    <el-tabs class="user-nav" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="作品" name="works"></el-tab-pane>
      <el-tab-pane label="粉丝" name="fans"></el-tab-pane>
      <el-tab-pane label="关注" name="following"></el-tab-pane>
      <el-tab-pane label="收藏" name="collection"></el-tab-pane>
    </el-tabs>

    <div class="user-info-show">
      <!-- 作品 & 收藏 布局 -->
      <!-- <menu-card :margin-left="13"></menu-card> -->
      <!-- 粉丝 & 关注 布局 -->
      <!-- <Fans></Fans> -->
      <router-view :info="info"></router-view>
    </div>

  </div>
</template>
<script>
import { formatTime } from '@/tools/filter'
import { getUserInfo, getSpaceTab, follow } from "@/service/api";
export default {
  name: 'Space',
  data(){
    return {
      // 当前用户信息
      userInfo:{
      },
      // 传给子组件信息
      info:{},
      // 是否是自己的个人空间
      isOwner: false,
      // 定义哪个tab为active
      activeName: 'works',
      // 关注按钮颜色
      isFollowing: true,
    }
  },
  mounted(){
    this.loadUser();
  },
  // 监听路由，如果space页面userId有变化（个人空间和他人空间的切换），需要刷新页面
  watch:{
    $route: {
      handler:function(){
        this.loadUser();
      },
      immediate:true
    },
  },
  methods:{
    async loadUser(){
        // 根据userId获取用户信息
      let userId = this.$route.query.userId;
      let userInfoData = await getUserInfo({userId:userId});
      if(userInfoData && userInfoData.code === 0){
        this.userInfo = userInfoData.data;
        // 关注按钮颜色
        this.isFollowing = userInfoData.data.isFollowing;
      }

      // 判断进入的空间是否是个人空间
      let ownUserInfo = this.$store.state.userInfo;
      if(ownUserInfo.userId === this.userInfo.userId){
        this.isOwner = true;
      }

    // 首次进入时需要请求到作品信息
      if(this.$route.name==="works"){
        this.getSpaceData("works",{userId:userId});
      }
    },
    async handleClick(tab,event){
      // 使用v-model="tabIndex"后，会自动绑定tab.name值
      this.activeName = tab.name;
      let userId = this.$route.query.userId;
      this.$router.push({path: '/space/'+tab.name, query: {userId: userId}});

      // 一句代码实现分开发送请求
      this.getSpaceData(tab.name,{userId:userId});
    },
    async getSpaceData(tabName,params){
      let data = await getSpaceTab(tabName,params);
      this.info = data.data.list;
    },
    async toggleFollow(){
      // 点击关注，并改变userInfo
      // 如果是自己不能关注，如果是他人空间可关注
      if(this.isOwner){
        await this.$message.error('不能关注自己哦');
        return;
      }else{
        // 获取当前vuex中的userInfo信息
        let ownerId = this.$store.state.userInfo.userId;
        let followUserId = this.$route.query.userId;
        
        // 注意参数形式(得到的数据是关注后当前显示用户的信息)
        let followResult = await follow({userId:ownerId,followUserId:followUserId});
        this.userInfo = followResult.data;
        // 点击关注按钮后，需要局部刷新按钮样式（this.$nextTick()）
        this.changeIsFollow();

        // 提交给vuex的userInfo：更改用户信息
        let userInfoCur = await getUserInfo();
        this.$store.commit("updateUserInfo",userInfoCur.data);
        
      }
    },
    // 切换关注按钮不同状态
    changeIsFollow(){
      this.$nextTick(()=>{
        this.isFollowing = !this.isFollowing;
      });
    }
  },
}
</script>

<style lang="stylus">
.space
  
  h2
    text-align center
    margin 20px 0
  .user-info
    height 210px
    background-color #fff
    display flex
    .user-avatar
      width 210px
      height 210px
      
      img 
        width 100%
        height 100% 
    .user-main
      width 570px
      padding 20px
      position relative
      h1
        font-size 24px
        color #333
        line-height 44px
      .info  
        font-size 12px
        line-height 22px
        color #999
        a
          color #999
      .tools 
        position absolute
        right 20px
        top 20px
        vertical-align top;
        a
          display inline-block
          padding 3px 0
          width 50px
          color #fff
          text-align center
        a.follow-at
          background-color  #ff3232
        a.no-follow-at 
          background-color #999
          
    .user-more-info
      width 190px
      overflow hidden
      padding-top 20px
      li
        width 81px
        height 81px
        border-radius 32px
        border-bottom-right-radius 0
        margin 0px 8px 8px 0px
        float left
        div
          display block
          height 81px
          width 81px
          box-shadow 0px 0px 6px rgba(0,0,0,0.05) inset
          border-radius 32px
          border-bottom-right-radius 0

          span 
            color #999
            line-height 20px
            display block
            padding-left 14px
            padding-top 14px

          strong 
            display block
            font-size 18px
            color #ff3232
            font-family Microsoft Yahei
            padding-left 14px
            line-height 32px

  .user-nav
    margin 20px 0 20px 0
  .user-info-show
    min-height 300px
    background #fff
    padding-top 20px
    .info-empty
      width 100% 
      min-height inherit
      display flex
      align-items center
      justify-content:center;
      p 
        text-align center
        font-size 12px
      a 
        text-align center
        display block
        height 48px
        width 200px
        line-height 48px
        font-size 14px
        background #ff3232
        color #fff
        font-weight bold
        margin 0px auto
  .el-tabs__item.is-active 
    color: #ff3232;
  .el-tabs__active-bar
    background-color: #ff3232;
  .el-tabs__nav-wrap::after
    background-color: transparent;
</style>

