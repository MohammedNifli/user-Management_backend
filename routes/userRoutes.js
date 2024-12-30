// routes/userRoutes.js
import express from 'express';
import { authUser, getUserProfile, updateUserProfile, logoutUser, registerUser } from '../controllers/userController.js';
import multer from 'multer';
import path from 'path';
import protect from '../middlewares/authMiddleware.js';
import {upload} from '../middlewares/multer.js'

const router = express.Router();


router.post('/register', upload.single('photo'), registerUser);
router.post('/auth', authUser);
router.post('/logout', logoutUser);
router.get('/profile/:userId', getUserProfile);
router.put('/profile/:Id', upload.single('profileImage'), updateUserProfile);

export  default router;


