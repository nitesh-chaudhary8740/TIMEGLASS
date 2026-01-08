import jwt from 'jsonwebtoken';
import env from '../constants/env.js';
import ErrorResponse from '../utils/errorResponse.util.js';

export const verifyAnyToken = (req, res, next) => {
    // Check both potential cookie names
    const token = req.cookies.token || req.cookies.adminToken;
    console.log("token",token)

    if (!token) {
        return next(new ErrorResponse("Authentication required. Access denied.", 401));
    }

    try {
        const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
        
        // Attach the decoded data (id, role, etc.) to the request
        // This is crucial so your controller knows WHO is talking
        req.user = decoded; 
        
        next();
    } catch (error) {
        return next(new ErrorResponse("Invalid or expired session.", 403));
    }
};