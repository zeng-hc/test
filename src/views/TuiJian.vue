<template>
  <div v-cloak>
    <div
      v-for="(item, index) in MenuData"
      :key="index"
      @click="detail(MenuData[index])"
    >
      <MenuChoice v-bind:menu-data="MenuData[index]" />
      
    </div>
  </div>
</template>
<script>
import MenuChoice from "../components/Menu_choice.vue";
export default {
  name: "TuiJian",
  data() {
    return {
      MenuData: [
        {
          name: "焦糖玛奇朵",
          src: require("../assets/images/coffee_1.jpg"),
          Ename: "jiao tang ma qi duo",
          price: 28,
        },
        {
          name: "拿铁咖啡",
          src: require("../assets/images/coffee_2.jpg"),
          Ename: "na tie ka fei",
          price: 30,
        },
        {
          name: "摩卡咖啡",
          src: require("../assets/images/coffee_3.jpg"),
          Ename: "mo ka ka fei",
          price: 35,
        },
        {
          name: "焦糖拿铁",
          src: require("../assets/images/coffee_4.jpg"),
          Ename: "jiao tang na tie",
          price: 30,
        },
        {
          name: "奥瑞白",
          src: require("../assets/images/coffee_5.jpg"),
          Ename: "ao rui bai",
          price: 40,
        },
        {
          name: "美式咖啡",
          src: require("../assets/images/coffee_6.jpg"),
          Ename: "mei shi ka fei",
          price: 25,
        },
        {
          name: "焦糖玛奇朵",
          src: require("../assets/images/coffee_1.jpg"),
          Ename: "jiao tang ma qi duo",
          price: 28,
        },
        {
          name: "拿铁咖啡",
          src: require("../assets/images/coffee_2.jpg"),
          Ename: "na tie ka fei",
          price: 30,
        },
        {
          name: "摩卡咖啡",
          src: require("../assets/images/coffee_3.jpg"),
          Ename: "mo ka ka fei",
          price: 35,
        },
        {
          name: "焦糖拿铁",
          src: require("../assets/images/coffee_4.jpg"),
          Ename: "jiao tang na tie",
          price: 30,
        },
        {
          name: "奥瑞白",
          src: require("../assets/images/coffee_5.jpg"),
          Ename: "ao rui bai",
          price: 40,
        },
        {
          name: "美式咖啡",
          src: require("../assets/images/coffee_6.jpg"),
          Ename: "mei shi ka fei",
          price: 25,
        },
      ],
      // describe: [
      //   {con:"Espresso（意式浓缩）与水的黄金配比，带来浓郁的咖啡芬芳，成为脑海中挥之不去的绝妙体验。"},
      //   {con:"主要原材料：浓缩咖啡、水"},
      //   {con:"图片仅供参考，一切以实物为准。建议送达后尽快饮用。"}
      // ]
    };
  },
  components: {
    MenuChoice,
  },
  methods: {
    detail(data) {
      this.$router.push({
        name: "Detail",
        params: {
          data: data,
          // describe: this.describe
        },
      });
    },
  },
};
</script>