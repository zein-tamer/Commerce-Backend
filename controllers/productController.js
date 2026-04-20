
const Product = require('../model/product');
const cloudinary = require('../utils/cloudinary'); // تأكد من إعداد cloudinary.config
const fs = require('fs');



// Helper حذف ملف بأمان
const safeDelete = (filePath) => {
    if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};



const createProduct = async (req, res, next) => {
     console.log("البيانات القادمة:", req.body)
        try {
            const { name, price, quantity, description, category } = req.body;

            if (!req.file) {
                return res.status(400).json({ message: 'Image required' });
            }

            if (!name || !price || !quantity || !description || !category) {
                safeDelete(req.file.path);
                return res.status(400).json({ message: 'All fields required' });
            }

            const result = await cloudinary.uploader.upload(req.file.path);
            safeDelete(req.file.path);

            const product = await Product.create({
                name,
                price,
                quantity,
                description,
                category,
                image: result.secure_url,
                cloudinaryId: result.public_id
            });

            res.status(201).json(product);
        } catch (err) {
             if (req.file) safeDelete(req.file.path); // إضافة هذه السطر تضمن نظافة مجلد uploads دائماً
            next(err);
        }
    }

const getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        next(err);
    }
}

const getProductById =  async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product)
            return res.status(404).json({ message: 'Not found' });

        res.json(product);
    } catch (err) {
        next(err);
    }
}


const deleteProduct =async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product)
            return res.status(404).json({ message: 'Not found' });

        await cloudinary.uploader.destroy(product.cloudinaryId);
        await product.deleteOne();

        res.json({ message: 'Deleted successfully' });
    } catch (err) {
         if (req.file) safeDelete(req.file.path); // إضافة هذه السطر تضمن نظافة مجلد uploads دائماً
        next(err);
    }
}


const updateProduct =  async (req, res, next) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product)
            return res.status(404).json({ message: 'Not found' });

        // إذا تم رفع صورة جديدة
        if (req.file) {
            await cloudinary.uploader.destroy(product.cloudinaryId);

            const result = await cloudinary.uploader.upload(req.file.path);
            safeDelete(req.file.path);

            product.image = result.secure_url;
            product.cloudinaryId = result.public_id;
        }

        // تحديث البيانات
        Object.assign(product, req.body);

        await product.save();

        res.json(product);
    } catch (err) {
         if (req.file) safeDelete(req.file.path); // إضافة هذه السطر تضمن نظافة مجلد uploads دائماً
        next(err);
    }
}



module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    deleteProduct,
    updateProduct
};