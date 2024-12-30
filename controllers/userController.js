import asynHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import cloudinary from '../utils/cloudinary.js'
import path from 'path';




//multer
import multer from 'multer';
import express from 'express'
const router = express.Router();
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'uploads/'); // Adjust the destination folder as needed
//     },
//     filename: function (req, file, cb) {
//       cb(null, Date.now() + '-' + file.originalname); // Generate unique filename
//     },
//   });
  
//   const upload = multer({ storage });
 


const authUser = asynHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401).json({ message: 'Invalid email or password' });
    return;
  }

  // User and password match
  generateToken(res, user._id);
  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
  });
});




// const registerUser = async (req, res) => {
//   try {
//       // Check if all required fields are present
//       const { name, email, password } = req.body;
//       if (!name || !email || !password) {
//           return res.status(400).json({ error: 'Name, email, and password are required' });
//       }

//       // Check if user with the same email already exists
//       const userExists = await User.findOne({ email });
//       if (userExists) {
//           return res.status(400).json({ error: 'User already exists' });
//       }

//       // Upload image to Cloudinary if exists
//       let profileImage = null;
//       if (req.file) {
//           const result = await cloudinary.v2.uploader.upload(req.file.path, {
//               folder: 'profile_images', // Optional folder for organization
//               resource_type: 'auto' // Automatically determine the type of file
//           });
//           profileImage = result.secure_url;
//       }

//       // Create user with uploaded file data
//       const user = await User.create({
//           name,
//           email,
//           password,
//           profileImage, // Save Cloudinary URL to user profileImage field
//       });

//       // Generate token and send response
//       res.status(201).json({
//           _id: user._id,
//           name: user.name,
//           email: user.email,
//           profileImage: user.profileImage,
//       });
//   } catch (error) {
//       res.status(500).json({ error: error.message });
//   }
// };




const registerUser = asynHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if all required fields are present
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  // Check if user with the same email already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ error: 'User already exists' });
  }

  // Upload image to Cloudinary if it exists
  let profileImage = null;
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'profile_images', // Optional folder for organization
      resource_type: 'auto', // Automatically determine the type of file
    });
    profileImage = result.secure_url;
  }

  // Create user with uploaded file data
  const user = await User.create({
    name,
    email,
    password,
    profileImage,
  });

  // Generate token and send response
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    profileImage: user.profileImage,
  });
});
  
  

const logoutUser = asynHandler(async (req, res) => {
  console.log("helllllll")
  res.cookie('jwt', '', {
      httpOnly: true,
      expires: new Date(0),
  });
  res.status(200).json({ message: 'User logged out' });
});



const getUserProfile = asynHandler(async (req, res) => {
    const userDi=req.params.userId;
    console.log("prr",userDi)
    const user = await User.findById(userDi).select('-password');
    console.log("kitty",user)
    if (user) {
      res.status(200).json({success:true,user}); // Directly returning the user object
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  });
  
  

   
  const updateUserProfile = asynHandler(async (req, res) => {
    try {
        const { Id } = req.params;
        const user = await User.findById(Id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { email, name, password } = req.body;
        let profileImage = user.profileImage;

        if (req.file) {
          console.log(process.env.CLOUD_API_KEY);
          console.log(cloudinary.config());
            const result = await cloudinary.uploader.upload(req.file.path);
            console.log(result)
            profileImage = result.secure_url; // Use the secure URL from Cloudinary
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password = password; // Assume the user model handles hashing
        user.profileImage = profileImage;

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            profileImage: updatedUser.profileImage,
        });

    } catch (error) {
        console.error('Error updating profile:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

 

export { authUser, registerUser, logoutUser, getUserProfile, updateUserProfile };
