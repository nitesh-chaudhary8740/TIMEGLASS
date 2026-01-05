import dotenv from 'dotenv';
import env from '../constants/env.js';
dotenv.config();
//src/config/app.config.js
// 1. CORS Options (Crucial for Cookies)
export const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:5174','http://127.0.0.1:5173'], // Add all frontend URLs
    credentials: true, // Required for cookies to pass through
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

// 2. Cookie Options
export const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
};

// 3. Rate Limiter Options
export const limiterOptions = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 100 requests per window
    message: "Too many requests from this IP, please try again after 15 minutes"
};
export const cloudinaryOptions= {

  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
}
// 4. Morgan Format
export const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';