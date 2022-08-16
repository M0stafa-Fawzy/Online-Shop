const auth = require('../src/middlewares/auth')
const router = require('express').Router()
const { 
    makeAnOrder,
    getOrders,
    addToCart,
    deleteCart
} = require("../controllers/order")

router.use(auth)
router.post("/", makeAnOrder)
router.get("/", getOrders)
router.route("/id").post(addToCart).delete(deleteCart)

module.exports = router