const express = require("express");
const router = express.Router();

const sessions_controller = require("../controllers/sessionsController");
const registrations_controller = require("../controllers/registrationsController");

router.get("/sign_in", sessions_controller.new)
router.post("/sign_in", sessions_controller.create)
router.post("/sign_out", sessions_controller.destroy)

router.post("/", registrations_controller.create)

module.exports = router;