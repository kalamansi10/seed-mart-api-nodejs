const express = require("express");
const router = express.Router();

const item_controller = require("../controllers/api/v1/itemController");
const cart_controller = require("../controllers/api/v1/cartController");
const account_controller = require("../controllers/api/v1/accountController");
const order_controller = require("../controllers/api/v1/orderController");
const review_controller = require("../controllers/api/v1/reviewController");
const misc_controller = require("../controllers/api/v1/miscController");

// Shop item/s queries
router.get("/item/search", item_controller.searchItems)
router.get("/item/:item_id", item_controller.getItem)

// User carted items & options
router.get("/cart", cart_controller.getCart)
router.get("/cart/for-checkout", cart_controller.getForCheckout)
router.post("/cart", cart_controller.addToCart)
router.put("/cart/update-amount/:carted_id/:amount", cart_controller.updateCartedAmount)
router.put("/cart/update-status/:carted_id/:is_for_checkout", cart_controller.updateCheckoutStatus)
router.delete("/cart/:carted_id", cart_controller.removeFromCart)

// User shipping address & options
router.get("/account/shipping-address/list", account_controller.getShippingAddressList)
router.post("/account/shipping-address", account_controller.addShippingAddress)
router.put("/account/shipping-address", account_controller.updateShippingAddress)
router.delete("/account/shipping-address/:shipping_address_id", account_controller.removeShippingAddress)

// get "/get-payment-methods", to: "user#get_payment_methods"
// post "/add-payment-method", to: "user#add_payment_method"
// put "/update-payment-method", to: "user#update_payment_method"
// delete "/remove-payment-method/:payment_method_id", to: "user#remove_payment_method"

// Order processing and fetching
router.get("/order/list", order_controller.getOrderList)
router.get("/order/:reference_id", order_controller.getOrder)
router.post("/order", order_controller.processOrder)
router.post("/order/status", order_controller.updateOrderStatus)

// Order review actions
router.get("/review/list/:item_id", review_controller.getReviewList)
router.get("/review/:order_id", review_controller.getReview)
router.post("/review", review_controller.addReview)
router.put("/review/:review_id", review_controller.editReview)
router.delete("/review/:review_id", review_controller.deleteReview)

// Misc endpoints
router.get("/misc/active-banners", misc_controller.getActiveBanners)
router.get("/misc/item-properties", misc_controller.getItemProperties)

module.exports = router;