import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'cheryl-hexschool',
      tempProduct: {},
      products: [],
    }
  },
  methods: {
    // #4  確認是否登入
    checkLogin() {
      const url = `${this.apiUrl}/api/user/check`;
      axios.post(url)
        .then(() => {
          this.getData();
        })
        .catch((err) => {
          alert(err.response.data.message)
          window.location = 'login.html';
        })
    },
    // #5 取得後台產品列表
    getData() {
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/products`;
      axios.get(url)
        .then((res) => {
          // console.log(res.data);
          this.products = res.data.products;
        })
        .catch((err) => {
          // console.dir(err);
          alert(err.response.data.message);
        })
    },
    prodDetail(item) {
      this.tempProduct = item;
    },
    returnIndex() {
      window.location = '../index.html';
    }
  },
  mounted() {
    // 取出 Token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)cherylToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    
    axios.defaults.headers.common.Authorization = token;

    this.checkLogin();
  }
}).mount('#app');