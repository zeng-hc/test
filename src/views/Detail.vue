<template>
  <div v-cloak>
    <van-nav-bar
      title="商品详情"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    >
    </van-nav-bar>

    <div class="content">
      <img :src="DetailData.large_img" alt="#" />
      <div class="information">
        <div class="con_head">
          <div>
            <p>{{ DetailData.name }}</p>
            <p>{{ DetailData.enname }}</p>
          </div>
          <span>&yen;{{ DetailData.price }}</span>
        </div>

        <div class="con_choice">
          <div v-if="temperature[0] != ''">
            <span>温度</span>
            <button
              v-for="(item, index) in temperature"
              :key="index"
              :class="tem_index == index ? 'b_active' : ''"
              @click="temper(index)"
            >
              {{ item }}
            </button>
          </div>

          <div v-if="sugar[0] != ''">
            <span>糖</span>
            <button
              v-for="(item, index) in sugar"
              :key="index"
              :class="sugar_index == index ? 'b_active' : ''"
              @click="Sugar(index)"
            >
              {{ item }}
            </button>
          </div>

          <div v-if="cream[0] != ''">
            <span>奶油</span>
            <button
              v-for="(item, index) in cream"
              :key="index"
              :class="cream_index == index ? 'b_active' : ''"
              @click="Cream(index)"
            >
              {{ item }}
            </button>
          </div>
        </div>

        <div class="con_num">
          <span>选择数量</span>
          <van-stepper
            v-model="value"
            theme="round"
            button-size="22"
            disable-input
            min="1"
          />
        </div>

        <div class="con_describe">
          <h4>商品描述</h4>
          <p v-for="(item, index) in DetailData.desc" :key="index">
            {{ index + 1 }}.{{ item }}。
          </p>
        </div>
      </div>
    </div>

    <van-goods-action>
      <van-goods-action-icon
        :icon="buy_value > 0 ? shopbag.activation : shopbag.no_activation"
        text="购物袋"
        :badge="buy_value > 0 ? buy_value : ''"
        @click="GoShopbag"
      />
      <img
        v-for="(item, index) in loveImg"
        :key="index"
        ref="child"
        class="imgStart"
        :src="item"
        alt="#"
        :style="item == '' ? 'opacity: 0;' : ''"
      />
      <van-goods-action-icon
        :icon="Love ? love.love_src : love.unlove_src"
        :text="Love ? love.love_text : love.unlove_text"
        @click="onClickIcon"
      />
      <van-goods-action-button color="#6a91ec" text="加入购物袋" @click="add" />
      <van-goods-action-button color="#0c33b6" text="立即购买" @click="GoBuy" />
    </van-goods-action>
    <img
      v-for="(item, index) in giftImg"
      :key="index"
      ref="gift"
      class="gift"
      :src="item"
      alt="#"
      style="opacity: 0"
    />
  </div>
