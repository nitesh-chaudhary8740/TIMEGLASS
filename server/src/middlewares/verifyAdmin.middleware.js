import jwt from 'jsonwebtoken';
import ErrorResponse from '../utils/errorResponse.util.js';

export const verifyAdmin = (req, res, next) => {
    // Look for token in cookies instead of headers
    const token = req.cookies.adminToken;

    if (!token) {
        // return res.status(401).json({ message: "Access Denied: Please Login" });
        throw new ErrorResponse("Access Denied: Please Login",401)
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.adminId = decoded.id;
        next();
    } catch (error) {
      
        // return res.status(403).json({ message: "Session Expired, please login again" });
        throw new ErrorResponse("Session Expired, please login again",403);
        
    }
};