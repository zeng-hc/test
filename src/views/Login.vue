<template>
  <div v-cloak class="L_content">
    <div class="L_head">
      <div>
        <img src="../assets/images/coffee_logo.png" alt="#" />
        <span>Luckin Coffee</span>
      </div>
      <button @click="GoLook">先逛一逛</button>
    </div>

    <div class="L_body">
      <h1>{{ Status == 0 ? "欢迎回来!" : "找回密码!" }}</h1>
      <p>
        {{ Status == 0 ? "Please login to your accounts" : "Find passwoed" }}
      </p>

      <div class="login-form">
        <van-form>
          <van-field
            v-model="mailboxInfo.email"
            name="邮箱"
            label="邮箱"
            placeholder="邮箱"
            v-if="Status == 1"
          />
          <div style="position: relative" v-if="Status == 1">
            <van-field
              v-model="mailboxInfo.VerificationCode"
              type="text"
              name="验证码"
              label="验证码"
              placeholder="验证码（6个字符）"
            />
            <button
              class="yzmbtn"
              :style="
                outTime == '发送验证码'
                  ? ''
                  : 'background-color:#ccc;color:black'
              "
              @click="SendOut"
            >
              {{ outTime }}
            </button>
          </div>

          <van-field
            v-model="loginUserInfo.phone"
            name="手机号"
            label="手机号"
            placeholder="输入手机号"
            v-if="Status != 1"
          />
          <van-field
            v-model="loginUserInfo.password"
            :type="LoginStatus ? 'password' : 'text'"
            name="密码"
            label="密码"
            placeholder="输入密码"
            :right-icon="LoginStatus ? 'closed-eye' : 'eye-o'"
            @click-right-icon="toggleLoginPassword"
            v-if="Status != 1"
          />

          <div class="forgot" @click="ForgetPass">
            <div class="forgot-text">
              {{ Status == 0 ? "忘记密码？" : "已有账号，立即登录" }}
            </div>
          </div>

          <div class="login-btn">
            <van-button
              round
              block
              color="#0C34BA"
              native-type="submit"
              @click="login"
              >{{ btnTxt[Status] }}</van-button
            >
          </div>

          <div v-if="Status != 1" class="login-btn" @click="RegisterShow">
            <van-button round block>{{
              Status == 0 ? "注  册" : "返  回"
            }}</van-button>
          </div>
        </van-form>
      </div>
    </div>

    <van-popup v-model="show" position="bottom" closeable>
      <div class="register">
        <h2>注册</h2>
        <div>
          <van-form @submit="register">
            <van-field
              v-model="regUserInfo.phone"
              name="手机号"
              label="手机号"
              placeholder="输入手机号(11位)"
              autocomplete="off"
            />
            <van-field
              v-model="regUserInfo.password"
              :type="passwordStatus ? 'password' : 'text'"
              name="密码"
              label="密码"
              placeholder="输入密码(必须字母开头6-16位)"
              :right-icon="passwordStatus ? 'closed-eye' : 'eye-o'"
              autocomplete="off"
              @click-right-icon="toggleRegPassword"
            />

            <van-field
              v-model="regUserInfo.nickName"
              type="text"
              name="昵称"
              label="昵称"
              placeholder="输入昵称(支持中英文组合1-10位)"
              autocomplete="off"
            />

            <div class="login-btn">
              <van-button round block color="#0C34BA" native-type="submit"
                >注&nbsp;&nbsp;册</van-button
              >
            </div>
          </van-form>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import { Toast } from "vant";
