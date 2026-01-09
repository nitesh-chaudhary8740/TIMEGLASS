import jwt from 'jsonwebtoken';
import env from '../constants/env.js';
import ErrorResponse from '../utils/errorResponse.util.js';

export const verifyAnyToken = (req, res, next) => {
    // Determine source: localhost:5174 is Admin, 5173 is User
    const origin = req.headers.origin || req.headers.referer || "";
    const isAdminApp = origin.includes('5174');

    // Pick the cookie that matches the App
    const token = isAdminApp ? req.cookies.adminToken : req.cookies.token;

    if (!token) {
        return next(new ErrorResponse(`Access denied. Please log in as ${isAdminApp ? 'Admin' : 'User'}.`, 401));
    }

    try {
        const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
        
        // Inject identity info
        req.user = {
            id: decoded.id || decoded._id, // Support both formats
            role: isAdminApp ? 'admin' : 'user' 
        };
        
        next();
    } catch (error) {
        return next(new ErrorResponse("Session expired. Please log in again.", 403));
    }
};