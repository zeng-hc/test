<template>
  <div v-cloak>
    <van-nav-bar
      title="个人资料"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    >
    </van-nav-bar>

    <div class="Person_body">
      <div class="Person_head"></div>
      <ul class="Person_con">
        <van-popup
          class="Per_edit"
          :close-on-click-overlay="false"
          v-model="show"
          :style="index === 3 ? 'height:200px' : ''"
        >
          <van-uploader
            v-if="index === 3"
            :upload-icon="fileImg"
            :style="
              fileImg == 'photograph'
                ? 'font-size: 20px !important;'
                : 'font-size: 100px !important;'
            "
            :after-read="afterRead"
            class="uploader"
          />

          <input v-if="index !== 3" type="text" v-model="value" />
          <div>
            <button :class="active === 0 ? 'active' : ''" @click="cancel">
              取消
            </button>
            <button :class="active === 1 ? 'active' : ''" @click="determine">
              确定
            </button>
          </div>
        </van-popup>
        <li @click="showPopup(3)">
          <span>头像</span>
          <img :src="PersonData.userImg" alt="#" />
        </li>
        <li>
          <span>用户id</span>
          <span>{{ PersonData.userId }}</span>
        </li>
        <li @click="showPopup(0, PersonData.nickName)">
          <span>昵称</span>
          <span>{{ PersonData.nickName }}</span>
        </li>
        <li @click="showPopup(1, PersonData.desc)">
          <span>简介</span>
          <span>{{ PersonData.desc }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { Toast } from "vant";
export default {
  name: "My_collection",
  data() {
    return {
      value: "",
      show: false,
      token: "",
      PersonData: {},
      index: "",
      active: "",
      fileList: [],
      ImgData: "",
      fileImg: "photograph",
      StartTime: "",
    };
  },
  mounted() {
    this.token = this.$cookies.get("token");
    this.FindPersonData();
  },
  methods: {
    AntiShake() {
      if (this.StartTime == "") {
        this.StartTime = new Date().getTime();
      } else {
        var endTime = new Date().getTime();
        if (endTime - this.StartTime < 2000) {
          this.StartTime = endTime;
          return true;
        } else {
          this.StartTime = endTime;
        }
      }
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
      this.fileList.push({ url: "@/assets/images/" + file.file.name });
      (this.fileImg);
    },
    onClickLeft() {
      this.$router.push({ name: "My" });
    },
    showPopup(index, value) {
      this.show = true;
      this.index = index;
      this.value = value;
    },
    FindPersonData() {
      this.axios({
        method: "GET",
        url: "/findAccountInfo",
        params: {
          tokenString: this.token,
        },
      })
        .then((res) => {
          this.PersonData = res.data.result[0];
          if (this.PersonData.desc == "")
            this.PersonData.desc = "这家伙很懒，什么都没留下";
        })
        .catch((err) => {
        });
    },
    cancel() {
      if (this.AntiShake()) return;
      this.show = false;
      this.active = 0;
      this.fileImg = "photograph";
      setTimeout(() => {
        this.active = "";
      }, 300);
    },
    determine(URL, Data) {
      if (this.AntiShake()) return;
      this.active = 1;
      setTimeout(() => {
        this.active = "";
      }, 300);
      if (this.index == 3) {
        var URL = "/updateAvatar";
        var Data = this.ImgData;
      } else {
        if (this.index == 0) {
          if (this.value == "") {
            Toast("内容不能为空");
            return;
          }
          var URL = "/updateNickName";
          var Data = { nickName: this.value, tokenString: this.token };
        } else {
          var URL = "/updateDesc";
          var Data = { desc: this.value, tokenString: this.token };
        }
      }
      this.axios({
        method: "POST",
        url: URL,
        data: {
          ...Data,
        },
      })
        .then((res) => {
          this.FindPersonData();
          this.fileImg = "photograph";
          setTimeout(() => {
            this.show = false;
            Toast(res.data.msg);
          }, 1000);
        })
        .catch((err) => {
        });
    },
  },
};
</script>
<style lang="less" scoped>
/deep/ .van-uploader__upload-icon{
  font-size: inherit;
}
.Per_edit {
  width: 300px;
  height: 100px;
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
  img {
    margin: 30px auto;
    max-width: 200px;
    max-height: 100px;
  }

  input {
    display: block;
    margin: 0 auto;
    width: 90%;
    height: 30px;
    line-height: 30px;
    font-size: 16px;
    margin-top: 10px;
    border: 2px solid #03c;
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
.Person_body {
  position: absolute;
  width: 100%;
  height: 100%;

  .Person_head {
    width: 100%;
    height: 100px;
    background-color: #0c34ba;
  }

  .Person_con {
    position: relative;
    width: 90%;
    padding: 2%;
    top: -20px;
    left: 3%;
    background-color: white;
    border-radius: 10px 10px 0 0;
    list-style: none;

    li:first-of-type {
      border: none;
    }

    li {
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid #eee;

      span:first-of-type {
        color: #666;
        font-weight: bold;
        font-size: 14px;
      }
      span:nth-of-type(2) {
        color: #999;
        font-size: 14px;
      }

      img {
        width: 40px;
        height: 40px;
        border-radius: 50% 50%;
      }
    }
  }
}
</style>