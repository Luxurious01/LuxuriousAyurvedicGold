const express = require('express');
const Order = require("../models/order");
const router = express.Router();
const requireLogin = require('../middleware/requireLogin');
const userMiddler = require('../middleware/userMiddler');
const Cart = require('../models/cart');


router.post('/addOrder',requireLogin,userMiddler, (req, res) => {
    Cart.deleteOne({ user: req.user._id }).exec((error, result) => {
      if (error) return res.status(400).json({ error });
      if (result) {
        req.body.user = req.user._id;
        req.body.orderStatus = [
          {
            type: "ordered",
            date: new Date(),
            isCompleted: true,
          },
          {
            type: "packed",
            isCompleted: false,
          },
          {
            type: "shipped",
            isCompleted: false,
          },
          {
            type: "delivered",
            isCompleted: false,
          },
        ];
        const order = new Order(req.body);
        order.save((error, order) => {
          if (error) return res.status(400).json({ error });
          if (order) {
            res.status(201).json({ order });
          }
        });
      }
    });
  });




router.get ('/getOrder' ,requireLogin,userMiddler, (req, res) => {
    Order.find({ user: req.user._id })
      .select("_id paymentStatus paymentType orderStatus items")
      .populate("items.productId", "_id name productPictures")
      .exec((error, orders) => {
        if (error) return res.status(400).json({ error });
        if (orders) {
          res.status(200).json({ orders });
        }
      });
});

module.exports = router;