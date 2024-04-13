const express = require("express");
const router = express.Router();

const shop_controller = require("../controllers/api/v1/shopController");
const cart_controller = require("../controllers/api/v1/cartController");

router.get("/search", shop_controller.search)
router.get("/items-properties", shop_controller.itemsProperties)
router.get("/active-banners", shop_controller.activeBanners)
router.get("/get-item/:item_id", shop_controller.getItem)

router.get("/get-cart", cart_controller.getCart)
router.get("/get-for-checkout", cart_controller.getForCheckout)
router.post("/add-to-cart", cart_controller.addToCart)
router.put("/update-carted-amount/:carted_id/:amount", cart_controller.updateCartedAmount)
router.put("/update-checkout-status/:carted_id/:is_for_checkout", cart_controller.updateCheckoutStatus)
router.delete("/remove-from-cart/:carted_id", cart_controller.removeFromCart)

module.exports = router;