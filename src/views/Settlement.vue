<template>
  <div v-cloak>
    <van-nav-bar
      title="订单结算"
      left-text="返回"
      @click-left="onClickLeft"
      left-arrow
    >
    </van-nav-bar>

    <div class="Sett_head">
      <div @click="choice_address">
        <p>选择地址 &gt;</p>
      </div>
      <div v-if="AddressData.length == 0">
        <p>当前未设置任何地址，请前去添加</p>
      </div>
      <div v-if="JSON.stringify(DefaultAddress) != '{}'">
        <div>
          <span style="color: #0c34ba; font-size: 16px; font-weight: bold">{{
            DefaultAddress.name
          }}</span>
          <span style="color: #0c34ba; font-size: 14px">{{
            DefaultAddress.tel
          }}</span>
          <span
            style="
              color: white;
              font-size: 14px;
              background-color: #0c34ba;
              padding: 0px 8px;
              border-radius: 20px;
            "
            v-if="DefaultAddress.isDefault > 0"
            >默认</span
          >
        </div>

        <div>
          <p>
            {{
              DefaultAddress.province +
              DefaultAddress.city +
              DefaultAddress.county +
              DefaultAddress.addressDetail
            }}
          </p>
        </div>
      </div>
    </div>

    <div class="Sett_body">
      <div>
        <h3>订单信息</h3>

        <div>
          <div v-for="(item, index) in ShopData" :key="index">
            <img :src="item.small_img" alt="#" />
            <div>
              <span style="color: #666; margin-right: 10px; font-size: 14px">{{
                item.name
              }}</span>
              <span style="color: #999">{{ item.rule }}</span>
              <p style="margin-top: 10px; color: #999">{{ item.enname }}</p>
              <div>
                <span style="color: #0c34ba; font-weight: bold; font-size: 14px"
                  >&yen; {{ item.price }}</span
                >
                <span style="color: #666; margin-right: 20px"
                  >x{{ item.count }}</span
                >
              </div>
            </div>
          </div>
        </div>

        <div>
          <div></div>
          <div></div>
          <p style="color: #999">{{ time }}</p>
          <div>
            <span style="color: #999; font-weight: bold; font-size: 14px"
              >共计{{ num }}件</span
            >
            <span style="color: #0c34ba; font-weight: bold; font-size: 14px"
              >合计 &yen; {{ price }}</span
            >
          </div>
        </div>
      </div>
    </div>

    <div class="Sett_footer">
      <button @click="KeyBoardshow = true">点击结算</button>
    </div>

    <van-popup v-model="show" position="bottom" closeable>
      <div class="choice_address">
        <p>选择地址</p>
        <van-radio-group v-model="radio">
          <div v-for="(item, index) in AddressData" :key="index">
            <van-radio :name="index">
              <div>
                <span style="color: #333; font-size: 16px">{{
                  item.name
                }}</span>
                <span style="color: #666; font-size: 14px">{{ item.tel }}</span>
                <span
                  style="
                    color: white;
                    font-size: 14px;
                    background-color: #0c34ba;
                    padding: 0px 8px;
                    border-radius: 20px;
                  "
                  v-if="item.isDefault > 0"
                  >默认</span
                >
                <p>
                  {{
                    item.province + item.city + item.county + item.addressDetail
                  }}
                </p>
              </div>
            </van-radio>
          </div>
        </van-radio-group>

        <button @click="add">新增地址</button>
      </div>
    </van-popup>

    <van-popup class="PassSpan" style="height:100%" v-model="KeyBoardshow" position="bottom">
      <van-popup
        class="PassSpan"
        style="bottom: 100px;background-color:#f2f3f5;padding:5px"
        :overlay="false"
        v-model="KeyShow"
      >
        <input type="password" :value="value[0]">
        <input type="password" :value="value[1]">
        <input type="password" :value="value[2]">
        <input type="password" :value="value[3]">
        <input type="password" :value="value[4]">
        <input type="password" :value="value[5]">
      </van-popup>

      
      <van-number-keyboard
        :show="KeyShow"
        @blur="KeyBoardshow = false"
        @input="onInput"
        @delete="onDelete"
        :hide-on-click-outside="false"
        :overlay="true"
      />
    </van-popup>
  </div>
