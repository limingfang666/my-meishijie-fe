import Vue from 'vue';
import Vuex from 'vuex';
// 引入API
import { getBanner, getMenus, getUserInfo } from '@/service/api.js'

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        userInfo:{},
        banners: JSON.parse(sessionStorage.getItem("BANNERS_INFO")) || {},
        menuInfos:{}
    },
    getters: {
        isLogin(state){
            // 注意此处state表示store中的state,以方法方式返回时返回值中的参数即方法中的参数
            // 通过有没有userInfo判断是否已登录
            // 注意：userInfo为Object对象，没有length属性，所以userInfo.length为undefined，!!userInfo.length为false
            return !!Object.keys(state.userInfo).length;
        },
        // 获取banner且刷新时也需要
        getBanner(state) {
            return function(menuId) {
                if (menuId === '') {
                    return state.banners;
                }
                return state.banners.filter(item => menuId == item._id);
            }
        }
    },
    mutations: {
        // 操作store
        getBannerMut(state, payload) {
            state.banners = payload;
            //vuex中的变量是响应式的，数据存储在内存中，页面手动刷新后数据就丢失了，所以将数据放进sessionStorage(是存储到当前页面关闭为止，和其他tab页没关联)中
            sessionStorage.setItem("BANNERS_INFO", JSON.stringify(payload));
        },

        getMenusMut(state, payload){
            if(typeof state.menuInfos.list === 'undefined') {
                state.menuInfos = payload;
            }else{
                state.menuInfos.list.push(...payload.list);
            }
        },
        updateUserInfo(state, payload) {
            state.userInfo = payload;
        }
    },
    actions: {
        async getBannerAct(store, payload) {
            await getBanner().then(data => {
                store.commit("getBannerMut", data.data.list);
            }).catch(err => {
                console.log(err);
            });
        },
        async getMenusAct(store, payload) {
            // 注意传参方式
            let params = {page:payload};
            
            await getMenus(params).then(data => {
            
                store.commit("getMenusMut", data.data);
            }).catch(err => {
                console.log(err);
            });
        },

    }
})

export default store;