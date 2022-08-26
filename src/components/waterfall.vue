<template>
  <div class="waterfall" ref="waterfall">
    <slot></slot>
    <div class="waterfall-loading" ref='loading'>
      <i class="el-icon-loading" v-if="loading"></i>
    </div>
  </div>
</template>
<script>
// import {throttle} from 'throttle-debounce'
// 节流，vue2已经删掉了throttle-debounce，而使用了lodash
import _ from 'lodash'

export default {
  name: 'Waterfall',
  data(){
    return {
      // 因为loading在父组件加载完数据后会设置为false，所以也可将其在子组件中作为父组件数据是否加载完成的标识（因为如果父组件数据没有加载完成，就滚动滚动条的话获取的waterfall底部距离浏览器顶部距离不正确）
      loading: true,
    }
  },
  mounted(){
    // 节流函数
    this.scrollHandler = _.throttle(this.watchScroll.bind(this), 500)
    window.addEventListener('scroll',this.scrollHandler);
  },
  destroyed(){
    window.removeEventListener('scroll',this.scrollHandler);
  },
  methods:{
    watchScroll(e){
      // 正常滚动滚动条时heightToBrowserTop>browserHeight，但如果父组件数据还没有加载完成就加载子组件，就会heightToBrowserTop<browserHeight
      // this.loading为true，标识父组件首次获取数据还没有完成，此时获取的waterfall的底部距离浏览器顶部的高度不正确
      if(this.loading) return;
      
      // 如果this.loading为fasle才监听滚动条，获取对应高度
      console.log("子组件开始加载---------");
      // getBoundingClientRect()获取页面中某个元素距离浏览器视窗上下左右不同位置
      let heightToBrowserTop = this.$refs['waterfall'].getBoundingClientRect().bottom;
      // 获取浏览器可视区域宽高（兼容性比较好，不包括工具栏和滚动条）
      let browserHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      // 正常滚动滚动条时heightToBrowserTop>browserHeight，但如果父组件数据还没有加载完成就加载子组件，就会heightToBrowserTop<browserHeight
      // 当前的waterfall的底部距离浏览器顶部的高度 小于 浏览器可视区高度，即可加载下一页
      if(heightToBrowserTop < browserHeight){
        this.loading = true;
        this.$emit('loadContinue');
      }
    }
  }
}
</script>
<style lang="stylus">
.waterfall-loading
  width 100%
  height 20px
  text-align center
</style>