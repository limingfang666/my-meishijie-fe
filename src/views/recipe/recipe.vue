<template>
  <div class="recipe">
    <!-- v-model="activeName" -->
    <!-- 菜谱分类 start -->
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane 
        :label="item.parent_name" 
        v-for="item in classify" 
        :key="item.parent_type"
        :name="item.parent_type"
      >
        <h3>{{item.parent_name}}</h3>
        <div class="recipe-link">
          <router-link 
            :to="{name: 'recipe'}" 
            v-for="list in item.list" :key="list.type"
            class="active"
          >{{list.name}}</router-link>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 菜谱分类 end -->
    <h2>家常好味道，给你家一般的温暖</h2>
    <el-container>
      <el-aside width="220px" class="recipe-aside">
        <div class="filter-box">
          <h4>筛选</h4>
          <!-- v-model="activeName" -->
          <!-- 筛选 start -->
          <el-collapse v-model="propertiesActvieNames">
            <el-collapse-item 
              v-for="item in properties"
              :key="item.parent_type"
              :title="item.parent_name" 
              :name="item.parent_type"
            >
              <div class="filter-tags">
                <el-tag 
                  type="info" 
                  v-for="option in item.list" 
                  :key="option.type"
                  :class="{'tag-selected': true}"
                >
                  {{option.name}}
                </el-tag>
              </div>
            </el-collapse-item>
          </el-collapse>
          <!-- 筛选 end -->
        </div>
      </el-aside>
      <el-main class="filter-menus-box">
        <div class="menu-empty">暂时没有过滤出菜谱信息，请选择其他的筛选条件</div>
        <!-- :info='menus' -->
        <menu-card></menu-card>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import MenuCard from '@/components/menu-card.vue'
import properties from "@/mock/properties"
import classify from "@/mock/classify"
export default {
  components: {MenuCard},
  data(){
    return {
      activeName: '1',
      properties:properties,
      propertiesActvieNames:'',
      menus:[],
      classify: classify
    }
  },
  methods:{
    handleClick(){
      const loading = this.$loading({
        target: '.filter-menus-box',
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
    }
  }
}
</script>
<style lang="stylus">
  .recipe-link
    font-size 0;
    margin-top 5px
    a
      display inline-block
      font-size 12px
      padding 0px 8px
      height 28px
      line-height 28px
    .active 
      background #ff3232
      color #fff
  .recipe
    h2 
      text-align center
      line-height 150px
    .el-main
      padding 0
    .filter-box 
      background #fff
      padding 10px
      width 100%
      float left
      box-sizing border-box
  .filter-tags 
    display flex
    flex-wrap wrap
    justify-content space-around
    .tag-selected
      background-color  #ff3232
      color #fff
  .menu-empty
    width 100% 
    text-align center
    font-size 20px
</style>
