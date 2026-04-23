require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'amigo_super_secret_key_2026';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Mongoose Schemas
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password_hash: String,
    oldId: Number // Legacy SQLite ID
});
const User = mongoose.model('User', userSchema);

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    image_url: String,
    category: String,
    description: String,
    product_info: String,
    reviews: [{
        author: String,
        rating: Number,
        text: String
    }],
    product_care: String,
    oldId: Number // Legacy SQLite ID
});
const Product = mongoose.model('Product', productSchema);

const cartItemSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
    size: String
});
const CartItem = mongoose.model('CartItem', cartItemSchema);

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas.'))
    .catch(err => console.error('MongoDB connection error:', err));


// Auth Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// --- API Routes ---

// Register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password_hash: hashedPassword
        });
        
        const userPayload = { id: newUser._id, email };
        const token = jwt.sign(userPayload, JWT_SECRET);
        
        res.status(201).json({ 
            token, 
            user: { id: newUser._id, firstName, lastName, email } 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET);
        res.json({ 
            token, 
            user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email } 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Get Products (supports ?sort=price_asc|price_desc|newest|name&category=coats)
app.get('/api/products', async (req, res) => {
    try {
        const { sort, category } = req.query;
        let filter = {};
        if (category && category !== 'all') {
            filter.category = { $regex: new RegExp('^' + category + '$', 'i') };
        }
        
        let sortObj = {};
        switch (sort) {
            case 'price_asc': sortObj = { price: 1 }; break;
            case 'price_desc': sortObj = { price: -1 }; break;
            case 'newest': sortObj = { _id: -1 }; break;
            case 'name': sortObj = { name: 1 }; break;
            default: sortObj = {};
        }
        
        const products = await Product.find(filter).sort(sortObj);
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Get Single Product
app.get('/api/products/:id', async (req, res) => {
    try {
        let product;
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
            product = await Product.findById(req.params.id);
        } else {
            const numericId = Number(req.params.id);
            if (!isNaN(numericId)) {
                product = await Product.findOne({ oldId: numericId });
            }
        }
        
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

// Search Products
app.get('/api/search', async (req, res) => {
    try {
        const query = req.query.q || '';
        if (!query.trim()) {
            return res.json([]);
        }
        const products = await Product.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } }
            ]
        });
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Search failed' });
    }
});

// Get Cart
app.get('/api/cart', authenticateToken, async (req, res) => {
    try {
        // Find cart items for user and populate the product details
        const cartItems = await CartItem.find({ user_id: req.user.id }).populate('product_id');
        
        // Map to match the expected format from the previous SQLite implementation
        const formattedCart = cartItems.map(item => {
            // Check if product_id is populated correctly
            const product = item.product_id || {};
            return {
                cart_item_id: item._id,
                quantity: item.quantity,
                size: item.size,
                product_id: product._id,
                name: product.name,
                price: product.price,
                image_url: product.image_url
            };
        });
        
        res.json(formattedCart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch cart' });
    }
});

// Add to Cart
app.post('/api/cart', authenticateToken, async (req, res) => {
    try {
        const { product_id, quantity = 1, size = 'M' } = req.body;
        
        let actualProductId = product_id;
        
        // If the frontend is still sending the old SQLite ID (e.g. 1, 2, 3) 
        // we need to translate it to the new MongoDB ObjectId
        if (typeof product_id === 'number' || !mongoose.Types.ObjectId.isValid(product_id)) {
            const product = await Product.findOne({ oldId: Number(product_id) });
            if (!product) return res.status(404).json({ error: 'Product not found' });
            actualProductId = product._id;
        }

        // Check if item already exists in cart for this user and size
        const existingItem = await CartItem.findOne({
            user_id: req.user.id,
            product_id: actualProductId,
            size: size
        });

        if (existingItem) {
            existingItem.quantity += quantity;
            await existingItem.save();
        } else {
            await CartItem.create({
                user_id: req.user.id,
                product_id: actualProductId,
                quantity: quantity,
                size: size
            });
        }
        
        res.status(201).json({ message: 'Added to cart' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add to cart' });
    }
});

// Remove from Cart
app.delete('/api/cart/:id', authenticateToken, async (req, res) => {
    try {
        await CartItem.findOneAndDelete({ _id: req.params.id, user_id: req.user.id });
        res.json({ message: 'Item removed from cart' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to remove from cart' });
    }
});

// User Profile & Orders (Mock)
app.get('/api/user/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });
        
        // Mock Orders
        const mockOrders = [
            { id: 'ORD-9821', date: '2026-04-12', total: 425.00, status: 'Delivered' },
            { id: 'ORD-1045', date: '2026-04-20', total: 890.00, status: 'Shipped' }
        ];

        res.json({ user, orders: mockOrders });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
