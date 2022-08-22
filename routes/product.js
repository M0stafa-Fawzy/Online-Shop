const { auth, isVendor } = require('../src/middlewares/auth')
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

router.post("/", auth, isVendor, AddProduct)
router.get("/", auth, isVendor, getProductsPerVendor)
router.get("/all", getAllProducts)
router.post("/upload/:id", auth, upload.array("photos"), uploadMultiPleProductPhotos)
router.route("/:id").get(getSingleProduct).put(auth, isVendor, updateProduct).delete(auth, isVendor, deleteProduct)

module.exports = router