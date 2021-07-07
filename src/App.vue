<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="less">
[v-cloak]{
  display: none;
}
*{
  margin: 0;
  padding: 0;
}
body{
  background-color: #eee;
  overflow-y: hidden;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
