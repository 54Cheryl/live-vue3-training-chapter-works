<template>
  --後台頁面--
  <br>
  <router-link to="/admin/products">後台產品管理</router-link> |
  <router-link to="/admin/orders">後台訂單管理</router-link> |
  <router-link to="/">回到前台home</router-link> |
  <a href="#" @click.prevent="logout">登出</a>
  <hr>
  <RouterView></RouterView>
</template>

<script>
import { RouterView } from 'vue-router'
const { VITE_APP_URL } = import.meta.env
export default {
  components: {
    RouterView
  },
  methods: {
    logout () {
      document.cookie = `cherylToken=; expires=${new Date()};`
      this.$router.push('/login')
    },
    checkLogin () {
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)cherylToken\s*=\s*([^;]*).*$)|^.*$/, '$1')
      this.$http.defaults.headers.common.Authorization = token
      this.$http.post(`${VITE_APP_URL}api/user/check`)
        .then((res) => {
          if (!res.data.success) {
            this.$router.push('/login')
          }
        })
        .catch(() => {
          this.$router.push('/login')
        })
    }
  },
  mounted () {
    this.checkLogin()
  }
}
</script>
