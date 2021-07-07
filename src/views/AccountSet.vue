<template>
  <div v-cloak @click="AntiShake">
    <van-nav-bar
      title="账号设置"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    >
    </van-nav-bar>

    <div class="Account_body">
      <div class="Account_head"></div>
      <div class="Account_content">
        <ul>
          <li @click="AccountSet(0)">
            <span>修改密码</span>
            <img src="../assets/images/right.png" alt="#" />
          </li>
          <li @click="AccountSet(1)">
            <span>注销账号</span>
            <img src="../assets/images/right.png" alt="#" />
          </li>
        </ul>
      </div>
      <div class="Account_footer">
        <button @click="AccountSet(2)">退出登录</button>
      </div>
    </div>
    <van-popup
      v-model="show"
      position="bottom"
      class="Acc_popup"
      :close-on-click-overlay="false"
    >
      <div
        class="modify"
        v-if="status === 0"
        :style="status === 0 ? 'height: 200px;' : ''"
      >
        <div>
          <p>修改密码</p>
          <img @click="close" src="../assets/images/tuichu.png" alt="#" />
        </div>

        <div class="modify_content">
          <van-form @submit="register">
            <van-field
              :type="oldPassStatus ? 'password' : 'text'"
              :right-icon="oldPassStatus ? 'closed-eye' : 'eye-o'"
              v-model="oldPass"
              name="旧密码"
              label="旧密码"
              placeholder="输入旧密码"
              autocomplete="off"
              @click-right-icon="toggleOldPass"
            />
            <van-field
              v-model="newPass"
              :type="newPassStatus ? 'password' : 'text'"
              name="新密码"
              label="新密码"
              placeholder="输入新密码(必须字母开头6-16位)"
              :right-icon="newPassStatus ? 'closed-eye' : 'eye-o'"
              autocomplete="off"
              @click-right-icon="toggleNewPass"
            />

            <div class="login-btn">
              <van-button round block color="#0C34BA" native-type="submit"
                >确&nbsp;认&nbsp;修&nbsp;改</van-button
              >
            </div>
          </van-form>
        </div>
      </div>

      <div class="queding" v-if="status !== 0">
        <p v-if="status === 1">一旦注销账号将无法再登录此账号，请谨慎操作</p>
        <button @click="close">取消</button>
        <button @click="AccountOperation(2)">确认</button>
      </div>
    </van-popup>
  </div>
</template>
<script>
import { Toast } from "vant";
export default {
  name: "AccountSet",
  data() {
    return {
      show: false,
      token: "",
      status: 0,
      oldPassStatus: true,
      newPassStatus: true,
      newPass: "",
      oldPass: "",
      phone: "",
    };
  },
  methods: {
    AntiShake(){
      if(this.token == null) return true;
    },
    toggleNewPass() {
      this.newPassStatus = !this.newPassStatus;
    },
    toggleOldPass() {
      this.oldPassStatus = !this.oldPassStatus;
    },
    register() {
      let TestPassword = /^[A-Za-z][A-Za-z\d]{5,15}/;
      if (!TestPassword.test(this.oldPass)) {
        Toast("密码格式不正确");
        return;
      }

      if (!TestPassword.test(this.newPass)) {
        Toast("密码格式不正确");
        return;
      }
      this.FindPersonData();
      this.axios({
        method: "POST",
        url: "/updatePassword",
        data: {
          tokenString: this.token,
          password: this.newPass,
          oldPassword: this.oldPass,
        },
      })
        .then((res) => {
          Toast(res.data.msg);
          if (res.data.code == "E001") {
            this.Login();
            this.oldPass = "";
            this.newPass = "";
            this.show = false;
          }
        })
        .catch((err) => {
        });
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
          this.phone = res.data.result[0].phone;
        })
        .catch((err) => {
        });
    },
    Login() {
      this.axios({
        method: "POST",
        url: "/login",
        data: {
          phone: this.phone,
          password: this.newPass,
        },
      })
        .then((res) => {
          this.$cookies.remove("token");
          this.$cookies.set("token", res.data.token, 60 * 60);
          this.token = this.$cookies.get("token");
        })
        .catch((err) => {
        });
    },
    onClickLeft() {
      this.$router.push({ name: "My" });
    },
    AccountSet(status) {
      if(this.AntiShake()) return;
      this.show = true;
      this.status = status;
    },
    close() {
      this.show = false;
      setTimeout(() => {
        this.status = 0;
      }, 300);
    },
    AccountOperation() {
      if (this.status === 2) {
        var URL = "/logout";
      } else if (this.status === 1) {
        var URL = "/destroyAccount";
      }

      this.axios({
        method: "POST",
        url: URL,
        data: {
          tokenString: this.token,
        },
      })
        .then((res) => {
          this.show = false;
          Toast(res.data.msg);
          this.$cookies.remove("token");
          this.token = null;
          this.status = 0;
          setTimeout(() => {
            this.$router.push({ name: "My" });
          }, 2000);
        })
        .catch((err) => {
        });
    },
  },
  created() {
    this.token = this.$cookies.get("token");
  },
};
</script>
<style lang="less" scoped>
.Acc_popup {
  padding: 10px 0;

  .modify {
    .modify_content {
      position: relative;
      top: 80px;
    }
    > div {
      width: 90%;
      margin: 0 auto;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      p {
        color: #999;
        font-size: 14px;
      }
      img {
        width: 20px;
        height: 20px;
      }
    }
  }

  .queding {
    > button {
      display: block;
      width: 90%;
      height: 50px;
      background-color: red;
      color: white;
      font-size: 14px;
      margin: 10px auto;
      border-radius: 20px;
      border: none;
    }

    button:first-of-type {
      border: 2px solid #ccc;
      background-color: white;
      color: #999;
    }
  }
}
.Account_body {
  position: absolute;
  width: 100%;
  height: calc(~"100% - 46px");
  top: 46px;

  .Account_head {
    width: 100%;
    height: 100px;
    background-color: #0c34ba;
  }

  .Account_content {
    width: 94%;
    margin: 0 auto;
    background-color: white;
    border-radius: 10px 10px 0 0;
    transform: translateY(-20px);

    ul {
      list-style: none;
      li {
        width: 90%;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        height: 50px;
        border-bottom: 1px solid #ccc;
        align-items: center;
        font-size: 14px;

        img {
          width: 30px;
          height: 30px;
        }
      }
      li:nth-of-type(2) {
        border: none;
      }
    }
  }

  .Account_footer {
    position: absolute;
    width: 100%;
    height: 50px;
    bottom: 0;
    background-color: white;

    button {
      display: block;
      width: 94%;
      height: 40px;
      margin: 5px auto;
      border: none;
      border-radius: 20px;
      background-color: #0c34ba;
      color: white;
      font-size: 14px;
    }
  }
}
</style>