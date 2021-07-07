<template>
  <div v-cloak>
    <div class="SearchHead">
      <div>
        <van-icon name="arrow-left" />
        <span @click="onClickLeft">返回</span>
      </div>
      <form style="width:80%" action="/">
        <van-search
        style="width:100%"
          v-model="value"
          show-action
          placeholder="请输入搜索关键词"
          @keydown.enter="Search"
          @cancel="onCancel"
        />
      </form>
    </div>

    <div class="Search_body">
      <div class="Search_head"></div>
      <div class="Search_con">
        <div v-for="(item, index) in SearchData" :key="index">
          <img :src="item.smallImg" alt="#" />
          <p>{{ item.name }}</p>
          <p>{{ item.enname }}</p>
          <span>&yen; {{ item.price }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Toast } from 'vant';
export default {
  name: "Search",
  data() {
    return {
      token: "",
      SearchData: [],
      value: "",
    };
  },
  mounted() {
    this.token = this.$cookies.get("token");
  },
  methods: {
    onCancel(){
      this.SearchData = []
    },
    onClickLeft() {
      this.$router.push({ name: this.$route.params.path || 'Myhome' });
    },
    Search() {
      if (this.value == "") {
        Toast('搜索内容不能为空')
        this.SearchData = [];
        return;
      }
      this.axios({
        method: "GET",
        url: "/search",
        params: {
          tokenString: this.token,
          name: this.value,
        },
      })
        .then((res) => {
          this.SearchData = res.data.result;
        })
        .catch((err) => {
        });
    },
    
  },
  
};
</script>
<style lang="less" scoped>
.SearchHead {
  display: flex;
  align-items: center;
  background-color: white;
  width: 100%;
  justify-content: space-around;


  div {
    width: 20%;
    justify-content: center;
    display: flex;
    align-items: center;
    color: #0c34ba;
    font-size: 14px;

    span {
      margin-left: 5px;
    }
  }
}
.Search_body {
  position: absolute;
  width: 100%;
  height: 100%;

  .Search_head {
    width: 100%;
    height: 100px;
    background-color: #0c34ba;
  }

  .Search_con {
    position: relative;
    width: 90%;
    max-height: calc(~"100% - 150px");
    padding: 0 2%;
    top: -20px;
    left: 3%;
    background-color: white;
    border-radius: 10px 10px 0 0;
    display: flex;
    flex-wrap: wrap;
    overflow-y: auto;

    > div {
      width: 30%;
      text-align: start;
      margin: 5px;

      > img {
        width: 100%;
        height: 100px;
      }

      p:first-of-type {
        color: #666;
        margin-top: 5px;
      }

      p:nth-of-type(2) {
        color: #999;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        margin: 5px 0;
      }
      span {
        color: #0c34ba;
        font-weight: bold;
      }
    }
  }
}
</style>