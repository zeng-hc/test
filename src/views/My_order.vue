<template>
  <div v-cloak>
    <van-nav-bar
      title="我的订单"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    >
    </van-nav-bar>

    <van-popup class="del_order" :close-on-click-overlay="false" v-model="show">
      <p>{{ status == 1 ? "是否确认收货" : "是否删除订单" }}</p>
      <button :class="showIndex === 0 ? 'active' : ''" @click="cancel">
        取消
      </button>
      <button :class="showIndex === 1 ? 'active' : ''" @click="determine">
        确定
      </button>
    </van-popup>

    <div class="order_body">
      <div class="order_head"></div>

      <div class="order_content">
        <ul>
          <li
            v-for="(item, index) in StatusArr"
            :key="index"
            @click="Active(index)"
          >
            <span :class="activeIndex === index ? 'active' : ''">{{
              item
            }}</span>
          </li>
        </ul>

        <div>
          <div v-if="activeIndex !== 2">
            <div v-for="(item, index) in noComplete" :key="index">
              <div>
                <p>{{ item[0].oid }}</p>
                <button @click="Order(item[0].oid, 1)">确认收货</button>
              </div>

              <div>
                <div v-for="(items, indexs) in item" :key="indexs">
                  <img :src="items.smallImg" alt="#" />
                  <div>
                    <span
                      style="color: #666; margin-right: 10px; font-size: 14px"
                      >{{ items.name }}</span
                    >
                    <span style="color: #999">{{ items.rule }}</span>
                    <p style="margin-top: 10px; color: #999">
                      {{ items.enname }}
                    </p>
                    <div>
                      <span
                        style="
                          color: #0c34ba;
                          font-weight: bold;
                          font-size: 14px;
                        "
                        >&yen; {{ items.price }}</span
                      >
                      <span style="color: #666; margin-right: 20px"
                        >x{{ items.count }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div></div>
                <div></div>
                <p style="color: #999">{{ item[0].updatedAt | formatDate }}</p>
                <div>
                  <span style="color: #999; font-weight: bold; font-size: 14px"
                    >共计{{ num[0][index] }}件</span
                  >
                  <span
                    style="color: #0c34ba; font-weight: bold; font-size: 14px"
                    >合计 &yen; {{ price[0][index] }}</span
                  >
                </div>
              </div>
            </div>
          </div>

          <div v-if="activeIndex !== 1">
            <div v-for="(item, index) in complete" :key="index">
              <div>
                <p>{{ item[0].oid }}</p>
                <div style="display: flex; align-item: center">
                  <span>已完成</span>
                  <img
                    @click="Order(item[0].oid, 2)"
                    style="margin-left: 10px"
                    src="../assets/images/del.png"
                    alt="#"
                  />
                </div>
              </div>

              <div>
                <div v-for="(items, indexs) in item" :key="indexs">
                  <img :src="items.smallImg" alt="#" />
                  <div>
                    <span
                      style="color: #666; margin-right: 10px; font-size: 14px"
                      >{{ items.name }}</span
                    >
                    <span style="color: #999">{{ items.rule }}</span>
                    <p style="margin-top: 10px; color: #999">
                      {{ items.enname }}
                    </p>
                    <div>
                      <span
                        style="
                          color: #0c34ba;
                          font-weight: bold;
                          font-size: 14px;
                        "
                        >&yen; {{ items.price }}</span
                      >
                      <span style="color: #666; margin-right: 20px"
                        >x{{ items.count }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div></div>
                <div></div>
                <p style="color: #999">{{ item[0].updatedAt | formatDate }}</p>
                <div>
                  <span style="color: #999; font-weight: bold; font-size: 14px"
                    >共计{{ num[1][index] }}件</span
                  >
                  <span
                    style="color: #0c34ba; font-weight: bold; font-size: 14px"
                    >合计 &yen; {{ price[1][index] }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Toast } from "vant";
export default {
  name: "MyOrder",
  data() {
    return {
      token: "",
      activeIndex: 0,
      StatusArr: ["全部", "进行中", "已完成"],
      complete: [],
      noComplete: [],
      num: [[], []],
      price: [[], []],
      show: false,
      showIndex: "",
      oid: "",
      status: "",
    };
  },
  methods: {
    cancel() {
      this.showIndex = 0;
      this.show = false;
      setTimeout(() => {
        this.showIndex = "";
      }, 300);
    },
    determine() {
      this.showIndex = 1;

      if (this.status === 1) {
        var URL = "/receive";
      } else {
        var URL = "/removeOrder";
      }
      this.axios({
        method: "POST",
        url: URL,
        data: {
          tokenString: this.token,
          oid: this.oid,
        },
      })
        .then((res) => {
          setTimeout(() => {
            Toast(res.data.msg);
            this.show = false;
            this.showIndex = "";
          }, 300);
          this.FindOrder();
        })
        .catch((err) => {
        });
    },
    onClickLeft() {
      this.$router.push({ name: "My" });
    },
    Active(index) {
      this.activeIndex = index;
    },
    FindOrder() {
      this.axios({
        method: "GET",
        url: "/findOrder",
        params: {
          tokenString: this.token,
          status: this.activeIndex,
        },
      })
        .then((res) => {
          this.complete = [];
          this.noComplete = [];
          this.num = [[], []];
          this.price = [[], []];
          var complete = [];
          var noComplete = [];
          res.data.result.forEach((value) => {
            if (value.status === 1) {
              var index = noComplete.indexOf(value.oid);
              if (index === -1) {
                noComplete.push(value.oid);
                this.noComplete.push([value]);
                this.num[0].push(value.count);
                this.price[0].push(value.count * value.price);
              } else {
                this.noComplete[index].push(value);
                this.num[0][index] += value.count;
                this.price[0][index] += value.count * value.price;
              }
            } else {
              var index = complete.indexOf(value.oid);
              if (index === -1) {
                complete.push(value.oid);
                this.complete.push([value]);
                this.num[1].push(value.count);
                this.price[1].push(value.count * value.price);
              } else {
                this.complete[index].push(value);
                this.num[1][index] += value.count;
                this.price[1][index] += value.count * value.price;
              }
            }
          });
        })
        .catch((err) => {
        });
    },
    Order(oid, status) {
      this.show = true;
      this.oid = oid;
      this.status = status;
    },
  },
  created() {
    this.token = this.$cookies.get("token");
    this.FindOrder();
  },
  watch: {
    activeIndex() {
      this.FindOrder();
    },
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

  p {
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
.order_body {
  position: absolute;
  width: 100%;
  height: calc(~"100% - 46px");
  top: 46px;
  //   overflow-y: auto;
  //   overflow-x: hidden;
  overflow: hidden;

  .order_head {
    width: 100%;
    height: 100px;
    background-color: #0c34ba;
  }

  .order_content {
    width: 94%;
    height: calc(~"100% - 126px");
    transform: translateY(-20px);
    position: absolute;
    left: 3%;

    ul {
      list-style: none;
      display: flex;
      background-color: white;
      border-radius: 10px 10px 0 0;

      li {
        width: 100%;
        height: 50px;
        line-height: 50px;
        font-size: 14px;

        span {
          display: inline-block;
          height: 48px;
          line-height: 48px;
        }

        .active {
          color: #0c34ba;
          border-bottom: 2px solid #0c34ba;
        }
      }
    }

    > div {
      width: 100%;
      height: 100%;
      top: 60px;
      text-align: start;
      position: absolute;
      overflow-y: auto;

      > div {
        > div {
          padding: 4%;
          border-radius: 10px 10px 0 0;
          background-color: white;
          margin: 10px 0;
          > div:first-of-type {
            display: flex;
            justify-content: space-between;
            align-items: center;

            p {
              font-size: 14px;
              color: #666;
            }

            button {
              background-color: transparent;
              border: none;
              color: #999;
              font-weight: bold;
            }
          }

          > div:nth-of-type(2) {
            padding: 10px 0;
            > div {
              display: flex;
              margin: 5px 0;

              img {
                width: 80px;
                height: 80px;
                margin-right: 10px;
              }

              > div {
                width: 100%;

                div {
                  display: flex;
                  justify-content: space-between;
                  margin-top: 15px;
                }
              }
            }
          }

          > div:nth-of-type(3) {
            padding: 10px 0;
            border-top: 1px solid #ccc;
            position: relative;

            > div:not(:nth-of-type(3)) {
              width: 20px;
              height: 20px;
              background-color: #eee;
              border-radius: 50% 50%;
              position: absolute;
              top: -10px;
            }

            > div:first-of-type {
              left: -20px;
            }

            > div:nth-of-type(2) {
              right: -20px;
            }

            > div:nth-of-type(3) {
              display: flex;
              justify-content: space-between;
              margin-top: 10px;
            }
          }
        }
      }
    }
  }
}
</style>