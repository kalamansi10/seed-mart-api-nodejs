const express = require("express");
const router = express.Router();

const shop_controller = require("../controllers/api/v1/shopController");

router.get("/search", shop_controller.search)
router.get("/items-properties", shop_controller.itemsProperties)
router.get("/active-banners", shop_controller.activeBanners)
router.get("/get-item/:item_id", shop_controller.getItem)

module.exports = router;