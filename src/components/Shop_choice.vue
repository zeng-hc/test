<template>
  <div class="S_content LR_switch" @touchmove="move($event)">
    <div :class="LR_switch ? 'LR_switch' : ''">
      <van-checkbox
        v-model="checked"
        checked-color="#ee0a24"
        @click="xuanze"
      ></van-checkbox>
      <img :src="this.ShopData.small_img" alt="#" />
      <div class="c_information">
        <div>
          <span style="font-size: 14px; margin-right: 15px">{{
            this.ShopData.name
          }}</span>
          <span style="color: #999">{{ this.ShopData.rule }}</span>
        </div>
        <div style="color: #999">{{ this.ShopData.enname }}</div>
        <div>
          <span>&yen;{{ this.ShopData.price }}</span>
          <van-stepper
            v-model="value"
            theme="round"
            button-size="22"
            disable-input
            min="0"
             async-change @change="update"
          />
        </div>
      </div>

      <button @click="del">删除</button>
    </div>
  </div>
</template>
<script>
export default {
  name: "ShopChoice",
  props: {
    ShopData: {
      type: Object,
    },
    ShopIndex: {
      type: Number,
    },
  },
  data() {
    return {
      checked: false,
      value: "",
      token: "",
      x: 0,
      LR_switch: false,
    };
  },
  created() {
    this.value = this.ShopData.count;
    this.token = this.$cookies.get("token");
  },
  methods: {
    ModifyCount() {
      this.axios({
        method: "POST",
        url: "/modifyShopcartCount",
        data: {
          tokenString: this.token,
          sid: this.ShopData.sid,
          count: this.value,
        },
      })
        .then((res) => {
        })
        .catch((err) => {
        });
    },
    SelectAll(n) {
      this.checked = n;
    },
    move(event) {
      var CX = event.changedTouches[0].clientX;
      clearTimeout(Stime);
      if (CX < this.x) {
        var Stime = setTimeout(() => {
          this.LR_switch = true;
          this.x = 0;
        }, 500);
        this.x = CX;
      } else if (CX > this.x) {
        var Stime = setTimeout(() => {
          this.LR_switch = false;
          this.x = 0;
        }, 500);
        this.x = CX;
      }
    },
    del() {
      this.axios({
        method: "POST",
        url: "/deleteShopcart",
        data: {
          tokenString: this.token,
          sids: JSON.stringify([this.ShopData.sid]),
        },
      })
        .then((res) => {
          this.$emit("mo-price", this.ShopIndex, false);
        })
        .catch((err) => {
        });
    },
    xuanze() {
      this.$emit("mo-price", this.ShopIndex, true);
    },
    update(n){
      this.value = n;
      this.ModifyCount();
      this.$emit("mo-price");
      if (n == 0) {
        // this.del();
        this.$emit("on-off", this.ShopIndex);
        return;
      }
    }

  },
  watch: {
    checked(n, o) {},
  },
};
</script>
<style lang="less" scoped>
.S_content {
  width: 95%;
  margin: 10px auto;
  overflow: hidden;

  > div {
    width: 110%;
    display: flex;
    align-items: center;
    transition: transform 0.5s;
    transform: translateX(0px);
    background-color: white;
    padding: 0 5%;

    position: relative;

    > button {
      display: block;
      position: absolute;
      left: 84%;
      background-color: red;
      color: white;
      border: none;
      width: 50px;
      height: 100%;
      line-height: 100%;
    }

    &.LR_switch {
      transform: translateX(-45px) !important;
      transition: transform 0.5s;
    }

    img {
      width: 80px;
      height: 80px;
      margin: 0 10px;
    }

    .c_information {
      width: calc(~"100% - 180px");
      margin-top: 10px;
      div {
        margin-bottom: 10px;
        text-align: start;
      }

      div:nth-of-type(3) {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        span {
          color: blue;
          font-weight: bolder;
          font-size: 14px;
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>