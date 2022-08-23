/*
 * @Author: limingfang666 1275012490@qq.com
 * @Date: 2022-07-28 14:38:52
 * @LastEditors: limingfang666 1275012490@qq.com
 * @LastEditTime: 2022-07-28 15:01:55
 * @FilePath: \meishijie-backe:\StudyFile\kaikeba\works\Vue\VuePracticalProject\my-meishijie-fe\src\tools\format.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Vue from 'vue'
Vue.filter('formatTime', (val, arg) => {
    if (!val) return;
    return val.substr(0, arg);
})