</template>
<script>
import { Toast } from "vant";
export default {
  name: "Settlement",
  data() {
    return {
      token: "",
      show: false,
      AddressData: [],
      radio: "",
      DefaultAddress: {},
      price: 0,
      ShopData: [],
      num: 0,
      time: "",
      KeyBoardshow: false,
      KeyShow: true,
      value: "",
      PayPassword: 123456,
    };
  },
  methods: {
    // 验证支付密码
    onInput(value) {
      this.value += value;
      if (this.value.length == 6) {
        if (this.value == this.PayPassword) {
          this.KeyBoardshow = false;
          this.Settlement();
        } else {
          Toast("支付密码错误，请重新输入");
          this.value = "";
        }
      }
    },
    // 删除支付密码
    onDelete() {
      this.value = this.value.slice(0, this.value.length - 1);
    },
    choice_address() {
      this.show = !this.show;
    },
    // 查询地址
    FindAddress() {
      this.axios({
        method: "GET",
        url: "/findAddress",
        params: {
          tokenString: this.token,
        },
      })
        .then((res) => {
          this.AddressData = res.data.result;
          this.AddressData.forEach((value, index) => {
            if (value.isDefault > 0) {
              this.DefaultAddress = value;
              this.radio = index;
            }
          });
        })
        .catch((err) => {
        });
    },
    add() {
      // 添加地址
      this.$router.push({
        name: "addAddress",
        params: {
          operation: true,
          routerName: this.$route.name,
        },
      });
    },
    onClickLeft() {
      this.$router.push("Myshop");
    },
    FindShop() {
      // 查询订单内的商品
      this.axios({
        method: "GET",
        url: "/commitShopcart",
        params: {
          tokenString: this.token,
          sids: JSON.stringify(this.$route.params.sidArr),
        },
      })
        .then((res) => {
          this.ShopData = res.data.result;
          this.ShopData.forEach((value) => {
            this.num += value.count;
          });
        })
        .catch((err) => {
        });
    },
    GetTime() {
      var dd = new Date();

      function foo(num) {
        if (num < 10) {
          num = "0" + num;
        }
        return num;
      }

      var y = dd.getFullYear(),
        m = foo(dd.getMonth() + 1),
        date = foo(dd.getDate()),
        h = foo(dd.getHours()),
        min = foo(dd.getMinutes()),
        s = foo(dd.getSeconds());
      var arr = [
        "星期天",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
      ];
      var day = arr[dd.getDay()];

      this.time =
        y +
        "年 " +
        m +
        "月" +
        date +
        "日 " +
        day +
        " " +
        h +
        ":" +
        min +
        ":" +
        s;
    },
    Settlement() {
      var address =
        this.DefaultAddress.province +
        this.DefaultAddress.city +
        this.DefaultAddress.county +
        this.DefaultAddress.addressDetail;
      this.axios({
        method: "POST",
        url: "/pay",
        data: {
          tokenString: this.token,
          sids: JSON.stringify(this.$route.params.sidArr),
          phone: this.DefaultAddress.tel,
          address,
          receiver: this.DefaultAddress.name,
        },
      })
        .then((res) => {
          this.delMyShop();
          setTimeout(() => {
            Toast(res.data.msg);
            setTimeout(() => {
              this.$router.push({ name: "Myshop" });
            }, 1000);
          }, 1000);
        })
        .catch((err) => {
          (err);
        });
    },
    delMyShop() {
      this.axios({
        method: "POST",
        url: "/deleteShopcart",
        data: {
          tokenString: this.token,
          sids: JSON.stringify(this.$route.params.sidArr),
        },
      })
        .then((res) => {
        })
        .catch((err) => {
        });
    },
  },
  watch: {
    radio(n, o) {
      this.DefaultAddress = this.AddressData[n];
    },
  },
  created() {
    this.token = this.$cookies.get("token");
    this.price = this.$route.params.price / 100;
    this.FindAddress();
    this.FindShop();
    this.GetTime();
  },
};
</script>
<style lang="less" scoped>
 /deep/ .van-popup--center{
    top: calc(~"100% - 272px");
  }
