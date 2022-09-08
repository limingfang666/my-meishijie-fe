<template>
<el-form :model="stuffForm" :rules="rules" ref="formName" class="demo-ruleForm">
  <div class="stuff">
    <div class="clearfix">
      <div class="raw-item" v-for="(item,index) in value" :key="index+1">
        <el-row :gutter="28">
          <el-col :span="10">
            <el-form-item prop="name" label=" ">
              <el-input placeholder="请输入内容" v-model="item.name" @blur="getInputValue(index,$event,'name')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <!-- label=" "用空格占位，才能显示required:true的*号 -->
            <el-form-item prop="specs" label=" ">
              <el-input placeholder="请输入内容" v-model="item.specs" @blur="getInputValue(index,$event,'specs')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <i class="delete-icon el-icon-close" @click="removeItem(index+1)"></i>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-button class="eaeaea" type="primary" size="medium" icon="el-icon-plus" @click="addItem">增加一项</el-button>
  </div>
  </el-form>
</template>
<script>
/* v-model 在父组件和子组件上面双向绑定 value 发布事件input：父组件使用v-model绑定 v-model="backData.raw_material.main_material"
 子组件使用props接收，接收属性key值可以自定义，然后子组件中input 使用v-model="item.name"（此处处理后的值） 绑定该值即可 */
export default {
  props: {
    value:{
    },
    formName:''
  },
  data(){
   // 验证时，model绑定的是父组件传入的formName名，所以需要提前获取
    let stuffForm = this.formName;
    // 设置index用于stuffForm中初始值设置
    let index=this.index | 0;
    // 如果没有填入直接点击提交按钮会不进getInputValue法，需要设置this.index默认值为0
    this.index = this.index | index;

    var validateName = (rule, value, callback) => {
      // 注意此处是input双向绑定，所以通过this.value就可以得到input框输入的值
      if (this.value[this.index].name === "") {
        callback(new Error("请输入材料！"));
      } 
      callback();
    };
    var validateSpecs = (rule, value, callback) => {
      // 注意此处是input双向绑定，所以通过this.value就可以得到input框输入的值
      if (this.value[this.index].specs === "") {
        callback(new Error("请选择材料用量！"));
      }
      callback();
    };

    return {
      // 添加数据进行表单验证
      stuffForm:{
        // 需要对数组中所有值进行校验
        name:this.value[index].name,
        specs:this.value[index].specs
      },
      rules:{
        name: [
          { required:true, validator: validateName , trigger: 'blur' }
        ],
        specs: [
          { required: true, validator: validateSpecs , trigger: 'blur' },
        ],
      }
    }
  },
  methods:{
    removeItem(index){
      if(this.value.length===1){
        this.$message({
          message:"警告！！！只有一项了不能再删除了哦！",
          type:"warning"
        });
        return;
      }
      // 删除某一项
      this.value.splice((index-1),1);
    },
    addItem(){
      // vue中v-model的双向绑定原理及$emit(“input“)的使用
      // [ { "name": "", "specs": "" }, { "name": "", "specs": "" }, { "name": "", "specs": "" } ]
      this.value.push({ "name": "", "specs": "" });
      this.$emit("input",this.value);
      
    },
    // 子组件校验表单，由父组件调用
    validateStuff(){
      return new Promise((resolve, reject) => {
        let formName = this.formName;
        this.$refs.formName.validate((valid)=>{
          if (valid) {
            resolve(true)
          } else {
            reject(false)
          }
        });
      });
    },
    getInputValue(index,event,text){
      let value = event.target.value;
      if(text==='name'){
        this.value[index].name=value;
      }else{
        this.value[index].specs=value;
      }
      this.index = index;
    }
  }
}
</script>

<style lang="stylus">
.delete-icon 
  background-color #ccc
  border-radius 50%
  color #fff
  :hover
    background: #ff3232;
    color: #fff;
.raw-item
  // required:true的*号 和input框显示在一行，且input框会变宽
  // float left
  margin-right 65px
  margin-bottom 20px
  .el-input 
    margin-right 2px
    // required:true的*号 和input框显示在一行
    width: 86%;
</style>

