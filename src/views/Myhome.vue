<template>
  <div v-cloak class="Home">
    <div class="Home_assembly">
      <div>
        <img :src="greetImg" alt="#">
        <span style="color: #999; font-weight: bold; font-size: 14px"
          >{{greetings}}</span
        >
        <img @click="GoLogin" v-if="token==null" src="../assets/images/user_one.png" alt="#">
        <span v-if="token!=null" style="color: #0c34ba; font-weight: bold; font-size: 14px"
          >{{name}}</span
        >
        <van-search @focus="onfocus" v-model="value" placeholder="请输入搜索关键词" />
      </div>

      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
        <van-swipe-item v-for="(item, index) in MenuData" :key="index">
          <img v-lazy="item.largeImg" @click="detail(MenuData[index])" />
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="Home_head">
      <p>热卖推荐</p>
    </div>

    <div class="Home_body">
      <div
        v-for="(item, index) in MenuData"
        :key="index"
        @click="detail(MenuData[index])"
      >
        <div>
          <menu-choice
            v-bind:bor-rad="bor_rad"
            v-bind:menu-data="MenuData[index]"
          >
            <template class="hot" v-slot:top> hot </template>
          </menu-choice>
          <!-- <MenuChoice v-bind:menu-data="MenuData[index]" /> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import MenuChoice from "../components/Menu_choice.vue";
export default {
  name: "Myhome",
  data() {
    return {
      token: "",
      MenuData: [],
      bor_rad: true,
      value: "",
      greetings: "",
      greetImg: "",
      name: "",
    };
  },
  components: {
    MenuChoice,
  },
  methods: {
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
          ("My===>", res);
          this.name = res.data.result[0].nickName;
        })
        .catch((err) => {
          (err);
        });
    },
    GoLogin(){
      this.$router.push({name: 'Login'})
    },
    GetTimg(){
      var dd = new Date();
      var hour = dd.getHours();
      if(hour>=6 && hour < 12){
        this.greetings = "早上好";
        this.greetImg = require('../assets/images/day.png')
      }else if(hour >= 12 && hour < 18){
        this.greetings = "下午好";
        this.greetImg = require('../assets/images/day.png')
      }else{
        this.greetings = "晚上好";
        this.greetImg = require('../assets/images/night.png')
      }
    },
    onfocus(){
      this.$router.push({name: 'Search',params:{path:'Myhome'}})
    },
    detail(data) {
      this.$router.push({
        name: 'Detail',
        params: {
          pid: data.pid,
          routerName: this.$route.name,
        },
      });
    },
    getType() {
      this.axios({
        method: "GET",
        url: "/type",
      })
        .then((res) => {
          if (res.data.code === 400) {
            //构造热卖推荐类型
            res.data.result.unshift({ type: "isHot", typeDesc: "热卖推荐" });
          }
        })
        .catch((err) => {
        });
    },
    getProType(index, type) {
      index = index || 0;
      let cacheData = localStorage.getItem("cacheProduct");
      cacheData = cacheData ? JSON.parse(cacheData) : {};
      let currentTime = new Date().getTime();
      if (
        cacheData.expires &&
        currentTime - cacheData.expires < 10 * 60 * 1000
      ) {
        if (cacheData[type]) {
          // ("存在数据");
          this.MenuData = cacheData[type];
          return;
        }
      } else {
        cacheData = {};
      }

      var type = "isHot";
      let key = type;
      let value = 1;

      this.axios({
        method: "GET",
        url: "/typeProducts",
        params: {
          key,
          value,
        },
      })
        .then((res) => {
          if (res.data.code === 500) {
            this.MenuData = res.data.result;
            ("MenuData=====>", this.MenuData);

            if (!cacheData.expires) {
              cacheData.expires = new Date().getTime();
            }

            cacheData[type] = res.data.result;
            localStorage.setItem("cacheProduct", JSON.stringify(cacheData));
          }
        })
        .catch((err) => {
        });
    },
  },
  created() {
    this.token = this.$cookies.get('token')
    this.FindMy();
    this.GetTimg();
    this.getType();
    this.getProType(this.$route.params.M_index, this.$route.params.type);
  },
};
</script>
<style lang="less" scoped>
.Home {
  overflow-y: auto;
  height: calc(~"100% - 50px");
  position: absolute;
  width: 100%;
  bottom: 50px;
}
.my-swipe {
  width: 90%;
  margin: 10px auto;
  position: relative !important;
  border-radius: 10px;
  img {
    width: 100%;
    height: 200px;
  }
}
.Home_assembly {
  > div:first-of-type {
    background-color: white;
    display: flex;
    justify-content: space-around;
    align-items: center;

    img{
      width: 25px;
      height: 25px;
    }
  }
}
.Home_head {
  width: 92%;
  margin: 0 auto;
  padding: 10px 0;
  text-align: start;
  background-color: white;

  p {
    display: inline-block;
    background-color: #0c34ba;
    color: white;
    font-size: 14px;
    padding: 10px 15px;
    border-top-right-radius: 20px;
  }
}
.Home_body {
  width: 100%;
  // top: 65px;
  // bottom: 50px;
  // position: absolute;
  // height: calc(~"100% - 115px");
  // overflow-y: auto;
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;

  > div {
    width: 44%;
    position: relative;
    background-color: white;
    margin: 5px 0;

    > div {
      width: 92%;
      margin: 0 auto;
    }
  }

  .hot {
    position: absolute;
  }
}
</style>