export default {
  name: "Login",
  data() {
    return {
      Status: 0,
      btnTxt: ["登  录", "下一步", "提交"],
      show: false,
      loginUserInfo: {
        phone: "",
        password: "",
      },
      regUserInfo: {
        phone: "",
        password: "",
        nickName: "",
      },
      mailboxInfo: {
        email: "",
        VerificationCode: "",
      },
      passwordStatus: true,
      LoginStatus: true,
      outTime: "发送验证码",
    };
  },
  methods: {
    SendOut() {
      let emailTest = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
      if (!emailTest.test(this.mailboxInfo.email)) {
        Toast("邮箱格式不正确");
        return;
      }
      if (this.outTime != "发送验证码") return;
      this.outTime = 59;
      var sTime = setInterval(() => {
        if (this.outTime == 1) {
          this.outTime = "发送验证码";
          clearInterval(sTime);
        } else {
          this.outTime--;
        }
      }, 1000);

      this.axios({
        method: "POST",
        url: "/emailValidCode",
        data: {
          email: this.mailboxInfo.email,
        },
      })
        .then((res) => {
          Toast(res.data.msg);
        })
        .catch((err) => {});
    },
    ForgetPass() {
      this.Status == 0 ? (this.Status = 1) : (this.Status = 0);
      this.loginUserInfo.phone = "";
      this.loginUserInfo.password = "";
    },
    GoLook() {
      this.$router.push({ name: "Myhome" });
    },
    onSubmit(values) {
      "submit", values;
    },
    RegisterShow() {
      if (this.Status == 2) {
        this.Status = 0;
        return;
      }
      this.show = true;
    },
    register() {
      //验证手机号
      let RegisterPhone = /^1[3-9]\d{9}/;
      if (!RegisterPhone.test(this.regUserInfo.phone)) {
        Toast("手机号码格式不正确");
        return;
      }

      //验证密码
      let RegisterPassword = /^[A-Za-z][A-Za-z\d]{5,15}/;
      if (!RegisterPassword.test(this.regUserInfo.password)) {
        Toast("密码格式不正确");
        return;
      }

      //验证昵称
      let RegisterNickname = /^[A-Za-z\u4e00-\u9fa5]{1,10}/;
      if (!RegisterNickname.test(this.regUserInfo.nickName)) {
        Toast("昵称格式不正确");
        return;
      }

      this.axios({
        method: "POST",
        url: "/register",
        data: this.regUserInfo,
      })
        .then((res) => {
          Toast(res.data.msg);
          if (res.data.code == 100) this.show = false;
        })
        .catch((err) => {});
    },
    toggleRegPassword() {
      this.passwordStatus = !this.passwordStatus;
    },
    toggleLoginPassword() {
      this.LoginStatus = !this.LoginStatus;
    },
    login() {
      //验证手机号
      if (this.Status == 0) {
        let LoginPhone = /^1[3-9]\d{9}/;
        if (!LoginPhone.test(this.loginUserInfo.phone)) {
          Toast("手机号码格式不正确");
          return;
        }

        //验证密码
        let LoginPassword = /^[A-Za-z][A-Za-z\d]{5,15}/;
        if (!LoginPassword.test(this.loginUserInfo.password)) {
          Toast("密码格式不正确");
          return;
        }
        this.axios({
          method: "POST",
          url: "/login",
          data: this.loginUserInfo,
        })
          .then((res) => {
            Toast(res.data.msg);
            if (res.data.code == 200) {
              this.$cookies.set("token", res.data.token, 60 * 60);
              setTimeout(() => {
                this.$router.push({ name: "Myhome" });
              }, 2000);
            }
          })
          .catch((err) => {});
      } else if (this.Status == 1) {
        let emailTest = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
        if (!emailTest.test(this.mailboxInfo.email)) {
          Toast("邮箱格式不正确");
          return;
        }
        this.axios({
          method: "POST",
          url: "/checkValidCode",
          data: {
            validCode: this.mailboxInfo.VerificationCode,
          },
        })
          .then((res) => {
            Toast(res.data.msg);
            if (res.data.code == "K001") this.Status = 2;
          })
          .catch((err) => {});
      } else if (this.Status == 2) {
        let LoginPassword = /^[A-Za-z][A-Za-z\d]{5,15}/;
        if (!LoginPassword.test(this.loginUserInfo.password)) {
          Toast("密码格式不正确");
          return;
        }
        this.axios({
          method: "POST",
          url: "/retrievePassword",
          data: {
            phone: this.loginUserInfo.phone,
            password: this.loginUserInfo.password,
          },
        })
          .then((res) => {
            Toast(res.data.msg);
            this.loginUserInfo.phone = "";
            this.loginUserInfo.password = "";
            if (res.data.code == "L001") this.Status = 0;
          })
          .catch((err) => {});
      }
    },
  },
};
</script>
<style lang="less" scoped>
.yzmbtn {
  position: absolute;
  right: 10px;
  top: 10px;
  display: block;
  width: 70px;
  height: 25px;
  border: none;
  background-color: #0c34ba;
  color: white;
}
.L_content {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: white;
  .L_head {
    width: 90%;
    height: 26px;
    padding: 10px 0;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;

    div {
      display: flex;
      align-items: center;

      img {
        width: 25px;
        height: 25px;
      }
      span {
        font-size: 14px;
        font-weight: bold;
        margin-left: 10px;
      }
    }
    button {
      background-color: transparent;
      border: none;
      font-size: 14px;
      font-weight: bold;
      color: #0c60d5;
    }
  }

  .L_body {
    width: 90%;
    margin: 0 auto;
    margin-top: 100px;
    text-align: start;

    > p {
      color: #999999;
      margin: 20px 0;
    }

    .forgot {
      margin: 20px 0;
      display: flex;
      justify-content: flex-end;
    }
    .login-btn {
      margin: 20px 0;
    }
  }

  .register {
    padding: 15px 0;

    h2 {
      text-align: start;
      margin-left: 20px;
      margin-bottom: 30px;
    }

    .login-btn {
      width: 90%;
      margin: 0 auto;
      margin-top: 30px;
    }
  }
}
</style>