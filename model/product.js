const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'اسم المنتج مطلوب'], 
        trim: true 
    },
    price: { 
        type: Number, 
        required: [true, 'سعر المنتج مطلوب'], 
        min: [0.01, 'السعر يجب أن يكون رقماً موجباً']
    },
    quantity: { 
        type: Number, 
        required: [true, 'الكمية مطلوبة'], 
        min: [0, 'الكمية لا يمكن أن تكون أقل من صفر'],
        default: 0
    },
    description: { 
        type: String, 
        required: [true, 'وصف المنتج مطلوب'],
        trim: true 
    },
    category: { 
        type: String, 
        required: [true, 'يجب تحديد القسم'],
        index: true // يحسن سرعة البحث عند الفلترة حسب القسم
    },
    image: { 
        type: String, 
        required: [true, 'رابط الصورة مطلوب'] 
    },
    cloudinaryId: { 
        type: String, 
        required: [true, 'معرف الصورة (Cloudinary ID) مطلوب'] 
    }
}, { 
    timestamps: true // يضيف createdAt و updatedAt تلقائياً
});

module.exports = mongoose.model('Product', productSchema);
