import jwt from 'jsonwebtoken';
import Admin from '../models/adminModel.js'; // Adjust path to your Admin model file

const verifyAdminToken = async (req, res, next) => {
    let token;

    // Extract token from cookies or headers as per your application's setup
    token = req.cookies.jwt || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find admin by ID from decoded token
        const admin = await Admin.findById(decoded.id).select('-password');

        if (!admin) {
            return res.status(401).json({ message: 'Not authorized, admin not found' });
        }

        // Set admin data in request object for further processing
        req.admin = admin;

        // Proceed to the next middleware
        next();
    } catch (error) {
        console.error('Token verification error:', error.message);
        return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
};

export default verifyAdminToken;
