import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

import pagination from './pagination.js';

let newModal = '';
let productModal = '';
let delModal = '';

const app = createApp({
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'cheryl-hexschool',
      isNew: false,
      page: {},
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
    getData(page = 1) { //參數預設值
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/products/?page=${page}`;
      axios.get(url)
        .then((res) => {
          // console.log(res.data);
          this.products = res.data.products;
          this.page = res.data.pagination;
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
        this.isNew = true;
        newModal.show();
      }else if (event === 'edite') {
        this.isNew = false;
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
    // 編輯產品
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
    // 刪除產品
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
    // 新增上傳圖片
    createImages() {
      this.tempProduct.imagesUrl.push('');
    },
    // returnIndex() {
    //   window.location = '../index.html';
    // }
  },
  components: {
    pagination
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
});

app.component('new-modal', {
  props: ['tempProduct', 'postData', 'openModal', 'cancelModal', 'createImages'],
  template:'#new-modal-template',
});
app.component('product-modal', {
  props: ['tempProduct', 'editeData', 'openModal', 'cancelModal', 'createImages'],
  template:'#product-modal-template',
});
app.component('delete-modal', {
  props: ['tempProduct', 'deleteData', 'openModal', 'cancelModal', 'createImages'],
  template:'#delete-modal-template',
});

app.mount('#app');