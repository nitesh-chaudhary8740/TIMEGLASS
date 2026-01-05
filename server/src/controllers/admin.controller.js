
import bcrypt from 'bcryptjs';
import { generateAccessToken } from '../utils/generatetokens.util.js';
import Product from '../models/product.model.js';
import { uploadToCloudinary } from '../utils/cloudinary.util.js';
import { validators } from '../utils/validatiors.util.js';
import ErrorResponse from '../utils/errorResponse.util.js';
import Admin from '../models/admin.model.js';
import { deleteFromCloudinary } from '../utils/cloudinary.util.js';


export const adminLogin = async (req, res) => {
    console.log("req received")
        const { email, password } = req.body;
        // 1. Basic Validation
        if (!validators.email(email) || !password) {
            // return res.status(400).json({ message: "Invalid Input Format" });
           throw new ErrorResponse("Invalid input format",400)
        }
        
        // 2. Find Admin
        const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
        if (!admin) {
            // return res.status(401).json({ message: "Authentication Failed" });
            throw new ErrorResponse("Authentication Failed",401)
        }
        
        // 3. Verify Password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            // return res.status(401).json({ message: "Authentication Failed" });
             throw new ErrorResponse("Authentication Failed",401)
            }
            
            // 4. Generate Token & Respond
            const token = await generateAccessToken(admin._id);
            
            // Set cookie options
            console.log(admin)
    const cookieOptions = {
        httpOnly: true, // Prevents JS access (XSS protection)
        secure: process.env.NODE_ENV === 'production', // Only over HTTPS in prod
        sameSite: 'Strict', // CSRF protection
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    };

    res.cookie('adminToken', token, cookieOptions)
    .status(200)
    .json({
        message:"login successfully",
        success: true,
        admin: { username: admin.username, role: admin.role }
    });

 
};
export const adminLogout = (req, res) => {
    try {
      res.clearCookie('adminToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict'
    });

    return res.status(200).json({
        success: true,
        message: "Session cleared successfully"
    });
    } catch (error) {
        throw new ErrorResponse("Logout failed", 500);
    }
};
export const adminProfile = (req, res) => {
    // If it reached here, the middleware already verified the token
    return res.status(200).json({ loginState: true });
};



/**
 * @desc    Create new Product with multiple images
 * @route   POST /api/admin/products/add
 * @access  Private/Admin
 */
export const addProduct = async (req, res, next) => {
    try {
        const {
            name, price, description, tier, stock,
            warrantyValue, warrantyUnit, returnDays,
            status, defaultImageIndex,shippingType,shippingCost
        } = req.body;

        const files = req.files;

        if (!files || files.length === 0) {
            return res.status(400).json({ message: "At least one image is required" });
        }

        // 1. Upload images to Cloudinary
        const uploadPromises = files.map((file) => uploadToCloudinary(file.buffer, name));
        const cloudinaryResults = await Promise.all(uploadPromises);

        // 2. Format the images array
        const imagesData = cloudinaryResults.map((result) => ({
            url: result.url,
            public_id: result.public_id,
        }));

        // 3. Select the default image object based on the index
        // We use imagesData because it contains the results of our upload
        const index = parseInt(defaultImageIndex) || 0;
        const selectedDefault = imagesData[index] || imagesData[0];

        // 4. Create and Save Product
        const product = new Product({
            name,
            price: Number(price),
            description,
            tier,
            stock: Number(stock),
            returnDays: Number(returnDays),
            status: status || 'Draft',
            warranty: {
                value: Number(warrantyValue),
                unit: warrantyUnit || 'Years',
            },
            
            images: imagesData,
            // Storing the full object as you suggested
            defaultImage: {
                url: selectedDefault.url,
                public_id: selectedDefault.public_id
            },
            shipping:{
                type:shippingType,
                cost:Number(shippingCost)||0
            }
        });

        const savedProduct = await product.save();

        res.status(201).json({
            success: true,
            message: "Timepiece successfully added",
            data: savedProduct,
        });

    } catch (error) {
        console.error("Add Product Error:", error);
        next(error); 
    }
};
export const getProducts = async (req, res) => {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, products });
};
export const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Timepiece not found" });
        }

        // 1. Extract all public_ids (from the gallery AND the default image)
        const publicIds = product.images.map(img => img.public_id);
        
        // 2. Delete images from Cloudinary in parallel
        if (publicIds.length > 0) {
            await Promise.all(publicIds.map(pubId => deleteFromCloudinary(pubId)));
        }

        // 3. Remove from Database
        await Product.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Timepiece and associated media removed from vault"
        });
    } catch (error) {
        next(error);
    }
};
export const getProductDetails = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        // console.log(product)
        if (!product) {
            return res.status(404).json({ success: false, message: "Timepiece not found" });
        }

        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        next(error);
    }
};

export const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log(req.body)
        // Map frontend fields to match your Schema structure
        const updateData = {
            ...req.body,
            price: Number(req.body.price),
            stock: Number(req.body.stock),
            shipping: {
                type: req.body.shippingType,
                cost: req.body.shippingType === 'Paid' ? Number(req.body.shippingCost) : 0
            },
            warranty: {
                value: Number(req.body.warrantyValue),
                unit: req.body.warrantyUnit
            }
        };

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Collection updated successfully",
            product: updatedProduct
        });
    } catch (error) {
        next(error);
    }
};
export const toggleProductStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'Published' or 'Draft'

        const product = await Product.findByIdAndUpdate(
            id, 
            { status }, 
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: `Product is now ${status}`,
            product
        });
    } catch (error) {
        next(error);
    }
};