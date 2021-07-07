<template>
  <div v-cloak>
    <van-nav-bar :title="this.$route.params.operation?'新增地址':'编辑地址'" left-text="返回" @click-left="onClickLeft" left-arrow> </van-nav-bar>

    <van-address-edit
      :area-list="areaList"
      show-postal
      :show-delete="!this.$route.params.operation"
      show-set-default
      show-search-result
      :search-result="searchResult"
      :area-columns-placeholder="['请选择', '请选择', '请选择']"
      @save="onSave"
      @delete="onDelete"
      @change-detail="onChangeDetail"
      :address-info="AddressData"
    />
  </div>
</template>
<script>
import { Toast } from "vant";
import { areaList } from "@vant/area-data";
export default {
  name: "addAddress",
  data() {
    return {
      token: "",
      areaList,
      searchResult: [],
      show: false,
      value: "",
      province: "",
      AddressData: {}
    };
  },
  created(){
    this.token = this.$cookies.get("token")
    // this.AddressData = this.$route.params.AddressData[0]
  },
  methods: {
    onSave(content) {
      delete content.country
      content.isDefault = content.isDefault?1:0
      var  url = this.$route.params.operation?'/addAddress':'/editAddress'
      if(!this.$route.params.operation){
        content.aid = this.$route.params.aid
      }
      
      this.axios({
        method: 'POST',
        url,
        data: {
          tokenString: this.token,
          ...content,
        }
      }).then((res) => {
        Toast(res.data.msg)
        setTimeout(() => {
          if(this.$route.params.routerName=='Settlement') this.$route.params.routerName = 'Myshop'
          this.$router.push({name: this.$route.params.routerName})
        },2000)
      }).catch((err) => {
      })
    },
    onDelete() {
      this.axios({
        method: 'POST',
        url: '/deleteAddress',
        data: {
          tokenString: this.token,
          aid: this.$route.params.aid
        }
      }).then((res) => {
        Toast(res.data.msg)
        setTimeout(() => {
          this.$router.push('Address')
        },2000)
      })
    },
    onChangeDetail(val) {
      if (val) {
        this.searchResult = [];
      } else {
        this.searchResult = [];
      }
    },
    onClickLeft(){
      if(this.$route.params.routerName=='Settlement') this.$route.params.routerName = 'Myshop'
      this.$router.push({name: this.$route.params.routerName})
    }
  }
};
</script>
<style lang="less" scoped>
</style>