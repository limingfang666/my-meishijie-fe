<template>
  <section class="detail-content">
    <div class="detail-materials">
      <p class=""><strong>“</strong>{{menuInfo.product_story}}<strong>”</strong></p>
      <h2>用料</h2>
      <div v-if="menuInfo.main_material && menuInfo.main_material.length" class="detail-materials-box clearfix">
        <h3>主料</h3>
        <ul>
        <!-- 数据不通过父组件传递过来，而通过 menuInfo.raw_material.main_material获取会报属性未定义(property undefined) -->
          <li class="" v-for="mainMaterial in menuInfo.raw_material.main_material" :key="mainMaterial._id">
            {{mainMaterial.name}}
            <span>{{mainMaterial.specs}}</span>
          </li>
        </ul>
      </div>
      <div v-if="menuInfo.accessories_material && menuInfo.accessories_material.length" class="detail-materials-box clearfix">
        <h3>辅料</h3>
        <ul>
          <li class="" v-for="accessoriesMaterial in menuInfo.raw_material.accessories_material" :key="accessoriesMaterial._id">
            {{accessoriesMaterial.name}}
            <span>{{accessoriesMaterial.specs}}</span>
          </li>
        </ul>
      </div>
    </div> 
    <div class="detail-explain">
      <h2><span>{{menuInfo.title}}</span>的做法</h2>
      <section class="detail-section clearfix" v-for="(step, index) in menuInfo.steps" :key="step._id">
        <em class="detail-number">{{index+1}}.</em>
        <div class="detail-explain-desc">
          <p>{{step.describe}}</p>
          <img class="conimg" :src="step.img_url" alt="">
        </div>
      </section>
      <div class="skill">
        <h2>烹饪技巧</h2>
        <p>{{menuInfo.skill}}</p>
      </div>
    </div>
  </section>
</template>
<script>

export default {
  name: 'DetailContent',
  props:{
    menuInfo:{
      // 如果使用时判断了是否存在可以不定义
      main_material:{
        type: Array,
        default () {
          return [];
        }
      },
      accessories_material:{
        type: Array,
        default () {
          return [];
        }
      },
    }
  },
  }
</script>
<style lang="stylus">
.detail-content
  margin-top 20px
  h2 
    font-size 24px
    color #333
    height 66px
    line-height 66px
    border-bottom 1px solid #eee
    text-indent 24px
    font-family Microsoft Yahei
    display block
  .detail-materials
    background-color #fff
    > p 
      line-height 24px
      font-size 14px
      padding 20px 24px 10px
      color #666
    .detail-materials-box
      margin-bottom 20px
      h3 
        width 48px
        height 22px
        color #999
        background #f5f5f5
        border 1px solid #ddd
        text-align center
        line-height 24px
        margin 14px 5px 14px 25px
        float left
      ul 
        float left
        width 910px
        li 
          float left
          box-sizing border-box
          height 54px
          line-height 54px
          margin 0 5px 5px 5px
          padding 0 10px
          border 1px solid #eee
  .detail-explain
    h2
      font-size 24px
      color #333
      height 66px
      line-height 66px
      border-bottom 1px solid #eee
      span
        height: 44px;
        padding: 28px 0px;
        line-height: 44px;
        font-size: 36px;
        color: #333;
    background-color #fff
    padding-bottom 20px
    .detail-section
      .detail-number
        font-size 50px
        color #ff3232
        font-style italic
        text-align center
        font-family arial
        height 50px
        width 100px
        display block
        float left
        line-height 50px
      .detail-explain-desc
        float left
        width 650px
        overflow hidden
        p 
          line-height 24px
          color #666
          padding 10px 20px 10px 0px
          position relative
          font-size 14px
        img 
          max-width 550px
    .skill
      p 
        font-size 12px
        padding-left 100px
        padding-top 10px
</style>

