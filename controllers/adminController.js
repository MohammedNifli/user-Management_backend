// controllers/adminController.js
import Admin from "../models/adminModel.js";
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import generateToken from "../utils/generateToken.js";
import cloudinary from "../utils/cloudinary.js";
// register admin
export const registerAdmin = asyncHandler(async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Every field is required" });
        }

        const existUser = await Admin.findOne({ email });
        if (existUser) {
            return res.status(400).json({ message: "Admin already registered" });
        }
        const salt=await bcrypt.genSalt(10);
        const  hashedPassword=await bcrypt.hash(password,salt)

        const admin = new Admin({
            name,
            email,
            password:hashedPassword,
        });
        await admin.save();
        res.status(200).json(admin);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// admin authorization
export const adminAuth = async (req, res) => {
    try {
        const { email, password } = req.body;
        

        // Validate email and password presence
        if (!password || !email) {
            return res.status(400).json({ message: "Password and email fields are required" });
        }

        // Find admin by email
        const findAdmin = await Admin.findOne({ email });
        console.log("Admin",findAdmin)
        if (!findAdmin) {
            return res.status(400).json({ message: 'Admin not found' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, findAdmin.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Password does not match" });
        }

        // Generate and set admin token using generateToken function
        const token = generateToken(res, null, findAdmin._id);

        // Respond with success message and token if needed
        res.status(200).json({ message: "Successfully logged in", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }


};

//admin adding user


export const addUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("Hello am nifli ap")
    console.log(req.file)
    console.log(req.body)
   

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password fields are required" });
    }

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("hashed",hashedPassword)

    let profileImage1 = ''; // Initialize outside the if block
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      profileImage1 = result.secure_url;
    }

    console.log("prooo",profileImage1)

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImage:profileImage1
    });
    console.log("newUser",newUser)

    res.status(200).json({ newUser });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};



//edit user

export const editUser = async (req, res) => {
    try {
      const { userId } = req.params;
      const { name, email, password } = req.body;
  
      console.log("req.body", req.body);
      console.log("req.file", req.file);
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
  
      let profileImage = user.image;
  
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        profileImage = result.secure_url;
      }
  
      if (name) user.name = name;
      if (email) user.email = email;
      user.profileImage = profileImage;
  
      if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }
  
      await user.save();
      res.status(200).json({ message: 'Updated successfully' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  
//delete user
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findByIdAndDelete(userId);
        console.log("deleting user",user)
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: `User '${user.name}' deleted successfully` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};


//Admin Logout

export const adminLogout = async (req, res) => {
    try {
        // Clear the JWT cookie
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'Strict' });

        // Respond with a success message
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



//fetching all user data

export const fetchData=async(req,res)=>{
    try{
        const dataFetching=await User.find({});
      
        if(!dataFetching){
            return res.status(400).json({message:"something went wrong"})
        }
        res.status(200).json(dataFetching)

    }catch(error){
        console.log(error)
        res.status(500).json({message:"Internal server error"})
    }
}


export const specificUser=async(req,res)=>{
    try{

        const {userId}=req.params;
       
        const user=await User.findById(userId);
        
        if(!user){
            res.status(400).json({message:"user is not found"})
        }
        res.status(200).json({user})


        
    }catch(error){
        console.log(error)
        res.status(500).json("Internal server error");
    }
}