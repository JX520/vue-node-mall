var express = require('express');
var router = express.Router();
require('./../../src/util/time')

var User = require('./../models/user')
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});


//用户登录
router.post('/login', (req, res, next) => {
  var param = {
    userName: req.body.userName,
    userPwd: req.body.userPwd,
  }

  User.findOne(param, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: 'err.message'
      })
    } else {
      if (doc) {
        res.cookie('userId', doc.userId, {
          path: '/',
          maxAge: 1000 * 60 * 60 * 3
        });
        res.cookie('userName', doc.userName, {
          path: '/',
          maxAge: 1000 * 60 * 60 * 3
        });
        res.json({
          status: '0',
          msg: '',
          result: {
            userName: doc.userName
          }
        })
      }

    }
  })
});

//用户登出
router.post('/logout', (req, res, next) => {
  res.cookie('userId', '', {
    path: '/',
    maxAge: -1
  });
  res.cookie('userName', '', {
    path: '/',
    maxAge: -1
  });

  res.json({
    status: '0',
    msg: '',
    result: ''
  })
});

//查询登录缓存
router.get('/checkLogin', (req, res, next) => {
  if (req.cookies.userId) {
    res.json({
      status: '0',
      msg: '',
      result: req.cookies.userName || '',
    })
  } else {
    res.json({
      status: '1',
      msg: '未登录！',
      result: ''
    })
  }
})

//获取购物车列表
router.get('/cartList', (req, res, next) => {
  var userId = req.cookies.userId;
  User.findOne({ userId: userId }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      if (doc) {
        res.json({
          status: '0',
          msg: '',
          result: doc.cartList
        })
      }

    }
  })
})

//获取购物车商品数量
router.get('/getCartCount', (req, res, next) => {
  var userId = req.cookies.userId;
  User.findOne({ userId: userId }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      var cartList = doc.cartList;
      let cartCount = 0;
      cartList.forEach((item)=>{
        cartCount += parseInt(item.productNum);
      });
      res.json ({
        status:'0',
        msg:'',
        result:cartCount,
      })

    }
  })
})

//删除购物车
router.post('/cartDel', (req, res, next) => {
  var userId = req.cookies.userId, productId = req.body.productId;
  User.update({ userId: userId }, { $pull: { 'cartList': { 'productId': productId } } }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: '删除商品成功！'
      })
    }
  });

});

//更新购物车数量
router.post('/editCart', (req, res, next) => {
  var userId = req.cookies.userId,
    productId = req.body.productId,
    productNum = req.body.productNum,
    checked = req.body.checked;
  User.update({
    'userId': userId,
    'cartList.productId': productId
  }, {
    'cartList.$.productNum': productNum
    ,
    'cartList.$.checked': checked
  }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: '更新购物车数量成功！'
      })
    }
  })
})


//购物车全选
router.post('/editCheckAll', (req, res, next) => {
  var userId = req.cookies.userId,
    checkAll = req.body.checkAll;
  console.log('tag', checkAll);
  User.findOne({ userId: userId }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      if (doc) {
        doc.cartList.forEach((item) => {
          item.checked = checkAll;
        })
        doc.save((err1, doc1) => {
          if (err1) {
            res.json({
              status: '1',
              msg: err1.message,
              result: ''
            })
          } else {
            res.json({
              status: '0',
              msg: '',
              result: '购物车选择更新成功！'
            })
          }
        })
      }

    }
  })
})


//地址查询
router.get('/addressList', (req, res, next) => {
  var userId = req.cookies.userId;
  User.findOne({ userId: userId }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      if (doc) {
        res.json({
          status: '0',
          msg: '',
          result: doc.addressList
        })
      }
    }
  })
})

//设置默认地址
router.post('/setDefault', (req, res, next) => {
  var userId = req.cookies.userId,
    addressId = req.body.addressId;
  User.findOne({ userId: userId }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      var addressList = doc.addressList;
      addressList.forEach((item) => {
        if (item.addressId == addressId) {
          item.isDefault = true;
        } else {
          item.isDefault = false;
        }
      });
      doc.save((err1, doc1) => {
        if (err1) {
          res.json({
            status: '1',
            msg: err1.message,
            result: ''
          })
        } else {
          res.json({
            status: '0',
            msg: '',
            result: ''
          })
        }
      })
    }
  })
})

//删除地址
router.post('/delAddress', (req, res, next) => {
  var userId = req.cookies.userId,
    addressId = req.body.addressId;
  User.update({
    userId: userId
  }, {
    $pull: {
      'addressList': {
        'addressId': addressId
      }
    }
  }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: '删除地址成功！'
      })
    }
  });
})


//订单支付准备
router.post('/pay', (req, res, next) => {
  var userId = req.cookies.userId,
    addressId = req.body.addressId,
    orderTotal = req.body.orderTotal,
    address = '',
    goodsList = [];

  User.findOne({ userId: userId }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      //获取下单时选择的地址

      doc.addressList.forEach((item) => {
        if (addressId == item.addressId) {
          address = item;
        }
      });

      //获取购买的商品信息

      doc.cartList.filter((item) => {
        if (item.checked == '1') {
          goodsList.push(item);
        }
      });

      var platform = '666'
      var r1 = Math.floor(Math.random() * 10);
      var r2 = Math.floor(Math.random() * 10);
      var date = new Date().Format('yyyyMMddhhmmss');
      var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
      var orderId = platform + r1 + date + r2;
      //创建订单
      var order = {
        orderId: orderId,
        orderTotal: orderTotal,
        addressInfo: address,
        goodsList: goodsList,
        orderStatus: '1',
        createDate: createDate,
      }

      doc.orderList.push(order);
      doc.save((err1, doc1) => {
        if (err1) {
          res.json({
            status: '1',
            msg: err1.message,
            result: ''
          });
        } else {
          res.json({
            status: '0',
            msg: '',
            result: {
              order: order
            }
          })
        }
      })


    }
  })
})

//根据订单id查询订单信息
router.get('/orderDetail', (req, res, next) => {
  var userId = req.cookies.userId,
    orderId = req.param('orderId');

  User.findOne({ userId: userId }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      var orderList = doc.orderList,
        orderTotal = 0;

      if (orderList.length > 0) {
        orderList.forEach((item) => {
          if (item.orderId == orderId) {
            orderTotal = item.orderTotal
          }

        });
        if (orderTotal > 0) {
          res.json({
            status: '0',
            msg: '',
            result: {
              orderTotal: orderTotal,
              orderId: orderId,

            }
          })
        } else {
          res.json({
            status: '0400',
            msg: '订单金额不对！',
            result: ''
          })
        }

      } else {
        res.json({
          status: '0404',
          msg: '无该订单记录！',
          result: ''
        })
      }
    }
  })
})

//支付完成后删除购物车商品
router.get('/delFinishCart', (req, res, next) => {
  var userId = req.cookies.userId,
    orderId = req.param('orderId');
  User.findOne({ userId: userId }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      var productId = [],
        orderList = doc.orderList;
        
      if (orderList.length > 0) {
        orderList.forEach((item)=>{
          if (item.orderId == orderId) {
            orderList = item;
            var goodsList = orderList.goodsList;
            if (item.orderStatus == '1') {
              goodsList.forEach((item1) => {
                productId.push(item1.productId);
              })
            }
          }
          
        });

        res.json({
          status: '0',
          msg: '',
          result: {
            productId:productId
          }
        })
        
      }
      
    }
  })
})



module.exports = router;
