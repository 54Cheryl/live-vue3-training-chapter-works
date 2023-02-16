<template>
  <div>
    購物車頁
    <br>
    <div class="text-end">
      <button class="btn btn-outline-danger" type="button" @click="deleteCarts()">清空購物車</button>
    </div>
    <table class="table align-middle">
      <thead>
        <tr>
          <th></th>
          <th>品名</th>
          <th style="width: 150px">數量/單位</th>
          <th class="text-end">單價</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="cart.carts">
          <tr v-for="item in cart.carts" :key="item.id">
            <td>
              <button type="button" class="btn btn-outline-danger btn-sm"
                @click="deleteCartItem(item)" :disabled="item.id === loadingItem">
                <i class="fas fa-spinner fa-pulse" v-if="loadingItem === item.id"></i>
                x
              </button>
            </td>
            <td>
              {{ item.product.title }}
            </td>
            <td>
              <div class="input-group input-group-sm">
                <select name="" id="" class="form-select"
                  v-model="item.qty" @change="updateCartItem(item)" :disabled="item.id === loadingItem">
                  <option :value="i" v-for="i in 20" :key="`${i}45678`">{{i}}</option>
                </select>
              </div>
            </td>
            <td class="text-end">
              <small class="text-success" v-if="item.product.price !== item.product.origin_price">折扣價：</small>
              {{ item.total }}
            </td>
          </tr>
        </template>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3" class="text-end">總計</td>
          <td class="text-end">$ {{ cart.total }}</td>
        </tr>
        <tr>
          <td colspan="3" class="text-end text-success">折扣價</td>
          <td class="text-end text-success">$ {{ cart.final_total }}</td>
        </tr>
      </tfoot>
    </table>
  </div>
  <div class="my-5 row justify-content-center">
    <VForm ref="form" class="col-md-6" v-slot="{ errors }" @submit="onSubmit">
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <VField
          id="email"
          name="email"
          type="email"
          class="form-control"
          placeholder="請輸入 Email"
          :class="{ 'is-invalid': errors['email'] }"
          rules="email|required"
          v-model="user.email"
        ></VField>
        <ErrorMessage name="email" class="invalid-feedback"></ErrorMessage>
      </div>

      <div class="mb-3">
        <label for="name" class="form-label">收件人姓名</label>
        <VField
          id="name"
          name="姓名"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors['姓名'] }"
          placeholder="請輸入姓名"
          rules="required"
          v-model="user.name"
        ></VField>
        <ErrorMessage name="姓名" class="invalid-feedback"></ErrorMessage>
      </div>

      <div class="mb-3">
        <label for="tel" class="form-label">收件人電話</label>
        <VField
          id="tel"
          name="電話"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors['電話'] }"
          placeholder="請輸入手機號碼"
          :rules="isPhone"
          v-model="user.tel"
        ></VField>
        <ErrorMessage name="電話" class="invalid-feedback"></ErrorMessage>
      </div>

      <div class="mb-3">
        <label for="address" class="form-label">收件人地址</label>
        <VField
          id="address"
          name="地址"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors['地址'] }"
          placeholder="請輸入地址"
          rules="required"
          v-model="user.address"
        ></VField>
        <ErrorMessage name="地址" class="invalid-feedback"></ErrorMessage>
      </div>

      <div class="mb-3">
        <label for="message" class="form-label">留言</label>
        <textarea
          id="message"
          class="form-control"
          cols="30"
          rows="10"
          v-model="user.message"
        ></textarea>
      </div>
      <div class="text-end">
        <button type="submit" class="btn btn-danger">送出訂單</button>
      </div>
    </VForm>
  </div>
</template>

<script>
const { VITE_APP_URL, VITE_APP_PATH } = import.meta.env

export default {
  data () {
    return {
      products: [],
      productId: '',
      cart: {},
      user: {
        name: '',
        email: '',
        tel: '',
        address: '',
        message: ''
      },
      loadingItem: ''
    }
  },
  methods: {
    getCarts () {
      this.$http.get(`${VITE_APP_URL}/api/${VITE_APP_PATH}/cart`)
        .then(res => {
          // console.log(res.data)
          this.cart = res.data.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    updateCartItem (item) {
      const data = {
        product_id: item.product.id,
        qty: item.qty
      }
      // console.log(data, item.id);
      this.loadingItem = item.id
      this.$http.put(`${VITE_APP_URL}/api/${VITE_APP_PATH}/cart/${item.id}`, { data })
        .then(res => {
        // console.log(res.data);
          this.getCarts()
          this.loadingItem = ''
        })
        .catch(err => {
          console.log(err)
        })
    },
    deleteCartItem (item) {
      this.loadingItem = item.id
      this.$http.delete(`${VITE_APP_URL}/api/${VITE_APP_PATH}/cart/${item.id}`)
        .then(res => {
        // console.log(res.data);
          this.getCarts()
          this.loadingItem = ''
        })
        .catch(err => {
          console.log(err)
        })
    },
    deleteCarts () {
      this.$http.delete(`${VITE_APP_URL}/api/${VITE_APP_PATH}/carts`)
        .then(res => {
        // console.log(res.data);
          this.getCarts()
        })
        .catch(err => {
          console.log(err)
        })
    },
    isPhone (value) {
      const phoneNumber = /^(09)[0-9]{8}$/
      return phoneNumber.test(value) ? true : '須為正確的手機號碼 (ex：0912345678)'
    },
    onSubmit () {
      console.log('送出表單')
      this.user = {
        name: '',
        email: '',
        tel: '',
        address: '',
        message: ''
      }
      this.getCarts()
    }
  },
  mounted () {
    this.getCarts()
  }
}
</script>
