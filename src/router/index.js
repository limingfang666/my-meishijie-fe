import Vue from 'vue'
import VueRouter from 'vue-router'
import { getUserInfo } from '@/service/api'
import Store from '@/store'

Vue.use(VueRouter);

// 1. 定义路由组件.
// 也可以从其他文件导入(注意不能写成const Home = '@/views/home/Home.vue')
const Home = () =>
    import ('@/views/home/Home.vue');
// 菜单详情
const Detail = () =>
    import ( /* webpackChunkName: "detail" */ '@/views/detail/detail.vue');
// 菜谱
const Recipe = () =>
    import ( /* webpackChunkName: "recipe" */ '@/views/recipe/recipe.vue');
// 发布菜谱
const Create = () =>
    import ( /* webpackChunkName: "create" */ '@/views/create/create.vue');
// 菜单列表
const Menus = () =>
    import ( /* webpackChunkName: "menus" */ '@/components/menus.vue');

// 个人空间
const Space = () =>
    import ( /* webpackChunkName: "UserSpace" */ '@/views/user-space/space.vue');
const Edit = () =>
    import ( /* webpackChunkName: "UserSpace" */ '@/views/user-space/edit.vue');
const Fans = () =>
    import ( /* webpackChunkName: "UserSpace" */ '@/views/user-space/fans.vue');
const MenuList = () =>
    import ( /* webpackChunkName: "UserSpace" */ '@/views/user-space/menu-list.vue');

// 登录
const Login = () =>
    import ( /* webpackChunkName: "login" */ '@/views/user-login/index.vue');
const Register = () =>
    import ( /* webpackChunkName: "register" */ '@/views/user-login/index.vue');

// 2. 定义一些路由
// 每个路由都需要映射到一个组件。
const userSpaceRoute = [
    // 编辑个人信息
    { name: 'edit', path: '/space/edit', component: Edit, meta: { login: true } },
    {
        name: 'space',
        path: '/space',
        component: Space,
        meta: { login: true },
        children: [
            // 作品、粉丝、关注、收藏
            // 默认显示作品，path设置为''
            { name: 'works', path: 'works', component: MenuList, meta: { login: true } },
            { name: 'fans', path: 'fans', component: Fans, meta: { login: true } },
            { name: 'following', path: 'following', component: Fans, meta: { login: true } },
            { name: 'collection', path: 'collection', component: MenuList, meta: { login: true } },
        ]
    },
];
const menusRoute = [
    // 菜谱
    { name: 'detail', path: '/detail', /* props: true,*/ component: Detail, meta: { login: true } },
    { name: 'recipe', path: '/recipe', component: Recipe },
    // 发布菜谱
    { name: 'create', path: '/create', component: Create, meta: { login: true } },
];

const routes = [
    { name: 'home', path: '/', component: Home },

    // 菜谱
    ...menusRoute,

    // 用户信息
    ...userSpaceRoute,

    // 登录、注册、退出(没有页面)
    { name: 'login', path: '/login', component: Login, meta: { login: true } },
    { name: 'register', path: '/register', component: Register },
    {
        path: '*',
        name: 'noFound',
        title: '未找到',
        redirect: {
            name: 'home'
        }
    }
];

const router = new VueRouter({
    mode: 'history',
    routes,
});

router.beforeEach(async(to, from, next) => {
    // 判断是否需要鉴权登录
    // 因为有二级路由，父级路由或者子路由中其中有一个需要登录，则需要登录
    const metaLogin = to.matched.some(item => item.meta.login === true);

    // 只判断token不行，因为有可能通过页面修改token值直接登录，所以需要每次请求都发送后端校验是否真的已登录(不能放在判断token时存，因为所有页面都需要用到)
    const userInfo = await getUserInfo();
    //将userInfo信息存到vuex中(此处取不到this，所以需要引入Store)
    Store.commit("updateUserInfo", userInfo.data);

    if (metaLogin) {
        // 通过是否有token判断是否登录(有token则已登录)
        const token = localStorage.getItem("token");

        if (!!token && userInfo.code === 0) {
            // 已经登录，且路由地址为login则跳转到home页面，否则进入路由地址页面
            if (to.name == 'login') {
                next('/');
            } else {
                next();
            }
        } else {
            // userInfo.code === 1 (token不合法，请登录 或者 登录已过期，请重新登录)会直接走这里
            // 没有token或userInfo.code === 0 表示没有登录，需要跳转到登录页面
            // 如果地址栏为http://localhost:8080/login，又没有token和登录信息，进入到这里，next又跳转到login,就会进入死循环
            // 没登录，进入login，则直接进入
            if ((!token || userInfo.code === 1) && to.name === 'login') {
                next();
            }

            // 没登录，进入的不是login，则进入login
            if ((!token || userInfo.code === 1) && to.name !== 'login') {
                next({ name: 'login' });
            }
            // 有token时，将token清空。userInfo.code非0非1，后端登录返回错误但是有token信息，token有可能是被伪造的
            if (!!token) {
                localStorage.removeItem("token");
            }
            return;
        }

    } else {
        next();
    }

});

// 解决浏览器懒加载文件缓存出现问题后报错
router.onError((error) => {
    const pattern = /Loading chunk (\d)+ failed/g;
    const isChunkLoadFailed = error.message.match(pattern);
    const targetPath = router.history.pending.fullPath;
    if (isChunkLoadFailed) {
        router.replace(targetPath);
    }
});

export default router;