<template>
  <div v-cloak>

    <van-nav-bar
      title="我的收藏"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    >
    </van-nav-bar>

    <div class="coll_body">
      <div class="coll_head"></div>
      <van-empty v-if="CollData.length == 0" description="当前没有收藏商品" />
      <div class="coll_con" v-if="CollData.length>0">
        <div v-for="(item, index) in CollData" :key="index">
          <div @click="Detail(item)">
            <img :src="item.smallImg" alt="#" />
            <p>{{ item.name }}</p>
            <p>{{ item.enname }}</p>
            <span>&yen; {{ item.price }}</span>
          </div>
          <img src="../assets/images/del.png" alt="#" @click="delColl(index)" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "My_collection",
  data() {
    return {
      token: "",
      CollData: [],
    };
  },
  mounted() {
    this.token = this.$cookies.get("token");
    this.FindMyColl();
  },
  methods: {
    Detail(data) {
      this.$router.push({
        name: "Detail",
        params: {
          pid: data.pid,
          routerName: this.$route.name,
        },
      });
    },
    onClickLeft() {
      this.$router.push({ name: "My" });
    },
    FindMyColl() {
      this.axios({
        method: "GET",
        url: "/findAllLike",
        params: {
          tokenString: this.token,
        },
      })
        .then((res) => {
          this.CollData = res.data.result;
        })
        .catch((err) => {
        });
    },
    delColl(index) {
      this.show = true;
      this.axios({
          method: "POST",
          url: "/notlike",
          data: {
              pid: this.CollData[index].pid,
              tokenString: this.token
          }
      }).then((res) => {
          this.FindMyColl()
      }).catch((err) => {
      })
    },
  },
};
</script>
<style lang="less" scoped>
.del_coll {
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
.coll_body {
  position: absolute;
  width: 100%;
  height: 100%;

  .coll_head {
    width: 100%;
    height: 100px;
    background-color: #0c34ba;
  }

  .coll_con {
    position: relative;
    width: 90%;
    max-height: calc(~"100% - 150px");
    padding: 2%;
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
      position: relative;

      > div {
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
      > img {
          width: 14px;
          height: 14px;
          position: absolute;
          bottom: 0;
          right: 0;
        }
    }
  }
}
</style>