import bcrypt from "bcryptjs";
import { generateAccessToken } from "../utils/generatetokens.util.js";
import Product from "../models/product.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.util.js";
import { validators } from "../utils/validatiors.util.js";
import ErrorResponse from "../utils/errorResponse.util.js";
import Admin from "../models/admin.model.js";
import { deleteFromCloudinary } from "../utils/cloudinary.util.js";
import Transaction from "../models/transaction.model.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";

export const adminLogin = async (req, res) => {

  const { email, password } = req.body;
  // 1. Basic Validation
  if (!validators.email(email) || !password) {
    // return res.status(400).json({ message: "Invalid Input Format" });
    throw new ErrorResponse("Invalid input format", 400);
  }

  // 2. Find Admin
  const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
  if (!admin) {
    // return res.status(401).json({ message: "Authentication Failed" });
    throw new ErrorResponse("Authentication Failed", 401);
  }

  // 3. Verify Password
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    // return res.status(401).json({ message: "Authentication Failed" });
    throw new ErrorResponse("Authentication Failed", 401);
  }

  // 4. Generate Token & Respond
  const token = await generateAccessToken(admin._id);

  // Set cookie options
 
  const cookieOptions = {
    httpOnly: true, // Prevents JS access (XSS protection)
    secure: process.env.NODE_ENV === "production", // Only over HTTPS in prod
    sameSite: "Strict", // CSRF protection
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  };

  res
    .cookie("adminToken", token, cookieOptions)
    .status(200)
    .json({
      message: "login successfully",
      success: true,
      admin: { username: admin.username, role: admin.role },
    });
};
export const adminLogout = (req, res) => {
  try {
    res.clearCookie("adminToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    return res.status(200).json({
      success: true,
      message: "Session cleared successfully",
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
  console.log("here")
  try {
    const {
      name, price, description, tier, gender, movement,
      material, color, caseSize, stock, warrantyValue,
      warrantyUnit, returnDays, status, shippingType, shippingCost,defaultImageIndex
    } = req.body;

    const files = req.files;
  
    if (!files || files.length === 0) return res.status(400).json({ message: "Images required" });

    const cloudinaryResults = await Promise.all(files.map(file => uploadToCloudinary(file.buffer, name)));
    const imagesData = cloudinaryResults.map(r => ({ url: r.url, public_id: r.public_id }));
    
    const product = new Product({
      name,
      description,
      price: Number(price),
      tier,
      gender,
      movement,
      material,
      color,
      caseSize: Number(caseSize),
      stock: Number(stock),
      status: status || "Draft",
      returnDays: Number(returnDays),
      warranty: { value: Number(warrantyValue), unit: warrantyUnit },
      shipping: { type: shippingType, cost: Number(shippingCost) || 0 },
      images: imagesData,
      defaultImage: imagesData[defaultImageIndex], // Simplified default for now
    });
    await product.save();
    res.status(201).json({ success: true, message: "Timepiece added" });
  } catch (error) {
    console.log(error)
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
      return res
        .status(404)
        .json({ success: false, message: "Timepiece not found" });
    }

    // 1. Extract all public_ids (from the gallery AND the default image)
    const publicIds = product.images.map((img) => img.public_id);

    // 2. Delete images from Cloudinary in parallel
    if (publicIds.length > 0) {
      await Promise.all(publicIds.map((pubId) => deleteFromCloudinary(pubId)));
    }

    // 3. Remove from Database
    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Timepiece and associated media removed from vault",
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
      return res
        .status(404)
        .json({ success: false, message: "Timepiece not found" });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Explicitly reconstruct objects to avoid overwriting the whole sub-doc with missing fields
    const updateData = {
      ...req.body,
      price: req.body.price ? Number(req.body.price) : undefined,
      stock: req.body.stock ? Number(req.body.stock) : undefined,
      caseSize: req.body.caseSize ? Number(req.body.caseSize) : undefined,
    };

    if (req.body.warrantyValue || req.body.warrantyUnit) {
      updateData.warranty = {
        value: Number(req.body.warrantyValue),
        unit: req.body.warrantyUnit
      };
    }

    if (req.body.shippingType) {
      updateData.shipping = {
        type: req.body.shippingType,
        cost: req.body.shippingType === "Paid" ? Number(req.body.shippingCost) : 0
      };
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, { $set: updateData }, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, product: updatedProduct });
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
      product,
    });
  } catch (error) {
    next(error);
  }
};




export const getDashboardStats = async (req, res) => {
  try {
    // 1. Calculate Total Revenue from Completed Transactions
    const revenueData = await Transaction.aggregate([
      { $match: { paymentStatus: 'Completed' } },
      { $group: { _id: null, totalRevenue: { $sum: "$amount" } } }
    ]);

    // 2. Count Total Orders
    const totalOrders = await Order.countDocuments();

    // 3. Count Registered Users
    const totalUsers = await User.countDocuments();

    // 4. Get Recent Disputes (assuming you have a Dispute model or field)
    // const recentDisputes = await Dispute.find().sort({ createdAt: -1 }).limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalRevenue: revenueData.length > 0 ? revenueData[0].totalRevenue : 0,
        totalOrders,
        activeUsers: totalUsers,
        growth: "+12.5%" // You can hardcode or calculate MoM growth
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard data", error });
  }
};
