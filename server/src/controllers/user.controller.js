import ErrorResponse from '../utils/errorResponse.util.js';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/user.model.js';
import env from '../constants/env.js';
import { cookieOptions } from '../config/app.config.js'; // Import your cookie settings

const client = new OAuth2Client(env.OAUTH_CLIENT_ID);

const generateToken = (id) => {
  return jwt.sign({ id }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

// --- CONTROLLERS ---

export const requestOtp = async (req, res, next) => {
  const { email } = req.body;
  try {
    const otpValue = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await User.findOneAndUpdate(
      { email },
      { otp: { value: otpValue, expiresAt } },
      { upsert: true, new: true }
    );

    console.log(`OTP for ${email}: ${otpValue}`);
    res.status(200).json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user || user.otp.value !== otp || user.otp.expiresAt < Date.now()) {
      return next(new ErrorResponse("Invalid or expired OTP", 400));
    }

    user.otp = { value: undefined, expiresAt: undefined };
    user.isVerified = true;
    user.lastLogin = Date.now();
    await user.save();

    const token = generateToken(user._id);

    // Set Cookie and send response without token in body
    res.cookie('token', token, cookieOptions)
       .status(200)
       .json({
          success: true,
          user: { id: user._id, email: user.email, name: user.name }
       });
  } catch (error) {
    next(error);
  }
};

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
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0), // Set expiry to the past to delete the cookie
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    });

    res.status(200).json({ 
        success: true, 
        message: "Logged out successfully" 
    });
};
// Get Current User Profile
export const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-otp');
        if (!user) return next(new ErrorResponse("User not found", 404));

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

// Update Profile (Name, etc.)
export const updateProfile = async (req, res, next) => {
    try {
        const { name } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name },
            { new: true, runValidators: true }
        );
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

// Add Address
export const addAddress = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        
        // If adding a default address, set others to false
        if (req.body.isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false);
        }

        user.addresses.push(req.body);
        await user.save();

        res.status(201).json({ success: true, data: user.addresses });
    } catch (error) {
        next(error);
    }
};