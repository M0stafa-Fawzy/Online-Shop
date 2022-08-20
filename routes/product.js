const auth = require('../src/middlewares/auth')
const { upload } = require('../src/middlewares/upload')
const router = require("express").Router()
const { 
    AddProduct,
    getProductsPerVendor,
    getAllProducts,
    getSingleProduct,
    uploadMultiPleProductPhotos,
    updateProduct,
    deleteProduct
} = require("../controllers/product")

router.post("/", auth, AddProduct)
router.post("/", auth, getProductsPerVendor)
router.get("/", getAllProducts)
router.post("/upload/:id", auth, upload.array("photos"), uploadMultiPleProductPhotos)
router.route("/:id").get(getSingleProduct).put(auth, updateProduct).delete(auth, deleteProduct)

module.exports = router