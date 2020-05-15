var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');

//连接Mongodb数据库
mongoose.connect('mongodb://127.0.0.1:27017/mall',{useMongoClient: true});

mongoose.connection.on('connected', () => {
    console.log('connected success!')
});

mongoose.connection.on('error', () => {
    console.log('connected fail!')
});

mongoose.connection.on('disconnected', () => {
    console.log('connected disconnected!')
});


//查询商品
router.get('/list', (req, res, next) => {
    let page = parseInt(req.param('page'));//获取页数
    let pageSize = parseInt(req.param('pageSize'));//获取每页数量
    let sort = req.param('sort');
    let priceLevel = req.param('priceLevel');
    let skip = (page - 1) * pageSize;
    var priceGt = '', priceLte = '';
    let params = {};
    if (priceLevel != 'All') {
        switch (priceLevel) {
            case '0': priceGt = 0; priceLte = 500; break;
            case '1': priceGt = 500; priceLte = 1000; break;
            case '2': priceGt = 1000; priceLte = 3000; break;
            case '3': priceGt = 3000; priceLte = 5000; break;
        }
        params = {
            salePrice: {
                $gt: priceGt,
                $lte: priceLte,
            }
        }
    }

    let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
    goodsModel.sort({ 'salePrice': sort });
    goodsModel.exec((err, doc) => {
        if (err) {
            res.json({
                status: '1',
                msg: err.message,

            });

        } else (
            res.json({
                status: '0',
                msg: '',
                result: {
                    count: doc.length,
                    list: doc
                }
            })
        )
    })
});


//加购物车
router.post('/addCart', (req, res, next) => {
    var userId = 100000077, productId = req.body.productId;
    var User = require('../models/user');
    User.findOne({ userId: userId }, (err, userDoc) => {
        if (err) {
            res.json({
                status: '1',
                msg: err.message
            })
        } else {
            if (userDoc) {
                let goodsItem = '';
                userDoc.cartList.forEach((item)=>{
                    if(item.productId == productId){
                        goodsItem = item;
                        item.productNum ++;
                    }
                });
                if(goodsItem){
                    userDoc.save((err2, doc2) => {
                        if (err2) {
                            res.json({
                                status: '1',
                                msg: err2.message
                            })
                        } else {
                            res.json({
                                status: "0",
                                msg: '',
                                result: 'success'
                            })
                        }
                    })
                }
                Goods.findOne({ productId: productId }, (err1, doc1) => {
                    if (err1) {
                        res.json({
                            status: '1',
                            msg: err1.message
                        })
                    } else {
                        if (doc1) {

                            // 新创建一个对象，实现转换mongoose不能直接增加属性的坑
                               var  newobj = { 
                                    productId: doc1.productId,
                                    producName: doc1.producName,
                                    salePrice: doc1.salePrice,
                                    productName: doc1.productName,
                                    productImage: doc1.productImage,
                                    productNum: "1",
                                    checked: "1",
                                  }

                            userDoc.cartList.push(newobj);

                            userDoc.save((err2, doc2) => {
                                // if (err2) {
                                //     res.json({
                                //         status: '1',
                                //         msg: err2.message
                                //     })
                                //     return;
                                // } else {
                                //     res.json({
                                //         status: "0",
                                //         msg: '',
                                //         result: 'success'
                                //     })
                                     
                                // }
                            })
                        }
                    }
                })
            }
        }
    })
    
})

module.exports = router