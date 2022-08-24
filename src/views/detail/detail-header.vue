<template>
  <section class="detail-header">
    <img class="detail-img" :src="menuInfo.product_pic_url" />
    <div class="detail-header-right">
      <div class="detail-title clearfix">
          <h1 class="title">{{menuInfo.title}}</h1>
          <!--
            1. 不显示，这个菜谱是当前用户发布的
            2. 显示，后端返回一个是否收藏的字段
          -->
          <!-- 不是自己的空间才显示是否收藏按钮 -->
          <div class="detail-collection" v-if="!isOwner">
            <a href="javascript:;" :class="isCollection?'no-collection-at':'collection-at'"
              @click="toggleCollection"
            > 
                <span v-if="!isCollection">收藏</span>
                <span v-if="isCollection">取消收藏</span>
            </a>
          </div>
      </div>
      <ul class="detail-property clearfix">
        <!--property  -->
        <li v-for="property in menuInfo.properties_show" :key="property.parent_type">
          <strong>{{property.parent_name}}</strong>
          <span>{{property.name}}</span>
        </li>
      </ul>

<!-- 显示用户信息 -->
<!-- 从父组件传过来的对象或数组，一定要判断是否存在才能使用下面的属性 -->
      <div class="user" v-if="menuInfo.userInfo">
        <router-link id="tongji_author_img" class="img" :to="{name:'space',query:{userId:menuInfo.userInfo.userId}}">
          <img :src="menuInfo.userInfo.avatar">
        </router-link>
        <div class="info">
          <h4>
            <router-link id="tongji_author" :to="{name:'space',query:{userId:menuInfo.userInfo.userId}}">
              {{menuInfo.userInfo.name}}
            </router-link>
          </h4>
          <span>菜谱：{{menuInfo.userInfo.work_menus_len}}　/　关注：{{menuInfo.userInfo.following_len}}　/　粉丝：{{menuInfo.userInfo.follows_len}}</span>
          <strong>最后更新时间：{{menuInfo.userInfo.createdAt|formatTime(10)}}</strong>
        </div>
      </div>

    </div>
  </section>
</template>
<script>
// 引入过滤器，vue3中已经废弃，使用computed属性实现
import '@/tools/filter';
import { getCollection, collection } from '@/service/api'

export default {
    props: {
      menuInfo:{
      },
    },
    data(){
      return {
        isCollection: true,
        isOwner:true
      }
    },
    // mounted子组件会获取不到父组件传递的数据，所以使用updated
    async updated(){
      // 判断是否是自己的空间
      let userId = this.$store.state.userInfo.userId;
      let curUserId = this.menuInfo.userInfo.userId;
      if(curUserId === userId){
        this.isOwner = true;
      }else{
        this.isOwner = false;
        // 获取到的是用户收藏的所有菜单
        let collectionList = await getCollection({userId:userId});
        
      // 如果当前用户在收藏列表里面则显示：循环数组，如果收藏menuId在这个收藏列表里则表示已收藏
        let collectionData = collectionList.data.list.filter(item=>item._id === this.menuInfo.menuId);
          
        if(collectionData.length>0){
          this.isCollection = true;
        }else{
          this.isCollection = false;
        }
      }
    },
    methods:{
      async toggleCollection(){
        let userId = this.$store.state.userInfo.userId;
        let collectionData =  await collection({userId:userId,menuId:this.menuInfo.menuId});
        // 通过this.$nextTick()进行局部刷新
        this.$nextTick(()=>{
          this.isCollection = collectionData.data.isCollection;
        });
        
      },
    }
}
</script>

<style lang="stylus">
.detail-header
  margin-top 40px
  display flex
  background-color #fff
  .detail-img
    width 328px
  .detail-header-right
    width 662px
    
    .detail-title
      box-sizing border-box
      width 100%
      padding-left: 25px;
      border-bottom: 1px solid #eee;
      .title
        max-width: 288px;
        height: 44px;
        padding: 28px 0px;
        line-height: 44px;
        font-size: 36px;
        color: #333;
        float left
      .collected
        background: #999;
      .collecte
        background: #ff3232;
      .detail-collection
        float right
        display block
        height: 50px;
        line-height: 44px;
        color #fff
        padding: 0px 14px;
        text-align center
        
        margin-top 25px
        cursor pointer
        a 
          display: inline-block;
          padding: 3px 0;
          width: 50px;
          color: #fff;
          text-align: center;
          line-height 20px
        .collection-at
          background-color: #ff3232;
        .no-collection-at
          background-color: #999;
    
    .detail-property
      margin-left 2px
      overflow hidden
      li 
        width 199px
        float left
        height 48px
        border-right 1px solid #eee
        padding 18px 0px 18px 20px
        border-bottom 1px solid #eee
        strong 
          color #999
          line-height 18px
          display block
          height 18px
        span 
          display block
          font-size 24px
          color #ff3232
          line-height 30px
          width 100px
        
    .user
      height 70px
      padding 20px 0px 20px 20px
      overflow hidden
      font-size 12px
      a.img
        display block
        height 70px
        width 70px
        float left
        position relative
        border-radius 35px
        overflow hidden
        img
          display block
          height 70px
          width 70px
      .info
        float left
        padding-left 10px
        height 70px
      h4
        height 22px
        line-height 22px
        font-size 14px
        color #ff3232
        position relative
        a
          color #ff3232
          display inline-block
          vertical-align top
          padding-right 0px
          height 22px
      span 
        line-height 24px
        display block
        color #666
        padding-top 4px
      strong 
        line-height 22px
        color #999


</style>
