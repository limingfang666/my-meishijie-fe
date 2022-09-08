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
                    <!-- 这里propertiesActiveName必须和 :name="item.parent_type"的值一致才会展开-->
                    <el-collapse v-model="propertiesActiveName">
                        {{propertiesActiveName}}
                    <!-- <el-collapse> -->
                        <el-collapse-item
                            v-for="item in properties"
                            :key="item.parent_type"
                            :title="item.parent_name"
                            :name="item.parent_type"
                        >
                            <div class="filter-tags"
                            >
                                <el-tag type="info" @click="clickType(property)"
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
            // 地址栏query 中property有多个值，propertyType用于记录变化前后的参数值
            propertyType:{},
            // 刷新后显示当前点击后的值（展开或收缩）,页面渲染时，如果在query里包含当前，就设置class为active
            propertiesActiveName:[],
            
            // 用于分页
            pageSize:5,
            total:0,
            page:1,

            // 参数过滤后的所有menu菜单
            menuInfos:[],

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

                // 只有在这里从query过滤出this.propertyType和this.propertiesActiveName，在监听$route时处理监听不到手动刷新路由不变时的propertiesActiveName
                let query = {...this.$route.query};
                // property表示上一次调用时的返回值， 或者初始值this.propertyType，item表示当前正在处理的数组this.properties元素
                this.propertyType = this.properties.reduce((property, item) => {
                    property[item.title] = query[item.title] ? query[item.title] : '';
                    // 设置当前显示的title的值，用于展开已选择项
                    if(property[item.title]){
                        this.propertiesActiveName.push(property[item.title][0]);
                    }
                    return property;
                },{});//这里的{}为传入的初始值
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
        clickType(property){
            // 注意：将当前的query解构出来，以备增加或介绍query参数，避免重复路由地址刷新（直接delete this.$route.query不行）
            let query = {...this.$route.query};
            
            // 如果点击的和地址栏的一致去除该query参数,且去除this.propertyType和query中已有元素
            if(query[property.title]===property.type){
                this.propertyType[property.title] = '';
                delete query[property.title];

            }else{
                this.propertyType[property.title] = property.type;
                query[property.title] = property.type;
            }
            this.$router.push({
                query
            });

        },
        queryMenus(){
            // 保证每次发起请求都会先显示遮罩层
            this.loading = true;

            const { page,classify, ...query} = this.$route.query;
            this.propertyType = query;
                
            // 如果手动刷新或分享地址栏时，需要获取page值,否则使用默认page值1
            this.page = Number(page) || this.page;
            
            getMenus({page:this.page, classify, property:this.propertyType}).then(res=>{
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

