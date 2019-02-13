<template>
    <div class="newsinfo-container">
        <!-- 大标题 -->
        <h3 class="title">{{newsInfo.title}}</h3>
        <!-- 子标题 -->
        <p class="subtitle">
            <span>发表时间:{{newsInfo.add_time | dateFormat}}</span>
            <span>点击:{{newsInfo.click}}次</span>
        </p>
        <hr>
        <!-- 内容区域 -->
        <div class="content" v-html="newsInfo.content"></div>
        <!-- 评论子组件 -->
        <comment :id="id"></comment> 
        

    </div>
</template>
<script>
export default {
    data() {
        return {
            id:this.$route.params.id,// 将 URL 地址中传递过来的 Id值，挂载到 data上，方便以后调用
            //如果是/../?id=1&name=zs   ?后面的id  则用request
            newsInfo:{} //新闻对象
        }
    },
    created() {
        this.getNewsInfo()
    },
    methods: {
        getNewsInfo(){
            this.$http.get('getnew/'+this.id).then(result=>{
                console.log(result)
                this.newsInfo=result.body.message[0]
            })
        }
    },
}
</script>
<style lang="less">
    .newsinfo-container{
        padding: 0 4px;
        .title{
            font-size: 16px;
            text-align: center;
            margin: 15px 0;
            color: red;
        }
        .subtitle{
            font-size: 13px;
            color: #226aff;
            display: flex;
            justify-content: space-between;
        }
        .content{
            img{
                width: 100%;
            }
        }
    }
</style>
