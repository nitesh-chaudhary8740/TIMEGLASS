
import bcrypt from 'bcryptjs';
import { generateAccessToken } from '../utils/generatetokens.util.js';
import Admin from '../models/model.admin.js';
import { validators } from '../utils/validatiors.util.js';
import ErrorResponse from '../utils/errorResponse.util.js';


export const adminLogin = async (req, res) => {
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
export const checkAdminLoginState = (req, res) => {
    // If it reached here, the middleware already verified the token
    return res.status(200).json({ loginState: true });
};