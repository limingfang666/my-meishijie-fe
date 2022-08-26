<template>
  <div class="home">
    <!-- 轮播 start -->
    <el-carousel :interval="5000" type="card" height="300px" v-if="banners.length>0">
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
      <waterfall ref="waterfall" @loadContinue="loadInfo">
        <menu-card :margin-left="13" :menuInfos="menuInfos"></menu-card>
      </waterfall>
    </div>
    <!-- 内容精选 瀑布流形式 end -->
  </div>
</template>

<script>
import MenuCard from '@/components/menu-card.vue'
import Waterfall from '@/components/waterfall.vue'
import { getBanner, getMenus } from '@/service/api'

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
      total: 0,
      pageSize:0,
    }
  },
  async mounted(){
    // 获取banner
    let bannerData = await getBanner();
    if(bannerData.code===0){
      this.banners = bannerData.data.list;
    }

    // 获取menus
    await this.getHomeMenus();
  },
  methods:{
    async getHomeMenus(){
      let menusData = await getMenus({page:this.page});
      if(menusData.code=== 0){
        // 因为后续加载的数据也是放在menuInfos里，所以需要保存原有数据
        this.menuInfos.push(...menusData.data.list);

        this.total = menusData.data.total;
        this.pageSize = menusData.data.page_size;
        
        // 加载完成后，将loading状态设置为false
        this.$refs['waterfall'].loading = false;
      }
      
    },
    async loadInfo(){
      console.log("继续loading");
      this.page++;

      let pageCount = Math.ceil(this.total/this.pageSize);
      if(this.page>pageCount){
        // 最后一次没有调到getHomeMenus方法里的更改false
        this.$refs['waterfall'].loading = false;
        this.$message({
          message:"我是有底线的哦~",
          type:"info"
        });
        return;
      }

      await this.getHomeMenus();
    },
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

