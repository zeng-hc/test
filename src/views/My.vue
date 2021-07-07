<template>
  <div v-cloak class="My_con">
    <img
      @click="showPopup"
      :src="token == null ? require('../assets/images/MyBg.jpg') : Data.userBg"
      alt="#"
    />

    <div class="My_body">
      <van-popup
        class="Per_edit"
        :close-on-click-overlay="false"
        v-model="show"
      >
        <van-uploader
          :upload-icon="fileImg"
          :after-read="afterRead"
          :style="
            fileImg == 'photograph'
              ? 'font-size: 20px !important;'
              : 'font-size: 100px !important;'
          "
          class="uploader"
        />

        <div>
          <button :class="active === 0 ? 'active' : ''" @click="cancel">
            取消
          </button>
          <button :class="active === 1 ? 'active' : ''" @click="determine">
            确定
          </button>
        </div>
      </van-popup>
      <div>
        <div>
          <img
            :src="
              token == null
                ? require('../assets/images/My_user.png')
                : Data.userImg
            "
            alt="#"
          />
          <div>
            <div v-if="token == null">
              <p style="font-size: 14px; font-weight: bold">未登录</p>
              <p
                @click="Login"
                style="font-size: 16px; font-weight: bold; margin-top: 10px"
              >
                点击跳转登录
              </p>
            </div>
            <div v-if="token != null">
              <p style="color: #0c34ba; font-size: 14px; font-weight: bold">
                {{ Data.nickName }}
              </p>
              <p style="color: #999; font-size: 12px; margin: 10px 0">
                {{ Data.desc }}
              </p>
            </div>
          </div>
        </div>

        <ul>
          <li v-for="(item, index) in MyData" :key="index" @click="GoTo(index)">
            <span>{{ item.title }}</span>
            <img src="../assets/images/right.png" alt="#" />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { Toast } from "vant";
export default {
  name: "My",
  data() {
    return {
      MyData: [
        { title: "个人资料", path: "PersonalData" },
        { title: "我的订单", path: "MyOrder" },
        { title: "我的收藏", path: "MyCollection" },
        { title: "地址管理", path: "Address" },
        { title: "账号设置", path: "AccountSet" },
      ],
      token: "",
      Data: [],
      show: false,
      active: "",
      fileImg: "photograph",
      ImgData: {},
      StartTime: "",
    };
  },
  mounted() {
    this.token = this.$cookies.get("token");
    this.FindMy();
  },
  methods: {
    AntiShake() {
      if (this.StartTime == "") {
        this.StartTime = new Date().getTime();
      } else {
        var endTime = new Date().getTime();
        if (endTime - this.StartTime < 2000) return true;
      }
    },
    FindMy() {
      if (this.token == "") return;
      this.axios({
        method: "GET",
        url: "/findMy",
        params: {
          tokenString: this.token,
        },
      })
        .then((res) => {
          this.Data = res.data.result[0];
          if (this.Data.desc == "") this.Data.desc = "这家伙很懒，什么都没留下";
        })
        .catch((err) => {});
    },
    Login() {
      if (this.AntiShake()) return;
      this.$router.push({ name: "Login" });
    },
    GoTo(index) {
      if (this.token == null) {
        if (this.AntiShake()) return;
        Toast("您尚未登录，请先前去登录");
        setTimeout(() => {
          this.$router.push({ name: "Login" });
        }, 2000);
        return;
      } else {
        this.$router.push({ name: this.MyData[index].path });
      }
    },
    showPopup(index, value) {
      if (this.token == null) {
        if (this.AntiShake()) return;
        Toast("您尚未登录，请先前去登录");
        setTimeout(() => {
          this.$router.push({ name: "Login" });
        }, 2000);
        return;
      }
      this.show = true;
    },
    afterRead(file) {
      var serverBase64Img = file.content.split(",")[1];
      var imgType = file.content.split(";")[0].split("/")[1];
      var Data = {
        serverBase64Img,
        imgType,
        tokenString: this.token,
      };
      this.ImgData = Data;
      this.fileImg = require("@/assets/images/" + file.file.name);
    },
    cancel() {
      this.show = false;
      this.active = 0;
      this.fileImg = "photograph";
      setTimeout(() => {
        this.active = "";
      }, 300);
    },
    determine() {
      this.active = 1;
      setTimeout(() => {
        this.active = "";
      }, 300);

      this.axios({
        method: "POST",
        url: "/updateUserBg",
        data: {
          ...this.ImgData,
        },
      })
        .then((res) => {
          this.FindMy();
          this.fileImg = "photograph";
          setTimeout(() => {
            this.show = false;
            Toast(res.data.msg);
          }, 1000);
        })
        .catch((err) => {});
    },
  },
};
</script>
<style lang="less" scoped>
/deep/ .van-uploader__upload-icon {
  font-size: inherit;
}
.Per_edit {
  width: 300px;
  height: 200px;
  overflow: hidden;

  .van-icon {
    font-size: inherit !important;
  }

  .uploader {
    z-index: 1000;
    border-top: none;
    top: 30px;
    left: 110px;
    position: relative !important;
  }

  > div {
    width: 100%;
    position: absolute;
    display: flex;
    left: 0;
    bottom: 0;
    border-top: 1px solid black;

    button:first-of-type {
      border-right: 1px solid black;
    }

    button {
      display: block;
      width: 50%;
      height: 50px;
      border: none;
      background-color: white;
      font-size: 20px;

      &.active {
        background-color: red !important;
        border: none !important;
        color: white;
      }
    }
  }
}
.My_con {
  position: absolute;
  width: 100%;
  height: calc(~"100% - 50px");
  background-color: #eee;
  text-align: start;

  > img {
    position: absolute;
    width: 100%;
    height: 200px;
    left: 0;
    top: 0;
  }

  .My_body {
    position: absolute;
    width: 84%;
    margin: 0 auto;
    padding: 3%;
    top: 160px;
    left: 5%;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 10px 10px 0 0;

    > div {
      > div {
        display: flex;
        img {
          width: 60px;
          height: 60px;
          border-radius: 50% 50%;
          margin-right: 15px;
        }
      }

      ul {
        list-style: none;
        margin-top: 50px;

        li {
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid #ccc;

          span {
            font-size: 12px;
            color: #666;
          }

          img {
            width: 20px;
            height: 20px;
          }
        }

        li:first-of-type {
          border: none;
        }
      }
    }
  }
}
</style>