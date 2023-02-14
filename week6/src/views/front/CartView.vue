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
</template>

<script>
const { VITE_APP_URL, VITE_APP_PATH } = import.meta.env

export default {
  data () {
    return {
      products: [],
      productId: '',
      cart: {},
      user: {}
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
      return phoneNumber.test(value) ? true : '需要正確的電話號碼'
    },
    onSubmit () {
      console.log('送出表單')
    }
  },
  mounted () {
    this.getCarts()
  }
}
</script>
