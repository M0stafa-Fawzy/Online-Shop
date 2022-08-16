const auth = require('../src/middlewares/auth')
const { upload } = require('../src/middlewares/upload')
const router = require("express").Router()
const { 
    AddProduct,
    getProductsPerVendor,
    getAllProducts,
    getSingleProduct,
    uploadProductPhoto,
    updateProduct,
    deleteProduct
} = require("../controllers/product")

router.post("/", auth, AddProduct)
router.post("/", auth, getProductsPerVendor)
router.get("/", getAllProducts)
router.post("/upload", auth, upload.single("photo"), uploadProductPhoto)
router.route("/:id").get(getSingleProduct).put(auth, updateProduct).delete(auth, deleteProduct)

module.exports = router