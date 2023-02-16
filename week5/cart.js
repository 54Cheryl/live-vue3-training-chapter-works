import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'cheryl-hexschool';

Object.keys(VeeValidateRules).forEach(rule => {
  if (rule !== 'default') {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});

// 讀取外部的資源
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

const productModal = {
  props: ['id', 'addToCart', 'openModal'],
  data() {
    return {
      modal: {},
      tempProduct: {},
      qty: 1,
    };
  },
  template: '#userProductModal',
  watch: {
    id() {
      if (this.id) {
        axios.get(`${apiUrl}/api/${apiPath}/product/${this.id}`)
          .then(res => {
            // console.log(res.data.product);
            this.tempProduct = res.data.product;
            this.modal.show();
          })
          .catch(err => {
            console.log(err);
          })
      }
    },
  },
  methods: {
    hide() {
      this.modal.hide();
    }
  }
  ,
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal);
    this.$refs.modal.addEventListener('hidden.bs.modal', (event) => {
      this.openModal('');
    });
  }
};

const app = Vue.createApp({
  data() {
    return {
      products: [],
      productId: '',
      cart: {},
      loadingItem: '',
      user: {
        name: '',
        email: '',
        tel: '',
        address: '',
        message: ''
      }
    }
  },
  methods: {
    getData() {
      axios.get(`${apiUrl}/api/${apiPath}/products/all`)
        .then(res => {
          // console.log(res.data.products);
          this.products = res.data.products;
        })
        .catch(err => {
          console.log(err);
        })
    },
    openModal(id) {
      this.productId = id;
      // console.log(id)
    },
    addToCart(product_id, qty = 1) {
      this.loadingItem = product_id;
      const data = {
        product_id,
        qty
      };
      axios.post(`${apiUrl}/api/${apiPath}/cart`, { data })
      .then(res => {
        // console.log(res.data);
        this.$refs.productModal.hide();
        this.loadingItem = '';
        this.getCarts();
      })
      .catch(err => {
        console.log(err);
      })
    },
    getCarts() {
      axios.get(`${apiUrl}/api/${apiPath}/cart`)
        .then(res => {
          // console.log(res.data);
          this.cart = res.data.data;
        })
        .catch(err => {
          console.log(err);
        })
    },
    updateCartItem(item) {
      const data = {
        product_id: item.product.id,
        qty: item.qty
      };
      // console.log(data, item.id);
      this.loadingItem = item.id;
      axios.put(`${apiUrl}/api/${apiPath}/cart/${item.id}`, {data})
      .then(res => {
        // console.log(res.data);
        this.getCarts();
        this.loadingItem = '';
      })
      .catch(err => {
        console.log(err);
      })
    },
    deleteCartItem(item) {
      this.loadingItem = item.id;
      axios.delete(`${apiUrl}/api/${apiPath}/cart/${item.id}`)
      .then(res => {
        // console.log(res.data);
        this.getCarts();
        this.loadingItem = '';
      })
      .catch(err => {
        console.log(err);
      })
    },
    deleteCarts() {
      axios.delete(`${apiUrl}/api/${apiPath}/carts`)
      .then(res => {
        // console.log(res.data);
        this.getCarts();
      })
      .catch(err => {
        console.log(err);
      })
    },
    isPhone(value) {
      const phoneNumber = /^(09)[0-9]{8}$/
      return phoneNumber.test(value) ? true : '須為正確的手機號碼 (ex：0912345678)'
    },
    onSubmit() {
      console.log('送出表單');
      this.user = {
        name: '',
        email: '',
        tel: '',
        address: '',
        message: ''
      };
      this.getCarts();
    }
  },
  components: {
    productModal,
  },
  mounted() {
    this.getData();
    this.getCarts();
  },
});

app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

app.mount('#app');