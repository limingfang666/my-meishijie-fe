<template>
    <div class="recipe">
        <!-- 菜谱分类 start -->
        <el-tabs type="border-card" @tab-click="clickTab">
            <el-tab-pane 
                v-for="classify in classifies" 
                :key="classify.parent_type"
                :label="classify.parent_name"
            >
                <div class="recipe-link">
                    <router-link :to="{name:'recipe',query:{...$route.query,classify:item.type,page:page}}" 
                        v-for="item in classify.list"
                        :key="item.type"
                        :name="item.type"
                        :class="{'active':item.type===classifyType}"
                    >
                        {{item.name}}
                    </router-link>
                </div>
            </el-tab-pane>
        </el-tabs>
        <!-- 菜谱分类 end -->
        <h2>家常好味道，给你家一般的温暖</h2>
        <el-container>
            <el-aside width="220px" class="recipe-aside">
                <div class="filter-box">
                    <h4>筛选</h4>
                    <!-- 筛选 start -->
                    <el-collapse>
                        <el-collapse-item
                            v-for="item in properties"
                            :key="item.parent_type"
                            :title="item.parent_name"
                        >
                            <div class="filter-tags"
                            >
                                <el-tag type="info" @click="clickType($event,property.type)"
                                    v-for="property in item.list"
                                    :title="property.title"
                                    :key="property.type"
                                    :name="property.type"
                                    :class="{'tag-selected':propertyType[property.title]==property.type}"
                                >{{property.name}}</el-tag>
                            </div>
                        </el-collapse-item>
                    </el-collapse>
                    <!-- 筛选 end -->
                </div>
            </el-aside>
            <el-main class="filter-menus-box"
                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-background="rgba(1, 0, 0, 0.8)"
            >
               <div class="menu-empty" v-if="!menuInfos.length">暂时没有过滤出菜谱信息，请选择其他的筛选条件</div>
                <menu-card style="min-height: 75%;" :menuInfos="menuInfos"></menu-card>
                <div style="text-align: right;">
                    <!-- pageSize加了.sync修饰符，后组件中可以直接通过this.pageSize得到当前页 -->
                    <!-- 加了:current-page.sync="page" 属性，page数据会跟着当前current_page的值更改  -->
                    <el-pagination v-if="menuInfos.length"
                        style="display: inline-block;"
                        :pageSize="pageSize"
                        :total="total"
                        :current-page.sync="page"
                        @current-change="currentChange"
                        @prev-click="preClick"
                        @next-click="nextClick"
                    >
                    </el-pagination>
                </div>
            </el-main>
        </el-container>
    </div>
</template>
<script>
import MenuCard from '@/components/menu-card.vue'
import { getClassify, getProperty, getMenus } from '@/service/api'
import { log } from 'util'

