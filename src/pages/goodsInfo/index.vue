<template>
  <div class="goodsinfo-container">
    <transition @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter" name="ball">
      <!-- 添加ref属性可以操作dom元素 -->
      <div class="ball" v-show="ballFlag" ref="ball"></div>
    </transition>
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
          <p class="price">
            市场价：
            <del>￥{{goodsinfo.market_price}}</del>&nbsp;&nbsp;销售价：
            <span class="now_price">￥{{goodsinfo.sell_price}}</span>
          </p>
          <div class="numbox">
            <span class="title">购买数量：</span>
            <input
              value="-"
              type="button"
              @click="buyCount>=2 && buyCount--"
              :disabled="buyCount==1"
            >
            <input v-model="buyCount" type="number" @change="filterMaxCount">
            <input
              value="+"
              type="button"
              @click="buyCount<goodsinfo.stock_quantity && buyCount++"
              :disabled="buyCount==goodsinfo.stock_quantity"
            >
          </div>
          <p>
            <mt-button type="primary" size="small">立即购买</mt-button>
            <mt-button type="danger" size="small" @click="addToShopCar">加入购物车</mt-button>
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
        <mt-button type="danger" size="large" plain @click="goComment(id)">商品评论</mt-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      id: this.$route.params.id,
      lunbotu: [], // 轮播图的数据
      goodsinfo: {}, //获取到的商品信息
      buyCount: 1,
      ballFlag: false, // 控制小球的隐藏和显示的标识符
      selectedCount: 1 // 保存用户选中的商品数量， 默认，认为用户买1个
    };
  },
  created() {
    this.getLunbotu();
    this.getGoodsInfo();
  },
  methods: {
    getLunbotu() {
      //轮播图
      this.$http.get("getthumimages/" + this.id).then(result => {
        // console.log(result.body)
        if (result.body.status === 0) {
          this.lunbotu = result.body.message;
        }
      });
    },
    getGoodsInfo() {
      //商品信息
      this.$http.get("goods/getinfo/" + this.id).then(result => {
        // console.log(result.body)
        if (result.body.status === 0) {
          this.goodsinfo = result.body.message[0];
        }
      });
    },
    filterMaxCount() {
      //限制手动输入input数量的最大值
      if (this.buyCount > this.goodsinfo.stock_quantity) {
        this.buyCount = this.goodsinfo.stock_quantity;
      }
    },
    goDesc(id) {
      // 点击使用编程式导航跳转到 图文介绍页面
      // this.$router.push({ name: "goodsdesc", params: { id } });
      this.$router.push("/home/goodsDesc/" + id);
    },
    goComment(id) {
      // 点击跳转到 评论页面
      // this.$router.push({ path: "/home/goodscomment/" + id
      this.$router.push("/home/goodsComment/" + id);
    },
    addToShopCar() {
      //小球添加到购物车
      this.ballFlag = !this.ballFlag;
      this.$store.commit("addToCar", {
        id: this.goodsinfo.id,
        count: this.buyCount,
        price: this.goodsinfo.sell_price,
        selected: true
      });
    },
    //开始执行动画之前执行的钩子函数
    beforeEnter(el) {
      el.style.transform = "translate(0,0)";
    },
    // 开始执行动画后的钩子函数
    enter(el, done) {
      // 就是得加   offsetHeight
      el.offsetWidth;
      // 小球动画优化思路：
      // 1. 先分析导致 动画 不准确的 本质原因： 我们把 小球 最终 位移到的 位置，已经局限在了某一分辨率下的 滚动条未滚动的情况下；
      // 2. 只要分辨率和 测试的时候不一样，或者 滚动条有一定的滚动距离之后， 问题就出现了；
      // 3. 因此，我们经过分析，得到结论： 不能把 位置的 横纵坐标 直接写死了，而是应该 根据不同情况，动态计算这个坐标值；
      // 4. 经过分析，得出解题思路： 先得到 徽标的 横纵 坐标，再得到 小球的 横纵坐标，然后 让 y 值 求差， x 值也求 差，得到 的结果，就是横纵坐标要位移的距离
      // 5. 如何 获取 徽标和小球的 位置？？？   domObject.getBoundingClientRect()

      // 获取小球的 在页面中的位置
      const ballPosition = this.$refs.ball.getBoundingClientRect();
      // 获取 徽标 在页面中的位置
      const badgePosition = document
        .getElementById("badge")
        .getBoundingClientRect();
      const xDist = badgePosition.left - ballPosition.left;
      const yDist = badgePosition.top - ballPosition.top;

      el.style.transform = `translate(${xDist}px,${yDist}px)`;
      el.style.transition = "all 0.5s cubic-bezier(.4,-0.3,1,.68)";
      done();
    },
    // 动画执行完毕后的钩子函数
    afterEnter(el) {
      this.ballFlag = !this.ballFlag;
    },
    getSelectedCount(count) {
      this.selectedCount = count;
    }
  }
};
</script>
<style lang="less" scoped>
.goodsinfo-container {
  background-color: #eee;
  overflow: hidden;
  position: relative;
  .numbox {
    display: flex;
    height: 50px;
    align-items: center;
    input {
      width: 30px;
      height: 30px;
      margin: 0;
      padding: 0;
      text-align: center;
      &[type="number"] {
        border-left: 0;
        border-right: 0;
        font-size: 12px;
        color: gray;
      }
    }
  }
  .now_price {
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
  .ball {
    width: 15px;
    height: 15px;
    background-color: red;
    border-radius: 50%;
    position: absolute;
    top: 375px;
    left: 133px;
    z-index: 99;
  }
}
</style>
