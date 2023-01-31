import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

let newModal = '';
let productModal = '';
let delModal = '';

createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'cheryl-hexschool',
      tempProduct: {
        imagesUrl: [],
      },
      products: []
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
    // modal.show()
    openModal(event, item) {
      if (event === 'new') {
        // console.log(this.tempProduct);
        newModal.show();
      }else if (event === 'edite') {
        this.tempProduct = { ...item };
        productModal.show();
      }else if (event === 'delete') {
        this.tempProduct = { ...item };
        delModal.show();
        // console.log(this.tempProduct);
      }
    },
    // 取消鈕，modal.hide()
    cancelModal(evt) {
      if (evt === 'product'){
        this.tempProduct = {
          imagesUrl: [],
        };
        productModal.hide();
      }else if (evt === 'new') {
        this.tempProduct = {
          imagesUrl: [],
        };
        newModal.hide();
      }else if (evt === 'delete') {
        this.tempProduct = {
          imagesUrl: [],
        };
        delModal.hide();
      }
    },
    // 建立新產品
    postData() {
      const postUrl = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
      axios.post(postUrl, { data: this.tempProduct })
        .then((res) => {
          alert(res.data.message);
          newModal.hide();
          this.getData();
        })
        .catch((err) => {
          alert(err.response.data.message);
        })
    },
    // 編輯
    editeData() {
      const editeUrl = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
      axios.put(editeUrl, { data: this.tempProduct })
        .then((res) => {
          alert(res.data.message);
          this.tempProduct = {
            imagesUrl: [],
          };
          productModal.hide();
          this.getData();
        })
        .catch((err) => {
          alert(err.response.data.message);
        })
    },
    // 刪除
    deleteData() {
      const deleteUrl = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
      axios.delete(deleteUrl)
        .then((res) => {
          // console.log(res.data);
          alert(res.data.message);
          delModal.hide();
          this.getData();
        })
        .catch((err) => {
          // console.dir(err);
          alert(err.response.data.message);
        })
    },
    createImages() {
      this.tempProduct.imagesUrl.push('');
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

    // Modal
    newModal = new bootstrap.Modal(document.querySelector('#newModal'), {backdrop: 'static', keyboard: false});
    productModal = new bootstrap.Modal(document.querySelector('#productModal'), {backdrop: 'static', keyboard: false});
    delModal = new bootstrap.Modal(document.querySelector('#deleteModal'), {backdrop: 'static', keyboard: false});
  }
}).mount('#app');