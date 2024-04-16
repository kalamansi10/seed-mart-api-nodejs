const express = require("express");
const router = express.Router();

const shop_controller = require("../controllers/api/v1/shopController");
const cart_controller = require("../controllers/api/v1/cartController");
const user_controller = require("../controllers/api/v1/userController");
const order_controller = require("../controllers/api/v1/orderController");

// Shop item/s queries
router.get("/search", shop_controller.search)
router.get("/items-properties", shop_controller.itemsProperties)
router.get("/active-banners", shop_controller.activeBanners)
router.get("/get-item/:item_id", shop_controller.getItem)

// User carted items & options
router.get("/get-cart", cart_controller.getCart)
router.get("/get-for-checkout", cart_controller.getForCheckout)
router.post("/add-to-cart", cart_controller.addToCart)
router.put("/update-carted-amount/:carted_id/:amount", cart_controller.updateCartedAmount)
router.put("/update-checkout-status/:carted_id/:is_for_checkout", cart_controller.updateCheckoutStatus)
router.delete("/remove-from-cart/:carted_id", cart_controller.removeFromCart)

// User shipping address & options
router.get("/get-shipping-addresses", user_controller.getShippingAddress)
router.post("/add-shipping-address", user_controller.addShippingAddress)
router.put("/update-shipping-address", user_controller.updateShippingAddress)
router.delete("/remove-shipping-address/:shipping_address_id", user_controller.removeShippingAddress)

// get "/get-payment-methods", to: "user#get_payment_methods"
// post "/add-payment-method", to: "user#add_payment_method"
// put "/update-payment-method", to: "user#update_payment_method"
// delete "/remove-payment-method/:payment_method_id", to: "user#remove_payment_method"

// router.get("/get-orders", user_controller.getOrders)
// router.get("/get-order", user_controller.getOrder)

router.post("/order", order_controller.processOrder)

module.exports = router;