</template>
<script>
import { Toast } from "vant";
export default {
  name: "Detail",
  data() {
    return {
      DetailData: [],
      Love: false,
      loveImg: [""],
      giftImg: [require("../assets/images/gift.png")],
      love: {
        love_src: require("../assets/images/love.png"),
        unlove_src: require("../assets/images/love_no.png"),
        love_text: "已收藏",
        unlove_text: "未收藏",
      },
      shopbag: {
        activation: require("../assets/images/shopbag.png"),
        no_activation: require("../assets/images/shopbag_no.png"),
      },
      temperature: [],
      tem_index: 0,
      sugar: [],
      sugar_index: 0,
      cream: [],
      cream_index: 0,
      value: 1,
      buy_value: 0,
      pid: "",
      token: "",
      StartTime: "",
    };
  },
  created() {
    this.token = this.$cookies.get("token");
    this.pid = this.$route.params.pid;
    this.detailProduct();
    this.FindLike();
    this.ShopCount();
  },
  methods: {
    AntiShake(time) {
      var Time = time || 2000;
      if (this.StartTime == "") {
        this.StartTime = new Date().getTime();
      } else {
        var endTime = new Date().getTime();
        if (endTime - this.StartTime < Time) {
          this.StartTime = endTime;
          return true;
        } else {
          this.StartTime = endTime;
          return false;
        }
      }
    },
    LoginStatus() {
      if (this.token == null) {
        if (this.AntiShake()) return;
        this.$toast("未登录，请先登录");
        setTimeout(() => {
          this.$router.push({ name: "Login" });
        }, 2000);
        return true;
      }
    },
    detailProduct() {
      this.axios({
        method: "GET",
        url: "/productDetail",
        params: {
          pid: this.pid,
        },
      })
        .then((res) => {
          this.DetailData = res.data.result[0];
          this.temperature = this.DetailData.tem.split("/");
          this.sugar = this.DetailData.sugar.split("/");
          this.cream = this.DetailData.cream.split("/");
          this.DetailData.desc = this.DetailData.desc.split("。");
          this.DetailData.desc.pop();
        })
        .catch((err) => {
        });
    },
    FindLike() {
      this.axios({
        method: "GET",
        url: "/findlike",
        params: {
          pid: this.$route.params.pid,
          tokenString: this.token,
        },
      })
        .then((res) => {
          if (res.data.code === 1000 && res.data.result.length > 0) {
            //当前商品已经被用户收藏
            this.Love = true;
          }
        })
        .catch((err) => {
        });
    },
    CreateLoveImg(Love) {
      var n = 0;
      if (Love) {
        this.loveImg.push(require("../assets/images/love.png"));
        this.$refs.child[n].className = "imgStart imgEnd";
        n++;
        var stime = setInterval(() => {
          this.loveImg.push(require("../assets/images/love.png"));
          this.$refs.child[n].className = "imgStart imgEnd";
          n++;
          if (n == 6) {
            clearInterval(stime);
            return;
          }
        }, 200);
      } else {
        this.loveImg.push(require("../assets/images/love_no.png"));
        this.$refs.child[n].className = "imgStart imgEnd";
        n++;
        var stime = setInterval(() => {
          this.loveImg.push(require("../assets/images/love_no.png"));
          this.$refs.child[n].className = "imgStart imgEnd";
          n++;
          if (n == 6) {
            clearInterval(stime);
            return;
          }
        }, 200);
      }
    },
    onClickIcon() {
      if (this.LoginStatus()) return;
      if (this.AntiShake(1500)) return;

      if (this.Love) {
        var url = "/notlike";
        this.CreateLoveImg(false);
      } else {
        var url = "/like";
        this.CreateLoveImg(true);
      }

      this.axios({
        method: "POST",
        url: url,
        data: {
          pid: this.pid,
          tokenString: this.token,
        },
      })
        .then((res) => {
          this.Love = !this.Love;
          Toast(res.data.msg);
          setTimeout(() => {
            this.loveImg = [""];
          }, 1100);
        })
        .catch((err) => {
        });
    },
    onClickLeft() {
      if (this.AntiShake(1100)) return;
      this.$router.push({
        name: this.$route.params.routerName,
        params: {
          M_index: this.$route.params.M_index,
          type: this.$route.params.type,
        },
      });
    },
    temper(index) {
      this.tem_index = index;
    },
    Sugar(index) {
      this.sugar_index = index;
    },
    Cream(index) {
      this.sugar_index = index;
    },
    onChange(value) {
      Toast.loading({ forbidClick: true });

      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        Toast.clear();
        // 注意此时修改 value 后会再次触发 change 事件
        this.value = value;
      }, 500);
    },
    createGift() {
      this.giftImg.push(require("../assets/images/gift.png"));
      (this.$refs.gift);
      this.$refs.gift[0].style = "opacity: 1";
      this.$refs.gift[0].className = "gift gift-up";
      setTimeout(() => {
        this.$refs.gift[0].className = "gift gift-up gift-down";
      }, 100);
      setTimeout(() => {
        this.giftImg = [require("../assets/images/gift.png")];
        this.$refs.gift[0].style = "opacity: 0";
        this.$refs.gift[0].className = "gift";
      }, 200);
    },
    addShop() {
      function foo(arr) {
        if (arr[0] != "") {
          return true;
        }
      }
      var rule = "";

      if (foo(this.sugar)) rule += this.sugar[this.sugar_index] + "/";
      if (foo(this.cream)) rule += this.cream[this.cream_index] + "/";
      if (foo(this.temperature)) rule += this.temperature[this.tem_index] + "/";
      rule = rule.slice(0, rule.length - 1);

      this.axios({
        method: "POST",
        url: "/addShopcart",
        data: {
          pid: this.pid,
          count: this.value,
          rule,
          tokenString: this.token,
        },
      })
        .then((res) => {
          Toast(res.data.msg);
        })
        .catch((err) => {
        });
    },
    add() {
      if (this.LoginStatus(this.token)) return;
      this.createGift();
      
      this.addShop();

      this.buy_value += this.value;
    },
    GoBuy() {
      if (this.LoginStatus(this.token)) return;
      this.addShop();

      setTimeout(()=>{
        this.$router.push({name: 'Myshop'})
      },200)
    },
    GoShopbag() {
      if (this.AntiShake(1500)) return;
      this.$router.push({ name: "Myshop" });
    },
    ShopCount() {
      if (this.token == null) return;

      this.axios({
        method: "GET",
        url: "/shopcartCount",
        params: {
          tokenString: this.token,
        },
      })
        .then((res) => {
          this.buy_value = res.data.result;
        })
        .catch((err) => {
        });
    },
  },
};
</script>
<style lang="less" scoped>
.gift {
  width: 20px;
  height: 20px;
  position: absolute;
  bottom: 35px;
  left: 105px;

  &.gift-up {
    bottom: 60px;
    left: 65px;
    transition: all 0.1s;
  }

  &.gift-down {
    bottom: 35px;
    left: 25px;
    transition: all 0.1s;
  }
}
/deep/ .van-icon__image {
  width: 18px !important;
  height: 18px !important;
}
.imgStart {
  width: 18px;
  height: 18px;
  position: absolute;
  left: 62px;
  top: 8px;
  opacity: 1;

  &.imgEnd {
    width: 50px;
    height: 50px;
    top: -4px;
    left: 47px;
    opacity: 0;
    transition: all 0.5s;
  }
}
/deep/ .van-stepper--round .van-stepper__plus {
  background-color: #0c34ba;
}

