import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

createApp({
  data() {
    return {
      user: {
        username: '',
        password: '',
      },
    }
  },
  methods: {
    login() {
      const api = 'https://vue3-course-api.hexschool.io/v2/admin/signin';
      axios.post(api, this.user)
      .then((res) => {
        const { token, expired } = res.data;
                      // 寫入 cookie token   // expires 有效期限
        document.cookie = `cherylToken=${token};expires=${new Date(expired)}`;
        window.location = 'products.html';
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
    },
    returnIndex() {
      window.location = '../index.html';
    }
  },
}).mount('#app');