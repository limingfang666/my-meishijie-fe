<template>
  <el-row class="menu-card" type="flex" justify="start">
    <el-col style="flex:none;" :style="{'margin-left':marginLeft+'px'}"  v-for="menu in menuInfos" :key="menu.id">
      <el-card :body-style="{ padding: '0px' }">
        <router-link :to="{name:'detail',query:{menuId:menu._id}}">
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
</template>
<script>

export default {
  name: 'menu-card',
  props:{
    marginLeft: {
      type: Number,
      default: 22
    },
    menuInfos:{
      type: Array,
      default:() => []
    },
    created(){
      console.log(this.info);
      
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

