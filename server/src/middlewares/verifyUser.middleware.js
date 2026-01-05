import jwt from 'jsonwebtoken';
import env from '../constants/env.js';
import ErrorResponse from '../utils/errorResponse.util.js';

export const verifyUser = (req, res, next) => {
    // Accessing token from cookies based on your config
    const token = req.cookies.token; 

    if (!token) {
        return next(new ErrorResponse("Authentication required. Please login.", 401));
    }

    try {
        const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
        req.user = decoded; // Contains id and role
        next();
    } catch (error) {
        return next(new ErrorResponse("Session expired or invalid token.", 403));
    }
};