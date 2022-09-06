/*
 * @Author: limingfang666 1275012490@qq.com
 * @Date: 2022-06-24 11:43:59
 * @LastEditors: limingfang666 1275012490@qq.com
 * @LastEditTime: 2022-08-24 14:47:02
 * @FilePath: \meishijie-backe:\StudyFile\kaikeba\works\Vue\VuePracticalProject\my-meishijie-fe\src\service\api.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 自定义封装http发送axios请求
import axios from 'axios';

// 创建HttpRequest对象
class HttpRequst {
    // 构造函数
    constructor(options) {
            this.defaults = {
                    // 定义根节点url
                    baseUrl: ''
                }
                // 将传入url和原有url融合(如baseUrl为/api，传入为/getBanner则最后url为/api/getBanner)
            this.defaults = Object.assign(this.defaults, options);
        }
        // axios请求拦截器：接收的是axios对象实例。拦截请求前/后对数据进行自定义处理（如在请求头中加入token信息等）
    interceptors(instance) {
            // 发送请求前
            instance.interceptors.request.use(req => {
                // 发送请求前，获取token并将token设置到header请求头中
                let token = localStorage.getItem("token");
                if (token) {
                    req.headers.authorization = `token ${token}`; //${token} 为ES6获取数据方式
                }
                // 注意返回位置
                return req;
            }, err => {
                return Promise.reject(err);
            });

            // 请求响应前
            instance.interceptors.response.use(res => {
                // 将响应数据code,status,data解构出来
                const { code, status, data } = res;

                return data;
            }, err => {
                return Promise.reject(err);
            });


        }
        // 创建实例方法
    request(options) {
        // 构造函数中的属性可以直接调用
        // 注意此处传参的option不要写成this.options，否则会传undefined进去
        options = Object.assign(this.defaults, options);

        // 创建axios实例
        const instance = axios.create(options);
        // 通过自定义拦截器，处理请求/响应数据后，再次返回实例
        this.interceptors(instance);
        return instance;
    }
}

const request = new HttpRequst({
    // 这里的baseURL和this.defaults的baseUrl不是一个
    baseURL: '/api'
});

// 调用创建实例方法创建实例（可创建多个：当/api /api2等有多个时，封装方法好处显现）
const http = request.request();

/**
 * @description: 上传图片
 * @param {string} params.type 图片类型
 * @return {*}
 */
export async function upload(params) {
    return await http.post('/upload');
}

/**
 * @description: 获取banner数据
 * @return {*}
 */
export async function getBanner() {
    return await http.get('/banner');
}

/**
 * @description: 注册用户
 * @param {string} params.name
 * @param {string} params.password
 * @param {string} params.sign
 * @param {string} params.avatar
 * @param {string} params.userage
 * @param {string} params.follows
 * @param {string} params.following
 * @param {string} params.collections
 * @param {string} params.logindate
 * @param {string} params.createdAt
 * @param {string} params.updateAt
 * @return {*}
 */
export async function register(params) {
    return await http.post('/user/create', params);
}

/**
 * @description: 用户登录
 * @param {string} params.name
 * @param {string} params.password
 * @return {*}
 */
export async function login(params) {
    return await http.post('/user/login', params);
}

/**
 * @description: 用户登出
 * @param {string} params._id
 * @return {*}
 */
export async function loginOut(param) {
    return await http.post('/user/login_out');
}


/**
 * @description: 获取用户信息
 * @param {string} [params._id]
 * @return {*}
 */
export async function getUserInfo(param) {
    return await http.post('/user/info', param);
}

/**
 * 编辑个人资料
 * @export
 * @param {string} [params] - 传入user对象
 * @param {string} params._id - _id
 * @param {string} [params.name] - 名字
 * @param {string} [params.password] - 密码
 * @param {string} [params.avatar] - 头像
 * @param {string} [params.userage] - 年龄
 * @param {string} [params.follows] - 粉丝
 * @param {string} [params.following] - 关注
 * @param {string} [params.collections] - 收藏
 * @param {string} [params.logindate] - 登录时间
 * @param {string} [params.createdAt] - 创建时间
 * @param {string} [params.updateAt] - 修改时间
 * @returns
 */
