import ErrorResponse from '../utils/errorResponse.util.js';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/user.model.js';
import env from '../constants/env.js';
import { cookieOptions } from '../config/app.config.js'; // Import your cookie settings
import asyncHandler from '../utils/asynchandler.util.js';
import Product from '../models/product.model.js';
import crypto from 'crypto';
import sendOTP from '../utils/sendOtp.util.js';
import { validators } from '../utils/validatiors.util.js';

const client = new OAuth2Client(env.OAUTH_CLIENT_ID);

const generateToken = (id) => {
  return jwt.sign({ id }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

// --- CONTROLLERS ---



// @desc    Request OTP for Login/Signup
// @route   POST /api/users/request-otp
export const requestOtp = asyncHandler(async (req, res) => {
  const { email } = req.body.email;
console.log(req.body)
  if (!email) {
    res.status(400);
    throw new Error('Please provide an email address');
  }

  // 1. Securely generate a 6-digit OTP using crypto
  const otpCode = crypto.randomInt(100000, 999999).toString();
 
  // 2. Set expiry for 10 minutes from now
  const expiryTime = new Date(Date.now() + 10 * 60 * 1000);

  // 3. Find user or create a new one if they don't exist
  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({ email });
  }

  // 4. Update the user with the new OTP object
  user.otp = {
    value: otpCode,
    expiresAt: expiryTime
  };
  await user.save({validateBeforeSave:false});
console.log(email)
  // 5. Send the email (handled by SendGrid utility)
  await sendOTP(email, otpCode);

  res.status(200).json({ 
    success: true, 
    message: 'Verification code sent to your email' 
  });
});


// @desc    Verify OTP and Login
// @route   POST /api/users/verify-otp
export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
console.log(req.body)
  // 1. Find user
  let user = await User.findOne({ email });

  // 2. Security Check: Does the user exist and have an active OTP?
  if (!user || !user.otp || !user.otp.value) {
    res.status(401);
    throw new Error('No active verification request found');
  }

  // 3. Expiry Check
  if (new Date() > user.otp.expiresAt) {
    user.otp = undefined; 
    await user.save({validateBeforeSave:false});
    res.status(401);
    throw new Error('Verification code has expired');
  }

  // 4. Match Check
  if (user.otp.value !== otp) {
    res.status(401);
    throw new Error('Invalid verification code');
  }

  // 5. SUCCESS: Clear OTP and Update Login Stats
  user.otp = undefined;
  user.isVerified = true; // Mark as verified since they passed OTP
  user.lastLogin = Date.now();
  await user.save({validateBeforeSave:false});

  // 6. Generate JWT
  const appToken = generateToken(user._id);

  // 7. Standardized Response (Cookie + Body without token)
  res.cookie('token', appToken, cookieOptions) // Matches googleAuth style
    .status(200)
    .json({
      success: true,
      user: { 
        id: user._id, 
        email: user.email, 
        name: user.name || 'Valued Guest' // Fallback if name isn't set yet
      }
    });
});

export const googleAuth = async (req, res, next) => {
  const { token } = req.body;
  
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: env.OAUTH_CLIENT_ID,
    });

    const { email, name, picture } = ticket.getPayload();
    let user = await User.findOne({ email });

    if (!user) {
      // This will trigger the pre-save hook in user.model.js
      user = await User.create({
        email,
        name,
        isVerified: true,
      });
    } else {
      user.lastLogin = Date.now();
      await user.save();
    }

    const appToken = generateToken(user._id);

    // Set Cookie and send response without token in body
    res.cookie('token', appToken, cookieOptions)
       .status(200)
       .json({
          success: true,
          user: { id: user._id, email: user.email, name: user.name }
       });
  } catch (error) {
    next(error);
  }
};
/**
 * @desc    Logout User / Clear Cookie
 * @route   POST /user/auth/logout
 */
export const logout = (req, res) => {
    // We clear the cookie by setting it to an empty string and expiring it
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0), 
        // CRITICAL: These must match the settings used during login
        secure: true,      
        sameSite: 'none',  
    });

    res.status(200).json({ 
        success: true, 
        message: "Logged out successfully" 
    });
};
// Get Current User Profile
export const getProfile = asyncHandler(async (req, res, next) => {
    try {
    
        const user = await User.findById(req.user.id).select('-otp');
        if (!user) return next(new ErrorResponse("User not found", 404));

        res.status(200).json({ success: true, data: user });
        // console.log("fetched")
    } catch (error) {
        next(error);
    }
})

// Update Profile (Name, etc.)
// controllers/userController.js
export const updateProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // 1. Handle Name Update
    if (req.body.name) {
        let sanitizedName = validators.noExtraSpaces(req.body.name);
        sanitizedName = validators.titleCaseName(sanitizedName);

        if (!validators.name(sanitizedName)) {
            res.status(400);
            throw new Error('Invalid name format (letters only, 2-50 characters).');
        }
        user.name = sanitizedName;
    }

    // 2. Handle Phone Update (NEW)
    if (req.body.phone) {
        // Simple regex check: Starts with 6-9 and is 10 digits total
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(req.body.phone)) {
            res.status(400);
            throw new Error('Invalid mobile number. Please provide a 10-digit Indian number.');
        }
        user.phone = req.body.phone;
    }

    const updatedUser = await user.save();

    res.status(200).json({
        success: true,
        message: "Profile updated",
        user: {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone, // Include in response
            role: updatedUser.role,
            createdAt: updatedUser.createdAt
        }
    });
});
