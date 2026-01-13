/* eslint-disable no-unused-vars */
import dotenv from 'dotenv';
import env from '../constants/env.js';
dotenv.config();

// 1. CORS Options (Crucial for Cookies)
export const corsOptions = {
    // Ensure no trailing slashes in URLs
    origin: [
        'http://localhost:5173', 
        'http://localhost:5174',
        'http://127.0.0.1:5173',
        "https://timeglass.vercel.app",
        "https://timeglass-admin.vercel.app"
    ], 
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

// 2. Cookie Options
export const cookieOptions = {
    httpOnly: true,
    // Production (Render/Vercel) requires secure: true and sameSite: 'none'
    // This allows the browser to send cookies from Vercel to the Render API
    secure: true, 
    partitioned: true,
    sameSite: 'none', 
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
};

// 3. Rate Limiter Options
export const limiterOptions = {
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    standardHeaders: true, 
    legacyHeaders: false,
    // This prevents the 'X-Forwarded-For' error on Render
    validate: { xForwardedForHeader: false }, 
    message: "Too many requests from this IP, please try again after 15 minutes"
};

export const cloudinaryOptions = {
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
};

export const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';