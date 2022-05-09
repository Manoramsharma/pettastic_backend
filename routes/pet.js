const express = require("express");
const router = express.Router();
const Controller = require("../controllers/productCtrl");
const auth = require("../middlewares/auth");
const Pet = require("../models/petModel");

router.put("/product", auth, Controller.uploadProduct);
router.post("/addtocart/:id", auth, Controller.addToCart);
router.get("/cart", auth, Controller.getCart);

module.exports = router;
