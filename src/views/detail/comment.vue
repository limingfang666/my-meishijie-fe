<template>
  <div class="comment-box">
    <h2>关于<span>{{menuInfo.title}}</span>的讨论</h2>
    <el-form :model="commentForm" :rules="rules" ref="commentForm">
    <div class="comment-text">
      <a href="javascript:;" class="useravatar">
        <!-- 这里的头像是当前store中的头像 -->
        <img :src="$store.state.userInfo && $store.state.userInfo.avatar">
      </a>
      <div v-if="!isLogin">请先登录后，再评论<router-link :to="{name:'login'}"><em class="login_text">登录</em></router-link></div>
      <div v-if="isLogin" class="comment-right">
        <el-form-item prop="commentText">
          <el-input
            v-model="commentForm.commentText"
            ref="commentTextArea"
            type="textarea"
            :rows="5"
            :cols="50"
            placeholder="请输入内容"
          >
          </el-input>
        </el-form-item>
        <div class="comment-button" >
          <el-button 
            class="send-comment" 
            type="primary" 
            size="medium"
            @click="submitComment()"
          >提交</el-button>
        </div>
      </div>
    </div>
    </el-form>
    <div class="comment-list-box">
      <ul class="comment-list" v-if="comments.length>0">
        <li 
          v-for="comment in comments"
          :key="comment.commentId"
        >
          <router-link :to="{name:'space',query:{userId:comment.userInfo.userId}}" class="avatar">
            <img :src="comment.userInfo && comment.userInfo.avatar">
            <h5>{{comment.userInfo.name}}</h5>
          </router-link>
          <div class="comment-detail">
            <p class="p1">{{comment.commentText}}</p>
            <div class="info clearfix">
              <span style="float: left;">{{comment.updateAt}}</span>
            </div>
          </div>
        </li>
      </ul>
      <ul class="comment-list" v-if="comments.length===0">
        <li><h2>还没有评论内容哦！！！</h2></li>
      </ul>
    </div>
  </div>
</template>
<script>
import {getComments,postComment} from '@/service/api';
export default {
  name: 'Comment',
  props:{
    menuInfo:{}
  },
  data(){
    return {
      comments:[],
      commentForm:{
        commentText:''
      },
      rules:{
        commentText:[
          { required:true, message:"请输入评论内容", trigger: 'blur'}
        ]
      }
    }
  },
  computed:{
    isLogin(){
      return this.$store.getters.isLogin;
    }
  },
  mounted(){
    this.getCommentsComm();
  },
  methods:{
    getCommentsComm(){
      getComments({menuId:this.$route.query.menuId}).then(res=>{
        if(res.ec===200){
          this.comments = res.data.comments;
        }
      })
    },
    submitComment(){
      this.$refs['commentForm'].validate((valid)=>{
        if(valid){
          console.log(this.$refs['commentTextArea'].value);
          console.log(this.menuInfo.userId);
          console.log(this.$store.state.userInfo);
          console.log(this.menuInfo.menuId);
          // userId为当前菜单所有者 userInfo为当前空间所有者
          postComment({
            userId:this.menuInfo.userId,
            userInfo:this.$store.state.userInfo,
            menuId:this.menuInfo.menuId,
            commentText:this.$refs['commentTextArea'].value
          }).then(res=>{
            // 成功后重新获取评论
            this.getCommentsComm();

            this.$message({
              message:"评论成功！",
              type:'success'
            });
            // 评论成功后，清空textarea框
            // 使用this.$refs['commentTextArea'].value = ''清空会报错，因为这里使用了双向绑定，每当父组件重新渲染时，该值将被覆盖
            this.$refs['commentForm'].resetFields();
          }).catch(err=>{
            this.$message({
              message:"评论失败！",
              type:'error'
            });
            this.$nextTick(()=>{
              this.$refs['commentText'].blur();
            });
          });
        }
      });
    }
  }
}
</script>
<style lang="stylus">
.comment-box
  background-color #ffffff
  margin-top 20px
  padding 0 20px
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
  .comment-text
    margin-top 20px
    .useravatar
      margin-right 20px
      img 
        vertical-align top
        width 36px
        height 36px
    .login_text
      font-size 20px
      color #ff3232
      font-style italic
      font-family arial
      line-height 30px
    .comment-right 
      display inline-block
      width 80%
      .comment-button
        text-align right 
        margin-top 10px
        .send-comment
          background #ff3232
          border none
  .comment-list-box
    border-top 1px solid #eee
    margin-top 20px
    padding-top 30px

    ul li 
      border-bottom 1px solid #eee
      margin-bottom 20px
      .avatar
        height 82px
        width 50px
        overflow hidden
        display inline-block
        h5
          white-space nowrap
        img 
          height 50px
          width 50px
      .comment-detail
        display inline-block
        vertical-align top
        margin-left 20px
        width 80%
        p 
          margin 0
          font-size 14px
        .info
          margin-top 10px
          color #999
          .thumbs
            cursor pointer
            
            font-size 18px
          .thumbs-actve
            color red
      

</style>
