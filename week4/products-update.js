import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

import pagination from './components/pagination.js';

const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'cheryl-hexschool';

let productModal = '';
let delModal = '';

const app = createApp({
  data() {
    return {
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
      const url = `${apiUrl}/api/user/check`;
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
      const url = `${apiUrl}/api/${apiPath}/admin/products/?page=${page}`;
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
        this.tempProduct = { imagesUrl: [] };
        productModal.show();
      }else if (event === 'edit') {
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
    cancelModal(ent) {
      if (ent === 'del') {
        this.tempProduct = { imagesUrl: [] };
        delModal.hide();
      } else {
        this.tempProduct = { imagesUrl: [] };
        productModal.hide();
      }
    },
    // 建立新產品
    updateData() {
      let api = `${apiUrl}/api/${apiPath}/admin/product`;
      let apiMethod = 'post';
      if (!this.isNew) {
        api = `${apiUrl}/api/${apiPath}/admin/product/${this.tempProduct.id}`;
        apiMethod = 'put';
      }
      axios[apiMethod](api, { data: this.tempProduct })
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
      const deleteUrl = `${apiUrl}/api/${apiPath}/admin/product/${this.tempProduct.id}`;
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
    productModal = new bootstrap.Modal(document.querySelector('#productModal'), {backdrop: 'static', keyboard: false});
    delModal = new bootstrap.Modal(document.querySelector('#deleteModal'), {backdrop: 'static', keyboard: false});
  }
});

app.component('product-modal', {
  props: ['isNew', 'tempProduct', 'updateData', 'openModal', 'cancelModal', 'createImages'],
  template:'#product-modal-template',
});
app.component('delete-modal', {
  props: ['isNew', 'tempProduct', 'deleteData', 'openModal', 'cancelModal', 'createImages'],
  template:'#delete-modal-template',
});

app.mount('#app');