<template>
  <div class="home">
    <!-- 轮播 start -->
    <el-carousel :interval="5000" type="card" height="300px">
      <el-carousel-item v-for="banner in banners" :key="banner._id">
        <!-- banner页面，点击进入详情页 -->
        <router-link :to="{name:'detail',query:{menuId:banner._id}}">
          <!-- 注意使用v-bind绑定src，且 el-carousel-item只有一个-->
          <img 
            :src="banner.product_pic_url"
            width="100%"
            alt=""
          >
        </router-link>
      </el-carousel-item>
    </el-carousel>
    <!-- 轮播 end -->
    <!-- 内容精选 瀑布流形式 start -->
    <div>
      <h2>内容精选</h2>
      <waterfall ref="waterfall" @parentHome="menuInfoHandle">
      <!-- <waterfall ref="waterfall"> -->
        <menu-card :margin-left="13" :menuInfos="menuInfos"></menu-card>
      </waterfall>
    </div>
    <!-- 内容精选 瀑布流形式 end -->
  </div>
</template>

<script>
import MenuCard from '@/components/menu-card.vue'
import Waterfall from '@/components/waterfall.vue'

// 引入axios请求封装类
import { log } from 'util'
// 引入 注册 使用
export default {
  name: 'home',
  components: {
    MenuCard,
    Waterfall
  },
  data(){
    return {
      banners:[],
      // 分页显示menu信息
      menuInfos:[],
      page: 1,
      pages: 0
    }
  },
  // created()在实例创建完成后被立即调用，该阶段完成了对 `data` 中的数据的 `observer`，该阶段可以处理一些异步任务
  created(){
    // 获取banner
    this.getBanner();
  },
  // 该阶段执行完了模板解析，以及挂载。同时组件根组件元素被赋给了 `$el` 属性，该阶段可以通过 <u>DOM</u> 操作来对组件内部元素进行处理了
  async mounted(){
     await this.getMenus();
  },
  methods:{
    async getBanner(){
      await this.$store.dispatch("getBannerAct");
      this.banners = this.$store.state.banners;
    },
    async getMenus(){
       await this.$store.dispatch("getMenusAct",this.page);
      this.menuInfos = this.$store.state.menuInfos.list;
    },
     // 子级waterfall通知到父级再次调用请求
    menuInfoHandle(){
      console.log("父级收到了子级回调");
      // 每次通知父级后page++
       this.pages = Math.ceil(this.$store.state.menuInfos.total/this.$store.state.menuInfos.page_size);
      this.page++;
      if(this.page>this.pages){
        this.$refs.waterfall.isLoading = false;
        return;
      }
      this.$refs.waterfall.isLoading = true;
          // 获取所有menu
      this.getMenus();
      this.$refs.waterfall.isLoading = false;
    }
  },
  beforeRouteLeave(to,from,next){
    // 在跳转页面前，清空menu菜单(这里是为了解决从menu跳转其他页面，后退后，数据重复问题，
    // 但是这样做其实vuex缓存就没什么太大作用了（至少在menu页面有缓存到数据），如果直接请求跳转后回退是不会出现数据重复问题的)
    this.$store.state.menuInfos = {};
    next();
  }
  
}
</script>
<style lang="stylus">
.home 
  h2
    text-align center
    padding 20px 0;

  .el-carousel__item h3 
    color #475669
    font-size 14px
    opacity 0.75
    line-height 200px
    margin 0
  

  .el-carousel__item:nth-child(2n) 
    background-color #99a9bf
  

  .el-carousel__item:nth-child(2n+1) 
    background-color #d3dce6
  
</style>

