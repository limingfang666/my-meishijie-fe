<!--
 * @Author: limingfang666 1275012490@qq.com
 * @Date: 2022-06-24 11:43:59
 * @LastEditors: limingfang666 1275012490@qq.com
 * @LastEditTime: 2022-08-16 17:04:23
 * @FilePath: \meishijie-backe:\StudyFile\kaikeba\works\Vue\VuePracticalProject\my-meishijie-fe\src\components\upload-img.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <!-- 后台接口只能给jpg格式 -->
  <el-upload
    class="avatar-uploader"
    ref="upload"
    :action="action"
    accept=".jpg, .png"
    :on-success="handleSuccess"
    :before-upload="beforeUpload"
    :file-list="fileList"
    :on-change="handleChange"
    :on-remove="handleRemove"
    :on-error="handleError"
  >
    <img :src="imgUrl" v-if="imgUrl" :style="imgSty" ref="img" />
    <i v-else class="avatar-uploader-icon"></i>
  </el-upload>
</template>
<script>
export default {
  props: {
    imgUrl: {},
    imgSty: {},
    action: ""
  },
  data() {
    return {
      // 用于存储所有上传文件，如果只上传一张图片，后一张覆盖前一张，需要在on-change事件中进行处理
      fileList: []
    };
  },
  methods: {
    beforeUpload(file) {
      // accept="image/jpeg,image/jpg,image/png"也可设置在样式中，这个属性设置后，点击上传后，浏览文件夹中不会展示除设置类型以外的图片
      // const isJPGOrPNG = file.type === 'image/jpeg' || 'image/png';
      // const isLt50KB = file.size / 1024  < 100;
            // if (!isJPGOrPNG) {
      //   this.$message.error('上传头像图片只能是 JPG 或者 PNG 格式!');
      // }
      // if (!isLt50KB) {
      //   this.$message.error('上传头像图片大小不能超过 100KB!');
      // }
      // return isJPGOrPNG && isLt50KB;
      // return isLt50KB;

// elementUI 官方文档中说明before-upload上传文件之前的钩子，参数为上传的文件，若返回 false(此处没用可能是使用了自动提交) 或者返回 Promise 且被 reject，则停止上传。
    return new Promise((resolve,reject)=>{
      // 获取type类型，根据不同类型，规范图片大小。file.size / 1024 为W
      // product:size: 1024 * 1024 * 10,steps:size: 1024 * 1024 * 10,user:1024 * 1024 * 2
      // split()将字符串分割成数组
      const type = this.action.split("type=")[1];

      let fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      let _this = this;

      fileReader.onload = function(e) {
        if (fileReader.readyState == 2) {
          const img = new Image();
          let base64 = fileReader.result;
          img.src = base64;
          img.onload = function() {
            _this.limitImage(file,type,img,resolve,reject);
          }
        }else{
          // 图片上传出现未知错误
          reject();
        }
      };
    });

    },
    limitImage(file,type,img,resolve,reject){
      // 规范imgUrl的宽高。step:width: 550,height: 400,product:width: 328,height: 440,user:width: 210, height: 210
      if (type === "product") {
        if (
          img.width !== 328 ||
          img.height !== 440
        ) {
          this.$message({
            message: "成品图尺寸不符合，必须为328px*440px",
            type: "error"
          });
          reject();
        }
        if (file.size > 1024 * 1024 * 10) {
          this.$message({
            message: "成品图大小不符合",
            type: "error"
          });
            reject();
        }
        resolve();
      } else if (type === "user") {
        if (
          img.width !== 210 ||
          img.height !== 210
        ) {
          this.$message({
            message: "头像尺寸不符合，必须为210px*210px",
            type: "error"
          });
            reject();
        }
        if (file.size > 1024 * 1024 * 2) {
          this.$message({
            message: "头像大小不符合",
            type: "error"
          });
            reject();
        }
        resolve();
      } else if (type == "step") {
        if (
          img.width > 550 ||
          img.height > 440 ) {
          this.$message({
            message: "步骤图尺寸不符合，宽不能超过550px，高不能超过440px",
            type: "error"
          });
            reject();
        } else if (file.size > 1024 * 1024 * 10) {
          this.$message({
            message: "步骤图大小不符合",
            type: "error"
          });
            reject();
        }
        resolve();
      }
    },
    handleSuccess(res, file) {
      if(res.code===0){
        this.$message({
          message:"图片上传成功",
          type:"success"
        });
      // 注意不能在子组件修改父级传入的数据imgUrl
      // 成功了将res中返回的url，返回去
      this.$emit("imgUploaded", res.data.url);
      }
    },
    // 直接在样式中设置limit属性，只能实现上传一张图片,后续不能更改；
    // 如果想只上传一张图片，且再次上传覆盖上一次需要使用on-change实现（这种方式不能再使用limit属性）
    handleChange(file, fileList) {
      if (fileList && fileList.length >= 2) {
        fileList.shift();
      }
      // 已经设置了自动提交属性，这里再submit就会提交两次
      // this.$refs.upload.submit();
    },
    handleRemove(file) {
      // 点击清除按钮时,获取的file是被删除的file。此处fasle为删除上传图片的标识
      this.$emit("imgUploaded", false);
    },
    //
    handleError(err, file, fileList) {
      if (err.success === "false") {
        this.$message({
          message: "上传图片错误",
          type: "error"
        });
      }
    }
  }
};
</script>