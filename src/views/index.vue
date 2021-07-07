<template>
  <div v-cloak>
    <div>
      <router-view @get-badge="SCount"></router-view>
    </div>
    <div>
      <van-tabbar v-model="active" active-color="#ee0a24" inactive-color="#000">
        <van-tabbar v-model="active">
          <van-tabbar-item
            v-for="(item, index) in tabArr"
            :key="index"
            :badge="item.badge"
            :dot="item.dot"
            @click="choice(index, item.path)"
          >
            <span>{{ item.title }}</span>
            <template #icon="props">
              <img :src="props.active ? item.act_src : item.unact_src" />
            </template>
          </van-tabbar-item>
        </van-tabbar>
      </van-tabbar>
    </div>
  </div>
</template>
<script>
export default {
  name: "index",
  data() {
    return {
      active: 1,
      token: "",
      tabArr: [
        {
          title: "首页",
          unact_src: require("../assets/images/first_no.png"),
          act_src: require("../assets/images/first.png"),
          path: "Myhome",
        },
        {
          title: "菜单",
          unact_src: require("../assets/images/compass_no.png"),
          act_src: require("../assets/images/compass.png"),
          path: "Menu",
        },
        {
          title: "购物车",
          unact_src: require("../assets/images/shopping_no.png"),
          act_src: require("../assets/images/shopping.png"),
          path: "Myshop",
          badge: 0,
        },
        {
          title: "我的",
          unact_src: require("../assets/images/user_no.png"),
          act_src: require("../assets/images/user.png"),
          path: "My",
          dot: true,
        },
      ],
    };
  },
  methods: {
    choice(index, path) {
      if (this.$route.name == this.tabArr[index].path) return;
      this.$router.push({ path });
    },
    SCount(){
      if(this.token == null) return;
      
      this.axios({
        method: 'GET',
        url: '/shopcartCount',
        params: {
          tokenString: this.token
        }
      }).then((res) => {
        this.tabArr[2].badge = res.data.result
      }).catch((err) => {
      })
    }
  },
  created() {
    this.token = this.$cookies.get("token");
    for (var i = 0; i < this.tabArr.length; i++) {
      if (this.$route.name == this.tabArr[i].path) {
        this.active = i;
      }
    }
    this.SCount();
  }
};
</script>
<style lang="less" scoped>
</style>