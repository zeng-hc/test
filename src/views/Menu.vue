<template>
  <div v-cloak class="menu">
    <div class="search">
      <van-search
        v-model="value"
        placeholder="请输入搜索关键词"
        shape="round"
        @focus="onFocus"
      />
    </div>

    <div class="content">
      <div class="left">
        <div
          class="left_choice"
          :class="active == index ? 'active' : ''"
          v-for="(item, index) in choice"
          :key="index"
          @click="getProType(index, item.type)"
        >
          {{ item.typeDesc }}
        </div>
      </div>
      <div class="right">
        <div>
          <div
            v-for="(item, index) in MenuData"
            :key="index"
            @click="detail(MenuData[index])"
          >
            <MenuChoice v-bind:menu-data="MenuData[index]" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import MenuChoice from "../components/Menu_choice.vue";
export default {
  name: "Menu",
  data() {
    return {
      value: "",
      active: 0,
      choice: [],
      MenuData: [],
    };
  },
  components: {
    MenuChoice,
  },
  methods: {
    onFocus() {
      this.$router.push({ name: "Search", params: { path: "Menu" } });
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
            this.choice = res.data.result;
          }
        })
        .catch((err) => {
        });
    },
    getProType(index, type) {
      index = index || 0;
      this.active = index;
      let cacheData = localStorage.getItem("cacheProduct");

      cacheData = cacheData ? JSON.parse(cacheData) : {};

      let currentTime = new Date().getTime();
      if (
        cacheData.expires &&
        currentTime - cacheData.expires < 10 * 60 * 1000
      ) {
        if (cacheData[type]) {
          this.MenuData = cacheData[type];
          return;
        }
      } else {
        cacheData = {};
      }

      type = type || "isHot";
      let key = "";
      let value = "";
      if (type === "isHot") {
        key = type;
        value = 1;
      } else {
        key = "type";
        value = type;
      }
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
    detail(data) {
      if (this.active == 0) {
        var type = "isHot";
      } else {
        var type = data.type;
      }
      this.$router.push({
        name: 'Detail',
        params: {
          name: data.name,
          pid: data.pid,
          M_index: this.active,
          type,
          routerName: this.$route.name,
        },
      });
    },
  },
  created() {
    this.getType();
    this.getProType(this.$route.params.M_index, this.$route.params.type);
  },
};
</script>
<style lang="less" scoped>
.menu {
  position: fixed;
  width: 100%;
  height: 100%;
  .search {
    position: sticky;
  }
  .content {
    position: fixed;
    width: 100%;
    height: cale(~"100% - 108px");
    background-color: white;
    display: flex;
    top: 56px;
    bottom: 52px;

    .left {
      width: 20%;
      height: 100%;
      background-color: white;
      overflow-y: auto;

      .left_choice {
        height: 50px;
        line-height: 50px;
        font-size: 16px;
        text-align: center;
        border-bottom: 1px solid #ccc;
        position: relative;
      }
      .active {
        background-color: rgb(243, 243, 243);
        color: black;

        &:before {
          content: "";
          display: block;
          width: 3px;
          height: 30px;
          background-color: rgb(255, 60, 0);
          position: absolute;
          top: 10px;
        }
      }
    }

    .right {
      width: 80%;
      height: 100%;
      background-color: rgb(243, 243, 243);
      overflow-y: auto;

      > div {
        display: flex;
        flex-wrap: wrap;
        > div {
          width: 50%;
        }
      }
    }
  }
}
</style>