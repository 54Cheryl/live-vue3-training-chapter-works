<template>
  <div>
    <table>
      <thead>
        <tr>
          <th class="h5 pb-2 w-25">產品名稱</th>
          <th class="h5 pb-2 w-25">產品圖片</th>
          <th class="h5 pb-2 w-25">產品價格</th>
          <th class="h5 pb-2 w-25">完整產品資訊</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td class="pb-2 w-25">{{ product.title }}</td>
          <td class="pb-2 w-25">
            <img :src="product.imageUrl" alt="" class="img-fluid" width="150">
          </td>
          <td class="pb-2 w-25">$ {{ product.price }}</td>
          <td class="pb-2 w-25">
            <router-link :to="`/product/${product.id}`"
            class="btn btn-outline-secondary me-1"
            >查看細節</router-link>
            <button class="btn btn-primary ms-1" @click="addToCart(product.id)">加入購物車</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { RouterLink } from 'vue-router'
const { VITE_APP_URL, VITE_APP_PATH } = import.meta.env

export default {
  data () {
    return {
      products: []
    }
  },
  components: {
    RouterLink
  },
  methods: {
    getProducts () {
      this.$http.get(`${VITE_APP_URL}/api/${VITE_APP_PATH}/products/all`)
        .then((res) => {
          // console.log(res)
          this.products = res.data.products
        })
    },
    addToCart (id) {
      const data = {
        product_id: id,
        qty: 1
      }
      this.$http.post(`${VITE_APP_URL}/api/${VITE_APP_PATH}/cart`, { data })
        .then(res => {
          // console.log(res)
          alert(res.data.message)
          // this.getCarts();
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  mounted () {
    this.getProducts()
  }
}
</script>
