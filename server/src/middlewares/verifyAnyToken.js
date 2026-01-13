import jwt from 'jsonwebtoken';
import env from '../constants/env.js';
import ErrorResponse from '../utils/errorResponse.util.js';

export const verifyAnyToken = (req, res, next) => {


    // Pick the cookie that matches the App
    const token = req.cookies.adminToken || req.cookies.token;

    if (!token) {
        return next(new ErrorResponse(`Access denied. Please log in as ${token ? 'Admin' : 'User'}.`, 401));
    }

    try {
        const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
        
        // Inject identity info
        req.user = {
            id: decoded.id || decoded._id, // Support both formats
            role: req.cookies.adminToken ? 'admin' : 'user' 
        };
        
        next();
    } catch (error) {
        return next(new ErrorResponse("Session expired. Please log in again.", 403));
    }
};