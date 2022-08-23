<template>
  <div class="edit">
    <div class="edit-item">
      <span class="label">修改头像</span>
      <!-- 必须传入action,且指定type -->
      <upload-img :imgUrl="userInfo.avatar"
        :action="action"
        :imgSty="imgSty"
        imgMaxWidth="210"
        @imgUploaded="imgUploaded"
      >
      </upload-img>
    </div>
    <div class="edit-item">
      <span class="label">修改名称</span>
      <div>
        <el-input v-model="userInfo.name" class="create-input" placeholder="请输入内容">{{userInfo.name}}</el-input>
      </div>
    </div>
    <div class="edit-item">
      <span class="label">个人简介</span>
      <div>
        <el-input  v-model="userInfo.sign"  type="textarea" class="create-input" placeholder="请输入内容">{{userInfo.sign}}</el-input>
      </div>
    </div>
    <div>
      <el-button 
      class="send" 
      type="primary" 
      size="medium"
      @click="saveUser"
    >保存</el-button>
    </div>
  </div>
</template>
<script>
import UploadImg from '@/components/upload-img'
import { userEdit, getUserInfo } from '@/service/api'
export default {
  components: {UploadImg},
  data(){
    return {
      userInfo:{},
      // 事先记录好初始化显示的头像，如果用户删除自己上传的图片后，显示会原来的头像
      cancelImg:'',
      imgSty:{
         width: '210px',
         height: '210px'
      },
      action:'/api/upload?type=user'
    }
  },
  mounted(){
    // 个人资料只有自己能编辑，所以直接从userInfo中获取也行
    this.userInfo = this.$store.state.userInfo;
    this.cancelImg = this.userInfo.avatar;
  },
  methods:{
    async saveUser(){
      let editUser = await userEdit({userId:this.userInfo.userId,name:this.userInfo.name,sign:this.userInfo.sign,avatar:this.userInfo.avatar});
      if(editUser.code===0){
         this.$message({
          message: '恭喜你，用户信息修改成功！',
          type: 'success'
        });
      }
      // 修改成功后跳转到works原来页面
      this.$router.push({
        path:'/space/works',
        query:{
          userId:this.userInfo.userId
        }
      });
    },
    imgUploaded(url){
      if(url!==''){
        this.userInfo.avatar = url;
      }else{
        this.userInfo.avatar = this.cancelImg;
      }
    }
  }
}
</script>
<style lang="stylus">
.edit
  background-color #fff
  padding 10px 0 20px 20px
  .edit-item 
    display flex
    margin-bottom 20px
    .label
      margin-right 10px
</style>