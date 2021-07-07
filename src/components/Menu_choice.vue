<template>
  <div class="M_content">
    <div v-if="borRad" class="slot"><slot name="top"></slot></div>
    <img :src="MenuData.smallImg" alt="#" :style="borRad?'border-radius:10px':''" />
    <p>{{ MenuData.name }}</p>
    <p>{{ MenuData.enname }}</p>
    <p>&yen;{{ MenuData.price }}</p>
  </div>
</template>
<script>
export default {
  name: "MenuChoice",
  props: {
    MenuData: {
      name: {
        type: String,
      },
      src: {
        type: String,
      },
      Ename: {
        type: String,
      },
      price: {
        type: Number,
      },
    },
    borRad: {
      type: Boolean,
    }
  },
  data() {
    return {};
  },
};
</script>
<style lang='less' scoped>
.slot{
  position: absolute;
  left: 30px;
  z-index: 100;
  padding: 5px;
  background-color: #0c34ba;
  color: white;
}
.M_content {
  //   width: calc(~"50% - 10px");
  // height: 80px;
  margin: 5%;
  background-color: white;
  white-space: nowrap;

  img {
    width: 100%;
    min-height: 100px;
    max-height: 120px;
  }
  p {
    text-overflow: ellipsis;
    overflow: hidden;
    margin-bottom: 10px;
  }
  p:first-of-type {
    font-size: 14px;
  }
  p:nth-of-type(2) {
    color: #ccc;
  }
  p:nth-of-type(3) {
    color: #0c34ba;
    font-weight: bolder;
    font-size: 14px;
  }
}
</style>