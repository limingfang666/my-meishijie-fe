import Vue from 'vue'
import moment from 'moment';

moment.updateLocale('zh-cn', {
    // 注意meridiem在moment()下的_local对象下，所以访问路径必须为moment()._locale.meridiem()
    // 官方文档：逻辑有问题
    meridiem: function(hour, minute, isLowercase) {
        if (hour < 6) {
            return "凌晨";
        } else if (hour >= 6 && hour < 9) {
            return "早上";
        } else if (hour >= 6 && hour < 11) {
            return "上午";
        } else if (hour >= 11 && hour < 13) {
            return "中午";
        } else if (hour >= 13 && hour < 18) {
            return "下午";
        } else {
            return "晚上";
        }
    },
});

Vue.filter('dateTime', (val) => {

    return moment(val).format('YYYY年MM月DD日') + ' ' +
        moment(val)._locale.meridiem(moment(val).format('hh'), moment(val).format('mm'), false) + ' ' +
        moment(val).format('hh') + '点' +
        moment(val).format('mm') + '分';
});