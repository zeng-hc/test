<template>
  <div v-cloak>
    <van-popup class="del_order" :close-on-click-overlay="false" v-model="show">
      <p>是否取消购买该商品</p>
      <button :class="showIndex === 0 ? 'active' : ''" @click="cancel">
        取消
      </button>
      <button :class="showIndex === 1 ? 'active' : ''" @click="determine">
        确定
      </button>
    </van-popup>


    <van-nav-bar
      title="购物车"
      :right-text="edit ? '编辑' : '完成'"
      @click-right="onClickRight"
    >
    </van-nav-bar>

    <div class="content">
      <div class="img">
        <h3>悠悠我心,享享其乐</h3>
      </div>

      <ShopChoice
        v-for="(item, index) in AllShopData"
        :key="item.sid"
        v-bind:shop-data="AllShopData[index]"
        v-bind:ShopIndex="index"
        @mo-price="upda"
        @on-off="tip"
        ref="Child"
      />

      <van-empty v-if="AllShopData.length == 0" description="购物车空空如也" />
      <p v-if="AllShopData.length > 0" style="margin: 10px 0; color: #333">
        已经到底啦
      </p>
    </div>

    <van-submit-bar
      :price="price"
      :button-text="edit ? '提交订单' : '删除订单'"
      @submit="onSubmit"
      safe-area-inset-bottom
    >
      <van-checkbox
        v-if="AllShopData.length > 0"
        v-model="checked"
        @click="quanxuan"
        >全选</van-checkbox
      >
    </van-submit-bar>
  </div>
</template>
<script>
import ShopChoice from "../components/Shop_choice";
import { Toast } from 'vant';
export default {
  name: "Myshop",
  data() {
    return {
      AllShopData: [],
      whe_cal: [],
      checked: false,
      price: 0,
      token: "",
      edit: true,
      x: 0,
      LR_switch: false,
      show: false,
      showIndex: "",
      ShopIndex: "",
    };
  },
  created() {
    this.token = this.$cookies.get("token");
    this.FindAllShop();
  },
  mounted() {
    setTimeout(() => {
      for (var i = 0; i < this.AllShopData.length; i++) {
        this.whe_cal.push(false);
      }
    }, 100);
  },
  methods: {
    tip(index){
      this.show = true;
      this.ShopIndex = index
    },
    cancel() {
      this.showIndex = 0;
      this.show = false;
      setTimeout(() => {
        this.showIndex = "";
      }, 300);
      this.$refs.Child[this.ShopIndex].value = 1
      this.$refs.Child[this.ShopIndex].update(1)
    },
    determine() {
      this.show = false
      this.showIndex = 1;
      this.$refs.Child[this.ShopIndex].del()
      setTimeout(()=>{
        Toast("取消商品成功")
        this.showIndex = "";
      },300)
    },
    FindAllShop() {
      // 查询购物车里的商品
      if (this.token == null) return;

      this.$emit('get-badge')

      this.axios({
        method: "GET",
        url: "/findAllShopcart",
        params: {
          tokenString: this.token,
        },
      })
        .then((res) => {
          this.AllShopData = res.data.result;
          if(this.AllShopData == []){
            this.edit = true
          }
          this.Allprice();
        })
        .catch((err) => {
        });
    },
    Allprice() {
      // 计算价格
      this.price = 0;
      for (let i = 0; i < this.AllShopData.length; i++) {
        if (this.whe_cal[i]) {
          this.price += this.AllShopData[i].count * this.AllShopData[i].price;
        }
      }
      this.price = Math.floor(this.price * 100);
    },
    upda(n, m) {
      if (m === true) {
        this.whe_cal[n] = !this.whe_cal[n];
      } else if (m === false) {
        this.whe_cal.splice(n, 1);
      }

      clearTimeout(UData);
      var UData = setTimeout(() => {
        this.FindAllShop();
      }, 10);
      setTimeout(() => {
        var x = 0;
        this.whe_cal.forEach((value) => {
          if (value === false) {
            this.checked = false;
            x++;
          }
        });
        if (x === 0 && this.whe_cal[0]) this.checked = true;
      }, 20);
    },
    onClickRight() {
      this.edit = !this.edit;
    },
    quanxuan() {
      for (var i = 0; i < this.AllShopData.length; i++) {
        this.$refs.Child[i].SelectAll(this.checked);
        this.whe_cal[i] = this.checked;
      }
      this.upda();
    },
    onSubmit() {
      var arr = [];
      if (!this.edit) {
        for (var i = 0; i < this.whe_cal.length; i++) {
          if (this.whe_cal[i]) {
            arr.push(this.AllShopData[i].sid);
            this.AllShopData.splice(i, 1);
            this.whe_cal.splice(i, 1);
            i--;
          }
        }

        this.axios({
        method: "POST",
        url: "/deleteShopcart",
        data: {
          tokenString: this.token,
          sids: JSON.stringify(arr),
        },
      })
        .then((res) => {
          this.upda();
        })
        .catch((err) => {
        });
      }else{
        for (var i = 0; i < this.whe_cal.length; i++) {
          if (this.whe_cal[i]) {
            arr.push(this.AllShopData[i].sid);
          }
        }

        if(arr.length==0) {
          Toast('当前无选择要购买的商品');
          return;
        }
        this.$router.push({
          name: 'Settlement',
          params: {
            sidArr: arr,
            price: this.price
          }
        })
      }
      
    },
    onClickEditAddress() {},
    Select() {
      this.checked = !this.checked;
    },
  },
  components: {
    ShopChoice,
  },
  watch: {
    checked(n, o) {},
  },
};
</script>
<style lang="less" scoped>
.del_order {
  width: 201px;
  height: 100px;
  display: flex;
  flex-wrap: wrap;
  background-color: black;
  justify-content: space-between;
  border-radius: 20px;

  p{
    display: block;
    width: 100%;
    height: 49px;
    line-height: 49px;
    font-weight: bold;
    font-size: 16px;
    background-color: white;
  }

  button {
    width: 100px;
    height: 50px;
    display: block;
    background-color: white;
    border: none;
    font-size: 20px;
  }

  .active {
    background-color: red !important;
    color: white !important;
  }
}
.van-submit-bar {
  bottom: 51px;
}

.content {
  position: fixed;
  width: 100%;
  height: calc(~"100% - 146px");
  background-color: seashell;
  overflow-y: auto;

  .img {
    width: 100%;
    height: 100px;
    background-image: url(../assets/images/coffee_bg.jpg);
    background-size: 100% 200%;
    background-position-y: 90%;
    background-repeat: no-repeat;
    position: relative;

    h3 {
      position: absolute;
      bottom: 10px;
      left: 10px;
      color: white;
    }
  }
}
</style>