<template>
  <div v-cloak>
    <van-nav-bar title="地址列表" left-text="返回" @click-left="onClickLeft" left-arrow> </van-nav-bar>

    <div class="Add_body">
      <div class="Add_head"></div>
      <van-empty v-if="AddressData.length==0" description="当前无可用地址" />

      <div class="Add_content">
        <div v-for="(item , index) in AddressData" :key="index">
          <div>
            <span style="color: #333; font-size: 16px;"
              >{{item.name}}</span
            >
            <span style="color: #666; font-size: 14px">{{item.tel}}</span>
            <span
              style="
                color: white;
                font-size: 14px;
                background-color: #0c34ba;
                padding: 0px 8px;
                border-radius: 20px;
              "
              v-if="item.isDefault>0"
              >默认</span>
              <p>{{item.province+item.city+item.county+item.addressDetail}}</p>
          </div>
          <van-icon name="edit" size="20" style="margin-right: 20px" @click="edit(item.aid)" />
        </div>
      </div>

      <button class="Add_btn" @click="add">新增地址</button>
    </div>
  </div>
</template>
<script>
export default {
  name: "Address",
  data() {
    return {
      token: "",
      AddressData: []
    };
  },
  created() {
    this.token = this.$cookies.get("token");
    this.FindAddress();
  },
  methods: {
    FindAddress() {
      this.axios({
        method: "GET",
        url: "/findAddress",
        params: {
          tokenString: this.token,
        },
      })
        .then((res) => {
          this.AddressData = res.data.result;
        })
        .catch((err) => {
        });
    },
    add(){
      this.$router.push({
        name: 'addAddress',
        params: {
          operation: true,
          routerName: this.$route.name
        }
      })
      },
    edit(aid){
      this.$router.push({
        name: 'addAddress',
        params: {
          operation: false,
          aid,
          AddressData: this.AddressData,
          routerName: this.$route.name
        }
      })
    },
    onClickLeft(){
      this.$router.push('My')
    }
  },
};
</script>
<style lang="less" scoped>
.Add_body {
  position: absolute;
  top: 46px;
  width: 100%;
  height: calc(~"100% - 46px");
  background-color: #f0f0f0;

  .Add_head {
    height: 100px;
    background-color: #0c34ba;
  }

  .Add_content {
    width: 86%;
    padding: 0 5%;
    position: relative;
    top: -20px;
    left: 2%;
    background-color: white;
    border-radius: 10px 10px 0 0;
    

    > div:first-of-type{
        border: none
    }
    > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid #999;
      padding: 5% 0;
      text-align: start;

      span{
          margin-left: 10px;
      }

      p{
          margin-top: 10px;
      }
    }
  }

  .Add_btn {
    width: 90%;
    height: 40px;
    display: block;
    position: absolute;
    bottom: 5px;
    left: 5%;
    background-color: #0c34ba;
    border: none;
    border-radius: 20px;
    color: white;
    font-size: 14px;
  }
}
</style>