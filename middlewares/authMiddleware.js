import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js'; // Ensure correct path to UserModel file

const protect = asyncHandler(async (req, res, next) => {
    let token;
    // Extract token from cookies
    token = req.cookies.jwt;

    if (token) {
        try {
            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // Find the user associated with the token and exclude the password field
            req.user = await User.findById(decoded.userId).select('-password');

            if (!req.user) {
                res.status(401);
                throw new Error('Not authorized, user not found');
            }

            // Proceed to the next middleware
            next();
        } catch (error) {
            // Handle token verification errors
            console.error('Token verification error:', error.message);
            res.status(401);
            throw new Error('Not authorized, invalid token');
        }
    } else {
        // No token provided
        res.status(401);
        throw new Error('Not authorized, no token provided');
    }
});

export default protect;
