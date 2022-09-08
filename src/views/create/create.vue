<template>
  <el-form
    :model="backDataForm"
    :rules="rules"
    ref="backDataForm"
    label-width="100px"
    class="demo-ruleForm"
  >
    <div class="create">
      <h2>欢迎发布新菜谱，先介绍一下你的大作！</h2>
      <section class="create-introduce">
        <el-form-item label="标题" prop="title">
          <el-input class="create-input" placeholder="请输入内容" v-model="backDataForm.title"></el-input>
        </el-form-item>

        <!-- 最后得到的是property字符串值，prop直接使用property即可，但是这种方式错误信息不会同时显示 -->
        <!-- <el-form-item label="属性" prop="property"> -->
          <!-- style="width: 25%;用于控制下拉框长度 -->
          <el-form-item label="属性" prop="property">
          <el-select style="width:24%;margin-right:4px;"
            v-model="backDataForm.property[item.title]"
            :placeholder="item.parent_name"
            v-for="item in displayData.property"
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
        </el-form-item>
        <el-form-item label="菜谱分类" prop="classify">
          <!-- 父级使用label显示 -->
          <el-select v-model="backDataForm.classify" placeholder="请选择菜谱分类">
            <el-option-group
              v-for="group in displayData.classify"
              :key="group.parent_type"
              :label="group.parent_name"
            >
              <el-option
                v-for="classify in group.list"
                :key="classify.type"
                v-model="classify.type"
                :label="classify.name"
                :value="classify.type"
              ></el-option>
            </el-option-group>
          </el-select>
        </el-form-item>

        <h5></h5>
        <!-- 通过el-row和el-col将两个 el-form-item 一行显示（默认分行显示）-->
        <div class="upload-img-box clearfix">
          <el-row>
            <el-col :span="10">
              <el-form-item label="成品图 (328*440)" prop="product_pic_url">
                <div class="upload-img">
                  <!-- {{backDataForm.product_pic_url}} -->
                  <upload-img
                    action="/api/upload?type=product"
                    v-model="backDataForm.product_pic_url"
                    @imgUploaded="imgUploaded"
                    :imgUrl="displayData.product_pic_url"
                    :imgSty="imgProductSty"
                  ></upload-img>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item class="product-story" label=" " prop="product_story">
                <el-input
                  class="introduce-text"
                  type="textarea"
                  :rows="10"
                  placeholder="请输入内容"
                  v-model="backDataForm.product_story"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </section>
      <h2>记录所有原材料</h2>
      <!-- upload子组件通过ref获取值并进行校验 -->
      <section class="create-introduce">
        <h5>主料</h5>
        <!--[ { "name": "", "specs": "" }, { "name": "", "specs": "" }, { "name": "", "specs": "" } ]-->
        <!-- <el-form-item prop="raw_material.main_material"> -->
          <!-- 多次复用同一个子组件，调用时传入formName值进行区分，通过refs获取子组件实例，并调用子组件的表单验证方法 -->
        <Stuff id="mainMaterial" v-model="backDataForm.raw_material.main_material" ref="mainMaterialForm" :formName="'mainMaterialForm'"></Stuff>
        <!-- </el-form-item> -->
        <h5>辅料</h5>
        <Stuff id="accessoriesMaterial" v-model="backDataForm.raw_material.accessories_material"  ref="accessoriesMaterialForm" :formName="'accessoriesMaterialForm'"></Stuff>
      </section>

      <h2>开始写步骤了！能否简单易学就看你怎么写了，加油！</h2>
      <section class="create-introduce">
        <Upload ref="stepUploadForm"
          v-model="backDataForm.steps"
          :steps="backDataForm.steps"
          :imgSty="imgStepsSty"
          @updateStepsImgUrl="updateStepsImgUrl(arguments)"
        ></Upload>
        <el-button
          class="eaeaea add-step-button"
          type="primary"
          size="medium"
          icon="el-icon-plus"
          @click="()=>{this.backDataForm.steps.push({img_url: 'https://s1.c.meishij.net/n/images/upload_step_img.png',describe: '',})}"
        >增加一步</el-button>
        <h5>烹饪小技巧</h5>
        <el-input
          class="introduce-text"
          type="textarea"
          :rows="8"
          placeholder="分享下你做这道菜的过程中的心得和小技巧吧！"
          v-model="backDataForm.skill"
        ></el-input>
      </section>
      <!-- loading效果只需要加:loading="loading"即可 -->
      <el-button
        class="send"
        type="primary"
        size="medium"
        :loading="loading"
        @click="publishMenu('backDataForm')"
      >搞定，提交审核</el-button>
    </div>
  </el-form>
