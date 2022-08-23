<template>
<el-form :model="stepUpload" :rules="rules" ref="stepUploadForm" class="demo-ruleForm">
  <!-- v-for标签不能直接在template下写，需要多接一层div -->
  <div class="step clearfix" v-for="(item,index) in steps" :key="index+1">
        <div class="step-number">{{index+1}}.</div>
        <el-form-item prop="img_url">
        <div class="upload-box">
          <upload-img
            action="/api/upload?type=step"
            :img-max-width="184"
            v-model="item.img_url"
            :imgUrl="item.img_url"
            :imgSty="imgSty"
            @imgUploaded="imgUploaded(arguments,index)"
          ></upload-img>
        </div>
        </el-form-item>
        <!--如果加了 el-form-item ，其子类会集成其width默认50px-->
      <el-form-item prop="describe">
        <el-input
          class="introduce-text"
          type="textarea"
          :rows="8"
          placeholder="请输入内容"
          v-model="item.describe"
          @blur="getInputValue(index,$event)"
        >
        </el-input>
      </el-form-item>
      <i class="delete-icon el-icon-close" @click="removeStep(index+1)"></i>
  </div>
</el-form>
</template>
<script>
import UploadImg from '@/components/upload-img'
export default {
  components: {UploadImg},
  props: {
    steps: {
      // 初始生命用于校验
      img_url:'',
      describe:''
    },
    imgSty:{},
  },
  data(){
    // 设置index用于stuffForm中初始值设置
    let index=this.index | 0;
    // 如果没有填入直接点击提交按钮会不进getInputValue法，需要设置this.index默认值为0
    this.index = this.index | index;

    var validateDesc = (rule,value,callback) =>{
      if(this.steps[this.index].describe===''){
        callback(new Error("请输入步骤描述"));
      }
      callback();
    }

    var validateImg = (rule,value,callback) =>{
      if(this.steps[this.index].img_url==='https://s1.c.meishij.net/n/images/upload_step_img.png'){
        callback(new Error("请上传步骤图"));
      }
      callback();
    }
    return {
      // 用作校验
      stepUpload:{
        img_url:this.steps[this.index].img_url,
        describe:this.steps[this.index].describe
      },
      rules:{
        img_url: [
          { required: true, validator:validateImg , trigger: "change" }
        ],
        describe: [
          { required: true, validator:validateDesc , trigger: 'blur' },
        ],

      }
    }
  },
  methods: {
    // imgUploaded(arguments,index) $emit中父组件需要传递自定义参数（index）时，使用arguments表示子组件传递过来的参数，index则表示自定义参数
    imgUploaded(arg,index){
      //通知父级修改steps值
      this.$emit("updateStepsImgUrl",arg[0],index);//$emit()传递多个参数
    },
    removeStep(index){
      if(this.steps.length===1){
        this.$message({
          message:"警告！！！这是最后一步了不能删除了哦！",
          type:"warning"
        });
        return;
      }
      // 删除某个特定步骤
       this.steps.splice((index-1),1);
    },
    validateStepUpload(){
      return new Promise((resolve,reject)=>{
          this.$refs.stepUploadForm.validate((valid)=>{
          if (valid) {
            resolve(true)
          } else {
            reject(false)
          }
        });
      });
    },
    // 给对应index步骤描述赋值
    getInputValue(index,event,text){
      this.index = index;
      let value = event.target.value;
      this.steps[index].describe = value;
    }
  }
}
</script>

<style lang="stylus">
.step
  margin-bottom 20px
  > div
    float left
  .step-number
    height 180px
    width 100px
    font-size 60px
    color #aaa
    font-family Arial, Helvetica, sans-serif
    font-weight bold
    vertical-align top
    line-height 180px
  // .introduce-text
  //   width 100%
  //   margin-left 40px
  .upload-box
    img 
      vertical-align top
  .el-form-item :last-child
    width: 140%
  div.introduce-text.el-textarea
    width: 100%
    margin-left 50px
  i.delete-icon.el-icon-close
    margin: 80px 0 0 330px
</style>