/deep/ .van-stepper--round .van-stepper__minus {
  color: #0c34ba;
  border-color: #0c34ba;
}
.content {
  position: fixed;
  width: 100%;
  height: calc(~"100% - 99px");
  top: 47px;
  bottom: 52px;
  background-color: rgb(245, 243, 243);
  overflow-y: auto;

  img {
    width: 100%;
    // height: 300px;
  }
  .information {
    position: relative;
    top: -20px;
    width: 80%;
    left: 5%;
    border-radius: 10px 10px 0 0;
    z-index: 10;
    background-color: white;
    padding: 5%;

    .con_head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-align: start;

      p:first-of-type {
        font-size: 16px;
        font-weight: bold;
        padding-bottom: 5px;
      }
      p:nth-of-type(2) {
        color: #ccc;
      }
      span {
        font-size: 16px;
        font-weight: bold;
        color: red;
      }
    }

    .con_choice {
      padding: 10px 0;
      border-bottom: 1px solid #ccc;
      div {
        display: flex;
        align-items: center;
        margin: 10px 0;
        span {
          width: 50px;
          display: block;
          font-size: 16px;
          text-align: start;
        }

        button {
          display: block;
          width: 65px;
          height: 30px;
          line-height: 30px;
          background-color: #eee;
          margin: 0 10px;
          border: none;
          font-size: 14px;
          border-radius: 20px;
        }
        .b_active {
          background-color: #0c34ba;
          color: white;
        }
      }
    }

    .con_num {
      display: flex;
      justify-content: space-between;
      padding: 15px 0;
      border-bottom: 1px solid #ccc;

      span {
        font-size: 14px;
      }
    }

    .con_describe {
      padding: 15px 0;
      text-align: start;

      p {
        margin: 10px 0;
      }
    }
  }
}
</style>