</template>
<script>
import Stuff from "./stuff";
import Upload from "./step-upload";
import UploadImg from "@/components/upload-img";
import { getProperty, getClassify, publish } from "@/service/api";
import { log } from 'util';

export default {
  name: "create",
  components: { Stuff, Upload, UploadImg },
  data() {
    // 自定义校验规则
    var validateProperty = (rule, value, callback) => {
      if (value.craft === "") {
        callback(new Error("请选择工艺种类！"));
      } else if (value.flavor === "") {
        callback(new Error("请选择口味！"));
      } else if (value.hard === "") {
        callback(new Error("请选择难度系数！"));
      } else if (value.people === "") {
        callback(new Error("请选择人数！"));
      } else {
        callback();
      }
    };

    return {
      index:0,
      // 用于显示页面数据结构
      displayData: {
        name: "",
        property: {
          craft: { type: String, required: true }, // 工艺 enum: [1,2,3,4],
          flavor: { type: String, required: true }, // 口味  enum: [1,2,3,4],
          hard: { type: String, required: true }, // 难度 enum: [1,2,3,4],
          people: { type: String, required: true } // pepole 人数: [1,2,3,4],
        },
        classify: { type: String, required: true },
        // 设置默认
        product_pic_url: "https://s1.c.meishij.net/n/images/upload_big_img.png?_=1561906961",
        product_story: "",
        raw_material: {
          // 原材料
          main_material: [
            {
              // 主料
              name: "",
              specs: ""
            }
          ],
          accessories_material: [
            {
              // 辅料
              name: "",
              specs: ""
            }
          ]
        },
      },
      // 用于传送给后端的数据
      backDataForm: {
        title: "",
        property: {
          // 此处定义时一定要定义为''，定义为{}或者craft: {type: String,  required: true}显示会出错
          craft: "", // 工艺 enum: [1,2,3,4],
          flavor: "", // 口味  enum: [1,2,3,4],
          hard: "", // 难度 enum: [1,2,3,4],
          people: "" // pepole 人数: [1,2,3,4],
        },
        // 设置默认
        product_pic_url: "",
        product_story: "",
        raw_material: {
          // 原材料
          main_material: [
            {
              // 主料
              name: "",
              specs: ""
            }
          ],
          accessories_material: [
            {
              // 辅料
              name: "",
              specs: ""
            }
          ]
        },
        steps: [
          {
            img_url: "https://s1.c.meishij.net/n/images/upload_step_img.png",
            describe: ""
          }
        ],
        skill: "",
        classify: ""
      },
      rules: {
        title: [
          { required: true, message: "请输入菜谱标题", trigger: "blur" },
          { min: 1, max: 50, message: "长度在 1 到 50 个字符", trigger: "blur" }
        ],
        property: [
          { required: true, validator: validateProperty, trigger: "change" }
        ],
        // 下拉框需要设定type为array
        classify: [
          { required: true, message: "请选择菜谱分类", trigger: "change" }
        ],
        product_pic_url: [
          { required: true, message: "请点击上传成品图", trigger: "change" }
        ],
        product_story: [
          { required: true, message: "请输入成品描述", trigger: "blur" }
        ],
      },
      imgUrl: "",
      // 后台指定了宽高
      imgProductSty:{
         width: '328px',
         height: '440px'
      },
      imgStepsSty:{
        width: '200px',
        height: '200px'
      },
      loading: false,

      // 模拟提交数据
      mockData:{
        title: "测试title",
        property: {
          craft: 1, // 工艺 enum: [1,2,3,4],
          flavor: 2, // 口味  enum: [1,2,3,4],
          hard: 3, // 难度 enum: [1,2,3,4],
          people:4 // pepole 人数: [1,2,3,4],
        },
        // 设置默认
        product_pic_url: "blob:http://localhost:8081/acb40caf-11f4-40d1-860b-14eea04546f6",
        product_story: "测试成品图描述",
        raw_material: {
          // 原材料
          main_material: [
            {
              // 主料
              name: "鸡腿",
              specs: "一根"
            },
            {
              name: "香菇",
              specs: "4颗"
            }
          ],
          accessories_material: [
            {
              // 辅料
              name: "盐",
              specs: "少许"
            },
            {
              name: "洗姜",
              specs: "两片"
            },
          ]
        },
        steps: [
          {
            img_url: "https://s1.c.meishij.net/n/images/upload_step_img.png",
            describe: "将鸡腿放入锅中焯水,5分钟后捞出备用"
          },
          {
            img_url: "https://s1.c.meishij.net/n/images/upload_step_img.png",
            describe: "热油，倒入蒜片姜片煸香后，倒入备用的鸡腿，放进洗好的香菇，20分钟后即可出锅"
          },
        ],
        skill: "测试skill",
        classify: "1-2",
        parent_classify: "1"
      }
    };
  },
  created() {
    this.getProperty();
    this.getClassify();
  },
  methods: {
     validateForm(formName){
      return new Promise((resolve, reject) => {
        formName.validate((valid)=>{
          if (valid) {
            resolve(true)
          } else {
            reject(false)
          }
        });
      });
    },
    publishMenu(backDataForm) {
      //  this.backDataForm = this.mockData;
      // 父组件本身校验
      let backDataFlag = this.validateForm(this.$refs.backDataForm);
      // 同时验证子组件表单
      let accessoriesMaterialFlag = this.$refs.accessoriesMaterialForm.validateStuff();
      let mainMaterialFlag = this.$refs.mainMaterialForm.validateStuff();
      let stepUploadFlag = this.$refs.stepUploadForm.validateStepUpload();

      // 如果所有表单（父组件和子组件）都校验通过，则数组里全返回状态为true的promise对象。Promise.all 的异步性（如果传入的可迭代对象是空的，就是同步）
      Promise.all([backDataFlag, accessoriesMaterialFlag,mainMaterialFlag,stepUploadFlag]).then((res) => {
      // 点击之后将按钮样式改为loading提交状态
        this.loading = true;
        
        console.log(this.backDataForm);
        publish(this.backDataForm)
          .then(res => {
            this.loading = false;

            if(res.code===0){
              this.$message({
                message: "恭喜你，发布成功！",
                type: "success"
              });
              // 发布成功后，跳转到个人空间页
              this.$router.push({
                path:'/space/works',
                query:{
                  userId:this.$store.state.userInfo.userId
                }
              });
            }

          }).catch(error => {
            console.log(error);
          this.$message({
              message: "发布失败！",
              type: "error"
            });
            this.loading = true;
          });

      }).catch(err=>{
        this.$message({
              message: "请检查是否有漏填项！",
              type: "error"
         });
      })
    },
    async getProperty() {
      let propertyData = await getProperty();
      if (propertyData.ec === 200) {
        this.displayData.property = propertyData.data;
      }
    },
    async getClassify() {
      let classifyData = await getClassify();
      if (classifyData.ec === 200) {
        this.displayData.classify = classifyData.data;
      }
    },
    imgUploaded(url) {
      if (url!=='') {
        this.displayData.product_pic_url = url;
        this.backDataForm.product_pic_url = url;
      }
    },
    updateStepsImgUrl(params) {
      // 父组件中：如果子组件传递一个参数不需要写，传递过来多个参数，需要使用arguments进行接收 @updateStepsImgUrl="updateStepsImgUrl(arguments)"
      // $emit()传递过来的多个参数，通过params[0],params[1]方式进行获取
      
      // 图片尺寸等不符合时，不会发起请求，返回new Promise()后则会调用on-remove中的方法 则此处file也就不存在，但是还是会回调到这里
      // params[0]为url
      console.log(params[0],params[1]);
      
      if(params[0]!==''){
        this.backDataForm.steps[params[1]].img_url =params[0];
      }
    }
  }
};
</script>
<style lang="stylus">
.create-introduce {
  background-color: #fff;
  padding: 20px;

  .add-step-button {
    margin-left: 100px;
  }
}

.create {
  width: 100%;

  h2 {
    text-align: center;
    margin: 20px 0;
  }

  .send {
    // ff3232()
    height: 70px;
    width: 220px;
    background: #ff3232;
    color: #fff;
    border: none;
    margin: 20px auto;
    display: block;
  }

  h5 {
    margin: 20px 0;
  }
}

.create-input input {
  width: 446px;
  line-height: 22px;
}

.upload-img-box {
  .upload-img {
    float: left;
  }

  .introduce-text {
    float: left;
  }

  .el-textarea {
    width: 60%;
    margin-left: 6px;
  }

  .product-story .el-form-item__content {
    width: 120%;
  }
}
</style>


