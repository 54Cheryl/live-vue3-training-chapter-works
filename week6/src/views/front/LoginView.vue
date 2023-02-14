<template>
  <div>
    這是登入畫面
    <br>
    <div class="container mt-5">
      <form class="row justify-content-center" @submit.prevent="login">
        <div class="col-md-6">
          <h1 class="h3 mb-3 font-weight-normal">請先登入</h1>
          <div class="mb-2">
            <label for="inputEmail" class="sr-only">Email address</label>
            <input
              type="email"
              id="inputEmail"
              class="form-control"
              placeholder="Email address"
              v-model="user.username"
              required
              autofocus
            />
          </div>
          <div class="mb-2">
            <label for="inputPassword" class="sr-only">Password</label>
            <input
              type="password"
              id="inputPassword"
              class="form-control"
              v-model="user.password"
              placeholder="Password"
              required
            />
          </div>
          <div class="text-end mt-4">
            <button class="btn btn-lg btn-primary btn-block w-100" type="submit">
              登入
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
const { VITE_APP_URL } = import.meta.env
export default {
  data () {
    return {
      user: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    login () {
      this.$http.post(`${VITE_APP_URL}admin/signin`, this.user)
        .then((res) => {
          const { token, expired } = res.data
          // console.log(token, expired)
          document.cookie = `cherylToken=${token}; expires=${new Date(expired)}`
          this.$router.push('/admin/products')
        })
        .catch((err) => {
          alert(err.response.data.message)
        })
    }
  }
}
</script>