.PassSpan {
  width: 100%;
  height: 50px;
  background-color: transparent;
  display: flex;
  justify-content: space-evenly;

  input {
    display: block;
    width: 15%;
    height: 100%;
    line-height: 100%;
    font-size: 30px;
    text-align: center;
    background-color: white;
    border: none;
    border-radius: 5px;
  }
}
.van-radio {
  width: 100%;
}
.choice_address {
  padding-top: 20px;
  padding-bottom: 60px;
  text-align: start;

  > * > div:first-of-type {
    border-top: none;
  }
  > * > div {
    width: 90%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    padding-top: 20px;
    padding-bottom: 10px;
    border-top: 1px solid #e0e0e0;

    > input {
      width: 20px;
      height: 20px;
      border-radius: 50% 50% !important;
      margin-right: 10px;
    }

    > div {
      span {
        margin-right: 10px;
      }
      p {
        margin-top: 10px;
      }
    }
  }

  > p {
    margin-left: 15px;
    margin-top: -5px;
    font-size: 14px;
    font-weight: bold;
    color: #666;
  }

  > button {
    display: block;
    position: absolute;
    bottom: 5px;
    width: 90%;
    height: 40px;
    left: 5%;
    background-color: #0c34ba;
    color: white;
    font-size: 14px;
    border-radius: 20px;
    border: none;
  }
}
.Sett_head {
  position: absolute;
  top: 51px;
  width: 90%;
  // height: 110px;
  left: 3%;
  padding: 0 2%;
  padding-bottom: 5px;
  background-color: white;
  border-radius: 5px;
  text-align: start;

  > div:first-of-type {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #ccc;

    p {
      font-size: 14px;
      color: #999;
    }
  }

  > div:nth-of-type(2) {
    // height: 70px;
    div {
      height: 35px;
      display: flex;
      align-items: center;
      span {
        display: block;
        height: 20px;
        line-height: 20px;
        margin-right: 20px;
      }
      p {
        font-size: 14px;
        color: #999;
      }
    }
  }
}
.Sett_body {
  position: absolute;
  width: 100%;
  top: 171px;
  bottom: 55px;
  height: calc(~"100% - 226px");
  overflow-y: auto;
  overflow-x: hidden;
  text-align: start;

  > div {
    width: 90%;
    margin: 0 auto;
    padding: 0 2%;
    background-color: white;
    border-radius: 5px;

    > h3 {
      color: #999;
      padding: 10px 0;
    }

    > div:first-of-type {
      padding-bottom: 20px;
      > div {
        display: flex;
        margin-bottom: 10px;

        img {
          width: 80px;
          height: 80px;
          margin-right: 10px;
        }

        div {
          width: 100%;
          div {
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
          }
        }
      }
    }

    > div:nth-of-type(2) {
      position: relative;
      border-top: 1px solid #999;
      padding: 10px 0;

      > p {
        margin: 10px 0;
      }

      > div:nth-of-type(3) {
        display: flex;
        justify-content: space-between;
      }

      > div:not(:nth-of-type(3)) {
        width: 20px;
        height: 20px;
        background-color: #eee;
        position: absolute;
        border-radius: 50% 50%;
      }

      > div:first-of-type {
        top: -10px;
        left: -20px;
      }

      > div:nth-of-type(2) {
        top: -10px;
        left: calc(~"94% + 20px");
      }
    }
  }
}
.Sett_footer {
  position: absolute;
  bottom: -2px;
  width: 100%;
  height: 50px;
  background-color: white;

  button {
    display: block;
    width: 96%;
    height: 40px;
    margin: 5px auto;
    background-color: #0c34ba;
    border: none;
    border-radius: 20px;
    color: white;
    font-size: 14px;
  }
}
</style>