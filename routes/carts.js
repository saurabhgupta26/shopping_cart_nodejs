var express = require("express");
var router = express.Router();
var Admin = require("../models/admin");
var Product = require('../models/product');
var auth = require('../middleware/auth');
var Cart = require('../models/cart');
var multer = require('multer');
var path = require('path');

router.use(auth.loggedUser);

router.get("/:productId/shoppingBasket/add", auth.loggedUser ,async function (req, res, next) {
    try {
      var productId = req.params.productId;
      var cart = await Cart.findOne({userId: req.user, product: productId});
      console.log(cart, "CART")
  
      if(cart) {
        cart = await Cart.findByIdAndUpdate(cart.id, {$inc: {quantity: 1}});
      } else {
        var itemObj = {
          product: productId,
          userId: req.user,
          quantity: 1
        }
        cart = await Cart.create(itemObj);
        var user = await User.findByIdAndUpdate(req.user, {$push: {cartItems: cart.id}},{new:true});
        console.log(user, "Product added");
      }
    //   res.redirect("/users/shoppingBasket");
      
    } catch (error) {
      next(error);
    }
  });

module.exports = router;