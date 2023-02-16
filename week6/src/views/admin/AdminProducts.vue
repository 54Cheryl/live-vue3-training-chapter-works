<template>
  <div class="container">
    <div class="row py-3">
      <div class="col">
        <h2>產品列表</h2>
        <!-- 產品列表 -->
        <table class="table table-hover mt-4">
          <thead>
            <tr>
              <th width="120">分類</th>
              <th width="150">產品名稱</th>
              <th width="120">
                原價
              </th>
              <th width="120">
                售價
              </th>
              <th width="150">
                是否啟用
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item) in products" v-bind:key="item.id">
              <td width="120">{{ item.category }}</td>
              <td width="150">{{ item.title }}</td>
              <td width="120">
                {{ item.origin_price }}
              </td>
              <td width="120">
                {{ item.price }}
              </td>
              <td width="150">
                <span class="text-success" v-if="item.is_enabled">啟用</span>
                <span v-else>未啟用</span>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="row">
          <div class="col">
            <Pagination :pages="pagination" @change-page="getData"></Pagination>
          </div>
          <div class="col">
            <p class="text-end">本頁有 <span>{{ products.length }}</span> 項產品</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/PaginationView.vue'
const { VITE_APP_URL, VITE_APP_PATH } = import.meta.env
export default {
  props: ['token'],
  data () {
    return {
      products: [],
      pagination: {}
    }
  },
  methods: {
    // #5 取得後台產品列表
    getData (page = 1) { // 參數預設值
      this.$http.get(`${VITE_APP_URL}api/${VITE_APP_PATH}/admin/products/?page=${page}`)
        .then((res) => {
          // console.log(res.data);
          this.products = res.data.products
          this.pagination = res.data.pagination
        })
        .catch((err) => {
          // console.dir(err);
          alert(err.response.data.message)
        })
    }
  },
  components: {
    Pagination
  },
  mounted () {
    this.getData()
  }
}
</script>
