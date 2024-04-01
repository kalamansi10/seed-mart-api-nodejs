const express = require("express");
const router = express.Router();

const shop_controller = require("../controllers/api/v1/shopController");

router.get("/search", shop_controller.search)
// router.get("/items-properties", )
// router.get("/active-banners", )
// router.get("/get-item/:item_id", )

module.exports = router;