export default {
    components: {MenuCard},
    data() {
        return {
            classifies:[],
            properties:[],
            classifyType:'1-1',
            // 地址栏query 中property有多个值，页面渲染时，如果在query里包含当前，就设置class为active
            propertyType:{},
            // 用于分页
            pageSize:5,
            total:0,
            page:1,
            // 用于发起请求的数据
            menuInfos:[],
            propertyInfo:[],
            loading:true
        }
    },
    watch:{
        // 监听$route，如果没有classify则设置默认
        $route:{
            handler(){
                let {classify } = this.$route.query;
                // 首次进入
                // 如果路由地址中没有classify，则记录且将其active样式设置为true
                if(undefined === classify){
                    this.$router.push({
                        path:this.$route.path,
                        query:{
                            ...this.$route.query,
                            classify:this.classifyType,
                            page:this.page
                        }
                    });
                }else{
                    // 设置classify样式
                    this.classifyType = classify;
                    this.queryMenus();
                }

                // property点击时，路由变化后&craft=1-1&flavor=2-2&hard=3-2&people=4-1，如果路由中存在的和该点击元素的值相同，则设置tag-selected样式为true 
                // 注意设置值要在路由变化后设置，在点击方法中设置会是点击前的query值
                this.propertyType = this.$route.query;
                
            },
            immediate:true
        }
    },
    mounted(){
        // 获取菜谱分类
        getClassify().then((res)=>{
            if(res.ec === 200){
                this.classifies = res.data;
            }
        });

        getProperty().then((res)=>{
            if(res.ec === 200){
                this.properties = res.data;
            }
        });
        
        // 手动刷新地址栏时，也需要发起请求
        this.queryMenus();
    },
    methods:{
        clickTab(tab){
            this.classifyType = Number(tab.index)+1+'-'+1;
            this.$router.push({
                path:this.$route.path,
                query:{
                    ...this.$route.query,
                    classify:this.classifyType,
                    page:this.page
                }
            });
        },
        clickType(e,type){
            let {title} = e.target;
            // 判断如果this.propertyType[title] === type时过滤掉当前query中的title，否则会报错Uncaught (in promise) NavigationDuplicated {_name: 'NavigationDuplicated', name: 'NavigationDuplicated', message: 'Navigating to current location ("/recipe?classify=1-1&page=1&craft=1-2") is not allowed', stack: 'Error\n    at new NavigationDuplicated (webpack-int…node_modules/vue/dist/vue.runtime.esm.js:1853:26)'}
            if(this.$route.query[`${title}`] === type){
                delete this.propertyInfo[`${title}`];
                this.$router.push({
                    path:this.$route.path,
                    // this.propertyInfo是专门存储各个property点击或取消后的值，query参数可是使用其进行设置
                    // 使用this.$route.query[`${title}`]只能控制当前点击的property单个值，不能记录所有点击或取消或的property值
                    query:{
                        ...this.propertyInfo
                    }
                });

            }else{
                this.$router.push({
                    path:this.$route.path,
                    query:{
                        ...this.$route.query,
                        // ES6动态设置对象的key值[]
                        [title]:type
                    }
                });
            }
            // 记录property选择项：将参数及值设置进请求数据中
            this.propertyInfo = {...this.propertyInfo,[title]:type};
            // 如果this.propertyType[title] === type证明地址栏传过来有该title对象，undefined表示点击，需要给地址栏加上该参数
        },
        queryMenus(){
            // 保证每次发起请求都会先显示遮罩层
            this.loading = true;
            // 参数结构：{page: 1, classify: '1-2', property: {…}}
            // 手动刷新时property:this.propertyInfo需要从地址栏获取
            if(!this.propertyInfo.length){
                let queryInfo = this.$route.query;
                // 过滤对象方法
                // 方法一：delete
                // delete queryInfo.page;
                // delete queryInfo.classify;
                // this.propertyInfo = queryInfo;

                // 方法二：解构
                const { page,classify, ...query} = queryInfo;
                this.propertyInfo = query;
            }

            // 如果手动刷新或分享地址栏时，需要获取page值,否则使用默认page值1
            this.page = Number(this.$route.query.page) || this.page;
            
            getMenus({page:this.page,classify:this.classifyType,property:this.propertyInfo}).then(res=>{
                // 每次发起请求之前先显示遮罩层
                // 数据出来后，将loading设置为false
                if(res.code===0){
                    this.loading = false;
                    this.menuInfos = res.data.list;
                    this.total= res.data.total;
                }
            });
            
        },

        currentChange(){
             // 点击的下一页，所有this.page会-1
            if(this.$route.query.page===this.page){
                this.changePage(this.page);
            }
        },

        preClick(){
            // 点击的下一页，所有this.page会-1
            this.changePage(this.page-1);
        },

        nextClick(){
            // 点击的下一页，所有this.page会+1
            this.changePage(this.page+1,this.page);
        },

        changePage(page){
            delete this.$route.query.page;
            this.$router.push({
                path:this.$route.path,
                query:{
                    ...this.$route.query,
                    page
                }
            });
        }
    }
}
</script>
<style lang="stylus">
    .recipe-link
        font-size 0;
        margin-top 5px

        a
            display inline-block
            font-size 12px
            padding 0px 8px
            height 28px
            line-height 28px

        .active
            background #ff3232
            color #fff

    .recipe
        h2
            text-align center
            line-height 150px

        .el-main
            padding 0

        .filter-box
            background #fff
            padding 10px
            width 100%
            float left
            box-sizing border-box

    .filter-tags
        display flex
        flex-wrap wrap
        justify-content space-around

        .tag-selected
            background-color #ff3232
            color #fff

    .menu-empty
        width 100%
        text-align center
        font-size 20px
</style>