export async function userEdit(params) {
    return await http.post('/user/edit', params);
}

// 用户操作行为
/**
 * post 关注或取消关注指定的用户 
 * @export
 * @param {string} params.followUserId - followUserId
 * @returns
 */
export async function follow(params) {
    return await http.post('/user/following', params);
}
/**
 * get 获取关注者
 * @export
 * @param {string} params.userId - userId
 * @returns
 */
export async function following(params) {
    return await http.get('/user/following', { params });
}
/**
 * 获取我的粉丝
 * @export
 * @param {string} params.userId - userId
 * @returns
 */
export async function getFans(params) {
    return await http.get('/user/fans', { params });
}

// 我收藏的
/**
 * get 获取关注者
 * @export
 * @param {string} params.userId - userId
 * @returns
 */
export async function getCollection(params) {
    return await http.get('/user/collection', { params });
}
/**
 * post 关注或取消关注指定的用户 {:,}
 * @export
 * @param {string} params.userId - userId
 * @param {string} params.menuId - menuId
 * @returns
 */
export async function collection(params) {
    return await http.post('/user/collection', params);
}


// 菜谱相关
/**
 * 发布菜谱
 * @export
 * @param {string} [params.userId] - 用户的菜谱id
 * @param {string} [params.name] - 发布菜谱作者
 * @param {string} [params.collectionUsers] - 收藏人id
 * @param {string} params.title - 菜谱标题
 * @param {string} params.property - 菜单属性
 * @param {string} params.property.craft - 工艺
 * @param {string} params.property.flavor - 口味
 * @param {string} params.property.hard - 难度
 * @param {string} params.property.people - 人数
 * @param {string} params.product_pic_url - 菜谱图片
 * @param {string} params.product_story - 菜谱描述
 * @param {string} [params.raw_material] - 菜谱原材料
 * @param {string} [params.raw_material.main_material] - 菜谱主料
 * @param {string} [params.raw_material.accessories_material] - 菜谱辅料
 * @param {string} [params.steps] - 菜谱步骤
 * @param {string} [params.steps.img_url] - 菜谱步骤图
 * @param {string} [params.steps.describe] - 菜谱描述
 * @param {string} [params.skill] - 烹饪小技巧
 * @param {string} params.classify - 菜谱分类
 * @param {string} params.parent_classify - 菜谱父级分类
 * @param {Date} [params.createdAt] - 菜谱创建时间分类
 * @param {Date} [params.updateAt] - 菜谱修改时间分类
 * @returns
 */
export async function publish(params) {
    return await http.post('/menu/publish', params);
}

/**
 * 查询菜谱 GET
 * @export
 * @param {Object} [params] - 不填写，则获取所有的菜谱
 * @param {string} [params.userId] - 指定用户的菜单
 * @param {string} [params.classify] - 按照菜单分类，进行筛选
 * @param {string} [params.property] - 指定菜单属性进行筛选
 * @param {string} [params.page] - 指定页码
 * @returns
 */
export async function getMenus(params) {
    return await http.get('/menu/query', { params });
}

/**
 * 获取所有的分类
 * @export
 * @returns
 */
export async function getClassify() {
    return await http.get('/menu/classify');
}
/**
 * 获取所有属性的分类
 * @export
 * @returns
 */
export async function getProperty() {
    return await http.get('/menu/property');
}

/**
 * 根据菜单id获取菜单信息
 * @export
 * @param {string} params.menuId - 菜单id
 * @returns
 */
export async function getMenuInfo(params) {
    return await http.get('/menu/menuInfo', { params });
}

/**
 * 添加评论信息-post
 * @export
 * @param {Object} params.userId - 
 * @param {string} params.userInfo - 
 * @param {string} params.menuId - 
 * @param {string} params.commentText - 
 * @param {string} params.createdAt - 
 * @param {string} params.updateAt - 
 * @returns
 */
export async function postComment(params) {
    return await http.post('/menu/comment', params);
}

/** 获取评论信息-get
 * @export
 * @param {Object} [params.userId] - 
 * @returns
 */
export async function getComments(params) {
    return await http.get('/menu/comment', { params });
}