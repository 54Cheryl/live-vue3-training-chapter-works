<template>
  <div class="container">
    <div class="row">
      <div class="col px-5 mx-5">
        <img :src="product.imageUrl" alt="" class="img-fluid">
      </div>
      <div class="col-7">
        <h1 class="pb-2">{{ product.title }}</h1>
        <p class="py-2 fs-4">{{ product.description }}</p>
        <p class="py-2 fs-4">{{ product.content }}</p>
        <p class="py-2 fs-4">$ {{ product.price }}</p>
      </div>
    </div>
  </div>
</template>

<script>
const { VITE_APP_URL, VITE_APP_PATH } = import.meta.env
export default {
  data () {
    return {
      product: {}
    }
  },
  methods: {
    getProduct () {
      const { id } = this.$route.params
      this.$http.get(`${VITE_APP_URL}/api/${VITE_APP_PATH}/product/${id}`)
        .then((res) => {
          // console.log(res)
          this.product = res.data.product
        })
    }
  },
  mounted () {
    this.getProduct()
  }
}
</script>
