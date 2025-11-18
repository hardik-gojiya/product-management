import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'User ID is required'],
    ref: 'User' // Reference to User model
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    minlength: [2, 'Product name must be at least 2 characters'],
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    enum: {
      values: ['Electronics', 'Clothing', 'Food', 'Books', 'Home', 'Sports', 'Other'],
      message: '{VALUE} is not a valid category'
    }
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields automatically
});

// Index for faster queries by userId
productSchema.index({ userId: 1 });

// Index for category-based filtering
productSchema.index({ category: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;