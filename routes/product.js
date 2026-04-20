const router = require('express').Router();
const { upload, validateImage, handleMulterError } = require('../utils/multer');
const {createProduct, getAllProducts, getProductById, deleteProduct, updateProduct } = require('../controllers/productController');
const cloudinary = require('../utils/cloudinary');
const Product = require('../model/product');
const fs = require('fs');



// CREATE PRODUCT

router.post(
    '/upload',
    upload,
    handleMulterError,
    validateImage,
    createProduct
)


// GET ALL

router.get('/', getAllProducts);


// GET BY ID

router.get('/:id', getProductById);


// DELETE

router.delete('/:id', deleteProduct);


// UPDATE

router.put('/:id', upload, validateImage, handleMulterError, updateProduct);

module.exports = router;
