<template>
  <div class="waterfall" ref="waterfall">
    <slot></slot>
    <div class="waterfall-loading" ref='loading'>
      <i class="el-icon-loading"></i>
    </div>
  </div>
</template>
<script>
import {throttle} from 'throttle-debounce'
export default {
  name: 'Waterfall',
  data(){
    return {
      // 通过isLoading控制是否要加载
      isLoading: false
    }
  },
  // 对DOM元素进行操作
  mounted(){
    // 优化，每隔一段时间再去执行函数，不用频繁触发  节流函数
    this.scrollHandler = throttle(300, this.watchScroll.bind(this));

    // 监听scroll 事件（需要将this绑定给window,否则this指向实例）
    window.addEventListener("scroll",this.scrollHandler);

  },
  destroyed(){
    // 设置定时器，停止
    window.removeEventListener("scroll",this.scrollHandler);
  },
  methods:{
    watchScroll(){
     if(this.isLoading) return;
          // 元素（loading所在div）的下边距(object.getBoundingClientRect().bottom)距离浏览器顶部的高度<浏览器可视区高度
    var browserHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    // 注意因为waterfall-loading还没加载完所以是取不到的
    var loadingHeight = this.$refs.waterfall.getBoundingClientRect().bottom;
    console.log(browserHeight,loadingHeight);
    // 当loadingHeight < browserHeight时，通知父级getMenusByPage，继续加载
    if(loadingHeight < browserHeight){
      // 修改isLoading 的值一定要在通知之前，否则第一次
      this.isLoading = true;
      this.$emit("parentHome");
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