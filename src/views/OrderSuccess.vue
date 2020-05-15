<template>
  <div>
    <nav-header></nav-header>
    <div class="container">
      <div class="page-title-normal">
        <h2 class="page-title-h2"><span>支付结果</span></h2>
      </div>
      <!-- 进度条 -->
      <div class="check-step">
        <ul>
          <li class="cur"><span>确认</span> 地址</li>
          <li class="cur"><span>确认 </span> 订单</li>
          <li class="cur"><span>确认</span> 付款</li>
          <li class="cur"><span>支付</span> 成功</li>
        </ul>
      </div>

      <div class="order-create">
        <div class="order-create-pic"><img src="/static/ok-2.png" alt=""></div>
        <div class="order-create-main">
          <h3>祝贺<br>您的订单已支付完成！</h3>
          <p>
            <span>订单编号：{{orderId}}</span>
            <span>支付金额：{{orderTotal | currency('￥')}}</span>
          </p>
          <div class="order-create-btn-wrap">
            <div class="btn-l-wrap">
              <router-link class="btn btn--m" to="/cart">前往购物车</router-link>
            </div>
            <div class="btn-r-wrap">
              <router-link class="btn btn--m" to="/">首页</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <nav-footer></nav-footer>
  </div>
</template>
<script>
  import NavHeader from "./../components/Header";
  import NavFooter from "./../components/Footer.vue";
  import NavBread from "./../components/Bread.vue";
  import Modal from "./../components/Modal.vue";
  import axios from "axios";

  export default {
    data() {
      return {
        orderId: '',
        orderTotal: 0,
        productId: [],
      }
    },

    components: {
      NavHeader,
      NavFooter,
      NavBread,
      Modal
    },

    mounted() {
      this.init();
    },
    methods: {
      init() {
        var orderId = this.$route.query.orderId;
        if (!orderId) {
          return
        } else {
          axios.get('/users/orderDetail', {
            params: {
              orderId: orderId
            }
          }).then((response) => {
            let res = response.data;
            if (res.status == '0') {
              //this.delCart();
              this.orderId = orderId;
              this.orderTotal = res.result.orderTotal;

            }
          })
        }

      },

      delCart() {

        var orderId = this.$route.query.orderId;
        axios.get('/users/delFinishCart', {
          params: {
            orderId: orderId
          }
        }).then((response) => {
          let res = response.data;
          if (res.status == '0') {
            this.productId = res.result.productId;
            var productId = this.productId;
            if (productId.length > 0) {
              productId.forEach((item) => {
                axios.post('/users/cartDel', {
                  productId: item
                }).then((response) => {
                  let res = response.data;
                  if (res.status == '0') {
                    console.log('支付成功后删除购物车成功！')
                  }
                })
              })
            }


          }


        })


      }
    },
  }
</script>