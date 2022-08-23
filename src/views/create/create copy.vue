<template>
  <div class="create">
    <h2>欢迎发布新菜谱，先介绍一下你的大作！</h2>
    <section class="create-introduce">
      <h5>标题</h5>
      <el-input class="create-input" placeholder="请输入内容" v-model="backData.title"></el-input>
      <h5>属性</h5>
      <div>
        {{backData.property}}
        <!-- { "name": "", "parent_name": "", "parent_type": "", "type": "" }  -->
        <el-select 
          v-model="backData.property[item.title]" 
          v-for="item in displayData.property" 
          :placeholder="item.parent_name"
          :key="item.parent_type" 
          >
          <el-option 
            v-for="option in item.list" 
            :key="option.type" 
            :label="option.name" 
            :value="option.type"
            >
          </el-option>
        </el-select>
      </div>
      <h5>菜谱分类</h5>
      <div>
          <!-- 父级使用label显示 -->
        <el-select v-model="backData.classify" placeholder="请选择菜谱分类">
          <el-option-group  
            v-for="group in displayData.classify" 
            :key="group.parent_type" 
            :label="group.parent_name">
            <el-option 
              v-for="classify in group.list" 
              :key="classify.type" 
              v-model="classify.name" 
              :label="classify.name"
              :value="classify.type">
            </el-option>
          </el-option-group>
        </el-select>
      </div>
      <h5>成品图 (328*440)</h5>
      <div class="upload-img-box clearfix">
        <div class="upload-img">
          <upload-img v-model="backData.product_pic_url" @imgUploaded="imgUploaded" :imgUrl="displayData.product_pic_url"></upload-img>
        </div>
        <el-input
          class="introduce-text"
          type="textarea"
          :rows="10"
          placeholder="请输入内容"
          v-model="backData.product_story"
        >
        </el-input>
      </div>
    </section>
    <h2>记录所有原材料</h2>
{{backData.raw_material}}
    <section class="create-introduce">
      <h5>主料</h5>
      <!--[ { "name": "", "specs": "" }, { "name": "", "specs": "" }, { "name": "", "specs": "" } ]-->
      <Stuff v-model="backData.raw_material.main_material"
      ></Stuff>
      <h5>辅料</h5>
      <Stuff v-model="backData.raw_material.accessories_material"
      ></Stuff>
    </section>

    <h2>开始写步骤了！能否简单易学就看你怎么写了，加油！</h2>
    {{backData.steps}}
    <section class="create-introduce">
      <Upload v-model="backData.steps" :steps="backData.steps" @updateStepsImgUrl="updateStepsImgUrl(arguments)"></Upload>
      <el-button 
        class="eaeaea add-step-button" 
        type="primary" 
        size="medium" 
        icon="el-icon-plus"
        @click="()=>{this.backData.steps.push({img_url: 'https://s1.c.meishij.net/n/images/upload_step_img.png',describe: '',})}"
      >增加一步</el-button>
      <h5>烹饪小技巧</h5>
      <el-input
        class="introduce-text"
        type="textarea"
        :rows="8"
        placeholder="分享下你做这道菜的过程中的心得和小技巧吧！"
        v-model="backData.skill"
      >
      </el-input>
    </section>
<!-- loading效果只需要加:loading="loading"即可 -->
    <el-button 
      class="send" 
      type="primary" 
      size="medium" 
      :loading="loading"
      @click="publishMenu"
    >搞定，提交审核</el-button>

  </div>
</template>
<script>
import Stuff from './stuff'
import Upload from './step-upload'
import UploadImg from '@/components/upload-img'
import { getProperty, getClassify, publish } from '@/service/api'

export default {
  name: 'create',
  components: {Stuff,Upload,UploadImg},
  data(){
    return {
      // 用于显示页面数据结构
      displayData:{
        name:'',
        property: {
          craft: {type: String,  required: true},  // 工艺 enum: [1,2,3,4],
          flavor: {type: String, required: true},  // 口味  enum: [1,2,3,4],
          hard: {type: String, required: true},   // 难度 enum: [1,2,3,4],
          people: {type: String, required: true}  // pepole 人数: [1,2,3,4],
        },
        classify: {type: String, required: true},
        raw_material:{ // 原材料
          main_material: [{  // 主料
            name: '',
            specs: '',
          }],
          accessories_material: [{  // 辅料
            name: '',
            specs: '',
          }]
        },
      },
      // 用于传送给后端的数据
      backData:{
        title: '',
        property: {
          // 此处定义时一定要定义为''，定义为{}或者craft: {type: String,  required: true}显示会出错
          craft: '',  // 工艺 enum: [1,2,3,4],
          flavor: '',  // 口味  enum: [1,2,3,4],
          hard: '',   // 难度 enum: [1,2,3,4],
          people: ''  // pepole 人数: [1,2,3,4],
        },
        product_pic_url: '',
        product_story: '',
        raw_material:{ // 原材料
          main_material: [{  // 主料
            name: '',
            specs: '',
          }],
          accessories_material: [{  // 辅料
            name: '',
            specs: '',
          }]
        },
        steps: [{
          img_url: '',
          describe: '',
        }],
        skill:  '',
        classify: '',
      },
      imgUrl:'',
      loading:false
    }
  },
  created(){
    this.getProperty();
    this.getClassify();
  },
  methods:{
    publishMenu(){
      // 点击之后将按钮样式改为loading提交状态
      this.loading = true;
      console.log(this.backData);
      publish(this.backData).then((res)=>{
        console.log(res);
      }).catch(err=>{
        console.log(err);
        this.$message({
          message:"发布失败！",
          type:"error"
        });
      })
    },
    async getProperty(){
      let propertyData = await getProperty();
      if(propertyData.ec===200){
        this.displayData.property = propertyData.data;
      }
    },
    async getClassify(){
      let classifyData = await getClassify();
      if(classifyData.ec===200){
        this.displayData.classify = classifyData.data;
      }
      
    },
    imgUploaded(file){
       if(file){
        this.displayData.product_pic_url = URL.createObjectURL(file.raw);
        this.backData.product_pic_url = URL.createObjectURL(file.raw);
      }
    },
    updateStepsImgUrl(params){
      console.log(params);
      // 父组件中：如果子组件传递一个参数不需要写，传递过来多个参数，需要使用arguments进行接收 @updateStepsImgUrl="updateStepsImgUrl(arguments)"
      // $emit()传递过来的多个参数，通过params[0],params[1]方式进行获取
      this.backData.steps[params[1]].img_url = URL.createObjectURL(params[0].raw);
    },
  }
}
</script>
<style lang="stylus">

.create-introduce 
  background-color #fff
  padding 20px

  .add-step-button
    margin-left 100px

.create
  width 100%
  h2
    text-align center
    margin 20px 0
  .send
    // ff3232()
    height: 70px;
    width: 220px;
    background #ff3232
    color #fff
    border none
    margin 20px auto
    display block
    

  h5 
    margin 20px 0

.create-input input
  width 446px
  line-height 22px
.upload-img-box 
  .upload-img
    float left
  .introduce-text
    float left
  .el-textarea
    width 60%
    margin-left 10px
</style>


