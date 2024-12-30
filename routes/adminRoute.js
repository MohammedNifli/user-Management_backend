import { Router } from 'express';
import { registerAdmin, adminAuth, addUser, editUser, deleteUser, adminLogout, fetchData, specificUser } from "../controllers/adminController.js";
import { upload } from '../middlewares/multer.js';
import verifyAdminToken from '../middlewares/adminAuth.js'; // Import the middleware

const adminRoute = Router();

// Public admin routes
adminRoute.post('/adminRegister', registerAdmin);
adminRoute.post('/adminLogin', adminAuth);
adminRoute.post('/logout', adminLogout);

// Protected admin routes
 // Apply middleware to all routes below

adminRoute.post('/addUser', upload.single('image'), addUser);
adminRoute.put('/editUser/:userId', upload.single('image'), editUser);
adminRoute.delete('/deleteUser/:userId', deleteUser);

adminRoute.get('/fetch', fetchData);
adminRoute.get('/find-user/:userId', specificUser);

export default adminRoute;
