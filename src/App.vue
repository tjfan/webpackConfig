<template>
  <div class="app">
    自己搭建的vue
    <router-link to="/home" tag="div">home</router-link>
    <router-link to="/login" tag="div">登录</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
    return {

    }
  }
}
</script>

<style scoped>
</style>