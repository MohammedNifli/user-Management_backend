// import jwt from 'jsonwebtoken';

// const generateToken = (res, userId) => {
//     try {
//         const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
//             expiresIn: '30d'
//         });

//         // Set the JWT as a cookie in the response
//         res.cookie('jwt', token, {
//             httpOnly: true, // Ensures the cookie is only accessible through HTTP(S) requests
//             secure: process.env.NODE_ENV !== 'development', // Only secure in non-development environments
//             sameSite: 'strict', // Helps prevent CSRF attacks
//             maxAge: 30 * 24 * 60 * 60 * 1000 // Cookie expiration time (30 days in milliseconds)
//         });

//         // Optionally, return the generated token
//         return token;
//     } catch (error) {
//         // Handle token generation errors
//         console.error('Error generating token:', error);
//         // Optionally, rethrow the error to be caught and handled elsewhere
//         throw error;
//     }
// };

// export default generateToken;



// generateToken.js

import jwt from 'jsonwebtoken';

// Function to generate JWT token
const generateToken = (res, userId, adminId = null) => {
    try {
        let id = userId;
        if (adminId) {
            id = adminId;
        }

        const token = jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });

        // Set the JWT as a cookie in the response
        res.cookie('jwt', token, {
            httpOnly: true, // Ensures the cookie is only accessible through HTTP(S) requests
            secure: process.env.NODE_ENV !== 'development', // Only secure in non-development environments
            sameSite: 'strict', // Helps prevent CSRF attacks
            maxAge: 30 * 24 * 60 * 60 * 1000 // Cookie expiration time (30 days in milliseconds)
        });

        // Optionally, return the generated token
        return token;
    } catch (error) {
        // Handle token generation errors
        console.error('Error generating token:', error);
        // Optionally, rethrow the error to be caught and handled elsewhere
        throw error;
    }
};

export default generateToken;
