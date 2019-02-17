<template>
  <div class="goodsinfo-container">
    <!-- 商品轮播图区域 -->
    <div class="mui-card">
      <div class="mui-card-content">
        <div class="mui-card-content-inner">
          <swiper :banners="lunbotu"></swiper>
        </div>
      </div>
    </div>

    <!-- 商品购买区域 -->
    <div class="mui-card">
      <div class="mui-card-header">{{goodsinfo.title}}</div>
      <div class="mui-card-content">
        <div class="mui-card-content-inner">
          <p class="price">市场价：
            <del>￥{{goodsinfo.market_price}}</del>&nbsp;&nbsp;销售价：
            <span class="now_price">￥{{goodsinfo.sell_price}}</span>
          </p>
          <div class="numbox">
            <span class="title">购买数量：</span>
            <input 
            value="-"
            type="button"
            @click="buyCount>=2 && buyCount--"
            :disabled="buyCount==1">
            <input 
            v-model="buyCount" 
            type="number"
            @change="filterMaxCount">
            <input 
            value="+"
            type="button"
            @click="buyCount<goodsinfo.stock_quantity && buyCount++">
          </div>
          <p>
            <mt-button type="primary" size="small">立即购买</mt-button>
            <mt-button type="danger" size="small">加入购物车</mt-button>
            <!-- 分析： 如何实现加入购物车时候，拿到 选择的数量 -->
            <!-- 1. 经过分析发现： 按钮属于 goodsinfo 页面， 数字 属于 numberbox 组件 -->
            <!-- 2. 由于涉及到了父子组件的嵌套了，所以，无法直接在 goodsinfo 页面zhong 中获取到 选中的商品数量值-->
            <!-- 3. 怎么解决这个问题：涉及到了 子组件向父组件传值了（事件调用机制） -->
            <!-- 4. 事件调用的本质： 父向子传递方法，子调用这个方法， 同时把 数据当作参数 传递给这个方法 -->
          </p>
        </div>
      </div>
    </div>

    <!-- 商品参数区域 -->
    <div class="mui-card">
      <div class="mui-card-header">商品参数</div>
      <div class="mui-card-content">
        <div class="mui-card-content-inner">
          <p>商品货号：{{goodsinfo.goods_no}}</p>
          <p>库存情况：{{goodsinfo.stock_quantity}}件</p>
          <p>上架时间：{{goodsinfo.add_time | dateFormat}}</p>
        </div>
      </div>
      <div class="mui-card-footer">
        <mt-button type="primary" size="large" plain @click="goDesc(id)">图文介绍</mt-button>
        <mt-button type="danger" size="large" plain>商品评论</mt-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
    data() {
        return {
            id:this.$route.params.id,
            lunbotu:[],// 轮播图的数据
            goodsinfo:{},//获取到的商品信息
            buyCount:1

        }
    },
    created() {
        this.getLunbotu()
        this.getGoodsInfo()
    },
    methods: {
        getLunbotu(){
          //轮播图
          this.$http
          .get("getthumimages/"+this.id)
          .then(result=>{
              // console.log(result.body)
              if(result.body.status===0){
                  this.lunbotu=result.body.message
              }
          })
        
        },
        getGoodsInfo(){ //商品信息
            this.$http
            .get("goods/getinfo/"+this.id)
            .then(result=>{
                // console.log(result.body)
                if(result.body.status===0){
                    this.goodsinfo=result.body.message[0]
                }
            })
        },
        filterMaxCount(){ //限制手动输入input数量的最大值
          if(this.buyCount>this.goodsinfo.stock_quantity){
            this.buyCount=this.goodsinfo.stock_quantity
          }
        },
        goDesc(id){
          // 点击使用编程式导航跳转到 图文介绍页面
          // this.$router.push({ name: "goodsdesc", params: { id } });
          this.$router.push("/home/goodsDesc/"+id)
        }
    },
}
</script>
<style lang="less" scoped>
.goodsinfo-container{
    background-color: #eee;
    overflow: hidden;
    .numbox{
        display: flex;
        height: 50px;
        align-items: center;
        input{
            width: 30px;
            height: 30px;
            margin: 0;
            padding: 0;
            text-align: center;
            &[type="number"]{
                border-left: 0;
                border-right:0;
                font-size: 12px;
                color:gray;
            }
        }
    }
    .now_price{
      color: red;
      font-size: 16px;
      font-weight: 700;
    }
    .mui-card-footer {
    display: block;
    button {
      margin: 15px 0;
    }
  }
}
</style>
